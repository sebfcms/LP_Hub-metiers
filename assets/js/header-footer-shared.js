/* ============================================================
   assets/js/header-footer-shared.js
   Comportement JS du header/footer prod (menus déroulants desktop,
   menu hamburger mobile, modale de connexion, bouton cookies).

   Extrait à l'identique du script inline présent dans tech/index.html
   ("Scripts header/footer prod") pour être partagé entre toutes les
   landings plutôt que dupliqué dans chaque page — le HTML du header/
   footer reste dupliqué (pas de moteur de template côté statique),
   mais ce comportement, lui, ne varie jamais d'une landing à l'autre.

   Charger après le HTML du header/footer/menu mobile/modale de connexion,
   juste avant </body> (voir immo/index.html pour l'ordre de chargement).
   ============================================================ */

(function () {
  (function () {
    // Vérifier si déjà initialisé pour éviter les doublons
    if (window.__headerDropdownsInitialized) {
      return;
    }

    // Fonction d'initialisation
    function initDropdowns() {
      const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

      // Vérifier si les éléments existent
      if (dropdownToggles.length === 0) {
        setTimeout(initDropdowns, 100);
        return;
      }

      let currentOpenMenu = null;

      // Fonction pour fermer tous les menus
      function closeAllMenus() {
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.classList.remove("show");
          menu.style.display = "none";
        });
        document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
          toggle.setAttribute("aria-expanded", "false");
        });
        currentOpenMenu = null;
      }

      // Fonction pour ouvrir un menu
      function openMenu(toggle, menu) {
        closeAllMenus();
        menu.classList.add("show");
        menu.style.display = "block";
        toggle.setAttribute("aria-expanded", "true");
        currentOpenMenu = menu;
      }

      // Ajouter un gestionnaire d'événements à chaque bouton
      dropdownToggles.forEach(function (toggle) {
        // Supprimer les anciens gestionnaires s'ils existent
        toggle.onclick = null;

        toggle.addEventListener(
          "click",
          function (e) {
            e.preventDefault();
            e.stopPropagation();

            const dropdownId = this.getAttribute("data-dropdown");
            const menu = document.getElementById("menu-" + dropdownId);

            if (menu) {
              if (menu.classList.contains("show")) {
                closeAllMenus();
              } else {
                openMenu(this, menu);
              }
            }
          },
          { once: false },
        );
      });

      // Gestionnaire pour fermer les menus quand on clique en dehors
      const outsideClickHandler = function (e) {
        if (!e.target.closest(".dropdown-wrapper")) {
          closeAllMenus();
        }
      };

      // Supprimer l'ancien gestionnaire s'il existe
      if (window.__headerOutsideClickHandler) {
        document.removeEventListener("click", window.__headerOutsideClickHandler);
      }
      window.__headerOutsideClickHandler = outsideClickHandler;
      document.addEventListener("click", outsideClickHandler);

      // Gestionnaire pour la touche Escape
      const escapeHandler = function (e) {
        if (e.key === "Escape") {
          closeAllMenus();
        }
      };

      // Supprimer l'ancien gestionnaire s'il existe
      if (window.__headerEscapeHandler) {
        document.removeEventListener("keydown", window.__headerEscapeHandler);
      }
      window.__headerEscapeHandler = escapeHandler;
      document.addEventListener("keydown", escapeHandler);

      // Marquer comme initialisé
      window.__headerDropdownsInitialized = true;

      // Initialiser la modal de connexion
      initAuthModal();

      // Initialiser le menu hamburger
      initHamburgerMenu();

      // Initialiser les boutons de connexion sociale
      initSocialLoginButtons();
    }

    // Fonction pour gérer le menu hamburger mobile
    function initHamburgerMenu() {
      const hamburgerBtn = document.querySelector(".v-app-bar-nav-icon");
      const hamburgerIcon = hamburgerBtn ? hamburgerBtn.querySelector("svg path") : null;
      const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
      const mobileMenuDrawer = document.getElementById("mobile-menu-drawer");

      if (!hamburgerBtn || !mobileMenuOverlay || !hamburgerIcon) {
        setTimeout(initHamburgerMenu, 100);
        return;
      }

      // SVG paths
      const hamburgerPath = "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z";
      const closePath =
        "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";

      let isMenuOpen = false;

      // Ouvrir/fermer le menu mobile
      hamburgerBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (!isMenuOpen) {
          // Ouvrir le menu
          mobileMenuOverlay.style.display = "block";
          setTimeout(() => {
            mobileMenuOverlay.classList.add("show");
          }, 10);
          // Transformer en croix
          hamburgerIcon.setAttribute("d", closePath);
          isMenuOpen = true;
        } else {
          // Fermer le menu
          closeMobileMenu();
        }
      });

      // Fermer le menu en cliquant sur l'overlay
      mobileMenuOverlay.addEventListener("click", function (e) {
        if (e.target === mobileMenuOverlay) {
          closeMobileMenu();
        }
      });

      // Gérer les groupes pliables
      const groupToggles = document.querySelectorAll(".mobile-menu-group-toggle");
      groupToggles.forEach((toggle) => {
        toggle.addEventListener("click", function () {
          const groupName = this.getAttribute("data-group");
          const groupItems = document.getElementById("mobile-group-" + groupName);
          const isActive = this.classList.contains("active");

          // Fermer tous les autres groupes
          document.querySelectorAll(".mobile-menu-group-toggle").forEach((t) => {
            t.classList.remove("active");
          });
          document.querySelectorAll(".mobile-menu-group-items").forEach((g) => {
            g.classList.remove("show");
            g.style.display = "none";
          });

          // Toggle le groupe actuel
          if (!isActive) {
            this.classList.add("active");
            groupItems.style.display = "block";
            setTimeout(() => {
              groupItems.classList.add("show");
            }, 10);
          }
        });
      });

      // Fermer le menu avec la touche Échap
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && mobileMenuOverlay.classList.contains("show")) {
          closeMobileMenu();
        }
      });

      function closeMobileMenu() {
        mobileMenuOverlay.classList.remove("show");
        setTimeout(() => {
          mobileMenuOverlay.style.display = "none";
        }, 300);
        // Revenir au hamburger
        hamburgerIcon.setAttribute("d", hamburgerPath);
        isMenuOpen = false;
      }

      // Rendre la fonction accessible globalement
      window.__closeMobileMenu = closeMobileMenu;
    }

    // Fonction pour gérer les boutons de connexion sociale
    function initSocialLoginButtons() {
      const btnGoogleLogin = document.getElementById("btn-google-login");
      const btnLinkedinLogin = document.getElementById("btn-linkedin-login");

      if (!btnGoogleLogin || !btnLinkedinLogin) {
        setTimeout(initSocialLoginButtons, 100);
        return;
      }

      // Map des providers avec leurs informations
      const PROVIDERS_MAP = {
        google: {
          name: "Google",
          path: "/emploi/auth/google",
          gaLabel: "clic_page_inscription_Google",
        },
        linkedin: {
          name: "LinkedIn",
          path: "/emploi/auth/linkedin",
          gaLabel: "clic_page_inscription_LinkedIn",
        },
      };

      // Fonction pour vérifier si un cookie SESSION existe
      function hasSessionCookie() {
        const cookies = document.cookie;
        return cookies.includes("SESSION=");
      }

      // Fonction pour gérer la connexion sociale
      async function handleSocialLogin(provider) {
        try {
          const providerInfo = PROVIDERS_MAP[provider];
          if (!providerInfo) return;

          // Si pas de session, essayer d'en créer une
          if (!hasSessionCookie()) {
            // Appel pour créer une session
            try {
              await fetch("/emploi/api/session/create", {
                method: "POST",
                credentials: "include",
              });
            } catch (err) {
              console.warn("Session creation failed:", err);
            }
          }

          // Préparer la redirection
          try {
            const response = await fetch("/emploi/api/social/prepare-redirect", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                currentUrl: window.location.href,
              }),
            });

            if (!response.ok) {
              throw new Error("API Error");
            }
          } catch (err) {
            console.warn("Prepare redirect failed:", err);
          }

          // Rediriger vers le provider
          window.location.href = providerInfo.path;
        } catch (error) {
          console.error("Social login error:", error);
          // En cas d'erreur, tenter quand même la redirection
          const providerInfo = PROVIDERS_MAP[provider];
          if (providerInfo && providerInfo.path) {
            window.location.href = providerInfo.path;
          }
        }
      }

      // Ajouter les gestionnaires d'événements
      btnGoogleLogin.addEventListener("click", function (e) {
        e.preventDefault();
        handleSocialLogin("google");
      });

      btnLinkedinLogin.addEventListener("click", function (e) {
        e.preventDefault();
        handleSocialLogin("linkedin");
      });
    }

    // Fonction pour gérer la modal de connexion
    function initAuthModal() {
      const btnMonCompte = document.getElementById("btn-mon-compte");
      const authModal = document.getElementById("auth-modal");
      const closeModalBtn = document.getElementById("close-modal");

      if (!btnMonCompte || !authModal || !closeModalBtn) {
        setTimeout(initAuthModal, 100);
        return;
      }

      // Gérer le toggle "Lire plus"
      const privacyToggle = document.getElementById("privacy-toggle");
      const privacyTextShort = document.getElementById("privacy-text-short");
      const privacyTextFull = document.getElementById("privacy-text-full");

      if (privacyToggle && privacyTextShort && privacyTextFull) {
        privacyToggle.addEventListener("click", function (e) {
          e.preventDefault();
          if (privacyTextFull.style.display === "none") {
            privacyTextShort.style.display = "none";
            privacyTextFull.style.display = "inline";
            privacyToggle.textContent = "Lire moins";
          } else {
            privacyTextShort.style.display = "inline";
            privacyTextFull.style.display = "none";
            privacyToggle.textContent = "Lire plus";
          }
        });
      }

      // Gérer le toggle afficher/masquer mot de passe
      const togglePassword = document.getElementById("toggle-password");
      const passwordInput = document.getElementById("password-input");

      if (togglePassword && passwordInput) {
        const eyeIcon = togglePassword.querySelector("svg path");
        const eyeOpenPath =
          "M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z";
        const eyeClosedPath =
          "M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.74,7.13 11.35,7 12,7Z";

        togglePassword.addEventListener("click", function () {
          const type = passwordInput.getAttribute("type");
          if (type === "password") {
            passwordInput.setAttribute("type", "text");
            if (eyeIcon) eyeIcon.setAttribute("d", eyeClosedPath);
          } else {
            passwordInput.setAttribute("type", "password");
            if (eyeIcon) eyeIcon.setAttribute("d", eyeOpenPath);
          }
        });
      }

      // Gérer la soumission du formulaire de connexion
      const loginForm = document.getElementById("login-form");
      const emailInput = document.getElementById("email-input");
      const emailError = document.getElementById("email-error");
      const urlRedirectionInput = document.getElementById("url-redirection");
      const loginSubmitBtn = document.getElementById("login-submit-btn");

      if (loginForm && emailInput && passwordInput && urlRedirectionInput && loginSubmitBtn && emailError) {
        // Pré-remplir l'URL de redirection
        urlRedirectionInput.value = "https://www.cadremploi.fr/emploi/perso/dashboard";

        // Fonction pour valider l'email (même regex que validationRules.ts)
        function validateEmail(email) {
          const emailRegex = /.[^\n\r@\u2028\u2029]*@.+\..+/;
          return emailRegex.test(email);
        }

        // Fonction pour vérifier si le formulaire est valide
        function checkFormValidity() {
          const email = emailInput.value.trim();
          const password = passwordInput.value;
          let isValid = true;

          // Valider l'email si le champ n'est pas vide
          if (email) {
            if (!validateEmail(email)) {
              emailInput.classList.add("error");
              emailError.style.display = "block";
              isValid = false;
            } else {
              emailInput.classList.remove("error");
              emailError.style.display = "none";
            }
          } else {
            // Si le champ est vide, enlever l'erreur
            emailInput.classList.remove("error");
            emailError.style.display = "none";
          }

          // Activer/désactiver le bouton selon la validité
          if (email && password && isValid) {
            // Activer le bouton
            loginSubmitBtn.removeAttribute("disabled");
            loginSubmitBtn.classList.remove("v-btn--disabled");
          } else {
            // Désactiver le bouton
            loginSubmitBtn.setAttribute("disabled", "disabled");
            loginSubmitBtn.classList.add("v-btn--disabled");
          }
        }

        // Vérifier la validité au chargement
        checkFormValidity();

        // Ajouter des écouteurs sur les champs
        emailInput.addEventListener("input", checkFormValidity);
        emailInput.addEventListener("blur", checkFormValidity);
        passwordInput.addEventListener("input", checkFormValidity);

        loginForm.addEventListener("submit", function (e) {
          // Validation basique
          const email = emailInput.value.trim();
          const password = passwordInput.value;

          if (!email || !password) {
            e.preventDefault();
            alert("Veuillez remplir tous les champs");
            return;
          }

          // Valider l'email avant de soumettre
          if (!validateEmail(email)) {
            e.preventDefault();
            emailInput.classList.add("error");
            emailError.style.display = "block";
            return;
          }

          // TODO: Appeler reCAPTCHA ici en production
          // Laisser le formulaire se soumettre naturellement pour faire la redirection
        });
      }

      // Ouvrir la modal
      btnMonCompte.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        authModal.style.display = "flex";
        setTimeout(() => {
          authModal.classList.add("show");
        }, 10);
        // Fermer les menus déroulants
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.classList.remove("show");
          menu.style.display = "none";
        });
        // Fermer le menu mobile s'il est ouvert
        if (window.__closeMobileMenu) {
          window.__closeMobileMenu();
        }
      });

      // Fermer la modal avec le bouton X
      closeModalBtn.addEventListener("click", function (e) {
        e.preventDefault();
        authModal.classList.remove("show");
        setTimeout(() => {
          authModal.style.display = "none";
        }, 300);
      });

      // Fermer la modal en cliquant sur l'overlay
      authModal.addEventListener("click", function (e) {
        if (e.target === authModal) {
          authModal.classList.remove("show");
          setTimeout(() => {
            authModal.style.display = "none";
          }, 300);
        }
      });

      // Fermer la modal avec la touche Échap
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && authModal.classList.contains("show")) {
          authModal.classList.remove("show");
          setTimeout(() => {
            authModal.style.display = "none";
          }, 300);
        }
      });
    }

    // Initialiser immédiatement ou attendre que le DOM soit prêt
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initDropdowns);
    } else {
      // DOM déjà chargé, initialiser après un court délai
      setTimeout(initDropdowns, 100);
    }
  })();
})();

// Bouton de paramétrage des cookies (CMP)
(function () {
  (function () {
    const cookiesButton = document.getElementById("cookies-button");
    if (cookiesButton) {
      cookiesButton.addEventListener("click", function () {
        // Essayer d'ouvrir le CMP s'il existe
        if (window.__tcfapi) {
          window.__tcfapi("show", 2, console.log, { jumpAt: "privacy" });
        } else {
          console.log("CMP non disponible");
        }
      });
    }
  })();
})();
