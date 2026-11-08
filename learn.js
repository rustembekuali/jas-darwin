// Оқу жолы, сабақ, тест (ҰБТ), атлас, лаб, эффектілер
T.forEach(t=>t.quiz.forEach((q,i)=>{q.id=t.id+i;q.tid=t.id;q.tt=t.title}));
const QALL=T.flatMap(t=>t.quiz);
Object.assign(S,Object.assign({sec:{},ls:{},stars:{},wrong:[],ubt:[]},S));S.sec=S.sec||{};S.ls=S.ls||{};S.stars=S.stars||{};S.wrong=S.wrong||[];S.ubt=S.ubt||[];
T.forEach(t=>{if(!Array.isArray(S.ls[t.id])||S.ls[t.id].length!=t.lesson.length)S.ls[t.id]=t.lesson.map((_,i)=>i<(S.sec[t.id]||0))});

/* ---------- эффектілер ---------- */
const fx={
 burst(x,y){x=x??innerWidth/2;y=y??innerHeight/3;const cols=["#34d399","#bef264","#22d3ee","#fbbf24","#fb7185","#a78bfa"];
  for(let i=0;i<44;i++){const e=document.createElement("i");e.className="conf";e.style.cssText=`left:${x}px;top:${y}px;background:${cols[i%6]};width:${6+Math.random()*6}px;height:${10+Math.random()*8}px`;document.body.append(e);
   const a=Math.random()*Math.PI*2,v=120+Math.random()*260;e.animate([{transform:"translate(0,0) rotate(0)",opacity:1},{transform:`translate(${Math.cos(a)*v}px,${Math.sin(a)*v+260}px) rotate(${Math.random()*900}deg)`,opacity:0}],{duration:1100+Math.random()*700,easing:"cubic-bezier(.2,.7,.3,1)"}).onfinish=()=>e.remove()}},
 count(el){const to=+el.dataset.count,suf=el.dataset.suf||"",t0=performance.now(),d=900;const f=t=>{const k=Math.min(1,(t-t0)/d),v=Math.round(to*(1-Math.pow(1-k,3)));el.textContent=v+suf;if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)},
 levelUp(){const m=document.createElement("div");m.className="modal lvlup";m.innerHTML=`<div class="card" style="text-align:center;max-width:380px"><div style="font-size:64px" class="spin-in">🏅</div><small class="kick">ЖАҢА ДЕҢГЕЙ</small><h1 style="font-size:30px">${lvl()}-деңгей</h1><h2 style="color:var(--acc);margin-top:8px">${title()}</h2><p style="color:var(--mut);margin:10px 0 16px">Жарайсың! Оқуды жалғастыр.</p><button onclick="this.closest('.modal').remove()">Жалғастыру</button></div>`;document.body.append(m);fx.burst()}
};
window.fx=fx;
window.cleanup=()=>{clearInterval(window._tm);window._tm=0;DNALab.stop()};
window.after=h=>{
 document.querySelectorAll(".bar i[data-w]").forEach(e=>requestAnimationFrame(()=>requestAnimationFrame(()=>e.style.width=e.dataset.w+"%")));
 document.querySelectorAll("[data-count]").forEach(fx.count);
 if(h=="/lab"&&DNALab.tab=="model")DNALab.initModel();
 if(h=="/cards")fcBind();
 if(h=="/lab"&&DNALab.tab=="mols")MolLab.init();
 document.querySelectorAll(".ring-p").forEach(c=>requestAnimationFrame(()=>c.style.strokeDashoffset=c.dataset.off));
};

/* ---------- прогресс көмекшілері ---------- */
const secOf=t=>S.ls[t.id].filter(Boolean).length;
function nextStep(){for(const t of T){const s=S.ls[t.id].indexOf(false);if(s>=0)return{t,i:s,url:`/lesson/${t.id}/${s}`,label:t.lesson[s].h};if(!S.stars[t.id])return{t,boss:1,url:`/quiz/${t.id}`,label:t.title+" · сынақ"}}return{t:T[0],i:0,url:"/dash",label:"Қайталау"}}
const totalSecs=T.reduce((a,t)=>a+t.lesson.length,0),doneSecs=()=>T.reduce((a,t)=>a+secOf(t),0);
const mastery=t=>Math.round(secOf(t)/t.lesson.length*50+(S.best[t.id]||0)/100*50);

