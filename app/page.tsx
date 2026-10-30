import { AuditForm } from "@/components/AuditForm";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Eyebrow } from "@/components/Eyebrow";
import { HeroIllustration } from "@/components/illustrations/HeroIllustration";
import type { CategoryId } from "@/types/audit";

const PROMISES = ["Bilan en français clair", "Priorités classées par impact", "Rapport PDF à télécharger"];

const CHECKS: { id: CategoryId; title: string; description: string }[] = [
  { id: "performance", title: "Performance", description: "Vitesse d'affichage et réactivité" },
  { id: "accessibility", title: "Accessibilité", description: "Une page utilisable par tous" },
  { id: "best-practices", title: "Bonnes pratiques", description: "Sécurité et qualité technique" },
  { id: "seo", title: "SEO", description: "Visibilité sur les moteurs de recherche" },
];

const STEPS = [
  { title: "Saisissez l'adresse", description: "Choisissez le site à analyser, sur mobile ou sur ordinateur." },
  { title: "Laissez Google analyser", description: "La page est testée par Google, en 20 à 60 secondes." },
  { title: "Passez à l'action", description: "Lisez votre bilan, suivez vos priorités et téléchargez le rapport." },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col overflow-x-clip">
      <section className="audit-stage relative overflow-hidden text-white">
        <span aria-hidden="true" className="stage-grid" />
        <div className="page-container relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="rise flex flex-col gap-7">
            <Eyebrow className="text-lilac">Audit de site internet</Eyebrow>
            <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
              Votre site, audité.
              <span className="block text-gold">Vos priorités, claires.</span>
            </h1>
            <p className="max-w-xl text-lg leading-8 text-white/75">
              Audixia analyse votre site et traduit les résultats en un bilan simple, avec les
              actions qui comptent vraiment pour vos visiteurs.
            </p>
            <AuditForm />
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75">
              {PROMISES.map((promise) => (
                <li key={promise} className="flex items-center gap-2">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4 text-gold">
                    <path d="m5 10.500 3.500 3.500L15 7" />
                  </svg>
                  {promise}
                </li>
              ))}
            </ul>
          </div>
          <div className="rise" style={{ animationDelay: "150ms" }}>
            <HeroIllustration />
          </div>
        </div>
      </section>

      <section aria-labelledby="checks-title" className="page-container flex flex-col gap-4 py-14 sm:py-20">
        <Eyebrow>Ce que nous analysons</Eyebrow>
        <h2 id="checks-title" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Quatre domaines, un seul bilan
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CHECKS.map(({ id, title, description }) => (
            <li
              key={id}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-background p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10"
            >
              <CategoryIcon category={id} size="lg" />
              <div>
                <p className="font-bold">{title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="steps-title" className="bg-surface">
        <div className="page-container flex flex-col gap-4 py-14 sm:py-20">
          <Eyebrow>Notre méthode</Eyebrow>
          <h2 id="steps-title" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Un audit clair, en trois étapes
          </h2>
          <ol className="mt-6 grid gap-8 md:grid-cols-3">
            {STEPS.map(({ title, description }, index) => (
              <li key={title} className="flex gap-4 md:flex-col">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-accent-contrast">
                  {index + 1}
                </span>
                <div>
                  <p className="font-bold">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
