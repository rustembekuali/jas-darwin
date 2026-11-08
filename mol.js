// Биомолекулалар: 3D шар-таяқша модельдері, фонда жүзетін молекулалар және зертханалық көрсеткіш
const EL={H:{r:.31,v:.28,c:"#f1f5f9"},C:{r:.76,v:.62,c:"#94a3b8"},N:{r:.71,v:.6,c:"#60a5fa"},O:{r:.66,v:.57,c:"#fb7185"},P:{r:1.07,v:.82,c:"#fb923c"}};
const v3={sub:(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],add:(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],mul:(a,k)=>[a[0]*k,a[1]*k,a[2]*k],len:a=>Math.hypot(a[0],a[1],a[2]),nrm:a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l]}};

/* ---- молекулалар құрастыру ---- */
function glucose(){const A=[],R=1.45,ring=[],th=i=>i*Math.PI/3;
 const names=["C","C","C","C","C","O"];
 for(let i=0;i<6;i++){const s=i%2?-1:1;ring.push({i,t:th(i),s,p:[R*Math.cos(th(i)),R*Math.sin(th(i)),.25*s]});A.push([names[i],...ring[i].p])}
 const add=(el,p)=>{A.push([el,...p]);return A.length-1};
 const eq=(r,l)=>v3.add(r.p,v3.mul(v3.nrm([Math.cos(r.t)*.94,Math.sin(r.t)*.94,-r.s*.33]),l));
 const hyd=(op,r,k)=>{const t=[-Math.sin(r.t),Math.cos(r.t),0],u=[Math.cos(r.t),Math.sin(r.t),0];return v3.add(op,v3.mul(v3.nrm(v3.add(v3.add(v3.mul(u,.45),v3.mul(t,.75*k)),[0,0,-r.s*.25])),.96))};
 for(let i=0;i<5;i++){const r=ring[i];add("H",v3.add(r.p,[0,0,r.s*1.09]));
  if(i<4){const o=eq(r,1.43);const op=A[add("O",o)].slice(1);add("H",hyd(op,r,i%2?1:-1))}
  else{const c6=eq(r,1.53);const ci=add("C",c6);const u=[Math.cos(r.t),Math.sin(r.t),0],t=[-Math.sin(r.t),Math.cos(r.t),0];
   const o6=v3.add(c6,v3.add(v3.mul(u,.85),[0,0,r.s*.15]));const oi=add("O",v3.add(c6,v3.mul(v3.nrm(v3.add(v3.mul(u,.9),v3.mul(t,.35))),1.43)));
   add("H",v3.add(c6,v3.add(v3.mul(t,-.95),[0,.1,.55*r.s])));add("H",v3.add(c6,v3.add(v3.mul(u,.3),v3.add(v3.mul(t,.7),[0,0,-.8*r.s]))));
   add("H",v3.add(A[oi].slice(1),[0,.2,.9]))}}
 return A}
function atp(){const A=[];const a=(el,x,y,z=0)=>{A.push([el,x,y,z]);return A.length-1};const cx=-6.2;
 [["C",30],["C",90],["N",150],["C",210],["N",270],["C",330]].forEach(([e,d])=>a(e,cx+1.4*Math.cos(d*Math.PI/180),1.4*Math.sin(d*Math.PI/180)));
 a("N",cx,2.75);a("N",cx+2.45,1.1);a("C",cx+3.2,0);a("N",cx+2.45,-1.1);
 const c=[-2.2,-3.4];[144,216,288,0,72].forEach((d,i)=>a(i==4?"O":"C",c[0]+1.25*Math.cos(d*Math.PI/180),c[1]+1.25*Math.sin(d*Math.PI/180)));
 a("O",-4.3,-4.7);a("O",-1.9,-5.9);a("C",-.2,-4.4);a("O",.95,-3.9);
 [2.5,5.2,7.9].forEach((x,i)=>{a("P",x,-3.9);a("O",x,-2.4);a("O",x,-5.4);a("O",x,-3.9,1.5);if(i<2)a("O",x+1.35,-3.9)});
 return A}
