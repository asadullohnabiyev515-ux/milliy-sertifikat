// KimyoLab — favqulodda holatlar: aniqlash, effektlar, «Nima qilasiz?» savoli va Ustozning birinchi yordam yo'riqnomasi
(function(KL){
"use strict";
const $=KL.$;
const OK=1,NO=0;
KL.INCIDENTS={
 boom:{ic:"💥",t:"PORTLASH!",cls:"red",q:"Portlash sodir bo'ldi! Birinchi navbatda nima qilasiz?",
  opts:[["Spirtovkani o'chiraman, idishdan uzoqlashaman va darhol o'qituvchiga xabar beraman",OK,"To'g'ri! Avval xavf manbaini o'chirish, xavfsiz masofaga chiqish va kattalarga xabar berish kerak."],
   ["Singan shisha bo'laklarini qo'lim bilan yig'ib olaman",NO,"Xato: o'tkir shisha qo'lni kesadi. Shisha cho'tka va xokandoz bilan yig'iladi."],
   ["Hech narsa bo'lmagandek tajribani davom ettiraman",NO,"Xato: portlashdan keyin ish to'xtatiladi, jarohat va yong'in bor-yo'qligi tekshiriladi."],
   ["Idishga suv sepaman",NO,"Xato: avval issiqlik manbaini o'chirib, uzoqlashish kerak. Yonayotgan faol metall suvdan yana portlaydi."]],
  aid:["Issiqlik manbaini o'chiring va idishdan uzoqlashing.","O'zingizni va yoningizdagilarni tekshiring: shisha tegdimi, kuyish yoki kesilish bormi.","Kesilgan joyni toza suv bilan yuving, steril bint bilan bosib qonni to'xtating. Chuqur yaradagi shisha bo'lagini o'zingiz sug'urmang.","Ko'zga biror narsa tushsa — ko'z yuvgichda kamida 15 daqiqa yuving.","Singan shishani cho'tka va xokandoz bilan yig'ib, maxsus idishga tashlang."],
  pre:"Vodorod havo bilan «qaldiroq gaz» hosil qiladi: vodorod ajralayotganda alanga yaqinlashtirilmaydi, uni yondirishdan oldin tozaligi probirkada sinaladi. Faol metallar suvga faqat kichik bo'lakda tashlanadi."},
 fire:{ic:"🔥",t:"YONG'IN!",cls:"fire",q:"Idishdagi modda alangalandi! Nima qilasiz?",
  opts:[["Spirtovkani o'chirib, idishni namat (o't o'chiruvchi mato) bilan yopaman",OK,"To'g'ri! Kislorod kirmasa, olov o'chadi. Avval issiqlik manbaini o'chirish kerak."],
   ["Ustiga suv sepaman",NO,"Xato: yonayotgan organik suyuqlik suvdan sachrab, olov stol bo'ylab tarqaladi."],
   ["Puflab o'chiraman",NO,"Xato: puflash olovga kislorod beradi va alanga kuchayadi."],
   ["Yonayotgan idishni qo'lim bilan olib tashlayman",NO,"Xato: qo'l kuyadi, yonayotgan suyuqlik to'kilib yong'in tarqaladi."]],
  aid:["Issiqlik manbaini (spirtovkani) qopqog'i bilan o'chiring.","Yonayotgan idishni namat, qum yoki qopqoq bilan yoping — kislorod kirmasa, olov o'chadi.","Olov tarqalsa — o't o'chirgichni ishlating: plombani sug'uring, shlangni olov asosiga yo'naltiring, dastakni bosing.","Kiyim yonsa — yugurmang! Yerga yotib dumalang yoki namatga o'raning.","Katta yong'inda xonani tark eting, eshikni yoping va 101 ga qo'ng'iroq qiling."],
  pre:"Spirt, efir va boshqa yonuvchi suyuqliklar ochiq alangada qizdirilmaydi — suv hammomida isitiladi. Kuchli oksidlovchilar (KMnO₄) organik moddalar bilan aralashtirilmaydi."},
 naFire:{ic:"🔥",t:"NATRIY YONMOQDA!",cls:"fire",q:"Natriy suv ustida alangalandi! Qanday o'chirasiz?",
  opts:[["Quruq qum sepaman",OK,"To'g'ri! Faol metallar yong'ini faqat quruq qum yoki maxsus kukun bilan o'chiriladi."],
   ["Ustiga suv quyaman",NO,"Xato! Natriy suv bilan shiddatli reaksiyaga kirishadi — vodorod ajralib portlaydi."],
   ["Karbonat angidridli o't o'chirgich bilan o'chiraman",NO,"Xato: yonayotgan natriy CO₂ bilan ham reaksiyaga kirishadi. Faqat quruq qum!"],
   ["Puflab o'chiraman",NO,"Xato: kislorod ko'payib, alanga kuchayadi."]],
  aid:["Faol metallar (Na, K, Ca) yong'inini hech qachon suv bilan o'chirmang!","Quruq qum yoki maxsus kukun sepib, havoni to'sing.","Idishdan uzoqlashing — sachrayotgan ishqor terini kuydiradi.","Teringizga tegsa — ko'p suv bilan kamida 15 daqiqa yuving."],
  pre:"Natriy kerosin ostida saqlanadi va suvga faqat guruch donidek bo'lakda, himoya ekrani ortida tashlanadi."},
 burn:{ic:"♨️",t:"QO'L KUYDI!",cls:"red",q:"Qo'lingiz kuydi! Nima qilasiz?",
  opts:[["Kuygan joyni 10–20 daqiqa sovuq oqar suv ostida tutaman",OK,"To'g'ri! Sovuq oqar suv to'qimadagi issiqlikni olib, og'riq va shishni kamaytiradi."],
   ["Yog' yoki krem surtaman",NO,"Xato: yog' issiqlikni ushlab qoladi va infeksiyaga sabab bo'lishi mumkin."],
   ["Muz bosaman",NO,"Xato: muz qon tomirlarini toraytirib, to'qimani yanada shikastlaydi."],
   ["Pufakchalarni yorib qo'yaman",NO,"Xato: pufakcha yarani mikroblardan himoya qiladi, uni yormang."]],
  aid:["Kuygan joyni darhol 10–20 daqiqa sovuq (muzdek emas) oqar suv ostida tuting.","Uzuk, soat kabi narsalarni shish paydo bo'lishidan oldin yeching.","Toza, quruq steril bint bilan yengil yoping.","Yog', krem, tish pastasi surtmang; pufakchalarni yormang.","O'qituvchiga ayting; katta yoki chuqur kuyishda shifokorga murojaat qiling."],
  pre:"Qizdirilgan idishni qo'l bilan ushlamang — qisqich (tutqich) ishlating yoki sovishini kuting. Idishni yarmidan ortiq to'ldirib qizdirmang."},
 splash:{ic:"💦",t:"KIMYOVIY SACHRASH!",cls:"red",q:"Eritma sachrab, teringizga tegdi! Nima qilasiz?",
  opts:[["Darhol ko'p miqdorda oqar suv bilan kamida 15 daqiqa yuvaman",OK,"To'g'ri! Ko'p suv moddani suyultirib, teridan yuvib ketadi."],
   ["Ishqor (yoki kislota) bilan neytrallayman",NO,"Xato: neytrallanishda issiqlik ajraladi va kuyish kuchayadi. Avval faqat suv!"],
   ["Latta bilan artib qo'yaman",NO,"Xato: artganda modda teriga yanada surkaladi."],
   ["E'tibor bermayman — ozgina tegdi",NO,"Xato: kislota va ishqor sekin ta'sir qilib, chuqur kuyish beradi."]],
  aid:["Darhol ko'p miqdorda oqar suv bilan kamida 15 daqiqa yuving.","Ifloslangan kiyim va qo'lqopni ehtiyotkorlik bilan yeching.","Ko'zga tushsa — ko'zni ochiq tutib, ko'z yuvgichda 15 daqiqa yuving, ishqalamang.","O'qituvchiga ayting; zarur bo'lsa shifokorga murojaat qiling."],
  pre:"Idishni yarmidan ortiq to'ldirmang, reaktivlarni asta qo'shing va doim ko'zoynak taqing."},
 gas:{ic:"☠️",t:"ZAHARLI GAZ!",cls:"gas",q:"Xonaga zaharli gaz tarqalmoqda! Nima qilasiz?",
  opts:[["Jarayonni to'xtataman, derazani ochaman va toza havoga chiqaman",OK,"To'g'ri! Gaz manbaini to'xtatish va shamollatish eng muhim."],
   ["Qanday gaz ekanini bilish uchun hidlab ko'raman",NO,"Xato: zaharli gaz to'g'ridan-to'g'ri hidlanmaydi — bu zaharlanishga olib keladi."],
   ["Ishni davom ettiraman, hid tez yo'qoladi",NO,"Xato: xlor, NO₂, SO₂ nafas yo'llarini kuydiradi."],
   ["Eshik va derazalarni yopaman",NO,"Xato: gaz xonada to'planib, konsentratsiyasi ortadi."]],
  aid:["Gaz chiqarayotgan jarayonni (qizdirish, elektroliz) to'xtating.","Derazalarni oching, xonani shamollating.","Toza havoga chiqing; bosh og'risa, yo'tal yoki ko'ngil aynisa — o'qituvchiga ayting.","Hidni yelpib bilinadi: bug'ni qo'l bilan o'zingizga tomon yelping, to'g'ridan-to'g'ri hidlamang."],
  pre:"Xlor, brom, NO₂, SO₂ va ammiak ajraladigan tajribalar faqat mo'rili shkafda o'tkaziladi."},
 crack:{ic:"🩸",t:"SHISHA YORILDI!",cls:"red",q:"Qizigan idish yorilib, qo'lingiz kesildi! Nima qilasiz?",
  opts:[["Yarani toza suv bilan yuvib, steril bint bilan bosaman va o'qituvchiga aytaman",OK,"To'g'ri! Qonni bosib to'xtatish va yarani toza tutish kerak."],
   ["Shisha bo'lagini barmog'im bilan sug'urib olaman",NO,"Xato: chuqur kirgan shisha bo'lagini o'zingiz olmang — qon ketishi kuchayishi mumkin."],
   ["Yarani og'zim bilan so'raman",NO,"Xato: yaraga mikrob va kimyoviy moddalar tushadi."],
   ["Indamay ishni davom ettiraman",NO,"Xato: jarohatni darhol ko'rsatish kerak."]],
  aid:["Yarani toza oqar suv bilan yuving.","Steril bint yoki toza mato bilan bosib qonni to'xtating.","Chuqur kirgan shisha bo'lagini o'zingiz sug'urmang.","O'qituvchiga ayting; chuqur yarada shifokorga murojaat qiling.","Singan idishni cho'tka va xokandoz bilan yig'ing."],
  pre:"Qizigan quruq idishga sovuq suyuqlik quyilmaydi — harorat keskin o'zgarganda shisha yoriladi."}
};
KL.INC_TYPES=Object.keys(KL.INCIDENTS);
const DRILL={boom:"Vodorod olinayotgan kolba yoniga yonib turgan spirtovka keltirildi — vodorod-havo aralashmasi portladi.",fire:"Spirt solingan idish ochiq alangada qizdirildi — spirt bug'lari alangalandi.",
  naFire:"Katta natriy bo'lagi suvga tashlandi — natriy alangalandi.",burn:"Qizdirilgan idish qo'l bilan ushlandi.",splash:"Sulfat kislota tez quyilganda sachradi.",gas:"Xlor ajraladigan tajriba mo'rili shkafsiz o'tkazildi.",crack:"Qizigan quruq kolbaga sovuq suv quyildi."};

let active=null,timerI=null;
const api=()=>KL.lab.api;
function scr(cls,on){const s=$("#scene");if(s)s.classList.toggle(cls,on);}
// karta 3D sahnani to'smasligi uchun kamera ko'rinishi suriladi (telefonda — yuqoriga, kompyuterda — chapga)
function fit(){const D3=api()&&api().D3(),c=document.querySelector("#emg .emg-card");if(!D3)return;if(!c){D3.setSheet(0,0);return;}
  const port=innerWidth<760&&innerHeight>=500;D3.setSheet(port?c.offsetHeight:0,port?0:c.offsetWidth+10);}
KL.safety={
  get active(){return!!active;},
  trigger(type,info){
    info=info||{};
    if(active||(!info.drill&&KL.S.hazards===false))return false;
    const I=KL.INCIDENTS[type];if(!I)return false;
    active={type,info,I};
    const A=api(),V=A.V(),D3=A.D3();
    V.heat=false;if(type!=="gas")V.elec=false;
    A.closePanels();["#pop","#evt"].forEach(q=>{const e=document.querySelector(q);if(e)e.hidden=true;});
    if(D3){D3.teacherHelp();
      if(type==="boom"){D3.effect("explode",{power:info.power||1});KL.sfx.boom();}
      if(type==="crack"){D3.effect("crack",{col:info.col});D3.effect("flinch");KL.sfx.glass();}
      if(type==="fire"||type==="naFire"){D3.effect("fire",{k:.8,max:2.2,grow:.08});KL.sfx.whoosh();}
      if(type==="splash"){D3.effect("splash",{col:info.col,n:44});KL.sfx.splash();}
      if(type==="burn"){D3.effect("flinch");D3.effect("steam");if(info.boil)D3.effect("splash",{col:info.col,n:26});KL.sfx.sizzle();}
      if(type==="gas"){D3.effect("gas",{col:info.gcol});KL.sfx.cough();}
    }
    scr("fx-"+I.cls,true);if(type==="splash"||info.boil)scr("fx-drops",true);
    KL.sfx.alarm();
    setTimeout(()=>card(),info.delay||1200);
    return true;
  },
  // har kadr: xavfli vaziyatlarni aniqlash
  check(dt){
    if(active||KL.S.hazards===false)return;
    const A=api();if(!A)return;const V=A.V(),D3=A.D3();if(!V)return;
    const inc=V._inc||(V._inc={});
    // 1) vodorod + ochiq alanga
    const h2=V.gasTot.H2||0,dh=h2-(V._h2p||0);V._h2p=h2;
    if(V.heat&&dh>0)V._h2f=(V._h2f||0)+dh;else V._h2f=Math.max(0,(V._h2f||0)-dt*.03);
    if(!inc.boom&&V._h2f>.22){inc.boom=1;this.trigger("boom",{why:"Vodorod ajralib turgan paytda yonib turgan spirtovka bor edi — vodorod havo bilan «qaldiroq gaz» hosil qilib portladi."});return;}
    // 2) natriy suvda
    if(V.fired.m_Na_H2O&&!inc.na){inc.na=1;
      if(V._naBig)this.trigger("boom",{why:"Natriy juda ko'p (yoki eritma kislotali/issiq) edi — reaksiya shu qadar shiddatli bo'ldiki, ajralgan vodorod alangalanib portladi.",power:1.2,delay:900});
      else this.trigger("naFire",{why:"Natriy suv bilan shiddatli reaksiyaga kirishdi: ajralgan issiqlik vodorodni alangalatdi, natriy sariq alanga bilan yonmoqda."});return;}
    // 3) yonuvchi suyuqlik ochiq alangada
    const flam=["C2H5OH","CH3COOC2H5","CH3CHO"].find(id=>V.has(id));
    if(!inc.fire&&V.heat&&V.T>=62&&flam){inc.fire=1;const n=KL.MOLS[flam].n;this.trigger("fire",{why:`${n[0].toUpperCase()+n.slice(1)} bug'lari ochiq alangada alangalandi — yonuvchi suyuqliklar spirtovkada qizdirilmaydi!`});return;}
    // 4) KMnO4 + glitserin
    if(!inc.self&&V.fired.f_KMnO4gly&&V.T>=95){inc.self=1;this.trigger("fire",{why:"Kuchli oksidlovchi KMnO₄ glitserin bilan aralashib, o'z-o'zidan qizidi va alangalandi."});return;}
    // 5) to'la idish qaynab toshdi
    if(!inc.boil&&V.boil&&V.vol/V.cap>.7){inc.boil=1;const ph=V.pH(),cor=ph!=null&&(ph<3||ph>11),col=(V.color()||{}).c;
      this.trigger(cor?"splash":"burn",{why:cor?`Idish juda to'la edi — qaynayotgan ${ph<7?"kislotali":"ishqoriy"} eritma toshib, sachradi.`:"Idish juda to'la edi — qaynayotgan suyuqlik toshib, qo'lingizga sachradi.",boil:1,col});return;}
    // 6) ko'pik toshdi
    if(!inc.foam&&D3&&D3.foamOver){inc.foam=1;const ph=V.pH();
      if(ph!=null&&(ph<3.5||ph>10.5)){this.trigger("splash",{why:"Shiddatli gaz ajralishidan ko'pik idishdan toshib, sachradi.",col:(V.color()||{}).c});return;}
      KL.toast("⚠️ Ko'pik toshib ketdi — idishni yarmidan ortiq to'ldirmang.");}
    // 7) zaharli gaz
    let tox=0,g0=null;for(const g in V.gasTot){const G=KL.GASES[g];if(G&&G.tox){tox+=V.gasTot[g]*G.tox;if(!g0||G.tox*V.gasTot[g]>KL.GASES[g0].tox*V.gasTot[g0])g0=g;}}
    if(V.has("Br2")&&V.T>45){V._br=(V._br||0)+dt*.12;tox+=V._br;}
    if(!inc.gas&&tox>1.2){inc.gas=1;const G=KL.GASES[g0]||{n:"brom bug'lari",c:"#d98a2a"};
      this.trigger("gas",{why:`Ko'p miqdorda ${G.n} ajralib, xonaga tarqaldi — bunday tajribalar faqat mo'rili shkafda o'tkaziladi.`,gcol:G.c||"#c8d86a"});}
  },
  drill(){const t=KL.INC_TYPES[Math.random()*KL.INC_TYPES.length|0],col=t==="splash"?"#dcecf6":undefined;
    this.trigger(t,{drill:1,why:"Mashq: "+DRILL[t],col,gcol:"#cfe65a"});}
};
function card(){
  if(!active)return;const{type,info,I}=active,g=KL.S.gear;
  const ppe=[g.koz&&"ko'zoynak ko'zingizni",g.qol&&"qo'lqop qo'llaringizni",g.xalat&&"xalat kiyimingizni"].filter(Boolean);
  const opts=KL.shuffle(I.opts.map((o,i)=>[...o,i]));
  const d=document.createElement("div");d.id="emg";d.className="emg "+I.cls;
  d.innerHTML=`<div class="emg-card" role="alertdialog" aria-modal="true"><div class="emg-head"><span class="ic">${I.ic}</span><div><b>${I.t}</b><small>${info.drill?"Mashq · ":""}Favqulodda holat</small></div></div>
    <p class="cause"><b>Nima bo'ldi:</b> ${info.why||""}</p>${ppe.length?`<p class="ppe">🛡️ <b>Himoya:</b> ${ppe.join(", ")} himoya qildi.</p>`:""}
    <div class="emg-timer"><i></i></div><h4>${I.q}</h4>
    <div class="emg-opts">${opts.map(o=>`<button class="opt" data-i="${o[3]}">${o[0]}</button>`).join("")}</div>
    <div class="emg-fb" hidden></div>
    <div class="emg-aid" hidden><h4>🎓 Ustoz tushuntiradi</h4><ol>${I.aid.map(a=>`<li>${a}</li>`).join("")}</ol>${I.pre?`<p class="pre">🛑 <b>Oldini olish:</b> ${I.pre}</p>`:""}<button class="btn pri" id="emgOk">Tushundim</button></div></div>`;
  document.body.append(d);fit();
  const T=15;let left=T;const bar=d.querySelector(".emg-timer i");bar.style.width="100%";
  timerI=setInterval(()=>{left-=.1;bar.style.width=Math.max(0,left/T*100)+"%";if(left<=0)answer(-1);},100);
  d.querySelector(".emg-opts").onclick=e=>{const b=e.target.closest("[data-i]");if(b)answer(+b.dataset.i);};
  d.querySelector("#emgOk").onclick=finish;
}
function answer(i){
  if(!active||active.answered)return;active.answered=1;clearInterval(timerI);
  const{type,I}=active,d=$("#emg"),ok=i>=0&&I.opts[i][1]===OK;
  d.querySelectorAll(".emg-opts .opt").forEach(b=>{const k=+b.dataset.i;b.disabled=true;if(I.opts[k][1]===OK)b.classList.add("ok");else if(k===i)b.classList.add("no");});
  const fb=d.querySelector(".emg-fb");fb.hidden=false;fb.className="emg-fb "+(ok?"good":"bad");
  fb.innerHTML=i<0?"⏱ Vaqt tugadi! Favqulodda holatda tez va to'g'ri harakat qilish kerak.":(ok?"✅ ":"❌ ")+I.opts[i][2];
  resolve(type,ok,i);
  const S=KL.S;S.safety=S.safety||{n:0,ok:0,types:{}};S.safety.n++;if(ok){S.safety.ok++;S.safety.types[type]=1;KL.addXP(15);KL.sfx.ding();}else KL.sfx.err();
  KL.checkAch();
  setTimeout(()=>{const a=d.querySelector(".emg-aid");a.hidden=false;fit();a.scrollIntoView({block:"nearest",behavior:"smooth"});},ok?600:1400);
}
// tanlangan harakatning 3D dagi oqibati; noto'g'ri bo'lsa — keyin o'qituvchi to'g'ri usulni qo'llaydi
function resolve(type,ok,i){
  const D3=api().D3();if(!D3)return;const txt=i>=0?KL.INCIDENTS[type].opts[i][0]:"";
  if(type==="fire"){if(ok){D3.effect("blanket");KL.sfx.whoosh();}else{if(/suv/.test(txt))D3.effect("water");else if(/qo'lim/.test(txt))D3.effect("flinch");D3.effect("flare");setTimeout(()=>{D3.effect("blanket");KL.sfx.whoosh();},1700);}}
  if(type==="naFire"){if(ok)D3.effect("sand");else{if(/suv/.test(txt)){D3.effect("explode",{power:.5});KL.sfx.boom();}else if(/CO₂|o't o'chirgich/.test(txt))D3.effect("spray");D3.effect("flare");setTimeout(()=>D3.effect("sand"),1800);}}
  if(type==="gas"){const V=api().V();V.elec=false;V.heat=false;setTimeout(()=>D3.effect("gasClear"),ok?300:2500);}
}
function finish(){
  if(!active)return;const{type,info,I}=active;clearInterval(timerI);
  const d=$("#emg");if(d)d.remove();fit();
  ["fx-red","fx-fire","fx-gas","fx-drops"].forEach(c=>scr(c,false));
  const A=api(),D3=A.D3();
  if(D3){D3.effect("gasClear");D3.teacherHome();}
  if(["boom","crack","fire","naFire"].includes(type)){if(D3)D3.resetFx();A.newVessel();}
  else if(info.after==="clean"){A.newVessel();}
  A.chatSay(`<b>${I.ic} ${I.t.charAt(0)+I.t.slice(1).toLowerCase()}</b> — esda tuting:<ol>${I.aid.map(a=>`<li>${a}</li>`).join("")}</ol>`,"ai");
  active=null;
}
})(globalThis.KL=globalThis.KL||{});
