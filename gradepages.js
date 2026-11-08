// 7–11 сынып беттері: тізім, бөлімдер, конспект және тест
const GN=[7,8,9,10,11];
const gKnown=g=>GCARDS.filter(c=>c.g==g&&S.box[c.id]&&S.box[c.id].n>=1).length;
const gTotal=g=>GCARDS.filter(c=>c.g==g).length;
function gradesPage(){return `<div class="page-head rise"><small class="kick">ОҚУЛЫҚ ҚҰРЫЛЫМЫ</small><h1>7–11 сынып</h1><p>Әр сынып бойынша тақырыптар: конспект түріндегі сұрақ-жауаптар, тест және флэш карталар. Барлығы ҰБТ-ға дайындыққа ыңғайлы.</p></div>
 <div class="ggrid">${GN.map((g,i)=>{const t=gTotal(g),k=gKnown(g),p=t?Math.round(k/t*100):0,best=S.ggr&&S.ggr[g];return `<a class="card gcard rise" style="--d:${i*60}ms" href="#/grade/${g}"><div class="gnum">${g}</div><div class="gmeta"><b>${g}-сынып</b><small>${GRADES[g].length} тақырып · ${t} сұрақ</small><div class="bar"><i data-w="${p}"></i></div><small>Меңгерілді: ${k} / ${t}${best!=null?` · аралас тест ${best}%`:""}</small></div><span class="garrow">→</span></a>`}).join("")}</div>
 <div class="row" style="margin-top:22px"><button onclick="S.cf='all';S.deck=null;save();go('/cards')">🃏 Барлық сыныптың карталары</button></div>`}
function gradePage(g){g=+g;const secs=GRADES[g];if(!secs)return "";const t=gTotal(g),k=gKnown(g);let ch="",html="";
 secs.forEach(s=>{if(s.ch!==ch){ch=s.ch;html+=`<h2 class="gch">${ch}</h2>`}const best=S.gsec&&S.gsec[s.id];
  html+=`<details class="card gsec rise" data-t="${(s.t+" "+s.cards.map(c=>c.q+" "+c.a).join(" ")).toLowerCase().replace(/"/g,"")}"><summary><span class="gt">${s.t}</span><span class="chip">${s.cards.length} сұрақ</span>${best!=null?`<span class="chip ${best>=80?"okc":""}">${best}%</span>`:""}</summary>
  <ul class="gnotes">${s.cards.map(c=>`<li><span class="gq">${c.q}</span><span class="ga">${c.a}</span></li>`).join("")}</ul>
  <div class="row"><button onclick="go('/quiz/gs/${s.id}')">🎯 Тест</button></div></details>`});
 return `<a class="link" href="#/grades">← Сыныптар</a><div class="page-head rise" style="margin-top:12px"><small class="kick">${g}-СЫНЫП</small><h1>${g}-сынып биология</h1><p>${secs.length} тақырып · ${t} сұрақ-жауап · меңгерілді ${k} / ${t}</p></div>
 <div class="row rise" style="--d:60ms"><button onclick="go('/quiz/gg/${g}')">🎓 Аралас тест (20 сұрақ)</button><button class="ghost" onclick="S.cf='${g}';S.deck=null;save();go('/cards')">🃏 ${g}-сынып карталары</button></div>
 <input class="search" id="gsearch" placeholder="Тақырып немесе термин іздеу..." oninput="gFilter(this.value)" style="margin-top:16px">${html}<div id="gnone" class="empty" hidden><p>Ештеңе табылмады</p></div>`}
window.gFilter=q=>{q=q.toLowerCase().trim();let n=0;document.querySelectorAll(".gsec").forEach(d=>{const ok=!q||d.dataset.t.includes(q);d.hidden=!ok;if(ok)n++;if(q&&ok)d.open=true;if(!q)d.open=false});document.querySelectorAll(".gch").forEach(h=>{let el=h.nextElementSibling,any=false;while(el&&!el.classList.contains("gch")){if(el.classList.contains("gsec")&&!el.hidden)any=true;el=el.nextElementSibling}h.hidden=!any});document.getElementById("gnone").hidden=n>0};
R["/grades"]=gradesPage;
const _dyn=window.dyn;window.dyn=h=>{const p=h.split("/").filter(Boolean);if(p[0]=="grade")return gradePage(p[1]);return _dyn(h)};
