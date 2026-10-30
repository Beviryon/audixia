"use client";

import Link from "next/link";
import { useState } from "react";

import {
  CATEGORY_LABELS,
  getImpact,
  IMPACT_GROUP_LABELS,
  IMPACT_LABELS,
  IMPACT_TONES,
  type Impact,
  sortRecommendations,
} from "@/lib/scoring";
import type { AuditResult, CategoryId } from "@/types/audit";

import { DownloadReportButton } from "./DownloadReportButton";
import { Eyebrow } from "./Eyebrow";
import { RecommendationItem } from "./RecommendationItem";
import { StatusBadge } from "./StatusBadge";

const IMPACTS: Impact[] = ["high", "medium", "low"];
const CATEGORIES = Object.keys(CATEGORY_LABELS) as CategoryId[];

type RecommendationsViewProps = {
  report: AuditResult;
  reportHref: string;
};

// Page dédiée : recommandations groupées par impact, avec un filtre par catégorie.
export function RecommendationsView({ report, reportHref }: RecommendationsViewProps) {
  const [filter, setFilter] = useState<CategoryId | "all">("all");
  const sorted = sortRecommendations(report.recommendations);
  const visible = sorted.filter(({ category }) => filter === "all" || category === filter);

  const filters = [
    { value: "all" as const, label: "Toutes", count: sorted.length },
    ...CATEGORIES.map((id) => ({
      value: id,
      label: CATEGORY_LABELS[id],
      count: sorted.filter(({ category }) => category === id).length,
    })).filter(({ count }) => count > 0),
  ];

  return (
    <div className="flex flex-col">
      <header className="audit-stage relative overflow-hidden text-white">
        <span aria-hidden="true" className="stage-grid" />
        <div className="page-container relative flex flex-col gap-5 py-10 sm:py-14">
        <Link href={reportHref} className="w-fit font-semibold text-gold underline-offset-4 hover:underline">
          <span aria-hidden="true">← </span>Retour au rapport
        </Link>
        <Eyebrow className="text-lilac">Plan d&apos;action</Eyebrow>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-1.5">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Recommandations</h1>
            <p className="wrap-break-word text-white/75">{report.url}</p>
          </div>
          <DownloadReportButton report={report} onDark />
        </div>
        <ul className="flex flex-wrap gap-2">
          {IMPACTS.map((impact) => {
            const count = sorted.filter((item) => getImpact(item) === impact).length;
            return (
              <li key={impact}>
                <StatusBadge tone={IMPACT_TONES[impact]} label={`${count} · ${IMPACT_LABELS[impact]}`} />
              </li>
            );
          })}
        </ul>
        </div>
      </header>

      <div className="page-container flex flex-col gap-8 py-10 sm:py-14">
      {sorted.length === 0 ? (
        <p className="rounded-2xl border border-line p-5 text-muted">
          Aucune recommandation : ce site respecte les points contrôlés.
        </p>
      ) : (
        <>
          <div role="group" aria-label="Filtrer par catégorie" className="flex flex-wrap gap-2">
            {filters.map(({ value, label, count }) => (
              <button
                key={value}
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className="rounded-full border border-line px-3.5 py-2 text-sm font-medium text-muted transition hover:border-accent aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent"
              >
                {label} ({count})
              </button>
            ))}
          </div>

          {IMPACTS.map((impact) => {
            const items = visible.filter((item) => getImpact(item) === impact);
            if (items.length === 0) return null;

            return (
              <section key={impact} aria-labelledby={`impact-${impact}`} className="flex flex-col gap-3">
                <h2 id={`impact-${impact}`} className="text-xl font-extrabold tracking-tight">
                  {IMPACT_GROUP_LABELS[impact]} ({items.length})
                </h2>
                <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
                  {items.map((recommendation) => (
                    <li key={recommendation.id}>
                      <RecommendationItem recommendation={recommendation} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </>
      )}
      </div>
    </div>
  );
}
