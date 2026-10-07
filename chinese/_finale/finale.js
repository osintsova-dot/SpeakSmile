/* Песня-прощание «谢谢，拜拜，再见» — общий блок для всех уроков (как «Thank you, take care, goodbye» в Genki).
   Подключение на странице урока: <div id="finale"></div> + <script src="../_finale/finale.js"></script> */
(function(){
  const box=document.getElementById('finale'); if(!box) return;
  const BASE=(document.currentScript&&document.currentScript.src||'').replace(/finale\.js.*$/,'')||'../_finale/';
  const LINES=[
    {id:'fin_thanks',zh:'谢谢，谢谢！',py:'Xièxie, xièxie!',ru:'Спасибо, спасибо!'},
    {id:'fin_baibai',zh:'拜拜，拜拜！',py:'Bái bái, bái bái!',ru:'Пока-пока!'},
    {id:'fin_bye',zh:'再见，再见！',py:'Zàijiàn, zàijiàn!',ru:'До свидания!'},
    {id:'fin_tmrw',zh:'明天见！',py:'Míngtiān jiàn!',ru:'До завтра!'},
    {id:'fin_chorus',zh:'谢谢！拜拜！再见！',py:'Xièxie! Bái bái! Zàijiàn!',ru:'Спасибо! Пока! До свидания!'},
    {id:'fin_chorus',zh:'谢谢！拜拜！再见！',py:'Xièxie! Bái bái! Zàijiàn!',ru:'Спасибо! Пока! До свидания!'},
    {id:'fin_bye1',zh:'再见！',py:'Zàijiàn!',ru:'До свидания!'}];
  const SPK='<span class="spk" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 4V5L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z"/></svg></span>';
  const st=document.createElement('style'); st.textContent='.finale{margin:18px 0 0}.finale .song{text-align:center}'; document.head.appendChild(st);
  box.innerHTML=`<section class="finale" aria-label="Песня-прощание"><div class="song">
    <h2>谢谢，拜拜，再见！</h2>
    <p class="sub">Песня, которой заканчивается каждый урок — как «Thank you, take care, goodbye» в Genki. Нажми на строчку — услышишь её отдельно.</p>
    <div class="controls"><button class="btn primary" id="finPlay"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>Петь</button>
      <button class="btn" id="finStage" hidden><svg viewBox="0 0 24 24"><path d="M5 5h5V3H3v7h2V5zm14 0v5h2V3h-7v2h5zM5 19v-5H3v7h7v-2H5zm14 0h-5v2h7v-7h-2v5z"/></svg>На весь экран</button>
      <button class="btn" id="finStop" hidden><svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>Стоп</button></div>
    <div class="lyrics" id="finLyrics">${LINES.map((l,i)=>`<div class="line" data-i="${i}"><img src="../whats-your-name/img/wave.webp?v=2" alt=""><div><div class="zh" lang="zh">${l.zh}</div><div class="py">${l.py}</div><div class="ru">${l.ru}</div></div></div>`).join('')}</div>
    <p class="sub" style="margin:0">Нажми «Петь» — строчки подсвечиваются под музыку.</p>
  </div></section>`;
  const lyr=document.getElementById('finLyrics'), playB=document.getElementById('finPlay'), stopB=document.getElementById('finStop');
  let song=null, times=null, raf=0, cur=null;
  fetch(BASE+'song.json').then(r=>r.ok?r.json():null).then(j=>{ if(j){ times=j; song=new Audio(BASE+'song.mp3'); song.preload='auto'; document.getElementById('finStage').hidden=false; } });
  const audio={}; const snd=id=>{ if(!audio[id]){ audio[id]=new Audio(BASE+'audio/'+id+'.mp3'); } return audio[id]; };
  function light(k){ [...lyr.children].forEach((el,i)=>el.classList.toggle('on',i===k)); const el=lyr.children[k]; if(el&&el.scrollIntoView) el.scrollIntoView({block:'nearest',behavior:'smooth'}); }
  function stop(){ cancelAnimationFrame(raf); if(song){ song.pause(); song.currentTime=0; } if(cur){ cur.pause(); } light(-1); playB.hidden=false; stopB.hidden=true; }
  function loop(){ if(!song||song.paused) return; const t=song.currentTime; let k=-1; times.forEach((s,i)=>{ if(t>=s) k=i; }); light(k); if(song.ended){ stop(); return; } raf=requestAnimationFrame(loop); }
  playB.onclick=()=>{ if(!song||!times){ chant(0); return; } if(cur) cur.pause(); song.currentTime=0; song.play().catch(()=>{}); playB.hidden=true; stopB.hidden=false; loop(); };
  stopB.onclick=stop;
  function chant(i){ if(i>=LINES.length){ stop(); return; } light(i); playB.hidden=true; stopB.hidden=false; const a=snd(LINES[i].id); cur=a; a.onended=()=>chant(i+1); a.play().catch(()=>chant(i+1)); }
  lyr.addEventListener('click',e=>{ const el=e.target.closest('.line'); if(!el) return; stop(); const l=LINES[+el.dataset.i]; light(+el.dataset.i); const a=snd(l.id); cur=a; a.onended=()=>light(-1); a.play().catch(()=>{}); });
  /* сцена «На весь экран»: белый фон, слова выскакивают, караоке по слогам, герой-клип; на припеве пляшут трое */
  const V=BASE+'../how-are-you/clips/', IMG=BASE+'../whats-your-name/img/';
  const POSE={fin_thanks:V+'thanks.mp4',fin_baibai:V+'hello.mp4',fin_bye:IMG+'../clips/wave.mp4',fin_tmrw:V+'happy.mp4',fin_bye1:IMG+'../clips/wave.mp4'};
  const SYL={fin_thanks:['Xiè','xie,','xiè','xie!'],fin_baibai:['Bái','bái,','bái','bái!'],fin_bye:['Zài','jiàn,','zài','jiàn!'],fin_tmrw:['Míng','tiān','jiàn!'],
    fin_chorus:['Xiè','xie!','Bái','bái!','Zài','jiàn!'],fin_bye1:['Zài','jiàn!']};
  const css=document.createElement('style'); css.textContent=`
  .fstage{position:fixed;inset:0;z-index:120;background:#fff;color:#2A2140;display:grid;grid-template-rows:1fr auto;overflow:hidden;cursor:pointer;font-family:"Baloo 2",system-ui,sans-serif}
  .fstage[hidden]{display:none}
  .fstage .sc{display:grid;grid-template-columns:1.1fr 1fr;align-items:center;gap:4vw;padding:5vh 6vw}
  .fstage .sc.solo{grid-template-columns:1fr;text-align:center;padding-bottom:calc(min(26vh,30vw) + 8vh)}
  .fstage .sc.solo .hero{display:none}
  .fstage .kz{font-family:"Noto Sans SC","PingFang SC",sans-serif;font-weight:900;font-size:min(13vw,24vh,calc(88vw / var(--n,6)));line-height:1.08;white-space:nowrap}
  .fstage .sc:not(.solo) .kz{font-size:min(8.5vw,20vh,calc(50vw / var(--n,6)))}
  .fstage .kz .c{display:inline-block;opacity:0;transform:scale(.3) translateY(30px);transition:color .15s}
  .fstage .kz .c.in{animation:fpop .42s cubic-bezier(.2,.9,.25,1.25) forwards}
  .fstage .kz .c.hl{color:#6C3FC5}
  .fstage .ksy{margin-top:.3em;font-family:Nunito,"Baloo 2",sans-serif;font-weight:900;font-size:min(5vw,9vh);color:#C9BCEB}
  .fstage .ksy .s{margin-right:.28em;transition:color .15s}.fstage .ksy .s.hl{color:#6C3FC5}
  .fstage .kru{font-weight:700;font-size:min(2.6vw,5vh);color:#6A5B9A;margin-top:.3em}
  .fstage .hero{justify-self:center;height:min(70vh,60vw);aspect-ratio:9/16;position:relative;border-radius:28px;overflow:hidden;opacity:0;transform:scale(.6)}
  .fstage .hero.in{animation:fin .5s cubic-bezier(.23,1,.32,1) forwards}
  .fstage .hero video,.fstage .hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .fstage .dz{position:absolute;left:0;right:0;bottom:4vh;display:flex;justify-content:center;gap:3vw;pointer-events:none;transform:translateY(calc(100% + 6vh));transition:transform .5s cubic-bezier(.23,1,.32,1)}
  .fstage .dz.in{transform:none}
  .fstage .dz video{height:min(26vh,30vw);aspect-ratio:9/16;object-fit:cover;border-radius:18px;animation:fbob .9s ease-in-out infinite alternate}
  .fstage .dz video:nth-child(2){animation-delay:.3s}.fstage .dz video:nth-child(3){animation-delay:.6s}
  .fstage .fbar{height:6px;background:#F1ECFB}.fstage .fbar i{display:block;height:100%;width:0;background:#6C3FC5}
  .fstage .fx{position:absolute;top:14px;right:14px;z-index:2;display:inline-flex;gap:6px;align-items:center;padding:10px 16px;border-radius:999px;border:0;background:#F1ECFB;color:#6C3FC5;font:800 15px "Baloo 2",sans-serif;cursor:pointer}
  .fstage.paused::after{content:"Пауза — нажми, чтобы продолжить";position:absolute;left:50%;top:18px;transform:translateX(-50%);padding:8px 16px;border-radius:999px;background:#2A2140;color:#fff;font-weight:700}
  @keyframes fpop{to{opacity:1;transform:none}} @keyframes fin{to{opacity:1;transform:none}} @keyframes fbob{to{transform:translateY(-14px) rotate(2deg)}}
  @media (max-aspect-ratio:1/1){.fstage .sc{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr);text-align:center;align-content:center;padding-top:72px}.fstage .sc.solo{grid-template-rows:auto;padding-bottom:calc(16vh + 8vh)}
    .fstage .sc:not(.solo) .kz{font-size:min(15vw,11vh,calc(90vw / var(--n,6)))}.fstage .sc.solo .kz{font-size:min(calc(90vw / var(--n,6)),14vh)}.fstage .ksy{font-size:min(8vw,6vh)}.fstage .kru{font-size:min(5vw,3.4vh)}
    .fstage .hero{height:min(42vh,80vw)}.fstage .dz video{height:16vh}}
  @media (prefers-reduced-motion:reduce){.fstage .kz .c.in,.fstage .hero.in{animation-duration:.01s}.fstage .dz video{animation:none}}`;
  document.head.appendChild(css);
  const fs=document.createElement('div'); fs.className='fstage'; fs.hidden=true;
  fs.innerHTML=`<div class="sc" id="fSc"><div><div class="kz" id="fKz" lang="zh"></div><div class="ksy" id="fSy"></div><div class="kru" id="fRu"></div></div><div class="hero" id="fHero"></div></div>
    <div class="dz" id="fDz"><video src="${V}happy.mp4" muted loop playsinline preload="none"></video><video src="${V}hello.mp4" muted loop playsinline preload="none"></video><video src="${V}good.mp4" muted loop playsinline preload="none"></video></div>
    <div class="fbar"><i id="fBar"></i></div><button class="fx" id="fExit"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>Выйти из песни</button>`;
  document.body.appendChild(fs);
  const fSc=fs.querySelector('#fSc'), fKz=fs.querySelector('#fKz'), fSy=fs.querySelector('#fSy'), fRu=fs.querySelector('#fRu'), fHero=fs.querySelector('#fHero'), fDz=fs.querySelector('#fDz'), fBar=fs.querySelector('#fBar');
  let fOn=false, fIdx=-2, fRaf=0, fT=[];
  function dancers(on){ fDz.classList.toggle('in',on); fDz.querySelectorAll('video').forEach(v=>on?v.play().catch(()=>{}):v.pause()); }
  function setLine(i){
    fIdx=i; fT.forEach(clearTimeout); fT=[];
    const l=i<0?{id:'',zh:'谢谢，拜拜，再见！',py:'',ru:'Приготовились!'}:LINES[i];
    const chorus=l.id==='fin_chorus'||i<0;
    fSc.className='sc'+(chorus?' solo':'');
    fKz.style.setProperty('--n',[...l.zh].length); fKz.innerHTML=[...l.zh].map(ch=>/[一-鿿]/.test(ch)?`<span class="c">${ch}</span>`:`<span class="c">${ch}</span>`).join('');
    const cs=[...fKz.children]; cs.forEach((c,k)=>fT.push(setTimeout(()=>c.classList.add('in'),40+k*70)));
    fSy.innerHTML=(SYL[l.id]||[]).map(x=>`<span class="s">${x}</span>`).join(''); fRu.textContent=l.ru;
    dancers(chorus);
    fHero.classList.remove('in'); fHero.innerHTML='';
    if(!chorus&&POSE[l.id]){ const src=POSE[l.id]; fHero.innerHTML=src.endsWith('.mp4')?`<video src="${src}" muted loop playsinline autoplay></video>`:`<img src="${src}" alt="">`;
      const v=fHero.querySelector('video'); if(v) v.play().catch(()=>{}); void fHero.offsetWidth; fHero.classList.add('in'); }
  }
  function karaoke(t){ if(fIdx<0) return; const st=times[fIdx], en=fIdx<times.length-1?times[fIdx+1]:st+2.2;
    const sy=[...fSy.children], cs=[...fKz.querySelectorAll('.c')].filter(c=>/[一-鿿]/.test(c.textContent));
    const per=Math.min(.55,(en-st)*.85/Math.max(sy.length,1)); const j=Math.floor((t-st)/per);
    sy.forEach((s,k)=>s.classList.toggle('hl',k<=j)); cs.forEach((c,k)=>c.classList.toggle('hl',k<=j)); }
  function fLoop(){ if(!fOn||song.paused) return; const t=song.currentTime; let k=-1; times.forEach((s,i)=>{ if(t>=s) k=i; });
    if(k!==fIdx) setLine(k); karaoke(t); fBar.style.width=(t/(song.duration||34)*100)+'%'; if(song.ended){ fClose(); return; } fRaf=requestAnimationFrame(fLoop); }
  function fOpen(){ if(!song||!times) return; stop(); fOn=true; fs.hidden=false; fs.classList.remove('paused'); document.body.style.overflow='hidden';
    if(document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{});
    fDz.querySelectorAll('video').forEach(v=>{v.preload='auto';v.load();}); setLine(-1); song.currentTime=0; song.play().catch(()=>{}); fLoop(); }
  function fClose(){ fOn=false; cancelAnimationFrame(fRaf); fT.forEach(clearTimeout); fs.hidden=true; document.body.style.overflow=''; dancers(false); fHero.innerHTML='';
    if(song){ song.pause(); song.currentTime=0; } if(document.fullscreenElement) document.exitFullscreen().catch(()=>{}); }
  document.getElementById('finStage').onclick=fOpen;
  fs.querySelector('#fExit').onclick=e=>{ e.stopPropagation(); fClose(); };
  fs.onclick=()=>{ if(!fOn) return; if(song.paused){ fs.classList.remove('paused'); song.play().catch(()=>{}); fHero.querySelectorAll('video').forEach(v=>v.play().catch(()=>{})); fLoop(); }
    else { song.pause(); fs.classList.add('paused'); fHero.querySelectorAll('video').forEach(v=>v.pause()); } };
  document.addEventListener('keydown',e=>{ if(fOn&&e.key==='Escape') fClose(); });
  document.addEventListener('fullscreenchange',()=>{ if(fOn&&!document.fullscreenElement&&!new URLSearchParams(location.search).has('rec')) fClose(); });
})();
