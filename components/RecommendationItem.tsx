import { CATEGORY_LABELS, getImpact, IMPACT_LABELS, IMPACT_TONES } from "@/lib/scoring";
import type { Recommendation } from "@/types/audit";

import { CategoryIcon } from "./CategoryIcon";
import { InlineMarkdown } from "./InlineMarkdown";
import { StatusBadge } from "./StatusBadge";

type RecommendationItemProps = {
  recommendation: Recommendation;
};

// Ligne compacte : le détail s'ouvre au clic.
export function RecommendationItem({ recommendation }: RecommendationItemProps) {
  const { title, description, category, savingsLabel } = recommendation;
  const impact = getImpact(recommendation);

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-3 hover:bg-surface sm:px-4 [&::-webkit-details-marker]:hidden">
        <CategoryIcon category={category} />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
          <p className="min-w-0 font-medium">
            <InlineMarkdown text={title} />
          </p>
          <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            {savingsLabel && <span className="font-medium text-foreground">{savingsLabel}</span>}
            <span>{CATEGORY_LABELS[category]}</span>
            <StatusBadge tone={IMPACT_TONES[impact]} label={IMPACT_LABELS[impact]} />
          </div>
        </div>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180"
        >
          <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="flex flex-col gap-2 px-3 pb-4 text-sm leading-6 text-muted sm:px-4 sm:pl-17">
        {savingsLabel && (
          <p className="font-medium text-foreground">Gain estimé : {savingsLabel}</p>
        )}
        <p>
          <InlineMarkdown text={description} />
        </p>
      </div>
    </details>
  );
}
