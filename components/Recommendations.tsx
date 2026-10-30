import Link from "next/link";

import { sortRecommendations } from "@/lib/scoring";
import type { Recommendation } from "@/types/audit";

import { RecommendationItem } from "./RecommendationItem";

const PRIORITY_COUNT = 3;

type RecommendationsProps = {
  recommendations: Recommendation[];
  href: string; // page de la liste complète
};

// Résumé du rapport : les priorités, avec un accès à la liste complète.
export function Recommendations({ recommendations, href }: RecommendationsProps) {
  const total = recommendations.length;
  const priorities = sortRecommendations(recommendations).slice(0, PRIORITY_COUNT);

  return (
    <section aria-labelledby="recommendations-title" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="recommendations-title" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            À faire d&apos;abord
          </h2>
          {total > PRIORITY_COUNT && (
            <p className="text-sm text-muted">
              Les {PRIORITY_COUNT} actions les plus utiles, sur {total} recommandations.
            </p>
          )}
        </div>
        {total > PRIORITY_COUNT && (
          <Link
            href={href}
            className="flex h-12 w-fit items-center gap-2 rounded-full bg-accent px-6 font-bold text-accent-contrast transition hover:bg-accent-hover"
          >
            Voir les {total} recommandations
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      {total === 0 ? (
        <p className="rounded-2xl border border-line p-5 text-muted">
          Aucune recommandation : ce site respecte les points contrôlés.
        </p>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
          {priorities.map((recommendation) => (
            <li key={recommendation.id}>
              <RecommendationItem recommendation={recommendation} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
