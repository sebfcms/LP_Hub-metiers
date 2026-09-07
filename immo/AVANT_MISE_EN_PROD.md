# ✅ Checklist avant mise en production — landing `immo/`

> Spécifique à cette landing. Voir aussi la checklist commune à toutes les landings :
> [../AVANT_MISE_EN_PROD.md](../AVANT_MISE_EN_PROD.md) (workflow Git, visibilité du repo,
> cible de mise en prod).
>
> Cible actuelle : `www.cadremploi.fr/carriere/immobilier/` (+ `/agent-independant/` et
> `/barometre/<departement>/`) — à confirmer avec l'infra, comme pour `tech/`.

Contrairement à `tech/` (une seule page), `immo/` a **3 pages** : le hub
([immo/index.html](index.html)), la landing captation opt-in
([immo/agent-independant/index.html](agent-independant/index.html)) et le baromètre
départemental — dont [immo/barometre/rhone/index.html](barometre/rhone/index.html) n'est
aujourd'hui qu'un **exemple/gabarit** représentant ce qu'un futur générateur (script qui
interroge l'API Yanport) doit produire pour chacun des ~96 départements. Chaque item
ci-dessous précise à quelle(s) page(s) il s'applique.

---

## 1. SEO — Balises robots (les 3 pages)

**Fichiers :** `immo/index.html`, `immo/agent-independant/index.html`,
`immo/barometre/rhone/index.html` (et toute page département générée ensuite)

**Actuellement (staging) :**
```html
<meta name="robots" content="noindex, nofollow" />
```
**À changer en prod** (après validation infra du pattern d'URL) :
```html
<meta name="robots" content="index, follow" />
```

⚠️ Pour les pages baromètre en particulier : voir le point 8 (gating) avant d'indexer —
elles ne sont aujourd'hui protégées par aucun mécanisme d'accès réel.

---

## 2. Open Graph — image manquante

**Fichiers :** les 3 pages, balises `og:image` / `twitter:image`

Toutes pointent vers `.../carriere/immobilier/assets/og-immobilier-cadremploi.png`, qui
**n'existe pas encore** (contrairement à `tech/assets/og-tech-cadremploi.png`, déjà
produite). À faire produire par design, puis déposer dans `immo/assets/`.

---

## 3. Formulaire opt-in → Google Form

**Fichiers :** `immo/agent-independant/index.html` (le `<form id="optin-form">`) et
[immo/js/form.js](js/form.js)

Le formulaire poste directement vers un Google Form (pas de backend à héberger). Reste à
faire, marqué `TODO` dans les deux fichiers :

1. Créer le Google Form (3 champs : email, situation, département) + sa Google Sheet liée.
2. Récupérer l'URL réelle de soumission : dans le Form, "⋮" → **"Obtenir le lien
   préremplissable"**, remplir un brouillon, copier le lien généré — il contient
   `entry.XXXXXXX` pour chaque champ.
3. Remplacer dans `immo/agent-independant/index.html` :
   - l'`action` du `<form>` par `https://docs.google.com/forms/d/e/<FORM_ID>/formResponse`
   - chaque `name="entry.TODO_..."` par le `entry.XXXXXXX` réel du champ correspondant
4. Envoyer un test et vérifier que les 4 colonnes (email, situation, département,
   consentement) se remplissent dans la Google Sheet.
5. Décider qui a accès à cette Sheet (au minimum Seb + qui traite les leads) et si elle
   doit être connectée à un outil aval (CRM, séquence email...).

---

## 4. Générateur de pages département (API Yanport)

**Fichier de référence :** `immo/barometre/rhone/index.html` (gabarit) +
`immo/js/modal.js` (contrat de données `#villes-data`)

À écrire : un script (hors du front, exécuté par Seb / en CI) qui interroge l'API Yanport
et produit un `immo/barometre/<slug>/index.html` par département à partir de ce gabarit —
canonical, hero (score/gauge/note), comparatif avec les départements voisins, liste des
villes, `<script id="villes-data">` pour les villes prêtes, bloc partenaire résolu.

⚠️ **Clé API Yanport** : usage exclusif de ce script généré hors navigateur — ne jamais
l'écrire en clair dans un fichier commité (voir point 6, `.gitignore`).

⚠️ **Mandataires actifs** : le comptage agrégé par département (jamais ventilé par
réseau) est à faire valider avec Yanport au regard de leurs CGU avant toute mise en ligne
réelle des chiffres.

Une fois le générateur en place, mettre à jour :
- `immo/agent-independant/index.html` : liste complète des départements dans le
  `<select>` (aujourd'hui limitée aux 4 départements de démo) + la map
  `BAROMETRE_READY` dans `immo/js/form.js`
- `immo/barometre/rhone/index.html` : les cards `.region-card` du comparatif deviennent
  cliquables vers les départements déjà générés

---

## 5. Gating du baromètre après inscription

Le site est 100% statique : il n'existe **aucune protection d'accès réelle** aux pages
`immo/barometre/<departement>/`, qui restent atteignables par URL directe. Le
"déblocage après inscription" est aujourd'hui purement une redirection UX
(`immo/js/form.js`) + le `noindex, nofollow` du point 1. Si un vrai contrôle d'accès est
souhaité, c'est un sujet d'infra à part entière (hors périmètre "pages statiques") — à
en discuter avant de communiquer sur une "gate" auprès des équipes marketing/juridique.

---

## 6. Secrets — `.gitignore`

Un `.gitignore` racine a été ajouté (voir [../.gitignore](../.gitignore)) pour couvrir
un futur `.env` local (clé API Yanport du générateur, jamais commitée). Si le générateur
tourne un jour en CI plutôt qu'en local, la clé doit être portée par le mécanisme de
secrets de la CI — jamais copiée dans le repo.

---

## 7. Chiffres clés — Vérifier avant publication

**Fichiers :** `immo/index.html` (bandeau KPI + hero), `immo/barometre/rhone/index.html`
(bloc partenaire SAFTI, stat-strip Notaires de France)

- Chiffres hub (`2 340` offres, `48` réseaux, `96` départements, `18 500` cadres en veille) :
  à vérifier, comme pour `tech/CHIFFRES`.
- Note Trustpilot / pitch partenaire (SAFTI, IAD) : sujets à évoluer — prévoir un
  rafraîchissement périodique plutôt qu'une correction manuelle ponctuelle.
- Bloc "La reprise du marché" (Notaires de France, avril 2026) : périmé au prochain
  trimestre, à rafraîchir avec le même script que le point 4.

---

## 8. URL canonique et pattern de routage

Pattern visé : `cadremploi.fr/carriere/immobilier/`, `.../agent-independant/`,
`.../barometre/<departement>/` — **non confirmé officiellement par l'infra**, comme pour
`tech/` (voir [../AVANT_MISE_EN_PROD.md](../AVANT_MISE_EN_PROD.md) point 1).

---

## 9. CORS — si un appel API frontal est ajouté un jour

Aujourd'hui, `immo/` ne fait **aucun appel réseau côté navigateur** (contrairement à
`tech/js/api.js`) : toutes les données baromètre sont pré-générées dans le HTML. Si cela
change (ex. recherche d'offres immobilier en direct), reprendre le point CORS de
[tech/AVANT_MISE_EN_PROD.md](../tech/AVANT_MISE_EN_PROD.md) point 7.
