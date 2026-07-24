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
});
