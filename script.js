/* ==============================================
   ASTROLOGER WEBSITE – script.js
   Features:
     - Sticky header on scroll
     - Mobile nav toggle
     - Smooth scroll for nav links
     - Back-to-top button
     - Contact form client-side validation
     - Current year in footer
   ============================================== */

(function () {
  'use strict';

  /* ---------- DOM Refs ---------- */
  const header     = document.getElementById('header');
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.getElementById('navLinks');
  const backToTop  = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  const formError   = document.getElementById('formError');
  const yearEl     = document.getElementById('year');

  /* ---------- Current Year ---------- */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky Header ---------- */
  function handleScroll() {
    const scrolled = window.scrollY > 50;
    header.classList.toggle('scrolled', scrolled);

    // Back-to-top visibility
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ---------- Back To Top ---------- */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Mobile Nav Toggle ---------- */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Smooth Scroll (fallback for older browsers) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveNav() {
    const scrollY = window.scrollY + (header ? header.offsetHeight : 0) + 40;
    let current = '';
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollY) current = sec.id;
    });
    navItems.forEach(function (a) {
      a.style.color = a.getAttribute('href') === '#' + current
        ? 'var(--color-gold)'
        : '';
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });

  /* ---------- Contact Form Validation & Submission ---------- */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      // Clear previous validation states
      contactForm.querySelectorAll('.invalid').forEach(function (el) {
        el.classList.remove('invalid');
      });

      let valid = true;

      const nameEl    = document.getElementById('name');
      const phoneEl   = document.getElementById('phone');
      var serviceGroup = document.getElementById('serviceGroup');

      if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
        nameEl.classList.add('invalid');
        valid = false;
      }

      // Phone: optional +91 / 0 prefix, then 10 digits (Indian), or 7–15 digit international
      var phoneRaw = phoneEl.value.trim();
      var phoneStripped = phoneRaw.replace(/[\s\-()]/g, '');
      var phonePattern = /^(\+91|0091|0)?[6-9]\d{9}$|^\+?[1-9]\d{6,14}$/;
      if (!phoneRaw || !phonePattern.test(phoneStripped)) {
        phoneEl.classList.add('invalid');
        valid = false;
      }

      var emailEl = document.getElementById('email');
      if (emailEl && emailEl.value.trim()) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailPattern.test(emailEl.value.trim())) {
          emailEl.classList.add('invalid');
          valid = false;
        }
      }

      var checkedServices = contactForm.querySelectorAll('input[name="service"]:checked');
      if (checkedServices.length === 0) {
        serviceGroup.classList.add('invalid');
        valid = false;
      }

      if (!valid) {
        e.preventDefault();
        // Scroll to first invalid field
        const firstInvalid = contactForm.querySelector('.invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
        }
        return;
      }

      // Always use fetch so the page never redirects (works on file://, local network, and Cloudflare Pages).
      // FormSubmit emails the submission and returns JSON — no _next redirect needed.
      e.preventDefault();
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      var formData = new FormData(contactForm);
      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (res) {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message ✦'; }
          if (res.ok) {
            contactForm.reset();
            _resetServiceCheckboxes();
            if (formSuccess) { formSuccess.hidden = false; _autoDismiss(formSuccess); }
            if (formError)   formError.hidden   = true;
          } else {
            // HTTP error from FormSubmit (e.g. 422, 500)
            var errMsg = 'FormSubmit HTTP error: ' + res.status + ' ' + res.statusText;
            console.error('[ContactForm]', errMsg);
            _logFormError(errMsg);
            if (formError)   { formError.hidden = false; _autoDismiss(formError); }
            if (formSuccess) formSuccess.hidden = true;
          }
        })
        .catch(function (err) {
          // Network failure or FormSubmit unreachable
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message ✦'; }
          var errMsg = err ? err.message : 'Network error';
          console.error('[ContactForm] Submission failed:', errMsg);
          _logFormError(errMsg);
          if (formError)   { formError.hidden = false; _autoDismiss(formError); }
          if (formSuccess) formSuccess.hidden = true;
        });
    });  // end submit listener

    function _autoDismiss(el) {
      setTimeout(function () { if (el) el.hidden = true; }, 35000);
    }

    function _resetServiceCheckboxes() {
      var sg = document.getElementById('serviceGroup');
      var msg = document.getElementById('serviceMaxMsg');
      if (!sg) return;
      sg.classList.remove('invalid');
      sg.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
        cb.disabled = false;
        var lbl = cb.closest('.checkbox-label');
        if (lbl) lbl.classList.remove('disabled');
      });
      if (msg) msg.hidden = true;
    }

    function _logFormError(message) {
      try {
        var logs = JSON.parse(localStorage.getItem('form_error_log') || '[]');
        logs.push({ time: new Date().toISOString(), error: message });
        // Keep only last 20 entries
        if (logs.length > 20) logs = logs.slice(-20);
        localStorage.setItem('form_error_log', JSON.stringify(logs));
      } catch (e) { /* localStorage unavailable */ }
    }

    // Remove invalid state on input
    contactForm.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () { this.classList.remove('invalid'); });
    });

    // Checkbox group: remove invalid state + enforce max 4
    var serviceGroup = document.getElementById('serviceGroup');
    var serviceMaxMsg = document.getElementById('serviceMaxMsg');
    if (serviceGroup) {
      serviceGroup.addEventListener('change', function () {
        serviceGroup.classList.remove('invalid');
        var allBoxes = serviceGroup.querySelectorAll('input[type="checkbox"]');
        var checked = serviceGroup.querySelectorAll('input[type="checkbox"]:checked');
        var atMax = checked.length >= 4;
        serviceMaxMsg.hidden = !atMax;
        allBoxes.forEach(function (cb) {
          var lbl = cb.closest('.checkbox-label');
          if (!cb.checked && atMax) {
            cb.disabled = true;
            if (lbl) lbl.classList.add('disabled');
          } else {
            cb.disabled = false;
            if (lbl) lbl.classList.remove('disabled');
          }
        });
      });
    }
  }

  /* ---------- Intersection Observer – Fade-in cards ---------- */
  if ('IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = `
      .service-card, .testimonial-card, .gallery-item, .trust-item {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.55s ease, transform 0.55s ease;
      }
      .service-card.visible, .testimonial-card.visible,
      .gallery-item.visible, .trust-item.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.service-card, .testimonial-card, .gallery-item, .trust-item')
      .forEach(function (el) { observer.observe(el); });
  }

})();
