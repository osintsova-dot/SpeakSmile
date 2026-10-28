/* SpeakRec — запись устных ответов в «Уроке дома» (28.10.2026).
   Ребёнок записывает ответ → запись хранится в браузере (IndexedDB, переживает перезагрузку) →
   при отправке теста уходит на сервер (nihao-bot /speak/*), учитель получает ссылку на прослушивание.
   Подключение: <script src="/assets/speakrec.js"></script>
   SpeakRec.mount(el, {lesson, part, max:90}) — кнопки записи для одной части;
   SpeakRec.count(lesson) — сколько частей записано; SpeakRec.submit({...}) — отправить; SpeakRec.reset(lesson). */
(function () {
  var SRV = ['https://d5d6o4mldv5m1nj5hvih.6brbn2wz.apigw.yandexcloud.net/nihao', 'https://nihao-bot.o-sintsova.workers.dev'];
  var MEM = {}; // lesson -> {part: {blob, mime, dur}}
  var ACTIVE = null; // текущая запись (одна на страницу)

  function pickMime() {
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return '';
    var L = ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4', 'audio/aac', 'audio/webm;codecs=opus', 'audio/webm'];
    for (var i = 0; i < L.length; i++) if (MediaRecorder.isTypeSupported(L[i])) return L[i];
    return '';
  }

  // ---- IndexedDB: записи не теряются, если ребёнок перезагрузил страницу ----
  function db() {
    return new Promise(function (res, rej) {
      try {
        var r = indexedDB.open('ss-speak', 1);
        r.onupgradeneeded = function () { r.result.createObjectStore('rec'); };
        r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); };
      } catch (e) { rej(e); }
    });
  }
  function idb(mode, fn) { return db().then(function (d) { return new Promise(function (res, rej) { var t = d.transaction('rec', mode), s = t.objectStore('rec'), q = fn(s); t.oncomplete = function () { res(q && q.result); }; t.onerror = function () { rej(t.error); }; }); }); }
  function putRec(lesson, part, v) { (MEM[lesson] = MEM[lesson] || {})[part] = v; return idb('readwrite', function (s) { return s.put(v, lesson + '|' + part); }).catch(function () {}); }
  function delRec(lesson, part) { if (MEM[lesson]) delete MEM[lesson][part]; return idb('readwrite', function (s) { return s.delete(lesson + '|' + part); }).catch(function () {}); }
  function getRec(lesson, part) {
    if (MEM[lesson] && MEM[lesson][part]) return Promise.resolve(MEM[lesson][part]);
    return idb('readonly', function (s) { return s.get(lesson + '|' + part); }).then(function (v) { if (v) (MEM[lesson] = MEM[lesson] || {})[part] = v; return v; }).catch(function () { return null; });
  }

  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function css() {
    if (document.getElementById('srec-css')) return;
    var st = document.createElement('style'); st.id = 'srec-css';
    st.textContent = '.srec{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:10px 0 4px}' +
      '.srec button{font:inherit;font-weight:700;font-size:15px;border-radius:999px;padding:10px 16px;border:2px solid #6C3FC5;background:#fff;color:#6C3FC5;cursor:pointer;touch-action:manipulation}' +
      '.srec button.rec{background:#6C3FC5;color:#fff}.srec button.stop{background:#E5484D;border-color:#E5484D;color:#fff;animation:srecP 1.2s ease-in-out infinite}' +
      '.srec button:disabled{opacity:.45;cursor:default}.srec .st{font-size:14px;color:#6B6280}.srec .st.ok{color:#1F8A4C;font-weight:700}' +
      '@keyframes srecP{50%{box-shadow:0 0 0 6px rgba(229,72,77,.18)}}@media (prefers-reduced-motion:reduce){.srec button.stop{animation:none}}';
    document.head.appendChild(st);
  }

  function mount(el, o) {
    css();
    var lesson = o.lesson, part = o.part, maxS = o.max || 90;
    el.innerHTML = '<div class="srec"><button type="button" class="rec">🎙 Записать ответ</button><button type="button" class="play" hidden>▶ Послушать</button><span class="st"></span></div>';
    var bRec = el.querySelector('.rec'), bPlay = el.querySelector('.play'), st = el.querySelector('.st'), audio = null;
    function show(v) {
      if (v) { bRec.textContent = '↺ Перезаписать'; bPlay.hidden = false; st.className = 'st ok'; st.textContent = '✓ Записано (' + fmt(v.dur || 0) + ')'; }
      else { bRec.textContent = '🎙 Записать ответ'; bPlay.hidden = true; st.className = 'st'; st.textContent = ''; }
      if (o.onchange) o.onchange();
    }
    getRec(lesson, part).then(show);
    bPlay.onclick = function () {
      getRec(lesson, part).then(function (v) {
        if (!v) return; if (audio) { audio.pause(); audio = null; bPlay.textContent = '▶ Послушать'; return; }
        audio = new Audio(URL.createObjectURL(v.blob)); bPlay.textContent = '⏸ Пауза';
        audio.onended = function () { audio = null; bPlay.textContent = '▶ Послушать'; }; audio.play().catch(function () {});
      });
    };
    bRec.onclick = function () {
      if (ACTIVE && ACTIVE.el === el) { ACTIVE.stop(); return; }
      if (ACTIVE) ACTIVE.stop();
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) { st.className = 'st'; st.textContent = 'Этот браузер не умеет записывать звук. Открой урок в Safari или Chrome.'; return; }
      navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }).then(function (stream) {
        var mime = pickMime(), mr; try { mr = mime ? new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 48000 }) : new MediaRecorder(stream); } catch (e) { mr = new MediaRecorder(stream); }
        var chunks = [], t0 = Date.now(), tick = null;
        mr.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
        mr.onstop = function () {
          clearInterval(tick); stream.getTracks().forEach(function (t) { t.stop(); }); ACTIVE = null;
          bRec.className = 'rec'; var dur = (Date.now() - t0) / 1000;
          var type = mr.mimeType || mime || 'audio/webm', blob = new Blob(chunks, { type: type });
          if (blob.size < 1500 || dur < 1) { st.className = 'st'; st.textContent = 'Слишком коротко — запиши ещё раз.'; bRec.textContent = '🎙 Записать ответ'; return; }
          var v = { blob: blob, mime: type.split(';')[0] === 'audio/aac' ? 'audio/aac' : type, dur: dur };
          putRec(lesson, part, v).then(function () { show(v); });
        };
        mr.start(1000);
        ACTIVE = { el: el, stop: function () { if (mr.state !== 'inactive') mr.stop(); } };
        bRec.className = 'stop'; bRec.textContent = '⏹ Стоп'; bPlay.hidden = true; st.className = 'st';
        tick = setInterval(function () { var s = (Date.now() - t0) / 1000; st.textContent = '● Идёт запись ' + fmt(s) + ' / ' + fmt(maxS); if (s >= maxS) ACTIVE && ACTIVE.stop(); }, 250);
        st.textContent = '● Идёт запись 0:00';
      }).catch(function () { st.className = 'st'; st.textContent = '🎙 Нет доступа к микрофону. Разреши микрофон для этого сайта (в настройках браузера) и нажми ещё раз.'; });
    };
  }

  function count(lesson, parts) {
    return Promise.all(parts.map(function (p) { return getRec(lesson, p); })).then(function (a) { return a.filter(Boolean).length; });
  }
  function b64(blob) { return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(String(r.result).split(',')[1] || ''); }; r.onerror = rej; r.readAsDataURL(blob); }); }
  function post(path, body) {
    var i = 0, data = JSON.stringify(body);
    return new Promise(function (res, rej) {
      (function next() {
        if (i >= SRV.length) return rej(new Error('net'));
        var ctl = window.AbortController ? new AbortController() : null, tm = setTimeout(function () { if (ctl) ctl.abort(); }, 45000);
        fetch(SRV[i++] + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: data, signal: ctl ? ctl.signal : undefined })
          .then(function (r) { return r.json(); }).then(function (j) { clearTimeout(tm); if (j && j.ok) res(j); else next(); })
          .catch(function () { clearTimeout(tm); next(); });
      })();
    });
  }
  function sidOf(lesson) {
    var k = 'speak:sid:' + lesson, s = null; try { s = localStorage.getItem(k); } catch (e) {}
    if (!s) { s = ''; var a = crypto.getRandomValues(new Uint8Array(16)); for (var i = 0; i < a.length; i++) s += 'abcdefghijkmnpqrstuvwxyz23456789'[a[i] % 32]; try { localStorage.setItem(k, s); } catch (e) {} }
    return s;
  }
  // o = {lesson, name, written, wmax, parts:[{id,label,max,q,text?}]} (text — письменный ответ, его учитель читает рядом с записями) → загрузить записи и отправить набор учителю
  function submit(o) {
    var sid = sidOf(o.lesson);
    return Promise.all(o.parts.map(function (p) { return getRec(o.lesson, p.id); })).then(function (recs) {
      var have = o.parts.filter(function (p, i) { return recs[i] || (p.text != null && String(p.text).trim()); }); // Writing: part с text — без записи
      if (!have.length) return { ok: true, none: true };
      var chain = Promise.resolve();
      o.parts.forEach(function (p, i) { if (recs[i]) chain = chain.then(function () { return b64(recs[i].blob).then(function (b) { return post('/speak/up', { sid: sid, part: p.id, mime: recs[i].mime, b64: b }); }); }); });
      return chain.then(function () { return post('/speak/done', { sid: sid, lesson: o.lesson, name: o.name, written: o.written, wmax: o.wmax, parts: have }); });
    });
  }
  function reset(lesson, parts) {
    try { localStorage.removeItem('speak:sid:' + lesson); } catch (e) {}
    return Promise.all(parts.map(function (p) { return delRec(lesson, p); }));
  }
  window.SpeakRec = { mount: mount, count: count, submit: submit, reset: reset, supported: function () { return !!(navigator.mediaDevices && window.MediaRecorder); } };
})();
