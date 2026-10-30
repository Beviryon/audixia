import type { Strategy } from "@/types/audit";

type ScreenshotProps = {
  src: string;
  strategy: Strategy;
};

// Capture posée sur le bandeau sombre, dans un cadre de téléphone ou de navigateur.
export function Screenshot({ src, strategy }: ScreenshotProps) {
  const isMobile = strategy === "mobile";

  return (
    <figure className="rise flex min-w-0 flex-col items-center gap-3" style={{ animationDelay: "150ms" }}>
      {/* Image en data URL fournie par l'API : next/image n'apporte rien ici */}
      {isMobile ? (
        <div className="w-full max-w-60 overflow-hidden rounded-[2rem] border-8 border-[#2a2660] bg-[#2a2660] shadow-2xl shadow-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="Capture d'écran de la page auditée sur mobile" className="h-auto w-full rounded-[1.5rem]" />
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-2xl shadow-black/40">
          <div aria-hidden="true" className="flex gap-1.5 border-b border-white/10 px-3 py-2.5">
            <span className="size-2 rounded-full bg-white/30" />
            <span className="size-2 rounded-full bg-white/30" />
            <span className="size-2 rounded-full bg-white/30" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="Capture d'écran de la page auditée sur ordinateur" className="h-auto w-full" />
        </div>
      )}
      <figcaption className="text-sm text-white/70">La page telle que Google l&apos;a vue</figcaption>
    </figure>
  );
}
