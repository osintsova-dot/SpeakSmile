
// ---- слайды ----
var slides=[].slice.call(document.querySelectorAll(".slide")), cur=0;
var stories=document.getElementById("stories");
slides.forEach(function(){ stories.appendChild(document.createElement("i")); });
var tag=document.getElementById("stagetag"), prog=document.getElementById("prog");
function show(i){
  cur=Math.max(0,Math.min(slides.length-1,i));
  slides.forEach(function(s,k){s.classList.toggle("on",k===cur)});
  tag.textContent=DECK+" · "+(slides[cur].dataset.tag||"");
  prog.textContent=(cur+1)+" / "+slides.length;
  [].slice.call(stories.children).forEach(function(el,k){el.classList.toggle("done",k<=cur)});
  try{ history.replaceState(null,"","#"+(cur+1)); }catch(e){}
  stopAllTimers();
}
document.getElementById("prev").addEventListener("click",function(){show(cur-1)});
document.getElementById("next").addEventListener("click",function(){show(cur+1)});
document.addEventListener("keydown",function(e){
  if(e.key==="ArrowRight"||e.key==="PageDown"||e.key===" "){e.preventDefault();show(cur+1);}
  if(e.key==="ArrowLeft"||e.key==="PageUp"){e.preventDefault();show(cur-1);}
});
// ---- таймеры ----
var timers=[].slice.call(document.querySelectorAll(".timer"));
function fmt(s){return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")}
timers.forEach(function(el){
  var total=parseInt(el.dataset.sec,10), left=total, iv=null, lastTap=0;
  function draw(){
    el.textContent=fmt(left);
    el.classList.toggle("warn",left<=10&&left>0);
    el.classList.toggle("end",left===0);
  }
  function tick(){ if(left>0){left--;draw(); if(left===0){stop(); beep();}} }
  function start(){ if(iv)return; iv=setInterval(tick,1000); }
  function stop(){ if(iv){clearInterval(iv);iv=null;} }
  el._stop=stop;
  el.addEventListener("click",function(){
    var now=Date.now();
    if(now-lastTap<350){ stop(); left=total; draw(); lastTap=0; return; } // двойной тап — сброс
    lastTap=now;
    if(iv) stop(); else start();
  });
  draw();
});
function stopAllTimers(){ timers.forEach(function(t){ if(t._stop) t._stop(); }); }
function beep(){
  try{
    var ctx=new (window.AudioContext||window.webkitAudioContext)();
    var o=ctx.createOscillator(), g=ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value=880; g.gain.value=.15;
    o.start(); setTimeout(function(){o.stop(); ctx.close();},450);
  }catch(e){}
}
// ---- rewind: тап открывает ответ ----
[].slice.call(document.querySelectorAll(".q")).forEach(function(q){
  q.addEventListener("click",function(){q.classList.add("open")});
});
// ---- brain teaser ----
var btWord="", btEl=document.getElementById("btword");
[].slice.call(document.querySelectorAll(".btq")).forEach(function(q,i,arr){
  q.addEventListener("click",function(){
    if(q.classList.contains("open"))return;
    q.classList.add("open");
    btWord=arr.filter(function(x){return x.classList.contains("open")})
              .map(function(x){return x.querySelector(".ltr").textContent}).join("");
    if(btEl) btEl.textContent=btWord;
  });
});
// ---- лидерборд (localStorage) ----
var LBKEY=LBKEY_;
function lbLoad(){
  try{ return JSON.parse(localStorage.getItem(LBKEY)) || null; }catch(e){ return null; }
}
function lbSave(d){ try{ localStorage.setItem(LBKEY, JSON.stringify(d)); }catch(e){} }
var lbData = lbLoad() || [{n:"Crew 1",s:0},{n:"Crew 2",s:0},{n:"Crew 3",s:0}];
var lbBox=document.getElementById("lb");
if(!lbBox){ lbRender=function(){}; }
function lbRender(){
  while(lbBox.firstChild) lbBox.removeChild(lbBox.firstChild);
  lbData.forEach(function(t,i){
    var d=document.createElement("div"); d.className="team";
    var inp=document.createElement("input"); inp.value=t.n;
    inp.addEventListener("change",function(){ t.n=inp.value; lbSave(lbData); });
    var sc=document.createElement("div"); sc.className="score"; sc.textContent=t.s;
    var btns=document.createElement("div"); btns.className="btns";
    [["+1",1],["+3",3],["+5",5],["−1",-1]].forEach(function(pair){
      var b=document.createElement("button"); b.textContent=pair[0];
      if(pair[1]<0)b.className="minus";
      b.addEventListener("click",function(){ t.s=Math.max(0,t.s+pair[1]); sc.textContent=t.s; lbSave(lbData); });
      btns.appendChild(b);
    });
    d.appendChild(inp); d.appendChild(sc); d.appendChild(btns);
    lbBox.appendChild(d);
  });
}
lbRender();
// открыть сразу нужный слайд: файл.html#7 (ссылка из плана/Хаба)
var _st=parseInt((location.hash||"").replace("#",""),10);
show(isNaN(_st)?0:_st-1);
