# ✅ Checklist avant mise en production

> À faire par Seb + valider avec le CTO avant déploiement sur cadremploi.fr/tech

---

## 1. SEO — Balises robots

**Fichier :** `index.html` · ligne ~26

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

**Fichier :** `index.html` · lignes ~44 et ~65

**Actuellement (staging — pointe vers GitHub Pages) :**
```html
<meta property="og:image" content="https://sebfcms.github.io/LP_Hub-metiers/assets/og-tech-cadremploi.png" />
<meta name="twitter:image" content="https://sebfcms.github.io/LP_Hub-metiers/assets/og-tech-cadremploi.png" />
```

**À changer en prod (demander le chemin exact au CTO) :**
```html
<meta property="og:image" content="https://www.cadremploi.fr/tech/assets/og-tech-cadremploi.png" />
<meta name="twitter:image" content="https://www.cadremploi.fr/tech/assets/og-tech-cadremploi.png" />
```

---

## 3. Feature flags — Activer les blocs masqués

**Fichier :** `js/config.js` · lignes ~13-17

**Actuellement (désactivé) :**
```javascript
FEATURES: {
  alertes: false,   // boutons "Créer mon alerte" + modale
  ticker:  false,   // ticker offres défilantes sous le hero
  offres:  false,   // bloc "Dernières offres" (grille 6 cards)
},
```

**À activer en prod quand CORS ouvert + clé API valide (CTO) :**
```javascript
FEATURES: {
  alertes: true,
  ticker:  true,
  offres:  true,
},
```

> ⚠️ Ne pas activer avant que le CTO ait ouvert le CORS sur l'endpoint staging/prod.

---

## 4. Chiffres clés — Vérifier avant publication

**Fichier :** `js/config.js` · lignes ~53-59

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

## 5. GTM & CMP — Vérifier les IDs

**Fichier :** `index.html` · balises GTM en haut et bas de page

- Vérifier que l'ID GTM est bien celui de **production** (pas staging)
- Vérifier que la CMP est configurée pour le domaine `cadremploi.fr`

---

## 6. URL canonique

**Fichier :** `index.html` · ligne ~27

Vérifier que l'URL finale correspond bien à l'URL de déploiement :
```html
<link rel="canonical" href="https://www.cadremploi.fr/tech" />
```

---

## 7. CORS — Endpoint API offres

**Fichier :** `js/config.js`

Demander au CTO d'ouvrir le CORS sur l'endpoint prod :
```
GET https://ce-search-api.staging.fcms.io/web/offers
```
→ autoriser le domaine `https://www.cadremploi.fr`

---

## 8. Image OG — Déposer le fichier sur le serveur

Le fichier `assets/og-tech-cadremploi.png` (1200×630px) doit être déposé
par le CTO sur le serveur prod et accessible à l'URL déclarée dans les balises OG.

---

## Rappel workflow Git pour déployer une modification

```bash
git add .
git commit -m "Description de la modif"
git push
```

GitHub Pages se met à jour en 1-3 minutes après le push.
