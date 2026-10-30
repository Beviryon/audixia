import type { Metadata } from "next";
import { Suspense } from "react";

import { AuditPage } from "@/components/AuditPage";
import { LoadingState } from "@/components/LoadingState";

export const metadata: Metadata = {
  title: "Recommandations – Audixia",
};

export default function RecommandationsPage({ searchParams }: PageProps<"/rapport/recommandations">) {
  return (
    <main className="flex flex-1 flex-col">
      {/* Next.js exige Suspense autour de la lecture des paramètres d'URL */}
      <Suspense fallback={<LoadingState />}>
        <AuditPage searchParams={searchParams} view="recommendations" />
      </Suspense>
    </main>
  );
}
