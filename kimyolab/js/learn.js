// KimyoLab — darslar, zanjirlar va amaliy ishlar ro'yxati
(function(KL){
"use strict";
const $=KL.$,$$=KL.$$,S=()=>KL.S;
/* ---------- Darslar ---------- */
KL.tabs.lessons={
  init(el){this.el=el;this.ok={};this.render();},
  show(id){if(typeof id==="string"){const d=$(`#ls [data-l="${id}"]`);if(d){d.open=true;setTimeout(()=>d.scrollIntoView({behavior:"smooth",block:"start"}),60);}}},
  render(){
    const el=this.el,n=Object.keys(S().lessons).length;
    el.innerHTML=`<div class="head"><h2>📚 Darslar</h2><p class="sub">Qisqa nazariya va tekshiruv savollari. Barcha savollarga to'g'ri javob bersangiz, dars tugaydi (+20 XP).</p></div>
    <div class="prog big"><i style="width:${n/KL.LESSONS.length*100}%"></i></div><p class="mut">${n} / ${KL.LESSONS.length} dars tugatildi</p><div id="ls" class="acc"></div>`;
    $("#ls").innerHTML=KL.LESSONS.map((l,i)=>`<details class="item" data-l="${l.id}"><summary><span class="num">${i+1}</span><b>${l.t}</b>${S().lessons[l.id]?'<span class="done">✔</span>':""}</summary>
      <div class="body">${l.h}${l.pr?`<p><button class="btn pri sm" data-pr="${l.pr}">🥼 Laboratoriyada sinab ko'rish</button></p>`:""}<h4>Tekshiruv savollari</h4>
      ${l.q.map((q,qi)=>`<div class="qq"><p><b>${qi+1}.</b> ${q[0]}</p><div class="opts">${KL.shuffle([q[1],...q[2]]).map(o=>`<button class="opt" data-q="${qi}" data-o="${KL.esc(o)}">${o}</button>`).join("")}</div></div>`).join("")}</div></details>`).join("");
    $("#ls").onclick=e=>{
      const p=e.target.closest("[data-pr]");if(p){KL.go("lab",{practical:p.dataset.pr});return;}
      const b=e.target.closest(".opt");if(!b)return;const d=b.closest("[data-l]"),L=KL.LESSONS.find(x=>x.id===d.dataset.l),qi=+b.dataset.q,q=L.q[qi];
      if(b.closest(".opts").dataset.done)return;
      if(b.dataset.o===q[1]){b.classList.add("ok");b.closest(".opts").dataset.done=1;KL.sfx.ding();(this.ok[L.id]=this.ok[L.id]||new Set).add(qi);KL.addXP(3);
        if(this.ok[L.id].size===L.q.length&&!S().lessons[L.id]){S().lessons[L.id]=Date.now();KL.addXP(20,"📚 Dars tugatildi!");KL.checkAch();d.querySelector("summary").insertAdjacentHTML("beforeend",'<span class="done">✔</span>');}}
      else{b.classList.add("no");KL.sfx.err();}
    };
  }
};
/* ---------- Zanjirlar ---------- */
KL.tabs.chains={
  init(el){this.el=el;this.prog={};this.render();},
  render(){
    this.el.innerHTML=`<div class="head"><h2>🔗 O'zgarishlar zanjirlari</h2><p class="sub">Har bir o'zgarish uchun to'g'ri reagent yoki sharoitni tanlang. Tanlangach, reaksiya tenglamasi ko'rsatiladi.</p></div><div id="cl" class="cgrid"></div>`;
    $("#cl").onclick=e=>{
      const r=e.target.closest("[data-re]");if(r){this.prog[+r.dataset.re]=0;this.draw();return;}
      const b=e.target.closest(".opt");if(!b)return;const ci=+b.dataset.c,c=KL.CHAINS[ci],p=this.prog[ci]||0,st=c.steps[p];
      if(b.dataset.o===st[0]){this.prog[ci]=p+1;KL.sfx.ding();KL.addXP(4);
        if(this.prog[ci]>=c.steps.length&&!S().chains[ci]){S().chains[ci]=Date.now();KL.addXP(20,"🔗 Zanjir yechildi!");KL.checkAch();}
        this.draw();}
      else{b.classList.add("no");b.disabled=true;KL.sfx.err();}
    };
    this.draw();
  },
  draw(){
    const eqh=s=>{const[l,r]=s.split("=");return KL.fmt(l.trim())+" → "+KL.fmt(r.trim());};
    $("#cl").innerHTML=KL.CHAINS.map((c,ci)=>{const p=this.prog[ci]||0,done=p>=c.steps.length;
      const path=[c.start,...c.steps.map(s=>s[2])].map((f,i)=>`<span class="nd ${i<=p?"on":""}">${i<=p?KL.fmt(f):"?"}</span>`).join(`<span class="ar">→</span>`);
      let q="";if(!done){const st=c.steps[p],from=p?c.steps[p-1][2]:c.start;
        q=`<p>${KL.fmt(from)} → <b>${KL.fmt(st[2])}</b> uchun nima kerak?</p><div class="opts">${KL.shuffle([st[0],...st[1]]).map(o=>`<button class="opt" data-c="${ci}" data-o="${KL.esc(o)}">${KL.fmt(o)}</button>`).join("")}</div>`;}
      return`<div class="card chain"><div class="th"><b>${c.t}</b>${S().chains[ci]?'<span class="done">✔</span>':""}<span class="mut">${Math.min(p,c.steps.length)}/${c.steps.length}</span></div>
        <div class="path">${path}</div>${q}${p?`<ol class="eqs">${c.steps.slice(0,p).map(s=>`<li>${eqh(s[3])}</li>`).join("")}</ol>`:""}${done?`<button class="btn sm ghost" data-re="${ci}">↺ Qayta yechish</button>`:""}</div>`;}).join("");
  }
};
/* ---------- Amaliy ishlar ---------- */
KL.tabs.practicals={
  init(el){this.el=el;},
  show(){
    const n=Object.keys(S().prac).length;
    this.el.innerHTML=`<div class="head"><h2>🥼 Amaliy ishlar</h2><p class="sub">Darsliklardagi laboratoriya ishlari. «Boshlash» ni bosing — laboratoriyada har bir qadam avtomatik tekshiriladi (+40 XP).</p></div>
    <div class="prog big"><i style="width:${n/KL.PRACTICALS.length*100}%"></i></div><p class="mut">${n} / ${KL.PRACTICALS.length} amaliy ish bajarildi</p>
    <div class="pgrid">${KL.PRACTICALS.map((p,i)=>`<div class="card prac ${S().prac[p.id]?"done":""}"><div class="th"><span class="num">${i+1}</span><b>${p.t}</b>${S().prac[p.id]?'<span class="done">✔</span>':""}</div>
      <p>${p.goal}</p><details><summary>${p.steps.length} ta qadam</summary><ol>${p.steps.map(s=>`<li>${s.t}</li>`).join("")}</ol></details>
      <button class="btn pri" data-start="${p.id}">${S().prac[p.id]?"↺ Qayta bajarish":"▶ Boshlash"}</button></div>`).join("")}</div>`;
    this.el.onclick=e=>{const b=e.target.closest("[data-start]");if(b)KL.go("lab",{practical:b.dataset.start});};
  }
};
})(globalThis.KL=globalThis.KL||{});
