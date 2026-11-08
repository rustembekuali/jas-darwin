const $=s=>document.querySelector(s), T=window.TOPICS;
const S=Object.assign({xp:0,done:{},best:{},seen:0,streak:0,last:"",theme:"dark",known:{},name:"",cls:"",days:{},tasks:[],box:{},deck:null,plan:[],steps:{}},(()=>{try{return JSON.parse(localStorage.getItem("jd")||"{}")}catch(e){return{}}})());
const save=()=>{try{localStorage.setItem("jd",JSON.stringify(S))}catch(e){}};
let CUR="/";window.go=p=>{CUR=p;route()};
document.addEventListener("click",e=>{const l=e.target.closest('a[href^="#/"]');if(l){e.preventDefault();go(l.getAttribute("href").slice(1))}});
const lvl=()=>Math.floor(S.xp/100)+1;
const NAV=[["/","🏠","Басты"],["/dash","📊","Дашборд"],["/atlas","🖼️","Атлас"],["/lab","🧬","ДНҚ лаб"],["/quiz","🎯","ҰБТ"],["/cards","🃏","Карталар"],["/profile","🏆","Профиль"]];
const TITLES=["Бақылаушы","Зерттеуші","Натуралист","Зертханашы","Ғалым","Дарвин"];
const title=()=>TITLES[Math.min(lvl()-1,TITLES.length-1)];
const dk=d=>(d||new Date()).toDateString();
const todayXP=()=>S.days[dk()]||0;
const BADGES=[["🌱","Бастаушы",()=>S.xp>=10],["📘","5 сабақ",()=>doneSecs()>=5],["🎓","Барлық тақырып",()=>Object.keys(S.done).length>=T.length],["💯","Тест 100%",()=>Object.values(S.best).some(v=>v>=100)],["⭐","6 жұлдыз",()=>Object.values(S.stars||{}).reduce((x,y)=>x+y,0)>=6],["🎓","ҰБТ нұсқасы",()=>(S.ubt||[]).length>=1],["🔥","3 күн қатар",()=>S.streak>=3],["⚡","500 XP",()=>S.xp>=500]];
function toast(m){const t=document.createElement("div");t.className="toast";t.textContent=m;document.body.append(t);setTimeout(()=>t.remove(),2200)}
function addXP(n){const b=BADGES.filter(x=>x[2]()).length,L0=lvl();S.xp+=n;S.days[dk()]=todayXP()+n;save();toast("+"+n+" XP ✨");BADGES.filter(x=>x[2]()).length>b&&setTimeout(()=>toast("🏅 Жаңа жетістік!"),2300);if(lvl()>L0&&window.fx)setTimeout(()=>fx.levelUp(),600);chrome()}
(function streak(){const d=new Date().toDateString();if(S.last!==d){const y=new Date(Date.now()-864e5).toDateString();S.streak=S.last===y?S.streak+1:1;S.last=d;save()}})();
document.documentElement.dataset.t=S.theme;
$("#theme").onclick=()=>{S.theme=S.theme=="dark"?"light":"dark";document.documentElement.dataset.t=S.theme;save()};
function chrome(){
 const h=CUR;
 const mk=(c)=>NAV.map(n=>`<a href="#${n[0]}" class="${h==n[0]||(n[0]!="/"&&h.startsWith(n[0]))?"on":""}">${c?`<span class="ni">${n[1]}</span><span class="nl">${n[2]}</span>`:`<span class="ni">${n[1]}</span><span class="nl">${n[2]}</span>`}</a>`).join("");
 $("#nav").innerHTML=mk(0);$("#tabbar").innerHTML=mk(1);
 $("#mechip").innerHTML=`<b>${(S.name||"Д")[0].toUpperCase()}</b>${S.name||""}`;$("#topxp").textContent="⭐ "+S.xp+" XP · 🔥 "+S.streak;
}
const DNA=()=>{let s='<svg viewBox="0 0 200 250" class="dna">';for(let i=0;i<11;i++){const y=22+i*20,d="-"+(i*.35).toFixed(2)+"s";s+=`<line y1="${y}" y2="${y}" stroke="#ffffff55" stroke-width="3"><animate attributeName="x1" values="45;155;45" dur="4s" begin="${d}" repeatCount="indefinite"/><animate attributeName="x2" values="155;45;155" dur="4s" begin="${d}" repeatCount="indefinite"/></line><circle cy="${y}" r="9" fill="#bef264"><animate attributeName="cx" values="45;155;45" dur="4s" begin="${d}" repeatCount="indefinite"/><animate attributeName="r" values="6;11;6" dur="4s" begin="${d}" repeatCount="indefinite"/></circle><circle cy="${y}" r="9" fill="#22d3ee"><animate attributeName="cx" values="155;45;155" dur="4s" begin="${d}" repeatCount="indefinite"/><animate attributeName="r" values="11;6;11" dur="4s" begin="${d}" repeatCount="indefinite"/></circle>`}return s+"</svg>"};
const R={
"/":()=>{const f=FACTS[new Date().getDate()%FACTS.length],d=Object.keys(S.done).length,nx=nextStep(),tx=todayXP();
 const st=[["Бір сабақ өт",!!S.steps[dk()+"a"]],["Сынақ не жаттығу шеш",!!S.steps[dk()+"b"]],["ҰБТ нұсқасын тапсыр",!!S.steps[dk()+"c"]]];
 const wd=["Дс","Сс","Ср","Бс","Жм","Сб","Жс"],now=new Date(),mon=new Date(now-((now.getDay()+6)%7)*864e5);
 const dots=wd.map((w,i)=>{const x=new Date(+mon+i*864e5);return `<div class="${(S.days[dk(x)]||0)>=100?"on":""}"><i>${(S.days[dk(x)]||0)>=100?"🌱":""}</i>${w}</div>`}).join("");
 return `<div class="hero2"><div><span class="chip">🗓 ${["Жексенбі","Дүйсенбі","Сейсенбі","Сәрсенбі","Бейсенбі","Жұма","Сенбі"][now.getDay()]}, ${now.getDate()} ${["қаңтар","ақпан","наурыз","сәуір","мамыр","маусым","шілде","тамыз","қыркүйек","қазан","қараша","желтоқсан"][now.getMonth()]}</span><h1 style="margin-top:16px">Сәлем,<br><em>${S.name||"Дарвин"}!</em></h1>
 <div class="lvlcard"><small class="k">${lvl()}-ДЕҢГЕЙ</small><h2 style="margin:2px 0">${title()}</h2><div class="bar"><i style="width:${S.xp%100}%"></i></div><small>${S.xp%100} / 100 XP · келесі атақ: <b>${TITLES[Math.min(lvl(),TITLES.length-1)]}</b></small></div>
 <div class="row"><a class="cta" href="#${nx.url}">▶ ${doneSecs()?"Жалғастыру":"Оқуды бастау"}</a><span class="chip">§ ${nx.label}</span><span class="chip">${doneSecs()}/${totalSecs} сабақ</span><span class="chip">🔥 ${S.streak} күн қатар</span></div></div><div class="mascot"><div class="lens"><i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i>${DNA()}</div><span class="tag">🐢 Галапагос</span></div></div>
 <div class="cols"><div class="card"><small class="k" style="color:var(--cor);font-weight:800">БҮГІНГІ ЖОЛ</small><h2 style="margin:4px 0">Бүгінгі 3 қадам</h2><ul class="steps">${st.map((s,i)=>`<li><span class="n ${s[1]?"d":""}">${s[1]?"✓":i+1}</span>${s[0]}</li>`).join("")}</ul></div>
 <div class="card"><small style="color:var(--cor);font-weight:800">КӨШЕТІҢ</small><div style="font-size:46px;float:right;margin-top:-6px">${tx>=100?"🌳":tx>=60?"🌿":tx>=20?"🌱":"🌰"}</div><h2 style="margin:4px 0">${Math.min(tx,100)} / 100 XP</h2><small>${tx>=100?"Көшет өсті! 🌳":"Тағы "+(100-tx)+" XP — көшетті суар 💧"}</small><div class="days">${dots}</div></div>
 <div class="card dark"><small>КЕЛЕСІ ҚАДАМ</small><h2 style="margin:8px 0;font-size:20px">${nx.t.icon} ${nx.t.title}</h2><p style="font-size:14px;opacity:.8;margin-bottom:14px">${nx.label}</p><a href="#${nx.url}">Бастау ▶</a></div></div>
 ${miniBoard()}
 <div class="card" style="margin-top:18px"><small>💡 Күннің фактісі</small><p style="margin-top:6px;font-size:18px">${f}</p></div>`},
"/plan":()=>planView(),
"/leaders":()=>leaders(),
"/lessons":()=>`<div class="row" style="justify-content:space-between"><div><h1>Оқулық</h1><small>Тақырыпты таңда</small></div><a class="link" href="#/glossary">📖 Термин сөздігі →</a></div><div class="grid" style="margin-top:16px">${T.map(card).join("")}</div>`,
"/quiz":()=>`<h1>Тест</h1><small>Біліміңді тексер</small><a class="card" href="#/quiz/mix" style="display:block;margin:16px 0;background:#0f2a24;color:#fff"><b>🎓 ҰБТ режимі</b><br><small style="color:#5eead4">Барлық тақырыптан аралас сұрақтар</small></a><div class="grid">${T.map(t=>`<a class="card" href="#/quiz/${t.id}"><div class="ico" style="background:${t.color}22">${t.icon}</div><b>${t.title}</b><br><small>Үздік: ${S.best[t.id]??"—"}%</small></a>`).join("")}</div>`,
"/cards":()=>cardsView(),
"/glossary":()=>`<h1>Сөздік</h1><input class="search" placeholder="Термин іздеу..." oninput="gl(this.value)"><div id="gl" class="grid">${TERMS.map(g).join("")}</div>`,
"/profile":()=>{const stars=Object.values(S.stars||{}).reduce((x,y)=>x+y,0),sec=doneSecs(),ub=S.ubt||[];
 return `<div class="rise"><small class="kick">ПРОФИЛЬ</small><h1>${S.name} · ${S.cls}-сынып</h1><p style="color:var(--mut);margin-top:6px">${title()} · ${lvl()}-деңгей</p></div>
 <div class="stats rise" style="--d:60ms"><div class="card stat"><b data-count="${S.xp}">0</b><small>XP</small></div><div class="card stat"><b data-count="${sec}">0</b><small>Сабақ</small></div><div class="card stat"><b data-count="${stars}">0</b><small>Жұлдыз</small></div><div class="card stat"><b data-count="${ub.length}">0</b><small>ҰБТ нұсқа</small></div></div>
 <h2>Бөлімдер</h2><div class="modes rise" style="--d:100ms"><a class="card mode m1" href="#/plan"><span>🗓️</span><div><b>Жоспар</b><small>Күнтізбе мен тапсырмалар</small></div></a><a class="card mode m2" href="#/leaders"><span>🏅</span><div><b>Рейтинг</b><small>Үздіктер тақтасы</small></div></a><a class="card mode m3" href="#/glossary"><span>📖</span><div><b>Сөздік</b><small>${TERMS.length} термин</small></div></a></div>
 <h2>Жетістіктер</h2><div class="grid">${BADGES.map((b,i)=>`<div class="card badge ${b[2]()?"got":""} rise" style="--d:${i*40}ms;text-align:center"><div style="font-size:42px">${b[0]}</div><b>${b[1]}</b></div>`).join("")}</div><br><div class="row"><button class="ghost" onclick="try{localStorage.removeItem('jd')}catch(e){};location.reload()">Прогресті тастау</button> <button class="ghost" onclick="S.name='';save();location.reload()">Шығу</button></div>`},};
