/* ============================================================
   js/profiles.js
   Simulation profils live CVthèque — 100 profils crédibles
   Rythme réaliste : actif 8h-20h, ralenti 20h-23h, nuit 23h-7h
   ============================================================ */

const Profiles = {
  _maxRows: 5,
  _listEl: null,
  _countEl: null,
  _volume: 68214,
  _activeIdx: [], // indices des profils déjà affichés (évite les doublons)
  _timestamps: [], // timestamps réels des 5 profils affichés

  init(listId, countId) {
    this._listEl = document.getElementById(listId);
    this._countEl = document.getElementById(countId);
    if (!this._listEl) return;

    this._renderInitial();
    this._scheduleNext();
    setInterval(() => this._refreshTimes(), 60000); // rafraîchit toutes les minutes
    setInterval(() => this._tickVolume(), 180000); // volume toutes les 3 min
  },

  /* ── Rendu initial ── */
  _renderInitial() {
    const now = Date.now();
    const h = new Date().getHours();

    // Échelonnement crédible selon l'heure actuelle
    let offsets; // en minutes dans le passé
    if (h >= 8 && h < 20) {
      // Journée : inscriptions récentes, espacées de façon variable
      offsets = [
        this._rand(3, 18),
        this._rand(22, 55),
        this._rand(60, 110),
        this._rand(120, 200),
        this._rand(220, 360),
      ];
    } else if (h >= 20 && h < 23) {
      // Soirée : moins fréquent
      offsets = [
        this._rand(15, 45),
        this._rand(60, 120),
        this._rand(140, 240),
        this._rand(260, 400),
        this._rand(420, 600),
      ];
    } else {
      // Nuit : dernière inscription plusieurs heures avant
      offsets = [
        this._rand(60, 180),
        this._rand(200, 360),
        this._rand(380, 600),
        this._rand(620, 900),
        this._rand(920, 1440),
      ];
    }

    offsets.forEach((offset) => {
      const profile = this._pick();
      const ts = now - offset * 60 * 1000;
      this._timestamps.push(ts);
      this._listEl.appendChild(this._buildRow(profile, ts, false));
    });
  },

  /* ── Nouveau profil en haut ── */
  _addNew() {
    const h = new Date().getHours();
    // Nuit : on n'ajoute pas de nouveau profil, les timestamps s'écoulent naturellement
    if (h >= 23 || h < 7) return;

    const profile = this._pick();
    const ts = Date.now();

    this._timestamps.unshift(ts);
    if (this._timestamps.length > this._maxRows) this._timestamps.pop();

    const row = this._buildRow(profile, ts, true);
    this._listEl.insertBefore(row, this._listEl.firstChild);

    if (this._listEl.children.length > this._maxRows) {
      const last = this._listEl.lastChild;
      last.style.transition = "opacity .4s";
      last.style.opacity = "0";
      setTimeout(() => last.remove(), 400);
    }

    this._tickVolume();
  },

  /* ── Planification du prochain profil ── */
  _scheduleNext() {
    const h = new Date().getHours();
    let delay;

    if (h >= 8 && h < 20) {
      // Journée : 8 à 18 minutes
      delay = this._rand(480, 1080) * 1000;
    } else if (h >= 20 && h < 23) {
      // Soirée : 25 à 45 minutes
      delay = this._rand(1500, 2700) * 1000;
    } else {
      // Nuit : on recheck dans 20 min (rien ne s'ajoute)
      delay = 20 * 60 * 1000;
    }

    setTimeout(() => {
      this._addNew();
      this._scheduleNext();
    }, delay);
  },

  /* ── Pick un profil sans doublon consécutif ── */
  _pick() {
    const pool = CONFIG.PROFILES_POOL;
    let idx;
    let attempts = 0;
    do {
      idx = Math.floor(Math.random() * pool.length);
      attempts++;
    } while (this._activeIdx.includes(idx) && attempts < 20);

    this._activeIdx.push(idx);
    if (this._activeIdx.length > 10) this._activeIdx.shift();

    return {
      ...pool[idx],
      letter: this._randomLetter(),
    };
  },

  /* ── Construit une ligne profil ── */
  _buildRow(profile, ts, isNew) {
    const colors = CONFIG.PROFILE_COLORS[profile.cat];
    const div = document.createElement("div");
    div.className = `profile-row${isNew ? " anim-slide-in" : ""}`;
    div.innerHTML = `
      <div class="profile-row__av" style="background:${colors.bg};color:${colors.fg};">
        ${profile.letter}
      </div>
      <div class="profile-row__info">
        <div class="profile-row__role">${profile.role}</div>
        <div class="profile-row__meta">${profile.region} · ${profile.exp}</div>
      </div>
      <div class="profile-row__time js-ts">${this._relTime(ts)}</div>
    `;
    return div;
  },

  /* ── Rafraîchit les horodatages affichés ── */
  _refreshTimes() {
    this._listEl?.querySelectorAll(".js-ts").forEach((el, i) => {
      if (this._timestamps[i])
        el.textContent = this._relTime(this._timestamps[i]);
    });
  },

  /* ── Volume non-linéaire ── */
  _tickVolume() {
    const h = new Date().getHours();
    const we = [0, 6].includes(new Date().getDay());
    if (h >= 23 || h < 7) return; // nuit : pas d'incrément
    const prob = we ? 0.3 : h >= 8 && h < 20 ? 0.7 : 0.2;
    if (Math.random() < prob) {
      this._volume += Math.random() < 0.15 ? 2 : 1;
      if (this._countEl) {
        this._countEl.textContent = this._volume.toLocaleString("fr-FR");
      }
    }
  },

  /* ── Horodatage relatif crédible ── */
  _relTime(ts) {
    const diffMs = Date.now() - ts;
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "à l'instant";
    if (diffMin < 60) return `il y a ${diffMin} min`;
    if (diffH < 24) return `il y a ${diffH}h`;
    if (diffD === 1) return "hier";
    return `il y a ${diffD} jours`;
  },

  _rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  _randomLetter() {
    const l = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return l[Math.floor(Math.random() * l.length)];
  },
};
