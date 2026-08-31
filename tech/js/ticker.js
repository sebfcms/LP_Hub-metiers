/* ============================================================
   js/ticker.js
   Ticker défilement — offres réelles depuis l'API
   Future migration Next.js : → components/ui/Ticker.tsx
   ============================================================ */

const Ticker = {

  init(trackId, offres) {
    const track = document.getElementById(trackId)
    if (!track || !offres.length) return

    // Génère les items (doublés pour la boucle infinie CSS)
    const items = this._buildItems(offres)
    track.innerHTML = items + items // duplication pour loop seamless
  },

  _buildItems(offres) {
    return offres.map(offre => {
      const isNew = offre.isNew
      const badge = isNew
        ? `<span class="ticker__badge ticker__badge--new">Nouveau</span>`
        : ''

      // Couleur avatar basée sur le premier caractère du nom entreprise
      const colors = this._colorFromName(offre.entreprise)

      return `
        <div class="ticker__item">
          <div class="ticker__av" style="background:${colors.bg};color:${colors.fg};">
            ${offre.entreprise.charAt(0)}
          </div>
          <span class="ticker__text">
            <strong>${offre.titre}</strong>
            · ${offre.entreprise}
            · ${offre.ville}
            ${offre.salaire ? `· ${offre.salaire}` : ''}
          </span>
          ${badge}
        </div>
      `
    }).join('')
  },

  /* ── Couleur déterministe basée sur le nom ── */
  _colorFromName(name) {
    const palettes = [
      { bg: '#EEF2FF', fg: '#3730A3' },
      { bg: '#F0FDF4', fg: '#166534' },
      { bg: '#FFF0F6', fg: '#9B0037' },
      { bg: '#F0F9FF', fg: '#0369A1' },
      { bg: '#FFF7ED', fg: '#C2410C' },
      { bg: '#FDF4FF', fg: '#7E22CE' },
      { bg: '#F1F5F9', fg: '#1d3d75' },
    ]
    const idx = name.charCodeAt(0) % palettes.length
    return palettes[idx]
  },
}
