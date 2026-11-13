/* =================================================================
   Sub2Cad — main.js
   Theme toggle (localStorage + auto) · Marquee · Scroll reveal ·
   Drawer · Back-to-top · Header scroll state · Form mailto fallback
   ================================================================= */

(function () {
  'use strict';

  /* ---- 1. Theme ---- */
  const root = document.documentElement;
  const STORAGE_KEY = 'sub2cad.theme';
  const themeBtn = document.querySelector('[data-theme-toggle]');

  function applyTheme(theme) {
    if (theme === 'dark' || theme === 'light') {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }
  }

  function initTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored);
    } else {
      // Auto by default — follow system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }

  // React to OS changes if user hasn't picked a manual override
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  initTheme();

  /* ---- 2. Header scroll state ---- */
  const header = document.querySelector('.header');
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---- 3. Mobile drawer ---- */
  const drawer = document.querySelector('[data-drawer]');
  const openBtn = document.querySelector('[data-drawer-open]');
  const closeBtn = document.querySelector('[data-drawer-close]');
  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    document.body.classList.add('no-scroll');
    drawer.setAttribute('aria-hidden', 'false');
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    drawer.setAttribute('aria-hidden', 'true');
  }
  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ---- 4. Marquee — duplicate items in track for infinite loop ---- */
  document.querySelectorAll('.marquee__track').forEach((track) => {
    track.innerHTML = track.innerHTML + track.innerHTML;
    // Mark the second half as aria-hidden
    const total = track.children.length;
    const half = total / 2;
    for (let i = half; i < total; i++) {
      track.children[i].setAttribute('aria-hidden', 'true');
    }
  });

  /* ---- 5. Scroll reveal via IntersectionObserver ---- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.05 }
    );
    document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => el.classList.add('is-visible'));
  }

  /* ---- 6. Back to top ---- */
  const btt = document.querySelector('[data-back-to-top]');
  function onScrollBtt() {
    if (!btt) return;
    if (window.scrollY > 600) btt.classList.add('is-visible');
    else btt.classList.remove('is-visible');
  }
  window.addEventListener('scroll', onScrollBtt, { passive: true });
  if (btt) {
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
  onScrollBtt();

  /* ---- 7. Contact form → mailto fallback ---- */
  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const company = (data.get('company') || '').toString().trim();
      const profile = (data.get('profile') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      const subject = `[Sub2Cad] Demande de RDV — ${name || 'sans nom'}${company ? ' · ' + company : ''}`;
      const body =
        `Bonjour,\n\n` +
        `Je souhaite réserver 30 minutes avec Sub2Cad.\n\n` +
        `— Nom : ${name}\n` +
        `— Email : ${email}\n` +
        `— Société : ${company}\n` +
        `— Besoin : ${profile}\n\n` +
        (message ? `— Contexte :\n${message}\n\n` : '') +
        `Merci,\n${name}`;
      const mailto = `mailto:fratinaud@sub2cad.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    });
  });

  /* ---- 8. Smooth scroll for anchor links + close drawer ---- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          closeDrawer();
        }
      }
    });
  });

  /* ---- 9. Footer year ---- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
