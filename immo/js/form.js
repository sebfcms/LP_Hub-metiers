/* ============================================================
   js/form.js
   Landing captation (opt-in) → Google Form.

   Le formulaire poste directement vers l'URL "formResponse" du Google
   Form (technique classique : <form target="iframe caché">, pas de
   rechargement de page, pas de clé API, rien à héberger). Les réponses
   arrivent dans la Google Sheet liée au Form.

   ⚠️ TODO AVANT MISE EN LIGNE — voir immo/AVANT_MISE_EN_PROD.md :
   1. Créer le Google Form (3 champs : email, situation, département).
   2. Récupérer son URL de soumission réelle : ouvrir le Form → "⋮" →
      "Obtenir le lien préremplissable", remplir un brouillon, copier le
      lien généré. Le lien ressemble à :
        https://docs.google.com/forms/d/e/<FORM_ID>/viewform?usp=pp_url&entry.111111=x&entry.222222=y&entry.333333=z
      → <FORM_ID> va dans GOOGLE_FORM_ACTION_URL ci-dessous, et chaque
      "entry.XXXXXX" va dans le <name> de l'<input>/<select> correspondant
      dans immo/agent-independant/index.html (déjà posé, à remplacer).
   2bis. Remplacer l'action du <form> (actuellement un placeholder) par :
        https://docs.google.com/forms/d/e/<FORM_ID>/formResponse
   3. Vérifier dans la Google Sheet liée que les 3 colonnes se remplissent
      bien après un envoi de test.
   ============================================================ */

(function () {
  const form = document.getElementById("optin-form");
  if (!form) return;

  const iframe = document.getElementById("optin-hidden-iframe");
  const status = document.getElementById("optin-status");
  const submitBtn = document.getElementById("optin-submit");
  const deptSelect = document.getElementById("optin-departement");
  const emailInput = document.getElementById("optin-email");
  const emailError = document.getElementById("optin-email-error");

  // Départements déjà couverts par une page baromètre générée.
  // À étendre automatiquement par le générateur Yanport (une entrée par
  // département produit) plutôt qu'à maintenir à la main.
  const BAROMETRE_READY = {
    "69": "../barometre/rhone/",
  };
  const BAROMETRE_FALLBACK = "../barometre/rhone/"; // département pas encore généré → exemple

  /* ------------------------------------------------------------
     Anti faux e-mails : format basique + domaines jetables/temporaires
     connus. Ce n'est pas exhaustif (impossible à 100% côté front),
     mais couvre les cas les plus courants (mailinator, yopmail, etc.)
     et les domaines de test évidents. À décorréler d'une vraie
     vérification serveur (MX / API type Kickbox) si le volume de leads
     bidons devient un problème après mise en ligne.
     ------------------------------------------------------------ */
  const EMAIL_FORMAT_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const DISPOSABLE_DOMAINS = [
    "mailinator.com", "yopmail.com", "yopmail.fr", "yopmail.net",
    "guerrillamail.com", "guerrillamail.info", "guerrillamail.biz",
    "guerrillamail.net", "guerrillamailblock.com", "sharklasers.com",
    "10minutemail.com", "10minutemail.net", "20minutemail.com",
    "tempmail.com", "temp-mail.org", "temp-mail.io", "tempmail.net",
    "tempinbox.com", "throwawaymail.com", "trashmail.com", "trashmail.net",
    "dispostable.com", "fakeinbox.com", "fakemailgenerator.com",
    "getnada.com", "getairmail.com", "maildrop.cc", "mailnesia.com",
    "mailcatch.com", "mailnator.com", "mintemail.com", "mohmal.com",
    "moakt.com", "spamgourmet.com", "spam4.me", "discard.email",
    "emailondeck.com", "burnermail.io", "correotemporal.org",
    "jetable.org", "moment-mail.com", "nada.email", "one-time.email",
    "tempr.email", "temp.com", "test.com", "example.com", "exemple.fr",
    "domain.com",
  ];

  function emailDomain(value) {
    const at = value.lastIndexOf("@");
    return at === -1 ? "" : value.slice(at + 1).trim().toLowerCase();
  }

  function isDisposableDomain(domain) {
    if (!domain) return false;
    if (DISPOSABLE_DOMAINS.includes(domain)) return true;
    // Filets de sécurité par motif, pour les variantes/sous-domaines
    // des services jetables les plus connus (ex. "1.yopmail.com").
    return /(^|\.)(yopmail|mailinator|guerrillamail|sharklasers|tempmail|temp-mail|trashmail|dispostable|fakeinbox|fakemail|getnada|mailnesia|mailcatch|mintemail|mohmal|moakt|spam4|spamgourmet|throwaway|burnermail|jetable|10minutemail|20minutemail)\.[a-z.]+$/i.test(
      domain,
    );
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!EMAIL_FORMAT_RE.test(value)) {
      return "Cette adresse email n'a pas l'air valide — vérifiez qu'il ne manque rien.";
    }
    if (isDisposableDomain(emailDomain(value))) {
      return "Cette adresse ressemble à une adresse temporaire ou jetable. Merci d'indiquer une adresse que vous consultez vraiment, pour recevoir votre score.";
    }
    return "";
  }

  function showEmailError(message) {
    emailError.textContent = message;
    emailError.style.display = "block";
    emailInput.classList.add("input-error");
    emailInput.setAttribute("aria-invalid", "true");
  }

  function clearEmailError() {
    emailError.textContent = "";
    emailError.style.display = "none";
    emailInput.classList.remove("input-error");
    emailInput.removeAttribute("aria-invalid");
  }

  // Feedback dès que l'utilisateur quitte le champ (pas pendant qu'il tape).
  emailInput.addEventListener("blur", () => {
    if (!emailInput.value.trim()) return; // champ vide : on laisse "required" faire son travail
    const message = validateEmail();
    if (message) showEmailError(message);
    else clearEmailError();
  });
  emailInput.addEventListener("input", clearEmailError);

  let submitted = false;

  form.addEventListener("submit", (event) => {
    const message = validateEmail();
    if (message) {
      event.preventDefault();
      showEmailError(message);
      emailInput.focus();
      return;
    }
    clearEmailError();

    // Le submit natif part vers l'iframe caché (target="optin-hidden-iframe") ;
    // on ne fait pas preventDefault ici, seulement écouter la réponse.
    submitted = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours…";
  });

  iframe.addEventListener("load", () => {
    if (!submitted) return; // ignore le load initial (iframe vide) au chargement de la page

    status.textContent =
      "Merci ! Direction votre baromètre départemental — un e-mail de confirmation vous a aussi été envoyé.";
    status.className = "form-status success";
    submitBtn.textContent = "Envoyé ✓";

    const code = deptSelect.value;
    const target = BAROMETRE_READY[code] || BAROMETRE_FALLBACK;

    setTimeout(() => {
      window.location.href = target;
    }, 1200);
  });
})();
