/* Centre Dentaire Majorelle — site behaviour.
   No dependencies. Everything here is an enhancement: with JS disabled the
   page is fully readable, fully navigable, and every reveal is already visible.
   ------------------------------------------------------------------------- */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  /** Read the JSON island the build wrote into the page. */
  var data = (function () {
    var el = document.getElementById('clinic-data');
    if (!el) return null;
    try {
      return JSON.parse(el.textContent);
    } catch (e) {
      return null;
    }
  })();

  /* ---------------------------------------------------------------------
     1. Motion gate
     The hidden state for reveals only exists once we know we can undo it.
     --------------------------------------------------------------------- */
  var canReveal = 'IntersectionObserver' in window;
  if (canReveal) root.classList.add('motion');

  /* ---------------------------------------------------------------------
     2. Scroll reveals — shaped per element, staggered within a group
     --------------------------------------------------------------------- */
  if (canReveal) {
    var targets = document.querySelectorAll('[data-reveal]');

    // Stagger siblings inside a group rather than firing them all at once.
    document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
      var step = parseInt(group.getAttribute('data-reveal-group'), 10) || 55;
      group.querySelectorAll('[data-reveal]').forEach(function (el, i) {
        el.style.setProperty('--reveal-delay', i * step + 'ms');
      });
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );

    targets.forEach(function (el) {
      io.observe(el);
    });

    // Anything already above the fold on load should not wait for a scroll.
    // Read every rect first, then write every class: interleaving them forces
    // a synchronous layout per element.
    requestAnimationFrame(function () {
      var limit = window.innerHeight * 0.92;
      var visible = [];
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].getBoundingClientRect().top < limit) visible.push(targets[i]);
      }
      visible.forEach(function (el) {
        el.classList.add('is-in');
        io.unobserve(el);
      });
    });
  }

  /* ---------------------------------------------------------------------
     3. Header lit edge + the light rail, on one rAF-throttled scroll pass
     --------------------------------------------------------------------- */
  var header = document.querySelector('.header');
  var rail = document.querySelector('.rail');
  var railFill = document.querySelector('.rail__fill');
  var hero = document.querySelector('[data-parallax]');
  var ticking = false;

  // Cached layout values. Reading scrollHeight inside the scroll handler forces
  // a synchronous layout on every single frame; it only changes when the page
  // is resized or reflowed, so measure it there instead.
  var scrollable = 0;
  var viewportH = 0;
  var railVisible = false;

  function measure() {
    viewportH = window.innerHeight;
    scrollable = document.documentElement.scrollHeight - viewportH;
    // The rail is a wide-viewport affordance; below that it is display:none
    // and there is nothing to update. Note offsetParent is always null for a
    // fixed-position element, so it cannot be used as the visibility test.
    railVisible = !!rail && getComputedStyle(rail).display !== 'none';
  }

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle('is-stuck', y > 40);

    if (railFill && railVisible && !reduced.matches) {
      var progress = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0;
      railFill.style.height = (progress * 100).toFixed(2) + '%';
    }

    // A few pixels of drift on the hero photo. Transform only.
    if (hero && !reduced.matches && y < viewportH * 1.5) {
      hero.style.transform = 'translate3d(0,' + (y * 0.045).toFixed(2) + 'px,0)';
    }

    ticking = false;
  }

  function requestScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }

  function onResize() {
    measure();
    requestScroll();
  }

  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  // Images settling and fonts swapping both change the page height. `load`
  // covers both. Deliberately not a ResizeObserver on the document: its
  // callback would read scrollHeight, forcing a layout that can re-trigger the
  // observer — measured as a clear regression in blocking time.
  window.addEventListener('load', onResize);
  // The FAQ accordions change page height after load.
  document.addEventListener('toggle', requestMeasure, true);

  function requestMeasure() {
    requestAnimationFrame(onResize);
  }

  measure();
  onScroll();

  /* ---------------------------------------------------------------------
     4. Hairlines that light up when they come into view
     --------------------------------------------------------------------- */
  if (canReveal) {
    var lines = document.querySelectorAll('.lightline');
    if (lines.length) {
      var lineIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-lit');
            lineIo.unobserve(entry.target);
          });
        },
        { threshold: 0.9 }
      );
      lines.forEach(function (l) {
        lineIo.observe(l);
      });
    }
  }

  /* ---------------------------------------------------------------------
     5. Mobile nav sheet
     Enters from the inline-end edge and leaves the same way. Focus is
     trapped while open; Escape and the scrim both close it.
     --------------------------------------------------------------------- */
  (function () {
    var burger = document.querySelector('[data-sheet-toggle]');
    var sheet = document.getElementById('nav-sheet');
    var scrim = document.querySelector('[data-scrim]');
    if (!burger || !sheet || !scrim) return;

    var lastFocus = null;
    var SELECTOR =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function open() {
      lastFocus = document.activeElement;
      sheet.classList.add('is-open');
      scrim.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      sheet.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
      var first = sheet.querySelector(SELECTOR);
      if (first) first.focus();
      document.addEventListener('keydown', onKey);
    }

    function close() {
      sheet.classList.remove('is-open');
      scrim.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      sheet.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      if (lastFocus) lastFocus.focus();
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      var items = Array.prototype.filter.call(
        sheet.querySelectorAll(SELECTOR),
        function (el) {
          return el.offsetParent !== null;
        }
      );
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    burger.addEventListener('click', function () {
      if (burger.getAttribute('aria-expanded') === 'true') close();
      else open();
    });

    scrim.addEventListener('click', close);
    sheet.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
  })();

  /* ---------------------------------------------------------------------
     6. "Open now" — computed in the clinic's timezone, not the visitor's.
     Uses the same hours object that produced openingHoursSpecification,
     so the badge and the structured data can never disagree.
     --------------------------------------------------------------------- */
  (function () {
    // There is more than one chip per page (hero, nav sheet, closing CTA) and
    // they must all agree — querySelector would only ever fill the first.
    var chips = document.querySelectorAll('[data-status]');
    if (!chips.length || !data || !data.hours) return;

    var TZ = data.tz || 'Africa/Casablanca';
    var t = data.strings || {};

    // Current weekday + minutes-since-midnight, in Tétouan.
    function clinicNow() {
      var parts;
      try {
        parts = new Intl.DateTimeFormat('en-GB', {
          timeZone: TZ,
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).formatToParts(new Date());
      } catch (e) {
        var d = new Date();
        return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
      }
      var get = function (type) {
        for (var i = 0; i < parts.length; i++) {
          if (parts[i].type === type) return parts[i].value;
        }
        return '';
      };
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var hour = parseInt(get('hour'), 10) % 24;
      return {
        day: map[get('weekday')] != null ? map[get('weekday')] : new Date().getDay(),
        mins: hour * 60 + parseInt(get('minute'), 10),
      };
    }

    var toMins = function (hhmm) {
      var p = hhmm.split(':');
      return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
    };

    var now = clinicNow();
    var today = data.hours[String(now.day)] || [];
    var openUntil = null;
    var nextOpen = null;

    for (var i = 0; i < today.length; i++) {
      var from = toMins(today[i][0]);
      var to = toMins(today[i][1]);
      if (now.mins >= from && now.mins < to) {
        openUntil = today[i][1];
        break;
      }
      if (now.mins < from && nextOpen === null) {
        nextOpen = { when: today[i][0], sameDay: true };
      }
    }

    // Nothing left today — walk forward to the next open day.
    if (openUntil === null && nextOpen === null) {
      for (var step = 1; step <= 7; step++) {
        var d = (now.day + step) % 7;
        var slots = data.hours[String(d)] || [];
        if (slots.length) {
          nextOpen = { when: slots[0][0], sameDay: false, day: d };
          break;
        }
      }
    }

    // Build the two strings once, then apply them to every chip.
    var labelText, detailText;
    if (openUntil) {
      labelText = t.open || 'Open';
      detailText = (t.closesAt || 'closes at') + ' ' + openUntil;
    } else {
      labelText = t.closed || 'Closed';
      detailText = !nextOpen
        ? ''
        : nextOpen.sameDay
        ? (t.opensAt || 'opens at') + ' ' + nextOpen.when
        : (t.opensDay || 'opens') +
          ' ' +
          (t.days && t.days[nextOpen.day] ? t.days[nextOpen.day] : '') +
          ' ' +
          (t.opensAt || 'at') +
          ' ' +
          nextOpen.when;
    }

    Array.prototype.forEach.call(chips, function (el) {
      var label = el.querySelector('[data-status-label]');
      var detail = el.querySelector('[data-status-detail]');
      el.setAttribute('data-open', openUntil ? 'true' : 'false');
      if (label) label.textContent = labelText;
      if (detail) detail.textContent = detailText;
      el.hidden = false;
    });

    // Mark today's row in any hours table.
    document.querySelectorAll('[data-day]').forEach(function (row) {
      if (parseInt(row.getAttribute('data-day'), 10) === now.day) {
        row.setAttribute('data-today', '');
      }
    });
  })();

  /* ---------------------------------------------------------------------
     7. Map facade — nothing is requested from Google until the visitor asks
     --------------------------------------------------------------------- */
  document.querySelectorAll('[data-map]').forEach(function (map) {
    var facade = map.querySelector('[data-map-load]');
    if (!facade) return;
    facade.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = map.getAttribute('data-map');
      iframe.title = map.getAttribute('data-map-title') || 'Map';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      map.appendChild(iframe);
      facade.remove();
    });
  });

  /* ---------------------------------------------------------------------
     8. Mark the current page in the navigation
     --------------------------------------------------------------------- */
  (function () {
    var here = location.pathname.replace(/index\.html$/, '');
    document.querySelectorAll('.nav__link, .sheet__link').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      // Resolve relative links before comparing. The published pages deliberately
      // use relative paths so the same files work at a GitHub project URL and at
      // a custom domain.
      var path = href ? new URL(href, location.href).pathname : '';
      if (path && path.replace(/index\.html$/, '') === here) {
        a.setAttribute('aria-current', 'page');
      }
    });
  })();
})();