/* ---------- ДАШБОРД ---------- */
const WD=["Дс","Сс","Ср","Бс","Жм","Сб","Жс"];
function dashboard(){
 const stars=Object.values(S.stars).reduce((a,b)=>a+b,0),ub=S.ubt,avg=ub.length?Math.round(ub.reduce((a,b)=>a+b.p,0)/ub.length):0,ns=nextStep(),tx=todayXP(),now=new Date();
 const ms=T.map(mastery),total=Math.round(ms.reduce((a,b)=>a+b,0)/T.length);
 /* апталық XP */
 const wk=[...Array(7)].map((_,k)=>{const d=new Date(now-(6-k)*864e5);return{l:WD[(d.getDay()+6)%7],x:S.days[dk(d)]||0,today:k==6}}),mx=Math.max(100,...wk.map(w=>w.x));
 /* радар */
 const cx=150,cy=150,R=100,pt=(i,r)=>{const a=(-90+i*360/T.length)*Math.PI/180;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]};
 const ring=f=>T.map((_,i)=>pt(i,R*f).join(",")).join(" "),poly=T.map((t,i)=>pt(i,R*Math.max(.04,ms[i]/100)).join(",")).join(" ");
 const radar=`<svg viewBox="-62 -6 424 312" class="radar"><defs><linearGradient id="rg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bef264"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>${[.25,.5,.75,1].map(f=>`<polygon points="${ring(f)}" class="rgrid"/>`).join("")}${T.map((_,i)=>`<line x1="${cx}" y1="${cy}" x2="${pt(i,R)[0]}" y2="${pt(i,R)[1]}" class="rgrid"/>`).join("")}<polygon points="${poly}" class="rpoly"/>${T.map((t,i)=>{const p=pt(i,R*Math.max(.04,ms[i]/100)),q=pt(i,R+16);return`<circle cx="${p[0]}" cy="${p[1]}" r="4" class="rdot"/><text x="${q[0]}" y="${q[1]+4}" text-anchor="${q[0]<cx-8?"end":q[0]>cx+8?"start":"middle"}" class="rlab">${t.icon} ${t.title}</text>`}).join("")}</svg>`;
 /* ҰБТ динамикасы */
 const last=ub.slice(-8),W=320,H=150,px=i=>last.length>1?24+i*(W-48)/(last.length-1):W/2,py=p=>H-20-p*(H-40)/100;
 const line=last.length?`<svg viewBox="0 0 ${W} ${H}" class="lchart">${[0,50,100].map(v=>`<line x1="24" x2="${W-24}" y1="${py(v)}" y2="${py(v)}" class="lgrid"/><text x="2" y="${py(v)+4}" class="ltxt">${v}</text>`).join("")}<line x1="24" x2="${W-24}" y1="${py(70)}" y2="${py(70)}" class="ltarget"/><text x="${W-24}" y="${py(70)-5}" text-anchor="end" class="ltxt acc">мақсат 70%</text>${last.length>1?`<polyline points="${last.map((x,i)=>px(i)+","+py(x.p)).join(" ")}" class="lpath" pathLength="1"/>`:""}${last.map((x,i)=>`<circle cx="${px(i)}" cy="${py(x.p)}" r="5" class="ldot"/><text x="${px(i)}" y="${py(x.p)-10}" text-anchor="middle" class="ltxt b">${x.p}</text>`).join("")}</svg>`:`<div class="empty"><div style="font-size:40px">🎓</div><p>Әлі ҰБТ нұсқасын тапсырған жоқсың.</p><a class="cta" href="#/quiz/ubt">Нұсқаны бастау</a></div>`;
 /* жылу картасы: 12 апта */
 const start=new Date(now);start.setHours(0,0,0,0);start.setDate(start.getDate()-((start.getDay()+6)%7)-77);
 let heat=`<div class="hcol hlab">${["Дс","","Ср","","Жм","","Жс"].map(x=>`<small>${x}</small>`).join("")}</div>`;for(let c=0;c<12;c++){heat+='<div class="hcol">';for(let r=0;r<7;r++){const d=new Date(+start+(c*7+r)*864e5),x=S.days[dk(d)]||0,fut=d>now,lv=fut?-1:x>=100?4:x>=60?3:x>=25?2:x>0?1:0;heat+=`<i class="h${lv}" title="${d.toLocaleDateString("ru-RU")} · ${x} XP"></i>`}heat+="</div>"}
 /* назар аударатын */
 const wc={};S.wrong.forEach(id=>{const q=QALL.find(x=>x.id==id);if(q)wc[q.tid]=(wc[q.tid]||0)+1});
 const focus=T.map((t,i)=>({t,m:ms[i],w:wc[t.id]||0})).sort((a,b)=>a.m-b.m).slice(0,3);
 const lab=m=>m>=80?["Жақсы","#34d399"]:m>=50?["Орташа","#fbbf24"]:["Қайталау керек","#fb7185"];
 return `<div class="page-head rise"><small class="kick">БАҚЫЛАУ ТАҚТАСЫ</small><h1>Дашборд</h1><p>Прогресің, әлсіз тақырыптарың және келесі қадамың бір жерде. Барлық сабаққа бірден кіре аласың.</p></div>
 <div class="kpis rise" style="--d:50ms">
  <div class="card kpi"><small>XP</small><b data-count="${S.xp}">0</b><span>${lvl()}-деңгей · ${title()}</span></div>
  <div class="card kpi"><small>Сабақ</small><b data-count="${doneSecs()}">0</b><span>${totalSecs} сабақтың ішінде</span></div>
  <div class="card kpi"><small>Жұлдыз</small><b data-count="${stars}">0</b><span>${T.length*3} ішінде</span></div>
  <div class="card kpi"><small>Меңгеру</small><b data-count="${total}" data-suf="%">0%</b><span>орташа деңгей</span></div>
  <div class="card kpi"><small>ҰБТ орташа</small><b data-count="${avg}" data-suf="%">0%</b><span>${ub.length} нұсқа</span></div>
  <div class="card kpi"><small>Қатар күн</small><b data-count="${S.streak}">0</b><span>🔥 үзбе</span></div></div>
 <div class="dgrid rise" style="--d:100ms">
  <div class="card"><div class="ch"><h3>Бүгінгі мақсат</h3><span class="chip">${Math.min(tx,100)} / 100 XP</span></div><div class="goalrow"><div class="ringbox big"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" class="ring-bg"/><circle cx="30" cy="30" r="26" class="ring-p" stroke-dasharray="163" style="stroke-dashoffset:163" data-off="${163-163*Math.min(1,tx/100)}"/></svg><b>${tx>=100?"🌳":tx>=60?"🌿":tx>=20?"🌱":"🌰"}</b></div><div style="flex:1;min-width:180px"><small class="kick">КЕЛЕСІ ҚАДАМ</small><h3 style="margin:2px 0 4px">${ns.t.icon} ${ns.t.title}</h3><p style="color:var(--mut);margin-bottom:12px">${ns.label}</p><a class="cta" href="#${ns.url}">▶ ${doneSecs()?"Жалғастыру":"Бастау"}</a></div></div></div>
  <div class="card"><div class="ch"><h3>Апталық белсенділік</h3><span class="chip">${wk.reduce((a,b)=>a+b.x,0)} XP</span></div><div class="wbars">${wk.map((w,k)=>`<div class="wb ${w.today?"td":""}"><span class="wv">${w.x||""}</span><div class="wtrack" style="--g:${100/mx*100}%"><i style="--h:${Math.max(w.x?4:0,w.x/mx*100)}%;--d:${k*60}ms"></i></div><small>${w.l}</small></div>`).join("")}</div><small class="note">⸺ күндік мақсат 100 XP</small></div></div>
 <div class="dgrid rise" style="--d:150ms">
  <div class="card"><div class="ch"><h3>Тақырыптар бойынша меңгеру</h3></div>${radar}</div>
  <div class="card chartcard"><div class="ch"><h3>ҰБТ динамикасы</h3><a class="link" href="#/quiz">ҰБТ бөлімі →</a></div>${line}</div></div>
 <div class="card rise" style="--d:200ms;margin-top:16px"><div class="ch"><h3>Белсенділік картасы</h3><small>соңғы 12 апта</small></div><div class="heat">${heat}</div><div class="hleg"><small>Аз</small><i class="h0"></i><i class="h1"></i><i class="h2"></i><i class="h3"></i><i class="h4"></i><small>Көп</small></div></div>
 <h2>Сынып бойынша оқулық</h2><div class="gstrip rise" style="--d:230ms">${[7,8,9,10,11].map(g=>`<a class="card gchip" href="#/grade/${g}"><b>${g}</b><small>сынып</small></a>`).join("")}<a class="card gchip" href="#/grades"><b>→</b><small>барлығы</small></a></div>
 <h2>Назар аударатын тақырыптар</h2><div class="focus rise" style="--d:240ms">${focus.map(f=>`<div class="card fcard" style="--zc:${f.t.color}"><div class="ico" style="background:${f.t.color}33">${f.t.icon}</div><div style="flex:1;min-width:0"><b>${f.t.title}</b><div class="bar"><i data-w="${f.m}" style="background:${lab(f.m)[1]}"></i></div><small style="color:${lab(f.m)[1]}">${lab(f.m)[0]} · ${f.m}%${f.w?` · ${f.w} қате`:""}</small></div><div class="col"><button class="ghost sm" onclick="go('/lesson/${f.t.id}/${Math.max(0,S.ls[f.t.id].indexOf(false))}')">Сабақ</button><button class="sm" onclick="go('/quiz/${f.t.id}')">Жаттығу</button></div></div>`).join("")}</div>
 <h2>Барлық тақырыптар</h2><div class="tboard">${T.map((t,i)=>`<div class="card tb rise" style="--zc:${t.color};--d:${i*45}ms"><div class="tbh"><div class="ico" style="background:${t.color}33">${t.icon}</div><div style="flex:1;min-width:0"><b>${t.title}</b><small style="display:block">${t.desc}</small></div><div class="mring" style="--p:${ms[i]}"><b>${ms[i]}</b></div></div>
  <div class="lchips">${t.lesson.map((l,k)=>`<button class="lchip ${S.ls[t.id][k]?"done":""}" onclick="go('/lesson/${t.id}/${k}')" title="${l.h}"><span>${S.ls[t.id][k]?"✓":k+1}</span>${l.h}</button>`).join("")}</div>
  <div class="row" style="justify-content:space-between;margin-top:12px"><div class="zstars sm">${[1,2,3].map(k=>`<span class="${(S.stars[t.id]||0)>=k?"on":""}">★</span>`).join("")}<small style="margin-left:8px;letter-spacing:0">${S.best[t.id]!=null?"үздік "+S.best[t.id]+"%":"тест тапсырылмаған"}</small></div><button class="sm" onclick="go('/quiz/${t.id}')">Сынақ 🎯</button></div></div>`).join("")}</div>`}

