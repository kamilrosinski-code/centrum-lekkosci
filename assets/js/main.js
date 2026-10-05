/* Centrum Lekkości — skrypty strony (bez zależności) */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Motyw jasny / ciemny ---------- */
  var THEME_KEY = 'cl-theme';
  var themeBtn = $('#theme-toggle');
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function paintThemeIcon() {
    if (!themeBtn) return;
    var use = themeBtn.querySelector('use');
    if (use) use.setAttribute('href', isDark() ? '#i-sun' : '#i-moon');
    themeBtn.setAttribute('aria-label', isDark() ? 'Włącz jasny motyw' : 'Włącz ciemny motyw');
  }
  try { var saved = localStorage.getItem(THEME_KEY); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  paintThemeIcon();
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    paintThemeIcon();
  });

  /* ---------- Nagłówek i menu mobilne ---------- */
  var header = $('.site-header');
  var mobileCta = $('#mobile-cta');
  var signup = $('#zapisy');
  function onScroll() {
    var y = window.scrollY || 0;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (mobileCta) {
      var nearSignup = false;
      if (signup) { var r = signup.getBoundingClientRect(); nearSignup = r.top < window.innerHeight && r.bottom > 0; }
      mobileCta.classList.toggle('show', y > 520 && !nearSignup);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var menuBtn = $('#menu-toggle');
  var menu = $('#mobile-menu');
  function setMenu(open) {
    if (!menu || !menuBtn) return;
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    var use = menuBtn.querySelector('use');
    if (use) use.setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
  $$('#mobile-menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Akordeon "Od czego zacząć" — jeden otwarty naraz ---------- */
  var accItems = $$('.acc-item');
  accItems.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) accItems.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Delikatne wejście sekcji (treść widoczna także bez JS) ---------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.remove('pre'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top > window.innerHeight) { el.classList.add('pre'); io.observe(el); }
    });
  }

  /* ---------- Kalkulator BMI ---------- */
  var h = $('#bmi-h'), w = $('#bmi-w');
  function fmt(n) { return n.toFixed(1).replace('.', ','); }
  function bmiInfo(b) {
    if (b < 18.5) return { cat: 'Niedowaga', msg: 'Twoje BMI jest poniżej normy. Porozmawiaj o tym z lekarzem rodzinnym.', cta: false };
    if (b < 25) return { cat: 'Prawidłowa masa ciała', msg: 'Twoje BMI jest w normie. Jeśli chcesz zadbać o nawyki, zajrzyj do Szkoły Lekkości.', cta: false };
    if (b < 27) return { cat: 'Nadwaga', msg: 'Twoje BMI wskazuje na nadwagę. Dobrym początkiem jest praca z dietetykiem nad nawykami.', cta: true };
    if (b < 30) return { cat: 'Nadwaga', msg: 'Przy nadwadze i chorobach towarzyszących, np. nadciśnieniu, cukrzycy typu 2 lub bezdechu sennym, lekarz może zaproponować leczenie.', cta: true };
    if (b < 35) return { cat: 'Otyłość I stopnia', msg: 'Twoje BMI mieści się w zakresie otyłości. Warto porozmawiać z lekarzem o leczeniu.', cta: true };
    if (b < 40) return { cat: 'Otyłość II stopnia', msg: 'Twoje BMI mieści się w zakresie otyłości. Warto porozmawiać z lekarzem o leczeniu.', cta: true };
    return { cat: 'Otyłość III stopnia', msg: 'Twoje BMI mieści się w zakresie otyłości olbrzymiej. Leczenie warto zacząć jak najszybciej, pod opieką lekarza.', cta: true };
  }
  function updateBmi() {
    if (!h || !w) return;
    var hv = +h.value, wv = +w.value;
    var b = wv / Math.pow(hv / 100, 2);
    var info = bmiInfo(b);
    $('#bmi-h-out').textContent = hv + ' cm';
    $('#bmi-w-out').textContent = wv + ' kg';
    $('#bmi-val').textContent = fmt(b);
    $('#bmi-cat').textContent = info.cat;
    $('#bmi-msg').textContent = info.msg;
    var pos = Math.max(0, Math.min(100, (b - 15) / 30 * 100));
    $('#bmi-marker').style.left = pos + '%';
    var cta = $('#bmi-cta');
    if (cta) {
      cta.textContent = info.cta ? 'Umów kwalifikację' : 'Zobacz Szkołę Lekkości';
      cta.setAttribute('href', info.cta ? '#zapisy' : '#szkola');
    }
  }
  if (h && w) { h.addEventListener('input', updateBmi); w.addEventListener('input', updateBmi); updateBmi(); }

  /* ---------- Cennik: plan 12-miesięczny / bez zobowiązania ---------- */
  var bA = $('#pay-annual'), bM = $('#pay-monthly');
  function setPlan(annual) {
    bA.setAttribute('aria-pressed', annual ? 'true' : 'false');
    bM.setAttribute('aria-pressed', annual ? 'false' : 'true');
    $('#std-price').textContent = annual ? '299' : '349';
    $('#std-billing').textContent = annual ? 'przy planie 12-miesięcznym · 349 zł bez zobowiązania' : 'płatność co miesiąc, bez zobowiązania · 299 zł w planie rocznym';
    $('#prem-billing').textContent = annual ? 'przy planie 12-miesięcznym' : 'płatność co miesiąc, bez zobowiązania';
  }
  if (bA && bM) { bA.addEventListener('click', function () { setPlan(true); }); bM.addEventListener('click', function () { setPlan(false); }); }

  /* ---------- Formularze ----------
     Ustaw adres odbiorcy w atrybucie data-endpoint formularza (np. Formspree, Make, własne API).
     Bez adresu formularz działa w trybie demonstracyjnym i niczego nie wysyła. */
  function showMsg(form, text, isError) {
    var m = form.querySelector('.form-msg');
    if (!m) return;
    m.textContent = text;
    m.classList.toggle('error', !!isError);
    m.hidden = false;
  }
  function handleForm(form, okText) {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var invalid = $$('input[required]', form).filter(function (i) { return i.type === 'checkbox' ? !i.checked : !i.checkValidity() || !i.value.trim(); });
      if (invalid.length) {
        var first = invalid[0];
        var label = first.type === 'checkbox' ? 'Zaznacz wymaganą zgodę.' : 'Uzupełnij pole: ' + (form.querySelector('label[for="' + first.id + '"]') || {}).textContent + '.';
        showMsg(form, label, true);
        first.focus();
        return;
      }
      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) {
        showMsg(form, okText + ' (Wersja demonstracyjna: formularz nie wysyła jeszcze danych.)', false);
        form.reset();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); showMsg(form, okText, false); form.reset(); })
        .catch(function () { showMsg(form, 'Nie udało się wysłać formularza. Spróbuj ponownie albo napisz na kontakt@centrumlekkosci.pl.', true); })
        .then(function () { if (btn) btn.disabled = false; });
    });
  }
  handleForm($('#lead-form'), 'Dziękujemy! Koordynator opieki oddzwoni w ciągu jednego dnia roboczego.');
  handleForm($('#newsletter-form'), 'Gotowe. Damy znać, gdy ruszą zapisy na webinary.');

  var yr = $('#year'); if (yr) yr.textContent = String(new Date().getFullYear());
})();
