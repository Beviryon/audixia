// Appel à Google PageSpeed Insights. Ce module ne doit jamais être importé côté client.
import "server-only";

import { type AuditErrorCode, classifyApiError, classifyRuntimeError } from "@/lib/errors";
import { parseReport, type PsiResponse } from "@/lib/parse-report";
import type { AuditResult, Strategy } from "@/types/audit";

const API_URL = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const TIMEOUT_MS = 90_000;

export class AuditError extends Error {
  constructor(readonly code: AuditErrorCode) {
    super(code);
  }
}

// « signal » permet d'arrêter l'appel à Google si l'utilisateur quitte la page.
export async function runAudit(
  url: string,
  strategy: Strategy,
  signal: AbortSignal,
): Promise<AuditResult> {
  const apiKey = process.env.PAGESPEED_API_KEY?.trim();
  if (!apiKey) throw new AuditError("missing-key");

  const params = new URLSearchParams({ url, strategy, locale: "fr" });
  for (const category of CATEGORIES) params.append("category", category);

  let response: Response;
  try {
    // La clé passe par un en-tête pour ne jamais apparaître dans une URL ou un journal.
    response = await fetch(`${API_URL}?${params}`, {
      headers: { "X-Goog-Api-Key": apiKey },
      cache: "no-store",
      signal: AbortSignal.any([signal, AbortSignal.timeout(TIMEOUT_MS)]),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") throw new AuditError("timeout");
    throw new AuditError("unknown");
  }

  const data = (await response.json().catch(() => null)) as
    | (PsiResponse & { error?: Parameters<typeof classifyApiError>[1] })
    | null;

  if (!response.ok || !data) {
    throw new AuditError(classifyApiError(response.status, data?.error));
  }

  const runtimeError = data.lighthouseResult?.runtimeError?.code;
  if (runtimeError && runtimeError !== "NO_ERROR") {
    throw new AuditError(classifyRuntimeError(runtimeError));
  }

  return parseReport(data, url, strategy);
}