/* ---------- САБАҚ ---------- */
function lessonPage(tid,i){const t=T.find(x=>x.id==tid);if(!t)return"";i=+i;const l=t.lesson[i],n=t.lesson.length,fl=S.ls[tid],art=l.art&&ATLAS.find(a=>a.id==l.art),q=t.quiz[i%t.quiz.length];
 window._chk=q;
 return `<a class="link" href="#/dash">← Дашборд</a><div class="lhead rise" style="--zc:${t.color}"><span class="zscale">${t.icon} ${t.title.toUpperCase()} · ${i+1}/${n}</span><h1>${l.h}</h1><div class="steps2">${t.lesson.map((_,k)=>`<i class="${fl[k]?"done":""} ${k==i?"cur":""}"></i>`).join("")}<span>${i+1} / ${n}</span></div></div>
 <div class="card rise" style="--d:80ms"><p class="ltext">${l.t}</p><div class="chips">${l.key.map(k=>`<span class="chip kc">${k}</span>`).join("")}</div></div>
 ${art?`<div class="card rise artbox" style="--d:140ms"><div class="arthead"><b>🖼️ ${art.title}</b><a class="link" href="#/atlas">Атласта ашу →</a></div>${art.svg()}</div>`:""}
 <div class="tipbox rise" style="--d:200ms"><b>🎯 ҰБТ кеңесі</b><p>${l.tip}</p></div>
 <div class="card rise" style="--d:260ms"><small class="kick">ТЕЗ ТЕКСЕРУ</small><h3 style="margin:4px 0 10px">${q.q}</h3><div id="qc">${q.o.map((o,k)=>`<button class="opt" onclick="qcheck(${k},this)">${o}</button>`).join("")}</div><div id="qcx"></div></div>
 <div class="row rise" style="--d:320ms;margin-top:18px">${l.lab?`<button class="ghost" onclick="DNALab.tab='${tid=="gen"&&i==1?"code":"model"}';go('/lab')">🧬 Зертханада көру</button>`:""}<button onclick="finishLesson('${tid}',${i})">Түсіндім ✓ ${!fl[i]?"· +10 XP":""}</button>${i>0?`<button class="ghost" onclick="go('/lesson/${tid}/${i-1}')">← Алдыңғы</button>`:""}</div>`}
