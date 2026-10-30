// Traduit les résultats de l'audit en bilan lisible : note globale et verdict en français simple.
import { getMetricTone, getScoreTone, type Tone } from "@/lib/scoring";
import type { AuditResult, Metric, MetricId } from "@/types/audit";

export type Verdict = {
  note: number; // moyenne des scores disponibles, de 0 à 100
  tone: Tone;
  title: string;
  detail: string;
};

// Du problème le plus visible pour un visiteur au moins visible.
const METRIC_PROBLEMS: [MetricId, string][] = [
  ["lcp", "le contenu principal met trop longtemps à s'afficher"],
  ["cls", "la mise en page bouge pendant le chargement"],
  ["inp", "la page réagit lentement aux actions des visiteurs"],
  ["tbt", "le navigateur reste bloqué pendant le chargement"],
  ["fcp", "le premier affichage arrive trop tard"],
];

function getMainProblem(metrics: Metric[], tone: Tone): string | undefined {
  for (const [id, problem] of METRIC_PROBLEMS) {
    const metric = metrics.find((item) => item.id === id);
    if (metric && getMetricTone(metric) === tone) return problem;
  }
  return undefined;
}

function getTitle(note: number, hasMajorIssue: boolean): string {
  // Un point faible se ressent chez le visiteur, même avec une bonne moyenne.
  if (note >= 70 && hasMajorIssue) return "Votre site a de bonnes bases, mais un point faible freine vos visiteurs.";
  if (note >= 90) return "Votre site est en très bonne forme.";
  if (note >= 70) return "Votre site est solide, avec des points à améliorer.";
  if (note >= 50) return "Votre site fonctionne, mais plusieurs points freinent vos visiteurs.";
  return "Votre site a besoin d'attention en priorité.";
}

export function getVerdict({ scores, metrics }: AuditResult): Verdict {
  const note = scores.length
    ? Math.round(scores.reduce((sum, { score }) => sum + score, 0) / scores.length)
    : 0;
  const poorProblem = getMainProblem(metrics, "poor");
  const problem = poorProblem ?? getMainProblem(metrics, "average");
  const weakest = [...scores].sort((a, b) => a.score - b.score)[0];

  let detail = "Aucun point faible majeur n'a été détecté sur cette page.";
  if (problem) {
    detail = `À regarder en premier : ${problem}.`;
  } else if (weakest && weakest.score < 90) {
    const domain = weakest.id === "seo" ? weakest.label : weakest.label.toLowerCase();
    detail = `Le domaine à travailler en premier : ${domain} (${weakest.score}/100).`;
  }

  return { note, tone: getScoreTone(note), title: getTitle(note, poorProblem !== undefined || (weakest?.score ?? 100) < 50), detail };
}
