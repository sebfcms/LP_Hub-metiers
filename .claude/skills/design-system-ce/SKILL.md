---
name: design-system-ce
description: >
  Applique le design system officiel de Cadremploi (nuancier couleurs,
  typographie, radius, composants) à toute landing page ou prototype
  HTML/CSS. Utiliser ce skill dès qu'on crée ou modifie une page pour
  Cadremploi, pour garantir la cohérence avec la charte réelle telle
  que vérifiée dans le repo de production figarocms/ce-front.
metadata:
  author: semartin
  version: "1.0"
  brand: cadremploi
  source-repo: figarocms/ce-front
  last-verified: "2026-08-07"
---

# Cadremploi — Design System (landing pages)

## Overview

Ce skill définit le design system **vérifié** de Cadremploi, à partir d'une lecture
directe du repo de production `figarocms/ce-front` (Nuxt 3 + Vuetify) — pas d'une
reconstitution approximative depuis une maquette. Les fichiers sources consultés :
`assets/scss/abstracts/_colors.scss`, `vuetify.config.ts`, `assets/scss/settings.scss`,
`assets/scss/base.scss`, et plusieurs composants réels de `components/home/*.vue`.

> [!IMPORTANT]
> Ce skill cible des **landing pages HTML/CSS statiques**, indépendantes de Nuxt/Vuetify
> (prototypes, pages de campagne, mockups stakeholders). Le jour où ces pages sont
> portées dans l'app `ce-front`, voir la section [Portabilité vers Vuetify](#portabilité-vers-ce-front--vuetify)
> pour la table d'équivalence.

Fichiers de référence, autonomes et copiables tels quels dans un nouveau projet :
- [references/cadremploi-tokens.css](references/cadremploi-tokens.css) — variables CSS
- [references/cadremploi-components.css](references/cadremploi-components.css) — composants prêts à l'emploi

## Quand utiliser

Appliquer ces règles à chaque fois que l'on :
- Crée une nouvelle landing page ou un prototype HTML/CSS pour Cadremploi
- Modifie le CSS ou les composants d'une page existante de ce type
- Construit un composant UI (bouton, badge, card, bannière CTA) qui doit porter la marque Cadremploi

## Instructions

### 1. Importer les tokens

```html
<link rel="stylesheet" href="references/cadremploi-tokens.css">
<link rel="stylesheet" href="references/cadremploi-components.css">
```

`cadremploi-components.css` importe déjà `cadremploi-tokens.css` — un seul lien suffit si vous
utilisez les composants prêts à l'emploi.

### 2. Couleurs — nuancier complet, pas une teinte par couleur

Le vrai design system est un nuancier Figma à 11 niveaux (50→950) par couleur, pas une couleur
plate. Toujours piocher dans l'échelle plutôt qu'inventer une variante :

| Famille | 50 (pâle) | 500 | 600 (usage principal) |
|---|---|---|---|
| Blue (primaire) | `#ECF0F9` | `#3E6AC1` | `#32559A` |
| Red (accent) | `#FFE6EF` | `#FD0261` | `#E6005A` |
| Grey (neutres) | `#F1F2F4` | `#6F7890` | `#575D70` |
| Purple (CVthèque) | `#F6EEF6` | `#A155AA` | `#84458C` |
| Green (succès) | `#E5FFF7` | `#00E59D` | `#00CC8B` |
| Warning | `#FEF0E6` | `#F97316` | `#D65B06` |
| Danger | `#FEECEF` | `#EF1038` | `#BF0D2C` |

Échelle complète (50 à 950) dans [references/cadremploi-tokens.css](references/cadremploi-tokens.css).

> [!WARNING]
> **Couleurs "legacy" — ne jamais les utiliser pour du nouveau travail.** Le fichier source
> `_colors.scss` marque explicitement un groupe de couleurs `// pas dans le nuancier — à migrer` :
> `#26AAE1` (primary legacy), `#814488` (purple legacy, alias "pyrholidon-purple-40"),
> `#F90404` (red legacy), etc. Elles apparaissent encore dans des écrans de production
> (ex. la bande du footer utilise `#26AAE1` legacy, pas `blue-600`) mais ne doivent pas
> être copiées dans une nouvelle page. Liste complète dans le bloc `LEGACY` de
> `cadremploi-tokens.css` — uniquement pour reconnaître du code existant.

### 3. Typographie

> [!TIP]
> Constat direct sur `pages/index.vue` et `components/home/*.vue` : la homepage entière,
> **titres compris**, utilise la police body Vuetify = **Inter**. `Poppins` existe
> (self-hosted, poids 400/500 seulement) mais n'apparaît que dans des composants
> spécifiques du parcours candidature (`JobDetails*`), pas sur les pages d'atterrissage.
> **Pour une landing page : Inter suffit.** Ne pas systématiser Poppins sans raison précise —
> et si vous l'utilisez, ne pas dépasser le poids 500 (600/700 = gras synthétique navigateur,
> pas de fichier woff2 chargé pour ces poids).

Échelle observée sur la vraie homepage (classes Vuetify `text-*`) :

| Usage | Taille | Poids |
|---|---|---|
| Titre de section (`h2`) | 24px (`text-h5`) | 700 |
| Titre de card | 16px (`text-subtitle-1`) | 700 |
| Texte courant de section | 14px (`text-body-2`) | 400 |
| Légende / mention secondaire | 12px (`text-caption`) | 400 |

### 4. Radius

> [!IMPORTANT]
> **8px est le standard**, pas 24px. Le radius `24-25px` (`rounded-xl` chez Vuetify) est
> réservé aux "cards statement" : cards outils (`HomeSectionOutils`), bannières CTA
> (`HomeDepotCV`), et la carte de recherche flottante de la homepage. Les badges utilisent
> 4px. Les chips/pills utilisent `9999px`.

