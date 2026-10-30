import { AUDIT_ERRORS, type AuditErrorCode } from "@/lib/errors";
import { AuditError, runAudit } from "@/lib/pagespeed";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";
import { normalizeUrl } from "@/lib/url";
import { isStrategy } from "@/types/audit";

function errorResponse(code: AuditErrorCode, message?: string) {
  return Response.json({ error: { code, message } }, { status: AUDIT_ERRORS[code].status });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = normalizeUrl(searchParams.get("url") ?? "");
  if (!result.ok) return errorResponse("invalid-url", result.message);

  if (isRateLimited(getClientIp(request.headers))) return errorResponse("rate-limit");

  const strategie = searchParams.get("strategie");
  const strategy = isStrategy(strategie) ? strategie : "mobile";

  try {
    const report = await runAudit(result.url, strategy, request.signal);
    return Response.json({ report });
  } catch (error) {
    return errorResponse(error instanceof AuditError ? error.code : "unknown");
  }
}
