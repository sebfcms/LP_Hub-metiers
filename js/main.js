/* ============================================================
   js/main.js
   Point d'entrée — initialise et orchestre tous les modules
   ============================================================ */

/* ── Utilitaires DOM ── */
const $ = id => document.getElementById(id)
const $$ = sel => document.querySelectorAll(sel)

/* ── Rendu des offres dans la grille ── */
function renderJobsGrid(offres, containerId) {
  const container = $(containerId)
  if (!container) return

  if (!offres.length) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:32px;color:var(--muted-fg);">
        Aucune offre disponible pour le moment.
      </div>`
    return
  }

  container.innerHTML = offres.map(offre => `
    <article class="job-card">
      <div class="job-card__top">
        <div class="job-card__logo">
          ${offre.logo
            ? `<img src="${offre.logo}" alt="${offre.entreprise}" loading="lazy">`
            : offre.entreprise.substring(0, 3).toUpperCase()
          }
        </div>
        <div>
          <div class="job-card__company">${offre.entreprise} · ${offre.ville}</div>
          <h3 class="job-card__title">${offre.titre}</h3>
        </div>
      </div>
      <div class="job-card__tags">
        <span class="tag tag--cdi">${offre.contrat}</span>
        ${offre.salaire ? `<span class="tag tag--salary">${offre.salaire}</span>` : ''}
        ${offre.isNew   ? `<span class="tag tag--new">Nouveau</span>` : ''}
      </div>
      <div class="job-card__footer">
        <time class="job-card__date">${offre.dateRel}</time>
        <a href="${offre.lienOffre}" class="job-card__link" target="_blank" rel="noopener">
          Voir l'offre →
        </a>
      </div>
    </article>
  `).join('')
}

/* ── Skeleton pendant le chargement ── */
function renderJobsSkeleton(containerId, count = 6) {
  const container = $(containerId)
  if (!container) return
  container.innerHTML = Array(count).fill(`
    <div class="job-card" style="pointer-events:none;">
      <div class="job-card__top">
        <div class="skeleton skeleton--logo"></div>
        <div style="flex:1;">
          <div class="skeleton skeleton--text" style="width:40%;margin-bottom:6px;"></div>
          <div class="skeleton skeleton--title"></div>
        </div>
      </div>
      <div class="skeleton skeleton--text" style="width:60%;margin-top:8px;"></div>
    </div>
  `).join('')
}

/* ── Métiers — toggle actif ── */
function initMetiers() {
  $$('.metier-card').forEach(card => {
    card.addEventListener('click', () => {
      $$('.metier-card').forEach(c => c.classList.remove('active'))
      card.classList.add('active')
    })
  })
}

/* ── Sector pills footer ── */
function initSectorPills() {
  $$('.sector-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      $$('.sector-pill').forEach(p => p.classList.remove('active'))
      pill.classList.add('active')
    })
  })
}

/* ── Search — moteur de recherche avec autocomplete ── */
function initSearch() {
  const inputPoste  = $('search-poste')
  const inputLieu   = $('search-lieu')
  const btnSearch   = $('search-btn')
  const btnAlerte   = $('search-alerte')
  const dropPoste   = $('dropdown-poste')
  const dropLieu    = $('dropdown-lieu')

  /* ── Construction URL ──
     Format : ?query=devops&ville=nantes-44100
  ── */
  function buildSearchUrl(query, villeSlug) {
    const base = 'https://www.cadremploi.fr/emploi/liste_offres'
    const params = new URLSearchParams()
    if (query)     params.set('query', query.trim().toLowerCase().replace(/\s+/g, '-'))
    if (villeSlug) params.set('ville', villeSlug.trim())
    const qs = params.toString()
    return qs ? `${base}?${qs}` : base
  }

  function doSearch() {
    const slug = inputLieu?.dataset?.slug || inputLieu?.value || ''
    const url = buildSearchUrl(inputPoste?.value || '', slug)
    closeAll()
    window.open(url, '_blank', 'noopener')
  }

  /* ── Dropdown helpers ── */
  function closeAll() {
    dropPoste?.classList.remove('open')
    dropLieu?.classList.remove('open')
  }

  function highlight(text, query) {
    if (!query) return text
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(re, '<mark>$1</mark>')
  }

  /* ── Autocomplete POSTES (liste statique avec catégories) ── */
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  function showJobSuggestions(query) {
    if (!query || query.length < 1 || !dropPoste) {
      dropPoste?.classList.remove('open')
      return
    }
    const q = query.toLowerCase()

    // Chercher dans toutes les catégories
    const groups = []
    CONFIG.JOBS_SUGGESTIONS.forEach(group => {
      const matches = group.items
        .filter(j => j.toLowerCase().includes(q))
        .slice(0, 5)
      if (matches.length) groups.push({ category: group.category, matches })
    })

    if (!groups.length) { dropPoste.classList.remove('open'); return }

    // Limiter à 6 résultats au total
    let total = 0
    dropPoste.innerHTML = groups.map(group => {
      if (total >= 6) return ''
      const items = group.matches.slice(0, 6 - total)
      total += items.length
      return `
        <div class="autocomplete-category" data-value="${group.category}">${group.category}</div>
        ${items.map(label => `
          <div class="autocomplete-item" data-value="${capitalize(label)}">
            <span class="autocomplete-item__label">${highlight(capitalize(label), capitalize(query))}</span>
          </div>
        `).join('')}
      `
    }).join('')

    // Clic sur un métier
    dropPoste.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('mousedown', e => {
        e.preventDefault()
        inputPoste.value = item.dataset.value
        dropPoste.classList.remove('open')
        inputLieu?.focus()
      })
    })

    // Clic sur une catégorie → lance la recherche sur la catégorie
    dropPoste.querySelectorAll('.autocomplete-category').forEach(cat => {
      cat.addEventListener('mousedown', e => {
        e.preventDefault()
        inputPoste.value = cat.dataset.value
        dropPoste.classList.remove('open')
        doSearch()
      })
    })

    dropPoste.classList.add('open')
  }

  /* ── Autocomplete LIEUX (API) ── */
  let geoTimer = null
  async function showLocationSuggestions(query) {
    if (!query || query.length < 2 || !dropLieu) {
      dropLieu?.classList.remove('open')
      return
    }
    const suggestions = await API.fetchLocations(query)
    if (!suggestions.length) { dropLieu.classList.remove('open'); return }

    dropLieu.innerHTML = suggestions.map(s => `
      <div class="autocomplete-item" data-value="${s.slug}" data-label="${s.label}">
        <span class="autocomplete-item__label">${highlight(s.label, query)}</span>
        <span class="autocomplete-item__type">${s.type}</span>
      </div>
    `).join('')

    dropLieu.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('mousedown', e => {
        e.preventDefault()
        inputLieu.value = item.dataset.label
        inputLieu.dataset.slug = item.dataset.value  // slug pour l'URL
        dropLieu.classList.remove('open')
      })
    })

    dropLieu.classList.add('open')
  }

  /* ── Listeners inputs ── */
  inputPoste?.addEventListener('input', () => {
    showJobSuggestions(inputPoste.value)
  })
  inputPoste?.addEventListener('focus', () => {
    if (inputPoste.value) showJobSuggestions(inputPoste.value)
  })

  inputLieu?.addEventListener('input', () => {
    inputLieu.dataset.slug = ''
    clearTimeout(geoTimer)
    geoTimer = setTimeout(() => showLocationSuggestions(inputLieu.value), 250)
  })
  inputLieu?.addEventListener('focus', () => {
    if (inputLieu.value) showLocationSuggestions(inputLieu.value)
  })

  // Fermer en cliquant ailleurs
  document.addEventListener('click', e => {
    if (!e.target.closest('.autocomplete-wrap')) closeAll()
  })

  // Clavier
  ;[inputPoste, inputLieu].forEach(input => {
    input?.addEventListener('keydown', e => {
      if (e.key === 'Enter')  doSearch()
      if (e.key === 'Escape') closeAll()
    })
  })

  /* ── Tags populaires ── */
  $$('.search-card__tag').forEach(tag => {
    if (tag.tagName === 'BUTTON') {
      tag.addEventListener('click', e => {
        e.preventDefault()
        if (inputPoste) inputPoste.value = tag.textContent.trim()
        doSearch()
      })
    }
    // Les <a> naviguent nativement
  })

  /* ── Alerte ── */
  btnAlerte?.addEventListener('click', () => Modal.open(inputPoste?.value || ''))
  $$('[data-open-alerte]').forEach(btn => btn.addEventListener('click', () => Modal.open()))

  /* ── Bouton rechercher ── */
  btnSearch?.addEventListener('click', doSearch)
}

/* ════════════════════════════════════════
   INIT PRINCIPALE
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {

  /* ── Feature flags ─────────────────────────────────────────
     Appliqués en premier avant tout rendu
  ── */
  if (!CONFIG.FEATURES.alertes) {
    // Masque tous les boutons alerte + la modale
    document.querySelectorAll(
      '[data-open-alerte], #search-alerte, .search-card__alerte-row, #modal-overlay, .btn-ghost[data-open-alerte]'
    ).forEach(el => el.style.display = 'none')
    // Masque aussi le bouton "Créer mon alerte" dans le hero
    document.querySelectorAll('.hero__actions .btn-ghost').forEach(el => el.style.display = 'none')
  }

  if (!CONFIG.FEATURES.ticker) {
    const ticker = document.getElementById('section-ticker')
    if (ticker) ticker.style.display = 'none'
  }

  if (!CONFIG.FEATURES.offres) {
    const offres = document.getElementById('section-offres')
    if (offres) offres.style.display = 'none'
  }

  /* ── Injection des chiffres clés depuis CONFIG.CHIFFRES ────
     Pour mettre à jour : modifier CONFIG.CHIFFRES dans config.js
  ── */
  const ch = CONFIG.CHIFFRES
  // Volume CVthèque (valeur de départ — profiles.js incrémente ensuite)
  const pcEl = document.getElementById('profiles-count')
  if (pcEl) pcEl.textContent = ch.cvtheque.toLocaleString('fr-FR')
  // Nb entreprises dans la desc CVthèque
  const ceEl = document.getElementById('cv-entreprises')
  if (ceEl) ceEl.textContent = ch.entreprises.toLocaleString('fr-FR')
  // Stats hero (3 blocs dans l'ordre : offres, salaire, %)
  const heroStats = document.querySelectorAll('.hero__stat-n')
  if (heroStats[0]) heroStats[0].innerHTML = `${ch.offres}<span>+</span>`
  if (heroStats[1]) heroStats[1].innerHTML = `${ch.salaire}`
  if (heroStats[2]) heroStats[2].innerHTML = `${ch.salaire_pct}`
  // Eyebrow hero
  const eyebrowEl = document.querySelector('.hero__eyebrow')
  if (eyebrowEl) {
    const dot = eyebrowEl.querySelector('.hero__eyebrow-dot')
    eyebrowEl.textContent = ` ${ch.offres} offres Tech actives en ce moment`
    if (dot) eyebrowEl.prepend(dot)
  }


  Modal.init()
  initMetiers()
  initSectorPills()
  initSearch()

  /* Burger mobile header */
  const burger     = $('hd-burger')
  const mobileMenu = $('hd-mobile')
  const iconOpen   = $('hd-burger-open')
  const iconClose  = $('hd-burger-close')
  burger?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open')
    burger.setAttribute('aria-expanded', isOpen)
    iconOpen.style.display  = isOpen ? 'none'  : 'block'
    iconClose.style.display = isOpen ? 'block' : 'none'
    mobileMenu.setAttribute('aria-hidden', !isOpen)
  })

  /* Dropdowns desktop */
  document.querySelectorAll('.hd-nav__btn[data-dropdown]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation()
      const id    = btn.dataset.dropdown
      const panel = $(`hd-panel-${id}`)
      const isOpen = panel.classList.contains('open')

      // Ferme tout
      document.querySelectorAll('.hd-dropdown__panel').forEach(p => p.classList.remove('open'))
      document.querySelectorAll('.hd-nav__btn[data-dropdown]').forEach(b => b.setAttribute('aria-expanded', 'false'))

      if (!isOpen) {
        panel.classList.add('open')
        btn.setAttribute('aria-expanded', 'true')
      }
    })
  })

  // Fermer en cliquant ailleurs
  document.addEventListener('click', e => {
    if (!e.target.closest('.hd-dropdown')) {
      document.querySelectorAll('.hd-dropdown__panel').forEach(p => p.classList.remove('open'))
      document.querySelectorAll('.hd-nav__btn[data-dropdown]').forEach(b => b.setAttribute('aria-expanded', 'false'))
    }
  })

  // Fermer avec Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.hd-dropdown__panel').forEach(p => p.classList.remove('open'))
      document.querySelectorAll('.hd-nav__btn[data-dropdown]').forEach(b => b.setAttribute('aria-expanded', 'false'))
    }
  })

  /* Accordéons mobile */
  document.querySelectorAll('.hd-mobile__toggle[data-mobile]').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const id  = toggle.dataset.mobile
      const sub = $(`hd-mobile-${id}`)
      const isOpen = sub.classList.contains('open')

      // Ferme tous
      document.querySelectorAll('.hd-mobile__sub').forEach(s => s.classList.remove('open'))
      document.querySelectorAll('.hd-mobile__toggle').forEach(t => t.classList.remove('open'))

      if (!isOpen) {
        sub.classList.add('open')
        toggle.classList.add('open')
      }
    })
  })

  /* Carrousel entreprises */
  const carousel = $('ent-carousel')
  const btnPrev  = $('ent-prev')
  const btnNext  = $('ent-next')

  function updateCarouselBtns() {
    if (!carousel) return
    const { scrollLeft, scrollWidth, clientWidth } = carousel
    if (btnPrev) btnPrev.style.display = scrollLeft > 0 ? 'flex' : 'none'
    if (btnNext) btnNext.style.display = scrollLeft + clientWidth < scrollWidth - 1 ? 'flex' : 'none'
  }

  btnPrev?.addEventListener('click', () => { carousel.scrollBy({ left: -300, behavior: 'smooth' }); setTimeout(updateCarouselBtns, 350) })
  btnNext?.addEventListener('click', () => { carousel.scrollBy({ left: 300, behavior: 'smooth' }); setTimeout(updateCarouselBtns, 350) })
  carousel?.addEventListener('scroll', updateCarouselBtns)
  updateCarouselBtns()
  Profiles.init('profiles-list', 'profiles-count')

  /* 3. Offres — skeleton puis données réelles */
  renderJobsSkeleton('jobs-grid-main', 6)

  const offres = await API.fetchOffres(CONFIG.SECTOR.limit)

  /* 4. Ticker — 15 premières offres */
  Ticker.init('ticker-track', offres.slice(0, 15))

  /* 5. Grille — 6 premières offres */
  renderJobsGrid(offres.slice(0, 6), 'jobs-grid-main')

})
