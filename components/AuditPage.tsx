import { normalizeUrl } from "@/lib/url";
import { isStrategy } from "@/types/audit";

import { AuditRunner, type AuditView } from "./AuditRunner";
import { ErrorMessage } from "./ErrorMessage";

type AuditPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  view: AuditView;
};

// Lit et valide les paramètres d'URL communs au rapport et aux recommandations.
export async function AuditPage({ searchParams, view }: AuditPageProps) {
  const { url, strategie } = await searchParams;
  const result = normalizeUrl(typeof url === "string" ? url : "");
  const strategy = isStrategy(strategie) ? strategie : "mobile";

  if (!result.ok) {
    return <ErrorMessage code="invalid-url" message={result.message} />;
  }

  // La clé « key » relance l'audit si l'adresse ou l'appareil change.
  return <AuditRunner key={`${result.url}|${strategy}`} url={result.url} strategy={strategy} view={view} />;
}
