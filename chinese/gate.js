/* Доступ к урокам.
   0) Промо-урок (free:true в lessons.json) открыт всем; остальные уроки видны в списке, но с замком.
   1) Код семьи: у каждой семьи из группы «КИТАЙСКИЙ» в CRM свой код (вида panda-1234), сервер ss-bb сверяет
      состав группы несколько раз в день — выбыл ребёнок, код гаснет. Ссылка ?k=КОД вводит код сама.
      Код запоминается в браузере; на семью — до 3 устройств. Управление: chinese/codes/.
   2) Даты: детям — только пройденные уроки (дата открытия ≤ сегодня), учителю — всё.
   Учитель один раз открывает любую страницу с ?t=КОД — режим запоминается в браузере (код в lessons.json). */
(function(){
  const q=new URLSearchParams(location.search);
  const base=location.pathname.replace(/\/chinese\/.*$/,'/chinese/');
  const today=new Date(); today.setHours(0,0,0,0);
  const parse=d=>{const [y,m,dd]=d.split('-').map(Number); return new Date(y,m-1,dd);};
  const ls={get:k=>{try{return localStorage.getItem(k);}catch(e){return null;}},set:(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}},del:k=>{try{localStorage.removeItem(k);}catch(e){}}};

  // ── код семьи ──
  const SRV=['https://d5d6o4mldv5m1nj5hvih.6brbn2wz.apigw.yandexcloud.net','https://ss-bb.o-sintsova.workers.dev']; // российский вход первым
  const FRESH=12*3600e3, OFFLINE=14*864e5;
  if(q.has('k')){ ls.set('zhCode',q.get('k').trim()); q.delete('k'); history.replaceState(null,'',location.pathname+(q.toString()?'?'+q:'')+location.hash); }
  let dev=ls.get('zhDev'); if(!dev){ dev=Math.random().toString(36).slice(2,10)+Date.now().toString(36); ls.set('zhDev',dev); }
  // оба адреса опрашиваем разом и берём первый ответ: у кого-то режут workers.dev, у кого-то медленный Яндекс
  function ask(code){
    const one=srv=>new Promise((res,rej)=>{
      const ctl=new AbortController(); const tm=setTimeout(()=>ctl.abort(),15000);
      fetch(`${srv}/zh-check?code=${encodeURIComponent(code)}&dev=${dev}&ua=${encodeURIComponent((navigator.platform||'').slice(0,20))}`,{signal:ctl.signal,cache:'no-store'})
        .then(r=>r.json()).then(j=>{ clearTimeout(tm); j.reason==='error'?rej():res(j); }).catch(()=>{ clearTimeout(tm); rej(); });
    });
    return new Promise(done=>{ let left=SRV.length; SRV.forEach(s=>one(s).then(done,()=>{ if(--left===0) done({ok:false,reason:'net'}); })); });
  }
  const MSG={
    unknown:'Такого кода нет. Проверьте буквы и цифры — например <b>panda-1234</b>.',
    left:'Доступ закрыт: ребёнка больше нет в группе. Если это ошибка — напишите в школу.',
    blocked:'Доступ по этому коду закрыт. Напишите в школу.',
    devices:'Этот код уже открыт на 3 устройствах. Напишите в школу — сбросим, и можно будет войти.',
    net:'Нет связи с сервером. Проверьте интернет и нажмите «Войти» ещё раз.'
  };
  function screen(reason){
    return new Promise(done=>{
      const onList=location.pathname.replace(/index\.html$/,'')===base;
      const w=document.createElement('div'); w.id='zhcode';
      w.innerHTML=`<style>#zhcode{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:20px;background:radial-gradient(120% 90% at 50% 0%,#8B5FE0 0%,#6C3FC5 45%,#4A2A91 100%);font-family:"Baloo 2","Onest",system-ui,sans-serif;color:#2A2140;overflow:auto}
#zhcode .c{width:100%;max-width:400px;background:#fff;border-radius:28px;padding:30px 24px 24px;text-align:center;box-shadow:0 30px 60px -20px rgba(30,10,70,.55);animation:zhIn .45s cubic-bezier(.2,.9,.3,1.2)}
@keyframes zhIn{from{opacity:0;transform:translateY(14px) scale(.97)}}
#zhcode .h{font:700 46px/1 "Noto Sans SC","PingFang SC",sans-serif;color:#6C3FC5}
#zhcode h1{font-size:26px;line-height:1.15;margin:12px 0 6px}
#zhcode p{margin:0 0 18px;font-size:16px;line-height:1.35;color:#5B5277}
#zhcode input{width:100%;box-sizing:border-box;font:700 24px/1 "Baloo 2",system-ui,sans-serif;text-align:center;letter-spacing:.04em;padding:14px 12px;border-radius:16px;border:2px solid #E2DBF5;outline:none;color:#2A2140;text-transform:lowercase}
#zhcode input:focus{border-color:#6C3FC5;box-shadow:0 0 0 4px rgba(108,63,197,.15)}
#zhcode button{margin-top:12px;width:100%;padding:14px;border:0;border-radius:999px;background:#F5C842;color:#2A2140;font:800 19px/1 "Baloo 2",system-ui,sans-serif;cursor:pointer;transition:transform .15s}
#zhcode button:active{transform:scale(.97)} #zhcode button[disabled]{opacity:.6}
#zhcode .e{min-height:20px;margin-top:12px;font-size:15px;line-height:1.3;color:#C2364B}
#zhcode .s{margin-top:14px;font-size:14px;line-height:1.7;color:#9A8FBF}#zhcode .s a{color:#6C3FC5;font-weight:700}</style>
<form class="c"><div class="h" lang="zh">你好！</div><h1>Уроки китайского</h1>
<p>Введите код семьи из школы — один раз, дальше телефон его запомнит.</p>
<input name="k" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="panda-1234" value="${(ls.get('zhCode')||'').replace(/"/g,'')}">
<button>Войти</button><div class="e">${reason&&MSG[reason]||''}</div><div class="s">Ещё не занимаетесь? <a href="${base}start/#zapis">Хочу в группу</a><br><a href="${base}" data-x>${onList?'Закрыть':'← Ко всем урокам'}</a></div></form>`;
      document.documentElement.style.overflow='hidden';
      (document.body||document.documentElement).appendChild(w);
      const f=w.querySelector('form'), inp=f.k, btn=f.querySelector('button'), err=f.querySelector('.e');
      if(!inp.value) setTimeout(()=>inp.focus(),300);
      if(onList) w.querySelector('[data-x]').onclick=e=>{ e.preventDefault(); w.remove(); document.documentElement.style.overflow=''; };
      f.onsubmit=async ev=>{ ev.preventDefault(); const code=inp.value.trim(); if(!code){ inp.focus(); return; }
        btn.disabled=true; btn.textContent='Проверяем…'; err.textContent='';
        // учительский код в том же поле — включает режим учителя на этом устройстве
        const tc=await fetch(base+'lessons.json',{cache:'no-store'}).then(r=>r.json()).then(c=>c.teacherCode).catch(()=>null);
        if(tc && code===tc){ ls.set('zhTeacher','1'); location.reload(); return; }
        const j=await ask(code); btn.disabled=false; btn.textContent='Войти';
        if(j.ok){ ls.set('zhCode',j.code||code); ls.set('zhOk',JSON.stringify({code:j.code||code,at:Date.now()})); w.remove(); document.documentElement.style.overflow=''; done(j); }
        else { err.innerHTML=MSG[j.reason]||MSG.unknown; if(j.reason!=='net') ls.del('zhOk'); }
      };
    });
  }
  const okSave=code=>ls.set('zhOk',JSON.stringify({code,at:Date.now()}));
  async function access(){ // → {member, reason}; окно кода не показывает
    const code=ls.get('zhCode'); let ok=null; try{ ok=JSON.parse(ls.get('zhOk')||'null'); }catch(e){}
    const known=ok&&code&&ok.code===code;
    if(known && Date.now()-ok.at<FRESH){ // недавно проверяли — пускаем сразу, перепроверка тихо в фоне
      ask(code).then(j=>{ if(j.ok) okSave(code); else if(j.reason!=='net'){ ls.del('zhOk'); location.reload(); } });
      return {member:true};
    }
    if(!code) return {member:false};
    const j=await ask(code);
    if(j.ok){ okSave(code); return {member:true}; }
    if(j.reason==='net' && known && Date.now()-ok.at<OFFLINE) return {member:true};   // нет связи, но код недавно был рабочим
    if(j.reason!=='net') ls.del('zhOk');
    return {member:false, reason:j.reason};
  }

  window.ZhGate={
    ready: fetch(base+'lessons.json',{cache:'no-store'}).then(r=>r.json()).then(async cfg=>{
      if(q.has('t')){ if(q.get('t')===cfg.teacherCode){ ls.set('zhTeacher','1'); } else { ls.del('zhTeacher'); } }
      const teacher=ls.get('zhTeacher')==='1';
      const a=teacher?{member:true}:await access();
      cfg.lessons.forEach(l=>{ l.openDate=parse(l.open); l.isOpen=l.openDate<=today; });
      const lesson=id=>cfg.lessons.find(x=>x.id===id);
      const g={cfg, teacher, member:a.member, reason:a.reason, lesson,
        needCode:id=>{ const l=lesson(id); return !teacher && !g.member && !(l&&l.free); },
        isOpen:id=>{ const l=lesson(id); return !!(teacher || (l && (l.free || (g.member && l.isOpen)))); },
        askCode:()=>screen(g.reason).then(()=>{ g.member=true; g.reason=null; return g; }),
        fmt:d=>d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})};
      return g;
    }),
    lock(id){ // вызвать на странице урока: если урок ещё не пройден — показать заглушку вместо урока
      return this.ready.then(g=>{
        if(g.teacher){ const b=document.createElement('div'); b.textContent='Режим учителя'; b.style.cssText='position:fixed;left:12px;bottom:12px;z-index:99;padding:6px 12px;border-radius:999px;background:#F5C842;color:#2A2140;font:700 12px/1 "Baloo 2",system-ui,sans-serif;box-shadow:0 6px 16px rgba(0,0,0,.2)'; document.body.appendChild(b); return true; }
        if(g.isOpen(id)) return true;
        if(g.needCode(id)) return g.askCode().then(()=>this.lock(id));   // окно кода поверх урока
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
