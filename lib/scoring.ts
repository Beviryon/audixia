// Seuils, libellés et tri : logique d'affichage indépendante de la source des données.
import type { CategoryId, Metric, MetricId, Recommendation } from "@/types/audit";

export type Tone = "good" | "average" | "poor";

export const SCORE_LABELS: Record<Tone, string> = {
  good: "Bon",
  average: "À améliorer",
  poor: "Faible",
};

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  performance: "Performance",
  accessibility: "Accessibilité",
  "best-practices": "Bonnes pratiques",
  seo: "SEO",
};

export function getScoreTone(score: number): Tone {
  if (score >= 90) return "good";
  if (score >= 50) return "average";
  return "poor";
}

// Seuils publiés par Google : [limite « bon », limite « à améliorer »].
const METRIC_THRESHOLDS: Record<MetricId, [number, number]> = {
  lcp: [2500, 4000],
  cls: [0.1, 0.25],
  inp: [200, 500],
  tbt: [200, 600],
  fcp: [1800, 3000],
};

export const METRIC_INFO: Record<MetricId, { name: string; description: string }> = {
  lcp: { name: "LCP", description: "Affichage du contenu principal" },
  cls: { name: "CLS", description: "Stabilité visuelle de la page" },
  inp: { name: "INP", description: "Réactivité aux interactions (utilisateurs réels)" },
  tbt: { name: "TBT", description: "Temps de blocage du navigateur" },
  fcp: { name: "FCP", description: "Affichage du premier contenu" },
};

export function getMetricTone({ id, value }: Metric): Tone {
  const [good, average] = METRIC_THRESHOLDS[id];
  if (value <= good) return "good";
  if (value <= average) return "average";
  return "poor";
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  const seconds = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(ms / 1000);
  return `${seconds} s`;
}

export function formatMetric({ id, value }: Metric): string {
  if (id === "cls") {
    return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value);
  }
  return formatDuration(value);
}

export type Impact = "high" | "medium" | "low";

export const IMPACT_LABELS: Record<Impact, string> = {
  high: "Impact élevé",
  medium: "Impact moyen",
  low: "Impact faible",
};

export const IMPACT_GROUP_LABELS: Record<Impact, string> = {
  high: "À traiter en priorité",
  medium: "À planifier",
  low: "Pour aller plus loin",
};

export const IMPACT_TONES: Record<Impact, Tone> = {
  high: "poor",
  medium: "average",
  low: "good",
};

export function getImpact({ savingsMs = 0, weight }: Recommendation): Impact {
  if (savingsMs >= 1000 || weight >= 7) return "high";
  if (savingsMs >= 200 || weight >= 3) return "medium";
  return "low";
}

const IMPACT_ORDER: Record<Impact, number> = { high: 0, medium: 1, low: 2 };

// Par impact, puis du plus fort gain au plus faible, puis par poids.
export function sortRecommendations(recommendations: Recommendation[]): Recommendation[] {
  return [...recommendations].sort(
    (a, b) =>
      IMPACT_ORDER[getImpact(a)] - IMPACT_ORDER[getImpact(b)] ||
      (b.savingsMs ?? 0) - (a.savingsMs ?? 0) ||
      b.weight - a.weight,
  );
}