const card=t=>`<a class="card" href="#/dash"><div class="ico" style="background:${t.color}22">${t.icon}</div><b>${t.title}</b><br><small>${t.desc}</small>${S.done[t.id]?'<br><span class="chip">✅ Өтілді</span>':""}</a>`;
const g=x=>`<div class="card"><b>${x[0]}</b><br><small>${x[1]}</small></div>`;
window.gl=q=>$("#gl").innerHTML=TERMS.filter(x=>(x[0]+x[1]).toLowerCase().includes(q.toLowerCase())).map(g).join("")||"<small>Табылмады</small>";
const ALLQ=T.flatMap(t=>t.quiz.map((q,i)=>({id:t.id+i,topic:t.title,q:q.q,a:q.a.map(k=>q.o[k]).join(", ")})));
const dayN=()=>Math.floor(Date.now()/864e5);
function deck(){const d=dk();if(S.deck&&S.deck.d==d&&Array.isArray(S.deck.ids)&&S.deck.ids.every(id=>ALLQ.some(c=>c.id==id)))return S.deck;
 const due=ALLQ.filter(c=>!S.box[c.id]||S.box[c.id].due<=dayN()).sort(()=>Math.random()-.5).slice(0,20);
 S.deck={d,ids:due.map(c=>c.id),i:0,know:0,again:0,shown:false,typing:false};save();return S.deck}
