import type { CSSProperties } from "react";

import type { FullPageImage, Strategy } from "@/types/audit";

import { Eyebrow } from "./Eyebrow";

// Hauteur d'un écran par rapport à sa largeur, selon l'appareil simulé.
const SCREEN_RATIOS: Record<Strategy, number> = { mobile: 2, desktop: 0.7 };

// Positions à montrer : sous le premier écran, déjà visible dans la capture principale.
function getSectionOffsets(image: FullPageImage, screenHeight: number): number[] {
  const available = Math.floor((image.height - screenHeight) / screenHeight);
  const count = available >= 6 ? 6 : available >= 4 ? 4 : available;
  if (count < 2) return [];

  const last = image.height - screenHeight;
  const step = (last - screenHeight) / (count - 1);
  return Array.from({ length: count }, (_, index) => screenHeight + index * step);
}

type PageSectionsProps = {
  image: FullPageImage;
  strategy: Strategy;
};

// Découpe l'image de la page entière en plusieurs écrans, du haut vers le bas.
export function PageSections({ image, strategy }: PageSectionsProps) {
  const ratio = SCREEN_RATIOS[strategy];
  const screenHeight = image.width * ratio;
  const offsets = getSectionOffsets(image, screenHeight);
  if (offsets.length === 0) return null;

  // L'image est déclarée une seule fois : chaque écran la réutilise sans la dupliquer.
  const imageStyle = { "--full-page": `url("${image.src}")` } as CSSProperties;
  const columns =
    strategy === "mobile" || offsets.length === 6
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
      : "grid-cols-2 lg:grid-cols-4";

  return (
    <section aria-labelledby="sections-title" className="bg-surface">
      <div className="page-container flex flex-col gap-4 py-12 sm:py-16">
        <Eyebrow>Votre page en images</Eyebrow>
        <h2 id="sections-title" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Plus bas dans la page
        </h2>
        <ul style={imageStyle} className={`mt-4 grid gap-4 ${columns}`}>
          {offsets.map((offset, index) => (
            <li key={offset}>
              <div
                role="img"
                aria-label={`Section ${index + 1} sur ${offsets.length} de la page auditée`}
                className="overflow-hidden rounded-2xl border border-line bg-background bg-no-repeat shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10"
                style={{
                  aspectRatio: `1 / ${ratio}`,
                  backgroundImage: "var(--full-page)",
                  backgroundSize: "100% auto",
                  backgroundPositionY: `${(offset / (image.height - screenHeight)) * 100}%`,
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
