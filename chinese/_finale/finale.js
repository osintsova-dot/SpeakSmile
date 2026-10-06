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
      <button class="btn" id="finStop" hidden><svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>Стоп</button></div>
    <div class="lyrics" id="finLyrics">${LINES.map((l,i)=>`<div class="line" data-i="${i}"><img src="../whats-your-name/img/wave.webp" alt=""><div><div class="zh" lang="zh">${l.zh}</div><div class="py">${l.py}</div><div class="ru">${l.ru}</div></div></div>`).join('')}</div>
    <p class="sub" style="margin:0">Нажми «Петь» — строчки подсвечиваются под музыку.</p>
  </div></section>`;
  const lyr=document.getElementById('finLyrics'), playB=document.getElementById('finPlay'), stopB=document.getElementById('finStop');
  let song=null, times=null, raf=0, cur=null;
  fetch(BASE+'song.json').then(r=>r.ok?r.json():null).then(j=>{ if(j){ times=j; song=new Audio(BASE+'song.mp3'); song.preload='auto'; } });
  const audio={}; const snd=id=>{ if(!audio[id]){ audio[id]=new Audio(BASE+'audio/'+id+'.mp3'); } return audio[id]; };
  function light(k){ [...lyr.children].forEach((el,i)=>el.classList.toggle('on',i===k)); const el=lyr.children[k]; if(el&&el.scrollIntoView) el.scrollIntoView({block:'nearest',behavior:'smooth'}); }
  function stop(){ cancelAnimationFrame(raf); if(song){ song.pause(); song.currentTime=0; } if(cur){ cur.pause(); } light(-1); playB.hidden=false; stopB.hidden=true; }
  function loop(){ if(!song||song.paused) return; const t=song.currentTime; let k=-1; times.forEach((s,i)=>{ if(t>=s) k=i; }); light(k); if(song.ended){ stop(); return; } raf=requestAnimationFrame(loop); }
  playB.onclick=()=>{ if(!song||!times){ chant(0); return; } if(cur) cur.pause(); song.currentTime=0; song.play().catch(()=>{}); playB.hidden=true; stopB.hidden=false; loop(); };
  stopB.onclick=stop;
  function chant(i){ if(i>=LINES.length){ stop(); return; } light(i); playB.hidden=true; stopB.hidden=false; const a=snd(LINES[i].id); cur=a; a.onended=()=>chant(i+1); a.play().catch(()=>chant(i+1)); }
  lyr.addEventListener('click',e=>{ const el=e.target.closest('.line'); if(!el) return; stop(); const l=LINES[+el.dataset.i]; light(+el.dataset.i); const a=snd(l.id); cur=a; a.onended=()=>light(-1); a.play().catch(()=>{}); });
})();
