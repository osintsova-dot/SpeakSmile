/* «Задания» — общий блок для уроков-тем (просьба Ксении, 15.11.2026): собери фразу · что на картинке? · соедини с пиньинем.
   Данные берёт со страницы урока (WORDS, WORDS_OF, PY_SYL, img/, audio/) — своих данных нет.
   Подключение (после основного <script> урока, где объявлены WORDS/WORDS_OF/PY_SYL/play/stop):
     <script src="../tasks/tasks.js"></script>
     <script>ZhTasks.mount({words:WORDS, parts:WORDS_OF, syl:PY_SYL, play, stop, pics:['cat','dog',…]});</script>
   Блок сам добавляет вкладку «Задания» в .tabs и панель #tasks после последней панели; ссылка …/#tasks открывает его сразу. */
(function(){
  const PUNCT=/[，。！？、,.!?]/g;
  const strip=s=>s.replace(PUNCT,'').trim();
  const shuffle=a=>{const r=[...a]; for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]];} return r;};
  const isHan=ch=>/[㐀-鿿]/.test(ch);
  const el=(tag,cls,txt)=>{const e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e;};

  const CSS=`
.zt{background:#fff;color:var(--ink,#2A2140);border-radius:28px;padding:20px 16px 22px;box-shadow:0 14px 30px rgba(30,10,70,.30);text-align:center;animation:pop .6s var(--ease,ease) both}
.zt h2{margin:0 0 4px;font-size:22px}
.zt .zt-sub{margin:0 0 14px;color:var(--muted,#6A5B9A);font-weight:600;font-size:14px}
.zt-pick{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 16px}
.zt-pick button{appearance:none;border:2px solid #E6DEFB;background:#FBF9FF;color:var(--ink,#2A2140);font:inherit;font-weight:800;font-size:14px;line-height:1.15;
  border-radius:18px;padding:10px 6px;min-height:76px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
  transition:transform .15s var(--ease,ease),border-color .15s,background .15s}
.zt-pick button .g{font-family:var(--zh,sans-serif);font-weight:900;font-size:24px;color:var(--p,#6C3FC5);line-height:1}
.zt-pick button[aria-pressed="true"]{border-color:var(--p,#6C3FC5);background:#fff;box-shadow:0 6px 16px rgba(108,63,197,.18)}
.zt-pick button:active{transform:scale(.97)}
.zt-pick button .st{font-size:12px;color:#B48A00;min-height:14px}
.zt-pick button[hidden]{display:none}
.zt-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 10px}
.zt-dots{display:flex;gap:5px;flex-wrap:wrap}
.zt-dots i{width:10px;height:10px;border-radius:50%;background:#E6DEFB}
.zt-dots i.ok{background:var(--teal,#34D3C0)} .zt-dots i.meh{background:var(--honey,#F5C842)} .zt-dots i.now{background:var(--p,#6C3FC5);transform:scale(1.2)}
.zt-mini{appearance:none;border:0;background:#F3EEFF;color:var(--p,#6C3FC5);font:inherit;font-weight:800;font-size:13px;border-radius:999px;padding:0 14px;min-height:44px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}
.zt-mini svg{width:16px;height:16px;fill:currentColor}
.zt-q{display:flex;align-items:center;justify-content:center;gap:12px;margin:4px 0 12px;text-align:left}
.zt-q img{width:64px;height:80px;object-fit:cover;border-radius:14px;background:#F3EEFF;flex:none}
.zt-q .ru{font-weight:800;font-size:19px;line-height:1.2}
.zt-h{font-weight:700;font-size:13px;color:var(--muted,#6A5B9A);text-align:right}
.zt-q .hint{font-weight:600;font-size:13px;color:var(--muted,#6A5B9A)}
.zt-slots{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;min-height:72px;padding:10px;border-radius:20px;background:#FBF9FF;border:2px dashed #C9B8F5;margin:0 0 14px;transition:background .25s,border-color .25s}
.zt-slots.done{background:#E9FBF8;border-color:var(--teal,#34D3C0);border-style:solid}
.zt-slot{min-width:56px;min-height:52px;border-radius:14px;border:2px dashed #DCD0F7}
.zt-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}
.zt-tile{appearance:none;border:0;font:inherit;cursor:pointer;background:#fff;color:var(--ink,#2A2140);border-radius:16px;padding:8px 14px;min-width:56px;min-height:56px;
  display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:0;box-shadow:0 0 0 2px #E6DEFB inset,0 4px 0 #E6DEFB;transition:transform .15s var(--ease,ease),opacity .2s}
.zt-tile .zh{font-family:var(--zh,sans-serif);font-weight:900;font-size:26px;line-height:1.15}
.zt-tile .py{font-weight:800;font-size:13px;color:var(--p,#6C3FC5)}
.zt.nopy .zt-tile .py{display:none}
.zt-tile:active{transform:scale(.95)}
.zt-tile.used{visibility:hidden}
.zt-tile.off{opacity:.35;box-shadow:0 0 0 2px #E6DEFB inset}
.zt-tile.in{box-shadow:0 0 0 2px var(--p,#6C3FC5) inset;animation:zt-pop .3s var(--ease,ease)}
.zt-slots.done .zt-tile.in{box-shadow:0 0 0 2px var(--teal,#34D3C0) inset}
.zt-tile.bad,.zt-opt.bad,.zt-m.bad{animation:zt-shake .38s ease;box-shadow:0 0 0 2px var(--red,#F26B6B) inset}
@keyframes zt-shake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes zt-pop{50%{transform:scale(1.08)}}
.zt-fb{min-height:24px;font-weight:800;font-size:16px;color:var(--p,#6C3FC5);margin:12px 0 0}
.zt-fb .py{display:block;font-weight:800;font-size:15px;color:var(--muted,#6A5B9A)}
.zt-next{margin-top:12px}
.zt-pic{width:min(240px,62vw);aspect-ratio:4/5;object-fit:cover;border-radius:22px;background:#F3EEFF;display:block;margin:0 auto 14px;box-shadow:0 8px 20px rgba(30,10,70,.14)}
.zt-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:420px){.zt-opts{grid-template-columns:1fr}}
.zt-opt,.zt-m{appearance:none;border:0;font:inherit;cursor:pointer;background:#fff;color:var(--ink,#2A2140);border-radius:18px;padding:10px 12px;min-height:60px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 0 0 2px #E6DEFB inset,0 4px 0 #E6DEFB;transition:transform .15s var(--ease,ease),opacity .2s}
.zt-opt .zh,.zt-m .zh{font-family:var(--zh,sans-serif);font-weight:900;font-size:22px;line-height:1.2}
.zt-opt .py{font-weight:800;font-size:14px;color:var(--p,#6C3FC5)}
.zt-opt:active,.zt-m:active{transform:scale(.97)}
.zt-opt.right,.zt-m.right{box-shadow:0 0 0 3px var(--teal,#34D3C0) inset;background:#E9FBF8}
.zt-opt.off{opacity:.4;pointer-events:none}
.zt-m .zh{font-size:clamp(17px,4.8vw,22px)}
.zt-cols{display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;align-items:stretch}
.zt-col{display:flex;flex-direction:column;gap:10px}
.zt-m .pyt{font-family:"Nunito","Baloo 2",system-ui,sans-serif;font-weight:800;font-size:15px;line-height:1.25;color:var(--p,#6C3FC5)}
.zt-m.sel{box-shadow:0 0 0 3px var(--honey,#F5C842) inset;background:#FFFAE6}
.zt-m.right{pointer-events:none}
.zt-end{padding:8px 0 4px}
.zt-end .big{font-family:var(--zh,sans-serif);font-weight:900;font-size:56px;color:var(--p,#6C3FC5);line-height:1}
.zt-end p{font-weight:700;color:var(--muted,#6A5B9A);margin:8px 0 14px}
.zt-end .acts{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.zt-empty{color:var(--muted,#6A5B9A);font-weight:700;padding:24px 8px}
.zt .btn{min-height:48px}
@media(prefers-reduced-motion:reduce){.zt-tile,.zt-opt,.zt-m{transition:none}}`;

  const SPK='<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 4V5L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg>';

  function mount(o){
    const words=o.words||[], parts=o.parts||{}, syl=o.syl||{};
    const play=o.play||(()=>{}), stopPage=o.stop||(()=>{});
    const img=o.img||(id=>`img/${id}.webp?v=5`);
    const N=o.rounds||6;
    const byId=Object.fromEntries(words.map(w=>[w.id,w]));

    const st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);

    // вкладка + панель
    const tabs=document.querySelector('.tabs');
    const tab=el('button','tab','Задания'); tab.setAttribute('role','tab'); tab.setAttribute('aria-selected','false'); tab.dataset.tab='tasks';
    if(tabs) tabs.appendChild(tab);
    let sec=document.getElementById('tasks');
    if(!sec){ sec=el('section'); sec.id='tasks'; sec.setAttribute('role','tabpanel'); sec.hidden=true;
      const panels=document.querySelectorAll('[role="tabpanel"]'); const last=panels[panels.length-1];
      last?last.after(sec):document.body.appendChild(sec); }
    const box=el('div','zt'); sec.appendChild(box);
    box.appendChild(el('h2',null,'Задания'));
    box.appendChild(el('p','zt-sub','Выбери задание. Ошибаться можно — пробуй ещё раз!'));
    const pick=el('div','zt-pick'); box.appendChild(pick);
    const body=el('div'); box.appendChild(body);

    const KINDS=[
      {k:'build', g:'拼', t:'Собери фразу'},
      {k:'pic',   g:'图', t:'Что на картинке?'},
      {k:'match', g:'连', t:'Соедини с пиньинем'}];
    const best={};
    const pickBtns={};
    KINDS.forEach(K=>{ const b=el('button'); b.type='button'; b.setAttribute('aria-pressed','false');
      b.append(el('span','g',K.g), el('span',null,K.t), el('span','st',''));
      b.lang='ru'; b.querySelector('.g').lang='zh';
      b.onclick=()=>start(K.k); pick.appendChild(b); pickBtns[K.k]=b; });

    function show(){ document.querySelectorAll('.tab').forEach(t=>t.setAttribute('aria-selected',String(t===tab)));
      document.querySelectorAll('[role="tabpanel"]').forEach(p=>p.hidden=(p!==sec)); stopPage(); if(!cur) start('build'); }
    tab.addEventListener('click',show);
    document.addEventListener('click',e=>{ const t=e.target.closest&&e.target.closest('.tab'); if(t&&t!==tab){ sec.hidden=true; tab.setAttribute('aria-selected','false'); } });

    let cur=null;
    function start(k){ cur=k; Object.entries(pickBtns).forEach(([kk,b])=>b.setAttribute('aria-pressed',String(kk===k)));
      body.innerHTML=''; ({build,pic,match})[k](); }
    function mark(k,ok,total){ best[k]=Math.max(best[k]||0,ok); pickBtns[k].querySelector('.st').textContent=`★ ${best[k]} из ${total}`; }
    function dotsRow(n){ const d=el('div','zt-dots'); for(let i=0;i<n;i++) d.appendChild(el('i')); return d; }
    function setDots(d,i,res){ [...d.children].forEach((x,k)=>{ x.className=res[k]||(k===i?'now':''); }); }
    function finish(k,ok,total,again){
      mark(k,ok,total); body.innerHTML='';
      const e=el('div','zt-end'); e.appendChild(el('div','big',ok===total?'太棒了！':ok>=total/2?'很好！':'加油！'));
      e.appendChild(el('p',null,`С первого раза: ${ok} из ${total}. ${ok===total?'Супер!':'Попробуй ещё раз — получится лучше!'}`));
      const acts=el('div','acts'); const a=el('button','btn','Ещё раз'); a.onclick=again; acts.appendChild(a);
      const nx=KINDS[(KINDS.findIndex(K=>K.k===k)+1)%KINDS.length]; if(!pickBtns[nx.k].hidden){ const b=el('button','btn ghost',`Дальше: ${nx.t}`); b.style.cssText='color:var(--p);border-color:#E6DEFB;background:#F3EEFF'; b.onclick=()=>start(nx.k); acts.appendChild(b); }
      e.appendChild(acts); body.appendChild(e); }
    function fb(){ const f=el('div','zt-fb'); f.setAttribute('aria-live','polite'); return f; }
    function nextBtn(cb,last){ const b=el('button','btn primary zt-next',last?'Итог':'Дальше →'); b.onclick=cb; return b; }

    /* ── 1. собери фразу: кусочки WORDS_OF, тапать по порядку ── */
    function chunksOf(w){ const ps=parts[w.id]||[w.zh]; const sy=syl[w.id]||[]; let k=0;
      return ps.map(p=>{ const n=[...p].filter(isHan).length; const py=sy.slice(k,k+n).join(' ').replace(PUNCT,'').toLowerCase(); k+=n; return {zh:strip(p),py}; }); }
    const buildPool=words.filter(w=>(parts[w.id]||[]).length>=2);
    function build(){
      if(buildPool.length<2){ body.appendChild(el('div','zt-empty','В этом уроке пока нет фраз для сборки.')); return; }
      const qs=shuffle(buildPool).slice(0,Math.min(N,buildPool.length)); const res=[]; let i=0, ok=0, mistakes=0;
      const top=el('div','zt-top'); const dots=dotsRow(qs.length); const pyBtn=el('button','zt-mini',box.classList.contains('nopy')?'Пиньинь: выкл':'Пиньинь: вкл');
      pyBtn.onclick=()=>{ box.classList.toggle('nopy'); pyBtn.textContent=box.classList.contains('nopy')?'Пиньинь: выкл':'Пиньинь: вкл'; };
      top.append(dots,pyBtn); body.appendChild(top);
      const area=el('div'); body.appendChild(area);
      function round(){
        area.innerHTML=''; mistakes=0; setDots(dots,i,res); const w=qs[i]; const ch=chunksOf(w);
        const q=el('div','zt-q'); const im=new Image(); im.alt=''; im.src=img(w.id); q.appendChild(im);
        const t=el('div'); t.append(el('div','ru',w.ru), el('div','hint','Нажимай кусочки по порядку'));
        const lis=el('button','zt-mini'); lis.innerHTML=SPK+'Послушать'; lis.onclick=()=>play(w.id); t.appendChild(lis); q.appendChild(t); area.appendChild(q);
        const slots=el('div','zt-slots'); ch.forEach(()=>slots.appendChild(el('span','zt-slot'))); area.appendChild(slots);
        // один лишний кусочек из другой фразы — чтобы не собиралось «само»
        const own=new Set(ch.map(c=>c.zh)); const others=buildPool.filter(x=>x.id!==w.id).flatMap(chunksOf).filter(c=>!own.has(c.zh)&&c.zh);
        const tiles=[...ch.map((c,k)=>({...c,k}))]; if(ch.length>=3&&others.length) tiles.push({...others[Math.floor(Math.random()*others.length)],k:-1});
        let order=shuffle(tiles); for(let n=0;n<5&&order.every((x,k)=>x.k===k);n++) order=shuffle(tiles);
        const bank=el('div','zt-bank'); area.appendChild(bank); const f=fb(); area.appendChild(f);
        let pos=0;
        order.forEach(c=>{ const b=el('button','zt-tile'); b.type='button'; const z=el('span','zh',c.zh); z.lang='zh'; b.append(z,el('span','py',c.py));
          b.onclick=()=>{ if(pos>=ch.length) return;
            if(c.zh===ch[pos].zh){ const slot=slots.children[pos]; const nb=b.cloneNode(true); nb.className='zt-tile in'; nb.onclick=null; slot.replaceWith(nb); b.classList.add('used'); b.disabled=true; pos++;
              if(pos===ch.length){ slots.classList.add('done'); const first=mistakes===0; if(first) ok++; res[i]=first?'ok':'meh'; setDots(dots,-1,res);
                f.textContent=''; f.append(document.createTextNode(first?'对了！Верно с первого раза!':'对了！Собрано!')); const p=el('span','py',w.py); f.appendChild(p);
                play(w.id); bank.querySelectorAll('.zt-tile:not(.used)').forEach(x=>{ x.disabled=true; x.classList.remove('bad'); x.classList.add('off'); });
                const last=i===qs.length-1; area.appendChild(nextBtn(()=>{ if(last) finish('build',ok,qs.length,()=>start('build')); else { i++; round(); } },last)); } }
            else { mistakes++; b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad'); setTimeout(()=>b.classList.remove('bad'),420); f.textContent='Не тот кусочек — подумай, что идёт дальше.'; } };
          bank.appendChild(b); });
      }
      round();
    }

    /* ── 2. что на картинке: картинка → 4 варианта (фраза + пиньинь) ── */
    const picPool=(o.pics||[]).map(id=>byId[id]).filter(Boolean);
    let picOk=null; // id → src (картинка или заглушка), проверяем один раз
    function probe(cb){ if(picOk) return cb(); const out={}; let left=picPool.length; if(!left){ picOk=out; return cb(); }
      picPool.forEach(w=>{ const im=new Image(); im.onload=()=>{ out[w.id]=img(w.id); if(--left===0){picOk=out;cb();} };
        im.onerror=()=>{ if(o.placeholder) out[w.id]=o.placeholder(w.id); if(--left===0){picOk=out;cb();} }; im.src=img(w.id); }); }
    function pic(){
      body.appendChild(el('div','zt-empty','Загружаю картинки…'));
      probe(()=>{ if(cur!=='pic') return; body.innerHTML='';
        const pool=picPool.filter(w=>picOk[w.id]);
        if(pool.length<4){ body.appendChild(el('div','zt-empty','Картинки к этому заданию скоро появятся.')); return; }
        const qs=shuffle(pool).slice(0,Math.min(N,pool.length)); const res=[]; let i=0, ok=0;
        const top=el('div','zt-top'); const dots=dotsRow(qs.length); top.appendChild(dots); top.appendChild(el('span','zt-h','Что на картинке? Выбери фразу')); body.appendChild(top);
        const area=el('div'); body.appendChild(area);
        function round(){ area.innerHTML=''; setDots(dots,i,res); const w=qs[i]; let miss=0;
          const im=new Image(); im.className='zt-pic'; im.alt='Картинка-загадка'; im.src=picOk[w.id]; area.appendChild(im);
          const opts=shuffle([w,...shuffle(pool.filter(x=>x.id!==w.id)).slice(0,3)]);
          const g=el('div','zt-opts'); area.appendChild(g); const f=fb(); area.appendChild(f);
          opts.forEach(x=>{ const b=el('button','zt-opt'); b.type='button'; const z=el('span','zh',x.zh); z.lang='zh'; b.append(z,el('span','py',x.py));
            b.onclick=()=>{ if(x.id===w.id){ b.classList.add('right'); g.querySelectorAll('.zt-opt').forEach(y=>{ if(y!==b) y.classList.add('off'); });
                if(!miss) ok++; res[i]=miss?'meh':'ok'; setDots(dots,-1,res); f.textContent=(miss?'对了！':'对了！С первого раза!')+' '+w.ru; play(w.id);
                const last=i===qs.length-1; area.appendChild(nextBtn(()=>{ if(last) finish('pic',ok,qs.length,()=>start('pic')); else { i++; round(); } },last)); }
              else { miss++; b.classList.add('bad'); setTimeout(()=>{ b.classList.remove('bad'); b.classList.add('off'); },400); f.textContent='Нет, это «'+x.ru.replace(/[.!?]$/,'')+'». Ещё раз!'; } };
            g.appendChild(b); });
        }
        round();
      });
    }

    /* ── 3. соедини иероглифы и пиньинь: 5 пар, тап слева + тап справа ── */
    const matchPool=words.filter(w=>[...w.zh].filter(isHan).length<=7);
    function match(){
      const rounds=2, per=Math.min(5,matchPool.length); if(per<3){ body.appendChild(el('div','zt-empty','Мало слов для этого задания.')); return; }
      let r=0, ok=0, total=0;
      const top=el('div','zt-top'); const dots=dotsRow(rounds); top.appendChild(dots); top.appendChild(el('span','zt-h','Нажми иероглифы, потом их пиньинь')); body.appendChild(top);
      const area=el('div'); body.appendChild(area);
      const res=[];
      function round(){ area.innerHTML=''; setDots(dots,r,res);
        const set=[]; const seen=new Set(); for(const w of shuffle(matchPool)){ if(seen.has(w.py)) continue; seen.add(w.py); set.push(w); if(set.length===per) break; }
        const cols=el('div','zt-cols'); const L=el('div','zt-col'), R=el('div','zt-col'); cols.append(L,R); area.appendChild(cols); const f=fb(); area.appendChild(f);
        let sel=null, done=0, miss=0;
        const mk=(w,side)=>{ const b=el('button','zt-m'); b.type='button'; b.dataset.id=w.id; b.dataset.side=side;
          if(side==='L'){ const z=el('span','zh',w.zh); z.lang='zh'; b.appendChild(z); } else b.appendChild(el('span','pyt',w.py));
          b.onclick=()=>{ if(b.classList.contains('right')) return;
            if(!sel||sel.dataset.side===side){ if(sel) sel.classList.remove('sel'); sel=(sel===b)?null:b; if(sel) sel.classList.add('sel'); if(side==='L'&&sel) play(w.id); return; }
            const a=sel; sel=null; a.classList.remove('sel');
            if(a.dataset.id===b.dataset.id){ a.classList.add('right'); b.classList.add('right'); done++; play(w.id); f.textContent='对了！ '+w.ru;
              if(done===set.length){ total+=set.length; ok+=Math.max(0,set.length-miss); res[r]=miss?'meh':'ok'; setDots(dots,-1,res);
                const last=r===rounds-1; area.appendChild(nextBtn(()=>{ if(last) finish('match',ok,total,()=>start('match')); else { r++; round(); } },last)); } }
            else { miss++; [a,b].forEach(x=>{ x.classList.remove('bad'); void x.offsetWidth; x.classList.add('bad'); setTimeout(()=>x.classList.remove('bad'),420); }); f.textContent='Не пара — попробуй другую.'; } };
          return b; };
        shuffle(set).forEach(w=>L.appendChild(mk(w,'L'))); shuffle(set).forEach(w=>R.appendChild(mk(w,'R')));
      }
      round();
    }
    // картинки слов «на картинке» нет и заглушки тоже — прячем это задание заранее
    if(!picPool.length) pickBtns.pic.hidden=true;
    if(location.hash==='#tasks') show();
    window.ZhTasks.ready=true;
  }
  window.ZhTasks={mount};
})();
