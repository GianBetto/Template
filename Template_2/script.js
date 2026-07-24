/**
 * SCRIPT.JS - Interattività per il Template HTML/CSS Editoriale
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. GESTIONE DEL MENU MOBILE RESPONSIVE
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Chiudi il menu quando si clicca su un link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 2. TABS INTERATTIVI
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTabId = button.getAttribute('data-tab');

      // Rimuovi classe active da tutti i bottoni e pannelli
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));

      // Aggiungi classe active al bottone cliccato e al pannello target
      button.classList.add('active');
      const targetPanel = document.getElementById(targetTabId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // 3. COPIA DEGLI SNIPPET DI CODICE
  const copyBtn = document.getElementById('copy-code-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const codeToCopy = copyBtn.getAttribute('data-code');
      navigator.clipboard.writeText(codeToCopy).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copiato! ✓';
        copyBtn.style.color = '#50fa7b';
        setTimeout(() => {
          copyBtn.innerText = originalText;
          copyBtn.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('Errore durante la copia negli appunti:', err);
      });
    });
  }

  // 4. DROPZONE INTERATTIVA (DRAG & DROP)
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => {
      fileInput.click();
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--accent-primary)';
      dropzone.style.background = 'rgba(30, 58, 95, 0.05)';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = '';
      dropzone.style.background = '';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = '';
      dropzone.style.background = '';
      if (e.dataTransfer.files.length > 0) {
        const fileName = e.dataTransfer.files[0].name;
        dropzone.querySelector('.dropzone-text').innerHTML = `File selezionato: <b>${fileName}</b>`;
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        dropzone.querySelector('.dropzone-text').innerHTML = `File selezionato: <b>${fileName}</b>`;
      }
    });
  }

  // 5. SMOOTH SCROLL PER IL PULSANTE "TORNA SU"
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

  // 6. GESTIONE DEL TEMA SCURO (DARK MODE TOGGLE)
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

  // Impostazione iniziale del tema (default: chiaro)
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

  // 7. AGGIORNAMENTO DINAMICO INPUT RANGE ED OUTPUT
  const budgetRange = document.getElementById('budget-range');
  const budgetOutput = document.getElementById('budget-output');
  if (budgetRange && budgetOutput) {
    budgetRange.addEventListener('input', (e) => {
      const val = Number(e.target.value).toLocaleString('it-IT', { minimumFractionDigits: 2 });
      budgetOutput.textContent = `€ ${val}`;
    });
  }

  // 8. GESTIONE FINESTRA MODAL NATIVA (<dialog>)
  const nativeDialog = document.getElementById('native-dialog');
  const openDialogBtn = document.getElementById('open-dialog-btn');
  const closeDialogBtn = document.getElementById('close-dialog-btn');
  const cancelDialogBtn = document.getElementById('cancel-dialog-btn');
  const confirmDialogBtn = document.getElementById('confirm-dialog-btn');

  if (nativeDialog && openDialogBtn) {
    openDialogBtn.addEventListener('click', () => {
      nativeDialog.showModal();
    });

    [closeDialogBtn, cancelDialogBtn, confirmDialogBtn].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          nativeDialog.close();
        });
      }
    });

    // Chiudi il dialog cliccando sullo sfondo (backdrop)
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
});
