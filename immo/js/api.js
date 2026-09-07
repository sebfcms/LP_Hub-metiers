/* ============================================================
   js/api.js
   Appels API — offres + autocomplete locations
   Future migration Next.js : ce fichier → lib/api.ts
   ============================================================ */

const API = {

  /* ── Fetch offres ─────────────────────────────────────────
     Retourne un tableau d'offres normalisées
     --------------------------------------------------------- */
  async fetchOffres(limit = 6) {
    const { API_KEY, API_BASE, SECTOR } = CONFIG

    const params = new URLSearchParams({
      fonction: SECTOR.fonction,
      secteur:  SECTOR.secteur,
      contrat:  SECTOR.contrat,
      limit:    limit,
      sort:     SECTOR.sort,
    })

    try {
      const res = await fetch(`${API_BASE}/web/offers?${params}`, {
        headers: {
          'x-api-key':    API_KEY,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const json = await res.json()

      // Fusionner offresExact + offresNeighbors si pas assez de résultats
      const offres = [
        ...(json.offersExact    || []),
        ...(json.offersNeighbors || []),
      ].slice(0, limit)

      return offres.map(API._normalizeOffre)

    } catch (err) {
      console.error('[API] fetchOffres error:', err)
      return []
    }
  },

  /* ── Normalisation offre ──────────────────────────────────
     Transforme la réponse API en objet simple et cohérent
     --------------------------------------------------------- */
  _normalizeOffre(raw) {
    const salMin = raw.remuneration?.salaireMin
    const salMax = raw.remuneration?.salaireMax
    const masquer = raw.remuneration?.masquer

    let salaire = null
    if (!masquer && salMin && salMax) {
      if (salMin === salMax) {
        salaire = `${Math.round(salMin / 1000)}k€`
      } else {
        // Filtrer les fourchettes aberrantes (10k-200k = pas affiché)
        const diff = salMax - salMin
        if (diff < 100000) {
          salaire = `${Math.round(salMin / 1000)}–${Math.round(salMax / 1000)}k€`
        }
      }
    }

    // Construction du lien offre
    const postulerType = raw.postuler?.postulerType
    const offreId = raw.offreId
    let lienOffre = '#'
    if (postulerType === 'CADREMPLOI') {
      lienOffre = `${CONFIG.URLS.offre}${offreId}`
    } else if (postulerType === 'SITE_RECRUTEUR') {
      lienOffre = `${CONFIG.URLS.offre}${offreId}` // redirect côté serveur
    }

    // Badge principal
    const badge = raw.badges?.offerBadges?.[0]?.libelle || null
    const isNew = badge === 'Nouveau'

    // Date relative
    const dateStr = raw.datePublication
    const dateRel = dateStr ? API._relativeDate(new Date(dateStr)) : ''

    return {
      id:          offreId,
      titre:       raw.poste?.titre || '',
      description: raw.poste?.description || '',
      entreprise:  raw.entreprise?.raisonSociale || '',
      logo:        raw.entreprise?.logo80 || null,
      ville:       raw.localisation?.libelle || '',
      contrat:     raw.contrat?.typeContrat?.label || 'CDI',
      salaire,
      lienOffre,
      isNew,
      badge,
      dateRel,
      datePublication: dateStr,
    }
  },

  /* ── Date relative ── */
  _relativeDate(date) {
    const now = new Date()
    const diffMs = now - date
    const diffH  = Math.floor(diffMs / 3600000)
    const diffD  = Math.floor(diffMs / 86400000)
    if (diffH < 1)  return 'À l\'instant'
    if (diffH < 24) return `Il y a ${diffH}h`
    if (diffD === 1) return 'Hier'
    if (diffD < 7)  return `Il y a ${diffD} jours`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  },

  /* ── Autocomplete locations ───────────────────────────────
     Endpoint : GET /services/suggestions/v1/locations/{terme}
     Réponse  : { cities: [{city, slug, department}], departments: [...] }
     --------------------------------------------------------- */
  async fetchLocations(query) {
    if (!query || query.length < 2) return []
    try {
      const res = await fetch(
        `${CONFIG.URLS.locations}${encodeURIComponent(query)}`
      )
      if (!res.ok) return []
      const json = await res.json()
      if (!json.hasSuggestions) return []

      // Fusionner villes + départements, max 6 résultats
      const cities = (json.cities || []).map(c => ({
        label: `${c.city} (${c.department.code})`,
        slug:  c.slug,   // ex: "nantes-44100" → utilisé dans ?ville=
        type:  'ville',
      }))
      const depts = (json.departments || []).map(d => ({
        label: `${d.department.label} (${d.department.code})`,
        slug:  `${d.department.label.toLowerCase().replace(/\s+/g, '-')}-${d.department.code}`,
        type:  'département',
      }))

      return [...cities, ...depts].slice(0, 6)
    } catch {
      return []
    }
  },
}
