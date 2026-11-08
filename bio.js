// Тінтуірді қуалайтын тірі ағзалар: амеба, инфузория-туфелька, эвглена, бактерия, эритроцит
const TAU=Math.PI*2,wrapA=a=>{while(a>Math.PI)a-=TAU;while(a<-Math.PI)a+=TAU;return a};
const ORG=[
 {id:"amoeba",name:"Амеба",note:"жалған аяқпен қозғалады"},
 {id:"para",name:"Инфузория-туфелька",note:"кірпікшелерімен жүзеді"},
 {id:"euglena",name:"Эвглена жасыл",note:"талшығы мен хлоропласы бар"},
 {id:"bact",name:"Бактерия",note:"ядросы жоқ, талшықпен жүзеді"},
 {id:"rbc",name:"Эритроцит",note:"оттегін тасымалдайды"}];

/* ---------- ағзаларды сызу (бағыт: +x) ---------- */
function drawAmoeba(c,t,R,spd){const N=40;c.beginPath();
 for(let i=0;i<=N;i++){const a=i/N*TAU,r=R*(1+.1*Math.sin(3*a+t*1.7)+.08*Math.sin(5*a-t*2.2)+.05*Math.sin(2*a+t)+.34*Math.pow(Math.max(0,Math.cos(a)),3)*Math.min(1,spd*.18)+.1*Math.pow(Math.max(0,Math.cos(a-1.9)),6)*Math.sin(t*3)),x=r*Math.cos(a),y=r*Math.sin(a);i?c.lineTo(x,y):c.moveTo(x,y)}
 c.closePath();let g=c.createRadialGradient(-R*.2,-R*.2,R*.1,0,0,R*1.3);g.addColorStop(0,"rgba(167,243,208,.78)");g.addColorStop(.7,"rgba(45,170,150,.5)");g.addColorStop(1,"rgba(20,120,120,.38)");c.fillStyle=g;c.fill();c.lineWidth=2;c.strokeStyle="rgba(204,255,235,.9)";c.stroke();
 /* ядро */c.fillStyle="rgba(124,77,206,.9)";c.strokeStyle="rgba(221,200,255,.9)";c.lineWidth=1.5;c.beginPath();c.arc(-R*.12,R*.04,R*.3,0,TAU);c.fill();c.stroke();c.fillStyle="#f0abfc";c.beginPath();c.arc(-R*.18,R*.0,R*.1,0,TAU);c.fill();
 /* вакуольдер */for(let i=0;i<4;i++){const a=t*.35+i*1.6,px=Math.cos(a)*R*.55*(i%2?1:.8)+R*.1,py=Math.sin(a*1.2)*R*.45;c.fillStyle="rgba(230,255,250,.5)";c.strokeStyle="rgba(255,255,255,.7)";c.lineWidth=1;c.beginPath();c.arc(px,py,R*(.1+.03*(i%3)),0,TAU);c.fill();c.stroke()}
 c.fillStyle="rgba(190,242,100,.8)";for(let i=0;i<9;i++){const a=i*2.4+t*.2;c.beginPath();c.arc(Math.cos(a)*R*.65,Math.sin(a*1.3)*R*.5,1.6,0,TAU);c.fill()}}
function drawPara(c,t,R,spd){const L=R*2.5,W=R*1.05,N=54,pts=[];
 for(let i=0;i<N;i++){const u=i/N*TAU,bend=Math.sin(t*3)*.06*Math.cos(u),x=Math.cos(u)*L/2,y=Math.sin(u)*W/2*(1+.22*Math.cos(u))+bend*L*.2*Math.cos(u);pts.push([x,y,u])}
 c.strokeStyle="rgba(200,255,240,.75)";c.lineWidth=1.3;c.lineCap="round";
 for(const [x,y,u] of pts){const nx=Math.cos(u)*.9,ny=Math.sin(u),l=Math.hypot(nx,ny),w=Math.sin(t*9+u*7)*.5,len=R*.2;c.beginPath();c.moveTo(x,y);c.lineTo(x+(nx/l+w*-ny/l)*len,y+(ny/l+w*nx/l)*len);c.stroke()}
 c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();const g=c.createLinearGradient(-L/2,0,L/2,0);g.addColorStop(0,"rgba(110,200,255,.5)");g.addColorStop(1,"rgba(150,240,220,.62)");c.fillStyle=g;c.fill();c.lineWidth=2;c.strokeStyle="rgba(210,250,255,.9)";c.stroke();
 c.fillStyle="rgba(139,92,246,.9)";c.beginPath();c.ellipse(-L*.04,0,R*.34,R*.22,0,0,TAU);c.fill();c.fillStyle="#f0abfc";c.beginPath();c.arc(L*.07,R*.02,R*.07,0,TAU);c.fill();
 for(const sx of [-.3,.3]){const p=1+Math.sin(t*2.5+sx*9)*.25;c.fillStyle="rgba(255,255,255,.4)";c.strokeStyle="rgba(255,255,255,.85)";c.lineWidth=1;c.beginPath();c.arc(L*sx,0,R*.16*p,0,TAU);c.fill();c.stroke();for(let k=0;k<6;k++){const a=k*TAU/6;c.beginPath();c.moveTo(L*sx+Math.cos(a)*R*.2*p,Math.sin(a)*R*.2*p);c.lineTo(L*sx+Math.cos(a)*R*.34,Math.sin(a)*R*.34);c.stroke()}}
 c.strokeStyle="rgba(10,60,80,.55)";c.lineWidth=2;c.beginPath();c.moveTo(L*.3,-W*.25);c.quadraticCurveTo(L*.1,-W*.05,L*.0,W*.18);c.stroke();
 c.fillStyle="rgba(251,191,36,.85)";for(let i=0;i<3;i++){c.beginPath();c.arc(-L*.12+i*R*.35,(i%2?1:-1)*R*.28,R*.07,0,TAU);c.fill()}}