| Élément | Radius |
|---|---|
| Badge | 4px |
| Bouton / card par défaut | 8px |
| Card "statement" (outils, bannière CTA, carte recherche) | 24px (25px sur la carte recherche exactement) |
| Chip / pill / bouton pill | 9999px |

### 5. Breakpoints

Les vrais breakpoints (`$ce-screen-breakpoint-*`) :

```
xxs: 375px · xs: 480px · sm: 600px · md: 960px (pivot mobile/desktop) · lg: 1280px · xl: 1920px
```

Le pivot mobile/desktop principal de tout `ce-front` est **960px**, pas 768px.

### 6. Composants

Table de décision — quel composant utiliser :

| Besoin | Classe | Pattern source réel |
|---|---|---|
| Titre + sous-titre de section | `.ce-section-title` / `.ce-section-subtitle` | `HomeSectionOutils.vue` |
| CTA principal plein | `.ce-btn.ce-btn--primary` ou `.ce-btn--cta` | `BaseButton.vue` |
| CTA secondaire | `.ce-btn.ce-btn--outline` | idem, `variant="outlined"` |
| CTA proéminent (dépôt CV, card outil) | `.ce-btn.ce-btn--pill` | `HomeDepotCV.vue`, `HomeSectionOutils.vue` |
| Badge de statut/catégorie | `.ce-badge--{blue,red,purple,green,grey}` | `JobPostingOfferBadge.vue` |
| Tag cliquable (ex. "emplois populaires") | `.ce-chip` | `HomeSearchBlockPopularJobs.vue` |
| Card outil (icône flottante + fond pastel) | `.ce-tool-card-wrapper` + `.ce-tool-card--{couleur}` | `HomeSectionOutils.vue` |
| Bannière CTA dégradée | `.ce-cta-banner` | `HomeDepotCV.vue` |
| Bande de recherche "hero" + carte flottante | `.ce-search-hero` + `.ce-search-card` | `JobSearch.vue` (`homeSearchBlock`) |

Tous les styles complets : [references/cadremploi-components.css](references/cadremploi-components.css).

> [!TIP]
> **Le bleu clair `#6588CD` (`blue-400`) est confirmé** comme couleur de la bande hero
> derrière la barre de recherche (300px desktop / 200px mobile) — pas un hero sombre avec
> grille. Un hero `naval-dark` + grille en fond, vu dans d'anciennes maquettes, **n'existe
> pas en production** : ne pas le réintroduire sans validation design.

### 7. Règles / anti-patterns

> [!IMPORTANT]
> - Toujours piocher dans le nuancier complet (`--ce-{couleur}-{niveau}`), jamais de hex en dur.
> - Jamais de couleur `legacy` sur une nouvelle page sans validation explicite.
> - `text-transform: none` sur les boutons — jamais d'uppercase forcé.
> - Radius 8px par défaut ; 24px réservé aux cards "statement", pas généralisé partout.
> - Le footer band de production utilise encore une couleur legacy (`#26AAE1`) : ne pas
>   la copier sur une nouvelle page tant que le design n'a pas tranché une couleur de
>   remplacement issue du nuancier (`blue-600` recommandé par défaut, à confirmer).
> - Unités `rem` pour les espacements custom (convention du repo, voir `project-guidelines.md`).

## Portabilité vers ce-front / Vuetify

Quand une page migre vers l'app Nuxt/Vuetify, voici l'équivalence directe entre les
tokens de ce skill et les noms réels du thème Vuetify (`vuetify.config.ts`) :

| Token vanille (`cadremploi-tokens.css`) | Nom Vuetify | Usage Vuetify |
|---|---|---|
| `--ce-blue-600` | `blue-600` | `color="blue-600"`, `class="bg-blue-600"` |
| `--ce-red-600` | `red-600` | `color="red-600"` |
| `--ce-grey-900` | `grey-900` | `class="text-grey-900"` |
| `.ce-btn` | `<BaseButton>` / `<v-btn>` | `variant="flat\|outlined\|tonal"`, `rounded="lg\|pill"` |
| `.ce-section-title` | `class="text-h5 font-weight-bold"` | — |
| `.ce-tool-card` | `<v-card rounded="xl" :color="...">` | voir `HomeSectionOutils.vue` |

À ce stade (pages statiques), il n'est pas nécessaire d'aller plus loin que cette table —
elle sert de pont le jour où le code doit être réécrit en composants Vuetify.

## Checklist de livraison

- [ ] Aucune couleur en dur — tout via `--ce-*`
- [ ] Aucune couleur `legacy` utilisée sans validation
- [ ] Radius : 8px par défaut, 24px seulement sur les cards statement
- [ ] Typo : Inter partout, sauf besoin ponctuel justifié de Poppins (poids ≤ 500)
- [ ] Breakpoint desktop/mobile testé à 960px, pas seulement 768px
- [ ] Boutons sans `text-transform: uppercase`
- [ ] Focus visible au clavier sur tous les éléments interactifs (`outline` ou `box-shadow`)

## Maintenance de ce skill

Ce skill a été vérifié une fois (2026-08-07) par lecture du repo `figarocms/ce-front`.
Le nuancier ou les composants peuvent évoluer côté production sans que ce fichier soit
mis à jour automatiquement. Avant un projet important, ou tous les quelques mois,
re-comparer `references/cadremploi-tokens.css` avec `assets/scss/abstracts/_colors.scss`
et `vuetify.config.ts` du repo source, et mettre à jour `last-verified` en frontmatter.

Pour dupliquer ce skill dans un nouveau projet de landing page : copier tout le dossier
`.claude/skills/design-system-ce/` (avec son sous-dossier `references/`).
