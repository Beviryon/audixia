import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  className?: string; // couleur du surtitre
};

// Petit surtitre en majuscules, précédé d'un trait.
export function Eyebrow({ children, className = "text-accent" }: EyebrowProps) {
  return (
    <p className={`flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase ${className}`}>
      <span aria-hidden="true" className="h-px w-6 bg-current" />
      {children}
    </p>
  );
}