window.MOLS=[
{id:"h2o",name:"Су",f:"H₂O",role:"Жасушаның 70–80%-ын құрайды. Полярлы молекула, сутектік байланыс түзеді; еріткіш, жылу реттегіш, фотосинтездің бастапқы заты.",facts:["Бұрыш: ≈104,5°","Су молекулалары сутектік байланыспен тартылады","Фотолизде O₂ бөлінеді"],atoms:[["O",0,0,0],["H",.76,.59,0],["H",-.76,.59,0]]},
{id:"o2",name:"Оттегі",f:"O₂",role:"Аэробты тыныс алуда соңғы электрон акцепторы. Фотосинтезде судың фотолизінен бөлінеді, эритроцит гемоглобині тасымалдайды.",facts:["Қос байланыс O=O","Митохондрияда суға айналады","Атмосфераның ~21%-ы"],atoms:[["O",-.6,0,0],["O",.6,0,0]]},
{id:"co2",name:"Көмірқышқыл газы",f:"CO₂",role:"Фотосинтездің бастапқы заты (Кальвин циклі), тыныс алу мен ашудың соңғы өнімі. Сызықты, полярсыз молекула.",facts:["Құрылымы: O=C=O","Өсімдік устьицалары арқылы кіреді","Көміртек айналымының негізі"],atoms:[["O",-1.16,0,0],["C",0,0,0],["O",1.16,0,0]]},
{id:"glu",name:"Глюкоза (β-D-глюкопираноза)",f:"C₆H₁₂O₆",role:"Негізгі энергия көзі, фотосинтез өнімі. Крахмал, гликоген және целлюлозаның мономері. 1 г глюкозадан 17,6 кДж энергия бөлінеді.",facts:["Моносахарид, гексоза","Қанда қалыпты мөлшері 3,3–5,5 ммоль/л","Тотыққанда CO₂ + H₂O + АТФ түзіледі"],atoms:glucose()},
{id:"gly",name:"Глицин (амин қышқылы)",f:"NH₂–CH₂–COOH",role:"Ең қарапайым амин қышқылы (радикалы — H). Амин (–NH₂) және карбоксил (–COOH) топтары бар; пептидтік байланыс түзіп ақуыз құрайды.",facts:["Ақуыздағы 20 амин қышқылының бірі","Амфотерлі қосылыс","Пептидтік байланыс: –CO–NH–"],atoms:[["N",-1.25,.25,0],["H",-1.75,1.05,.3],["H",-1.8,-.5,-.3],["C",0,-.55,0],["H",.05,-1.2,.85],["H",.05,-1.2,-.85],["C",1.25,.3,0],["O",1.25,1.52,.05],["O",2.4,-.4,-.05],["H",3.1,.2,0]]},
{id:"atp",name:"АТФ (схема)",f:"C₁₀H₁₆N₅O₁₃P₃",role:"Универсал энергия көзі. Аденин + рибоза + 3 фосфат қалдығы. Макроэргиялық байланыстар ыдырағанда энергия бөлінеді; митохондрияда синтезделеді.",facts:["Схемада H атомдары көрсетілмеген","АТФ → АДФ + Ф + энергия (~40 кДж/моль)","Жасушада күніне көп рет қайта түзіледі"],atoms:atp()}
];
/* ---- байланыстарды автоматты анықтау ---- */
MOLS.forEach(m=>{const c=m.atoms.reduce((s,a)=>[s[0]+a[1],s[1]+a[2],s[2]+a[3]],[0,0,0]).map(x=>x/m.atoms.length);
 m.atoms=m.atoms.map(a=>[a[0],a[1]-c[0],a[2]-c[1],a[3]-c[2]]);m.rad=Math.max(...m.atoms.map(a=>Math.hypot(a[1],a[2],a[3])))+.9;m.bonds=[];
 for(let i=0;i<m.atoms.length;i++)for(let j=i+1;j<m.atoms.length;j++){const a=m.atoms[i],b=m.atoms[j],d=Math.hypot(a[1]-b[1],a[2]-b[2],a[3]-b[3]),s=EL[a[0]].r+EL[b[0]].r;
  if(a[0]=="H"&&b[0]=="H")continue;if(d<s*1.25){const dbl="CNO".includes(a[0])&&"CNO".includes(b[0])&&d<s*.92;m.bonds.push([i,j,dbl?2:1])}}});

