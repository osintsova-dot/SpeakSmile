/* Доступ к урокам: детям — только пройденные (дата открытия ≤ сегодня), учителю — всё.
   Учитель один раз открывает любую страницу с ?t=КОД — режим запоминается в браузере.
   Список уроков и код — в chinese/lessons.json. */
(function(){
  const q=new URLSearchParams(location.search);
  const base=location.pathname.replace(/\/chinese\/.*$/,'/chinese/');
  const today=new Date(); today.setHours(0,0,0,0);
  const parse=d=>{const [y,m,dd]=d.split('-').map(Number); return new Date(y,m-1,dd);};
  window.ZhGate={
    ready: fetch(base+'lessons.json',{cache:'no-store'}).then(r=>r.json()).then(cfg=>{
      if(q.has('t')){ if(q.get('t')===cfg.teacherCode){ try{localStorage.setItem('zhTeacher','1');}catch(e){} } else { try{localStorage.removeItem('zhTeacher');}catch(e){} } }
      let teacher=false; try{ teacher=localStorage.getItem('zhTeacher')==='1'; }catch(e){}
      cfg.lessons.forEach(l=>{ l.openDate=parse(l.open); l.isOpen=l.openDate<=today; });
      return {cfg, teacher, isOpen:id=>{ const l=cfg.lessons.find(x=>x.id===id); return !!(teacher || (l && l.isOpen)); }, lesson:id=>cfg.lessons.find(x=>x.id===id), fmt:d=>d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})};
    }),
    lock(id){ // вызвать на странице урока: если урок ещё не пройден — показать заглушку вместо урока
      return this.ready.then(g=>{
        if(g.teacher){ const b=document.createElement('div'); b.textContent='Режим учителя'; b.style.cssText='position:fixed;left:12px;bottom:12px;z-index:99;padding:6px 12px;border-radius:999px;background:#F5C842;color:#2A2140;font:700 12px/1 "Baloo 2",system-ui,sans-serif;box-shadow:0 6px 16px rgba(0,0,0,.2)'; document.body.appendChild(b); return true; }
        if(g.isOpen(id)) return true;
        const l=g.lesson(id); const when=l?g.fmt(l.openDate):'';
        document.body.innerHTML=`<div style="min-height:100vh;display:grid;place-items:center;padding:24px;text-align:center;font-family:'Baloo 2',system-ui,sans-serif;color:#fff">
          <div style="max-width:420px"><svg viewBox="0 0 24 24" width="72" height="72" style="fill:#F5C842"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 7a1.5 1.5 0 0 1 .75 2.8V18h-1.5v-1.2A1.5 1.5 0 0 1 12 14z"/></svg>
          <h1 style="font-size:28px;margin:12px 0 6px">Этот урок откроется после занятия</h1>
          <p style="font-size:16px;opacity:.9;margin:0 0 20px">${l?`«${l.zh} · ${l.ru}» — ${when}. `:''}Сначала разберём его с учителем, потом можно повторять дома.</p>
          <a href="${base}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#F5C842;color:#2A2140;font-weight:800;text-decoration:none">К списку уроков</a></div></div>`;
        return false;
      });
    }
  };
})();
