// KimyoLab — odam modeli (o'quvchi va o'qituvchi): oddiy shakllardan, yurish va qo'l harakati animatsiyasi bilan
(function(KL){
"use strict";
KL.makeHuman=function(o){
  o=o||{};
  const M=(c,x)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.78},x||{}));
  const mats={skin:M(o.skin||0xe0b08a,{roughness:.62}),shirt:M(o.shirt||0x3d6fb5),pants:M(o.pants||0x2f3640),shoe:M(0x1c1c1c,{roughness:.45}),
    hair:M(o.hair||0x2e2018,{roughness:.95}),hand:M(o.skin||0xe0b08a,{roughness:.62}),glove:M(0x3b7fe0,{roughness:.45}),coat:M(0xf7f8f9,{roughness:.85}),dark:M(0x1d1d1d,{roughness:.4})};
  const g=new THREE.Group(),P={};
  const mesh=(geo,mat,x,y,z,parent)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;};
  const hips=P.hips=new THREE.Group();hips.position.y=.93;g.add(hips);
  P.torso=mesh(new THREE.CylinderGeometry(.165,.148,.5,14),mats.shirt,0,.27,0,hips);P.torso.scale.z=.66;
  mesh(new THREE.CylinderGeometry(.152,.158,.13,14),mats.pants,0,0,0,hips).scale.z=.72;
  mesh(new THREE.CylinderGeometry(.045,.05,.09,10),mats.skin,0,.56,0,hips);
  const head=P.head=new THREE.Group();head.position.set(0,.66,0);hips.add(head);
  mesh(new THREE.SphereGeometry(.112,20,16),mats.skin,0,.06,0,head).scale.set(.93,1.1,1);
  const hair=mesh(new THREE.SphereGeometry(.12,20,12,0,Math.PI*2,0,Math.PI*.5),mats.hair,0,.085,-.008,head);hair.rotation.x=-.22;
  if(o.long){const h2=mesh(new THREE.CylinderGeometry(.1,.12,.2,14,1,true),mats.hair,0,-.02,-.04,head);h2.material=mats.hair;h2.scale.z=.8;}
  [-1,1].forEach(s=>{mesh(new THREE.SphereGeometry(.014,8,6),mats.dark,s*.038,.075,.098,head);});
  mesh(new THREE.ConeGeometry(.016,.035,8),mats.skin,0,.045,.11,head).rotation.x=Math.PI/2;
  const mouth=mesh(new THREE.TorusGeometry(.022,.004,6,12,Math.PI),M(0x8a3b2e),0,.008,.1,head);mouth.rotation.z=Math.PI;
  P.legs=[-1,1].map(s=>{const L=new THREE.Group();L.position.set(s*.085,-.03,0);hips.add(L);
    mesh(new THREE.CylinderGeometry(.068,.057,.44,10),mats.pants,0,-.22,0,L);
    const K=new THREE.Group();K.position.y=-.44;L.add(K);
    mesh(new THREE.CylinderGeometry(.055,.045,.42,10),mats.pants,0,-.21,0,K);
    mesh(new THREE.BoxGeometry(.095,.06,.22),mats.shoe,0,-.44,.045,K);
    return{L,K};});
  // arms[0] — o'ng qo'l (model +z ga qaragan, o'ng tomoni -x)
  P.arms=[-1,1].map(s=>{const A=new THREE.Group();A.position.set(s*.205,.5,0);hips.add(A);
    const up=mesh(new THREE.CylinderGeometry(.048,.042,.3,10),mats.shirt,0,-.15,0,A);
    const E=new THREE.Group();E.position.y=-.3;A.add(E);
    const lo=mesh(new THREE.CylinderGeometry(.041,.034,.27,10),mats.skin,0,-.135,0,E);
    const hand=mesh(new THREE.SphereGeometry(.045,10,8),mats.hand,0,-.3,0,E);hand.scale.set(.9,1.2,.7);
    A.rotation.z=s*.07;return{A,E,up,lo,hand,s};});
  // laboratoriya xalati
  const coat=P.coat=new THREE.Group();hips.add(coat);
  const skirt=mesh(new THREE.CylinderGeometry(.178,.25,.6,16,1,true),mats.coat,0,-.2,0,coat);skirt.material=mats.coat.clone();skirt.material.side=THREE.DoubleSide;skirt.scale.z=.78;
  mesh(new THREE.CylinderGeometry(.172,.164,.52,14),mats.coat,0,.27,0,coat).scale.z=.71;
  const lapel=mesh(new THREE.BoxGeometry(.02,.4,.01),M(0xdadfe4),0,.28,.118,coat);void lapel;
  coat.visible=!!o.coat;
  // himoya ko'zoynagi (o'qituvchida — oddiy ko'zoynak)
  const gg=P.gog=new THREE.Group();gg.position.set(0,.075,.098);head.add(gg);
  const lens=new THREE.MeshStandardMaterial({color:o.glasses?0xffffff:0x9fd7ff,transparent:true,opacity:o.glasses?.15:.45,roughness:.05});
  [-1,1].forEach(s=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.03,o.glasses?.004:.008,6,16),o.glasses?mats.dark:M(0x2b2b2b));r.position.x=s*.04;gg.add(r);
    const l=new THREE.Mesh(new THREE.CircleGeometry(.03,16),lens);l.position.set(s*.04,0,.002);gg.add(l);});
  if(!o.glasses){const band=new THREE.Mesh(new THREE.TorusGeometry(.115,.006,6,24),M(0x2b2b2b));band.rotation.x=Math.PI/2;band.position.set(0,0,-.1);band.scale.set(1,1.05,1);gg.add(band);}
  gg.visible=!!o.glasses;
  // oyoq ostidagi yumshoq soya
  const sh=new THREE.Mesh(new THREE.CircleGeometry(.32,24),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.22,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.005;g.add(sh);
  g.userData.h={P,mats,phase:0,t:0,reach:0,flinch:0};
  if(o.coat)KL.dressHuman(g,{xalat:1});
  return g;
};
KL.dressHuman=function(g,gear){
  const h=g.userData.h,P=h.P,m=h.mats;
  P.coat.visible=!!gear.xalat;
  P.arms.forEach(a=>{a.up.material=gear.xalat?m.coat:m.shirt;a.lo.material=gear.xalat?m.coat:m.skin;a.hand.material=gear.qol?m.glove:m.hand;});
  if(gear.koz!==undefined&&!P.gog.userData.fixed)P.gog.visible=!!gear.koz;
};
// speed — m/s; reach — qo'l uzatish (0..1); flinch — kuyganda qo'lni tortib olish
KL.animHuman=function(g,dt,speed){
  const h=g.userData.h,P=h.P,a=Math.min(1,speed/1.5);
  h.t+=dt;if(a>.02)h.phase+=dt*(3+speed*3.4);else h.phase*=Math.pow(.02,dt);
  const sw=Math.sin(h.phase)*.62*a;
  P.legs[0].L.rotation.x=sw;P.legs[1].L.rotation.x=-sw;
  P.legs[0].K.rotation.x=Math.max(0,-Math.sin(h.phase))*.85*a;P.legs[1].K.rotation.x=Math.max(0,Math.sin(h.phase))*.85*a;
  const R=P.arms[0],Lf=P.arms[1];
  Lf.A.rotation.x=sw*.7;Lf.E.rotation.x=-.15-.25*a;
  const r=h.reach,f=h.flinch;
  R.A.rotation.x=(-sw*.7)*(1-r)-1.25*r+.6*f;R.E.rotation.x=(-.15-.25*a)*(1-r)-.55*r-1.1*f;R.A.rotation.z=-.07-.22*r+.3*f;
  P.hips.position.y=.93+Math.abs(Math.sin(h.phase))*.03*a+Math.sin(h.t*2.1)*.004;
  P.torso.rotation.x=.06*a;
  if(h.flinch>0)h.flinch=Math.max(0,h.flinch-dt*.6);
};
})(globalThis.KL=globalThis.KL||{});