function cardsView(){const D=deck(),total=D.ids.length;
 if(!total||D.i>=D.ids.length)return `<h1>Бүгінгі карталар</h1><div class="card" style="text-align:center;padding:40px;margin-top:16px"><div style="font-size:64px">🎉</div><h2>${total?"Бүгінгі карталар аяқталды!":"Қайталайтын карта жоқ"}</h2><p style="color:var(--mut)">Білемін: ${D.know} · Қайталау керек: ${D.again}</p><p style="margin-top:8px">Ертең жаңа карталар келеді.</p></div>`;
 const c=ALLQ.find(x=>x.id==D.ids[D.i]);if(!c){S.deck=null;save();D.i=D.ids.length;return cardsView()}
 return `<small class="k" style="font-weight:800;letter-spacing:.08em">АРАЛЫҚПЕН ҚАЙТАЛАУ · БАРЛЫҚ ТАҚЫРЫПТАР</small><div class="row" style="justify-content:space-between"><h1>Бүгінгі карталар</h1><div style="text-align:right"><b style="font-size:26px">${D.i+1} / ${total}</b><br><small>карта</small></div></div>
 <div class="row" style="justify-content:space-between;margin-bottom:12px"><button class="ghost" onclick="typeMode()">⌨️ Жазып жауап беру</button><span class="chip">⭐ 1 XP</span></div>
 <div class="bar" style="height:10px"><i style="width:${D.i/total*100}%"></i></div>
 <div class="stats" style="grid-template-columns:repeat(3,1fr)"><div class="card stat"><b style="color:#16a34a">${D.know}</b> Білемін</div><div class="card stat"><b style="color:#dc2626">${D.again}</b> Қайталау керек</div><div class="card stat"><b>${total-D.i}</b> Қалды</div></div>
 <div class="stack"><div class="card cardq" onclick="reveal()"><span class="chip">✦ СҰРАҚ · ${c.topic}</span><h2 style="font-size:26px;margin:18px 0">${c.q}</h2><hr style="border:0;border-top:1px solid var(--line)">
 ${D.typing&&!D.shown?`<form onsubmit="chk(event)" class="row" onclick="event.stopPropagation()" style="margin-top:14px"><input class="search" id="ta" style="flex:1;margin:0" placeholder="Жауабыңды жаз..." autofocus><button>Тексеру</button></form>`:
 D.shown?`<p style="margin-top:14px;font-size:22px;font-weight:800;color:var(--pri)">✔ ${c.a}</p>${D.mine?`<small>Сенің жауабың: ${D.mine}</small>`:""}`:`<p style="margin-top:14px;color:var(--mut)">↻ Жауабын ойла да, картаны аудар</p>`}</div></div>
 <div class="row" style="justify-content:center;margin-top:18px"><button class="ghost" ${D.shown?"":"disabled"} onclick="rate(0)">↻ Қайталау керек</button><button ${D.shown?"":"disabled"} style="${D.shown?"":"opacity:.5"}" onclick="rate(1)">✓ Білемін</button></div>`}
