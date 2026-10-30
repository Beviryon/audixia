export function SiteFooter() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="page-container flex flex-col gap-1 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p>
          Audixia, une solution{" "}
          <a
            href="https://trevixia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white underline-offset-4 hover:underline"
          >
            Trevixia
          </a>
        </p>
        <p>Analyses réalisées avec Google PageSpeed Insights.</p>
      </div>
    </footer>
  );
}
