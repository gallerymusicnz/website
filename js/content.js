/* ============================================
   Gallery Music Centre — Content Loader
   Fetches JSON data files and renders dynamic
   content sections. Edit content in _data/.
   ============================================ */

(function () {
  const DATA = 'data/';

  function fetchJSON(file) {
    return fetch(DATA + file).then(function (r) {
      if (!r.ok) throw new Error('Could not load ' + file);
      return r.json();
    });
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeTextWithBreaks(str) {
    return escapeHTML(str).replace(/\n/g, '<br>');
  }

  /* --- Term Dates --- */
  function renderTermDates(data) {
    var tbody = document.getElementById('term-dates-body');
    var noteEl = document.getElementById('term-dates-note');
    if (tbody && data.terms) {
      tbody.innerHTML = data.terms.map(function (t) {
        return '<tr><td>' + escapeHTML(t.name) + '</td><td>' + escapeHTML(t.lessons) + '</td><td>' + escapeHTML(t.dates) + '</td></tr>';
      }).join('');
    }
    if (noteEl && data.note) {
      noteEl.textContent = data.note;
    }
  }

  /* --- Testimonials --- */
  function renderTestimonials(data) {
    var container = document.getElementById('testimonials-container');
    if (!container || !data.testimonials) return;
    container.innerHTML = data.testimonials.map(function (t) {
      return '<div class="testimonial"><p>' + escapeHTML(t.quote) + '</p><span class="testimonial__author">&mdash; ' + escapeHTML(t.author) + '</span></div>';
    }).join('');
  }

  /* --- Teachers --- */
  function renderTeachers(data) {
    var container = document.getElementById('teachers-grid');
    if (!container || !data.teachers) return;
    container.innerHTML = data.teachers.map(function (t) {
      return '<div class="person-card"><h3>' + escapeHTML(t.name) + '</h3><div class="person-card__role">' + escapeHTML(t.role) + '</div>' + (t.bio ? '<p>' + escapeHTML(t.bio) + '</p>' : '') + '</div>';
    }).join('');
  }

  /* --- Committee --- */
  function renderCommittee(data) {
    var container = document.getElementById('committee-grid');
    if (!container || !data.committee) return;
    container.innerHTML = data.committee.map(function (m) {
      return '<div class="person-card"><h3>' + escapeHTML(m.name) + '</h3><div class="person-card__role">' + escapeHTML(m.role) + '</div>' + (m.bio ? '<p>' + escapeHTML(m.bio) + '</p>' : '') + '</div>';
    }).join('');
  }

  /* --- Instrument Cards (home page — linked, summary text, featured only) --- */
  function renderHomeInstruments(data) {
    var container = document.getElementById('home-instruments');
    if (!container || !data.instruments) return;
    var featured = data.instruments.filter(function (i) { return i.show_on_home; });
    container.innerHTML = featured.map(function (i) {
      return '<a href="classes.html" class="card' + (i.free ? ' card--free' : '') + '"><div class="card__icon">' + i.emoji + '</div><h3>' + escapeHTML(i.name) + '</h3><p>' + escapeHTML(i.summary) + '</p><span class="card__tag">' + escapeHTML(i.tag) + '</span></a>';
    }).join('');
  }

  /* --- Instrument Cards (classes page — full descriptions, all instruments) --- */
  function renderClassInstruments(data) {
    var container = document.getElementById('class-instruments');
    if (!container || !data.instruments) return;
    container.innerHTML = data.instruments.map(function (i) {
      var orchestraLink = i.name === 'Orchestra' ? ' <a href="orchestra.html">Learn more about our community orchestra &rarr;</a>' : '';
      return '<div class="card' + (i.free ? ' card--free' : '') + '"><div class="card__icon">' + i.emoji + '</div><h3>' + escapeHTML(i.name) + '</h3><p>' + escapeHTML(i.description) + orchestraLink + '</p><span class="card__tag">' + escapeHTML(i.tag) + '</span></div>';
    }).join('');
  }

  /* --- Site Banner (all pages) --- */
  function renderBanner(data) {
    var el = document.getElementById('site-banner');
    if (!el || !data.enabled) return;
    var content = escapeHTML(data.message || '');
    if (data.link_url && data.link_text) {
      content += ' <a href="' + escapeHTML(data.link_url) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(data.link_text) + '</a>';
    }
    el.innerHTML = content;
    el.removeAttribute('hidden');
  }

  /* --- Fees & Funding (home page) --- */
  function renderFees(data) {
    var titleEl = document.getElementById('fees-title');
    var introEl = document.getElementById('fees-intro');
    var box = document.getElementById('fee-box');
    var notes = document.getElementById('fee-notes');
    if (titleEl && data.title) titleEl.textContent = data.title;
    if (introEl && data.intro) introEl.textContent = data.intro;
    if (box && data.fee_box) {
      var fb = data.fee_box;
      var items = (fb.items && fb.items.length)
        ? '<ul class="fee-box__list">' + fb.items.map(function (i) {
            return '<li>' + escapeHTML(i) + '</li>';
          }).join('') + '</ul>'
        : '';
      box.innerHTML =
        '<div class="fee-box__title">' + escapeHTML(fb.label || '') + '</div>' +
        '<div class="fee-box__amount">' + escapeHTML(fb.amount || '') + '</div>' +
        '<div class="fee-box__period">' + escapeHTML(fb.period || '') + '</div>' +
        items;
    }
    if (notes && data.notes) {
      notes.innerHTML = data.notes.map(function (n) {
        return '<h4>' + escapeHTML(n.heading || '') + '</h4><p>' + escapeHTML(n.body || '') + '</p>';
      }).join('');
    }
  }

  /* --- How to Enrol (home page) --- */
  function renderEnrolment(data) {
    var titleEl = document.getElementById('enrolment-title');
    var introEl = document.getElementById('enrolment-intro');
    var steps = document.getElementById('enrolment-steps');
    var contactHeading = document.getElementById('enrolment-contact-heading');
    var contactItems = document.getElementById('enrolment-contact-items');

    if (titleEl && data.title) titleEl.textContent = data.title;
    if (introEl && data.intro) introEl.textContent = data.intro;

    if (steps && data.steps) {
      steps.innerHTML = data.steps.map(function (step, idx) {
        var link = (step.link_text && step.link_url)
          ? ' <a href="' + escapeHTML(step.link_url) + '">' + escapeHTML(step.link_text) + '</a>'
          : '';
        return '<div class="enrol-step">' +
          '<div class="enrol-step__num">' + escapeHTML(step.number || idx + 1) + '</div>' +
          '<div><h4>' + escapeHTML(step.heading || '') + '</h4>' +
          '<p>' + escapeHTML(step.body || '') + link + '</p></div>' +
          '</div>';
      }).join('');
    }

    if (contactHeading && data.contact_box && data.contact_box.heading) {
      contactHeading.textContent = data.contact_box.heading;
    }
    if (contactItems && data.contact_box && data.contact_box.items) {
      contactItems.innerHTML = data.contact_box.items.map(function (item) {
        var value = item.url
          ? '<a href="' + escapeHTML(item.url) + '">' + escapeTextWithBreaks(item.value || '') + '</a>'
          : '<span>' + escapeTextWithBreaks(item.value || '') + '</span>';
        return '<div class="contact-item">' +
          '<div class="contact-item__icon">' + escapeHTML(item.icon || '') + '</div>' +
          '<div><div class="contact-item__label">' + escapeHTML(item.label || '') + '</div>' +
          value + '</div></div>';
      }).join('');
    }

  }

  /* --- Stat Cards (home page) --- */
  function renderStats(data) {
    var container = document.getElementById('key-stats');
    if (!container || !data.stats) return;
    container.innerHTML = data.stats.map(function (s) {
      return '<div class="stat-card"><span class="stat-card__value">' + escapeHTML(s.value) + '</span><span class="stat-card__label">' + escapeHTML(s.label) + '</span></div>';
    }).join('');
  }

  /* --- Orchestra Details --- */
  function renderOrchestraDetails(data) {
    var groups = document.getElementById('orchestra-groups');
    if (groups && data.groups) {
      groups.innerHTML = data.groups.map(function (group) {
        return '<article class="orchestra-group">' +
          '<div class="orchestra-group__header">' +
          '<h3>' + escapeHTML(group.name || '') + '</h3>' +
          (group.subtitle ? '<span>' + escapeHTML(group.subtitle) + '</span>' : '') +
          '</div>' +
          '<p>' + escapeHTML(group.experience || '') + '</p>' +
          '<p>' + escapeHTML(group.schedule || '') + '</p>' +
          '</article>';
      }).join('');
    }

    var list = document.getElementById('orchestra-details-list');
    if (!list) return;
    var fields = ['when', 'where', 'cost', 'bring', 'instrument_hire'];
    var labels = { when: 'When', where: 'Where', cost: 'Cost', bring: 'Bring', instrument_hire: 'Instrument Hire' };
    list.innerHTML = fields.map(function (f) {
      if (!data[f]) return '';
      return '<li><strong>' + labels[f] + '</strong><span>' + escapeHTML(data[f]) + '</span></li>';
    }).join('');
    var contactNote = document.getElementById('orchestra-contact-note');
    if (contactNote && data.contact_note) {
      contactNote.textContent = data.contact_note;
    }
  }

  /* --- FAQs --- */
  function renderFAQs(data) {
    var container = document.getElementById('faq-list');
    if (!container || !data.faqs) return;
    container.innerHTML = data.faqs.map(function (f) {
      return '<details><summary>' + escapeHTML(f.question) + '</summary><div class="faq__answer"><p>' + escapeHTML(f.answer) + '</p></div></details>';
    }).join('');
  }

  /* --- Init: only load what the current page needs --- */
  document.addEventListener('DOMContentLoaded', function () {
    // Banner loads on every page
    fetchJSON('banner.json').then(renderBanner).catch(console.error);

    var needs = {
      termDates:          !!(document.getElementById('term-dates-body') || document.getElementById('term-dates-note')),
      testimonials:       !!document.getElementById('testimonials-container'),
      teachers:           !!document.getElementById('teachers-grid'),
      committee:          !!document.getElementById('committee-grid'),
      homeInstruments:    !!document.getElementById('home-instruments'),
      classInstruments:   !!document.getElementById('class-instruments'),
      faqs:               !!document.getElementById('faq-list'),
      stats:              !!document.getElementById('key-stats'),
      fees:               !!document.getElementById('fee-box'),
      enrolment:          !!document.getElementById('enrolment-steps'),
      orchestraDetails:   !!document.getElementById('orchestra-details-list')
    };

    if (needs.termDates)        fetchJSON('term-dates.json').then(renderTermDates).catch(console.error);
    if (needs.testimonials)     fetchJSON('testimonials.json').then(renderTestimonials).catch(console.error);
    if (needs.teachers)         fetchJSON('teachers.json').then(renderTeachers).catch(console.error);
    if (needs.committee)        fetchJSON('committee.json').then(renderCommittee).catch(console.error);
    if (needs.faqs)             fetchJSON('faqs.json').then(renderFAQs).catch(console.error);
    if (needs.stats)            fetchJSON('site-settings.json').then(renderStats).catch(console.error);
    if (needs.fees)             fetchJSON('fees.json').then(renderFees).catch(console.error);
    if (needs.enrolment)        fetchJSON('enrolment.json').then(renderEnrolment).catch(console.error);
    if (needs.orchestraDetails) fetchJSON('orchestra-details.json').then(renderOrchestraDetails).catch(console.error);
    if (needs.homeInstruments || needs.classInstruments) {
      fetchJSON('instruments.json').then(function (data) {
        if (needs.homeInstruments)  renderHomeInstruments(data);
        if (needs.classInstruments) renderClassInstruments(data);
      }).catch(console.error);
    }
  });
})();
