// Convertit la réponse de PageSpeed Insights au format utilisé par le rapport.
import { CATEGORY_LABELS, formatDuration } from "@/lib/scoring";
import type {
  AuditResult,
  CategoryId,
  CategoryScore,
  FullPageImage,
  Metric,
  MetricId,
  Recommendation,
  Strategy,
} from "@/types/audit";

type PsiAudit = {
  title?: string;
  description?: string;
  score?: number | null;
  scoreDisplayMode?: string;
  numericValue?: number;
  displayValue?: string;
  metricSavings?: Record<string, number>;
  details?: { data?: string };
};

type PsiCategory = {
  score?: number | null;
  auditRefs?: { id: string; weight?: number; group?: string }[];
};

export type PsiResponse = {
  analysisUTCTimestamp?: string;
  loadingExperience?: {
    metrics?: { INTERACTION_TO_NEXT_PAINT?: { percentile?: number } };
  };
  lighthouseResult?: {
    finalDisplayedUrl?: string;
    fullPageScreenshot?: { screenshot?: { data?: string; width?: number; height?: number } };
    runtimeError?: { code?: string };
    audits?: Record<string, PsiAudit>;
    categories?: Partial<Record<CategoryId, PsiCategory>>;
  };
};

const CATEGORY_IDS = Object.keys(CATEGORY_LABELS) as CategoryId[];

const LAB_METRICS: [MetricId, string][] = [
  ["lcp", "largest-contentful-paint"],
  ["cls", "cumulative-layout-shift"],
  ["tbt", "total-blocking-time"],
  ["fcp", "first-contentful-paint"],
];

// Les métriques ont déjà leur section : elles ne sont pas des recommandations.
const IGNORED_GROUPS = new Set(["metrics", "hidden"]);
const IGNORED_MODES = new Set(["notApplicable", "manual", "informative", "error"]);
const PASSING_SCORE = 0.9;
const SAVINGS_PATTERN = /^Économies estimées\s*:\s*(.+)$/;

function parseMetrics(data: PsiResponse): Metric[] {
  const audits = data.lighthouseResult?.audits ?? {};
  const metrics: Metric[] = [];

  for (const [id, auditId] of LAB_METRICS) {
    const value = audits[auditId]?.numericValue;
    if (value !== undefined) metrics.push({ id, value, source: "lab" });
  }

  // L'INP n'existe que dans les données réelles de Chrome : absent pour les sites peu visités.
  const inp = data.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile;
  if (inp !== undefined) metrics.splice(2, 0, { id: "inp", value: inp, source: "field" });

  return metrics;
}

function parseRecommendation(
  id: string,
  audit: PsiAudit,
  category: CategoryId,
  weight: number,
): Recommendation {
  const savings = Math.max(0, ...Object.values(audit.metricSavings ?? {}));
  const savingsMs = savings > 0 ? savings : undefined;
  const otherSavings = audit.displayValue?.match(SAVINGS_PATTERN)?.[1];
  const hasOtherSavings = otherSavings !== undefined && !/^0\s/.test(otherSavings);

  return {
    id,
    title: audit.title ?? id,
    description: audit.description ?? "",
    category,
    savingsMs,
    savingsLabel: savingsMs ? formatDuration(savingsMs) : hasOtherSavings ? otherSavings : undefined,
    weight,
  };
}

function parseRecommendations(data: PsiResponse): Recommendation[] {
  const audits = data.lighthouseResult?.audits ?? {};
  const categories = data.lighthouseResult?.categories ?? {};
  const seen = new Set<string>();
  const recommendations: Recommendation[] = [];

  for (const category of CATEGORY_IDS) {
    for (const { id, weight = 0, group } of categories[category]?.auditRefs ?? []) {
      const audit = audits[id];
      if (
        !audit ||
        seen.has(id) ||
        IGNORED_GROUPS.has(group ?? "") ||
        IGNORED_MODES.has(audit.scoreDisplayMode ?? "") ||
        audit.score === null ||
        audit.score === undefined ||
        audit.score >= PASSING_SCORE
      ) {
        continue;
      }
      seen.add(id);
      recommendations.push(parseRecommendation(id, audit, category, weight));
    }
  }

  return recommendations;
}

function parseFullPage(data: PsiResponse): FullPageImage | undefined {
  const image = data.lighthouseResult?.fullPageScreenshot?.screenshot;
  return image?.data && image.width && image.height
    ? { src: image.data, width: image.width, height: image.height }
    : undefined;
}

export function parseReport(data: PsiResponse, url: string, strategy: Strategy): AuditResult {
  const result = data.lighthouseResult;

  const scores: CategoryScore[] = CATEGORY_IDS.flatMap((id) => {
    const score = result?.categories?.[id]?.score;
    return typeof score === "number"
      ? [{ id, label: CATEGORY_LABELS[id], score: Math.round(score * 100) }]
      : [];
  });

  return {
    url: result?.finalDisplayedUrl ?? url,
    strategy,
    fetchedAt: data.analysisUTCTimestamp ?? new Date().toISOString(),
    scores,
    metrics: parseMetrics(data),
    recommendations: parseRecommendations(data),
    screenshot: result?.audits?.["final-screenshot"]?.details?.data,
    fullPage: parseFullPage(data),
  };
}
