/* ============================================================
   js/main.js
   Point d'entrée — initialise et orchestre le hub Immobilier.

   Adapté de tech/js/main.js : la logique moteur de recherche / feature
   flags / carrousel entreprises est reprise à l'identique. Ce qui a été
   retiré volontairement (pas de garniture superflue à porter) :
   - renderJobsGrid/renderJobsSkeleton : pas de bloc "Offres récentes"
     sur ce hub (voir immo/AVANT_MISE_EN_PROD.md)
   - initMetiers/initSectorPills, le burger/dropdowns "hd-*" : ciblaient
     un ancien header custom, mort depuis le passage au header prod réel
     (voir tech/css/layout.css, section "DROPDOWNS HEADER" — inutilisée
     dans le HTML actuel). Le header/footer prod, lui, est piloté par
     ../assets/js/header-footer-shared.js, chargé séparément.
   - Profiles.init : pas de carte "profils inscrits" ici, remplacée par
     l'aperçu baromètre (statique, pas de simulation live).
   ============================================================ */

const $ = id => document.getElementById(id)
const $$ = sel => document.querySelectorAll(sel)

/* ── Search — moteur de recherche avec autocomplete ── */
function initSearch() {
  const inputPoste  = $('search-poste')
  const inputLieu   = $('search-lieu')
  const btnSearch   = $('search-btn')
  const btnAlerte   = $('search-alerte')
  const dropPoste   = $('dropdown-poste')
  const dropLieu    = $('dropdown-lieu')

  /* ── Construction URL ──
     Format : ?query=negociateur-immobilier&ville=lyon-69000
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

  /* ── Insensible aux accents : "negociateur" doit remonter "négociateur" ── */
  function normalize(str) {
    return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  }

  function highlight(text, query) {
    if (!query) return text
    // Recherche sur les versions sans accent (mêmes longueurs/indices que le
    // texte original — un caractère accentué se décompose en 1 lettre de base
    // + 1 accent, qu'on retire), puis on surligne le texte ORIGINAL à cette
    // position pour ne pas perdre les accents affichés.
    const normText  = normalize(text)
    const normQuery = normalize(query)
    const idx = normText.indexOf(normQuery)
    if (idx === -1) return text
    return (
      text.slice(0, idx) +
      '<mark>' + text.slice(idx, idx + normQuery.length) + '</mark>' +
      text.slice(idx + normQuery.length)
    )
  }

  /* ── Autocomplete POSTES (liste statique à plat, sans catégorie —
     voir js/config.js) ── */
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  function showJobSuggestions(query) {
    if (!query || query.length < 1 || !dropPoste) {
      dropPoste?.classList.remove('open')
      return
    }
    const q = normalize(query)

    const matches = CONFIG.JOBS_SUGGESTIONS
      .filter(label => normalize(label).includes(q))
      .slice(0, 6)

    if (!matches.length) { dropPoste.classList.remove('open'); return }

    dropPoste.innerHTML = matches.map(label => `
      <div class="autocomplete-item" data-value="${capitalize(label)}">
        <span class="autocomplete-item__label">${highlight(capitalize(label), capitalize(query))}</span>
      </div>
    `).join('')

    dropPoste.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('mousedown', e => {
        e.preventDefault()
        inputPoste.value = item.dataset.value
        dropPoste.classList.remove('open')
        inputLieu?.focus()
      })
    })

    dropPoste.classList.add('open')
  }

  /* ── Autocomplete LIEUX (API publique de suggestions, pas de clé requise) ── */
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
        inputLieu.dataset.slug = item.dataset.value
        dropLieu.classList.remove('open')
      })
    })

    dropLieu.classList.add('open')
  }

  /* ── Listeners inputs ── */
  inputPoste?.addEventListener('input', () => showJobSuggestions(inputPoste.value))
  inputPoste?.addEventListener('focus', () => { if (inputPoste.value) showJobSuggestions(inputPoste.value) })

  inputLieu?.addEventListener('input', () => {
    inputLieu.dataset.slug = ''
    clearTimeout(geoTimer)
    geoTimer = setTimeout(() => showLocationSuggestions(inputLieu.value), 250)
  })
  inputLieu?.addEventListener('focus', () => { if (inputLieu.value) showLocationSuggestions(inputLieu.value) })

  document.addEventListener('click', e => {
    if (!e.target.closest('.autocomplete-wrap')) closeAll()
  })

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

  /* ── Feature flags — appliqués avant tout rendu ── */
  if (!CONFIG.FEATURES.alertes) {
    document.querySelectorAll(
      '[data-open-alerte], #search-alerte, .search-card__alerte-row, #modal-overlay, .btn-ghost[data-open-alerte]'
    ).forEach(el => el.style.display = 'none')
    document.querySelectorAll('.hero__actions .btn-ghost').forEach(el => el.style.display = 'none')
  }

  if (!CONFIG.FEATURES.ticker) {
    const ticker = document.getElementById('section-ticker')
    if (ticker) ticker.style.display = 'none'
  }

  /* ── Injection des chiffres clés depuis CONFIG.CHIFFRES ────
     Pour mettre à jour : modifier CONFIG.CHIFFRES dans config.js
  ── */
  const ch = CONFIG.CHIFFRES
  // Stats hero (3 blocs dans l'ordre : offres, départements, réseaux)
  const heroStats = document.querySelectorAll('.hero__stat-n')
  if (heroStats[0]) heroStats[0].innerHTML = `${ch.offres}<span>+</span>`
  if (heroStats[1]) heroStats[1].innerHTML = `${ch.departements}`
  if (heroStats[2]) heroStats[2].innerHTML = `${ch.reseaux}`
  // Eyebrow hero
  const eyebrowEl = document.querySelector('.hero__eyebrow')
  if (eyebrowEl) {
    const dot = eyebrowEl.querySelector('.hero__eyebrow-dot')
    eyebrowEl.textContent = ` ${ch.offres} offres Immobilier actives en ce moment`
    if (dot) eyebrowEl.prepend(dot)
  }

  Modal.init()
  initSearch()

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

  /* Ticker — appel API conditionné par le même flag que l'affichage :
     tant que FEATURES.ticker est à false, aucun appel n'est fait. */
  if (CONFIG.FEATURES.ticker) {
    const offres = await API.fetchOffres(CONFIG.SECTOR.limit)
    Ticker.init('ticker-track', offres.slice(0, 15))
  }
})
