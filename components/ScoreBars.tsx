import { getScoreTone, SCORE_LABELS, type Tone } from "@/lib/scoring";
import type { CategoryId, CategoryScore } from "@/types/audit";

import { CategoryIcon } from "./CategoryIcon";
import { Eyebrow } from "./Eyebrow";
import { StatusBadge } from "./StatusBadge";

const TONE_CLASSES: Record<Tone, { text: string; fill: string; marker: string }> = {
  good: { text: "text-good", fill: "bg-good", marker: "border-good" },
  average: { text: "text-average", fill: "bg-average", marker: "border-average" },
  poor: { text: "text-poor", fill: "bg-poor", marker: "border-poor" },
};

const DESCRIPTIONS: Record<CategoryId, string> = {
  performance: "Vitesse d'affichage et réactivité",
  accessibility: "Une page utilisable par tous",
  "best-practices": "Sécurité et qualité technique",
  seo: "Visibilité sur les moteurs de recherche",
};

// Échelle en trois zones, aux mêmes seuils que les statuts (50 et 90).
function ScoreScale({ score, tone }: { score: number; tone: Tone }) {
  const { fill, marker } = TONE_CLASSES[tone];

  return (
    <div aria-hidden="true" className="flex flex-col gap-1.5">
      <div className="relative">
        <div className="flex h-2.5 gap-0.5 overflow-hidden rounded-full">
          <span className="w-1/2 bg-poor-soft" />
          <span className="w-2/5 bg-average-soft" />
          <span className="w-1/10 bg-good-soft" />
        </div>
        <div
          className={`bar-fill absolute inset-y-0 left-0 rounded-full ${fill}`}
          style={{ width: `${score}%` }}
        />
        <span
          className={`marker-slide absolute top-1/2 size-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 bg-background shadow-sm ${marker}`}
          style={{ left: `${score}%` }}
        />
      </div>
      <div className="relative h-4 text-xs text-muted tabular-nums">
        <span className="absolute left-1/2 -translate-x-1/2">50</span>
        <span className="absolute left-9/10 -translate-x-1/2">90</span>
      </div>
    </div>
  );
}

type ScoreBarsProps = {
  scores: CategoryScore[];
};

export function ScoreBars({ scores }: ScoreBarsProps) {
  return (
    <section aria-labelledby="scores-title" className="flex flex-col gap-4">
      <Eyebrow>Vos scores</Eyebrow>
      <h2 id="scores-title" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        Le détail par domaine
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {scores.map(({ id, label, score }, index) => {
          const tone = getScoreTone(score);

          return (
            <li
              key={id}
              className="rise flex flex-col gap-4 rounded-2xl border border-line bg-background p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start gap-3">
                <CategoryIcon category={id} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{label}</p>
                  <p className="text-sm leading-5 text-muted">{DESCRIPTIONS[id]}</p>
                </div>
                <p className="shrink-0 font-extrabold whitespace-nowrap">
                  <span className={`text-3xl tracking-tight tabular-nums ${TONE_CLASSES[tone].text}`}>
                    {score}
                  </span>
                  <span className="text-sm font-normal text-muted">/100</span>
                </p>
              </div>
              <ScoreScale score={score} tone={tone} />
              <div>
                <StatusBadge tone={tone} label={SCORE_LABELS[tone]} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
