/* ss-attr (27.11.2026): метка источника (utm из ссылки партнёра или рекламы) запоминается на страницах «для школ»
   и идёт дальше по ссылкам на оплату квеста, лагеря, тренажёра (storyfire.ru) и на фониксы (speakyphonics.ru). */
(function(){var K=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'],k='ss_attr',o=null,u={};
try{var q=new URLSearchParams(location.search);K.forEach(function(n){if(q.get(n))u[n]=q.get(n).slice(0,160)})}catch(e){}
try{o=JSON.parse(localStorage.getItem(k)||'null')}catch(e){}
if(Object.keys(u).length){o={entry_path:location.pathname,at:Date.now()};for(var n in u)o[n]=u[n];try{localStorage.setItem(k,JSON.stringify(o))}catch(e){}}
if(!o||!o.utm_source)return;
var H=/^(www\.)?(storyfire\.ru|speakyphonics\.ru)$/,run=function(){[].forEach.call(document.querySelectorAll('a[href^="http"]'),function(l){try{var u=new URL(l.href);if(!H.test(u.hostname))return;var own=u.searchParams.get('utm_source');K.forEach(function(n){if(o[n])u.searchParams.set(n,o[n]);else u.searchParams.delete(n)});if(own&&own!==o.utm_source&&!o.utm_medium)u.searchParams.set('utm_medium',own);l.href=u.href}catch(e){}})};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