function drawEuglena(c,t,R,spd){const L=R*2.7,W=R*.9,N=22,top=[],bot=[];
 for(let i=0;i<=N;i++){const s=i/N,x=-L/2+s*L,w=W/2*Math.pow(Math.max(0,1-Math.pow(2*s-1,2)),.6)*(s<.25?1:1),und=Math.sin(t*4.5+s*5)*R*.07*(1-s*.2);top.push([x,-w+und]);bot.push([x,w+und])}
 c.beginPath();top.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));for(let i=N;i>=0;i--)c.lineTo(bot[i][0],bot[i][1]);c.closePath();
 const g=c.createLinearGradient(0,-W/2,0,W/2);g.addColorStop(0,"rgba(132,204,22,.8)");g.addColorStop(1,"rgba(34,150,60,.7)");c.fillStyle=g;c.fill();c.lineWidth=2;c.strokeStyle="rgba(217,249,157,.95)";c.stroke();
 c.fillStyle="rgba(21,128,61,.95)";for(let i=0;i<8;i++){const x=-L*.36+i*L*.085,y=Math.sin(i*2.1)*R*.22;c.beginPath();c.ellipse(x,y,R*.11,R*.07,i,0,TAU);c.fill()}
 c.fillStyle="rgba(124,77,206,.9)";c.beginPath();c.arc(-L*.08,0,R*.2,0,TAU);c.fill();
 c.fillStyle="#ef4444";c.beginPath();c.arc(L*.34,-R*.14,R*.075,0,TAU);c.fill();
 c.strokeStyle="rgba(253,224,71,.95)";c.lineWidth=2.2;c.lineCap="round";c.beginPath();const len=L*.95;for(let s=0;s<=len;s+=3){const x=L/2+s,y=Math.sin(s*.16-t*13)*R*.28*Math.min(1,s/(len*.4));s?c.lineTo(x,y):c.moveTo(x,y)}c.stroke()}
