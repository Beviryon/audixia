// Limite le nombre d'audits par adresse IP, pour protéger le quota de la clé Google.
// Les compteurs vivent en mémoire : sur Vercel, chaque instance a les siens. C'est un frein, pas une garantie stricte.

const MAX_AUDITS = 10;
const WINDOW_MS = 10 * 60 * 1000;

const counters = new Map<string, { count: number; resetsAt: number }>();

export function isRateLimited(ip: string, now = Date.now()): boolean {
  // Évite que la mémoire grossisse : les compteurs expirés ne servent plus.
  for (const [key, counter] of counters) {
    if (counter.resetsAt <= now) counters.delete(key);
  }

  const counter = counters.get(ip);
  if (!counter) {
    counters.set(ip, { count: 1, resetsAt: now + WINDOW_MS });
    return false;
  }

  counter.count += 1;
  return counter.count > MAX_AUDITS;
}

export function getClientIp(headers: Headers): string {
  return headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "inconnue";
}
