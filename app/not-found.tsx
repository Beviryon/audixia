import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable – Audixia",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-5 px-4 py-16 text-center sm:px-6">
      <p className="text-5xl font-semibold tracking-tight text-accent">404</p>
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Page introuvable</h1>
        <p className="leading-7 text-muted">Cette page n&apos;existe pas ou a été déplacée.</p>
      </div>
      <Link
        href="/"
        className="flex h-11 w-fit items-center rounded-full bg-accent px-5 font-semibold text-accent-contrast transition hover:bg-accent-hover"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
