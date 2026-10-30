// Erreurs d'audit présentées à l'utilisateur, en français.
export type AuditErrorCode =
  | "invalid-url"
  | "unreachable"
  | "quota"
  | "rate-limit"
  | "missing-key"
  | "invalid-key"
  | "timeout"
  | "unknown";

export const AUDIT_ERRORS: Record<AuditErrorCode, { title: string; message: string; status: number }> = {
  "invalid-url": {
    title: "Adresse non valide",
    message: "Vérifiez l'adresse saisie, puis relancez l'audit. Exemple : https://www.exemple.fr",
    status: 400,
  },
  unreachable: {
    title: "Site injoignable",
    message:
      "Google n'a pas réussi à ouvrir ce site. Vérifiez qu'il est en ligne et accessible publiquement, puis réessayez.",
    status: 422,
  },
  quota: {
    title: "Trop d'audits pour le moment",
    message: "Le nombre d'audits autorisés est atteint. Réessayez un peu plus tard.",
    status: 429,
  },
  "rate-limit": {
    title: "Vous avez lancé beaucoup d'audits",
    message: "Pour garder le service disponible, le nombre d'audits est limité. Réessayez dans quelques minutes.",
    status: 429,
  },
  "missing-key": {
    title: "Service non configuré",
    message:
      "La clé d'accès à Google PageSpeed Insights est absente. Ajoutez-la dans le fichier .env.local, puis redémarrez le serveur.",
    status: 500,
  },
  "invalid-key": {
    title: "Clé d'accès refusée",
    message:
      "Google refuse la clé PageSpeed Insights. Vérifiez qu'elle est correcte et que l'API est bien activée sur votre projet.",
    status: 500,
  },
  timeout: {
    title: "L'audit a pris trop de temps",
    message: "Ce site met trop de temps à répondre. Réessayez dans quelques instants.",
    status: 504,
  },
  unknown: {
    title: "L'audit n'a pas abouti",
    message: "Une erreur inattendue s'est produite. Réessayez dans quelques instants.",
    status: 502,
  },
};

// Erreurs renvoyées par Lighthouse quand la page auditée ne peut pas être chargée.
const UNREACHABLE_PATTERN =
  /FAILED_DOCUMENT_REQUEST|ERRORED_DOCUMENT_REQUEST|DNS_FAILURE|NO_FCP|NO_DOCUMENT_REQUEST|DOCUMENT_REQUEST|NOT_HTML|PROTOCOL_TIMEOUT|ERR_NAME_NOT_RESOLVED|ERR_CONNECTION/;

type GoogleError = {
  message?: string;
  errors?: { reason?: string }[];
  details?: { reason?: string }[];
};

// Traduit une erreur de l'API Google en code d'erreur de l'application.
export function classifyApiError(status: number, error?: GoogleError): AuditErrorCode {
  const message = error?.message ?? "";
  const reasons = [...(error?.errors ?? []), ...(error?.details ?? [])]
    .map(({ reason }) => reason ?? "")
    .join(" ");

  if (status === 429 || /rateLimit|dailyLimit|quota|RATE_LIMIT/i.test(reasons)) return "quota";
  if (/keyInvalid|API_KEY_INVALID|accessNotConfigured|SERVICE_DISABLED|API_KEY_/i.test(reasons)) {
    return "invalid-key";
  }
  if (/API key not valid/i.test(message)) return "invalid-key";
  if (UNREACHABLE_PATTERN.test(message)) return "unreachable";
  return "unknown";
}

// Même traduction pour une erreur signalée dans une réponse Lighthouse réussie.
export function classifyRuntimeError(code: string): AuditErrorCode {
  return UNREACHABLE_PATTERN.test(code) ? "unreachable" : "unknown";
}
