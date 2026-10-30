import Link from "next/link";

import { AUDIT_ERRORS, type AuditErrorCode } from "@/lib/errors";

import { ErrorIllustration } from "./illustrations/ErrorIllustration";

type ErrorMessageProps = {
  code: AuditErrorCode;
  message?: string; // remplace le message par défaut quand il est plus précis
};

export function ErrorMessage({ code, message }: ErrorMessageProps) {
  const error = AUDIT_ERRORS[code];

  return (
    <div className="rise mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-5 px-4 py-16 text-center sm:px-6">
      <ErrorIllustration code={code} />
      <div role="alert" className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{error.title}</h1>
        <p className="leading-7 text-muted">{message ?? error.message}</p>
      </div>
      <Link
        href="/"
        className="flex h-11 w-fit items-center rounded-full bg-accent px-5 font-semibold text-accent-contrast transition hover:bg-accent-hover"
      >
        Faire un nouvel audit
      </Link>
    </div>
  );
}
