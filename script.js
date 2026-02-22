/* ===== PAF-IAST JS ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ========================
     1. LOADER
  ======================== */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => { loader.classList.add('hidden'); }, 1900);
  });

  /* ========================
     2. NAVBAR SCROLL
  ======================== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  /* ========================
     3. HAMBURGER MENU
  ======================== */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });

  // Mobile dropdown toggle
  document.querySelectorAll('.has-dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.parentElement.classList.toggle('is-open');
      }
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));

  /* ========================
     4. BACK TO TOP
  ======================== */
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ========================
     5. HERO PARTICLES
  ======================== */
  const particleContainer = document.getElementById('particles');
  const colors = ['#1a6ef5', '#00d4b4', '#4a90f5', '#60a5fa', '#a78bfa'];

  function createParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${Math.random() * 12 + 8}s;
      animation-delay:${Math.random() * 5}s;
      filter:blur(${size > 4 ? 1 : 0}px);
    `;
    particleContainer.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }

  for (let i = 0; i < 18; i++) setTimeout(() => createParticle(), i * 200);
  setInterval(createParticle, 800);

  /* ========================
     6. ANIMATED COUNTERS
  ======================== */
  function animateCounter(el) {
    const target  = +el.getAttribute('data-target');
    const duration = 2000;
    const step   = Math.ceil(target / (duration / 16));
    let current  = 0;
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current.toLocaleString();
    }, 16);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-number').forEach(animateCounter);
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) statsObserver.observe(statsEl);

  /* ========================
     7. REVEAL ON SCROLL
  ======================== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay ? +entry.target.dataset.delay : 0);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Stagger children
  document.querySelectorAll(
    '.faculties-grid, .why-grid, .news-grid, .portals-grid'
  ).forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.dataset.delay = i * 100;
    });
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ========================
     8. TICKER DUPLICATE (seamless loop)
  ======================== */
  const tickerInner = document.getElementById('tickerInner');
  if (tickerInner) {
    tickerInner.innerHTML += tickerInner.innerHTML;
  }

  /* ========================
     9. SMOOTH SCROLL
  ======================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
      // Close mobile menu
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ========================
     10. CONTACT FORM
  ======================== */
  const form    = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; }
  }
  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(e => e.textContent = '');
    successEl.classList.remove('visible');
  }
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const fname   = document.getElementById('fname').value.trim();
    const lname   = document.getElementById('lname').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    let valid = true;

    if (!fname) { showError('fnameError', 'First name is required.'); valid = false; }
    if (!lname) { showError('lnameError', 'Last name is required.'); valid = false; }
    if (!email) { showError('emailError', 'Email is required.'); valid = false; }
    else if (!validateEmail(email)) { showError('emailError', 'Please enter a valid email address.'); valid = false; }
    if (!message) { showError('messageError', 'Message cannot be empty.'); valid = false; }

    if (!valid) return;

    // Simulate send
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      form.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      successEl.classList.add('visible');
      setTimeout(() => successEl.classList.remove('visible'), 5000);
    }, 1500);
  });

  /* ========================
     11. CURSOR GLOW (subtle)
  ======================== */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:fixed; pointer-events:none; z-index:9998;
      width:300px; height:300px; border-radius:50%;
      background:radial-gradient(circle, rgba(26,110,245,0.06) 0%, transparent 65%);
      transform:translate(-50%,-50%); transition:opacity 0.3s;
    `;
    document.body.appendChild(glow);
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

});
