"use client";

import { useLayoutEffect, useState } from "react";

import type { AuditErrorCode } from "@/lib/errors";
import { loadReport, saveReport } from "@/lib/report-cache";
import type { AuditResult, Strategy } from "@/types/audit";

import { AuditReport } from "./AuditReport";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingState } from "./LoadingState";
import { RecommendationsView } from "./RecommendationsView";

type AuditState =
  | { status: "loading" }
  | { status: "success"; report: AuditResult }
  | { status: "error"; code: AuditErrorCode; message?: string };

type AuditResponse = {
  report?: AuditResult;
  error?: { code: AuditErrorCode; message?: string };
};

export type AuditView = "report" | "recommendations";

type AuditRunnerProps = {
  url: string;
  strategy: Strategy;
  view: AuditView;
};

async function fetchAudit(url: string, strategy: Strategy, signal: AbortSignal): Promise<AuditResponse> {
  const params = new URLSearchParams({ url, strategie: strategy });
  const response = await fetch(`/api/audit?${params}`, { signal });
  return response.json();
}

// Réutilise le rapport de l'onglet s'il existe, sinon lance l'audit, puis affiche l'état correspondant.
export function AuditRunner({ url, strategy, view }: AuditRunnerProps) {
  const [state, setState] = useState<AuditState>({ status: "loading" });

  // useLayoutEffect : l'état est corrigé avant l'affichage, sans flash de l'ancien rapport.
  useLayoutEffect(() => {
    const controller = new AbortController();
    const cached = loadReport(url, strategy);
    // Next.js garde les pages quittées en mémoire : sans sauvegarde, l'ancien rapport ne doit pas rester affiché.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!cached) setState({ status: "loading" });
    const request = cached
      ? Promise.resolve<AuditResponse>({ report: cached })
      : fetchAudit(url, strategy, controller.signal);

    request
      .then(({ report, error }) => {
        if (report) {
          saveReport(url, strategy, report);
          setState({ status: "success", report });
        } else {
          setState({ status: "error", code: error?.code ?? "unknown", message: error?.message });
        }
      })
      .catch(() => {
        // Un arrêt volontaire (page quittée) ne doit pas afficher d'erreur.
        if (!controller.signal.aborted) setState({ status: "error", code: "unknown" });
      });

    return () => controller.abort();
  }, [url, strategy]);

  if (state.status === "loading") return <LoadingState url={url} />;
  if (state.status === "error") return <ErrorMessage code={state.code} message={state.message} />;

  const params = new URLSearchParams({ url, strategie: strategy });
  return view === "recommendations" ? (
    <RecommendationsView report={state.report} reportHref={`/rapport?${params}`} />
  ) : (
    <AuditReport report={state.report} recommendationsHref={`/rapport/recommandations?${params}`} />
  );
}
