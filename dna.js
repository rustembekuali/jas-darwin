// ДНҚ зертханасы: 3D модель, құрастырушы, ҰБТ есептері, генетикалық код
const COMP={A:"T",T:"A",G:"C",C:"G"},BCOL={A:"#fbbf24",T:"#fb7185",G:"#22d3ee",C:"#a3e635",U:"#f0abfc"};
const AA={F:"Phe",L:"Leu",S:"Ser",Y:"Tyr",C:"Cys",W:"Trp",P:"Pro",H:"His",Q:"Gln",R:"Arg",I:"Ile",M:"Met",T:"Thr",N:"Asn",K:"Lys",V:"Val",A:"Ala",D:"Asp",E:"Glu",G:"Gly","*":"СТОП"};
const CODE="FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
const codonAA=c=>{const b="UCAG";return AA[CODE[16*b.indexOf(c[0])+4*b.indexOf(c[1])+b.indexOf(c[2])]]};
const DNALab={tab:"model",raf:0,rot:.6,tilt:.35,auto:true,mode:"ball",names:true,hb:true,drag:null,
 seq:"ATGCGTACCTGAAGCTTAGC",
 stop(){cancelAnimationFrame(this.raf);this.raf=0;if(window.MolLab)MolLab.stop()},
 /* ---------- 3D модель ---------- */
 modelHTML(){return `<div class="card lab-card"><canvas id="dna3d" width="720" height="430"></canvas><div class="lab-hint">🖱️ Сүйреп айналдыр · дөңгелекпен үлкейт</div></div>
 <div class="row lab-ctl"><button class="ghost ${this.auto?"sel":""}" onclick="DNALab.set('auto')">⟳ Автоайналу</button><button class="ghost ${this.names?"sel":""}" onclick="DNALab.set('names')">🔤 Негіз аттары</button><button class="ghost ${this.hb?"sel":""}" onclick="DNALab.set('hb')">··· Сутектік байланыс</button><button class="ghost ${this.mode=="ball"?"sel":""}" onclick="DNALab.set('mode')">${this.mode=="ball"?"⚪ Шар-таяқша":"🟣 Кеңістік толтыру"}</button></div>
 <div class="legend"><span><i style="background:#fbbf24"></i>A аденин</span><span><i style="background:#fb7185"></i>T тимин</span><span><i style="background:#22d3ee"></i>G гуанин</span><span><i style="background:#a3e635"></i>C цитозин</span><span><i style="background:#e9fff5"></i>қаңқа (дезоксирибоза + фосфат)</span></div>
 <div class="card" style="margin-top:14px"><h3 style="margin:0 0 8px;font-size:16px">Модельдегі негізгі фактілер</h3><ul class="facts"><li>Бір орам — 10 жұп нуклеотид, биіктігі 3,4 нм.</li><li>A–T арасында 2, G–C арасында 3 сутектік байланыс.</li><li>Тізбектер антипараллель: 5'→3' және 3'→5'.</li><li>Модельдегі тізбек: <b class="mono">${this.seq}</b></li></ul></div>`},
 set(k){if(k=="mode")this.mode=this.mode=="ball"?"fill":"ball";else this[k]=!this[k];route()},
 initModel(){const c=document.getElementById("dna3d");if(!c)return;if(innerWidth<700){c.width=420;c.height=540}const ctx=c.getContext("2d"),N=this.seq.length;let zoom=1,self=this;
  c.onpointerdown=e=>{self.drag=[e.clientX,e.clientY];c.setPointerCapture(e.pointerId)};
  c.onpointermove=e=>{if(!self.drag)return;self.rot+=(e.clientX-self.drag[0])*.012;self.tilt=Math.max(-1.2,Math.min(1.2,self.tilt+(e.clientY-self.drag[1])*.008));self.drag=[e.clientX,e.clientY]};
  c.onpointerup=()=>self.drag=null;c.onwheel=e=>{e.preventDefault();zoom=Math.max(.6,Math.min(1.8,zoom-e.deltaY*.001))};
  const loop=()=>{const W=c.width,H=c.height;if(self.auto&&!self.drag)self.rot+=.012;ctx.clearRect(0,0,W,H);
   const R=c.width<500?78:95,step=.62,h=(H-90)/N,items=[],cx=W/2,cy=H/2,f=520;
   const P=(x,y,z)=>{const y2=y*Math.cos(self.tilt)-z*Math.sin(self.tilt),z2=y*Math.sin(self.tilt)+z*Math.cos(self.tilt),s=f/(f+z2)*zoom;return{x:cx+x*s,y:cy+y2*s,z:z2,s}};
   for(let i=0;i<N;i++){const y=(i-(N-1)/2)*h,t=i*step+self.rot,a=P(R*Math.cos(t),y,R*Math.sin(t)),b=P(-R*Math.cos(t),y,-R*Math.sin(t)),m=P(0,y,0),b1=self.seq[i],b2=COMP[b1];
    items.push({z:a.z,d:()=>drawAtom(a,"#e9fff5",9)},{z:b.z,d:()=>drawAtom(b,"#cbd5e1",9)});
    items.push({z:(a.z+m.z)/2,d:()=>rung(a,m,b1,i,true)},{z:(b.z+m.z)/2,d:()=>rung(b,m,b2,i,false)});
    if(i>0){const t0=(i-1)*step+self.rot,y0=(i-2*0.5-(N-1)/2+.5-.5)*h,pa=P(R*Math.cos(t0),(i-1-(N-1)/2)*h,R*Math.sin(t0)),pb=P(-R*Math.cos(t0),(i-1-(N-1)/2)*h,-R*Math.sin(t0));
     items.push({z:(a.z+pa.z)/2-.5,d:()=>bone(a,pa,"#e9fff5")},{z:(b.z+pb.z)/2-.5,d:()=>bone(b,pb,"#94a3b8")})}}
   function bone(p,q,col){ctx.strokeStyle=col;ctx.lineWidth=5*Math.min(p.s,q.s);ctx.globalAlpha=.9;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.globalAlpha=1}
   function drawAtom(p,col,r){const rr=(self.mode=="fill"?r*1.7:r)*p.s,g=ctx.createRadialGradient(p.x-rr*.3,p.y-rr*.3,rr*.1,p.x,p.y,rr);g.addColorStop(0,"#fff");g.addColorStop(1,col);ctx.fillStyle=g;ctx.globalAlpha=.55+.45*Math.min(1,p.s);ctx.beginPath();ctx.arc(p.x,p.y,rr,0,7);ctx.fill();ctx.globalAlpha=1}
   function rung(a,m,b,i,left){const col=BCOL[b];ctx.strokeStyle=col;ctx.lineWidth=(self.mode=="fill"?11:6)*m.s;ctx.lineCap="round";ctx.globalAlpha=.6+.4*m.s;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(m.x,m.y);ctx.stroke();ctx.globalAlpha=1;
    drawAtom({x:(a.x+m.x)/2,y:(a.y+m.y)/2,s:m.s},col,6.5);
    if(self.names){ctx.fillStyle="#04231a";ctx.font=`800 ${11*m.s}px Nunito,sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(b,(a.x+m.x)/2,(a.y+m.y)/2+.5)}
    if(self.hb&&left){const k=(b=="A"||b=="T")?2:3,dx=m.x-a.x,dy=m.y-a.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;ctx.save();ctx.strokeStyle="#ffffff";ctx.lineWidth=1.6*m.s;ctx.setLineDash([3*m.s,3*m.s]);ctx.globalAlpha=.9;for(let j=0;j<k;j++){const o=(j-(k-1)/2)*4.5*m.s;ctx.beginPath();ctx.moveTo(m.x-dx*.18+nx*o,m.y-dy*.18+ny*o);ctx.lineTo(m.x+dx*.18+nx*o,m.y+dy*.18+ny*o);ctx.stroke()}ctx.restore()}}
   items.sort((p,q)=>q.z-p.z).forEach(o=>o.d());
   ctx.fillStyle="#bef264";ctx.font="800 13px Nunito";ctx.textAlign="left";ctx.fillText("5'",16,28);ctx.fillText("3'",16,H-14);ctx.textAlign="right";ctx.fillStyle="#cbd5e1";ctx.fillText("3'",W-16,28);ctx.fillText("5'",W-16,H-14);
   self.raf=requestAnimationFrame(loop)};
  this.stop();loop()},
 /* ---------- Құрастырушы ---------- */
 bld:null,
 builderHTML(){if(!this.bld)this.newBuild();const B=this.bld;
  return `<div class="card"><small class="kick">КОМПЛЕМЕНТАРЛЫҚ ЖАТТЫҒУЫ</small><h2 style="margin:0 0 8px">Екінші тізбекті құрастыр</h2><p style="color:var(--mut)">Жоғарғы тізбекке комплементарлы негіздерді таңда: A–T, G–C. Дұрыс жауап +2 XP.</p>
  <div class="strand">${B.top.map((b,i)=>`<div class="nt"><div class="nb" style="background:${BCOL[b]}">${b}</div><div class="nlk"></div><div class="nb ${B.bot[i]?(B.bot[i]==COMP[b]?"ok":"bad"):"empty"}" ${B.bot[i]?`style="background:${BCOL[B.bot[i]]}"`:""}>${B.bot[i]||"?"}</div></div>`).join("")}</div>
  <div class="row" style="justify-content:center;margin-top:14px">${"ATGC".split("").map(b=>`<button class="nbtn" style="background:${BCOL[b]}" onclick="DNALab.pick('${b}')">${b}</button>`).join("")}<button class="ghost" onclick="DNALab.undo()">⌫</button></div>
  <div class="row" style="justify-content:center;margin-top:14px"><span class="chip">Дұрыс: ${B.ok} · Қате: ${B.bad}</span><button class="ghost" onclick="DNALab.newBuild();route()">🔄 Жаңа тізбек</button></div>
  ${B.bot.filter(Boolean).length==B.top.length?`<div class="res ${B.bot.every((b,i)=>b==COMP[B.top[i]])?"good":"bad"}">${B.bot.every((b,i)=>b==COMP[B.top[i]])?"🎉 Тамаша! Барлығы дұрыс.":"Қателерін түзет — ⌫ басып қайта таңда."}</div>`:""}</div>`},
 newBuild(){const s=Array.from({length:8},()=>"ATGC"[Math.random()*4|0]);this.bld={top:s,bot:[],ok:0,bad:0}},
 pick(b){const B=this.bld,i=B.bot.length;if(i>=B.top.length)return;B.bot.push(b);if(b==COMP[B.top[i]]){B.ok++;addXP(2)}else B.bad++;route()},
 undo(){this.bld.bot.pop();route()},
 /* ---------- ҰБТ есептері ---------- */
 task:null,
 newTask(){const k=Math.random()*4|0;let t;
  if(k==0){const a=[10,15,20,22,25,28,30][Math.random()*7|0];t={q:`ДНҚ молекуласында аденин ${a}%. Цитозиннің мөлшері (%) қанша?`,a:50-a,u:"%",h:"A = T, ендеше G + C = 100 − 2A, G = C."}}
  else if(k==1){const n=[20,30,40,50,60][Math.random()*5|0],g=[6,8,10,12,15][Math.random()*5|0];t={q:`ДНҚ үзіндісінде барлығы ${n} нуклеотид жұбы, оның ${g}-і G–C жұбы. Барлық сутектік байланыс санын тап.`,a:(n-g)*2+g*3,u:"",h:"A–T жұбында 2, G–C жұбында 3 байланыс."}}
  else if(k==2){const n=[50,80,100,120,150][Math.random()*5|0];t={q:`Ақуыз ${n} амин қышқылынан тұрады. Оны кодтайтын иРНҚ-да неше нуклеотид бар (стоп-кодонсыз)?`,a:n*3,u:"",h:"Бір амин қышқылы = 1 триплет = 3 нуклеотид."}}
  else{const n=[300,450,600,900][Math.random()*4|0];t={q:`иРНҚ-да ${n} нуклеотид бар. Ол кодтайтын ақуыздағы амин қышқылдарының саны қанша?`,a:n/3,u:"",h:"n нуклеотид ÷ 3 = амин қышқылдары."}}
  this.task=t},
 tasksHTML(){if(!this.task)this.newTask();const t=this.task;return `<div class="card"><small class="kick">ҰБТ ЕСЕПТЕРІ</small><h2 style="margin:0 0 10px">${t.q}</h2><form class="row" onsubmit="DNALab.check(event)"><input class="search" id="tans" type="number" inputmode="numeric" placeholder="Жауабың" style="flex:1;margin:0" required><button>Тексеру</button></form><div id="tres"></div><div class="row" style="margin-top:14px"><button class="ghost" onclick="DNALab.newTask();route()">🔄 Келесі есеп</button></div><details style="margin-top:12px"><summary style="cursor:pointer;color:var(--acc);font-weight:800">💡 Кеңес</summary><p style="margin-top:6px;color:var(--mut)">${t.h}</p></details></div>
  <div class="card" style="margin-top:14px"><h3 style="margin:0 0 8px">Формулалар</h3><ul class="facts"><li>Чаргафф: A = T, G = C, A + G = T + C = 50%.</li><li>Сутектік байланыс: 2·(A–T) + 3·(G–C).</li><li>Нуклеотид саны = 3 × амин қышқылы саны.</li><li>Бір орам ДНҚ: 10 жұп, 3,4 нм; нуклеотид ұзындығы 0,34 нм.</li></ul></div>`},
 check(e){e.preventDefault();const v=+document.getElementById("tans").value,t=this.task,ok=v==t.a;document.getElementById("tres").innerHTML=`<div class="res ${ok?"good":"bad"}">${ok?"✅ Дұрыс! +3 XP":"❌ Дұрыс жауап: <b>"+t.a+(t.u?" "+t.u:"")+"</b>"}</div>`;if(ok){addXP(3);fx.burst()}},
 /* ---------- Генетикалық код ---------- */
 tmpl:"TACTTTGGCCATACT".split(""),orig:"TACTTTGGCCATACT".split(""),
 codeHTML(){const t=this.tmpl,m=t.map(x=>x=="T"?"A":x=="A"?"U":x=="G"?"C":"G"),cod=[];for(let i=0;i<m.length;i+=3)cod.push(m.slice(i,i+3).join(""));
  const ori=this.orig.map(x=>x=="T"?"A":x=="A"?"U":x=="G"?"C":"G"),oc=[];for(let i=0;i<ori.length;i+=3)oc.push(ori.slice(i,i+3).join(""));
  let stopped=false;const prot=cod.map((c,i)=>{if(stopped)return{n:"—",c};const a=codonAA(c);if(a=="СТОП")stopped=true;return{n:a,c,ch:codonAA(oc[i])!=a}});
  const mut=t.some((x,i)=>x!=this.orig[i]);
  return `<div class="card"><small class="kick">ГЕНЕТИКАЛЫҚ КОД · ТРАНСКРИПЦИЯ → ТРАНСЛЯЦИЯ</small><h2 style="margin:0 0 6px">Мутация жасап көр</h2><p style="color:var(--mut)">ДНҚ матрицалық тізбегіндегі әріпті басып өзгерт: иРНҚ мен ақуыз бірден өзгереді.</p>
  <div class="dogma"><div class="dl">ДНҚ (матрица) 3'→5'</div><div class="seq">${t.map((b,i)=>`<button class="base ${b!=this.orig[i]?"mut":""}" style="--c:${BCOL[b]}" onclick="DNALab.mutate(${i})">${b}</button>`).join("")}</div>
  <div class="arrow">↓ транскрипция (A→U, T→A, G→C, C→G)</div><div class="dl">иРНҚ 5'→3'</div><div class="seq">${cod.map(c=>`<span class="codon">${c.split("").map(b=>`<i style="background:${BCOL[b]}">${b}</i>`).join("")}</span>`).join("")}</div>
  <div class="arrow">↓ трансляция (рибосома)</div><div class="dl">Ақуыз</div><div class="seq">${prot.map(p=>`<span class="aa ${p.n=="СТОП"?"stop":""} ${p.ch?"chg":""}">${p.n}</span>`).join('<span class="dash">–</span>')}</div></div>
  <div class="row" style="margin-top:14px">${mut?`<span class="chip">⚠️ ${mutType(prot,oc,cod)}</span>`:`<span class="chip">Бастапқы тізбек: Met–Lys–Pro–Val–СТОП</span>`}<button class="ghost" onclick="DNALab.reset()">↺ Қалпына келтіру</button></div></div>
  <div class="card" style="margin-top:14px"><h3 style="margin:0 0 10px;font-size:16px">Генетикалық код кестесі (иРНҚ кодондары)</h3>${codeTable()}</div>`},
 mutate(i){const o="ATGC",c=this.tmpl[i];this.tmpl[i]=o[(o.indexOf(c)+1)%4];route()},reset(){this.tmpl=this.orig.slice();route()},
 html(){return `<div class="seg lab-tabs">${[["model","🧬 ДНҚ 3D"],["mols","⚛️ Молекулалар"],["build","🧩 Құрастырушы"],["tasks","🧮 Есептер"],["code","🔡 Генетикалық код"]].map(t=>`<button class="${this.tab==t[0]?"on":""}" onclick="DNALab.go('${t[0]}')">${t[1]}</button>`).join("")}</div><div style="margin-top:16px">${this.tab=="model"?this.modelHTML():this.tab=="mols"?MolLab.html():this.tab=="build"?this.builderHTML():this.tab=="tasks"?this.tasksHTML():this.codeHTML()}</div>`},
 go(t){this.tab=t;route()}};
function mutType(prot,oc,cod){const ch=prot.filter(p=>p.ch).length,hasStop=prot.some((p,i)=>p.n=="СТОП"&&oc[i]&&codonAA(oc[i])!="СТОП"&&p.ch);if(hasStop)return "Нонсенс-мутация: ерте СТОП-кодон, ақуыз қысқарды";if(ch)return "Миссенс-мутация: амин қышқылы ауысты";return "Үнсіз мутация: ақуыз өзгермеді (код — артық, вырожденный)"}
function codeTable(){const b="UCAG";let h='<div class="ctable">';for(let i=0;i<4;i++){h+=`<div class="crow"><b>${b[i]}</b>`;for(let j=0;j<4;j++){h+='<div class="ccell">'+[0,1,2,3].map(k=>{const c=b[i]+b[k]+b[j];/* ретімен: 1-ші негіз қатар, 3-ші негіз баған */return ""}).join("")+"</div>"}h+="</div>"}
 /* қарапайым кесте: 64 кодонды 4 топқа бөлу */
 h='<div class="ctab">';for(let i=0;i<4;i++){h+='<div class="cgrp"><div class="gh">1-ші негіз: '+b[i]+'</div>'+b.split("").map((_,k)=>b.split("").map((_,j)=>{const c=b[i]+b[k]+b[j],a=codonAA(c);return `<span class="cc ${a=="СТОП"?"stop":a=="Met"?"start":""}"><b>${c}</b>${a}</span>`}).join("")).join("")+"</div>"}return h+"</div>"}