window.reveal=()=>{const D=S.deck;if(D.typing&&!D.shown)return;D.shown=true;save();route()};
window.typeMode=()=>{S.deck.typing=!S.deck.typing;S.deck.shown=false;S.deck.mine="";save();route()};
window.chk=e=>{e.preventDefault();const D=S.deck;D.mine=$("#ta").value;D.shown=true;save();route()};
window.rate=ok=>{const D=S.deck,id=D.ids[D.i],b=S.box[id]||{n:0};
 if(ok){b.n++;b.due=dayN()+Math.pow(2,b.n);D.know++}else{b.n=0;b.due=dayN();D.again++;D.ids.push(id)}
 S.box[id]=b;D.i++;D.shown=false;D.mine="";save();if(ok)addXP(1);route()};
const MON=["Қаңтар","Ақпан","Наурыз","Сәуір","Мамыр","Маусым","Шілде","Тамыз","Қыркүйек","Қазан","Қараша","Желтоқсан"];
const iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
let PM=new Date();PM.setDate(1);
function planView(){const y=PM.getFullYear(),m=PM.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate(),td=iso(new Date());
 const tt=S.tasks.filter(t=>t.date==td),dn=tt.filter(t=>t.d).length;
 let cells="";for(let i=0;i<first;i++)cells+="<div></div>";
 for(let d=1;d<=n;d++){const k=y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0"),ts=S.tasks.filter(t=>t.date==k);
  cells+=`<div class="day ${k==td?"today":""}" onclick="openTask('${k}')"><b>${d}</b>${ts.slice(0,3).map(t=>`<span class="tk ${t.d?"d":""}" onclick="event.stopPropagation();tgTask(${t.id})">${t.d?"✓ ":""}${t.t}</span>`).join("")}${ts.length>3?`<small>+${ts.length-3}</small>`:""}</div>`}
 return `<small style="font-weight:800;letter-spacing:.08em;color:var(--cor)">КҮНДЕЛІКТІ ЖОСПАР · ЭЙЗЕНХАУЭР</small>
 <div class="row" style="justify-content:space-between"><h1>Жоспар</h1><div class="row"><span class="card" style="padding:10px 16px">Бүгін <b style="color:var(--pri);font-size:22px">${dn} / ${tt.length}</b> орындалды</span><button class="ghost" onclick="remind()">🔔 Ескертпелерді қосу</button></div></div>
 <div class="card" style="padding:0;margin-top:14px;overflow:hidden"><div class="row" style="justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--line)"><h2 style="margin:0">${MON[m]} ${y} ж.</h2><div class="row"><button class="ghost" onclick="pm(-1)">‹</button><button class="ghost" onclick="pm(1)">›</button><button class="ghost" onclick="pm(0)">Бүгін</button><button onclick="openTask('${td}')">+ Тапсырма қосу</button></div></div>
 <div class="cal"><div class="wd">${["ДС","СС","СР","БС","ЖМ","СБ","ЖС"].map(x=>`<b>${x}</b>`).join("")}</div><div class="cg">${cells}</div></div></div>`}
