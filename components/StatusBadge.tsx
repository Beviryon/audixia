import type { Tone } from "@/lib/scoring";

const TONE_CLASSES: Record<Tone, string> = {
  good: "bg-good-soft text-good",
  average: "bg-average-soft text-average",
  poor: "bg-poor-soft text-poor",
};

type StatusBadgeProps = {
  tone: Tone;
  label: string;
};

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {label}
    </span>
  );
}
