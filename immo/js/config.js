/* ============================================================
   js/config.js
   Configuration centrale du hub — même structure que tech/js/config.js
   ============================================================ */

const CONFIG = {
  /* ── Feature flags ────────────────────────────────────────
     Passer à true quand :
     - alertes : endpoint alerte disponible ou modale branchée
     - ticker   : CORS ouvert + clé API valide
     - offres   : CORS ouvert + clé API valide
     --------------------------------------------------------- */
  FEATURES: {
    alertes: false, // bouton "Créer mon alerte" + modale
    ticker: false, // ticker offres défilantes sous le hero
    offres: false, // pas de grille "Dernières offres" sur ce hub (voir immo/AVANT_MISE_EN_PROD.md)
  },

  /* ── API ──────────────────────────────────────────────────
     Clé de staging. En prod : variable d'environnement serveur.
     ⚠️ Ne jamais commiter la vraie clé — voir organizationInstructions
     et immo/AVANT_MISE_EN_PROD.md.
     --------------------------------------------------------- */
  API_KEY: "REMPLACER_PAR_LA_CLÉ",
  API_BASE: "https://ce-search-api.staging.fcms.io",

  /* ── Paramètres secteur ───────────────────────────────────
     TODO : fonction/secteur réels à confirmer avec la tech (mêmes codes
     que l'API offres) — placeholders pour l'instant, non utilisés tant
     que FEATURES.offres/ticker sont à false.
     --------------------------------------------------------- */
  SECTOR: {
    label: "Immobilier",
    slug: "immobilier",
    fonction: "TODO",
    secteur: "TODO",
    contrat: "1,2,9,7",
    limit: 18,
    sort: "datePublication",
  },

  /* ── URLs ─────────────────────────────────────────────────
     --------------------------------------------------------- */
  URLS: {
    offre: "/emploi/detail_offre/",
    search: "/emploi/liste_offres",
    alerte: "/mon-compte/alertes",
    locations:
      "https://services.cadremploi.fr/services/suggestions/v1/locations/", // autocomplete géo (même endpoint que tech/, public)
  },

  /* ── Chiffres clés ───────────────────────────────────────
     Mettre à jour manuellement chaque trimestre — voir
     immo/AVANT_MISE_EN_PROD.md point 7.
     "offres" relevé en direct sur cadremploi.fr (requête "immobilier") le
     06/09/2026 — à redéfinir sur un filtre stable (fonction/secteur) plutôt
     qu'un mot-clé libre avant publication, cf. recommandation faite à Seb.
     --------------------------------------------------------- */
  CHIFFRES: {
    offres: "1 869", // hero eyebrow + 1er stat
    departements: "96", // 2e stat — départements suivis par le baromètre
    reseaux: "48", // 3e stat — réseaux et enseignes partenaires
  },

  /* ── Contenu éditorial ────────────────────────────────────
     ⚠️ Comme sur tech/ : le contenu éditorial (title, meta, H1, hero,
     tags de recherche) n'est pas piloté depuis ce fichier. Éditer
     directement le texte dans index.html.
     --------------------------------------------------------- */

  /* ── Autocomplete "poste" — liste statique, aucun appel API ──
     Catégories volontairement plus resserrées que tech/ (~230 entrées) :
     couvre les intitulés cadres les plus courants de l'immobilier, à
     enrichir au besoin sans casser le format attendu par main.js.
     --------------------------------------------------------- */
  // Liste À PLAT, volontairement — aucun regroupement par catégorie : un nom
  // de catégorie inventé par nous (ex. "Transaction & négociation") serait un
  // terme hors de cette liste, ce que Seb a explicitement demandé d'éviter.
  // Uniquement les intitulés fournis par Seb + "immobilier" en catch-all
  // (recherche la plus large possible, toutes les offres du secteur).
  JOBS_SUGGESTIONS: [
    "immobilier",
    "administrateur de biens",
    "agent commercial immobilier",
    "agent immobilier",
    "agent immobilier indépendant",
    "analyste immobilier",
    "asset manager immobilier",
    "assistant community manager",
    "assistant de copropriété",
    "assistant en gestion locative",
    "assistant immobilier",
    "chargé d'opération immobilière",
    "chargé d'opérations",
    "chargé de gestion locative",
    "chasseur immobilier",
    "chef de projet immobilier",
    "commercial bâtiment",
    "commercial en immobilier",
    "commercial VEFA",
    "comptable copropriété",
    "comptable gestion locative",
    "comptable syndic de copropriété",
    "conseiller commercial VEFA",
    "conseiller en financement immobilier",
    "conseiller en immobilier",
    "conseiller location",
    "constructeur de maisons individuelles",
    "consultant immobilier",
    "courtier travaux",
    "développeur foncier",
    "développeur immobilier",
    "diagnostiqueur immobilier",
    "directeur commercial immobilier",
    "directeur d'agence immobilière",
    "directeur de copropriété",
    "directeur de programme immobilier",
    "directeur gestion locative",
    "directeur immobilier",
    "directeur patrimoine immobilier",
    "directeur technique immobilier",
    "expert immobilier",
    "facility manager",
    "gestionnaire actif",
    "gestionnaire d'immeuble",
    "gestionnaire de copropriété",
    "gestionnaire de patrimoine immobilier",
    "gestionnaire de programme",
    "gestionnaire immobilier",
    "gestionnaire locatif",
    "gestionnaire syndic",
    "gestionnaire technique immobilier",
    "leasing manager",
    "lotisseur",
    "manager immobilier",
    "mandataire immobilier",
    "négociateur foncier",
    "négociateur immobilier",
    "principal de copropriété",
    "promoteur immobilier",
    "property manager",
    "prospecteur foncier",
    "responsable agence immobilière",
    "responsable copropriété",
    "responsable de programme immobilier",
    "responsable de site immobilier",
    "responsable développement immobilier",
    "responsable du développement foncier",
    "responsable foncier",
    "responsable gestion locative",
    "responsable habitat",
    "responsable immobilier",
    "responsable location",
    "responsable patrimoine immobilier",
    "responsable prescription",
    "responsable technique immobilier",
    "syndic de copropriété",
    "vendeur immobilier",
  ],
}
