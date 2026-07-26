/**
 * TEMPLATE 4 - SCRIPT.JS
 * LOGICA INTERATTIVA: DARK MODE, LIGHTBOX, GALLERY FILTERS, POST-IT DINAMICI, MAPPA LEAFLET & TABELLA DATI
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. GESTIONE MENU MOBILE (HAMBURGER)
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Chiudi il menu dopo aver cliccato un link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 2. TOGGLE TEMA SCURO (DARK MODE)
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('template-theme');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('template-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('template-theme', 'light');
    }
  }

  // Impostazione tema iniziale (default: chiaro)
  if (storedTheme === 'dark') {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  // ==========================================
  // 3. TOAST NOTIFICATION & SHARE LINK
  // ==========================================
  const shareBtn = document.getElementById('btn-share');
  const toastNotification = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');

  function showToast(msg) {
    if (!toastNotification) return;
    if (toastMessage) toastMessage.textContent = msg;
    toastNotification.classList.add('active');
    setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 3200);
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast(' Link copiato negli appunti! 🚀');
      }).catch(() => {
        showToast(' Condividi questa bacheca con i tuoi amici!');
      });
    });
  }

  // ==========================================
  // 4. LIGHTBOX MODAL SCHERMO INTERO
  // ==========================================
  const modal = document.getElementById('lightbox-modal');
  const modalContent = document.getElementById('lightbox-content');
  const modalCaption = document.getElementById('lightbox-caption');
  const modalClose = document.getElementById('lightbox-close');
  const modalOverlay = document.querySelector('.modal-overlay');

  function openLightbox(src, isVideo = false, captionText = '') {
    if (!modal || !modalContent) return;
    modalContent.innerHTML = '';

    if (isVideo) {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      modalContent.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = captionText || 'Foto Ingrandita';
      modalContent.appendChild(img);
    }

    if (modalCaption) {
      modalCaption.textContent = captionText || '';
      modalCaption.style.display = captionText ? 'block' : 'none';
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (modalContent) {
      const vid = modalContent.querySelector('video');
      if (vid) vid.pause();
      modalContent.innerHTML = '';
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeLightbox);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Note: Le Polaroid dell'Hero sono ora collegamenti diretti alle sezioni (#ricordi, #postit, #cronologia)

  // ==========================================
  // 5. GALLERIA RICORDI FILTRABILE
  // ==========================================
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-bar .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Collega i pulsanti di ingrandimento galleria
  document.querySelectorAll('.gallery-overlay-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.gallery-item');
      const img = card.querySelector('img');
      const title = card.querySelector('.gallery-title');
      if (img) {
        openLightbox(img.src, false, title ? title.textContent.trim() : '');
      }
    });
  });

  // ==========================================
  // 6. DINAMICA AGGIUNTA POST-IT ALLA BACHECA
  // ==========================================
  const postitGrid = document.getElementById('postit-grid');
  const addPostitForm = document.getElementById('add-postit-form');

  if (addPostitForm && postitGrid) {
    addPostitForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const authorInput = document.getElementById('postit-author-input');
      const messageInput = document.getElementById('postit-message-input');
      const colorSelect = document.getElementById('postit-color-select');
      const tagSelect = document.getElementById('postit-tag-select');

      const author = authorInput ? authorInput.value.trim() : 'Anonimo';
      const message = messageInput ? messageInput.value.trim() : '';
      const color = colorSelect ? colorSelect.value : 'yellow';
      const tag = tagSelect ? tagSelect.value : '#Auguri';

      if (!message) return;

      const randomTilt = (Math.random() * 6 - 3).toFixed(1);
      const currentDate = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });

      const newPostit = document.createElement('div');
      newPostit.className = `postit-card postit-${color}`;
      newPostit.style.setProperty('--postit-tilt', `${randomTilt}deg`);

      newPostit.innerHTML = `
        <div class="postit-pin"></div>
        <div class="postit-header">
          <span class="postit-author">${author}</span>
          <span class="postit-tag">${tag}</span>
        </div>
        <div class="postit-body">
          <p>${message}</p>
        </div>
        <div class="postit-footer">
          <span>${currentDate}</span>
        </div>
      `;

      postitGrid.prepend(newPostit);
      addPostitForm.reset();
      showToast(' Nuovo Post-It aggiunto con successo!');
    });
  }

  // Expand video postit lightbox
  document.querySelectorAll('.expand-video-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('.postit-card');
      const video = container ? container.querySelector('video') : null;
      if (video && video.src) {
        openLightbox(video.src, true, 'Video Ricordo');
      }
    });
  });

  // ==========================================
  // 7. MAPPA INTERATTIVA LEAFLET.JS
  // ==========================================
  const mapElement = document.getElementById('map');
  if (mapElement && typeof L !== 'undefined') {
    // Coordinate Politecnico di Milano / Campus
    const initialLat = 45.4782;
    const initialLng = 9.2272;

    const map = L.map('map', {
      center: [initialLat, initialLng],
      zoom: 14,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const locations = [
      {
        lat: 45.4782,
        lng: 9.2272,
        title: 'Aula Magna & Politecnico',
        category: 'campus',
        desc: 'Luogo della Proclamazione della Laurea Magistrale.'
      },
      {
        lat: 45.4760,
        lng: 9.2320,
        title: 'Biblioteca di Ingegneria',
        category: 'campus',
        desc: 'Intere nottate di studio ed esami preparati insieme.'
      },
      {
        lat: 45.4810,
        lng: 9.2200,
        title: 'Locale della Festa Finale',
        category: 'festa',
        desc: 'Brindisi, musica e festeggiamenti con amici e parenti!'
      },
      {
        lat: 45.4735,
        lng: 9.2250,
        title: 'Bar del Campus (Caffè Notturni)',
        category: 'relax',
        desc: 'Punto di ritrovo fisso prima di ogni lezione.'
      }
    ];

    const markers = [];

    locations.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lng]).addTo(map);
      marker.bindPopup(`
        <div class="map-popup-title">${loc.title}</div>
        <div class="map-popup-desc">${loc.desc}</div>
      `);
      marker.category = loc.category;
      markers.push(marker);
    });

    // Filtri Marker Mappa
    const mapFilterBtns = document.querySelectorAll('.map-filter-group .btn-sm');
    mapFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        mapFilterBtns.forEach(b => b.classList.remove('btn-yellow'));
        btn.classList.add('btn-yellow');

        const filter = btn.getAttribute('data-map-filter');

        markers.forEach(m => {
          if (filter === 'all' || m.category === filter) {
            map.addLayer(m);
          } else {
            map.removeLayer(m);
          }
        });
      });
    });
  }

  // ==========================================
  // 8. TABELLA DATI INTERATTIVA (RICERCA & FILTRI)
  // ==========================================
  const searchInput = document.getElementById('table-search');
  const categoryFilter = document.getElementById('table-filter-category');
  const statusFilter = document.getElementById('table-filter-status');
  const resetBtn = document.getElementById('table-reset-btn');
  const tableRows = document.querySelectorAll('#data-table tbody tr');
  const visibleCountSpan = document.getElementById('table-visible-count');
  const selectAllCheckbox = document.getElementById('select-all-rows');
  const rowCheckboxes = document.querySelectorAll('.row-checkbox');
  const selectedCountSpan = document.getElementById('table-selected-count');

  function filterTable() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
    const selectedStatus = statusFilter ? statusFilter.value : 'all';

    let count = 0;

    tableRows.forEach(row => {
      const rowText = row.textContent.toLowerCase();
      const rowCat = row.getAttribute('data-category');
      const rowStat = row.getAttribute('data-status');

      const matchesSearch = !searchTerm || rowText.includes(searchTerm);
      const matchesCat = selectedCategory === 'all' || rowCat === selectedCategory;
      const matchesStat = selectedStatus === 'all' || rowStat === selectedStatus;

      if (matchesSearch && matchesCat && matchesStat) {
        row.style.display = '';
        count++;
      } else {
        row.style.display = 'none';
      }
    });

    if (visibleCountSpan) visibleCountSpan.textContent = count;
  }

  if (searchInput) searchInput.addEventListener('input', filterTable);
  if (categoryFilter) categoryFilter.addEventListener('change', filterTable);
  if (statusFilter) statusFilter.addEventListener('change', filterTable);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (categoryFilter) categoryFilter.value = 'all';
      if (statusFilter) statusFilter.value = 'all';
      filterTable();
    });
  }

  // Gestione selezioni tabelle
  function updateSelectedCount() {
    let selected = 0;
    rowCheckboxes.forEach(cb => {
      if (cb.checked) selected++;
    });
    if (selectedCountSpan) selectedCountSpan.textContent = selected;
  }

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', () => {
      rowCheckboxes.forEach(cb => {
        const row = cb.closest('tr');
        if (row && row.style.display !== 'none') {
          cb.checked = selectAllCheckbox.checked;
        }
      });
      updateSelectedCount();
    });
  }

  rowCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateSelectedCount);
  });

  // ==========================================
  // 9. GUESTBOOK FORM & CONTATORE CARATTERI
  // ==========================================
  const guestMessage = document.getElementById('guest-message');
  const charCounter = document.getElementById('char-count');
  const guestbookForm = document.getElementById('guestbook-form');

  if (guestMessage && charCounter) {
    guestMessage.addEventListener('input', () => {
      charCounter.textContent = guestMessage.value.length;
    });
  }

  if (guestbookForm) {
    guestbookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guest-name');
      showToast(` Grazie ${guestName ? guestName.value : ''}! Il tuo messaggio è stato registrato! ✨`);
      guestbookForm.reset();
      if (charCounter) charCounter.textContent = '0';
    });
  }

});
