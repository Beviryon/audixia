import type { CategoryId } from "@/types/audit";

// Teintes décoratives, distinctes du rouge/orange/vert réservés aux scores.
const TILE_CLASSES: Record<CategoryId, string> = {
  performance: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  accessibility: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "best-practices": "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300",
  seo: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
};

const ICONS: Record<CategoryId, React.ReactNode> = {
  performance: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  accessibility: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M4 9c5 1.5 11 1.5 16 0M12 10v5m0 0-3 6m3-6 3 6" />
    </>
  ),
  "best-practices": (
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5" />
  ),
  seo: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5 21 21" />
    </>
  ),
};

type CategoryIconProps = {
  category: CategoryId;
  size?: "md" | "lg";
};

// Icône de catégorie sur une tuile colorée.
export function CategoryIcon({ category, size = "md" }: CategoryIconProps) {
  const dimensions = size === "lg" ? "size-12 rounded-xl" : "size-10 rounded-lg";

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center ${dimensions} ${TILE_CLASSES[category]}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={size === "lg" ? "size-6" : "size-5"}
      >
        {ICONS[category]}
      </svg>
    </span>
  );
}
