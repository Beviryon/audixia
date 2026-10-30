"use client";

import { ErrorMessage } from "@/components/ErrorMessage";

// Affiché si une page plante de façon inattendue.
export default function Error() {
  return (
    <main className="flex flex-1 flex-col">
      <ErrorMessage code="unknown" />
    </main>
  );
}
