"use client";

import { useEffect, useState } from "react";

import { AuditScene, type AuditStepId } from "./illustrations/AuditScene";

type AuditStep = {
  id: AuditStepId;
  label: string;
  title: string;
  description: string;
  checks: string[];
  startsAt: number; // en secondes depuis le début de l'audit
};

// Google ne communique pas l'avancement : ces étapes s'enchaînent selon le temps écoulé.
const STEPS: AuditStep[] = [
  {
    id: "connection",
    label: "Ouverture",
    title: "Ouverture de votre site",
    description: "Google charge votre page dans un navigateur de test.",
    checks: ["Réponse du serveur", "Chargement du contenu", "Simulation de l'appareil choisi"],
    startsAt: 0,
  },
  {
    id: "performance",
    label: "Vitesse",
    title: "Mesure de la vitesse",
    description: "Combien de temps faut-il pour voir et utiliser la page ?",
    checks: ["Affichage du contenu principal", "Stabilité de la mise en page", "Temps de blocage du navigateur"],
    startsAt: 6,
  },
  {
    id: "accessibility",
    label: "Accessibilité",
    title: "Contrôle de l'accessibilité",
    description: "La page reste-t-elle lisible et utilisable par chacun ?",
    checks: ["Contraste des textes", "Descriptions des images", "Noms des liens et des boutons"],
    startsAt: 18,
  },
  {
    id: "best-practices",
    label: "Fiabilité",
    title: "Vérification de la fiabilité",
    description: "Le site respecte-t-il les bonnes pratiques du web ?",
    checks: ["Connexion sécurisée", "Erreurs dans le navigateur", "Proportions des images"],
    startsAt: 28,
  },
  {
    id: "seo",
    label: "Référencement",
    title: "Analyse du référencement",
    description: "Les moteurs de recherche peuvent-ils comprendre la page ?",
    checks: ["Titre de la page", "Méta-description", "Liens explorables et descriptifs"],
    startsAt: 36,
  },
  {
    id: "recommendations",
    label: "Bilan",
    title: "Préparation de votre bilan",
    description: "Dernière ligne droite : nous classons vos priorités.",
    checks: ["Calcul des scores", "Estimation des gains", "Classement des priorités"],
    startsAt: 44,
  },
];

const TIPS = [
  "Une page qui bouge pendant le chargement peut provoquer de mauvais clics.",
  "Compresser ses images est souvent l'un des gains les plus simples.",
  "Un bon contraste aide tout le monde, surtout en plein soleil sur mobile.",
  "Un titre de page clair aide à la fois les visiteurs et les moteurs de recherche.",
  "Votre site doit aussi être rapide sur un téléphone modeste, pas seulement sur le vôtre.",
];

const ESTIMATED_DURATION_S = 50;
const TIP_DURATION_S = 7;

function getCurrentStepIndex(elapsed: number): number {
  return STEPS.findLastIndex((step) => elapsed >= step.startsAt);
}

type LoadingStateProps = {
  url?: string;
};

export function LoadingState({ url }: LoadingStateProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentIndex = getCurrentStepIndex(elapsed);
  const current = STEPS[currentIndex];
  // La progression reste sous 95 % : la fin réelle dépend de la réponse de Google.
  const progress = Math.min(95, (elapsed / ESTIMATED_DURATION_S) * 100);
  const tip = TIPS[Math.floor(elapsed / TIP_DURATION_S) % TIPS.length];

  return (
    <div className="audit-stage relative flex flex-1 flex-col justify-center overflow-hidden text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="stage-grid" />
        <span className="stage-blob stage-blob-1" />
        <span className="stage-blob stage-blob-2" />
      </div>

      <div className="page-container relative flex flex-col gap-6 py-6 sm:py-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Votre bilan se prépare</h1>
            {url && <p className="wrap-break-word font-mono text-sm text-slate-300">{url}</p>}
          </div>
          <p className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-sm tabular-nums">
            <span className="font-semibold">{elapsed} s</span>
            <span className="text-slate-300"> · environ 20 à 60 s</span>
          </p>
        </header>

        <div className="grid items-center gap-6 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <div className="mx-auto w-full max-w-3xl">
            <AuditScene step={current.id} />
          </div>

          <div key={current.id} className="scene-text flex flex-col gap-4">
            <p className="font-mono text-sm text-gold">
              Étape {currentIndex + 1} sur {STEPS.length}
            </p>
            <p role="status" className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {current.title}
            </p>
            <p className="text-lg leading-7 text-slate-200">{current.description}</p>
            <ul className="flex flex-col gap-2.5">
              {current.checks.map((check, index) => (
                <li
                  key={check}
                  className="check-pop flex items-center gap-3"
                  style={{ animationDelay: `${0.25 + index * 0.25}s` }}
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-gold" />
                  {check}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mt-4 mb-6 sm:mb-8">
          <div className="h-1 rounded-full bg-white/15" />
          <div
            className="absolute top-0 left-0 h-1 rounded-full bg-linear-to-r from-lilac to-gold transition-[width] duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
          <span
            aria-hidden="true"
            className="progress-head absolute top-0.5 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold transition-[left] duration-1000 ease-linear"
            style={{ left: `${progress}%` }}
          />

          <ol aria-label="Étapes de l'audit">
            {STEPS.map(({ id, label, startsAt }, index) => {
              const isCurrent = index === currentIndex;
              const isDone = index < currentIndex;

              return (
                <li
                  key={id}
                  aria-current={isCurrent ? "step" : undefined}
                  className="absolute top-3 hidden -translate-x-1/2 text-xs whitespace-nowrap first:translate-x-0 md:block"
                  style={{ left: `${(startsAt / ESTIMATED_DURATION_S) * 100}%` }}
                >
                  <span className={isCurrent ? "font-semibold text-gold" : isDone ? "text-slate-200" : "text-slate-400"}>
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p key={tip} className="scene-text">
            <span className="mr-2 font-semibold text-gold">Bon à savoir</span>
            {tip}
          </p>
          <p className="shrink-0 text-xs text-slate-300">
            Étapes indicatives. Gardez cette page ouverte, le bilan s&apos;affichera tout seul.
          </p>
        </div>
      </div>
    </div>
  );
}
