/* ============================================================
   js/modal.js
   Modale alerte emploi
   Future migration Next.js : → components/ui/AlerteModal.tsx
   ============================================================ */

const Modal = {

  _overlay: null,
  _posteInput: null,

  init() {
    this._overlay   = document.getElementById('modal-overlay')
    this._posteInput = document.getElementById('modal-poste')
    if (!this._overlay) return

    // Fermeture
    document.getElementById('modal-close')?.addEventListener('click', () => this.close())
    this._overlay.addEventListener('click', e => {
      if (e.target === this._overlay) this.close()
    })

    // Boutons fréquence
    document.querySelectorAll('.freq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.freq-row').querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
      })
    })

    // Touches clavier
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close()
    })
  },

  open(prefillPoste = '') {
    if (!this._overlay) return
    if (prefillPoste && this._posteInput) {
      this._posteInput.value = prefillPoste
    }
    this._overlay.classList.add('open')
    document.body.style.overflow = 'hidden'
    this._posteInput?.focus()
  },

  close() {
    if (!this._overlay) return
    this._overlay.classList.remove('open')
    document.body.style.overflow = ''
  },
}
