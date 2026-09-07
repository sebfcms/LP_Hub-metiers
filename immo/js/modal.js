/* ============================================================
   js/modal.js
   Calque "détail ville" du baromètre — ouverture/fermeture uniquement.

   Contrairement à la maquette de recette (qui simulait aussi le
   changement de département côté client), en prod chaque page
   département est pré-générée par le script Yanport → HTML statique
   (voir barometre/rhone/index.html, qui tient lieu de gabarit pour ce
   générateur). Il n'y a donc plus de switchDepartement() : les données
   de CETTE page sont déjà dans le HTML/JSON embarqué, ce script ne fait
   qu'ouvrir/fermer la modale avec les données déjà présentes sur la page
   — aucun fetch, rien de dynamique.

   Contrat de données attendu : un <script type="application/json"
   id="villes-data"> quelque part sur la page, contenant un objet
   { [key]: {nom, score, note, offre, offreLabel, va, vaSub, vm, vmSub,
   la, lm, lien} } pour les villes "prêtes" de CE département.
   ============================================================ */

(function () {
  const $ = (id) => document.getElementById(id);

  function getVillesData() {
    const node = $("villes-data");
    if (!node) return {};
    try {
      return JSON.parse(node.textContent);
    } catch (e) {
      console.warn("villes-data JSON invalide", e);
      return {};
    }
  }

  const villeData = getVillesData();

  function openVille(key) {
    const v = villeData[key];
    if (!v) return;

    $("vo-title").textContent = v.nom;
    $("vo-score").textContent = v.score;
    $("vo-score-note").textContent = v.note;
    $("vo-offre").textContent = v.offreLabel;
    $("vo-offre").className = "vo-offre " + v.offre;
    $("vo-va").textContent = v.va;
    $("vo-va-sub").textContent = v.vaSub;
    $("vo-vm").textContent = v.vm;
    $("vo-vm-sub").textContent = v.vmSub;
    $("vo-la").textContent = v.la;
    $("vo-lm").textContent = v.lm;
    $("vo-cta-ville").textContent = v.nom;
    $("vo-cta-link").href = v.lien;
    $("ville-overlay-backdrop").classList.add("open");
  }

  function closeVille(e) {
    if (e) e.preventDefault();
    $("ville-overlay-backdrop").classList.remove("open");
  }

  // Délégation d'événements : tout lien [data-ville] ouvre le calque
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-ville]");
    if (trigger) {
      e.preventDefault();
      openVille(trigger.dataset.ville);
      return;
    }
    if (e.target.closest("[data-ville-close]")) {
      closeVille(e);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeVille();
  });

  const backdrop = $("ville-overlay-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeVille();
    });
  }
})();
