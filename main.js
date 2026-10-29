/* Justin Umali — interactions */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = root.classList.contains('reduced');
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (!hasGsap) root.classList.add('reduced');
  const motion = hasGsap && !reduced;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---------- text splitting ---------- */
  $$('[data-split]').forEach(el => {
    el.innerHTML = [...el.textContent].map(c => `<span class="char" aria-hidden="true">${c}</span>`).join('');
  });
  $$('[data-words]').forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  });
  $$('[data-split-words]').forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  });

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (motion && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const scrollTo = (target) => {
    if (lenis) return lenis.scrollTo(target, { offset: target === 0 ? 0 : -40, duration: 1.6 });
    const behavior = reduced ? 'auto' : 'smooth';
    if (target === 0) window.scrollTo({ top: 0, behavior });
    else target.scrollIntoView({ behavior });
  };

  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    closeMenu();
    scrollTo(target);
  }));

  /* ---------- nav ---------- */
  const nav = $('[data-nav]');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    const menuOpen = toggle.getAttribute('aria-expanded') === 'true';
    nav.classList.toggle('is-hidden', !menuOpen && y > lastY && y > 400);
    lastY = y;
  };

  const toggle = $('[data-menu-toggle]');
  const menu = $('#mobile-menu');
  function openMenu() {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    lenis && lenis.stop();
    if (motion) {
      gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: .8, ease: 'expo.inOut' });
      gsap.fromTo($$('nav a, .btn', menu), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .05, duration: .9, delay: .25, ease: 'expo.out' });
    }
  }
  function closeMenu() {
    if (menu.hidden) return;
    toggle.setAttribute('aria-expanded', 'false');
    lenis && lenis.start();
    if (motion) gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: .6, ease: 'expo.inOut', onComplete: () => { menu.hidden = true; } });
    else menu.hidden = true;
  }
  toggle.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()));

  /* ---------- progress bar ---------- */
  const bar = $('.progress span');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };

  if (lenis) lenis.on('scroll', () => { onScroll(); updateProgress(); });
  else addEventListener('scroll', () => { onScroll(); updateProgress(); }, { passive: true });

  /* ---------- intro + hero ---------- */
  function intro() {
    const chars = $$('.hero__name .char');
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    lenis && lenis.stop();
    window.scrollTo(0, 0);

    tl.to('.intro__mono', { opacity: 1, duration: 1.2, ease: 'power2.out' }, .15)
      .to('.intro__rule', { scaleX: 1, duration: 1.1, ease: 'expo.inOut' }, .25)
      .to('.intro__caption', { opacity: 1, duration: .8 }, .7)
      .to('.intro__inner', { opacity: 0, y: -16, duration: .6, ease: 'power2.in' }, 1.55)
      .to('.intro', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 1.85)
      .set('.intro', { display: 'none' })

      .fromTo('.hero__arch', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut' }, 2.0)
      .fromTo('.hero__arch img', { scale: 1.35 }, { scale: 1, duration: 2.4, ease: 'expo.out' }, 2.1)
      .to('.hero__arch-line path', { strokeDashoffset: 0, duration: 2.2, ease: 'expo.inOut' }, 2.4)

      .to(chars, { y: 0, duration: 1.5, stagger: .045 }, 2.25);

    // letters settle from hairline to their final weight, keeping each line's own axes
    $$('.hero__name .line').forEach((line, i) => {
      const base = getComputedStyle(line).fontVariationSettings;
      tl.fromTo($$('.char', line),
        { fontVariationSettings: `${base}, "wght" 100` },
        { fontVariationSettings: `${base}, "wght" 300`, duration: 2.2, stagger: .045, ease: 'power3.out', clearProps: 'fontVariationSettings' },
        2.25 + i * .27);
    });

    tl

      .to('.hero__eyebrow', { opacity: 1, duration: 1 }, 2.9)
      .to('.reveal-line > span', { y: 0, duration: 1.3, stagger: .1 }, 3.0)
      .to(['.hero__portrait figcaption', '.hero__foot'], { opacity: 1, duration: 1.2 }, 3.4)
      .to('.nav', { opacity: 1, duration: 1 }, 3.3)
      .add(() => { lenis && lenis.start(); }, 3.2);

    // portrait parallax on scroll
    gsap.to('.hero__arch img', {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero__text', {
      yPercent: -10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- scroll scenes ---------- */
  function scenes() {
    // statement: words ink in as you read
    const words = $$('.statement__text .w');
    gsap.fromTo(words, { opacity: .14 }, {
      opacity: 1, stagger: .1, ease: 'none',
      scrollTrigger: { trigger: '.statement__text', start: 'top 80%', end: 'bottom 45%', scrub: .6 }
    });

    // philosophy pin (desktop only)
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const principles = $$('.principle');
      const numerals = $$('.numeral');
      const railBar = $('.philosophy__rail span');
      gsap.set(principles, { autoAlpha: 0, y: 40 });
      gsap.set(principles[0], { autoAlpha: 1, y: 0 });
      gsap.set(numerals, { autoAlpha: 0, yPercent: 20 });
      gsap.set(numerals[0], { autoAlpha: 1, yPercent: 0 });
      principles.forEach(p => p.classList.remove('is-active'));
      numerals.forEach(n => n.classList.remove('is-active'));

      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.philosophy', start: 'top top', end: '+=220%', pin: '.philosophy__pin', scrub: .8, anticipatePin: 1 }
      });
      tl.fromTo(railBar, { scaleX: 1 / 3 }, { scaleX: 1, ease: 'none', duration: 2 }, 0);
      [1, 2].forEach(i => {
        const at = i - .5;
        tl.to(principles[i - 1], { autoAlpha: 0, y: -40, duration: .35, ease: 'power2.in' }, at)
          .to(numerals[i - 1], { autoAlpha: 0, yPercent: -20, duration: .35, ease: 'power2.in' }, at)
          .to(principles[i], { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out' }, at + .3)
          .to(numerals[i], { autoAlpha: 1, yPercent: 0, duration: .45, ease: 'power2.out' }, at + .3);
      });
      tl.to({}, { duration: .3 });
      return () => {
        gsap.set([...principles, ...numerals], { clearProps: 'all' });
        principles[0].classList.add('is-active'); numerals[0].classList.add('is-active');
      };
    });
    mm.add('(max-width: 899px)', () => {
      root.classList.add('no-pin');
      $$('.principle').forEach(p => gsap.from(p, { opacity: 0, y: 40, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 85%' } }));
      return () => root.classList.remove('no-pin');
    });

    // section titles & generic fades
    $$('.section-title, .section-sub, .section-head .eyebrow').forEach(el => {
      gsap.from(el, { opacity: 0, y: 40, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });

    // services rows
    $$('.index__row').forEach((row, i) => {
      gsap.from(row, { opacity: 0, y: 30, duration: 1.2, ease: 'expo.out', delay: (i % 2) * .06, scrollTrigger: { trigger: row, start: 'top 92%' } });
    });

    // planner rises over the page
    gsap.from('.planner', {
      y: 80, ease: 'none',
      scrollTrigger: { trigger: '.planner', start: 'top bottom', end: 'top 40%', scrub: true }
    });
    ScrollTrigger.create({ trigger: '.planner', start: 'top 50%', end: 'bottom 50%', onToggle: s => document.body.classList.toggle('on-dark', s.isActive) });
    ScrollTrigger.create({ trigger: '.footer', start: 'top 60%', onToggle: s => document.body.classList.toggle('on-dark-foot', s.isActive) });

    // process line draws as you scroll
    gsap.to('.steps__line i', {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '.steps', start: 'top 65%', end: 'bottom 65%', scrub: .5 }
    });
    $$('.step').forEach(step => {
      gsap.from(step.children[1], { opacity: 0, x: 40, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: step, start: 'top 75%' } });
      gsap.from(step.children[0], { scale: .4, opacity: 0, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: step, start: 'top 75%' } });
    });

    // letter + signature writes itself
    gsap.from('.letter__body p', { opacity: 0, y: 30, duration: 1.4, stagger: .15, ease: 'expo.out', scrollTrigger: { trigger: '.letter__body', start: 'top 75%' } });
    gsap.fromTo('.signature__ink', { clipPath: 'inset(-20% 100% -20% 0%)' }, { clipPath: 'inset(-20% 0% -20% 0%)', duration: 2.6, ease: 'power2.inOut', scrollTrigger: { trigger: '.signature', start: 'top 85%' } });

    // CTA words
    gsap.from('.cta__title .w', { yPercent: 100, opacity: 0, duration: 1.4, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.cta__title', start: 'top 80%' } });
    gsap.from('.cta__actions', { opacity: 0, y: 30, duration: 1.2, delay: .4, ease: 'expo.out', scrollTrigger: { trigger: '.cta__title', start: 'top 80%' } });

    // fonts can shift layout; recompute
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ---------- magnetic buttons ---------- */
  function magnetic() {
    $$('.magnetic').forEach(el => {
      const inner = el.querySelector('span');
      const xTo = gsap.quickTo(el, 'x', { duration: .8, ease: 'elastic.out(1, .4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: .8, ease: 'elastic.out(1, .4)' });
      const ixTo = gsap.quickTo(inner, 'x', { duration: .8, ease: 'elastic.out(1, .4)' });
      const iyTo = gsap.quickTo(inner, 'y', { duration: .8, ease: 'elastic.out(1, .4)' });
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * .3); yTo(dy * .4); ixTo(dx * .12); iyTo(dy * .15);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); ixTo(0); iyTo(0); });
    });
  }

  /* ---------- cursor ---------- */
  function cursor() {
    const c = $('.cursor');
    const label = $('.cursor__label');
    const xTo = gsap.quickTo(c, 'x', { duration: .45, ease: 'power3.out' });
    const yTo = gsap.quickTo(c, 'y', { duration: .45, ease: 'power3.out' });
    addEventListener('pointermove', e => { xTo(e.clientX); yTo(e.clientY); c.classList.remove('is-hidden'); }, { passive: true });
    document.addEventListener('pointerover', e => {
      const t = e.target;
      const labelled = t.closest('[data-cursor]');
      const link = t.closest('a, button, label, input[type="range"], .index__row');
      c.classList.toggle('is-label', !!labelled && !link);
      c.classList.toggle('is-link', !!link);
      if (labelled) label.textContent = labelled.dataset.cursor;
    });
    document.addEventListener('pointerleave', () => c.classList.add('is-hidden'));
    document.addEventListener('pointerenter', () => c.classList.remove('is-hidden'));
  }

  /* ---------- planner ---------- */
  function planner() {
    const form = $('.planner__controls');
    const svg = $('.chart svg');
    const chart = $('.chart');
    const W = 1000, H = 460, PAD_T = 30;
    const line = $('.chart__line', svg), area = $('.chart__area', svg), contrib = $('.chart__contrib', svg);
    const grid = $('.chart__grid', svg), labels = $('.chart__labels'), axis = $('.chart__axis');
    const cross = $('.chart__cross', svg), dot = $('.chart__dot'), tip = $('.chart__tip');
    const elTotal = $('[data-total]'), elContrib = $('[data-contrib]'), elGrowth = $('[data-growth]');
    const N = 60; // resample points so tweening between different year counts is smooth

    const money = v => '$' + Math.round(v).toLocaleString('en-US');
    const compact = v => v >= 1e6 ? '$' + (v / 1e6).toFixed(v >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M' : v >= 1e3 ? '$' + Math.round(v / 1e3) + 'K' : '$' + Math.round(v);

    const read = () => {
      const d = Object.fromEntries(new FormData(form));
      return { start: +d.start, monthly: +d.monthly, years: +d.years, rate: +d.rate };
    };

    const series = ({ start, monthly, years, rate }) => {
      const r = rate / 100 / 12;
      const pts = [];
      for (let i = 0; i <= N; i++) {
        const m = (i / N) * years * 12;
        const g = Math.pow(1 + r, m);
        const total = start * g + (r ? monthly * (g - 1) / r : monthly * m);
        pts.push({ total, paid: start + monthly * m });
      }
      return pts;
    };

    const niceMax = v => {
      if (v <= 0) return 1000;
      const exp = Math.pow(10, Math.floor(Math.log10(v)));
      const steps = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
      return steps.map(s => s * exp).find(s => s >= v * 1.06);
    };

    let state = { max: 1, pts: series(read()).map(() => ({ total: 0, paid: 0 })), years: read().years };
    let current = null;

    const x = i => (i / N) * W;
    const y = (v, max) => H - (v / max) * (H - PAD_T);

    function draw(pts, max) {
      let dl = '', dc = '';
      pts.forEach((p, i) => {
        dl += (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.total, max).toFixed(1);
        dc += (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.paid, max).toFixed(1);
      });
      line.setAttribute('d', dl);
      contrib.setAttribute('d', dc);
      area.setAttribute('d', dl + `L${W} ${H}L0 ${H}Z`);
    }

    function drawGrid(max, years) {
      grid.innerHTML = ''; labels.innerHTML = ''; axis.innerHTML = '';
      for (let k = 1; k <= 4; k++) {
        const v = (max / 4) * k;
        const yy = y(v, max);
        const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l.setAttribute('x1', 0); l.setAttribute('x2', W); l.setAttribute('y1', yy); l.setAttribute('y2', yy);
        grid.appendChild(l);
        const s = document.createElement('span');
        s.style.top = (yy / H * 100) + '%';
        s.textContent = compact(v);
        labels.appendChild(s);
      }
      const ticks = years <= 10 ? years : 5;
      for (let k = 0; k <= ticks; k++) {
        const yr = Math.round((k / ticks) * years);
        const s = document.createElement('span');
        s.style.left = (k / ticks * 100) + '%';
        s.textContent = k === 0 ? 'Today' : `Year ${yr}`;
        axis.appendChild(s);
      }
    }

    function setOutputs(v) {
      $('[data-out="start"]').textContent = money(v.start);
      $('[data-out="monthly"]').textContent = money(v.monthly);
      $('[data-out="years"]').textContent = v.years + (v.years === 1 ? ' year' : ' years');
      $('[data-out="rate"]').textContent = v.rate.toFixed(1) + '%';
      $$('input[type="range"]', form).forEach(inp => {
        inp.style.setProperty('--p', ((inp.value - inp.min) / (inp.max - inp.min) * 100) + '%');
      });
    }

    function writeTotals(pts) {
      const last = pts[pts.length - 1];
      elTotal.textContent = money(last.total);
      elContrib.textContent = money(last.paid);
      elGrowth.textContent = money(Math.max(0, last.total - last.paid));
    }

    function update(animate = true) {
      const v = read();
      setOutputs(v);
      const target = series(v);
      const max = niceMax(target[N].total);
      drawGrid(max, v.years);
      const from = state.pts.map(p => ({ ...p }));
      state = { pts: target, max, years: v.years };
      if (current) current.kill();
      if (!animate || !hasGsap || reduced) { draw(target, max); writeTotals(target); return; }
      const o = { t: 0 };
      current = gsap.to(o, {
        t: 1, duration: .9, ease: 'expo.out',
        onUpdate: () => {
          const t = o.t;
          const pts = target.map((p, i) => ({ total: from[i].total + (p.total - from[i].total) * t, paid: from[i].paid + (p.paid - from[i].paid) * t }));
          draw(pts, max);
          writeTotals(pts);
        }
      });
    }

    form.addEventListener('input', () => update(true));
    setOutputs(read());
    drawGrid(niceMax(series(read())[N].total), read().years);
    state.max = niceMax(series(read())[N].total);
    draw(state.pts, state.max);

    // reveal: draw the line in when the planner comes into view
    if (motion) {
      ScrollTrigger.create({ trigger: '.chart', start: 'top 92%', once: true, onEnter: () => {
        const o = { t: 0 };
        const target = series(read()); const max = niceMax(target[N].total);
        state = { pts: target, max, years: read().years };
        gsap.to(o, { t: 1, duration: 2.2, ease: 'expo.inOut', onUpdate: () => {
          const k = o.t;
          draw(target.map(p => ({ total: p.total * k, paid: p.paid * k })), max);
          writeTotals(target.map(p => ({ total: p.total * k, paid: p.paid * k })));
        } });
      } });
    } else update(false);

    // hover scrubber
    const showAt = clientX => {
      const r = svg.getBoundingClientRect();
      const rel = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      const i = Math.round(rel * N);
      const p = state.pts[i];
      const px = x(i), py = y(p.total, state.max);
      cross.setAttribute('x1', px); cross.setAttribute('x2', px);
      dot.style.left = (px / W * 100) + '%';
      dot.style.top = (py / H * 100) + '%';
      tip.style.left = (px / W * 100) + '%';
      tip.style.top = (py / H * 100) + '%';
      const yr = (i / N) * state.years;
      tip.querySelector('b').textContent = money(p.total);
      tip.querySelector('span').textContent = i === 0 ? 'Today' : `Year ${yr % 1 ? yr.toFixed(1) : yr}`;
      chart.classList.add('is-hover');
    };
    chart.addEventListener('pointermove', e => showAt(e.clientX));
    chart.addEventListener('pointerdown', e => showAt(e.clientX));
    chart.addEventListener('pointerleave', () => chart.classList.remove('is-hover'));
  }

  /* ---------- booking dialog ---------- */
  function booking() {
    const dlg = $('.book');
    const steps = $$('.book__step', dlg);
    const pips = $$('.book__steps i', dlg);
    const next = $('[data-next]', dlg), back = $('[data-back]', dlg);
    const err = $('.book__error', dlg);
    let step = 1;
    let opener = null;

    const show = (n, dir = 1) => {
      const prev = steps[step - 1];
      const to = steps[n - 1];
      step = n;
      pips.forEach((p, i) => p.classList.toggle('is-on', i < Math.min(n, 3)));
      back.hidden = n === 1 || n === 4;
      next.querySelector('span').textContent = n === 3 ? 'Send request' : n === 4 ? 'Close' : 'Continue';
      if (motion && prev !== to) {
        gsap.to(prev, { opacity: 0, x: -30 * dir, duration: .3, ease: 'power2.in', onComplete: () => {
          prev.classList.remove('is-active'); gsap.set(prev, { clearProps: 'all' });
          to.classList.add('is-active');
          gsap.fromTo(to, { opacity: 0, x: 30 * dir }, { opacity: 1, x: 0, duration: .6, ease: 'expo.out' });
          gsap.fromTo($$('.chips label, .input', to), { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: .04, duration: .6, ease: 'expo.out', delay: .05 });
          focusStep(to);
        } });
      } else {
        steps.forEach(s => s.classList.toggle('is-active', s === to));
        focusStep(to);
      }
    };
    const focusStep = el => { const f = el.querySelector('input, textarea'); if (f && step > 1) f.focus({ preventScroll: true }); };

    const open = (e) => {
      opener = e && e.currentTarget;
      closeMenu();
      $('.book__form', dlg).reset();
      $$('.is-invalid', dlg).forEach(i => i.classList.remove('is-invalid'));
      err.textContent = '';
      steps.forEach((s, i) => s.classList.toggle('is-active', i === 0));
      step = 1; show(1);
      dlg.showModal();
      lenis && lenis.stop();
    };
    const close = () => {
      if (!dlg.open) return;
      if (motion) {
        dlg.classList.add('is-closing');
        setTimeout(() => { dlg.classList.remove('is-closing'); dlg.close(); }, 380);
      } else dlg.close();
    };
    dlg.addEventListener('close', () => { lenis && lenis.start(); opener && opener.focus({ preventScroll: true }); });
    dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
    dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
    $('[data-close]', dlg).addEventListener('click', close);
    $$('[data-book]').forEach(b => b.addEventListener('click', open));

    back.addEventListener('click', () => show(step - 1, -1));
    dlg.addEventListener('input', e => { if (e.target.classList.contains('is-invalid')) { e.target.classList.remove('is-invalid'); err.textContent = ''; } });
    next.addEventListener('click', () => {
      if (step === 4) return close();
      if (step === 3) {
        const name = dlg.querySelector('[name="name"]');
        const email = dlg.querySelector('[name="email"]');
        const bad = [name, email].filter(i => !i.checkValidity() || !i.value.trim());
        [name, email].forEach(i => i.classList.toggle('is-invalid', bad.includes(i)));
        if (bad.length) {
          err.textContent = bad.includes(name) ? 'Please add your name.' : 'Please add a valid email address.';
          bad[0].focus();
          if (motion) gsap.fromTo(bad[0].parentElement, { x: -6 }, { x: 0, duration: .5, ease: 'elastic.out(1, .3)' });
          return;
        }
        err.textContent = '';
        $('[data-thanks-name]', dlg).textContent = ', ' + name.value.trim().split(/\s+/)[0];
      }
      show(step + 1, 1);
    });
  }

  /* ---------- boot ---------- */
  booking();
  planner();
  onScroll(); updateProgress();
  if (motion) {
    intro();
    scenes();
    if (finePointer) { magnetic(); cursor(); }
  }
})();
