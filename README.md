# Cadremploi — Landing pages métier

Landing pages statiques (HTML/CSS/JS, sans framework) pour Cadremploi, organisées en
mono-repo : un dossier par landing, un design system partagé.

## Structure du projet

```
LP_Hub-metiers/
├── .claude/
│   ├── launch.json               ← config du serveur de preview local
│   └── skills/
│       └── design-system-ce/     ← skill Claude Code : charte Cadremploi
│                                    (vérifiée contre le repo ce-front)
├── assets/
│   └── css/
│       └── design-system-ce.css  ← design system PARTAGÉ — modifier ici,
│                                    appliqué à toutes les landings
└── tech/                         ← landing "Tech & Digital"
    ├── index.html                → cible : www.cadremploi.fr/carriere/tech/
    ├── css/
    │   ├── base.css               ← reset + utilitaires globaux
    │   ├── components.css         ← composants réutilisables (cards, tags, boutons...)
    │   └── layout.css             ← header, hero, sections, footer
    ├── js/
    │   ├── config.js              ← config (clé API, endpoints, contenu éditorial)
    │   ├── api.js                 ← appels API offres + autocomplete locations
    │   ├── profiles.js            ← simulation profils live CVthèque
    │   ├── ticker.js              ← ticker offres défilantes
    │   ├── modal.js                ← modale alerte emploi
    │   └── main.js                 ← initialisation et orchestration
    └── assets/
        └── og-tech-cadremploi.png ← image Open Graph/Twitter de cette landing
```

Chaque landing est **autonome** (son propre `css/`, `js/`, `assets/`) et ne dépend que du
design system partagé en `assets/css/design-system-ce.css` — jamais dupliqué dans une
landing individuelle, pour éviter que la charte diverge entre les pages au fil du temps.

## Lancer en local

Config de preview déjà en place dans `.claude/launch.json` (serveur Python statique sur
le port 8094). Avec Claude Code, demander de lancer la config `projet-reel`, puis ouvrir :

```
http://localhost:8094/tech/
```

Sans Claude Code, équivalent manuel :
```bash
python -m http.server 8094
```
puis ouvrir `http://localhost:8094/tech/`.

> ⚠️ Les appels API (`js/api.js`) sont désactivés par défaut (`CONFIG.FEATURES` à `false`
> dans `js/config.js`) — voir [tech/AVANT_MISE_EN_PROD.md](tech/AVANT_MISE_EN_PROD.md). Tant
> qu'ils sont désactivés, aucun appel réseau n'est fait vers l'API de staging.

## Ajouter une nouvelle landing métier

1. Dupliquer un dossier existant (ex. `tech/` → `immobilier/`)
2. Lier `<link rel="stylesheet" href="../assets/css/design-system-ce.css" />` en premier
   dans le nouveau `index.html` (chemin relatif vers le design system partagé — ne pas
   dupliquer ce fichier)
3. Adapter `js/config.js` (`SECTOR`, `CONTENT`, `CHIFFRES`, `PROFILES_POOL`...) et les
   textes du HTML
4. Mettre à jour canonical/`og:url`/JSON-LD vers `www.cadremploi.fr/carriere/<nom-landing>/`
5. Dupliquer `tech/AVANT_MISE_EN_PROD.md` → `<nom-landing>/AVANT_MISE_EN_PROD.md` et l'adapter
   (numéros de ligne, flags, chiffres, contenu propres à la nouvelle landing)
6. Travailler sur une branche dédiée, ouvrir une PR (jamais de commit direct sur `main`)

## Design system

Voir le skill [.claude/skills/design-system-ce/](.claude/skills/design-system-ce/SKILL.md)
pour les règles complètes (nuancier, typographie, radius, composants) — vérifiées contre
le repo de production `figarocms/ce-front`. Le fichier CSS partagé correspondant est
[assets/css/design-system-ce.css](assets/css/design-system-ce.css).

## Cible de mise en production

Ces pages sont aujourd'hui des **prototypes statiques** (`noindex, nofollow`), hébergés
sur GitHub Pages pour recette visuelle uniquement. Le pipeline de mise en prod réelle
sur `cadremploi.fr` n'est pas encore défini — discussion en cours avec l'équipe infra,
probablement inspiré du fonctionnement de `ce-spark`. Le vrai Cadremploi tourne en
Vue/Nuxt (`ce-front`) ; si ces landings sont un jour intégrées nativement à l'app plutôt
que servies en statique, ce sera vers ce stack-là — rien n'est tranché à ce stade.

Voir [AVANT_MISE_EN_PROD.md](AVANT_MISE_EN_PROD.md) pour la checklist commune à toutes les
landings, et [tech/AVANT_MISE_EN_PROD.md](tech/AVANT_MISE_EN_PROD.md) pour celle spécifique
à `tech/` (chaque landing a la sienne).
