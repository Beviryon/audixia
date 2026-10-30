# Audixia

Audixia, une solution [Trevixia](https://trevixia.com), est une application web d'audit de sites internet, basée sur l'API Google PageSpeed Insights. Saisissez une URL et obtenez un rapport avec des scores et des recommandations concrètes.

## Fonctionnalités

- Audit sur mobile ou sur ordinateur, avec validation de l'adresse saisie.
- Bilan en français simple : note globale (moyenne des domaines) et verdict.
- Scores de performance, d'accessibilité, de bonnes pratiques et de SEO.
- Core Web Vitals présentés comme le parcours du visiteur : LCP, CLS, TBT, FCP, et INP quand Google dispose de données réelles.
- Page de recommandations triées par impact, avec le gain estimé quand il existe.
- Capture d'écran de la page auditée, si disponible, et jusqu'à 6 écrans plus bas dans cette même page.
- Téléchargement du rapport complet en PDF.
- Écran d'attente détaillé et messages d'erreur en français.
- Interface responsive, en mode clair ou sombre selon l'appareil.

## Prérequis

- Node.js 20.9 ou plus récent
- Une clé API Google PageSpeed Insights

## Installation

```bash
npm install
```

## Configuration de la clé API

1. Ouvrez la [page de l'API PageSpeed Insights](https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com) dans Google Cloud Console, puis activez l'API.
2. Dans **API et services → Identifiants**, créez une clé API.
3. Limitez la clé à **PageSpeed Insights API** dans « Restrictions d'API ».
4. Copiez le fichier d'exemple :

   ```bash
   cp .env.example .env.local
   ```

   Sous PowerShell : `Copy-Item .env.example .env.local`

5. Renseignez la clé dans `.env.local`, jamais dans `.env.example` :

   ```env
   PAGESPEED_API_KEY=votre_cle
   ```

Le fichier `.env.local` ne doit jamais être partagé ni versionné. Redémarrez le serveur après l'avoir modifié.

## Lancement

```bash
npm run dev      # Développement, sur http://localhost:3000
npm run build    # Build de production
npm run start    # Lancement du build de production
npm run lint     # Vérification du code
```

Si le port 3000 est déjà pris, choisissez-en un autre : `npm run dev -- -p 3001`.

## Fonctionnement

La page `/rapport?url=…&strategie=mobile` appelle la route serveur `/api/audit`, qui interroge Google avec la clé et renvoie un rapport simplifié. La page `/rapport/recommandations` détaille toutes les recommandations. Le résultat est gardé uniquement le temps de l'onglet, pour changer de page sans relancer l'audit : un nouveau passage par le formulaire ou l'ouverture du lien dans un autre onglet lance un nouvel audit.

| Élément | Emplacement |
| --- | --- |
| Pages et route API | `app/` |
| Composants d'interface | `components/` |
| Appel à Google, analyse, erreurs et seuils | `lib/` |
| Types partagés | `types/` |

## Limites connues

- Les étapes de l'écran d'attente sont indicatives : Google transmet les résultats en une seule fois.
- Les scores varient d'un audit à l'autre, surtout en performance.
- Certains textes techniques de Google peuvent rester en anglais.
- La route `/api/audit` limite chaque adresse IP à 10 audits par tranche de 10 minutes. Les compteurs sont en mémoire : sur Vercel, chaque instance a les siens, donc cette limite freine les abus sans être stricte.

## Déploiement

Le projet se déploie sur Vercel. Ajoutez `PAGESPEED_API_KEY` dans les variables d'environnement du projet Vercel. Le fichier `vercel.json` autorise 120 secondes pour la route d'audit.

## Dépannage

| Problème | Solution |
| --- | --- |
| « Service non configuré » | Vérifiez que `.env.local` contient la clé, puis redémarrez le serveur. |
| « Clé d'accès refusée » | Vérifiez la clé et que l'API est activée sur le bon projet Google Cloud. |
| Couleurs qui ne s'appliquent pas | Arrêtez le serveur, supprimez le dossier `.next`, puis relancez. |