window.qcheck=(k,el)=>{const q=window._chk;if(el.parentNode.dataset.done)return;el.parentNode.dataset.done=1;const ok=q.a.includes(k);[...el.parentNode.children].forEach((b,j)=>{if(q.a.includes(j))b.classList.add("ok")});if(!ok)el.classList.add("bad");$("#qcx").innerHTML=`<div class="res ${ok?"good":"bad"}">${ok?"✅ Дұрыс! ":"❌ "}${q.e}</div>`;if(ok){addXP(2);fx.burst(el.getBoundingClientRect().left+40,el.getBoundingClientRect().top)}};
window.finishLesson=(tid,i)=>{const t=T.find(x=>x.id==tid);if(!S.ls[tid][i]){S.ls[tid][i]=true;S.steps[dk()+"a"]=1;if(S.ls[tid].every(Boolean))S.done[tid]=1;save();addXP(10);fx.burst()}
 if(i+1<t.lesson.length)go(`/lesson/${tid}/${i+1}`);else{toast("Тақырып аяқталды! Енді сынақ 🎯");go(`/quiz/${tid}`)}};

/* ---------- ТЕСТ қозғалтқышы ---------- */
let Q=null;
const fmt=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
const shuffle=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const qBack=()=>Q.kind=="gsec"?"/grade/"+GSEC[Q.tid].g:Q.kind=="ggrade"?"/grade/"+Q.tid:Q.kind=="topic"?"/dash":"/quiz";
const qAgain=()=>Q.kind=="gsec"?`go('/quiz/gs/${Q.tid}')`:Q.kind=="ggrade"?`go('/quiz/gg/${Q.tid}')`:Q.kind=="topic"?`go('/quiz/${Q.tid}')`:`go('/quiz/${Q.kind}')`;
const qBackLabel=()=>(Q.kind=="gsec"||Q.kind=="ggrade")?"Сыныпқа қайту":Q.kind=="topic"?"Дашбордқа":"ҰБТ бөліміне";
function startQuiz(kind,tid){let list,title,exam=false,limit=0;
 if(kind=="topic"){const t=T.find(x=>x.id==tid);list=t.quiz;title=t.icon+" "+t.title+" · сынақ";}
 else if(kind=="ubt"){list=shuffle(QALL).slice(0,20);title="ҰБТ нұсқасы";exam=true;limit=30*60}
 else if(kind=="mist"){list=QALL.concat(window.GQ||[]).filter(q=>S.wrong.includes(q.id));title="Қателер дәптері";}
 else if(kind=="gsec"){const sec=GSEC[tid];list=shuffle(sec.q).slice(0,15);title=sec.g+"-сынып · "+sec.t}
 else if(kind=="ggrade"){list=shuffle(GQ.filter(q=>q.g==tid)).slice(0,20);title=tid+"-сынып · аралас тест"}
 else if(kind=="drill"){list=shuffle(QALL).slice(0,10);title="Жылдам жаттығу"}
 Q={kind,tid,list:list.map(q=>{const p=shuffle(q.o.map((o,k)=>[o,q.a.includes(k)]));return{...q,o:p.map(x=>x[0]),a:p.map((x,k)=>x[1]?k:-1).filter(k=>k>=0)}}),i:0,sel:[],ans:[],lock:false,exam,title,left:limit,limit,t0:Date.now()};
 if(exam){clearInterval(window._tm);window._tm=setInterval(()=>{Q.left--;const e=$("#timer");if(e){e.textContent="⏱ "+fmt(Q.left);e.classList.toggle("warn",Q.left<300)}if(Q.left<=0){clearInterval(window._tm);finishQuiz()}},1000)}
 return qView()}
