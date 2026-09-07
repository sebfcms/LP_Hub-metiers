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
│   ├── css/
│   │   ├── design-system-ce.css     ← design system PARTAGÉ — modifier ici,
│   │   │                               appliqué à toutes les landings
│   │   └── header-footer-shared.css ← CSS du header/footer prod, partagé
│   └── js/
│       └── header-footer-shared.js  ← comportement JS du header/footer prod
│                                        (menus, menu mobile, modale de connexion),
│                                        partagé entre toutes les landings
├── tech/                         ← landing "Tech & Digital" (1 page)
│   ├── index.html                → cible : www.cadremploi.fr/carriere/tech/
│   ├── css/
│   │   ├── base.css               ← reset + utilitaires globaux
│   │   ├── components.css         ← composants réutilisables (cards, tags, boutons...)
│   │   └── layout.css             ← header, hero, sections, footer
│   ├── js/
│   │   ├── config.js              ← config (clé API, endpoints, contenu éditorial)
│   │   ├── api.js                 ← appels API offres + autocomplete locations
│   │   ├── profiles.js            ← simulation profils live CVthèque
│   │   ├── ticker.js              ← ticker offres défilantes
│   │   ├── modal.js                ← modale alerte emploi
│   │   └── main.js                 ← initialisation et orchestration
│   └── assets/
│       └── og-tech-cadremploi.png ← image Open Graph/Twitter de cette landing
└── immo/                         ← landing "Immobilier" (3 pages — voir immo/AVANT_MISE_EN_PROD.md)
    ├── index.html                     → cible : .../carriere/immobilier/ (hub)
    ├── agent-independant/index.html   → landing captation opt-in (→ Google Form)
    ├── barometre/rhone/index.html     → baromètre départemental — gabarit du futur
    │                                     générateur Yanport (une page par département)
    ├── css/ (base.css, components.css, layout.css — même logique que tech/)
    ├── js/ (modal.js : calque détail ville · form.js : soumission Google Form)
    └── assets/                        ← image OG à produire (voir AVANT_MISE_EN_PROD.md)
```

Chaque landing est **autonome** (son propre `css/`, `js/`, `assets/`) et ne dépend que du
design system partagé en `assets/css/design-system-ce.css` — jamais dupliqué dans une
landing individuelle, pour éviter que la charte diverge entre les pages au fil du temps.

## Lancer en local

Toutes les méthodes servent le projet sur le **port 5500**, pour ne jamais avoir à retenir
plusieurs adresses selon la façon dont la preview a été lancée.

**Méthode par Claude** — demander à Claude Code de lancer la config `projet-reel`
(définie dans `.claude/launch.json`, un serveur Python statique sur le port 5500), puis
ouvrir :

```
http://localhost:5500/tech/
```

**Méthode rapide dans VS Code** — clic droit sur `tech/index.html` → **"Open with Live
Server"** (ou bouton "Go Live" en bas à droite), extension déjà réglée sur le port 5500
par défaut. Pratique pour éditer et voir le résultat se recharger automatiquement à
chaque sauvegarde, sans repasser par Claude.

Équivalent manuel en ligne de commande (sans Claude ni extension) :
```bash
python -m http.server 5500
```
puis ouvrir `http://localhost:5500/tech/`.

> ⚠️ Les appels API (`js/api.js`) sont désactivés par défaut (`CONFIG.FEATURES` à `false`
> dans `js/config.js`) — voir [tech/AVANT_MISE_EN_PROD.md](tech/AVANT_MISE_EN_PROD.md). Tant
> qu'ils sont désactivés, aucun appel réseau n'est fait vers l'API de staging.

## Ajouter une nouvelle landing métier

1. Dupliquer un dossier existant (ex. `tech/` → `<nom-landing>/`, ou `immo/` si la
   nouvelle landing a elle aussi plusieurs pages plutôt qu'une seule)
2. Lier `<link rel="stylesheet" href="../assets/css/design-system-ce.css" />` (chemin
   relatif à adapter selon la profondeur de la page) et
   `<link rel="stylesheet" href="../assets/css/header-footer-shared.css" />` en dernier —
   ne jamais dupliquer ces fichiers partagés
3. Reprendre tel quel le header/footer prod (balisage) + charger
   `<script src="../assets/js/header-footer-shared.js"></script>` juste avant
   `</body>` pour le comportement (menus, menu mobile, modale de connexion) — voir
   `immo/index.html` pour un exemple, ce script est partagé et ne se duplique pas
4. Adapter le contenu propre à la landing (config JS si la landing en a une, textes du
   HTML, données)
5. Mettre à jour canonical/`og:url`/JSON-LD vers `www.cadremploi.fr/carriere/<nom-landing>/`
6. Dupliquer `tech/AVANT_MISE_EN_PROD.md` (ou `immo/AVANT_MISE_EN_PROD.md` si plusieurs
   pages) → `<nom-landing>/AVANT_MISE_EN_PROD.md` et l'adapter (numéros de ligne, flags,
   chiffres, contenu propres à la nouvelle landing)
7. Travailler sur une branche dédiée, ouvrir une PR (jamais de commit direct sur `main`)

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
