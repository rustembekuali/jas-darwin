// Флэш карталар: 3D аудару, ұшып кету анимациясы, сүйреу (swipe), пернетақта басқаруы
const cardPool=()=>ALLQ.concat(window.GCARDS||[]);
function deck(){const d=dk(),pool=cardPool();
 if(S.deck&&S.deck.d==d&&Array.isArray(S.deck.ids)&&S.deck.ids.every(id=>pool.some(c=>c.id==id)))return S.deck;
 const due=pool.filter(c=>!S.box[c.id]||S.box[c.id].due<=dayN()).sort(()=>Math.random()-.5).slice(0,20);
 S.deck={d,ids:due.map(c=>c.id),i:0,know:0,again:0,shown:false,typing:false,mine:"",res:""};save();return S.deck}
const fcCur=()=>{const D=S.deck;return cardPool().find(x=>x.id==D.ids[D.i])};
let fcBusy=false;
function fcCardHTML(c,D){
 return `<div class="fc-stage"><div class="fc-under u2"></div><div class="fc-under u1"></div>
 <div class="fc-card fc-in ${D.shown?"flipped":""}" id="fc"><div class="fc-inner">
  <div class="fc-face fc-front"><span class="chip">✦ СҰРАҚ · ${c.topic}</span><h2 class="fc-q">${c.q}</h2>
   ${D.typing?`<form class="row fc-form" onsubmit="fcCheck(event)"><input class="search" id="ta" autocomplete="off" placeholder="Жауабыңды жаз..." style="flex:1;margin:0"><button>Тексеру</button></form>`:`<p class="fc-hint">↻ Жауабын ойла да, картаны аудар</p>`}</div>
  <div class="fc-face fc-back"><span class="chip">✔ ЖАУАП</span><h2 class="fc-a">${c.a}</h2>${D.mine?`<p class="fc-mine ${D.res}">${D.res=="ok"?"✅":"❌"} Сенің жауабың: <b>${D.mine.replace(/</g,"&lt;")}</b></p>`:""}</div></div>
  <span class="fc-tint l"></span><span class="fc-tint r"></span></div></div>`}
function fcStatsHTML(D){const total=D.ids.length;return `<div class="card stat"><b style="color:#34d399">${D.know}</b><small>Білемін</small></div><div class="card stat"><b style="color:#fb7185">${D.again}</b><small>Қайталау керек</small></div><div class="card stat"><b>${Math.max(0,total-D.i)}</b><small>Қалды</small></div>`}
function fcBtnsHTML(D){return `<button class="ghost fc-btn no" ${D.shown?"":"disabled"} onclick="fcRate(0)">↻ Қайталау керек <kbd>←</kbd></button><button class="fc-btn" ${D.shown?"":"disabled"} onclick="fcRate(1)">✓ Білемін <kbd>→</kbd></button>`}
function fcDone(D){const total=D.ids.length;return `<div class="card fc-done"><div style="font-size:64px" class="spin-in">${total?"🎉":"📭"}</div><h2>${total?"Бүгінгі карталар аяқталды!":"Қайталайтын карта жоқ"}</h2><p style="color:var(--mut)">Білемін: <b>${D.know}</b> · Қайталау керек: <b>${D.again}</b></p><p style="margin-top:8px;color:var(--mut)">Қайталау аралықтары: «Білемін» болса — 2, 4, 8 күннен кейін қайта шығады.</p></div>`}
function cardsView(){const D=deck(),total=D.ids.length,fin=!total||D.i>=D.ids.length;
 return `<small class="kick">АРАЛЫҚПЕН ҚАЙТАЛАУ</small><div class="row" style="justify-content:space-between;align-items:flex-end"><h1>Бүгінгі карталар</h1><div style="text-align:right"><b style="font:800 26px var(--f-head)" id="fcCount">${fin?total:D.i+1} / ${total}</b><br><small>карта</small></div></div>
 <div class="row" style="justify-content:space-between;margin:10px 0 12px"><button class="ghost ${D.typing?"sel":""}" onclick="fcType()">⌨️ Жазып жауап беру</button><span class="chip">⭐ 1 XP · бос орын — аудару</span></div>
 <div class="bar" style="height:10px"><i id="fcBar" style="width:${total?D.i/total*100:0}%"></i></div>
 <div class="stats" id="fcStats" style="grid-template-columns:repeat(3,1fr)">${fcStatsHTML(D)}</div>
 <div id="fcArea">${fin?fcDone(D):fcCardHTML(fcCur(),D)}</div><div class="row fc-btns" id="fcBtns" style="justify-content:center;margin-top:22px;${fin?"display:none":""}">${fcBtnsHTML(D)}</div>`}