function qView(){if(!Q||!Q.list.length)return `<a class="link" href="#/quiz">← ҰБТ</a><div class="card" style="text-align:center;padding:40px;margin-top:16px"><div style="font-size:60px">📓</div><h2>Қателер дәптері бос</h2><p style="color:var(--mut)">Бір де қате жоқ — тамаша! Тест тапсырсаң, қателерің осында жиналады.</p></div>`;
 const q=Q.list[Q.i],n=Q.list.length;
 return `<div class="qtop"><a class="link" href="#${qBack()}">✕ Шығу</a><b>${Q.title}</b>${Q.exam?`<span id="timer" class="chip">⏱ ${fmt(Q.left)}</span>`:`<span class="chip">${Q.i+1} / ${n}</span>`}</div>
 <div class="bar"><i style="width:${Q.i/n*100}%"></i></div>${Q.exam?`<div class="qnav">${Q.list.map((_,k)=>`<button class="${k==Q.i?"cur":""} ${Q.ans[k]!==undefined?"has":""}" onclick="qjump(${k})">${k+1}</button>`).join("")}</div>`:""}
 <div class="card qcard enter2"><small class="kick">${q.tt.toUpperCase()} · ${q.m?"БІРНЕШЕ ЖАУАП":"БІР ЖАУАП"}</small><h2 class="qtext">${q.q}</h2><div id="opts">${q.o.map((o,k)=>`<button class="opt ${(Q.sel.includes(k)||(Q.exam&&(Q.ans[Q.i]||[]).includes(k)))?"sel":""}" onclick="qpick(${k})"><span class="ol">${"ABCDE"[k]}</span>${o}</button>`).join("")}</div><div id="qfb"></div>
 <div class="row" style="margin-top:14px">${q.m&&!Q.lock?`<button onclick="qsubmit()">Жауап беру</button>`:""}${Q.exam?`${Q.i>0?`<button class="ghost" onclick="qjump(${Q.i-1})">← Артқа</button>`:""}<button ${Q.i<n-1?"":'class="gold"'} onclick="${Q.i<n-1?`qjump(${Q.i+1})`:"finishQuiz()"}">${Q.i<n-1?"Келесі →":"Аяқтау ✓"}</button>`:""}</div></div>`}