const ZOOM={h2o:1.55,o2:1.5,co2:1.5,glu:1.65,gly:1.4,atp:1.5};MOLS.forEach(x=>x.zoom=ZOOM[x.id]||1);
/* ---- рендер ---- */
function drawMol(ctx,m,W,H,o){const {yaw=0,pitch=.4,scale=1,labels=false,fill=false,alpha=1,cx=W/2,cy=H/2,dpr=1}=o,k=Math.min(W,H)*.46/m.rad*scale,f=m.rad*4.2;
 const cy_=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
 const P=m.atoms.map(a=>{let x=a[1]*cy_+a[3]*sy,z=-a[1]*sy+a[3]*cy_,y=a[2]*cp-z*sp;z=a[2]*sp+z*cp;const s=f/(f+z);return{x:cx+x*k*s,y:cy+y*k*s,z,s,e:a[0]}});
 const items=[];
 m.bonds.forEach(([i,j,od])=>{items.push({z:(P[i].z+P[j].z)/2-.01,t:0,i,j,od})});P.forEach((p,i)=>items.push({z:p.z,t:1,i}));
 items.sort((a,b)=>b.z-a.z);ctx.save();ctx.globalAlpha=alpha;ctx.lineCap="round";
 for(const it of items){
  if(it.t==0){const A=P[it.i],B=P[it.j],mx=(A.x+B.x)/2,my=(A.y+B.y)/2,w=Math.max(1.2,k*.072*(A.s+B.s)/2),dx=B.x-A.x,dy=B.y-A.y,l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,offs=it.od==2?[-.55,.55]:[0];
   for(const od of offs){const ox=nx*w*od*1.1,oy=ny*w*od*1.1;
    ctx.lineWidth=it.od==2?w*.7:w;ctx.strokeStyle=EL[A.e].c;ctx.beginPath();ctx.moveTo(A.x+ox,A.y+oy);ctx.lineTo(mx+ox,my+oy);ctx.stroke();
    ctx.strokeStyle=EL[B.e].c;ctx.beginPath();ctx.moveTo(mx+ox,my+oy);ctx.lineTo(B.x+ox,B.y+oy);ctx.stroke()}}
  else{const p=P[it.i],el=EL[p.e],r=el.v*k*(fill?.95:.46)*p.s,sp=sprite(p.e,r,dpr),sz=(sp.k*2+2)/dpr;ctx.drawImage(sp.c,p.x-sz/2,p.y-sz/2,sz,sz);
   if(labels&&r>6.5){ctx.fillStyle="#06241b";ctx.font=`800 ${Math.max(9,r*.9)}px Nunito,sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(p.e,p.x,p.y+.5)}}}
 ctx.restore()}
const _sp={};function sprite(el,r,d){const k=Math.max(2,Math.round(r*d)),key=el+":"+k;if(_sp[key])return _sp[key];const s=k*2+2,c=document.createElement("canvas");c.width=c.height=s;const x=c.getContext("2d"),g=x.createRadialGradient(k*.65+1,k*.65+1,k*.1,k+1,k+1,k),col=EL[el].c;g.addColorStop(0,"#fff");g.addColorStop(.25,col);g.addColorStop(1,shade(col));x.fillStyle=g;x.beginPath();x.arc(k+1,k+1,k,0,7);x.fill();return _sp[key]={c,k}}
const _sh={};function shade(c){if(_sh[c])return _sh[c];const n=parseInt(c.slice(1),16),r=(n>>16)*.45|0,g=(n>>8&255)*.45|0,b=(n&255)*.45|0;return _sh[c]=`rgb(${r},${g},${b})`}

/* ---- зертханалық көрсеткіш ---- */
const MolLab={id:"glu",auto:true,labels:true,fill:false,yaw:.6,pit:.45,drag:null,raf:0,
 stop(){cancelAnimationFrame(this.raf);this.raf=0},
 html(){const m=MOLS.find(x=>x.id==this.id);
  return `<div class="molgrid"><div><div class="card lab-card"><canvas id="molcv" width="720" height="480"></canvas><div class="lab-hint">🖱️ Сүйреп айналдыр</div></div>
  <div class="row lab-ctl"><button class="ghost ${this.auto?"sel":""}" onclick="MolLab.set('auto')">⟳ Автоайналу</button><button class="ghost ${this.labels?"sel":""}" onclick="MolLab.set('labels')">🔤 Атом белгілері</button><button class="ghost ${this.fill?"sel":""}" onclick="MolLab.set('fill')">${this.fill?"🟣 Кеңістік толтыру":"⚪ Шар-таяқша"}</button></div>
  <div class="legend"><span><i style="background:${EL.C.c}"></i>C көміртек</span><span><i style="background:${EL.H.c}"></i>H сутек</span><span><i style="background:${EL.O.c}"></i>O оттегі</span><span><i style="background:${EL.N.c}"></i>N азот</span><span><i style="background:${EL.P.c}"></i>P фосфор</span></div></div>
  <div><div class="chips molchips">${MOLS.map(x=>`<button class="ghost ${x.id==this.id?"sel":""}" onclick="MolLab.pick('${x.id}')">${x.name.split(" (")[0]}</button>`).join("")}</div>
  <div class="card" style="margin-top:12px"><small class="kick">БИОМОЛЕКУЛА</small><h2 style="margin:0">${m.name}</h2><div class="formula">${m.f}</div><p class="ltext" style="font-size:16px;margin-top:8px">${m.role}</p><ul class="facts">${m.facts.map(f=>`<li>${f}</li>`).join("")}</ul><small>${m.atoms.length} атом · ${m.bonds.length} байланыс</small></div></div></div>`},
 set(k){this[k]=!this[k];route()},pick(id){this.id=id;route()},
 init(){const c=document.getElementById("molcv");if(!c)return;if(innerWidth<700){c.width=420;c.height=460}const ctx=c.getContext("2d"),self=this,m=MOLS.find(x=>x.id==this.id);
  c.onpointerdown=e=>{self.drag=[e.clientX,e.clientY];c.setPointerCapture(e.pointerId)};c.onpointermove=e=>{if(!self.drag)return;self.yaw+=(e.clientX-self.drag[0])*.012;self.pit=Math.max(-1.2,Math.min(1.2,self.pit+(e.clientY-self.drag[1])*.008));self.drag=[e.clientX,e.clientY]};c.onpointerup=()=>self.drag=null;
  const loop=()=>{if(self.auto&&!self.drag)self.yaw+=.011;ctx.clearRect(0,0,c.width,c.height);drawMol(ctx,m,c.width,c.height,{yaw:self.yaw,pitch:self.pit,labels:self.labels,fill:self.fill,scale:m.zoom,dpr:1});self.raf=requestAnimationFrame(loop)};this.stop();loop()}};