function fcUpd(D){const t=D.ids.length;$("#fcStats").innerHTML=fcStatsHTML(D);$("#fcBar").style.width=(t?D.i/t*100:0)+"%";$("#fcCount").textContent=Math.min(D.i+1,t)+" / "+t;$("#fcBtns").innerHTML=fcBtnsHTML(D)}
window.fcFlip=()=>{const D=S.deck,el=$("#fc");if(!el||fcBusy)return;el.classList.toggle("flipped");if(!D.shown){D.shown=true;save();$("#fcBtns").innerHTML=fcBtnsHTML(D)}};
window.fcType=()=>{const D=S.deck;D.typing=!D.typing;D.mine="";D.res="";save();route()};
window.fcCheck=e=>{e.preventDefault();const D=S.deck,c=fcCur(),n=s=>s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu," ").trim(),u=n($("#ta").value),r=n(c.a);D.mine=$("#ta").value.trim();D.res=u&&(u==r||r.includes(u)&&u.length>2||u.includes(r))?"ok":"no";const f=$("#fc");f.querySelector(".fc-back").innerHTML=`<span class="chip">✔ ЖАУАП</span><h2 class="fc-a">${c.a}</h2><p class="fc-mine ${D.res}">${D.res=="ok"?"✅":"❌"} Сенің жауабың: <b>${D.mine.replace(/</g,"&lt;")}</b></p>`;fcFlip()};
window.fcRate=ok=>{const D=S.deck;if(!D.shown||fcBusy)return;const el=$("#fc");if(!el)return;fcBusy=true;
 const id=D.ids[D.i],b=S.box[id]||{n:0};
 if(ok){b.n++;b.due=dayN()+Math.pow(2,b.n);D.know++}else{b.n=0;b.due=dayN();D.again++;D.ids.push(id)}S.box[id]=b;D.i++;D.shown=false;D.mine="";D.res="";save();
 el.style.transform="";el.classList.remove("drag");el.classList.add(ok?"out-r":"out-l");fcUpd(D);if(ok)addXP(1);
 setTimeout(()=>{fcBusy=false;if(D.i>=D.ids.length){$("#fcArea").innerHTML=fcDone(D);$("#fcBtns").style.display="none";fx.burst();return}$("#fcArea").innerHTML=fcCardHTML(fcCur(),D);fcBind();const u=document.querySelector(".fc-under.u1");u&&u.animate([{transform:"translateY(-8px)"},{transform:""}],{duration:300})},430)};
function fcBind(){const el=$("#fc");if(!el)return;let sx=0,dx=0,drag=false,moved=false;
 el.onpointerdown=e=>{if(e.target.closest("input,button,form")||fcBusy)return;drag=true;moved=false;sx=e.clientX;dx=0;el.classList.add("drag");el.setPointerCapture(e.pointerId)};
 el.onpointermove=e=>{if(!drag)return;dx=e.clientX-sx;if(Math.abs(dx)>6)moved=true;el.style.transform=`translateX(${dx}px) rotate(${dx/22}deg)`;const k=Math.min(1,Math.abs(dx)/140);el.querySelector(".fc-tint.r").style.opacity=dx>0&&S.deck.shown?k:0;el.querySelector(".fc-tint.l").style.opacity=dx<0&&S.deck.shown?k:0};
 el.onpointerup=e=>{if(!drag)return;drag=false;el.classList.remove("drag");const D=S.deck;
  if(!moved){el.style.transform="";fcFlip();return}
  if(Math.abs(dx)>110){if(D.shown){fcRate(dx>0?1:0);return}toast("Алдымен картаны аудар ↻")}
  el.style.transform="";el.querySelectorAll(".fc-tint").forEach(t=>t.style.opacity=0)};
 el.onpointercancel=()=>{drag=false;el.classList.remove("drag");el.style.transform=""}}
if(!window._fcKeys){window._fcKeys=1;addEventListener("keydown",e=>{if(CUR!=="/cards"||e.target.closest&&e.target.closest("input,textarea"))return;
 if(e.key==" "||e.key=="Enter"){e.preventDefault();fcFlip()}else if(e.key=="ArrowRight")fcRate(1);else if(e.key=="ArrowLeft")fcRate(0)})}
