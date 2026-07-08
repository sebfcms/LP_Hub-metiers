# Cadremploi — Hubs sectoriels

Landing pages sectorielles pour Cadremploi.
Actuellement en SPA (HTML/CSS/JS). Migration Next.js prévue en V2.

## Structure du projet

```
cadremploi-hubs/
├── index.html              ← Hub Tech & Digital (page principale)
├── sectors/
│   ├── sante.html          ← Hub Santé (à créer)
│   ├── finance.html        ← Hub Finance (à créer)
│   └── industrie.html      ← Hub Industrie (à créer)
├── css/
│   ├── tokens.css          ← Design tokens Cadremploi (couleurs, typo, radius...)
│   ├── base.css            ← Reset + utilitaires globaux
│   ├── components.css      ← Composants réutilisables (cards, tags, boutons...)
│   └── layout.css          ← Header, hero, sections, footer
├── js/
│   ├── config.js           ← Configuration (clé API, endpoints, paramètres secteur)
│   ├── api.js              ← Appels API offres + locations autocomplete
│   ├── profiles.js         ← Simulation profils live CVthèque
│   ├── ticker.js           ← Ticker défilement offres
│   ├── modal.js            ← Modale alerte emploi
│   └── main.js             ← Initialisation et orchestration
└── assets/
    └── icons/              ← SVG icons (Lucide)
```

## Lancer en local

Ouvrir `index.html` dans Chrome.

> ⚠️ L'appel API nécessite ModHeader (extension Chrome) pour injecter le header `x-api-key`.
> Voir section Configuration ci-dessous.

## Configuration

Modifier `js/config.js` :
```js
const CONFIG = {
  API_KEY: 'ta-clé-ici',       // clé API staging
  API_BASE: 'https://ce-search-api.staging.fcms.io',
  SECTOR: { ... }              // paramètres du secteur
}
```

## Dupliquer pour un nouveau secteur

1. Copier `index.html` → `sectors/sante.html`
2. Modifier `js/config.js` : changer `SECTOR.fonction`, `SECTOR.label`, etc.
3. Adapter les textes dans le HTML (titre H1, copy CVthèque...)
4. C'est tout.

## Migration Next.js (V2)

Chaque fichier JS correspond à un futur composant :
- `js/api.js`      → `lib/api.ts` + Server Component fetch
- `js/profiles.js` → `components/ui/ProfilesLive.tsx` (Client Component)
- `js/ticker.js`   → `components/ui/Ticker.tsx` (Client Component)
- `js/modal.js`    → `components/ui/AlerteModal.tsx` (Client Component)
- `css/tokens.css` → `app/globals.css` (tokens identiques)
