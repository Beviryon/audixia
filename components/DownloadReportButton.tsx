"use client";

import { useState } from "react";

import type { AuditResult } from "@/types/audit";

type DownloadReportButtonProps = {
  report: AuditResult;
  onDark?: boolean; // bouton posé sur un fond sombre
};

// Génère le PDF dans le navigateur, puis lance son téléchargement.
export function DownloadReportButton({ report, onDark = false }: DownloadReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleClick() {
    setIsGenerating(true);
    setHasError(false);

    try {
      const { createReportPdf, getReportFileName } = await import("@/lib/report-pdf");
      const blob = await createReportPdf(report);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = getReportFileName(report);
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setHasError(true);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isGenerating}
        className={`flex h-12 items-center gap-2 rounded-full px-6 font-bold transition disabled:opacity-60 ${
          onDark ? "bg-white text-brand-hover hover:bg-gold" : "bg-accent text-accent-contrast hover:bg-accent-hover"
        }`}
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
          <path d="M10 3v10m-4-4 4 4 4-4M4 17h12" />
        </svg>
        {isGenerating ? "Préparation du rapport…" : "Télécharger le rapport PDF"}
      </button>
      {hasError && (
        <p role="alert" className={`text-sm font-medium ${onDark ? "text-red-300" : "text-poor"}`}>
          Le rapport n&apos;a pas pu être créé. Réessayez.
        </p>
      )}
    </div>
  );
}
