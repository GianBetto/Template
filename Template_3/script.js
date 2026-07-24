/**
 * TEMPLATE 3 - SCRIPT.JS
 * GESTIONE TABELLA INTERATTIVA: RICERCA, FILTRI, SELEZIONE E TEMA SCURO
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. MENU MOBILE RESPONSIVE
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 2. TOGGLE TEMA SCURO (DARK MODE)
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('template-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('template-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('template-theme', 'light');
    }
  }

  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
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

  // 3. GESTIONE TABELLA DATI: RICERCA IN TEMPO REALE, FILTRI STATO/CATEGORIA & CALENDARIO
  const tableSearch = document.getElementById('table-search');
  const filterStatus = document.getElementById('table-filter-status');
  const filterCategory = document.getElementById('table-filter-category');
  const dateStart = document.getElementById('table-date-start');
  const dateEnd = document.getElementById('table-date-end');
  const resetBtn = document.getElementById('table-reset-btn');
  const tableRows = document.querySelectorAll('#data-table tbody tr');
  const rowCountSpan = document.getElementById('table-row-count');
  const noResultsMsg = document.getElementById('no-results-msg');
  const selectAllCheckbox = document.getElementById('select-all-rows');
  const rowCheckboxes = document.querySelectorAll('.row-checkbox');
  const selectedCountSpan = document.getElementById('table-selected-count');

  const totalRows = tableRows.length;

  function filterTable() {
    const searchTerm = tableSearch ? tableSearch.value.toLowerCase().trim() : '';
    const selectedStatus = filterStatus ? filterStatus.value : 'all';
    const selectedCategory = filterCategory ? filterCategory.value : 'all';
    const startDateVal = dateStart && dateStart.value ? dateStart.value : null;
    const endDateVal = dateEnd && dateEnd.value ? dateEnd.value : null;

    let visibleCount = 0;

    tableRows.forEach(row => {
      const textContent = row.textContent.toLowerCase();
      const rowStatus = row.getAttribute('data-status');
      const rowCategory = row.getAttribute('data-category');
      const rowDate = row.getAttribute('data-date'); // YYYY-MM-DD

      const matchesSearch = !searchTerm || textContent.includes(searchTerm);
      const matchesStatus = selectedStatus === 'all' || rowStatus === selectedStatus;
      const matchesCategory = selectedCategory === 'all' || rowCategory === selectedCategory;
      
      let matchesDate = true;
      if (rowDate) {
        if (startDateVal && rowDate < startDateVal) matchesDate = false;
        if (endDateVal && rowDate > endDateVal) matchesDate = false;
      }

      if (matchesSearch && matchesStatus && matchesCategory && matchesDate) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (rowCountSpan) {
      rowCountSpan.textContent = `Mostrando ${visibleCount} di ${totalRows} elementi`;
    }

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Event Listeners per Ricerca, Filtri e Calendario
  if (tableSearch) tableSearch.addEventListener('input', filterTable);
  if (filterStatus) filterStatus.addEventListener('change', filterTable);
  if (filterCategory) filterCategory.addEventListener('change', filterTable);
  if (dateStart) dateStart.addEventListener('change', filterTable);
  if (dateEnd) dateEnd.addEventListener('change', filterTable);

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (tableSearch) tableSearch.value = '';
      if (filterStatus) filterStatus.value = 'all';
      if (filterCategory) filterCategory.value = 'all';
      if (dateStart) dateStart.value = '';
      if (dateEnd) dateEnd.value = '';
      filterTable();
    });
  }

  // 4. GESTIONE SELEZIONE MULTIPLA RIGHE
  function updateSelectedCount() {
    let selectedCount = 0;
    rowCheckboxes.forEach(cb => {
      const row = cb.closest('tr');
      if (cb.checked) {
        selectedCount++;
        row.classList.add('selected');
      } else {
        row.classList.remove('selected');
      }
    });

    if (selectedCountSpan) {
      selectedCountSpan.textContent = `${selectedCount} righe selezionate`;
    }

    if (selectAllCheckbox) {
      selectAllCheckbox.checked = selectedCount > 0 && selectedCount === rowCheckboxes.length;
    }
  }

  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', () => {
      const isChecked = selectAllCheckbox.checked;
      rowCheckboxes.forEach(cb => {
        cb.checked = isChecked;
      });
      updateSelectedCount();
    });
  }

  rowCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateSelectedCount);
  });

  // 5. ORDINAMENTO CRESCENTE / DECRESCENTE SULLE INTESTAZIONI TABELLA (TH)
  const sortableHeaders = document.querySelectorAll('#data-table th.sortable');
  let currentSortCol = -1;
  let currentSortDir = 'asc';

  function parseVal(cell, sortKey) {
    if (!cell) return '';
    const txt = cell.textContent.trim();
    if (sortKey === 'value') {
      const cleanNum = txt.replace(/[^0-9,-]/g, '').replace(',', '.');
      return parseFloat(cleanNum) || 0;
    }
    if (sortKey === 'id') {
      const cleanId = txt.replace(/[^0-9]/g, '');
      return parseInt(cleanId, 10) || 0;
    }
    return txt.toLowerCase();
  }

  sortableHeaders.forEach(th => {
    th.addEventListener('click', () => {
      const tbody = document.querySelector('#data-table tbody');
      if (!tbody) return;

      const colIndex = Array.from(th.parentNode.children).indexOf(th);
      const sortKey = th.getAttribute('data-sort');

      if (currentSortCol === colIndex) {
        currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
      } else {
        currentSortCol = colIndex;
        currentSortDir = 'asc';
      }

      // Reset icone ed indicatori su tutte le colonne
      const defaultSvg = `<svg class="sort-icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9l4-4 4 4"/><path d="M16 15l-4 4-4-4"/></svg>`;
      const ascSvg = `<svg class="sort-icon-svg active" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>`;
      const descSvg = `<svg class="sort-icon-svg active" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>`;

      sortableHeaders.forEach(h => {
        h.classList.remove('sort-asc', 'sort-desc');
        const box = h.querySelector('.sort-icon-box');
        if (box) box.innerHTML = defaultSvg;
      });

      th.classList.add(currentSortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      const activeBox = th.querySelector('.sort-icon-box');
      if (activeBox) {
        activeBox.innerHTML = currentSortDir === 'asc' ? ascSvg : descSvg;
      }

      // Ordina l'array di righe
      const rows = Array.from(tbody.querySelectorAll('tr'));
      rows.sort((a, b) => {
        const valA = parseVal(a.children[colIndex], sortKey);
        const valB = parseVal(b.children[colIndex], sortKey);

        if (typeof valA === 'number' && typeof valB === 'number') {
          return currentSortDir === 'asc' ? valA - valB : valB - valA;
        }

        return currentSortDir === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });

      // Reinserisci le righe in ordine nel DOM
      rows.forEach(r => tbody.appendChild(r));

      // Mantiene attiva la visibilità dei filtri applicati
      filterTable();
    });
  });

  // 5. DIALOG MODALE NATIVO (<dialog>)
  const nativeDialog = document.getElementById('native-dialog');
  const openDialogBtn = document.getElementById('open-dialog-btn');
  const closeDialogBtn = document.getElementById('close-dialog-btn');

  if (nativeDialog && openDialogBtn) {
    openDialogBtn.addEventListener('click', () => {
      nativeDialog.showModal();
    });

    if (closeDialogBtn) {
      closeDialogBtn.addEventListener('click', () => {
        nativeDialog.close();
      });
    }

    nativeDialog.addEventListener('click', (e) => {
      const rect = nativeDialog.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        nativeDialog.close();
      }
    });
  }

  // 6. SMOOTH SCROLL "TORNA SU"
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
