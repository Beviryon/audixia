// Normalisation et validation des URL, partagées entre le client et le serveur.

export type UrlValidation =
  | { ok: true; url: string }
  | { ok: false; message: string };

const MAX_URL_LENGTH = 2048;

const MESSAGES = {
  empty: "Saisissez l'adresse du site à auditer.",
  invalid: "Cette adresse n'est pas valide. Exemple : https://www.exemple.fr",
  protocol: "Seules les adresses commençant par http:// ou https:// sont acceptées.",
  credentials: "Retirez l'identifiant et le mot de passe de l'adresse.",
  private: "Cette adresse est locale ou privée : Google ne peut pas y accéder pour l'auditer.",
  tooLong: "Cette adresse est trop longue.",
};

// Un protocole explicite (« ftp: », « javascript: »), mais pas un port (« exemple.fr:8080 »).
const SCHEME_PATTERN = /^([a-z][a-z0-9+.-]*):(?!\d)/i;
const LABEL_PATTERN = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
const TLD_PATTERN = /^([a-z]{2,63}|xn--[a-z0-9-]{1,59})$/;
const IPV4_PATTERN = /^\d{1,3}(\.\d{1,3}){3}$/;
const PRIVATE_SUFFIXES = [".localhost", ".local", ".internal", ".intranet", ".lan", ".home", ".corp"];

function isPrivateIpv4(hostname: string): boolean {
  const [a, b] = hostname.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

// Le navigateur et Node normalisent déjà l'IPv6 : « [::1] », « [fe80::1] »…
function isPrivateIpv6(hostname: string): boolean {
  const address = hostname.slice(1, -1);
  return (
    address === "::" ||
    address === "::1" ||
    address.startsWith("::ffff:") ||
    /^f[cd]/.test(address) ||
    /^fe[89ab]/.test(address)
  );
}

function isPrivateHostname(hostname: string): boolean {
  if (hostname.startsWith("[")) return isPrivateIpv6(hostname);
  if (IPV4_PATTERN.test(hostname)) return isPrivateIpv4(hostname);
  return (
    hostname === "localhost" ||
    PRIVATE_SUFFIXES.some((suffix) => hostname.endsWith(suffix))
  );
}

function isValidPublicHostname(hostname: string): boolean {
  if (hostname.startsWith("[") || IPV4_PATTERN.test(hostname)) return true;
  const labels = hostname.split(".");
  return (
    labels.length >= 2 &&
    labels.every((label) => LABEL_PATTERN.test(label)) &&
    TLD_PATTERN.test(labels[labels.length - 1])
  );
}

// Ajoute https:// si besoin, puis refuse tout ce que Google ne pourrait pas auditer.
export function normalizeUrl(input: string): UrlValidation {
  const value = input.trim();
  if (!value) return { ok: false, message: MESSAGES.empty };
  if (value.length > MAX_URL_LENGTH) return { ok: false, message: MESSAGES.tooLong };

  const scheme = value.match(SCHEME_PATTERN)?.[1].toLowerCase();
  if (scheme && scheme !== "http" && scheme !== "https") {
    return { ok: false, message: MESSAGES.protocol };
  }

  let parsed: URL;
  try {
    parsed = new URL(scheme ? value : `https://${value}`);
  } catch {
    return { ok: false, message: MESSAGES.invalid };
  }

  if (parsed.username || parsed.password) {
    return { ok: false, message: MESSAGES.credentials };
  }

  const hostname = parsed.hostname.replace(/\.$/, "");
  if (isPrivateHostname(hostname)) return { ok: false, message: MESSAGES.private };
  if (!isValidPublicHostname(hostname)) return { ok: false, message: MESSAGES.invalid };

  return { ok: true, url: parsed.href };
}