let LF="all";
const BOTS=[["Алмас Т.",9400],["Томирис К.",8650],["Данияр Е.",7900],["Аружан М.",7200],["Ерасыл Н.",6600],["Айгерім С.",5900],["Бекзат О.",5300],["Мадина Ж.",4700],["Нұрлан А.",4100],["Дана Р.",3600],["Арман Б.",3100],["Іңкәр Ү.",2700],["Санжар Қ.",2300],["Томирис Л.",1900],["Әлихан Д.",1500],["Жанель Т.",1200],["Темірлан Ш.",900],["Ләйла Н.",600],["Мирас Е.",300]];
const weekXP=()=>{let s=0;const now=new Date();for(let i=0;i<7;i++)s+=S.days[dk(new Date(now-i*864e5))]||0;return s};
function board(wk){const me=wk?weekXP():S.xp,
 list=BOTS.map((b,i)=>({n:b[0],x:wk?Math.round(b[1]/18+((i*37)%50)):b[1],lv:Math.floor(b[1]/100)+1})).concat([{n:S.name||"Сен",x:me,lv:lvl(),me:1}]).sort((p,q)=>q.x-p.x);
 return{list,me,pos:list.findIndex(x=>x.me)+1}}
const lrow=(p,i)=>`<div class="lrow ${p.me?"mine":""} ${i==0?"gold":""}"><span class="rk">${i<3?["🥇","🥈","🥉"][i]:i+1}</span><div style="flex:1"><b>${p.n}${p.me?" (сен)":""}</b><br><small>Lv.${p.lv} · ${TITLES[Math.min(p.lv-1,TITLES.length-1)]}</small></div><b class="xpv">${p.x} XP</b></div>`;
function leaders(){const wk=LF=="week",{list,me,pos}=board(wk),top=list.slice(0,20),pod=[top[1],top[0],top[2]],ht=[110,150,80],cl=["linear-gradient(#e2e8f0,#94a3b8)","linear-gradient(#fde047,#f59e0b)","linear-gradient(#fdba74,#ea580c)"];
 return `<small style="color:var(--mut)">Басты › <b style="color:var(--ink)">Үздіктер тақтасы</b></small>
 <div class="hero2" style="margin-top:12px;grid-template-columns:1.2fr 1fr;align-items:end"><div style="align-self:center"><small class="kick">РЕЙТИНГ · TOP 20</small><h1 style="font-size:clamp(30px,5vw,48px)">Үздіктер тақтасы</h1><p style="color:var(--mut);margin-top:10px">XP жина — тақтаның шыңына көтеріл! XP сабақ, тест, қайталау және күнделікті мақсаттар үшін беріледі.</p></div>
 <div class="podium">${pod.map((p,i)=>`<div><div class="av ${p.me?"me":""}">${p.n[0]}</div><b>${p.n}</b><small>${p.x} XP</small><div class="pb" style="height:${ht[i]}px;background:${cl[i]}">${[2,1,3][i]}</div></div>`).join("")}</div></div>
 <div class="row" style="margin:18px 0"><button class="${LF=="all"?"":"ghost"}" onclick="LF='all';route()">Барлық уақыт</button><button class="${wk?"":"ghost"}" onclick="LF='week';route()">Осы апта</button></div>
 <div class="card"><div class="me-row"><span>Сенің орның: <b>#${pos}</b> / ${list.length}</span><b>${me} XP</b></div>${top.map(lrow).join("")}
 <small style="display:block;margin-top:12px">ℹ️ Басқа оқушылар — демо-деректер. Нақты рейтинг үшін сервер қосу керек.</small></div>`}
