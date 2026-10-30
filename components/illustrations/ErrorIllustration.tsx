import type { AuditErrorCode } from "@/lib/errors";

const ICONS: Record<AuditErrorCode, React.ReactNode> = {
  "invalid-url": (
    <path d="M10 14a4 4 0 0 1 0-5.6l2-2a4 4 0 0 1 5.6 5.6l-1 1M14 10a4 4 0 0 1 0 5.6l-2 2a4 4 0 0 1-5.6-5.6l1-1M4 4l3 3M20 20l-3-3" />
  ),
  unreachable: (
    <path d="M2 8.5a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0M12 19.5h.01M3 3l18 18" />
  ),
  quota: <path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9" />,
  "rate-limit": <path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9" />,
  "missing-key": (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 9-9m-4 4 3 3m-6 0 2 2" />
    </>
  ),
  "invalid-key": (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 9-9m-4 4 3 3m-6 0 2 2" />
    </>
  ),
  timeout: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  unknown: <path d="M12 4 2.5 20h19ZM12 10v4M12 17h.01" />,
};

type ErrorIllustrationProps = {
  code: AuditErrorCode;
};

// Illustration décorative propre à chaque type d'erreur.
export function ErrorIllustration({ code }: ErrorIllustrationProps) {
  return (
    <div aria-hidden="true" className="relative flex size-24 items-center justify-center">
      <span className="ripple absolute inset-0 rounded-full bg-poor-soft" />
      <span className="float relative flex size-20 items-center justify-center rounded-full bg-poor-soft text-poor">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-10"
        >
          {ICONS[code]}
        </svg>
      </span>
    </div>
  );
}