window.qjump=k=>{if(Q.exam){Q.ans[Q.i]=Q.sel.length?Q.sel.slice():Q.ans[Q.i];}Q.i=k;Q.sel=(Q.ans[k]||[]).slice();$("#app").innerHTML=qView()};
window.qpick=k=>{if(Q.lock)return;const q=Q.list[Q.i];
 if(q.m){const x=Q.sel.indexOf(k);x>=0?Q.sel.splice(x,1):Q.sel.push(k);document.querySelectorAll("#opts .opt").forEach((b,j)=>b.classList.toggle("sel",Q.sel.includes(j)));return}
 Q.sel=[k];if(Q.exam){Q.ans[Q.i]=[k];document.querySelectorAll("#opts .opt").forEach((b,j)=>b.classList.toggle("sel",j==k));const b=document.querySelectorAll(".qnav button")[Q.i];b&&b.classList.add("has");return}
 qsubmit()};
window.qsubmit=()=>{const q=Q.list[Q.i];if(!Q.sel.length)return toast("Жауап таңда");
 if(Q.exam){Q.ans[Q.i]=Q.sel.slice();toast("Жауап сақталды");return}
 Q.lock=true;const ok=Q.sel.length==q.a.length&&q.a.every(a=>Q.sel.includes(a));Q.ans[Q.i]=Q.sel.slice();
 document.querySelectorAll("#opts .opt").forEach((b,j)=>{b.disabled=true;if(q.a.includes(j))b.classList.add("ok");else if(Q.sel.includes(j))b.classList.add("bad")});
 if(ok){fx.burst(innerWidth/2,innerHeight/2);Q._ok=(Q._ok||0)+1}else{$(".qcard").classList.add("shake")}
 $("#qfb").innerHTML=`<div class="res ${ok?"good":"bad"}"><b>${ok?"✅ Дұрыс!":"❌ Қате."}</b> ${q.e}</div>`;
 const last=Q.i>=Q.list.length-1;$(".qcard .row").innerHTML=`<button onclick="${last?"finishQuiz()":"qnext()"}">${last?"Нәтиже ✓":"Келесі →"}</button>`};
window.qnext=()=>{Q.i++;Q.sel=[];Q.lock=false;$("#app").innerHTML=qView();$("#app").scrollTo?0:0;scrollTo(0,0)};
window.finishQuiz=()=>{clearInterval(window._tm);if(Q.exam)Q.ans[Q.i]=Q.sel.length?Q.sel.slice():Q.ans[Q.i];
 const res=Q.list.map((q,k)=>{const a=Q.ans[k]||[];return{q,a,ok:a.length==q.a.length&&q.a.every(x=>a.includes(x))}}),ok=res.filter(r=>r.ok).length,n=res.length,p=Math.round(ok/n*100);
 res.forEach(r=>{const i=S.wrong.indexOf(r.q.id);if(r.ok){if(i>=0)S.wrong.splice(i,1)}else if(i<0&&r.a.length)S.wrong.push(r.q.id)});
 let stars=0;if(Q.kind=="topic"){stars=p>=100?3:p>=80?2:p>=60?1:0;if(stars>(S.stars[Q.tid]||0)){S.stars[Q.tid]=stars;S.best[Q.tid]=p}S.best[Q.tid]=Math.max(S.best[Q.tid]||0,p)}
 if(Q.kind!="ubt")S.steps[dk()+"b"]=1;
 if(Q.kind=="ubt"){S.ubt.push({d:Date.now(),ok,n,p,ms:Date.now()-Q.t0});S.steps[dk()+"c"]=1}
 if(Q.kind=="gsec"){S.gsec=S.gsec||{};S.gsec[Q.tid]=Math.max(S.gsec[Q.tid]||0,p)}if(Q.kind=="ggrade"){S.ggr=S.ggr||{};S.ggr[Q.tid]=Math.max(S.ggr[Q.tid]||0,p)}
 save();Q.res={res,ok,n,p,stars};addXP(ok*(Q.kind=="ubt"?3:5));if(p>=80)setTimeout(()=>fx.burst(),300);$("#app").innerHTML=resultView();after("res");scrollTo(0,0)};