function miniBoard(){const{list,pos,me}=board(false),t=list.slice(0,5);return `<div class="card" style="margin-top:18px"><div class="row" style="justify-content:space-between"><h2 style="margin:0">🏅 Үздіктер рейтингі</h2><a class="link" href="#/leaders">Бәрін көру →</a></div><div class="me-row" style="margin-top:12px"><span>Сенің орның: <b>#${pos}</b> / ${list.length}</span><b>${me} XP</b></div>${t.map(lrow).join("")}${pos>5?`<div class="dots">⋯</div>${lrow(list[pos-1],pos-1)}`:""}</div>`}
window.pm=d=>{if(!d){PM=new Date();PM.setDate(1)}else PM.setMonth(PM.getMonth()+d);route()};
window.openTask=date=>{const m=document.createElement("div");m.className="modal";m.innerHTML=`<form class="card"><h2 style="margin-top:0">Жаңа тапсырма</h2><label>Тапсырма</label><input class="search" id="mt" required placeholder="Мысалы: Жасуша тақырыбын қайталау"><label>Күні</label><input class="search" type="date" id="md" value="${date}" required><div class="row"><button>Қосу</button><button type="button" class="ghost" id="mc">Бас тарту</button></div><div id="ml"></div></form>`;
 document.body.append(m);const ex=S.tasks.filter(t=>t.date==date);m.querySelector("#ml").innerHTML=ex.map(t=>`<div class="row" style="margin-top:8px"><span style="flex:1">${t.d?"✓ ":""}${t.t}</span><button type="button" class="ghost" onclick="dlTask(${t.id})">✕</button></div>`).join("");
 m.querySelector("#mc").onclick=()=>m.remove();m.onclick=e=>{if(e.target==m)m.remove()};
 m.querySelector("form").onsubmit=e=>{e.preventDefault();S.tasks.push({id:Date.now(),date:m.querySelector("#md").value,t:m.querySelector("#mt").value,d:0});save();m.remove();route()}};
window.tgTask=id=>{const t=S.tasks.find(x=>x.id==id);t.d^=1;save();if(t.d)addXP(5);route()};
window.dlTask=id=>{S.tasks=S.tasks.filter(x=>x.id!=id);save();document.querySelector(".modal")?.remove();route()};
window.remind=async()=>{if(!("Notification" in window))return toast("Браузер қолдамайды");const p=await Notification.requestPermission();toast(p=="granted"?"Ескертпелер қосылды 🔔":"Рұқсат берілмеді");
 if(p=="granted"){const n=S.tasks.filter(t=>t.date==iso(new Date())&&!t.d).length;n&&new Notification("Жас Дарвин",{body:"Бүгін орындалмаған тапсырма: "+n})}};
function route(){window.cleanup&&cleanup();const h=CUR;let html=window.dyn?dyn(h):null;if(html==null)html=(R[h]||R["/"])();const app=$("#app");app.innerHTML=html;app.classList.remove("enter");void app.offsetWidth;app.classList.add("enter");scrollTo(0,0);chrome();window.after&&after(h)}
function gate(){const L=$("#login");if(S.name){L.hidden=true;return}L.hidden=false;
 const mode=m=>{$("#tabR").className=m?"":"ghost";$("#tabL").className=m?"ghost":"";$("#lgtxt").textContent=m?"Есіміңді жаз — оқу жолың бірден басталады.":"Қайта оралғаныңа қуаныштымыз! Атыңды енгіз."};
 $("#tabR").onclick=()=>mode(1);$("#tabL").onclick=()=>mode(0);mode(1);
 $("#lgform").onsubmit=e=>{e.preventDefault();S.name=$("#lgname").value.trim();S.cls=$("#lgclass").value;save();L.hidden=true;route()}}

