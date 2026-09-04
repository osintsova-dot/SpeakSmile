/* Speak & Smile — форма заявки на посадочных страницах */
(function(){
  var form = document.getElementById('leadform');
  if(!form) return;
  var btn = document.getElementById('f-btn'), msg = document.getElementById('f-msg');
  function show(text, ok){
    msg.hidden = false; msg.textContent = text;
    msg.style.background = ok ? 'rgba(16,185,129,.20)' : 'rgba(239,68,68,.20)';
    msg.style.color = ok ? '#8ff0c4' : '#ffc4c4';
  }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name  = document.getElementById('f-name').value.trim();
    var phone = document.getElementById('f-phone').value.trim();
    var age   = document.getElementById('f-age').value;
    if(!name || !phone){ show('Пожалуйста, заполните имя и телефон', false); return; }
    btn.disabled = true; btn.textContent = 'Отправляем…';
    fetch('https://ss-lead.o-sintsova.workers.dev/', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name:name, phone:phone, age:age, page: form.dataset.page || location.pathname })
    }).then(function(r){ return r.json(); }).catch(function(){ return {ok:false}; })
      .then(function(res){
        if(res && res.ok){
          show('✅ Заявка отправлена! Мы перезвоним в ближайшее время.', true);
          btn.textContent = 'Отправлено ✓';
          document.getElementById('f-name').value = '';
          document.getElementById('f-phone').value = '';
          if(window.ym && window.SS_METRIKA) ym(window.SS_METRIKA,'reachGoal','lead');
        } else {
          show('❌ Не отправилось. Позвоните нам: +7 995 124-21-12', false);
          btn.disabled = false; btn.textContent = 'Перезвоните мне';
        }
      });
  });
})();
