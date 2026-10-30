// Appareil simulé pendant l'audit (valeurs attendues par l'API PageSpeed).
export type Strategy = "mobile" | "desktop";

export function isStrategy(value: unknown): value is Strategy {
  return value === "mobile" || value === "desktop";
}

export type CategoryId = "performance" | "accessibility" | "best-practices" | "seo";

export type CategoryScore = {
  id: CategoryId;
  label: string;
  score: number; // de 0 à 100
};

export type MetricId = "lcp" | "cls" | "inp" | "tbt" | "fcp";

export type Metric = {
  id: MetricId;
  value: number; // en millisecondes, sauf CLS (sans unité)
  source: "lab" | "field"; // test Lighthouse ou données réelles de Chrome
};

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  savingsMs?: number; // gain de temps estimé, utilisé pour le tri
  savingsLabel?: string; // gain à afficher (« 900 ms », « 49 Kio »), absent si Google n'en fournit pas
  weight: number; // poids de l'audit dans le score de sa catégorie
};

export type AuditResult = {
  url: string;
  strategy: Strategy;
  fetchedAt: string; // date ISO
  scores: CategoryScore[];
  metrics: Metric[];
  recommendations: Recommendation[];
  screenshot?: string; // image en data URL
  fullPage?: FullPageImage; // image de toute la page, pour montrer ses sections
};

export type FullPageImage = {
  src: string; // image en data URL
  width: number;
  height: number;
};
