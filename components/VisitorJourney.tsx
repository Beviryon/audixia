import { formatMetric, getMetricTone, METRIC_INFO, SCORE_LABELS, type Tone } from "@/lib/scoring";
import type { Metric, MetricId } from "@/types/audit";

import { Eyebrow } from "./Eyebrow";
import { StatusBadge } from "./StatusBadge";

// Teintes lisibles sur le fond sombre de la section, quel que soit le thème.
const NODE_CLASSES: Record<Tone, string> = {
  good: "bg-[#45d98a]",
  average: "bg-[#ffab5c]",
  poor: "bg-[#ff8f86]",
};

const ARRIVAL_STEPS: { id: MetricId; label: string }[] = [
  { id: "fcp", label: "Il voit les premiers éléments" },
  { id: "lcp", label: "Il voit le contenu principal" },
];

// Une réponse en français simple pour chaque statut : [bon, à améliorer, faible].
const EXPERIENCE: { id: MetricId; question: string; answers: Record<Tone, string> }[] = [
  {
    id: "cls",
    question: "La page reste-t-elle stable ?",
    answers: {
      good: "Oui, les éléments restent en place pendant le chargement.",
      average: "Pas toujours : certains éléments se déplacent pendant le chargement.",
      poor: "Non : les éléments bougent fortement et peuvent provoquer de mauvais clics.",
    },
  },
  {
    id: "tbt",
    question: "Peut-on l'utiliser pendant le chargement ?",
    answers: {
      good: "Oui, le navigateur reste disponible.",
      average: "En partie : le navigateur est parfois occupé par les scripts.",
      poor: "Difficilement : les scripts bloquent longtemps le navigateur.",
    },
  },
  {
    id: "inp",
    question: "Réagit-elle vite pour de vrais visiteurs ?",
    answers: {
      good: "Oui, les clics reçoivent une réponse rapide.",
      average: "Pas toujours : un délai se fait parfois sentir après un clic.",
      poor: "Non : les visiteurs attendent après leurs clics.",
    },
  },
];

type VisitorJourneyProps = {
  metrics: Metric[];
};

// Présente les mesures du point de vue du visiteur, sans perdre leur nom technique.
export function VisitorJourney({ metrics }: VisitorJourneyProps) {
  const find = (id: MetricId) => metrics.find((metric) => metric.id === id);
  const arrival = ARRIVAL_STEPS.flatMap(({ id, label }) => {
    const metric = find(id);
    return metric ? [{ label, metric }] : [];
  });
  const experience = EXPERIENCE.flatMap((item) => {
    const metric = find(item.id);
    return metric ? [{ ...item, metric }] : [];
  });

  return (
    <section aria-labelledby="journey-title" className="audit-stage relative overflow-hidden text-white">
      <span aria-hidden="true" className="stage-grid" />
      <div className="page-container relative flex flex-col gap-10 py-12 sm:py-16">
        <div className="flex flex-col gap-4">
          <Eyebrow className="text-lilac">Core Web Vitals</Eyebrow>
          <h2 id="journey-title" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ce que vit votre visiteur
          </h2>
          <p className="text-white/75">De son arrivée sur la page à ses premières actions.</p>
        </div>

        <ol className="relative grid gap-6 md:grid-cols-3">
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-2 w-0.5 bg-white/20 md:top-2 md:right-[16.5%] md:bottom-auto md:left-[16.5%] md:h-0.5 md:w-auto"
          />
          <li className="relative flex gap-4 md:flex-col md:items-center md:gap-3 md:text-center">
            <span className="relative size-4 shrink-0 rounded-full bg-lilac ring-4 ring-ink" />
            <div>
              <p className="text-3xl font-extrabold tabular-nums">0 s</p>
              <p className="text-sm text-white/75">Le visiteur arrive</p>
            </div>
          </li>
          {arrival.map(({ label, metric }) => {
            const tone = getMetricTone(metric);

            return (
              <li key={metric.id} className="relative flex gap-4 md:flex-col md:items-center md:gap-3 md:text-center">
                <span className={`relative size-4 shrink-0 rounded-full ring-4 ring-ink ${NODE_CLASSES[tone]}`} />
                <div className="flex flex-col items-start gap-1 md:items-center">
                  <p className="text-3xl font-extrabold tabular-nums">{formatMetric(metric)}</p>
                  <p className="text-sm text-white/75">
                    {label} <span className="font-mono text-xs">({METRIC_INFO[metric.id].name})</span>
                  </p>
                  <StatusBadge tone={tone} label={SCORE_LABELS[tone]} />
                </div>
              </li>
            );
          })}
        </ol>

        <ul className={`grid gap-4 ${experience.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {experience.map(({ id, question, answers, metric }) => {
            const tone = getMetricTone(metric);

            return (
              <li key={id} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold">{question}</p>
                  <StatusBadge tone={tone} label={SCORE_LABELS[tone]} />
                </div>
                <p className="text-sm leading-6 text-white/75">{answers[tone]}</p>
                <p className="mt-auto pt-1 text-sm">
                  <span className="font-bold tabular-nums">{formatMetric(metric)}</span>{" "}
                  <span className="font-mono text-xs text-white/70">{METRIC_INFO[id].name}</span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
