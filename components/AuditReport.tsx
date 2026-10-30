import type { Tone } from "@/lib/scoring";
import { SCORE_LABELS } from "@/lib/scoring";
import { getVerdict } from "@/lib/verdict";
import type { AuditResult } from "@/types/audit";

import { DownloadReportButton } from "./DownloadReportButton";
import { Eyebrow } from "./Eyebrow";
import { PageSections } from "./PageSections";
import { Recommendations } from "./Recommendations";
import { ScoreBars } from "./ScoreBars";
import { Screenshot } from "./Screenshot";
import { VisitorJourney } from "./VisitorJourney";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

// Teintes lisibles sur le fond sombre du bandeau, quel que soit le thème.
const NOTE_CLASSES: Record<Tone, string> = {
  good: "text-[#45d98a]",
  average: "text-[#ffab5c]",
  poor: "text-[#ff8f86]",
};

type AuditReportProps = {
  report: AuditResult;
  recommendationsHref: string;
};

export function AuditReport({ report, recommendationsHref }: AuditReportProps) {
  const { url, strategy, fetchedAt, scores, metrics, recommendations, screenshot, fullPage } = report;
  const details = `${strategy === "mobile" ? "Mobile" : "Ordinateur"} · ${dateFormatter.format(new Date(fetchedAt))}`;
  const verdict = getVerdict(report);

  return (
    <div className="flex flex-col">
      <section className="audit-stage relative overflow-hidden text-white">
        <span aria-hidden="true" className="stage-grid" />
        <div
          className={`page-container relative grid items-center gap-10 py-10 sm:py-14 ${
            screenshot ? (strategy === "mobile" ? "lg:grid-cols-[1fr_15rem] lg:gap-16" : "lg:grid-cols-[3fr_2fr] lg:gap-16") : ""
          }`}
        >
          <div className="rise flex min-w-0 flex-col gap-6">
            <Eyebrow className="text-lilac">Votre bilan</Eyebrow>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <p className={`shrink-0 font-extrabold tracking-tight ${NOTE_CLASSES[verdict.tone]}`}>
                <span className="text-7xl tabular-nums sm:text-8xl">{verdict.note}</span>
                <span className="ml-1 text-xl">/100</span>
                <span className="sr-only"> : note globale, {SCORE_LABELS[verdict.tone]}</span>
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                {verdict.title}
              </h1>
            </div>
            <p className="text-lg leading-8 font-semibold text-gold">{verdict.detail}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <DownloadReportButton report={report} onDark />
              <div className="min-w-0 text-sm">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wrap-break-word font-semibold underline-offset-4 hover:underline"
                >
                  {url}
                </a>
                <p className="text-white/70">{details}</p>
              </div>
            </div>
            <p className="text-xs text-white/70">Note Audixia : moyenne des {scores.length} domaines analysés.</p>
          </div>

          {screenshot && <Screenshot src={screenshot} strategy={strategy} />}
        </div>
      </section>

      <section className="page-container py-12 sm:py-16">
        <ScoreBars scores={scores} />
      </section>

      {fullPage && <PageSections image={fullPage} strategy={strategy} />}

      <VisitorJourney metrics={metrics} />

      <section className="page-container flex flex-col gap-4 py-12 sm:py-16">
        <Eyebrow>Vos priorités</Eyebrow>
        <Recommendations recommendations={recommendations} href={recommendationsHref} />
      </section>
    </div>
  );
}