function resultView(){const{res,ok,n,p,stars}=Q.res,by={};res.forEach(r=>{(by[r.q.tid]=by[r.q.tid]||{t:r.q.tt,ok:0,n:0});by[r.q.tid].n++;if(r.ok)by[r.q.tid].ok++});
 const weak=Object.entries(by).filter(([k,v])=>v.ok/v.n<.7).map(([k])=>k),msg=p>=90?"Тамаша нәтиже! 🏆":p>=70?"Жақсы! Қателерді қарап шық 💪":p>=50?"Орташа. Әлсіз тақырыптарды қайтала 📚":"Теорияны қайта оқып шық 🌱";
 return `<div class="resbox rise"><div class="ringbox big"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" class="ring-bg"/><circle cx="30" cy="30" r="26" class="ring-p" stroke-dasharray="163" style="stroke-dashoffset:163" data-off="${163-163*p/100}"/></svg><b data-count="${p}" data-suf="%">0%</b></div><h1>${msg}</h1><p style="color:var(--mut)">${ok} / ${n} дұрыс · ${Q.title}${Q.kind=="ubt"?` · ${fmt(Math.round((Date.now()-Q.t0)/1000))}`:""}</p>
 ${Q.kind=="topic"?`<div class="bigstars">${[1,2,3].map(k=>`<span class="${stars>=k?"on":""}" style="--d:${k*250}ms">★</span>`).join("")}</div>`:""}
 <div class="row" style="justify-content:center;margin-top:12px"><button onclick="${qAgain()}">🔄 Қайта</button><button class="ghost" onclick="go('${qBack()}')">${qBackLabel()}</button>${S.wrong.length?`<button class="ghost" onclick="go('/quiz/mist')">📓 Қателер (${S.wrong.length})</button>`:""}</div></div>
 ${Object.keys(by).length>1?`<div class="card rise" style="--d:100ms;margin-top:18px"><h3 style="margin:0 0 12px">Тақырыптар бойынша</h3>${Object.entries(by).map(([k,v])=>`<div class="brow"><span>${v.t}</span><div class="bar"><i data-w="${v.ok/v.n*100}" class="${v.ok/v.n<.7?"red":""}"></i></div><b>${v.ok}/${v.n}</b></div>`).join("")}${weak.length?`<p class="tipline">💡 Қайталауға кеңес: ${weak.map(k=>`<a class="link" href="#${/^g\d/.test(k)?"/grade/"+k.slice(1):"/lesson/"+k+"/0"}">${by[k].t}</a>`).join(", ")}</p>`:""}</div>`:""}
 <h2>Жауаптарды талдау</h2>${res.map((r,k)=>`<div class="card rev ${r.ok?"ok":"no"} rise" style="--d:${Math.min(k,8)*50}ms"><div class="revh"><span>${r.ok?"✅":"❌"} ${k+1}.</span><small>${r.q.tt}</small></div><b>${r.q.q}</b><div class="revo">${r.q.o.map((o,j)=>`<span class="${r.q.a.includes(j)?"c":r.a.includes(j)?"w":""}">${"ABCDE"[j]}. ${o}</span>`).join("")}</div><p>${r.q.e}</p></div>`).join("")}`}

