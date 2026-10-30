"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, type ReactNode, useState, useTransition } from "react";

import { clearReport } from "@/lib/report-cache";
import { normalizeUrl } from "@/lib/url";
import type { Strategy } from "@/types/audit";

const STRATEGIES: { value: Strategy; label: string; icon: ReactNode }[] = [
  {
    value: "mobile",
    label: "Mobile",
    icon: <path d="M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5ZM11 18.5h2" />,
  },
  {
    value: "desktop",
    label: "Ordinateur",
    icon: <path d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM9 20h6M12 16v4" />,
  },
];

// Formulaire de l'accueil, posé sur le fond sombre : ses couleurs ne suivent pas le thème.
export function AuditForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<Strategy>("mobile");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = normalizeUrl(url);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setError(null);
    setUrl(result.url);
    // Une demande depuis le formulaire lance toujours un nouvel audit.
    clearReport(result.url, strategy);
    const params = new URLSearchParams({ url: result.url, strategie: strategy });
    startTransition(() => router.push(`/rapport?${params}`));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-4">
      <div
        className={`flex flex-col gap-2 rounded-3xl bg-white p-2 text-[#1c1a33] shadow-2xl shadow-black/30 ring-4 transition sm:flex-row sm:rounded-full ${
          error ? "ring-red-400/70" : "ring-white/10 focus-within:ring-gold/60"
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
            className="size-5 shrink-0 text-[#56536f]"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.500 5.500 12 3Z" />
          </svg>
          <label htmlFor="url" className="sr-only">
            Adresse du site
          </label>
          {/* Type « text » : le type « url » refuserait une adresse sans https:// */}
          <input
            id="url"
            type="text"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="www.votre-site.fr"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setError(null);
            }}
            aria-invalid={error !== null}
            aria-describedby={error ? "url-error" : undefined}
            className="h-12 w-full min-w-0 bg-transparent text-lg outline-none placeholder:text-[#56536f]"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-7 font-bold text-white transition hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
        >
          {isPending ? "Ouverture…" : "Auditer"}
          {!isPending && (
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="size-4"
            >
              <path d="M4 10h12m-5-5 5 5-5 5" />
            </svg>
          )}
        </button>
      </div>

      {error && (
        <p id="url-error" role="alert" className="px-2 text-sm font-semibold text-red-300">
          {error}
        </p>
      )}

      <fieldset className="flex flex-wrap items-center gap-x-3 gap-y-2 px-1">
        <legend className="sr-only">Appareil à simuler</legend>
        <span aria-hidden="true" className="text-sm text-white/75">
          Tester sur
        </span>
        <div className="flex gap-2">
          {STRATEGIES.map(({ value, label, icon }) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-white/25 px-3.5 py-2 text-sm font-semibold text-white/85 transition hover:border-white/60 has-checked:border-white has-checked:bg-white has-checked:text-brand-hover has-focus-visible:ring-2 has-focus-visible:ring-gold"
            >
              <input
                type="radio"
                name="strategie"
                value={value}
                checked={strategy === value}
                onChange={() => setStrategy(value)}
                className="sr-only"
              />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-4"
              >
                {icon}
              </svg>
              {label}
            </label>
          ))}
        </div>
      </fieldset>
    </form>
  );
}