function drawBact(c,t,R,spd){const L=R*2.3,W=R*.8,r=W/2;
 c.strokeStyle="rgba(251,207,232,.85)";c.lineWidth=2.1;c.lineCap="round";
 for(let k=0;k<5;k++){const a0=Math.PI+(k-2)*.34;c.beginPath();for(let s=0;s<=R*2.4;s+=3){const bx=-L/2+Math.cos(a0)*s*1,by=Math.sin(a0)*s*.9+Math.sin(s*.22-t*11+k)*R*.18*Math.min(1,s/(R*1.1));s?c.lineTo(bx,by):c.moveTo(bx,by)}c.stroke()}
 c.lineWidth=1;c.strokeStyle="rgba(186,230,253,.7)";for(let i=0;i<16;i++){const x=-L/2+r+i*(L-2*r)/15;for(const sy of[-1,1]){c.beginPath();c.moveTo(x,sy*r);c.lineTo(x+1.5,sy*(r+R*.14));c.stroke()}}
 c.beginPath();c.moveTo(-L/2+r,-r);c.lineTo(L/2-r,-r);c.arc(L/2-r,0,r,-Math.PI/2,Math.PI/2);c.lineTo(-L/2+r,r);c.arc(-L/2+r,0,r,Math.PI/2,Math.PI*1.5);c.closePath();
 const g=c.createLinearGradient(0,-r,0,r);g.addColorStop(0,"rgba(125,211,252,.7)");g.addColorStop(1,"rgba(14,116,144,.6)");c.fillStyle=g;c.fill();c.lineWidth=2.4;c.strokeStyle="rgba(224,242,254,.95)";c.stroke();
 c.strokeStyle="rgba(251,113,133,.95)";c.lineWidth=2;c.beginPath();for(let i=0;i<=24;i++){const x=-L*.22+i*L*.019,y=Math.sin(i*.9+t*1.5)*r*.4+Math.sin(i*.37)*r*.15;i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();
 c.fillStyle="rgba(190,242,100,.9)";for(let i=0;i<6;i++){c.beginPath();c.arc(L*.15+i*R*.09,Math.sin(i*2.7)*r*.55,1.7,0,TAU);c.fill()}
 c.strokeStyle="rgba(240,171,252,.95)";c.lineWidth=1.8;c.beginPath();c.arc(L*.3,r*.1,r*.32,0,TAU);c.stroke()}
function drawRBC(c,t,R){const sx=.3+.7*Math.abs(Math.cos(t*1.6));c.save();c.rotate(Math.sin(t*.8)*.6);c.scale(sx,1);
 let g=c.createRadialGradient(0,0,R*.1,0,0,R*.95);g.addColorStop(0,"#b91c1c");g.addColorStop(.45,"#dc2626");g.addColorStop(.85,"#ef4444");g.addColorStop(1,"#fca5a5");c.fillStyle=g;c.beginPath();c.arc(0,0,R*.9,0,TAU);c.fill();c.lineWidth=2;c.strokeStyle="rgba(254,202,202,.9)";c.stroke();
 g=c.createRadialGradient(0,0,0,0,0,R*.5);g.addColorStop(0,"rgba(127,29,29,.85)");g.addColorStop(1,"rgba(127,29,29,0)");c.fillStyle=g;c.beginPath();c.arc(0,0,R*.5,0,TAU);c.fill();
 c.fillStyle="rgba(255,255,255,.35)";c.beginPath();c.ellipse(-R*.35,-R*.4,R*.22,R*.1,-.6,0,TAU);c.fill();c.restore()}
const DRAW={amoeba:drawAmoeba,para:drawPara,euglena:drawEuglena,bact:drawBact,rbc:drawRBC};
function drawMicro(c,t,r,k){ // ұсақ ілеспе микробтар
 if(k%2){c.beginPath();c.moveTo(-r,-r*.4);c.lineTo(r,-r*.4);c.arc(r,0,r*.4,-Math.PI/2,Math.PI/2);c.lineTo(-r,r*.4);c.arc(-r,0,r*.4,Math.PI/2,Math.PI*1.5);c.closePath();c.fillStyle="rgba(125,211,252,.5)";c.fill();c.strokeStyle="rgba(224,242,254,.9)";c.lineWidth=1.2;c.stroke();
  c.strokeStyle="rgba(251,207,232,.8)";c.beginPath();for(let s=0;s<=r*2;s+=2){const x=-r*1.3-s,y=Math.sin(s*.5-t*12)*2.4;s?c.lineTo(x,y):c.moveTo(x,y)}c.stroke()}
 else{c.beginPath();c.arc(0,0,r,0,TAU);const g=c.createRadialGradient(-r*.3,-r*.3,0,0,0,r);g.addColorStop(0,"rgba(209,250,229,.75)");g.addColorStop(1,"rgba(52,211,153,.4)");c.fillStyle=g;c.fill();c.strokeStyle="rgba(209,250,229,.9)";c.lineWidth=1.2;c.stroke();c.fillStyle="rgba(167,139,250,.9)";c.beginPath();c.arc(r*.15,0,r*.35,0,TAU);c.fill()}}

/* ---------- тінтуірді қуалау ---------- */
const BioCursor={cv:null,ctx:null,d:1,mx:0,my:0,seen:false,hover:false,alpha:0,tAlpha:0,idx:0,pop:0,last:0,rm:false,parts:[],
 start(){if(this.cv)return;const cv=this.cv=document.createElement("canvas");cv.id="biocur";cv.setAttribute("aria-hidden","true");document.body.append(cv);this.ctx=cv.getContext("2d");
  const tag=this.tag=document.createElement("div");tag.className="biocur-tag";document.body.append(tag);
  const rs=()=>{const d=this.d=Math.min(2,devicePixelRatio||1);cv.width=innerWidth*d;cv.height=innerHeight*d};rs();addEventListener("resize",rs);
  const mk=(lag,r,k)=>({x:0,y:0,h:0,lag,r,k,ph:Math.random()*6});this.lastMove=performance.now();this.quiet=false;
  this.main={x:0,y:0,h:0,vx:0,vy:0};this.trail=[0,1,2,3].map(i=>mk(.045-i*.008,8-i*1,i));
  const move=e=>{this.mx=e.clientX;this.my=e.clientY;this.lastMove=performance.now();
   if(!this.seen){this.seen=true;const m=this.main;m.x=this.mx;m.y=this.my;this.trail.forEach(q=>{q.x=this.mx;q.y=this.my});this.say("Бос жерді бас: ағза ауысады")}
   const t=e.target;this.hover=!!(t&&t.closest&&t.closest("a,button,input,select,summary,.acard,.opt,.day,[onclick]"));this.quiet=!!(t&&t.closest&&t.closest("input,textarea,select,.ltext,.qtext,.opt,.qcard,.lesson-step,.rev,.tipbox"))};
  addEventListener("pointermove",move,{passive:true});
  addEventListener("pointerdown",e=>{const was=this.seen;move(e);if(was&&!this.hover)this.next()},{passive:true});
  document.documentElement.addEventListener("mouseleave",()=>{this.out=true});document.documentElement.addEventListener("mouseenter",()=>{this.out=false});
  this.rm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tick=t=>{const dt=Math.min(.05,(t-this.last)/1000||.016);this.last=t;if(!document.hidden)this.frame(dt,t/1000);requestAnimationFrame(tick)};requestAnimationFrame(tick)},
 next(){this.idx=(this.idx+1)%ORG.length;const o=ORG[this.idx];this.pop=.6;this.say(o.name+" · "+o.note)},
 say(t){const g=this.tag;g.textContent=t;g.classList.add("on");clearTimeout(this._tg);this._tg=setTimeout(()=>g.classList.remove("on"),2400)},
 frame(dt,t){const {ctx,cv,d,main,trail}=this;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);if(!this.seen)return;
  const idle=(performance.now()-this.lastMove)>1600;this.tAlpha=this.out?0:this.quiet?.16:idle?.26:.62;this.alpha+=(this.tAlpha-this.alpha)*Math.min(1,dt*2.2);if(this.alpha<.02)return;ctx.setTransform(d,0,0,d,0,0);
  const k=Math.min(1.6,dt*60),px=main.x,py=main.y,off=this.hover?20:54,tx=this.mx-Math.cos(main.h)*off,ty=this.my-Math.sin(main.h)*off;main.x+=(tx-main.x)*.045*k;main.y+=(ty-main.y)*.045*k;
  const vx=main.x-px,vy=main.y-py,sp=Math.hypot(vx,vy);main.vx=vx;main.vy=vy;
  if(sp>.3)main.h+=wrapA(Math.atan2(vy,vx)-main.h)*Math.min(1,.06*k);else main.h+=Math.sin(t*.7)*.004;
  this.pop*=.9;const sc=.6+this.pop*.5;const id=ORG[this.idx].id;
  /* көпіршіктер */
  if(sp>2.6&&this.parts.length<14&&!this.rm&&Math.random()<.25)this.parts.push({x:main.x-Math.cos(main.h)*30,y:main.y-Math.sin(main.h)*30,vx:(Math.random()-.5)*20,vy:-10-Math.random()*22,r:1.5+Math.random()*3.5,life:1});
  for(let i=this.parts.length-1;i>=0;i--){const q=this.parts[i];q.life-=dt*.8;if(q.life<=0){this.parts.splice(i,1);continue}q.x+=q.vx*dt;q.y+=q.vy*dt;ctx.globalAlpha=q.life*.4*this.alpha;ctx.strokeStyle="rgba(190,255,235,.9)";ctx.fillStyle="rgba(190,255,235,.15)";ctx.lineWidth=1;ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,TAU);ctx.fill();ctx.stroke()}
  /* із: ұсақ микробтар */
  let prev=main;for(let i=0;i<trail.length;i++){const q=trail[i];q.x+=(prev.x-q.x)*q.lag*k*4;q.y+=(prev.y-q.y)*q.lag*k*4;const dx=prev.x-q.x,dy=prev.y-q.y;if(Math.hypot(dx,dy)>.5)q.h+=wrapA(Math.atan2(dy,dx)-q.h)*.15;prev=q}
  for(let i=trail.length-1;i>=0;i--){const q=trail[i],wob=this.rm?0:Math.sin(t*2+q.ph)*3;ctx.save();ctx.globalAlpha=(.95-i*.12)*this.alpha;ctx.translate(q.x,q.y+wob);ctx.rotate(q.h);drawMicro(ctx,t+q.ph,q.r,q.k);ctx.restore()}
  /* негізгі ағза */
  const bob=this.rm?0:Math.sin(t*2)*2.5,gx=main.x,gy=main.y+bob;
  ctx.save();ctx.globalAlpha=this.alpha;ctx.translate(gx,gy);ctx.rotate(id=="rbc"?0:main.h);ctx.scale(sc,sc);DRAW[id](ctx,this.rm?0:t,34,sp);ctx.restore();
  this.tag.style.transform=`translate(${main.x+34}px,${main.y+22}px)`}};