/* ---------- ҰБТ бөлімі ---------- */
function ubtPage(){const h=S.ubt,avg=h.length?Math.round(h.reduce((a,b)=>a+b.p,0)/h.length):0,best=h.length?Math.max(...h.map(x=>x.p)):0;
 return `<div class="page-head rise"><small class="kick">ҰБТ-ҒА ДАЙЫНДЫҚ</small><h1>ҰБТ дайындық</h1><p>${QALL.length} сұрақ, түсіндірмелермен. Нұсқа тапсыр, қателерді талда, әлсіз тақырыптарды қайтала.</p></div>
 <div class="stats rise" style="--d:60ms"><div class="card stat"><b data-count="${h.length}">0</b><small>Нұсқа</small></div><div class="card stat"><b data-count="${avg}" data-suf="%">0%</b><small>Орташа</small></div><div class="card stat"><b data-count="${best}" data-suf="%">0%</b><small>Үздік</small></div><div class="card stat"><b data-count="${S.wrong.length}">0</b><small>Қате</small></div></div>
 <div class="modes rise" style="--d:120ms"><a class="card mode m1" href="#/quiz/ubt"><span>🎓</span><div><b>ҰБТ нұсқасы</b><small>20 сұрақ · 30 минут · нәтиже соңында</small></div></a><a class="card mode m2" href="#/quiz/drill"><span>⚡</span><div><b>Жылдам жаттығу</b><small>10 сұрақ · бірден түсіндірме</small></div></a><a class="card mode m3" href="#/quiz/mist"><span>📓</span><div><b>Қателер дәптері</b><small>${S.wrong.length} қате сұрақ</small></div></a></div>
 <h2>Тақырып бойынша жаттығу</h2><div class="grid rise" style="--d:180ms">${T.map(t=>`<a class="card tcard" href="#/quiz/${t.id}" style="--zc:${t.color}"><div class="ico" style="background:${t.color}33">${t.icon}</div><b>${t.title}</b><br><small>${t.quiz.length} сұрақ · үздік: ${S.best[t.id]??"—"}${S.best[t.id]!=null?"%":""}</small><div class="zstars sm">${[1,2,3].map(k=>`<span class="${(S.stars[t.id]||0)>=k?"on":""}">★</span>`).join("")}</div></a>`).join("")}</div>
 ${h.length?`<h2>Тарих</h2><div class="card rise">${h.slice(-6).reverse().map(x=>`<div class="brow"><span>${new Date(x.d).toLocaleDateString("ru-RU")}</span><div class="bar"><i data-w="${x.p}"></i></div><b>${x.ok}/${x.n}</b></div>`).join("")}</div>`:""}`}

/* ---------- АТЛАС ---------- */
let AC="all";
function atlasPage(){const list=ATLAS.filter(a=>AC=="all"||a.cat==AC);
 return `<div class="page-head rise"><small class="kick">СУРЕТ АТЛАСЫ</small><h1>Биология атласы</h1><p>Жасушалар, органоидтар, мүшелер мен организмдердің суреттері. Суретті бас — үлкейтіп, белгілеулерімен көр.</p></div>
 <div class="seg rise" style="--d:60ms">${ATLAS_CATS.map(c=>`<button class="${AC==c[0]?"on":""}" onclick="AC='${c[0]}';route()">${c[1]}</button>`).join("")}</div>
 <div class="grid atl">${list.map((a,i)=>`<button class="card acard rise" style="--d:${i*50}ms" onclick="openArt('${a.id}')"><div class="athumb">${a.svg()}</div><b>${a.title}</b><small>${a.facts[0]}</small></button>`).join("")}</div>`}
window.openArt=id=>{const a=ATLAS.find(x=>x.id==id),m=document.createElement("div");m.className="modal art-modal";m.innerHTML=`<div class="card artbig"><button class="x ghost" onclick="this.closest('.modal').remove()">✕</button><h2 style="margin:0 0 4px">${a.title}</h2><p style="color:var(--mut);margin-bottom:10px">${a.desc}</p>${a.svg()}<div class="chips" style="margin-top:12px">${a.facts.map(f=>`<span class="chip kc">${f}</span>`).join("")}</div></div>`;m.onclick=e=>{if(e.target==m)m.remove()};document.body.append(m)};

/* ---------- ЛАБ ---------- */
const labPage=()=>`<div class="page-head rise"><small class="kick">ЗЕРТХАНА</small><h1>Биомолекулалар мен ДНҚ</h1><p>Су, глюкоза, амин қышқылы, АТФ молекулаларын 3D-де айналдыр. ДНҚ спиралі, құрастырушы, ҰБТ есептері және генетикалық код та осында.</p></div>${DNALab.html()}`;

/* ---------- маршрутизатор ---------- */
window.dyn=h=>{const p=h.split("/").filter(Boolean);
 if(p[0]=="lesson")return lessonPage(p[1],p[2]);
 if(p[0]=="quiz"&&p[1]=="gs")return startQuiz("gsec",p[2]);
 if(p[0]=="quiz"&&p[1]=="gg")return startQuiz("ggrade",p[2]);
 if(p[0]=="quiz"&&p[1]){return startQuiz(p[1]=="ubt"?"ubt":p[1]=="mist"?"mist":p[1]=="drill"?"drill":"topic",p[1])}
 return null};
R["/dash"]=dashboard;R["/path"]=dashboard;R["/lessons"]=dashboard;R["/quiz"]=ubtPage;R["/atlas"]=atlasPage;R["/lab"]=labPage;

gate();route();
BioCursor.start();
