/* Тест на уровень 1–4 класс: адаптивная цепочка диагностических тестов Give Me Five! L2→L5.
   Порог 70 % → предлагаем следующий уровень; не прошёл стартовый → шаг вниз (до L2). Не больше 3 тестов подряд.
   Итог = самый высокий пройденный уровень N → «GMF N» (L5 → Get Involved A1+), ничего → «GMF 1». */
(function () {
  'use strict';
  var KEY = 'ss_kids_v1', PASS = 0.7, MAXTESTS = 3, PTS = 2;
  var KT = window.KT;
  var $ = function (id) { return document.getElementById(id); };
  var st = load() || null;

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function wipe() { try { localStorage.removeItem(KEY); } catch (e) {} st = null; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ── экраны ── */
  var SCREENS = ['s-form', 's-resume', 's-intro', 's-q', 's-break', 's-result'];
  function show(id) {
    stopAudio();
    SCREENS.forEach(function (s) { $(s).hidden = s !== id; });
    var el = $(id); el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    window.scrollTo(0, 0);
    topinfo();
  }
  function topinfo() {
    var t = $('topinfo');
    if (st && st.cur && (st.phase === 'intro' || st.phase === 'q')) {
      t.hidden = false; t.textContent = 'Тест ' + st.seq.length + (st.phase === 'q' ? ' · задание ' + (st.ex + 1) + ' из ' + KT[st.cur].ex.length : '');
    } else t.hidden = true;
  }

  /* ── звук: один Audio-элемент (iOS: play() только по нажатию) ── */
  var au = new Audio(); au.preload = 'auto'; var auBtn = null;
  function stopAudio() { try { au.pause(); } catch (e) {} if (auBtn) auBtn.classList.remove('playing'); auBtn = null; }
  function play(id, btn) {
    if (auBtn === btn && !au.paused) { stopAudio(); return; }
    stopAudio();
    au.src = 'audio/' + id + '.mp3';
    auBtn = btn; btn.classList.add('playing');
    var p = au.play(); if (p && p.catch) p.catch(function () { if (auBtn) auBtn.classList.remove('playing'); });
  }
  au.addEventListener('ended', function () { if (auBtn) auBtn.classList.remove('playing'); auBtn = null; });
  au.addEventListener('error', function () { if (auBtn) auBtn.classList.remove('playing'); auBtn = null; });
  var PLAY = '<span class="ic"><svg viewBox="0 0 24 24"><path d="M6 4l15 8-15 8z"/></svg></span>';
  function listenBtn(id, small) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'listen' + (small ? ' sm' : '');
    b.innerHTML = PLAY + '<span>' + (small ? 'Послушать пример' : 'Слушать') + '</span>';
    b.addEventListener('click', function () { play(id, b); });
    return b;
  }

  /* ── увеличить картинку ── */
  function zoom(src) {
    var z = document.createElement('div'); z.className = 'zoom'; z.innerHTML = '<img alt="" src="' + src + '">';
    z.addEventListener('click', function () { z.remove(); }); document.body.appendChild(z);
  }
  function img(name) { return 'img/' + name + '.webp'; }

  /* ── порядок картинок (только для ex.shuffle): фиксированный, чтобы ответы не шли «всё слева» ── */
  var FLIP = [0, 1, 1, 0, 1, 0];
  function order(ex, i, n) {
    var a = []; for (var j = 0; j < n; j++) a.push(j);
    if (ex.shuffle && FLIP[i % FLIP.length]) a.reverse();
    return a;
  }

  /* ── отрисовка вопроса ── */
  var FACES = { love: '😍', like: '🙂', dont: '🙁' };
  function renderItem(box, ex, i, sel, onPick, isExample) {
    var it = ex.items[i]; box.innerHTML = '';
    var w = document.createElement('div'); w.className = 'q';
    if (ex.text) {
      var ps = document.createElement('div'); ps.className = 'passage';
      ps.innerHTML = (ex.textTitle ? '<h3>' + esc(ex.textTitle) + '</h3>' : '') +
        esc(ex.text).replace(/\((\d)\) ___/g, function (m, n) { return '<mark' + (+n === it.gap ? ' class="cur"' : '') + '>(' + n + ') ___</mark>'; });
      w.appendChild(ps);
    }
    if (it.a) w.appendChild(listenBtn(it.a, isExample));
    if (it.img) {
      var f = document.createElement('div'); f.className = 'qimg';
      f.innerHTML = '<img alt="" src="' + img(it.img) + '">' + (it.face ? '<span class="face">' + FACES[it.face] + '</span>' : '');
      w.appendChild(f);
    }
    if (it.q && !ex.text) {
      var q = document.createElement('div'); q.className = 'qtext' + (it.q.length > 90 ? ' long' : ''); q.textContent = it.q; w.appendChild(q);
    } else if (it.q && ex.text) {
      var g = document.createElement('p'); g.className = 'instr sm'; g.textContent = 'Пропуск (' + it.gap + ')'; w.appendChild(g);
    }
    var o = document.createElement('div'), isPic = typeof it.o[0] === 'object';
    var cls = 'opts';
    if (ex.grid) cls += ' grid6';
    else if (isPic) cls += it.o.length === 3 ? ' pic3' : ' pic2';
    else if (it.o.length === 2 && it.o.every(function (x) { return x.length <= 12; })) cls += ' row2';
    o.className = cls;
    var used = {};
    if (ex.grid && st && st.ans) { var A = (st.ans[st.cur] || [])[st.ex] || []; used[ex.items[0].k] = 1; A.forEach(function (v, j) { if (v != null && j !== i) used[v] = 1; }); }
    order(ex, i, it.o.length).forEach(function (j) {
      var x = it.o[j], b = document.createElement('button'); b.type = 'button';
      b.className = 'opt' + (isPic ? ' pic' : '') + (it.list ? ' list' : '') + (sel === j ? ' sel' : '') + (used[j] && sel !== j ? ' used' : '');
      if (isPic) b.innerHTML = (ex.grid || it.o.length === 3 ? '<span class="lt">' + 'abcdef'[j] + '</span>' : '') + '<img alt="" src="' + img(x.i) + '">';
      else b.textContent = x;
      b.setAttribute('aria-pressed', sel === j ? 'true' : 'false'); b.setAttribute('data-j', j);
      if (onPick) b.addEventListener('click', function () { onPick(j, b, o); });
      else b.tabIndex = -1;
      o.appendChild(b);
    });
    w.appendChild(o);
    box.appendChild(w);
    var cm = w.querySelector('.passage mark.cur');
    if (cm) setTimeout(function () { var pz = cm.parentNode; pz.scrollTop = Math.max(0, cm.offsetTop - 70); }, 30);
  }
  function renderShared(box, ex) {
    if (!ex.shared) return;
    var s = document.createElement('div'); s.className = 'shared';
    ex.shared.forEach(function (n, j) {
      var f = document.createElement('figure'); f.className = 'zoomable';
      f.innerHTML = '<img alt="" src="' + img(n) + '">' + (ex.sharedLabels ? '<figcaption>' + ex.sharedLabels[j] + '</figcaption>' : '');
      f.addEventListener('click', function () { zoom(img(n)); });
      s.appendChild(f);
    });
    box.appendChild(s);
    var h = document.createElement('p'); h.className = 'zoom-hint'; h.textContent = 'Нажми на картинку, чтобы увеличить'; box.appendChild(h);
  }

  /* ── шаги теста ── */
  function cur() { return KT[st.cur]; }
  function startTest(L) {
    st.cur = L; st.ex = 0; st.it = 0; st.phase = 'intro';
    if (st.seq.indexOf(L) < 0) st.seq.push(L);
    st.ans[L] = cur().ex.map(function (e) { return new Array(e.items.length).fill(null); });
    save(); showIntro();
  }
  function showIntro() {
    var ex = cur().ex[st.ex];
    $('i-no').textContent = 'Задание ' + (st.ex + 1) + ' из ' + cur().ex.length;
    $('i-ru').textContent = ex.ru;
    $('i-en').textContent = ex.en;
    var box = $('i-example'); box.innerHTML = '';
    var inner = document.createElement('div');
    renderShared(box, ex);
    box.appendChild(inner);
    renderItem(inner, ex, 0, ex.items[0].k, null, true);
    show('s-intro');
  }
  $('i-go').addEventListener('click', function () { st.phase = 'q'; st.it = 1; save(); showQ(); });

  var lock = false;
  function showQ() {
    var ex = cur().ex[st.ex], n = ex.items.length - 1;
    $('q-ru').textContent = ex.ru;
    var done = 0, tot = 0;
    cur().ex.forEach(function (e, ei) { tot += e.items.length - 1; if (ei < st.ex) done += e.items.length - 1; });
    done += st.it - 1;
    $('q-bar').style.width = Math.round(done / tot * 100) + '%';
    $('q-count').textContent = st.it + ' / ' + n;
    $('q-back').style.visibility = (st.ex === 0 && st.it === 1) ? 'hidden' : 'visible';
    var body = $('q-body'); body.innerHTML = '';
    renderShared(body, ex);
    var inner = document.createElement('div'); body.appendChild(inner);
    var sel = st.ans[st.cur][st.ex][st.it];
    renderItem(inner, ex, st.it, sel, function (j, b, o) {
      if (lock) return; lock = true;
      Array.prototype.forEach.call(o.children, function (c) { c.classList.remove('sel'); c.setAttribute('aria-pressed', 'false'); });
      b.classList.add('sel'); b.setAttribute('aria-pressed', 'true');
      st.ans[st.cur][st.ex][st.it] = j; save();
      setTimeout(function () { lock = false; next(); }, 550);
    }, false);
    if ($('s-q').hidden) show('s-q'); else { stopAudio(); topinfo(); window.scrollTo(0, 0); }
  }
  function next() {
    var exs = cur().ex;
    if (st.it < exs[st.ex].items.length - 1) { st.it++; save(); showQ(); return; }
    if (st.ex < exs.length - 1) { st.ex++; st.it = 0; st.phase = 'intro'; save(); showIntro(); return; }
    finishTest();
  }
  $('q-back').addEventListener('click', function () {
    if (lock) return;
    if (st.it > 1) { st.it--; save(); showQ(); return; }
    if (st.ex > 0) { st.ex--; st.it = cur().ex[st.ex].items.length - 1; save(); showQ(); }
  });

  function score(L) {
    var T = KT[L], A = st.ans[L], s = 0, m = 0, ex = [];
    T.ex.forEach(function (e, ei) {
      var es = 0, em = 0;
      for (var i = 1; i < e.items.length; i++) { em += PTS; if (A[ei][i] === e.items[i].k) es += PTS; }
      ex.push({ skill: e.skill, score: es, max: em }); s += es; m += em;
    });
    return { score: s, max: m, ex: ex, pass: s >= PASS * m };
  }
  var TOP = 4;
  function decideNext(L, r) {
    if (st.seq.length >= MAXTESTS) return null;
    if (r.pass) return (L < TOP && !st.res[L + 1]) ? L + 1 : null; // 01.11.2026: GMF 5 в школе нет — цепочка до L4
    return (L > 2 && !st.res[L - 1]) ? L - 1 : null;
  }
  function finishTest() {
    var L = st.cur, r = score(L);
    st.res[L] = r;
    st.next = decideNext(L, r);
    st.phase = st.next ? 'break' : 'result';
    save();
    if (st.next) showBreak(); else showResult();
  }
  var BREAKS = [
    'Встань, потянись вверх, как Спики, и помаши руками. Готов к ещё одному заданию?',
    'Похлопай в ладоши пять раз и сделай глубокий вдох. Ещё чуть-чуть — и всё!'
  ];
  function showBreak() {
    $('b-title').textContent = (st.form.first || 'Ты') + ', отлично поработали!';
    $('b-text').textContent = BREAKS[(st.seq.length - 1) % BREAKS.length];
    show('s-break');
  }
  $('b-go').addEventListener('click', function () { var n = st.next; st.next = null; startTest(n); });
  $('b-stop').addEventListener('click', function () { st.next = null; st.stopped = true; st.phase = 'result'; save(); showResult(); });

  /* ── рекомендация ── */
  var COURSE = { 2: 'Give Me Five! 2', 3: 'Give Me Five! 3', 4: 'Give Me Five! 4', 5: 'Get Involved! A1+' };
  function recommend() {
    if (st.form.studied === 'no') return { level: 'GMF 1', course: 'Give Me Five! 1', sub: 'с нуля',
      note: 'Начнём с самого начала: звуки, первые слова и песенки. Ребёнку будет легко и весело.' };
    var passed = st.seq.filter(function (L) { return st.res[L] && st.res[L].pass; });
    var hp = passed.length ? Math.max.apply(null, passed) : 0;
    if (hp === 5) return { level: 'Get Involved A1+', course: 'Get Involved! A1+', sub: 'после GMF 4',
      note: 'Ребёнок уверенно знает материал Give Me Five! 4 — готов к курсу для 5 класса.' };
    if (hp) {
      var nt = (hp < TOP && st.res[hp + 1]) ? '' : (st.stopped ? ' Следующий уровень можно проверить на пробном занятии.' : '') + (hp === TOP ? ' Если ребёнок уже закончил Give Me Five! 4, пройдите тест для 5–6 класса: speakandsmile.ru/test/gi/' : '');
      return { level: 'GMF ' + hp, course: COURSE[hp], sub: '',
        note: 'Ребёнок хорошо знает материал предыдущего уровня — этот курс будет в самый раз.' + nt };
    }
    var lo = Math.min.apply(null, st.seq.filter(function (L) { return st.res[L]; }));
    if (lo === 2 || !isFinite(lo)) return { level: 'GMF 1', course: 'Give Me Five! 1', sub: 'для продолжающих',
      note: 'Ребёнок уже знаком с английским — повторим основу и пойдём дальше в комфортном темпе.' };
    return { level: 'GMF ' + (lo - 1), course: COURSE[lo - 1] || 'Give Me Five! 1', sub: '',
      note: 'Уточним уровень на пробном занятии — преподаватель подберёт группу.' };
  }
  function payload(rec) {
    var last = st.seq.length ? st.res[st.seq[st.seq.length - 1]] : null;
    var tests = st.seq.filter(function (L) { return st.res[L]; });
    var detail = tests.map(function (L) {
      var g = {}; st.res[L].ex.forEach(function (e) { g[e.skill] = g[e.skill] || [0, 0]; g[e.skill][0] += e.score; g[e.skill][1] += e.max; });
      return 'L' + L + ': ' + Object.keys(g).map(function (k) { var v = g[k]; return k + ' ' + v[0] + '/' + v[1] + (v[0] < 0.6 * v[1] ? '!' : ''); }).join(', ');
    }).join(' · ');
    var recTxt = rec.course + (rec.sub ? ' (' + rec.sub + ')' : '') + '. ';
    if (st.form.studied === 'no') recTxt += 'Родитель: ребёнок не учил английский, тест не проходил.';
    else recTxt += 'Тесты: ' + (tests.map(function (L) { var r = st.res[L]; return 'Diagnostic L' + L + ' ' + r.score + '/' + r.max + (r.pass ? ' пройден' : ' ниже 70%'); }).join(', ') || 'не начат') +
      (st.stopped ? '. Остановились по желанию' : '') + '. Старт: L' + st.start + '.';
    return {
      test: 'kids', name: st.form.name, klass: st.form.klass + ' класс', contact: st.form.contact || '',
      score: last ? last.score : 0, max: last ? last.max : 0, level: rec.level, rec: recTxt,
      sections: tests.map(function (L) { return { label: 'Diagnostic L' + L, score: st.res[L].score, max: st.res[L].max }; }),
      detail: detail || '—', ms: Math.max(0, (st.tEnd || Date.now()) - st.t0)
    };
  }

  var sending = false;
  function send(rec) {
    var el = $('res-send');
    if (st.sent === 'ok') { el.className = 'send ok'; el.textContent = 'Отправлено ✓'; $('res-admin').hidden = false; return; }
    if (st.sent === 'queued') { failMsg(); return; }
    if (sending) return;
    sending = true; el.className = 'send'; el.textContent = 'Отправляем результат…'; $('res-admin').hidden = true;
    var p;
    try { p = window.SSPlace && window.SSPlace.send ? window.SSPlace.send(payload(rec)) : Promise.resolve(false); } catch (e) { p = Promise.resolve(false); }
    p.then(function (ok) {
      sending = false; st.sent = ok ? 'ok' : 'queued'; save();
      if (ok) { el.className = 'send ok'; el.textContent = 'Отправлено ✓'; $('res-admin').hidden = false; }
      else failMsg();
    });
  }
  function failMsg() {
    var el = $('res-send'); el.className = 'send fail';
    el.textContent = 'Не получилось отправить результат (нет связи). Покажите этот экран администратору — или откройте эту страницу позже, мы попробуем ещё раз.';
    $('res-admin').hidden = true;
  }

  function showResult() {
    if (!st.tEnd) { st.tEnd = Date.now(); save(); }
    var rec = recommend();
    $('res-title').textContent = 'Молодец' + (st.form.first ? ', ' + st.form.first : '') + '!';
    $('res-lead').textContent = st.form.studied === 'no' ? 'Спасибо! Мы уже знаем, с чего начать.' : 'Все задания выполнены. Вот что мы советуем:';
    $('res-course').textContent = rec.course + (rec.sub ? ' · ' + rec.sub : '');
    $('res-note').textContent = rec.note;
    var ul = $('res-tests'); ul.innerHTML = '';
    st.seq.forEach(function (L) {
      var r = st.res[L]; if (!r) return;
      var li = document.createElement('li');
      li.innerHTML = '<span>Задания по материалу ' + (L === 5 ? 'GMF 4' : 'GMF ' + (L - 1)) + '</span><b>' + r.score + ' из ' + r.max + '</b>';
      ul.appendChild(li);
    });
    ul.hidden = !ul.children.length;
    show('s-result');
    confetti();
    send(rec);
  }
  function confetti() {
    var c = $('confetti'); c.innerHTML = '';
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var col = ['#F5C842', '#F17FBE', '#63B3FF', '#34D3C0', '#fff'];
    for (var i = 0; i < 36; i++) {
      var d = document.createElement('i');
      d.style.left = Math.random() * 100 + '%'; d.style.background = col[i % col.length];
      d.style.animationDuration = (2.2 + Math.random() * 1.8) + 's'; d.style.animationDelay = (Math.random() * .6) + 's';
      c.appendChild(d);
    }
    setTimeout(function () { c.innerHTML = ''; }, 5000);
  }
  $('res-new').addEventListener('click', function () { wipe(); resetForm(); show('s-form'); });

  /* ── анкета ── */
  var form = { klass: '', studied: '', start: 'auto' };
  function seg(id, key, cb) {
    var g = $(id);
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      Array.prototype.forEach.call(g.children, function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
      form[key] = b.getAttribute('data-v'); if (cb) cb();
    });
    Array.prototype.forEach.call(g.children, function (x) { x.setAttribute('role', 'radio'); x.setAttribute('aria-checked', 'false'); });
  }
  seg('f-klass', 'klass');
  seg('f-studied', 'studied', function () { $('f-startbox').hidden = form.studied !== 'yes'; });
  seg('f-start', 'start');
  function resetForm() {
    form = { klass: '', studied: '', start: 'auto' };
    $('form').reset(); $('f-startbox').hidden = true;
    ['f-klass', 'f-studied', 'f-start'].forEach(function (id) { Array.prototype.forEach.call($(id).children, function (x) { x.setAttribute('aria-checked', 'false'); }); });
    $('f-start').children[0].setAttribute('aria-checked', 'true');
  }
  $('f-start').children[0].setAttribute('aria-checked', 'true');
  $('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('f-name').value.trim().replace(/\s+/g, ' '), err = $('f-err');
    var miss = !name ? 'Напишите имя и фамилию ребёнка' : !form.klass ? 'Выберите класс' : !form.studied ? 'Ответьте, учил ли ребёнок английский' : '';
    if (miss) { err.hidden = false; err.textContent = miss; return; }
    err.hidden = true;
    var start = form.start === 'auto' ? ({ 1: 2, 2: 2, 3: 3, 4: 4 })[form.klass] : +form.start;
    st = { v: 1, form: { name: name, first: name.split(' ')[0], klass: form.klass, contact: $('f-contact').value.trim(), studied: form.studied },
      t0: Date.now(), start: start, seq: [], ans: {}, res: {}, cur: 0, ex: 0, it: 0, phase: 'form', next: null, sent: '' };
    if (form.studied === 'no') { st.phase = 'result'; save(); showResult(); return; }
    save(); startTest(start);
  });

  /* ── продолжение ── */
  function resume() {
    if (st.phase === 'result') return showResult();
    if (st.phase === 'break') return showBreak();
    if (st.phase === 'intro') return showIntro();
    if (st.phase === 'q') return showQ();
    show('s-form');
  }
  $('r-go').addEventListener('click', resume);
  $('r-new').addEventListener('click', function () { wipe(); resetForm(); show('s-form'); });

  if (st && st.v === 1 && st.form && st.phase && st.phase !== 'form') {
    if (st.phase === 'result') resume();
    else { $('r-title').textContent = 'С возвращением' + (st.form.first ? ', ' + st.form.first : '') + '!'; show('s-resume'); }
  } else { st = null; show('s-form'); }

  /* для проверки (харнесс): состояние и прямой выбор ответа */
  window.__kids = { state: function () { return st; }, KT: KT };
})();
