// Garde le dernier rapport le temps de l'onglet, pour changer de page sans relancer l'audit.
import type { AuditResult, Strategy } from "@/types/audit";

function getKey(url: string, strategy: Strategy): string {
  return `audixia:rapport:${strategy}:${url}`;
}

// sessionStorage peut être indisponible ou plein : l'audit est alors simplement relancé.
export function loadReport(url: string, strategy: Strategy): AuditResult | null {
  try {
    const saved = sessionStorage.getItem(getKey(url, strategy));
    return saved ? (JSON.parse(saved) as AuditResult) : null;
  } catch {
    return null;
  }
}

export function saveReport(url: string, strategy: Strategy, report: AuditResult): void {
  try {
    sessionStorage.setItem(getKey(url, strategy), JSON.stringify(report));
  } catch {
    // Sans sauvegarde, seul le changement de page relancera l'audit.
  }
}

export function clearReport(url: string, strategy: Strategy): void {
  try {
    sessionStorage.removeItem(getKey(url, strategy));
  } catch {
    // Rien à nettoyer si le stockage est indisponible.
  }
}
