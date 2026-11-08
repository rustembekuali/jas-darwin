// 7–11 сынып деректерін талдау: бөлімдер, флэш карталар, тест сұрақтары (қате жауап нұсқалары автоматты)
window.GRADES={};window.GQ=[];window.GCARDS=[];window.GSEC={};
(function(){
 for(const g of [7,8,9,10,11]){const src=window.GRADE_SRC&&GRADE_SRC[g];if(!src)continue;const secs=[];let cur=null;
  src.split("\n").forEach(l=>{l=l.trim();if(!l)return;
   if(l[0]=="#"){const [ch,t]=l.slice(1).split("|");cur={id:`g${g}s${secs.length}`,g,ch:ch.trim(),t:(t||ch).trim(),cards:[],q:[]};secs.push(cur)}
   else if(l[0]=="?"&&cur){const i=l.indexOf("|");cur.cards.push({q:l.slice(1,i).trim(),a:l.slice(i+1).trim()})}});
  GRADES[g]=secs}
 for(const g in GRADES){const pool=GRADES[g].flatMap(s=>s.cards.map(c=>({a:c.a,sid:s.id,ch:s.ch})));
  GRADES[g].forEach(s=>{GSEC[s.id]=s;s.cards.forEach((c,i)=>{c.id=`${s.id}c${i}`;c.g=+g;c.sec=s.id;
   const L=c.a.length,ok=d=>d.a!==c.a&&!c.a.includes(d.a)&&!d.a.includes(c.a)&&Math.abs(d.a.length-L)<=Math.max(14,L*.8),loose=d=>d.a!==c.a,
    near=pool.filter(d=>d.sid==s.id&&ok(d)),chap=pool.filter(d=>d.ch==s.ch&&d.sid!=s.id&&ok(d)),any=pool.filter(d=>d.ch!=s.ch&&ok(d)),rest=pool.filter(loose),pick=[];
   const add=arr=>{const a=arr.slice().sort(()=>Math.random()-.5);for(const d of a){if(pick.length>=3)break;if(!pick.includes(d.a))pick.push(d.a)}};add(near);add(chap);add(any);add(rest);
   const q={id:c.id,tid:"g"+g,tt:g+"-сынып",g:+g,sec:s.id,q:c.q,o:[c.a,...pick],a:[0],e:"Дұрыс жауап: "+c.a+"."};
   s.q.push(q);GQ.push(q);GCARDS.push({id:c.id,topic:`${g}-сынып · ${s.t}`,q:c.q,a:c.a,g:+g})})})}
})();
