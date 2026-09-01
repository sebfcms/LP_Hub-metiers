# ✅ Checklist avant mise en production — landing `tech/`

> À faire par Seb + valider avec la tech avant tout déploiement réel sur cadremploi.fr.
> Cible actuelle : `www.cadremploi.fr/carriere/tech/` — à confirmer avec l'infra
> (pattern d'URL et mécanisme de routage pas encore validés officiellement).

---

## 1. SEO — Balises robots

**Fichier :** `tech/index.html` · ligne ~26

**Actuellement (staging) :**

```html
<meta name="robots" content="noindex, nofollow" />
```

**À changer en prod :**

```html
<meta name="robots" content="index, follow" />
```

---

## 2. Open Graph — URLs images

**Fichier :** `tech/index.html` · balises `og:image` et `twitter:image`

**✅ Déjà fait** — pointent désormais vers le pattern de prod cible plutôt que vers l'URL
de test GitHub Pages :

```html
<meta property="og:image" content="https://www.cadremploi.fr/carriere/tech/assets/og-tech-cadremploi.png" />
<meta name="twitter:image" content="https://www.cadremploi.fr/carriere/tech/assets/og-tech-cadremploi.png" />
```

⚠️ Suppose que les assets sont servis au même chemin que la page (`/carriere/tech/assets/...`).
**À confirmer avec l'infra** — si les images finissent sur un CDN dédié (ex. `static.cadremploi.fr`),
ces URLs devront être ajustées.

---

## 3. Feature flags — Activer les blocs masqués

**Fichier :** `tech/js/config.js` · ligne ~13

**Actuellement (désactivé) :**

```javascript
FEATURES: {
  alertes: false,   // boutons "Créer mon alerte" + modale
  ticker:  false,   // ticker offres défilantes sous le hero
  offres:  false,   // bloc "Dernières offres" (grille 6 cards)
},
```

**À activer en prod quand CORS ouvert + clé API valide (voir point 7) :**

```javascript
FEATURES: {
  alertes: true,
  ticker:  true,
  offres:  true,
},
```

> ✅ Depuis la réorganisation du repo, `tech/js/main.js` ne fait plus l'appel API
> (`fetchOffres`) tant que `FEATURES.offres`/`FEATURES.ticker` sont à `false` — avant,
> l'appel partait quand même en arrière-plan malgré les flags, provoquant un échec CORS
> systématique. Rien à changer côté code pour activer : basculer les flags à `true`
> suffit, une fois l'endpoint prod prêt et le CORS ouvert.

---

## 4. Chiffres clés — Vérifier avant publication

**Fichier :** `tech/js/config.js` · ligne ~53

```javascript
CHIFFRES: {
  offres:      '4 200',   // ← vérifier le chiffre réel
  salaire:     '72k€',    // ← vérifier (source : offres BigQuery)
  salaire_pct: '92%',     // ← vérifier (% offres avec salaire affiché)
  cvtheque:    121106,    // ← mettre à jour chaque trimestre
  entreprises: 1840,      // ← vérifier
},
```

---

## 5. Contenu & liens

**Fichier :** `tech/index.html`

- Bien valider les contenus (copy hero, CVthèque, etc.)
- Vérifier les liens vers les offres (bon format) et s'assurer d'un bon volume d'offres
  (à recouper avec APEC et autres sources après ouverture de l'API)

---

## 6. URL canonique et pattern de routage

**Fichier :** `tech/index.html` · ligne ~27

**✅ Déjà mis à jour** vers le pattern "hub par métier" :

```html
<link rel="canonical" href="https://www.cadremploi.fr/carriere/tech/" />
```

Pattern général visé : `cadremploi.fr/carriere/<nom-landing>/`, un dossier du repo =
une landing (voir [README.md](README.md)). **Non confirmé officiellement par l'infra** —
à valider avant que ce soit considéré comme définitif (échange en cours avec le CTO sur
le process de mise en ligne).

---

## 7. CORS — Endpoint API offres

**Fichier :** `tech/js/config.js`

Demander à la tech d'ouvrir le CORS sur l'endpoint prod (l'URL de staging ci-dessous
n'est qu'une référence, il faudra appeler l'endpoint de **production**, pas celui-ci) :

```
GET https://ce-search-api.staging.fcms.io/web/offers
```

→ autoriser le domaine `https://www.cadremploi.fr`

---

## 8. Visibilité du repo

Le repo GitHub est aujourd'hui **public**. À passer en privé avant la mise en prod réelle
(Settings → Danger Zone → Change repository visibility). ⚠️ Sur un compte GitHub gratuit,
passer en privé désactive GitHub Pages — l'URL de recette actuelle
(`sebfcms.github.io/LP_Hub-metiers/tech/`) cessera de fonctionner. Prévoir un autre moyen
de recette si besoin à ce moment-là (serveur local, ou environnement de recette fourni
par l'infra).

---

## Workflow Git

Jamais de commit direct sur `main`. Pour toute modification :

```bash
git checkout -b nom-de-la-branche
# ... modifications ...
git add -A
git commit -m "Description de la modif"
git push -u origin nom-de-la-branche
# ouvrir une Pull Request vers main, faire relire, merger
```
