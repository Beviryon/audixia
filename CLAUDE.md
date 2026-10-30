# Audixia

@AGENTS.md

Application web d'audit de sites internet. L'utilisateur saisit une URL, lance l'audit et obtient un rapport avec des scores et des recommandations concrètes.

Audixia est une solution de Trevixia (trevixia.com) : elle en reprend l'identité (fond encre `#0d0b26`, violet `#3107af`, ambre `#ffc35a`, Plus Jakarta Sans, boutons en pastille, surtitres en majuscules) avec son propre logo.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- API Google PageSpeed Insights v5 (catégories performance, accessibility, best-practices, seo)
- Pas de base de données pour l'instant

## Règles

- Toute l'interface est en français.
- Design moderne, sobre et responsive (mobile d'abord).
- Code propre, typé, découpé en composants réutilisables, commentaires en français.
- La clé `PAGESPEED_API_KEY` reste dans `.env.local` et n'est jamais exposée côté client. Seule la route API l'utilise.
- `.env.example` ne contient jamais de vraie clé.

## Fonctionnalités du MVP

1. Accueil : présentation, champ URL, bouton « Auditer », choix mobile / ordinateur.
2. Validation de l'URL : ajout de `https://` si absent, refus des URL invalides.
3. Rapport :
   - note globale et verdict en français simple (`lib/verdict.ts`) ;
   - 4 scores sur 100 en barres colorées (rouge < 50, orange 50-89, vert ≥ 90) ;
   - Core Web Vitals (LCP, CLS, INP/TBT, FCP) avec valeur et statut, présentés comme le parcours du visiteur ;
   - recommandations triées par impact, avec le gain estimé quand il existe ;
   - capture d'écran si disponible.
4. Chargement avec message rassurant (l'audit dure 20 à 60 secondes).
5. Erreurs en français : URL invalide, site injoignable, quota dépassé, clé manquante.

## Décisions

- Le formulaire redirige vers `/rapport?url=…&strategie=mobile`, page qui appelle `/api/audit`. Le rapport est partageable. Le résultat est gardé dans `sessionStorage` (`lib/report-cache.ts`) pour naviguer sans relancer l'audit ; le formulaire force un nouvel audit.
- `/rapport` affiche le bilan et les 3 priorités ; `/rapport/recommandations` affiche la liste complète, groupée par impact et filtrable par catégorie.
- Core Web Vitals : mesures Lighthouse pour LCP, CLS, FCP et TBT (disponibles pour tous les sites), plus l'INP réel des données Chrome quand il existe.
- Les URL locales ou privées sont refusées, car Google ne peut pas les atteindre.

- Le rapport suit la même alternance que trevixia.com : bandeau encre tramé, sections blanches et lilas, surtitres avec un trait.
- Le rapport ne doit pas ressembler à PageSpeed : pas de jauges circulaires ni de simple liste de mesures, mais un bilan rédigé en français simple.
- Design : style clair épuré, mode clair ou sombre selon le système. Les couleurs sont définies une seule fois, dans `app/globals.css` (`bg-surface`, `text-muted`, `border-line`, `text-good`…).
- La clé de production se configure dans les variables d'environnement de Vercel, jamais dans le dépôt.

## Structure

- `app/api/audit/route.ts` : seule route qui déclenche un audit, côté serveur.
- `lib/pagespeed.ts` : appel à Google (module `server-only`, clé envoyée par en-tête).
- `lib/parse-report.ts` : réponse de Google → type `AuditResult`.
- `lib/errors.ts` : codes d'erreur, messages en français et traduction des erreurs Google.
- `lib/scoring.ts` : seuils, statuts, impact et tri des recommandations.
- `lib/report-pdf.tsx` : rapport PDF généré dans le navigateur avec `@react-pdf/renderer`, chargé uniquement au clic. Ses polices standard ne couvrent pas tous les caractères : passer les textes par `clean()`.
- `components/AuditRunner.tsx` : appelle la route et choisit entre chargement, rapport et erreur.
- `components/LoadingState.tsx` et `components/illustrations/AuditScene.tsx` : écran d'attente très illustré et animé, mais professionnel (demande explicite : ni sobre, ni enfantin, donc pas de mascotte, confettis ou couleurs bonbon ; plutôt des visuels d'outil d'analyse). Ses étapes sont indicatives : Google ne transmet aucun avancement.
- Dans les SVG animés, garder le `transform` de position sur un groupe parent : une animation CSS remplace le `transform` de l'élément qu'elle anime.

## Environnement

- Le port 3000 est pris par un autre projet local : lancer avec `npm run dev -- -p 3001`.
- Si un style de `globals.css` ne s'applique pas, le cache a gardé une ancienne version : supprimer `.next/cache` avant un build. Un `next dev` déjà lancé peut aussi servir l'ancien CSS : l'arrêter, supprimer `.next`, puis le relancer.

## Méthode de travail

- Présenter le plan et attendre la validation avant de coder.
- Avancer étape par étape et indiquer comment tester à la fin de chaque étape.
- Si un choix technique est ambigu, poser la question plutôt que de deviner.
- Dépôt GitHub `Beviryon/audixia`, déployé sur Vercel (`audixia.trevixia.com`), avec le DNS chez LWS. Ne faire de commit ou de push que sur demande.
