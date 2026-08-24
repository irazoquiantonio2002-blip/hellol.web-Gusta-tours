/* ============================================================
   GUSTA TOURS — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- CONFIGURACIÓN DE CONTACTO -------------------------------
     Reemplaza WHATSAPP_NUMBER con el número real de Gusta Tours
     en formato internacional sin signos (ej. 522331234567).
     Todos los botones de WhatsApp del sitio se generan desde aquí. */
  const WHATSAPP_NUMBER = '522330000000'; // TODO: número real pendiente
  const WHATSAPP_MESSAGES = {
    default: 'Hola Gusta Tours, me gustaría reservar un tour en Cuetzalan.',
    tours: 'Hola Gusta Tours, tengo una duda sobre sus tours y recorridos.'
  };

  document.querySelectorAll('[data-whatsapp]').forEach((el) => {
    const key = el.getAttribute('data-whatsapp') || 'default';
    const msg = WHATSAPP_MESSAGES[key] || WHATSAPP_MESSAGES.default;
    el.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  });

  const waText = document.querySelector('[data-whatsapp-text]');
  if (waText) {
    const formatted = WHATSAPP_NUMBER.replace(/^52/, '+52 ').replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
    waText.textContent = formatted;
  }

  /* ---- LOADING SCREEN ------------------------------------------ */
  const loadingScreen = document.getElementById('loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => loadingScreen && loadingScreen.classList.add('loaded'), 300);
  });

  /* ---- HEADER: fondo sólido al hacer scroll --------------------- */
  const header = document.getElementById('site-header');
  const onScrollHeader = () => {
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---- MENÚ MÓVIL ------------------------------------------------ */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  const closeNav = () => {
    navToggle.classList.remove('is-open');
    mainNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mainNav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  /* ---- NAV ACTIVA SEGÚN SECCIÓN VISIBLE -------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-50% 0px -45% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));

  /* ---- SCROLL REVEAL ---------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), (i % 4) * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---- TYPEWRITER --------------------------------------------------- */
  const typewriterEl = document.getElementById('typewriter');
  const words = ['cascadas escondidas', 'cuevas y grutas', 'ríos cristalinos', 'pozas naturales', 'turismo sostenible'];

  if (typewriterEl) {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const current = words[wordIndex];
      if (!deleting) {
        charIndex++;
        typewriterEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        charIndex--;
        typewriterEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(tick, deleting ? 40 : 80);
    };
    tick();
  }

  /* ---- PARALLAX BANNERS (transform sutil al hacer scroll) ---------- */
  const banners = document.querySelectorAll('.parallax-banner');
  if (banners.length && window.matchMedia('(min-width: 769px)').matches) {
    const onScrollParallax = () => {
      banners.forEach((banner) => {
        const rect = banner.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const offset = (rect.top - window.innerHeight / 2) * 0.06;
          banner.style.backgroundPositionY = `calc(50% + ${offset}px)`;
        }
      });
    };
    window.addEventListener('scroll', onScrollParallax, { passive: true });
  }

  /* ---- AÑO EN EL FOOTER --------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- PARTÍCULAS EN EL HERO (canvas ligero) ------------------------ */
  const canvas = document.getElementById('particles-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    const hero = canvas.closest('.hero');
    let particles = [];
    let width, height;

    const resize = () => {
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    };

    const initParticles = () => {
      const count = Math.min(60, Math.round((width * height) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 0.6,
        vy: Math.random() * 0.35 + 0.12,
        vx: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.5 + 0.2
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -4) { p.y = height + 4; p.x = Math.random() * width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 200, 119, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });
  }

});
