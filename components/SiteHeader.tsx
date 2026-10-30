import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-white/10 bg-ink text-white">
      <div className="page-container flex h-18 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 rounded">
          <svg viewBox="0 0 32 32" className="size-9 shrink-0" fill="none" aria-hidden="true">
            <path d="M16 1.500 28.500 5.500V17c0 7-5 11.300-12.500 13.500C8.500 28.300 3.500 24 3.500 17V5.500Z" fill="#3f1fcc" />
            <path d="M10.500 22.500 16 9l5.500 13.500" stroke="#ffffff" strokeWidth="2.800" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.800 18h6.400" stroke="#ffc35a" strokeWidth="2.800" strokeLinecap="round" />
          </svg>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold tracking-wide uppercase">Audixia</span>
            <span className="hidden text-xs text-white/70 sm:block">L&apos;audit clair de votre site</span>
          </span>
        </Link>
        <Link
          href="/"
          className="flex h-10 shrink-0 items-center rounded-full bg-white px-5 text-sm font-semibold text-brand-hover transition hover:bg-gold"
        >
          Lancer un audit
        </Link>
      </div>
    </header>
  );
}
