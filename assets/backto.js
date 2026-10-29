/* «← К уроку дома» (29.10.2026): урок дома кладёт свой адрес в sessionStorage (ssBack) перед переходом в фоникс/песню;
   здесь — плавающая кнопка назад, пока вкладка пришла из урока. */
(function () {
  var u = null; try { u = sessionStorage.getItem('ssBack'); } catch (e) {}
  if (!u || !/^\/[a-z0-9]+\/home\//.test(u)) return;
  function add() {
    if (document.getElementById('ssBackBtn')) return;
    var a = document.createElement('a'); a.id = 'ssBackBtn'; a.href = u; a.textContent = '← К уроку дома';
    a.style.cssText = 'position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:99999;background:#6C3FC5;color:#fff;font:700 16px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;padding:14px 18px;border-radius:999px;text-decoration:none;box-shadow:0 6px 18px rgba(60,20,120,.35);-webkit-tap-highlight-color:transparent';
    a.onclick = function () { try { sessionStorage.removeItem('ssBack'); } catch (e) {} };
    document.body.appendChild(a);
  }
  if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
})();
