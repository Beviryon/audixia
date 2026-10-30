const STEPS = [
  { label: "Vitesse", state: "done" },
  { label: "Accessibilité", state: "done" },
  { label: "Référencement", state: "active" },
  { label: "Priorités", state: "pending" },
];

// Illustration décorative : un bilan stylisé, avec des valeurs d'exemple.
export function HeroIllustration() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md py-8 xl:max-w-lg">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl shadow-black/30 backdrop-blur-sm">
        <div>
          <p className="text-xs font-semibold tracking-wide text-white/60 uppercase">Votre bilan</p>
          <p className="mt-1 text-lg font-bold">www.votre-site.fr</p>
        </div>
        <ul className="mt-5 flex flex-col gap-3">
          {STEPS.map(({ label, state }) => (
            <li
              key={label}
              className={`flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold ${
                state === "pending" ? "text-white/50" : ""
              }`}
            >
              {state === "done" ? (
                <span className="flex size-6 items-center justify-center rounded-full bg-[#5a3fe6]">
                  <svg viewBox="0 0 20 20" fill="none" stroke="#ffffff" strokeWidth="2.500" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                    <path d="m5 10.500 3.500 3.500L15 7" />
                  </svg>
                </span>
              ) : (
                <span className={`size-6 rounded-full border-2 ${state === "active" ? "pulse-dot border-gold" : "border-white/25"}`} />
              )}
              <span className="flex-1">{label}</span>
              {state === "active" && (
                <span className="h-1.5 w-24 overflow-hidden rounded-full bg-white/15">
                  <span className="bar-fill block h-full w-2/3 rounded-full bg-gold" />
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="float absolute top-0 right-2 rounded-2xl bg-white px-4 py-2.5 text-[#1c1a33] shadow-xl">
        <p className="text-xs text-[#56536f]">Note globale</p>
        <p className="text-lg font-extrabold">
          84<span className="text-sm font-semibold text-[#56536f]">/100</span>
        </p>
      </div>

      <div className="float-delayed absolute bottom-0 left-0 rounded-2xl border border-white/10 bg-[#1a1560] px-4 py-2.5 text-white shadow-xl">
        <p className="text-xs text-white/70">À faire d&apos;abord</p>
        <p className="text-sm font-bold">Optimiser les images · 1,8 s</p>
      </div>
    </div>
  );
}
