/* Тест на уровень (speakandsmile.ru/test/): отправка результата в бот школы → служебный чат MAX.
   SSPlace.send({test:'teen'|'kids'|'gi', name, klass, contact, score, max, level, rec, sections:[{label,score,max}], detail, ms})
   → Promise<boolean>. Сначала Яндекс-шлюз (работает без VPN), потом напрямую. Не отправилось — кладём в localStorage
   и досылаем при следующем открытии любой страницы теста. */
(function () {
  var SRV = ['https://d5d6o4mldv5m1nj5hvih.6brbn2wz.apigw.yandexcloud.net/nihao', 'https://nihao-bot.o-sintsova.workers.dev'];
  var KEY = 'ss_place_pending';
  function post(body) {
    var i = 0;
    function next() {
      if (i >= SRV.length) return Promise.resolve(false);
      var url = SRV[i++] + '/place/done', ctl = window.AbortController ? new AbortController() : null;
      var t = ctl ? setTimeout(function () { ctl.abort(); }, 12000) : 0;
      return fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: body, signal: ctl ? ctl.signal : undefined })
        .then(function (r) { clearTimeout(t); return r.ok ? r.json().then(function (j) { return !!(j && j.ok); }) : next(); })
        .catch(function () { clearTimeout(t); return next(); });
    }
    return next();
  }
  function pending() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function keep(list) { try { localStorage.setItem(KEY, JSON.stringify(list.slice(-5))); } catch (e) {} }
  function send(o) {
    var body = JSON.stringify(o);
    return post(body).then(function (ok) { if (!ok) { var l = pending(); l.push(body); keep(l); } return ok; });
  }
  function flush() {
    var l = pending(); if (!l.length) return;
    keep([]);
    l.forEach(function (b) { post(b).then(function (ok) { if (!ok) { var m = pending(); m.push(b); keep(m); } }); });
  }
  window.SSPlace = { send: send, flush: flush };
  try { flush(); } catch (e) {}
})();
