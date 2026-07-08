/* ============================================================
   js/config.js
   Configuration centrale — modifier ici pour chaque secteur
   ============================================================ */

const CONFIG = {
  /* ── Feature flags ────────────────────────────────────────
     Passer à true quand :
     - alertes : endpoint alerte disponible ou modale branchée
     - ticker   : CORS ouvert + clé API valide
     - offres   : CORS ouvert + clé API valide
     --------------------------------------------------------- */
  FEATURES: {
    alertes: false, // boutons "Créer mon alerte" + modale
    ticker: false, // ticker offres défilantes sous le hero
    offres: false, // bloc "Dernières offres" (grille 6 cards)
  },

  /* ── API ──────────────────────────────────────────────────
     Clé de staging. En prod : variable d'environnement serveur
     --------------------------------------------------------- */
  API_KEY: "REMPLACER_PAR_LA_CLÉ",
  API_BASE: "https://ce-search-api.staging.fcms.io",

  /* ── Paramètres secteur ───────────────────────────────────
     Changer ces valeurs pour dupliquer vers un autre secteur
     --------------------------------------------------------- */
  SECTOR: {
    label: "Tech & Digital", // affiché dans la pill header
    slug: "tech", // utilisé dans les URLs
    fonction: "20700,20500", // codes fonction API
    secteur: "40000", // code secteur API
    contrat: "1,2,9,7", // types de contrats
    limit: 18, // nb offres max
    sort: "datePublication", // tri
  },

  /* ── URLs ─────────────────────────────────────────────────
     Adapter selon l'environnement
     --------------------------------------------------------- */
  URLS: {
    offre: "/emploi/detail_offre/", // préfixe lien offre
    search: "/emploi/liste_offres", // page recherche
    cvtheque: "/cvtheque/deposer", // dépôt CV
    alerte: "/mon-compte/alertes", // création alerte
    locations:
      "https://services.cadremploi.fr/services/suggestions/v1/locations/", // autocomplete géo
  },

  /* ── Chiffres clés ───────────────────────────────────────
     Mettre à jour manuellement chaque trimestre
     --------------------------------------------------------- */
  CHIFFRES: {
    offres: "4 200", // nb offres Tech actives — hero eyebrow + stat
    salaire: "72k€", // salaire médian Tech cadre
    salaire_pct: "92%", // % offres avec salaire affiché
    cvtheque: 121106, // volume CVthèque — injecté dans profiles-count
    entreprises: 1840, // entreprises utilisant la CVthèque Tech
  },

  /* ── Contenu éditorial ────────────────────────────────────
     Textes spécifiques au secteur
     --------------------------------------------------------- */
  CONTENT: {
    hero: {
      eyebrow: "4 200 offres Tech actives en ce moment",
      title:
        'La Tech cadre recrute <span class="accent">ici</span>.<br><span class="light">Enfin.</span>',
      subtitle:
        "De développeur confirmé à CTO, de data engineer à VP Engineering — <strong>Cadremploi couvre tout le spectre de la Tech au niveau cadre</strong>. Offres sérieuses, salaires affichés, entreprises qui recrutent vraiment.",
    },
    cvtheque: {
      title: "Arrêtez de postuler.<br>Laissez les recruteurs<br>venir à vous.",
      desc: "1 840 entreprises Tech utilisent notre CVthèque pour trouver leurs cadres, managers et experts. Sans attendre vos candidatures, ils viennent à vous.",
      perks: [
        "Les recruteurs Tech cherchent avant même de publier une annonce",
        "Soyez visible sans postuler, sans démarche",
        "Une CVthèque réservée aux profils cadres",
      ],
    },
    search: {
      placeholder_poste: "Poste, compétences (React, PM, DevOps…)",
      placeholder_lieu: "Ville ou télétravail",
      popular_tags: [
        "Full Stack",
        "Product Manager",
        "Data Engineer",
        "DevOps",
        "CTO",
      ],
    },
    stats: [
      { value: "4 200<span>+</span>", label: "offres actives" },
      { value: "72k<span>€</span>", label: "salaire médian" },
      { value: "92<span>%</span>", label: "salaire affiché" },
    ],
  },

  /* ── Profils CVthèque ─────────────────────────────────────
     100 profils crédibles — distribution réaliste du marché Tech cadre
     Expériences cohérentes avec le niveau du poste
     Régions : ~60% IDF, ~40% régions
     --------------------------------------------------------- */
  PROFILES_POOL: [
    // ── Développement (44 profils) ──
    {
      role: "Développeur Full Stack",
      region: "Île-de-France",
      exp: "5 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Lead Développeur Backend",
      region: "Île-de-France",
      exp: "10 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Tech Lead Java",
      region: "Occitanie",
      exp: "9 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur React / TypeScript",
      region: "Île-de-France",
      exp: "4 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Software Engineer Python",
      region: "Île-de-France",
      exp: "6 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur Mobile iOS",
      region: "Auvergne-Rhône-Alpes",
      exp: "7 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Ingénieur Logiciel C++",
      region: "Île-de-France",
      exp: "8 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur Full Stack Vue.js",
      region: "Pays de la Loire",
      exp: "5 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur Backend Node.js",
      region: "Île-de-France",
      exp: "4 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Tech Lead Frontend",
      region: "Nouvelle-Aquitaine",
      exp: "8 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur PHP Symfony",
      region: "Hauts-de-France",
      exp: "6 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Ingénieur Logiciel Java",
      region: "Île-de-France",
      exp: "7 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur Android",
      region: "Auvergne-Rhône-Alpes",
      exp: "5 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Lead Dev. Full Stack",
      region: "Île-de-France",
      exp: "11 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur Go",
      region: "Île-de-France",
      exp: "4 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Software Engineer Rust",
      region: "Bretagne",
      exp: "5 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur Kotlin",
      region: "Île-de-France",
      exp: "4 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Ingénieur Développement C#",
      region: "Grand Est",
      exp: "7 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur React Native",
      region: "Île-de-France",
      exp: "4 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Lead Dev. Mobile",
      region: "Occitanie",
      exp: "9 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur Laravel",
      region: "Normandie",
      exp: "5 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Tech Lead Python",
      region: "Île-de-France",
      exp: "8 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Ingénieur Full Stack",
      region: "Provence-Alpes-Côte d'Azur",
      exp: "6 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur Scala",
      region: "Île-de-France",
      exp: "6 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Software Engineer Backend",
      region: "Île-de-France",
      exp: "5 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur Microservices",
      region: "Auvergne-Rhône-Alpes",
      exp: "7 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Ingénieur Logiciel Embarqué",
      region: "Île-de-France",
      exp: "9 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Lead Développeur Angular",
      region: "Île-de-France",
      exp: "8 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur Flutter",
      region: "Nouvelle-Aquitaine",
      exp: "3 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Tech Lead Backend Java",
      region: "Île-de-France",
      exp: "10 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur Ruby on Rails",
      region: "Île-de-France",
      exp: "6 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Ingénieur Frontend React",
      region: "Occitanie",
      exp: "5 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur Salesforce",
      region: "Île-de-France",
      exp: "6 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Software Engineer iOS Swift",
      region: "Île-de-France",
      exp: "5 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur SAP ABAP",
      region: "Pays de la Loire",
      exp: "8 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Lead Dev. Microservices",
      region: "Île-de-France",
      exp: "9 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Ingénieur Logiciel C++ Embarqué",
      region: "Bretagne",
      exp: "10 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur TypeScript",
      region: "Île-de-France",
      exp: "4 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Lead Développeur PHP",
      region: "Hauts-de-France",
      exp: "9 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur Blockchain",
      region: "Île-de-France",
      exp: "4 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Software Engineer Java Spring",
      region: "Auvergne-Rhône-Alpes",
      exp: "6 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Tech Lead Full Stack React",
      region: "Île-de-France",
      exp: "9 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Développeur GraphQL",
      region: "Île-de-France",
      exp: "4 ans d'exp.",
      cat: "dev",
    },
    {
      role: "Ingénieur Développement Go",
      region: "Provence-Alpes-Côte d'Azur",
      exp: "5 ans d'exp.",
      cat: "dev",
    },

    // ── Data & IA (16 profils) ──
    {
      role: "Data Engineer",
      region: "Île-de-France",
      exp: "5 ans d'exp.",
      cat: "data",
    },
    {
      role: "Data Scientist",
      region: "Auvergne-Rhône-Alpes",
      exp: "6 ans d'exp.",
      cat: "data",
    },
    {
      role: "Analytics Engineer",
      region: "Île-de-France",
      exp: "5 ans d'exp.",
      cat: "data",
    },
    {
      role: "MLOps Engineer",
      region: "Île-de-France",
      exp: "5 ans d'exp.",
      cat: "data",
    },
    {
      role: "Data Analyst",
      region: "Normandie",
      exp: "4 ans d'exp.",
      cat: "data",
    },
    {
      role: "Lead Data Engineer",
      region: "Île-de-France",
      exp: "8 ans d'exp.",
      cat: "data",
    },
    {
      role: "Machine Learning Engineer",
      region: "Île-de-France",
      exp: "6 ans d'exp.",
      cat: "data",
    },
    {
      role: "Data Scientist NLP",
      region: "Île-de-France",
      exp: "5 ans d'exp.",
      cat: "data",
    },
    {
      role: "Ingénieur IA Générative",
      region: "Île-de-France",
      exp: "4 ans d'exp.",
      cat: "data",
    },
    {
      role: "Data Engineer Databricks",
      region: "Auvergne-Rhône-Alpes",
      exp: "5 ans d'exp.",
      cat: "data",
    },
    {
      role: "AI Engineer",
      region: "Île-de-France",
      exp: "4 ans d'exp.",
      cat: "data",
    },
    {
      role: "Data Scientist Computer Vision",
      region: "Île-de-France",
      exp: "6 ans d'exp.",
      cat: "data",
    },
    {
      role: "Data Manager",
      region: "Nouvelle-Aquitaine",
      exp: "7 ans d'exp.",
      cat: "data",
    },
    {
      role: "Lead Data Scientist",
      region: "Île-de-France",
      exp: "9 ans d'exp.",
      cat: "data",
    },
    {
      role: "Prompt Engineer",
      region: "Île-de-France",
      exp: "3 ans d'exp.",
      cat: "data",
    },
    {
      role: "Data Architect",
      region: "Île-de-France",
      exp: "10 ans d'exp.",
      cat: "data",
    },

    // ── Product (12 profils) ──
    {
      role: "Product Manager",
      region: "Île-de-France",
      exp: "6 ans d'exp.",
      cat: "pm",
    },
    {
      role: "Senior Product Manager",
      region: "Auvergne-Rhône-Alpes",
      exp: "8 ans d'exp.",
      cat: "pm",
    },
    {
      role: "Product Owner",
      region: "Hauts-de-France",
      exp: "4 ans d'exp.",
      cat: "pm",
    },
    {
      role: "PM Growth",
      region: "Île-de-France",
      exp: "5 ans d'exp.",
      cat: "pm",
    },
    {
      role: "Head of Product",
      region: "Île-de-France",
      exp: "10 ans d'exp.",
      cat: "pm",
    },
    {
      role: "Product Manager B2B SaaS",
      region: "Occitanie",
      exp: "6 ans d'exp.",
      cat: "pm",
    },
    {
      role: "Lead Product Owner",
      region: "Île-de-France",
      exp: "8 ans d'exp.",
      cat: "pm",
    },
    {
      role: "Product Manager Data",
      region: "Île-de-France",
      exp: "5 ans d'exp.",
      cat: "pm",
    },
    { role: "CPO", region: "Île-de-France", exp: "14 ans d'exp.", cat: "pm" },
    {
      role: "Product Manager Mobile",
      region: "Nouvelle-Aquitaine",
      exp: "5 ans d'exp.",
      cat: "pm",
    },
    {
      role: "Senior Product Owner",
      region: "Île-de-France",
      exp: "7 ans d'exp.",
      cat: "pm",
    },
    {
      role: "Product Manager Marketplace",
      region: "Île-de-France",
      exp: "6 ans d'exp.",
      cat: "pm",
    },

    // ── Cloud & Infra (9 profils) ──
    {
      role: "Architecte Cloud AWS",
      region: "Île-de-France",
      exp: "8 ans d'exp.",
      cat: "cloud",
    },
    {
      role: "DevOps Engineer",
      region: "Nouvelle-Aquitaine",
      exp: "6 ans d'exp.",
      cat: "cloud",
    },
    {
      role: "Ingénieur Infrastructure Azure",
      region: "Île-de-France",
      exp: "7 ans d'exp.",
      cat: "cloud",
    },
    {
      role: "SRE — Site Reliability Engineer",
      region: "Île-de-France",
      exp: "7 ans d'exp.",
      cat: "cloud",
    },
    {
      role: "Architecte Cloud GCP",
      region: "Auvergne-Rhône-Alpes",
      exp: "9 ans d'exp.",
      cat: "cloud",
    },
    {
      role: "Lead DevOps",
      region: "Île-de-France",
      exp: "9 ans d'exp.",
      cat: "cloud",
    },
    {
      role: "Ingénieur Cloud & DevOps",
      region: "Bretagne",
      exp: "6 ans d'exp.",
      cat: "cloud",
    },
    {
      role: "Platform Engineer",
      region: "Île-de-France",
      exp: "7 ans d'exp.",
      cat: "cloud",
    },
    {
      role: "Architecte Infrastructure",
      region: "Pays de la Loire",
      exp: "11 ans d'exp.",
      cat: "cloud",
    },

    // ── Cybersécurité (6 profils) ──
    {
      role: "Ingénieur Cybersécurité",
      region: "Île-de-France",
      exp: "6 ans d'exp.",
      cat: "secu",
    },
    {
      role: "Analyste SOC",
      region: "Grand Est",
      exp: "5 ans d'exp.",
      cat: "secu",
    },
    {
      role: "RSSI",
      region: "Île-de-France",
      exp: "12 ans d'exp.",
      cat: "secu",
    },
    {
      role: "Consultant Cybersécurité",
      region: "Île-de-France",
      exp: "7 ans d'exp.",
      cat: "secu",
    },
    {
      role: "Pentester",
      region: "Occitanie",
      exp: "5 ans d'exp.",
      cat: "secu",
    },
    {
      role: "Architecte Sécurité",
      region: "Île-de-France",
      exp: "10 ans d'exp.",
      cat: "secu",
    },

    // ── Design & UX (5 profils) ──
    {
      role: "UX Designer",
      region: "Île-de-France",
      exp: "5 ans d'exp.",
      cat: "design",
    },
    {
      role: "Product Designer",
      region: "Auvergne-Rhône-Alpes",
      exp: "6 ans d'exp.",
      cat: "design",
    },
    {
      role: "Lead UX Designer",
      region: "Île-de-France",
      exp: "8 ans d'exp.",
      cat: "design",
    },
    {
      role: "UX Researcher",
      region: "Île-de-France",
      exp: "5 ans d'exp.",
      cat: "design",
    },
    {
      role: "UI/UX Designer",
      region: "Provence-Alpes-Côte d'Azur",
      exp: "4 ans d'exp.",
      cat: "design",
    },

    // ── Management & Direction (8 profils) ──
    {
      role: "Engineering Manager",
      region: "Île-de-France",
      exp: "10 ans d'exp.",
      cat: "mgmt",
    },
    {
      role: "CTO",
      region: "Nouvelle-Aquitaine",
      exp: "14 ans d'exp.",
      cat: "mgmt",
    },
    {
      role: "Directeur Technique",
      region: "Auvergne-Rhône-Alpes",
      exp: "12 ans d'exp.",
      cat: "mgmt",
    },
    {
      role: "VP Engineering",
      region: "Île-de-France",
      exp: "13 ans d'exp.",
      cat: "mgmt",
    },
    {
      role: "Head of Engineering",
      region: "Île-de-France",
      exp: "11 ans d'exp.",
      cat: "mgmt",
    },
    {
      role: "DSI",
      region: "Hauts-de-France",
      exp: "15 ans d'exp.",
      cat: "mgmt",
    },
    {
      role: "Scrum Master",
      region: "Île-de-France",
      exp: "6 ans d'exp.",
      cat: "mgmt",
    },
    {
      role: "Responsable Informatique",
      region: "Grand Est",
      exp: "9 ans d'exp.",
      cat: "mgmt",
    },
  ],

  /* ── Couleurs catégories profils ── */
  PROFILE_COLORS: {
    dev: { bg: "var(--cat-dev-bg)", fg: "var(--cat-dev-fg)" },
    data: { bg: "var(--cat-data-bg)", fg: "var(--cat-data-fg)" },
    pm: { bg: "var(--cat-pm-bg)", fg: "var(--cat-pm-fg)" },
    cloud: { bg: "var(--cat-cloud-bg)", fg: "var(--cat-cloud-fg)" },
    secu: { bg: "var(--cat-secu-bg)", fg: "var(--cat-secu-fg)" },
    design: { bg: "var(--cat-design-bg)", fg: "var(--cat-design-fg)" },
    mgmt: { bg: "var(--cat-mgmt-bg)", fg: "var(--cat-mgmt-fg)" },
  },

  /* ── Autocomplete métiers Tech ───────────────────────────
     Structure : { category, items[] } — affiche les catégories
     comme en-têtes dans le dropdown (comme sur la HP)
     --------------------------------------------------------- */
  JOBS_SUGGESTIONS: [
    {
      category: "Informatique",
      items: [
        "administrateur d'infrastructures sécurisées",
        "administrateur de bases de données",
        "administrateur fonctionnel",
        "administrateur informatique",
        "administrateur Office 365",
        "administrateur réseaux",
        "administrateur salesforce",
        "administrateur SAP",
        "administrateur sécurité",
        "administrateur système",
        "administrateur système informatique",
        "administrateur système linux",
        "administrateur système unix",
        "administrateur système windows",
        "administrateur systèmes et réseaux",
        "administrateur virtualisation",
        "analyste BI",
        "analyste d'exploitation",
        "analyste développeur",
        "analyste en cybersécurité",
        "analyste fonctionnel",
        "analyste informatique",
        "analyste programmeur",
        "analyste sécurité",
        "architecte applicatif",
        "architecte cloud",
        "architecte d'entreprise",
        "architecte de solutions",
        "architecte fonctionnel",
        "architecte informatique",
        "architecte infrastructure",
        "architecte logiciel",
        "architecte réseaux",
        "architecte SI",
        "architecte système",
        "architecte technique",
        "big data engineer",
        "business analyst",
        "business analyst IT",
        "chargé de projet informatique",
        "chargé de projet web",
        "chef de produit",
        "chef de projet AMOA",
        "chef de projet data",
        "chef de projet décisionnel",
        "chef de projet déploiement",
        "chef de projet développement",
        "chef de projet ERP",
        "chef de projet fonctionnel",
        "chef de projet informatique",
        "chef de projet infrastructure",
        "chef de projet IT",
        "chef de projet java",
        "chef de projet logiciel",
        "chef de projet mobile",
        "chef de projet MOA",
        "chef de projet MOE",
        "chef de projet SAP",
        "chef de projet SI",
        "chef de projet technique",
        "chef de projet web",
        "chef de service informatique",
        "chief data officer",
        "chief information security officer",
        "chief technology officer",
        "cloud architect",
        "cloud engineer",
        "coach agile",
        "consultant AMOA",
        "consultant BI",
        "consultant big data",
        "consultant cloud",
        "consultant CRM",
        "consultant cybersécurité",
        "consultant ERP",
        "consultant fonctionnel SAP",
        "consultant informatique",
        "consultant IT",
        "consultant logiciel",
        "consultant MOA",
        "consultant oracle",
        "consultant PMO",
        "consultant salesforce",
        "consultant SAP",
        "consultant sécurité informatique",
        "consultant SI",
        "consultant technique",
        "consultant test",
        "consultant transformation digitale",
        "data analyst",
        "data analyst power bi",
        "data architect",
        "data engineer",
        "data manager",
        "data miner",
        "data product owner",
        "data scientist",
        "database analyst",
        "dba sql",
        "delivery manager",
        "développeur",
        "développeur .net",
        "développeur android",
        "développeur angular",
        "développeur application mobile",
        "développeur back-end",
        "développeur C#.NET",
        "développeur C++",
        "développeur d'applications",
        "développeur embarqué",
        "développeur en intelligence artificielle",
        "développeur flutter",
        "développeur front end",
        "développeur full stack",
        "développeur informatique",
        "développeur intégrateur web",
        "développeur iOS",
        "développeur java",
        "développeur javascript",
        "développeur laravel",
        "développeur logiciel",
        "développeur mobile",
        "développeur no code",
        "développeur node.js",
        "développeur PHP",
        "développeur python",
        "développeur react",
        "développeur ruby on rails",
        "développeur salesforce",
        "développeur SQL",
        "développeur web",
        "développeur web full stack",
        "développeur wordpress",
        "devops",
        "devops engineer",
        "devops SRE",
        "directeur de projet informatique",
        "directeur des systèmes d'information",
        "directeur informatique",
        "directeur infrastructure",
        "directeur technique informatique",
        "expert technique",
        "gestionnaire de base de données",
        "gestionnaire de données",
        "gestionnaire de parc informatique",
        "gestionnaire informatique",
        "hotliner",
        "incident manager",
        "informaticien",
        "ingénieur avant-vente",
        "ingénieur big data",
        "ingénieur cloud",
        "ingénieur cybersécurité",
        "ingénieur d'application",
        "ingénieur d'exploitation",
        "ingénieur décisionnel",
        "ingénieur développement java",
        "ingénieur développement logiciel",
        "ingénieur devops",
        "ingénieur en informatique",
        "ingénieur en intelligence artificielle",
        "ingénieur infrastructure",
        "ingénieur IOT",
        "ingénieur IT",
        "ingénieur java",
        "ingénieur logiciel",
        "ingénieur logiciel embarqué",
        "ingénieur machine learning",
        "ingénieur qualité logiciel",
        "ingénieur réseaux",
        "ingénieur réseaux et sécurité",
        "ingénieur sécurité",
        "ingénieur sécurité informatique",
        "ingénieur sécurité réseau",
        "ingénieur support",
        "ingénieur support applicatif",
        "ingénieur support technique",
        "ingénieur systèmes embarqués",
        "ingénieur systèmes et réseaux",
        "ingénieur test",
        "ingénieur validation",
        "ingénieur VOIP",
        "intégrateur html",
        "intégrateur web",
        "lead developer",
        "lead product owner",
        "manager informatique",
        "manager technique",
        "oracle DBA",
        "pentester",
        "PMO manager",
        "product lead",
        "product manager",
        "product owner",
        "program manager",
        "programmeur",
        "programmeur python",
        "project manager",
        "prompt engineer",
        "proxy product owner",
        "rédacteur technique",
        "référent technique",
        "RSSI",
        "rust developer",
        "responsable de projet informatique",
        "responsable helpdesk",
        "responsable informatique",
        "responsable infrastructure",
        "responsable sécurité informatique",
        "responsable service informatique",
        "responsable support informatique",
        "responsable système d'information",
        "responsable technique",
        "scrum master",
        "service desk manager",
        "software designer",
        "solution engineer",
        "support applicatif",
        "support engineer",
        "support informatique",
        "support technique",
        "tech lead",
        "technical support engineer",
        "test manager",
        "testeur de logiciel",
        "testeur informatique",
        "web analyst",
        "web developer",
        "webmaster",
      ],
    },
    {
      category: "Design & Digital",
      items: [
        "ux designer",
        "ux ui designer",
        "designer ui",
        "designer ux",
        "designer ux ui",
        "product designer",
        "lead designer",
      ],
    },
  ],
};
