// KimyoLab — 3D laboratoriya xonasi (Three.js r150): xona, javon, tajriba stoli, jonli idish, asboblar, kamera
(function(KL){
"use strict";
const BT=0.96, VX=0, VZ=-2.45;                       // stol usti balandligi va idish joyi
const PROF={                                            // idish ichki profili [radius, balandlik] (m)
  stakan:[[0,0],[.108,0],[.115,.008],[.115,.25]],
  kolba:[[0,0],[.122,0],[.13,.012],[.11,.07],[.075,.135],[.04,.19],[.034,.205],[.034,.28]],
  probirka:(()=>{const p=[];for(let i=0;i<=8;i++){const a=-Math.PI/2+i*Math.PI/16;p.push([.032*Math.cos(a),.032+.032*Math.sin(a)]);}p.push([.032,.3]);return p;})()
};
const BASE={stakan:BT+.165,kolba:BT+.165,probirka:BT+.205};
const FILL={stakan:.21,kolba:.17,probirka:.24};        // to'la idishdagi suyuqlik sathi

function ctex(w,h,draw){const c=document.createElement("canvas");c.width=w;c.height=h;draw(c.getContext("2d"),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;t.userData={canvas:c,draw};return t;}
function redraw(t,draw){const c=t.userData.canvas;draw(c.getContext("2d"),c.width,c.height);t.needsUpdate=true;}
const M=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.75,metalness:0},o||{}));
const rr=(a,b)=>a+Math.random()*(b-a);
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
function rIn(prof,y){for(let i=1;i<prof.length;i++){const[a,ya]=prof[i-1],[b,yb]=prof[i];if(y<=yb)return yb===ya?b:a+(b-a)*(y-ya)/(yb-ya);}return prof[prof.length-1][0];}
function lathe(prof,y0,y1,seg=40){
  const pts=[new THREE.Vector2(0,y0)];
  pts.push(new THREE.Vector2(Math.max(.001,rIn(prof,y0)),y0));
  prof.forEach(([r,y])=>{if(y>y0&&y<y1)pts.push(new THREE.Vector2(r,y));});
  pts.push(new THREE.Vector2(Math.max(.001,rIn(prof,y1)),y1),new THREE.Vector2(0,y1));
  return new THREE.LatheGeometry(pts,seg);
}
function wrapText(c,txt,x,y,maxW,lh){const words=txt.split(" ");let line="";for(const w of words){const t=line?line+" "+w:w;if(c.measureText(t).width>maxW&&line){c.fillText(line,x,y);y+=lh;line=w;}else line=t;}if(line)c.fillText(line,x,y);return y;}

class Lab3D{
  constructor(canvas,host,cb){
    this.cb=cb;this.host=host;this.canvas=canvas;
    this.mobile=matchMedia("(pointer:coarse)").matches;
    const r=this.r=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:"high-performance"});
    r.setPixelRatio(Math.min(devicePixelRatio,this.mobile?1.5:2));
    r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=.82;
    r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;
    this.sc=new THREE.Scene();this.sc.background=new THREE.Color(0xd5dde4);
    this.cam=new THREE.PerspectiveCamera(60,1,.02,60);
    this.inter=[];this.tweens=[];this.colliders=[];this.time=0;this.sheet=0;this.queue=[];this.busy=false;
    this.env();this.room();this.decor();this.shelf();this.bench();this.hanger();this.teacherBuild();
    this.vg=new THREE.Group();this.sc.add(this.vg);this.fxBuild();this.setVessel("stakan");
    this.P={x:-4.7,z:3.05,yaw:2.0,pitch:-.12};this.mode="walk";this.orb={yaw:.35,pitch:.32,dist:.85};
    this.input();this.resize();
    if(window.ResizeObserver)new ResizeObserver(()=>this.resize()).observe(host);
  }
  /* ---------- muhit (aks ettirish uchun) ---------- */
  env(){
    const pm=new THREE.PMREMGenerator(this.r),es=new THREE.Scene();
    const g=new THREE.SphereGeometry(10,24,16),cols=[];const pos=g.attributes.position;
    for(let i=0;i<pos.count;i++){const y=pos.getY(i)/10;const c=new THREE.Color().setHSL(.58,.12,.32+.22*y);cols.push(c.r,c.g,c.b);}
    g.setAttribute("color",new THREE.Float32BufferAttribute(cols,3));
    es.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide})));
    [[-9,3,0],[0,9,0],[6,8,3]].forEach(p=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(4,3),new THREE.MeshBasicMaterial({color:0xbbbbbb}));m.position.set(...p);m.lookAt(0,0,0);es.add(m);});
    this.sc.environment=pm.fromScene(es,.04).texture;pm.dispose();
  }
  add(m,x,y,z,o){m.position.set(x,y,z);(o||this.sc).add(m);return m;}
  box(w,h,d,mat,x,y,z,o){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat.isMaterial?mat:M(mat));return this.add(m,x,y,z,o);}
  cyl(rt,rb,h,mat,x,y,z,o,seg=20){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat.isMaterial?mat:M(mat));return this.add(m,x,y,z,o);}
  pick(o,data){o.userData.pick=data;this.inter.push(o);return o;}
  /* ---------- xona ---------- */
  room(){
    const sc=this.sc;
    sc.add(new THREE.HemisphereLight(0xf4f7ff,0x9c8f7a,.5));
    const sun=new THREE.DirectionalLight(0xfff3e0,1.05);sun.position.set(-7.5,6.5,2.5);sun.target.position.set(1,0,-1);sc.add(sun,sun.target);
    sun.castShadow=true;const sc2=sun.shadow.camera;sc2.left=-7;sc2.right=7;sc2.top=6;sc2.bottom=-6;sc2.near=1;sc2.far=25;sun.shadow.mapSize.set(this.mobile?1024:2048,this.mobile?1024:2048);sun.shadow.bias=-.0005;sun.shadow.radius=3;
    const fill=new THREE.PointLight(0xffffff,.35,9);fill.position.set(0,3.2,-1.5);sc.add(fill);
    const floorT=ctex(512,512,(c,w)=>{for(let i=0;i<4;i++)for(let j=0;j<4;j++){const l=78+Math.random()*4;c.fillStyle=`hsl(34,20%,${l}%)`;c.fillRect(i*128,j*128,128,128);}
      c.strokeStyle="rgba(120,110,95,.45)";c.lineWidth=3;for(let i=0;i<=4;i++){c.beginPath();c.moveTo(i*128,0);c.lineTo(i*128,w);c.stroke();c.beginPath();c.moveTo(0,i*128);c.lineTo(w,i*128);c.stroke();}});
    floorT.wrapS=floorT.wrapT=THREE.RepeatWrapping;floorT.repeat.set(8,6);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(16,12),M(0xffffff,{map:floorT,roughness:.55}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;sc.add(floor);
    const ceil=new THREE.Mesh(new THREE.PlaneGeometry(16,12),M(0xf6f6f3));ceil.rotation.x=Math.PI/2;ceil.position.y=3.6;sc.add(ceil);
    const wall=M(0xdfe3dc,{roughness:.95,envMapIntensity:.4}),dado=M(0x7fa39d,{roughness:.85,envMapIntensity:.4});
    [[0,1.8,-6,16,0],[0,1.8,6,16,Math.PI],[-8,1.8,0,12,Math.PI/2],[8,1.8,0,12,-Math.PI/2]].forEach(([x,y,z,w,ry])=>{
      const p=new THREE.Mesh(new THREE.PlaneGeometry(w,3.6),wall);p.position.set(x,y,z);p.rotation.y=ry;p.receiveShadow=true;sc.add(p);
      const d=new THREE.Mesh(new THREE.PlaneGeometry(w,.95),dado);d.position.set(x+(ry===Math.PI/2?.005:ry===-Math.PI/2?-.005:0),.475,z+(ry===0?.005:ry===Math.PI?-.005:0));d.rotation.y=ry;sc.add(d);});
    for(let i=0;i<3;i++)for(let j=0;j<2;j++){const l=this.box(1.3,.04,.35,M(0xffffff,{emissive:0xffffff,emissiveIntensity:.9}),-4+i*4,3.58,-2.5+j*4.2);l.castShadow=false;}
    // derazalar (chap devor)
    const sky=ctex(256,256,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"#8fc3ef");g.addColorStop(1,"#d9ecfa");c.fillStyle=g;c.fillRect(0,0,w,h);
      c.fillStyle="rgba(255,255,255,.85)";[[60,70,30],[90,62,24],[180,120,28],[205,112,20]].forEach(([x,y,r])=>{c.beginPath();c.arc(x,y,r,0,7);c.fill();});c.fillStyle="#7fae6d";c.fillRect(0,h*.82,w,h*.18);});
    [-3.2,0,3.2].forEach(z=>{const g=new THREE.Mesh(new THREE.PlaneGeometry(2,1.5),new THREE.MeshBasicMaterial({map:sky}));g.position.set(-7.98,2,z);g.rotation.y=Math.PI/2;sc.add(g);
      const fm=M(0xfafafa);[[0,.78,2.1,.07],[0,-.78,2.1,.07],[1.02,0,.07,1.62],[-1.02,0,.07,1.62],[0,0,.04,1.5]].forEach(([dz,dy,w,h])=>this.box(.06,h,w,fm,-7.95,2+dy,z+dz));
      this.box(.18,.05,2.2,M(0xf2f2f2),-7.9,1.2,z);});
    // eshik (old devor)
    const door=this.box(1.05,2.15,.06,M(0x8a5a35,{roughness:.6}),-6,1.075,5.96);this.pick(door,{type:"door"});
    this.box(1.2,.08,.08,M(0xf5f5f5),-6,2.2,5.95);this.cyl(.025,.025,.12,M(0xcccccc,{metalness:.8,roughness:.3}),-5.62,1.05,5.88).rotation.x=Math.PI/2;
    // kolliziya: devorlar ichidagi to'siqlar keyin qo'shiladi
  }
  decor(){
    const sc=this.sc;
    // doska
    this.boardT=ctex(1024,400,(c,w,h)=>this.drawBoard(c,w,h,[]));
    const bd=new THREE.Mesh(new THREE.PlaneGeometry(5.2,2.03),M(0xffffff,{map:this.boardT,roughness:.95}));bd.position.set(0,1.95,-5.97);sc.add(bd);this.pick(bd,{type:"board"});
    this.box(5.36,.08,.08,M(0x8b6a43),0,.9,-5.93);this.box(5.36,.08,.06,M(0x8b6a43),0,2.99,-5.95);
    [-2.66,2.66].forEach(x=>this.box(.08,2.13,.06,M(0x8b6a43),x,1.95,-5.95));
    // soat
    this.clockT=ctex(256,256,(c,w,h)=>this.drawClock(c,w,h));
    const ck=new THREE.Mesh(new THREE.CircleGeometry(.24,40),new THREE.MeshBasicMaterial({map:this.clockT}));ck.position.set(0,3.27,-5.96);sc.add(ck);
    // olimlar portretlari
    [["Abu Rayhon","Beruniy"],["Abu Ali","ibn Sino"],["D. I.","Mendeleyev"],["A.","Lavuazye"],["M.","Kyuri"],["A.","Butlerov"]].forEach((nm,i)=>{
      const t=ctex(200,256,(c,w,h)=>{c.fillStyle="#efe6d2";c.fillRect(0,0,w,h);c.fillStyle="#c8b991";c.fillRect(14,14,w-28,h-70);
        c.fillStyle="#6b5a45";c.beginPath();c.arc(w/2,92,34,0,7);c.fill();c.beginPath();c.ellipse(w/2,175,58,45,0,Math.PI,0);c.fill();
        c.fillStyle="#3a2f25";c.font="bold 17px sans-serif";c.textAlign="center";c.fillText(nm[0],w/2,h-38);c.fillText(nm[1],w/2,h-16);});
      const x=i<3?-6.3+i*1.15:3.99+(i-3)*1.15;
      this.box(.82,1.06,.04,M(0xa07c45),x,2.35,-5.97);
      const p=new THREE.Mesh(new THREE.PlaneGeometry(.7,.9),new THREE.MeshBasicMaterial({map:t}));p.position.set(x,2.35,-5.94);sc.add(p);});
    // davriy jadval plakati (old devor)
    const pt=ctex(1024,600,(c,w,h)=>{c.fillStyle="#fdfcf7";c.fillRect(0,0,w,h);c.fillStyle="#223";c.font="bold 30px sans-serif";c.textAlign="center";c.fillText("D. I. Mendeleyevning kimyoviy elementlar davriy jadvali",w/2,40);
      const cw=w/19.5,chh=(h-70)/10.6;KL.ELEMENTS.forEach(e=>{const x=12+(e.col-1)*cw*1.05,y=58+(e.row-1)*chh*(e.row>7?1.02:1)+(e.row>7?chh*.35:0);c.fillStyle=KL.CAT[e.cat][1];c.fillRect(x,y,cw-3,chh-3);
        c.fillStyle="#111";c.font=`bold ${chh*.42|0}px sans-serif`;c.fillText(e.sym,x+cw/2,y+chh*.62);c.font=`${chh*.22|0}px sans-serif`;c.fillText(e.z,x+cw/2,y+chh*.26);});});
    const pp=new THREE.Mesh(new THREE.PlaneGeometry(3.4,2),new THREE.MeshBasicMaterial({map:pt}));pp.position.set(2,1.95,5.96);pp.rotation.y=Math.PI;sc.add(pp);this.pick(pp,{type:"poster"});
    // xavfsizlik plakati
    const sf=ctex(400,520,(c,w,h)=>{c.fillStyle="#fff7e0";c.fillRect(0,0,w,h);c.fillStyle="#c62828";c.fillRect(0,0,w,70);c.fillStyle="#fff";c.font="bold 30px sans-serif";c.textAlign="center";c.fillText("XAVFSIZLIK",w/2,46);
      c.fillStyle="#333";c.font="21px sans-serif";c.textAlign="left";let y=110;["Xalat, ko'zoynak va qo'lqop kiying","Reaktivlarni tatib ko'rmang","Hidlashda bug'ni qo'l bilan yelpiting","Probirka og'zini odamga qaratmang","Spirtovkani qopqog'i bilan o'chiring","Kislotani suvga quying, aksincha emas!"].forEach(s=>{c.fillText("•",22,y);y=wrapText(c,s,44,y,w-60,27)+38;});});
    const sp=new THREE.Mesh(new THREE.PlaneGeometry(.9,1.17),new THREE.MeshBasicMaterial({map:sf}));sp.position.set(-3.4,1.75,5.96);sp.rotation.y=Math.PI;sc.add(sp);
    // birinchi yordam qutisi va o't o'chirgich
    const fa=ctex(128,128,(c,w,h)=>{c.fillStyle="#fff";c.fillRect(0,0,w,h);c.fillStyle="#d32f2f";c.fillRect(48,18,32,92);c.fillRect(18,48,92,32);});
    const fb=this.box(.5,.42,.16,M(0xffffff),-7.9,1.65,4.1);const fl=new THREE.Mesh(new THREE.PlaneGeometry(.36,.36),new THREE.MeshBasicMaterial({map:fa}));fl.position.set(-7.81,1.65,4.1);fl.rotation.y=Math.PI/2;this.sc.add(fl);void fb;
    const ex=this.cyl(.085,.085,.55,M(0xc62828,{roughness:.35,metalness:.2}),-7.7,.3,3.35);ex.castShadow=true;this.cyl(.03,.03,.08,M(0x222222),-7.7,.62,3.35);
    // o'qituvchi stoli
    this.box(1.7,.06,.75,M(0xc49a6c),-3.7,.78,-4.7).castShadow=true;this.box(1.6,.72,.08,M(0xb08a5e),-3.7,.4,-4.36);
    [[-.78,-.3],[.78,-.3],[-.78,.3],[.78,.3]].forEach(([dx,dz])=>this.box(.05,.75,.05,M(0x777777,{metalness:.6}),-3.7+dx,.38,-4.7+dz));
    this.colliders.push([-4.6,-2.8,-5.2,-4.2]);
    // o'quvchi partalari
    [-5.2,-1.9,1.9,5.2].forEach(x=>[1.1,3.1].forEach(z=>{
      const t=this.box(1.9,.05,.72,M(0xd9b98a,{roughness:.6}),x,.76,z);t.castShadow=true;t.receiveShadow=true;
      [[-.88,-.3],[.88,-.3],[-.88,.3],[.88,.3]].forEach(([dx,dz])=>this.box(.045,.74,.045,M(0x8d969e,{metalness:.6,roughness:.4}),x+dx,.37,z+dz));
      [-.45,.45].forEach(dx=>{const s=this.cyl(.17,.17,.04,M(0x3f6fb5),x+dx,.46,z+.62);s.castShadow=true;this.cyl(.02,.02,.44,M(0x8d969e,{metalness:.6}),x+dx,.23,z+.62);});
      if(Math.random()<.6){this.box(.28,.03,.2,M(0x4a7dc9),x-.4,.8,z-.05).rotation.y=.3;}
      this.colliders.push([x-.98,x+.98,z-.4,z+.82]);}));
  }
  drawBoard(c,w,h,lines){
    c.fillStyle="#22493b";c.fillRect(0,0,w,h);
    const g=c.createRadialGradient(w*.4,h*.4,50,w/2,h/2,w*.7);g.addColorStop(0,"rgba(255,255,255,.05)");g.addColorStop(1,"rgba(0,0,0,.15)");c.fillStyle=g;c.fillRect(0,0,w,h);
    c.fillStyle="rgba(245,245,235,.92)";c.textAlign="center";c.font="italic bold 58px Georgia, serif";c.fillText("Kimyo",w/2,72);
    c.font="italic 30px Georgia, serif";c.textAlign="left";
    if(!lines.length){c.fillText("Xush kelibsiz, aziz o'quvchilar!",70,140);c.fillText("Bugun — tajriba va kashfiyotlar kuni",70,190);c.font="40px Georgia, serif";c.fillText("2H₂ + O₂ → 2H₂O",300,290);}
    else{c.fillText("Bugungi tajribalar:",60,130);c.font="34px Georgia, serif";lines.slice(0,4).forEach((l,i)=>{c.fillText(l.length>48?l.slice(0,47)+"…":l,60,185+i*52);});}
    c.textAlign="right";c.font="22px sans-serif";c.fillStyle="rgba(240,240,230,.6)";c.fillText(new Date().toLocaleDateString("uz-UZ"),w-30,h-24);
  }
  setBoard(lines){redraw(this.boardT,(c,w,h)=>this.drawBoard(c,w,h,lines));}
  drawClock(c,w,h){
    const d=new Date(),cx=w/2,cy=h/2;c.clearRect(0,0,w,h);c.fillStyle="#fff";c.beginPath();c.arc(cx,cy,120,0,7);c.fill();c.lineWidth=10;c.strokeStyle="#333";c.stroke();
    c.fillStyle="#333";for(let i=0;i<12;i++){const a=i*Math.PI/6;c.fillRect(cx+Math.sin(a)*100-3,cy-Math.cos(a)*100-3,6,6);}
    const hand=(a,l,wd,col)=>{c.strokeStyle=col;c.lineWidth=wd;c.lineCap="round";c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.sin(a)*l,cy-Math.cos(a)*l);c.stroke();};
    hand((d.getHours()%12+d.getMinutes()/60)*Math.PI/6,60,9,"#222");hand(d.getMinutes()*Math.PI/30,90,6,"#222");hand(d.getSeconds()*Math.PI/30,96,2,"#c62828");
  }
  /* ---------- reaktivlar shkafi (o'ng devor) ---------- */
  shelf(){
    const wood=M(0xa9794a,{roughness:.6}),X=7.62;
    this.box(.04,3,6.7,M(0xf3efe6),7.96,1.5,0).receiveShadow=true;
    [-3.33,3.33].forEach(z=>this.box(.62,3,.05,wood,7.67,1.5,z));
    this.box(.64,.05,6.72,wood,7.67,3.01,0);this.box(.64,.1,6.72,wood,7.67,.05,0);
    [.3,.86,1.42,1.98,2.54].forEach(y=>this.box(.56,.04,6.4,M(0x8a6238),7.64,y-.02,0));
    this.colliders.push([7.05,8,-3.4,3.4]);
    const groups=KL.SHELF_GROUPS.map(g=>g[0]),by=g=>KL.SHELF.filter(s=>s.g===g);
    const salts=by("salt");
    const rows=[[...by("solid")],[...by("acid"),...by("base"),...by("ind")],salts.slice(0,11),salts.slice(11),[...by("org")]];
    const titles=["Metallar va qattiq moddalar","Kislotalar · Ishqorlar · Indikatorlar","Tuzlar","Tuzlar","Organik va boshqa moddalar"];
    this.bottles={};void groups;
    rows.forEach((row,ri)=>{
      const y=[.3,.86,1.42,1.98,2.54][ri];const n=row.length,step=Math.min(.46,6/n);
      const plate=ctex(512,48,(c,w,h)=>{c.fillStyle="#2c3e50";c.fillRect(0,0,w,h);c.fillStyle="#fff";c.font="bold 26px sans-serif";c.textAlign="center";c.fillText(titles[ri],w/2,33);});
      const pl=new THREE.Mesh(new THREE.PlaneGeometry(1.6,.15),new THREE.MeshBasicMaterial({map:plate}));pl.position.set(7.34,y-.1,0);pl.rotation.y=-Math.PI/2;this.sc.add(pl);
      row.forEach((s,i)=>{const z=-(n-1)*step/2+i*step;const b=this.bottle(s);b.position.set(X,y,z);b.userData.home={x:X,y,z};this.sc.add(b);this.bottles[s.id]=b;});
    });
    // oyna eshiklar
    const gl=new THREE.MeshStandardMaterial({color:0xddeeff,transparent:true,opacity:.1,roughness:.05,metalness:.2,depthWrite:false});
    [-1.6,1.6].forEach(z=>{const d=new THREE.Mesh(new THREE.PlaneGeometry(3.2,2.8),gl);d.position.set(7.32,1.5,z);d.rotation.y=-Math.PI/2;this.sc.add(d);});
  }
  bottle(s){
    const g=new THREE.Group(),k=s.k;
    const col=s.b||(s.ions&&s.ions.map(([i])=>KL.IONS[i].c).find(Boolean))||(s.mol&&s.mol.map(([m])=>KL.MOLS[m].c).find(Boolean))||"#dfeef7";
    let body,h;
    if(k==="piece"||k==="powder"){
      h=.15;body=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,h,24),new THREE.MeshStandardMaterial({color:0xe8f2f8,transparent:true,opacity:.35,roughness:.05,metalness:.1,depthWrite:false}));body.position.y=h/2;g.add(body);
      const S=KL.SOLIDS[s.solid];const fill=new THREE.Mesh(new THREE.CylinderGeometry(.062,.062,.07,20),M(S.c,{roughness:S.kind==="piece"?.4:.9,metalness:S.kind==="piece"&&!/CaCO3/.test(s.id)?.6:0}));fill.position.y=.038;g.add(fill);
      const lid=new THREE.Mesh(new THREE.CylinderGeometry(.074,.074,.025,24),M(0x3b3b3b));lid.position.y=h+.012;g.add(lid);
    }else if(k==="drop"){
      h=.11;body=new THREE.Mesh(new THREE.CylinderGeometry(.04,.042,h,20),new THREE.MeshStandardMaterial({color:new THREE.Color(col),transparent:true,opacity:.7,roughness:.1}));body.position.y=h/2;g.add(body);
      const t=new THREE.Mesh(new THREE.CylinderGeometry(.012,.02,.06,12),M(0xd84a3a,{roughness:.5}));t.position.y=h+.03;g.add(t);
    }else if(k==="gas"){
      h=.32;const gm=new THREE.MeshStandardMaterial({color:0xd8ecf6,transparent:true,opacity:.4,roughness:.05});
      [[.1,.07],[.2,.055],[.28,.04]].forEach(([y,r])=>{const sph=new THREE.Mesh(new THREE.SphereGeometry(r,20,14),gm);sph.position.y=y;g.add(sph);});
      body=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.12,10),gm);body.position.y=.36;g.add(body);
      const tap=new THREE.Mesh(new THREE.BoxGeometry(.06,.015,.015),M(0x333333));tap.position.set(-.03,.33,0);g.add(tap);
    }else if(k==="water"){
      h=.2;body=new THREE.Mesh(new THREE.CylinderGeometry(.06,.065,h,20),M(0xf4f6f8,{roughness:.4}));body.position.y=h/2;g.add(body);
      const n=new THREE.Mesh(new THREE.CylinderGeometry(.006,.012,.12,8),M(0xf4f6f8));n.position.set(-.04,h+.05,0);n.rotation.z=.7;g.add(n);
    }else{
      h=.19;body=new THREE.Mesh(new THREE.CylinderGeometry(.058,.062,h,24),new THREE.MeshStandardMaterial({color:0xeef6fb,transparent:true,opacity:.32,roughness:.05,metalness:.1,depthWrite:false}));body.position.y=h/2;g.add(body);
      const liq=new THREE.Mesh(new THREE.CylinderGeometry(.052,.056,h*.68,20),new THREE.MeshStandardMaterial({color:new THREE.Color(col),transparent:true,opacity:.75,roughness:.2}));liq.position.y=h*.36;g.add(liq);
      const neck=new THREE.Mesh(new THREE.CylinderGeometry(.022,.035,.04,16),new THREE.MeshStandardMaterial({color:0xeef6fb,transparent:true,opacity:.35}));neck.position.y=h+.02;g.add(neck);
      const cap=new THREE.Mesh(new THREE.CylinderGeometry(.026,.026,.03,16),M(s.g==="acid"?0xc0392b:s.g==="base"?0x2e5ea8:0x37474f));cap.position.y=h+.055;g.add(cap);
    }
    const lbl=ctex(160,72,(c,w,hh)=>{c.fillStyle="#fffdf4";c.fillRect(0,0,w,hh);const gc={acid:"#c0392b",base:"#2e5ea8",salt:"#2e7d32",solid:"#6d4c41",org:"#8e24aa",ind:"#f39c12"}[s.g];c.fillStyle=gc;c.fillRect(0,0,w,10);
      c.fillStyle="#1b1b1b";const t=KL.uni(s.f.length>11?s.f.replace(/\(C6H10O5\)n/,"kraxmal"):s.f);let fs=34;c.font=`bold ${fs}px sans-serif`;while(c.measureText(t).width>w-10&&fs>14){fs-=2;c.font=`bold ${fs}px sans-serif`;}c.textAlign="center";c.fillText(t,w/2,48);
      if(s.hz){c.fillStyle="#c62828";c.font="bold 14px sans-serif";c.fillText("⚠",w-12,hh-6);}});
    const lw=k==="drop"?.075:.11;const L=new THREE.Mesh(new THREE.PlaneGeometry(lw,lw*.45),new THREE.MeshBasicMaterial({map:lbl}));
    L.position.set(k==="gas"?-.075:-(k==="drop"?.043:k==="piece"||k==="powder"?.073:.064),k==="gas"?.1:(h||.15)*.5,0);L.rotation.y=-Math.PI/2;g.add(L);
    g.traverse(o=>{if(o.isMesh){o.castShadow=true;}});
    g.userData.h=h;g.userData.body=body;this.pick(g,{type:"bottle",id:s.id});
    return g;
  }
  /* ---------- tajriba stoli va asboblar ---------- */
  bench(){
    const b=this.box(4.2,.9,1.3,M(0xe9ecef,{roughness:.5}),0,.45,-2.62);b.castShadow=b.receiveShadow=true;
    const top=this.box(4.4,.06,1.48,M(0x2e3a44,{roughness:.35,metalness:.1}),0,BT-.03,-2.62);top.receiveShadow=true;
    for(let i=0;i<4;i++)this.box(.9,.32,.01,M(0xd5dade),-1.5+i,.55,-1.965);
    for(let i=0;i<4;i++)this.cyl(.012,.012,.12,M(0xaaaaaa,{metalness:.8}),-1.5+i,.55,-1.95).rotation.z=Math.PI/2;
    this.colliders.push([-2.35,2.35,-3.45,-1.8]);
    // probirkalar shtativi (bezak)
    const rack=this.box(.42,.05,.12,M(0xb5895a),-1.45,BT+.12,-2.9);void rack;this.box(.42,.05,.12,M(0xb5895a),-1.45,BT+.025,-2.9);
    ["#e8505b","#2f86f6","#f2c81b","#7fd17f","#b36ae2"].forEach((c,i)=>{const x=-1.61+i*.08;const t=new THREE.Mesh(new THREE.CylinderGeometry(.013,.013,.2,12),new THREE.MeshStandardMaterial({color:0xeef6fb,transparent:true,opacity:.35,depthWrite:false}));t.position.set(x,BT+.12,-2.9);this.sc.add(t);
      const l=new THREE.Mesh(new THREE.CylinderGeometry(.011,.011,.08,10),new THREE.MeshStandardMaterial({color:new THREE.Color(c),transparent:true,opacity:.8}));l.position.set(x,BT+.06,-2.9);this.sc.add(l);});
    // kolbalar (bezak)
    [[1.5,-2.95,"#f28c28"],[1.75,-2.85,"#3d8bfd"]].forEach(([x,z,c])=>{const f=new THREE.Mesh(lathe(PROF.kolba,0,.28),new THREE.MeshStandardMaterial({color:0xeef6fb,transparent:true,opacity:.3,depthWrite:false,roughness:.05,metalness:.1}));f.position.set(x,BT,z);f.scale.setScalar(.8);this.sc.add(f);
      const l=new THREE.Mesh(lathe(PROF.kolba,.004,.09),new THREE.MeshStandardMaterial({color:new THREE.Color(c),transparent:true,opacity:.75}));l.position.set(x,BT,z);l.scale.setScalar(.8);this.sc.add(l);});
    // uch oyoq va to'r
    this.tripod=new THREE.Group();this.tripod.position.set(VX,BT,VZ);this.sc.add(this.tripod);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.13,.006,8,32),M(0x555555,{metalness:.7,roughness:.4}));ring.rotation.x=Math.PI/2;ring.position.y=.16;this.tripod.add(ring);
    for(let i=0;i<3;i++){const a=i*Math.PI*2/3;const l=new THREE.Mesh(new THREE.CylinderGeometry(.005,.005,.17,6),M(0x555555,{metalness:.7}));l.position.set(Math.cos(a)*.13,.08,Math.sin(a)*.13);this.tripod.add(l);}
    const gz=ctex(128,128,(c,w,h)=>{c.fillStyle="#9a9a9a";c.fillRect(0,0,w,h);c.strokeStyle="#666";c.lineWidth=1;for(let i=0;i<w;i+=6){c.beginPath();c.moveTo(i,0);c.lineTo(i,h);c.stroke();c.beginPath();c.moveTo(0,i);c.lineTo(w,i);c.stroke();}c.fillStyle="#e8e2d6";c.beginPath();c.arc(w/2,h/2,34,0,7);c.fill();});
    const gauze=new THREE.Mesh(new THREE.PlaneGeometry(.3,.3),M(0xffffff,{map:gz,side:THREE.DoubleSide,metalness:.3}));gauze.rotation.x=-Math.PI/2;gauze.position.y=.163;this.tripod.add(gauze);
    // probirka qisqichi (shtativ)
    this.clamp=new THREE.Group();this.clamp.position.set(VX,BT,VZ);this.sc.add(this.clamp);
    this.box(.22,.02,.16,M(0x444444,{metalness:.5}),-.22,.01,0,this.clamp);this.cyl(.008,.008,.55,M(0x888888,{metalness:.8,roughness:.3}),-.26,.28,0,this.clamp);
    this.box(.24,.015,.015,M(0x888888,{metalness:.8}),-.14,.42,0,this.clamp);const cr=new THREE.Mesh(new THREE.TorusGeometry(.038,.006,8,20),M(0x666666,{metalness:.7}));cr.rotation.x=Math.PI/2;cr.position.set(0,.42,0);this.clamp.add(cr);
    // spirtovka
    const lamp=this.lamp=new THREE.Group();lamp.position.set(VX,BT,VZ);this.sc.add(lamp);
    const lb=new THREE.Mesh(new THREE.LatheGeometry([[0,0],[.05,0],[.058,.02],[.055,.05],[.03,.07],[.02,.075]].map(p=>new THREE.Vector2(p[0],p[1])),24),new THREE.MeshStandardMaterial({color:0xeef6fb,transparent:true,opacity:.45,roughness:.05}));lamp.add(lb);
    const al=new THREE.Mesh(new THREE.CylinderGeometry(.048,.05,.03,20),new THREE.MeshStandardMaterial({color:0xbfe3ff,transparent:true,opacity:.6}));al.position.y=.016;lamp.add(al);
    this.cyl(.018,.02,.025,M(0xb8b8b8,{metalness:.8,roughness:.3}),0,.085,0,lamp);this.cyl(.005,.005,.018,M(0xffffff),0,.105,0,lamp);
    this.lampCap=this.cyl(.022,.022,.035,M(0xb8b8b8,{metalness:.8,roughness:.3}),0,.105,0,lamp);
    lamp.traverse(o=>{if(o.isMesh){o.castShadow=true;this.pick(o,{type:"lamp"});}});
    const fo=new THREE.Mesh(new THREE.ConeGeometry(.016,.075,14,1,true),new THREE.MeshBasicMaterial({color:0xffa53a,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false}));
    const fi=new THREE.Mesh(new THREE.ConeGeometry(.008,.038,12,1,true),new THREE.MeshBasicMaterial({color:0x4f8dff,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,depthWrite:false}));
    this.flame=new THREE.Group();this.flame.add(fo,fi);fo.position.y=.037;fi.position.y=.019;this.flame.position.y=.112;lamp.add(this.flame);
    this.flameL=new THREE.PointLight(0xff9a3c,0,1.6);this.flameL.position.y=.16;lamp.add(this.flameL);
    // tok manbai (elektroliz)
    const bat=this.battery=new THREE.Group();bat.position.set(.62,BT,-2.75);this.sc.add(bat);
    this.box(.26,.13,.16,M(0x37474f,{roughness:.5}),0,.065,0,bat);this.box(.2,.06,.005,M(0x263238,{emissive:0x0,}),0,.07,.082,bat);
    this.batLed=this.cyl(.008,.008,.01,M(0x330000,{emissive:0x000000}),.08,.135,.04,bat);
    this.cyl(.012,.012,.03,M(0xc62828),-.06,.14,0,bat);this.cyl(.012,.012,.03,M(0x222222),.04,.14,0,bat);
    bat.traverse(o=>{if(o.isMesh)this.pick(o,{type:"battery"});});
    // UV lampa
    const uv=this.uvLamp=new THREE.Group();uv.position.set(-.48,BT,-2.75);this.sc.add(uv);
    this.box(.14,.02,.14,M(0x333333),0,.01,0,uv);this.cyl(.007,.007,.6,M(0x999999,{metalness:.8}),0,.3,0,uv);
    const arm=this.box(.36,.012,.012,M(0x999999,{metalness:.8}),.17,.6,.0,uv);void arm;
    this.uvHead=this.box(.14,.05,.07,M(0x2b2b2b),.34,.58,.0,uv);this.uvTube=this.box(.12,.012,.05,M(0x6a3fb5,{emissive:0x000000}),.34,.552,0,uv);
    this.uvL=new THREE.SpotLight(0x9b5cff,0,1.8,.7,.5);this.uvL.position.set(.34,.55,0);uv.add(this.uvL);this.uvL.target.position.set(.48,.1,.3);uv.add(this.uvL.target);
    uv.traverse(o=>{if(o.isMesh)this.pick(o,{type:"uv"});});
  }
  hanger(){
    const g=this.hangerG=new THREE.Group();g.position.set(-7.25,0,4.75);this.sc.add(g);
    this.cyl(.22,.25,.04,M(0x5d4037),0,.02,0,g);this.cyl(.025,.025,1.85,M(0x6d4c41,{roughness:.6}),0,.93,0,g);
    for(let i=0;i<4;i++){const h=this.cyl(.01,.01,.18,M(0x6d4c41),Math.cos(i*1.57)*.07,1.8,Math.sin(i*1.57)*.07,g);h.rotation.z=Math.cos(i*1.57)*.8;h.rotation.x=-Math.sin(i*1.57)*.8;}
    // xalat
    const coat=this.coat=new THREE.Group();coat.position.set(.0,1.22,.18);g.add(coat);
    const cm=M(0xfafafa,{roughness:.85});const b=new THREE.Mesh(new THREE.CylinderGeometry(.17,.24,.95,14,1,true),cm);b.material.side=THREE.DoubleSide;coat.add(b);
    [-1,1].forEach(s=>{const sl=new THREE.Mesh(new THREE.CylinderGeometry(.045,.055,.6,10),cm);sl.position.set(s*.2,.08,0);sl.rotation.z=s*.12;coat.add(sl);});
    const col=new THREE.Mesh(new THREE.TorusGeometry(.12,.025,6,16,Math.PI),cm);col.position.y=.46;col.rotation.x=-Math.PI/2;coat.add(col);
    // stolcha: ko'zoynak va qo'lqop
    this.box(.6,.04,.45,M(0xc49a6c),.7,.74,.25,g);[[-.27,-.19],[.27,-.19],[-.27,.19],[.27,.19]].forEach(([dx,dz])=>this.box(.03,.72,.03,M(0x777777),.7+dx,.37,.25+dz,g));
    const gog=this.gog=new THREE.Group();gog.position.set(.55,.8,.25);g.add(gog);
    const gm=new THREE.MeshStandardMaterial({color:0x9fd7ff,transparent:true,opacity:.6,roughness:.05});
    [-1,1].forEach(s=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.04,.009,8,20),M(0x2b2b2b));r.position.x=s*.05;r.rotation.x=Math.PI/2;gog.add(r);const l=new THREE.Mesh(new THREE.CircleGeometry(.04,20),gm);l.position.x=s*.05;l.rotation.x=-Math.PI/2;gog.add(l);});
    const glv=this.glv=new THREE.Group();glv.position.set(.85,.78,.25);g.add(glv);
    [-1,1].forEach(s=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.08,.025,.17),M(0x3f7fd6,{roughness:.6}));p.position.set(s*.05,0,0);p.rotation.y=s*.2;glv.add(p);});
    [[coat,"xalat"],[gog,"koz"],[glv,"qol"]].forEach(([o,id])=>o.traverse(m=>{if(m.isMesh){m.castShadow=true;this.pick(m,{type:"gear",item:id});}}));
    this.colliders.push([-7.6,-6.3,4.35,5.6],[-7.9,-7.4,3.1,3.6]);
  }
  setGear(g){this.coat.visible=!g.xalat;this.gog.visible=!g.koz;this.glv.visible=!g.qol;}
  teacherBuild(){
    const t=this.teacher=new THREE.Group();t.position.set(-2.4,0,-4.95);this.sc.add(t);
    const coat=M(0xf7f7f7,{roughness:.8}),skin=M(0xe2b48e,{roughness:.7}),dark=M(0x2f3640);
    [-.08,.08].forEach(x=>this.cyl(.05,.045,.8,dark,x,.4,0,t));
    this.add(new THREE.Mesh(new THREE.CylinderGeometry(.16,.22,.78,16),coat),0,1.17,0,t);
    this.add(new THREE.Mesh(new THREE.SphereGeometry(.16,16,10,0,Math.PI*2,0,Math.PI/2),coat),0,1.55,0,t).scale.set(1,.5,.8);
    [-1,1].forEach(s=>{const a=this.add(new THREE.Mesh(new THREE.CylinderGeometry(.045,.05,.62,10),coat),s*.21,1.22,0,t);a.rotation.z=s*.12;
      this.add(new THREE.Mesh(new THREE.SphereGeometry(.045,10,8),skin),s*.25,.9,0,t);});
    this.cyl(.05,.055,.08,skin,0,1.62,0,t);
    const head=this.tHead=this.add(new THREE.Mesh(new THREE.SphereGeometry(.13,20,16),skin),0,1.78,0,t);
    const hair=new THREE.Mesh(new THREE.SphereGeometry(.137,20,10,0,Math.PI*2,0,Math.PI*.55),M(0x3a2a20));hair.position.y=.02;hair.rotation.x=-.25;head.add(hair);
    [-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.TorusGeometry(.03,.006,6,14),M(0x222222));e.position.set(s*.05,.01,.12);head.add(e);
      const p=new THREE.Mesh(new THREE.SphereGeometry(.012,8,6),M(0x222222));p.position.set(s*.05,.01,.118);head.add(p);});
    const m=new THREE.Mesh(new THREE.TorusGeometry(.03,.006,6,12,Math.PI),M(0x8a3b2e));m.position.set(0,-.05,.115);m.rotation.z=Math.PI;head.add(m);
    t.traverse(o=>{if(o.isMesh){o.castShadow=true;this.pick(o,{type:"teacher"});}});
    this.colliders.push([-2.75,-2.05,-5.3,-4.6]);
  }
  /* ---------- idish ---------- */
  setVessel(type){
    this.type=type;const g=this.vg;while(g.children.length)g.remove(g.children[0]);
    const P=this.prof=PROF[type];this.H=P[P.length-1][1];this.fillMax=FILL[type];
    g.position.set(VX,BASE[type],VZ);
    const outer=P.map(([r,y],i)=>[r+.0035,i===0?-.0035:y]);outer.push([P[P.length-1][0]+.007,this.H+.004]);
    this.glassMat=new THREE.MeshStandardMaterial({color:0xf2f8fc,transparent:true,opacity:.12,roughness:.04,metalness:.1,side:THREE.DoubleSide,depthWrite:false,envMapIntensity:1.1});
    const glass=new THREE.Mesh(new THREE.LatheGeometry(outer.map(p=>new THREE.Vector2(p[0],p[1])),48),this.glassMat);glass.renderOrder=3;g.add(glass);this.pick(glass,{type:"vessel"});
    const hl=new THREE.Mesh(new THREE.PlaneGeometry(.012,this.H*.8),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.18,depthWrite:false}));hl.position.set(-rIn(P,this.H*.5)*.7,this.H*.5,rIn(P,this.H*.5)*.72);hl.rotation.y=-.75;hl.renderOrder=4;g.add(hl);
    if(type!=="probirka"){for(let i=1;i<=4;i++){const y=this.fillMax*i/4;const r0=rIn(P,y);const m=new THREE.Mesh(new THREE.BoxGeometry(.025,.002,.002),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5}));m.position.set(0,y,r0+.004);g.add(m);}}
    this.liqMat=new THREE.MeshStandardMaterial({color:0xdcecf6,emissive:0x000000,transparent:true,opacity:.35,roughness:.35,metalness:0,depthWrite:false,envMapIntensity:.25});
    this.liq=new THREE.Mesh(new THREE.BufferGeometry(),this.liqMat);this.liq.renderOrder=1;g.add(this.liq);this.liqH=-1;
    this.layerG=new THREE.Group();g.add(this.layerG);this.layerKey="";
    this.pieceG=new THREE.Group();g.add(this.pieceG);this.pieceMap={};
    this.tripod.visible=type!=="probirka";this.clamp.visible=type==="probirka";
    if(this.fx){g.add(this.fx.bub,this.fx.ppt,this.fx.cloud,this.fx.rods,this.fx.stir,this.fx.tube);}
    this.vol=this.volTable();this.layerTop=.0015;
    // kamera fokus nuqtasi
    this.target=new THREE.Vector3(VX,BASE[type]+this.H*.45,VZ);
  }
  volTable(){const P=this.prof,N=80,t=[0];for(let i=1;i<=N;i++){const y0=this.fillMax*(i-1)/N,y1=this.fillMax*i/N,r=rIn(P,(y0+y1)/2);t.push(t[i-1]+Math.PI*r*r*(y1-y0));}return t;}
  levelY(f){const t=this.vol,N=t.length-1,v=f*t[N];for(let i=1;i<=N;i++)if(t[i]>=v){const a=(v-t[i-1])/(t[i]-t[i-1]||1);return this.fillMax*(i-1+a)/N;}return this.fillMax;}
  fxBuild(){
    const sg=new THREE.SphereGeometry(1,8,6);
    const bub=new THREE.InstancedMesh(sg,new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.55,roughness:.05,depthWrite:false}),200);bub.renderOrder=2;bub.frustumCulled=false;
    const ppt=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9}),160);ppt.frustumCulled=false;
    const z=new THREE.Matrix4().makeScale(0,0,0);for(let i=0;i<200;i++)bub.setMatrixAt(i,z);for(let i=0;i<160;i++){ppt.setMatrixAt(i,z);ppt.setColorAt(i,new THREE.Color(1,1,1));}
    const cloud=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.12,24,1,true),new THREE.MeshBasicMaterial({color:0xcfe65a,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));
    const rods=new THREE.Group();const rm=M(0x2b2b2b,{roughness:.6});
    this.rodC=new THREE.Mesh(new THREE.CylinderGeometry(.005,.005,.27,10),rm.clone());this.rodA=new THREE.Mesh(new THREE.CylinderGeometry(.005,.005,.27,10),rm.clone());
    rods.add(this.rodC,this.rodA);const bar=new THREE.Mesh(new THREE.BoxGeometry(.2,.012,.03),M(0xe0e0e0));rods.add(bar);this.rodBar=bar;
    const wireM=[M(0x222222),M(0xc62828)];this.wires=[0,1].map(i=>{const w=new THREE.Mesh(new THREE.BufferGeometry(),wireM[i]);this.sc.add(w);return w;});
    const stir=new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,.32,8),new THREE.MeshStandardMaterial({color:0xeef6fb,transparent:true,opacity:.55}));
    const tube=new THREE.Mesh(new THREE.CylinderGeometry(.005,.005,.34,8),new THREE.MeshStandardMaterial({color:0xeef6fb,transparent:true,opacity:.6}));
    this.fx={bub,ppt,cloud,rods,stir,tube,B:[],Pp:[],steam:[],m:new THREE.Matrix4(),q:new THREE.Quaternion(),s:new THREE.Vector3(),p:new THREE.Vector3()};
    const st=ctex(64,64,(c,w)=>{const g=c.createRadialGradient(w/2,w/2,2,w/2,w/2,w/2);g.addColorStop(0,"rgba(255,255,255,.9)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(0,0,w,w);});
    for(let i=0;i<26;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:st,transparent:true,opacity:0,depthWrite:false}));s.visible=false;this.sc.add(s);this.fx.steam.push({s,life:0});}
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:st,color:0xffd54a,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));sp.scale.setScalar(.12);this.sc.add(sp);this.fx.spark=sp;
  }
  // --- har kadr: idish ko'rinishini dvigatel holatiga moslash ---
  update(dt,v){
    this.time+=dt;const f=this.fx,P=this.prof;
    // suyuqlik
    const top=v.level>0?this.levelY(v.level):0;
    if(Math.abs(top-this.liqH)>.0008){this.liqH=top;this.liq.geometry.dispose();this.liq.geometry=top>.002?lathe(P,.0015,top):new THREE.BufferGeometry();}
    if(v.col){const c=new THREE.Color(v.col.c);if(v.turb>.02)c.lerp(new THREE.Color(v.turbCol),Math.min(.85,v.turb*.8));
      const h0={};c.getHSL(h0);if(h0.s>.35)c.setHSL(h0.h,Math.min(1,h0.s*1.1),h0.l*(.62+.3*(1-h0.s)));
      this.liqMat.color.lerp(c,Math.min(1,dt*3));
      const hsl={};this.liqMat.color.getHSL(hsl);const sat=Math.min(1,hsl.s*(1-Math.abs(hsl.l-.5)*1.4)*1.6);
      this.liqMat.emissive.copy(this.liqMat.color).multiplyScalar(.2*sat+.03);
      const op=Math.min(.95,Math.max(v.col.alpha<.33?.2:v.col.alpha,v.turb*.95));this.liqMat.opacity+=(op-this.liqMat.opacity)*Math.min(1,dt*3);}
    // cho'kma qatlamlari
    const key=v.layers.map(l=>l.id+":"+(l.amt*20|0)).join("|");
    let ly=.0015;
    if(key!==this.layerKey){this.layerKey=key;this.layerG.children.forEach(m=>m.geometry.dispose());this.layerG.clear();
      const k=this.type==="probirka"?.03:this.type==="kolba"?.014:.012;
      v.layers.forEach(l=>{const S=KL.SOLIDS[l.id],gel=/OH/.test(S.f)?1.6:1,h=Math.min(.07,Math.max(.004,l.amt*k*gel));const m=new THREE.Mesh(lathe(P,ly,ly+h,32),M(l.c,{roughness:.95}));this.layerG.add(m);ly+=h;});
      this.layerTop=ly;}
    ly=this.layerTop||.0015;
    // kumush ko'zgu
    const mi=v.mirror;this.glassMat.color.setRGB(.95-.12*mi,.97-.14*mi,.99-.14*mi);this.glassMat.opacity=.12+.73*mi;this.glassMat.metalness=.15+.8*mi;this.glassMat.roughness=.03+.1*mi;
    // bo'laklar
    const seen={};
    v.pieces.forEach((p,i)=>{seen[p.id]=1;let o=this.pieceMap[p.id];
      if(!o){o=this.makePiece(p.id);this.pieceMap[p.id]=o;this.pieceG.add(o);o.userData.ang=i*2.1+.4;}
      const s=Math.cbrt(Math.max(.02,p.amt));o.scale.setScalar(s);
      const r0=rIn(P,ly+.01)*.45,a=o.userData.ang;
      if(p.id==="mNa"&&top>0){o.userData.ang+=dt*(v.gas.H2?3:.3);o.position.set(Math.cos(a)*r0,top-.004,Math.sin(a)*r0);
        if(v.gas.H2){f.spark.position.copy(o.getWorldPosition(f.p)).add(new THREE.Vector3(0,.015,0));f.spark.material.opacity=.5+Math.random()*.5;}}
      else o.position.set(Math.cos(a)*r0*(this.type==="probirka"?.2:1),ly+.012*s,Math.sin(a)*r0*(this.type==="probirka"?.2:1));
      const dep=v.layers.find(l=>/^d(Cu|Ag|Pb|Zn|Fe)$/.test(l.id));o.traverse(m=>{if(m.isMesh&&m.userData.base){m.material.color.copy(m.userData.base);if(dep)m.material.color.lerp(new THREE.Color(dep.c),Math.min(.85,dep.amt*2));}});
    });
    if(!v.gas.H2||!v.pieces.some(p=>p.id==="mNa"))f.spark.material.opacity*=.8;
    Object.keys(this.pieceMap).forEach(id=>{if(!seen[id]){this.pieceG.remove(this.pieceMap[id]);delete this.pieceMap[id];}});
    // elektrodlar
    const rx=this.type==="probirka"?.012:Math.min(.05,rIn(P,.05)*.45);
    f.rods.visible=!!v.elec;
    if(v.elec){this.rodC.position.set(-rx,.05+.135,0);this.rodA.position.set(rx,.05+.135,0);this.rodBar.position.set(0,.33,0);this.rodBar.scale.x=Math.max(.5,rx*2/.2+.3);
      this.rodC.material.color.set(v.elec.dep?KL.SOLIDS[v.elec.dep].c:0x2b2b2b);this.rodA.material.color.set(v.elec.anCol||0x2b2b2b);}
    this.wireUpdate(!!v.elec,rx);
    this.batLed.material.emissive.setHex(v.elec?0x22ff55:0x000000);
    // gaz o'tkazgich naycha (CO2)
    f.tube.visible=!!v.gasIn;f.tube.position.set(rx*.6,.17,0);
    // aralashtirish tayoqchasi
    f.stir.visible=!!v.stir;if(v.stir){const a=this.time*6,rr0=rIn(P,top*.5||.05)*.5;f.stir.position.set(Math.cos(a)*rr0,.16,Math.sin(a)*rr0);f.stir.rotation.set(Math.sin(a)*.25,0,Math.cos(a)*.25);}
    // alanga va UV
    this.flame.visible=!!v.heat;this.lampCap.visible=!v.heat;
    if(v.heat){const k=1+Math.sin(this.time*23)*.08+Math.random()*.08;this.flame.scale.set(1,k,1);this.flameL.intensity=.9+Math.random()*.3;}else this.flameL.intensity=0;
    this.uvL.intensity=v.uv?2.2:0;this.uvTube.material.emissive.setHex(v.uv?0x9b5cff:0);
    // rangli gaz buluti
    const gc=v.gas.Cl2?["#cfe65a",v.gas.Cl2]:v.gas.NO?["#b5541c",v.gas.NO*1.5]:null;
    if(gc){f.cloud.material.color.set(gc[0]);f.cloud.material.opacity=Math.min(.45,gc[1]*2.5);}else f.cloud.material.opacity*=Math.pow(.2,dt);
    const cr=rIn(P,Math.min(this.H-.01,top+.05));f.cloud.scale.set(cr/.1,1,cr/.1);f.cloud.position.y=Math.min(this.H-.06,top+.06);
    this.bubbles(dt,v,top,ly,rx);this.particles(dt,v,top,ly);this.steamFx(dt,v,top);
    const ts=this.tweens;this.tweens=[];const keep=ts.filter(t=>t(dt)!==false);this.tweens=keep.concat(this.tweens);
  }
  makePiece(id){
    const S=KL.SOLIDS[id],g=new THREE.Group(),mat=()=>{const m=M(S.c,{roughness:id==="mCaCO3"?.9:.35,metalness:id==="mCaCO3"?0:.75});return m;};
    const addm=(geo,x,y,z,rx,ry,rz)=>{const m=new THREE.Mesh(geo,mat());m.position.set(x,y,z);m.rotation.set(rx||0,ry||0,rz||0);m.userData.base=m.material.color.clone();g.add(m);return m;};
    const sh=S.shape,small=this.type==="probirka";
    if(sh==="granule")[[0,0,0],[.018,-.002,.01],[-.012,-.003,.016]].forEach(([x,y,z],i)=>addm(new THREE.DodecahedronGeometry(small?.008:.013-i*.002),x*(small?.4:1),y,z*(small?.4:1),i,i*2,0));
    else if(sh==="ribbon")addm(new THREE.BoxGeometry(small?.012:.07,.003,small?.05:.014),0,0,0,0,.4,0);
    else if(sh==="nail"){addm(new THREE.CylinderGeometry(.004,.004,small?.05:.09,8),0,0,0,0,0,small?0:1.5);addm(new THREE.CylinderGeometry(.009,.009,.003,10),small?0:.045,small?.026:0,0,0,0,small?0:1.5);}
    else if(sh==="wire")addm(new THREE.TorusGeometry(small?.009:.02,.0022,6,24),0,0,0,Math.PI/2.4,0,0);
    else if(sh==="cube")addm(new THREE.BoxGeometry(.016,.012,.014),0,0,0,.2,.5,0);
    else [[0,0,0],[.02,0,.012],[-.016,0,.014],[.004,.006,-.016]].forEach(([x,y,z],i)=>addm(new THREE.DodecahedronGeometry(small?.007:.012-i*.0015),x*(small?.35:1),y,z*(small?.35:1),i,i,i));
    return g;
  }
  wireUpdate(on,rx){
    this.wires.forEach((w,i)=>{w.visible=on;if(!on||w.userData.rx===rx&&w.userData.t===this.type)return;w.userData.rx=rx;w.userData.t=this.type;
      const a=new THREE.Vector3(VX+(i?rx:-rx),BASE[this.type]+.32,VZ),b=new THREE.Vector3(.62+(i?-.06:.04),BT+.15,-2.75);
      const mid=a.clone().lerp(b,.5).add(new THREE.Vector3(0,.12,.05));w.geometry.dispose();w.geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a,mid,b]),16,.004,6,false);});
  }
  bubbles(dt,v,top,ly,rx){
    const f=this.fx,B=f.B,P=this.prof;
    if(top>.003){
      let rate=0;for(const g in v.gas)rate+=v.gas[g];rate=Math.min(260,rate*110);
      const boil=v.boil?70:0,tube=v.gasIn?45:0,ec=v.elec?Math.min(60,v.elec.cat*1100):0,ea=v.elec?Math.min(60,v.elec.an*1100):0;
      const spawn=(n,fn)=>{let k=n*dt;while(k>0&&B.length<200){if(k<1&&Math.random()>k)break;k--;B.push(fn());}};
      const pc=Object.values(this.pieceMap);
      spawn(rate,()=>{let x,z;const fromPiece=pc.length&&Math.random()<.8;if(fromPiece){const o=pc[Math.random()*pc.length|0];x=o.position.x+rr(-.01,.01);z=o.position.z+rr(-.01,.01);}else{const r=rIn(P,ly+.01)*.75*Math.sqrt(Math.random()),a=Math.random()*7;x=Math.cos(a)*r;z=Math.sin(a)*r;}
        return{x,y:ly+.006,z,r:rr(.0015,.0042),v:rr(.06,.13),w:Math.random()*7};});
      spawn(boil,()=>{const r=rIn(P,ly+.01)*.7*Math.sqrt(Math.random()),a=Math.random()*7;return{x:Math.cos(a)*r,y:ly+.004,z:Math.sin(a)*r,r:rr(.003,.007),v:rr(.1,.2),w:Math.random()*7};});
      spawn(tube,()=>({x:rx*.6+rr(-.004,.004),y:.01,z:rr(-.004,.004),r:rr(.002,.004),v:rr(.08,.12),w:0}));
      spawn(ec,()=>({x:-rx+rr(-.004,.004),y:rr(.06,top*.9),z:rr(-.004,.004),r:rr(.0012,.0025),v:rr(.05,.09),w:0}));
      spawn(ea,()=>({x:rx+rr(-.004,.004),y:rr(.06,top*.9),z:rr(-.004,.004),r:rr(.0012,.003),v:rr(.05,.09),w:0}));
    }
    let popped=0;
    for(let i=B.length-1;i>=0;i--){const b=B[i];b.y+=b.v*dt;b.x+=Math.sin(this.time*8+b.w)*.004*dt;if(b.y>=top-.002){B.splice(i,1);popped++;}}
    if(popped&&Math.random()<.5)KL.sfx.bubble();
    const m=f.m,q=f.q,s=f.s,p=f.p;
    for(let i=0;i<200;i++){if(i<B.length){const b=B[i];p.set(b.x,b.y,b.z);s.setScalar(b.r);m.compose(p,q,s);}else m.makeScale(0,0,0);f.bub.setMatrixAt(i,m);}
    f.bub.instanceMatrix.needsUpdate=true;
  }
  particles(dt,v,top,ly){
    const f=this.fx,Pp=f.Pp,P=this.prof;
    if(this.pptQ&&this.pptQ.length&&top>.003){this.pptQ.forEach(([id,n])=>{const S=KL.SOLIDS[id];if(!S||S.kind==="dep"||S.kind==="mirror"||S.kind==="res")return;
      const c=new THREE.Color(S.c);let k=Math.min(50,Math.ceil(n*70));while(k-->0&&Pp.length<160){const y=rr(ly+.01,top),r=rIn(P,y)*.8*Math.sqrt(Math.random()),a=Math.random()*7;Pp.push({x:Math.cos(a)*r,y,z:Math.sin(a)*r,v:rr(.015,.04),s:rr(.0015,.003),c});}});}
    this.pptQ=[];
    for(let i=Pp.length-1;i>=0;i--){const q=Pp[i];q.y-=q.v*dt;if(q.y<=ly+.002)Pp.splice(i,1);}
    const m=f.m,s=f.s,p=f.p,q=f.q;
    for(let i=0;i<160;i++){if(i<Pp.length){const a=Pp[i];p.set(a.x,a.y,a.z);s.setScalar(a.s);m.compose(p,q,s);f.ppt.setColorAt(i,a.c);}else m.makeScale(0,0,0);f.ppt.setMatrixAt(i,m);}
    f.ppt.instanceMatrix.needsUpdate=true;if(f.ppt.instanceColor)f.ppt.instanceColor.needsUpdate=true;
  }
  steamFx(dt,v,top){
    const n=v.boil?14:v.T>70&&top>0?(v.T-70)/30*6:v.heat&&top===0&&v.T>150?3:0;
    if(n>0&&Math.random()<n*dt){const s=this.fx.steam.find(x=>x.life<=0);if(s){s.life=2.5;s.s.visible=true;s.s.position.copy(this.vg.position).add(new THREE.Vector3(rr(-.03,.03),Math.max(top,this.H*.6)+.02,rr(-.03,.03)));s.s.scale.setScalar(.04);}}
    this.fx.steam.forEach(s=>{if(s.life<=0)return;s.life-=dt;s.s.position.y+=.09*dt;s.s.position.x+=Math.sin(this.time+s.life)*.01*dt;s.s.scale.multiplyScalar(1+dt*.45);s.s.material.opacity=Math.max(0,s.life/2.5*.5);if(s.life<=0)s.s.visible=false;});
  }
  /* ---------- quyish animatsiyasi ---------- */
  pour(id,onPour){this.queue.push([id,onPour]);if(!this.busy)this.nextPour();}
  nextPour(){
    const job=this.queue.shift();if(!job){this.busy=false;return;}
    this.busy=true;const[id,onPour]=job,b=this.bottles[id],s=KL.SHELF_BY_ID[id];
    const camD=this.cam.position.distanceTo(this.target);
    if(!b||s.k==="gas"||camD>6){onPour();setTimeout(()=>this.nextPour(),s.k==="gas"?300:120);return;}
    const home=b.userData.home,h=b.userData.h||.15,from=new THREE.Vector3(home.x,home.y,home.z);
    const vt=this.vg.position.y+this.H;const to=new THREE.Vector3(VX+.1+h*.5,vt+.1+(s.k==="drop"?.02:0),VZ+.02);
    const tilt=s.k==="drop"?1.2:s.k==="piece"||s.k==="powder"?1.55:1.95;
    let t=0,phase=0,poured=false;const D=[.75,.3,.6,.3,.75];
    const mouth=new THREE.Vector3();
    this.tweens.push(dt=>{
      t+=dt;if(t>D[phase]){t-=D[phase];phase++;}
      if(phase>=5){b.position.copy(from);b.rotation.set(0,0,0);this.stream(false);this.nextPour();return false;}
      const k=ease(Math.min(1,t/D[phase]));
      if(phase===0){b.position.lerpVectors(from,to,k);b.position.y+=Math.sin(k*Math.PI)*.35;}
      if(phase===1)b.rotation.z=tilt*k;
      if(phase===2){b.rotation.z=tilt;if(!poured){poured=true;onPour();}mouth.set(0,h+.04,0);b.localToWorld(mouth);this.stream(true,mouth,s);}
      if(phase===3){this.stream(false);b.rotation.z=tilt*(1-k);}
      if(phase===4){b.position.lerpVectors(to,from,k);b.position.y+=Math.sin(k*Math.PI)*.35;}
    });
  }
  stream(on,from,s){
    if(!this.streamM){this.streamM=new THREE.Mesh(new THREE.CylinderGeometry(.0035,.0025,1,8),new THREE.MeshStandardMaterial({color:0xcfe6f5,transparent:true,opacity:.7,depthWrite:false}));this.sc.add(this.streamM);
      this.dropM=new THREE.Mesh(new THREE.SphereGeometry(.006,8,6),M(0xffffff));this.sc.add(this.dropM);}
    const m=this.streamM;m.visible=false;this.dropM.visible=false;if(!on)return;
    const end=this.vg.position.clone();end.y+=Math.max(this.liqH,.01);
    if(s.k==="drop"||s.k==="piece"||s.k==="powder"){const d=this.dropM;d.visible=true;const k=(this.time*2.2)%1;d.position.lerpVectors(from,end,k*k);
      d.material.color.set(s.k==="drop"?(s.b||"#f2f2f2"):KL.SOLIDS[s.solid].c);d.scale.setScalar(s.k==="drop"?.6:1.4);return;}
    m.visible=true;const col=s.b||(s.ions&&s.ions.map(([i])=>KL.IONS[i].c).find(Boolean))||(s.mol&&s.mol.map(([x])=>KL.MOLS[x].c).find(Boolean))||"#d6ecf8";m.material.color.set(col);
    const len=from.distanceTo(end);m.position.lerpVectors(from,end,.5);m.scale.set(1,len,1);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),from.clone().sub(end).normalize());
  }
  /* ---------- kamera va boshqaruv ---------- */
  focus(on){
    const was=this.mode;this.mode=on?"orbit":"walk";if(was===this.mode)return;
    this.camFrom={p:this.cam.position.clone(),q:this.cam.quaternion.clone(),t:0};
    if(!on){this.P.x=VX;this.P.z=VZ+1.75;this.P.yaw=0;this.P.pitch=-.32;}
    else{this.orb.yaw=Math.atan2(this.cam.position.x-VX,this.cam.position.z-VZ)*.3;this.orb.dist=this.type==="probirka"?.62:.82;this.orb.pitch=.3;}
  }
  goBench(){this.mode="walk";this.camFrom={p:this.cam.position.clone(),q:this.cam.quaternion.clone(),t:0};this.P.x=VX;this.P.z=VZ+1.75;this.P.yaw=0;this.P.pitch=-.32;}
  goHanger(){this.mode="walk";this.camFrom={p:this.cam.position.clone(),q:this.cam.quaternion.clone(),t:0};this.P.x=-5.6;this.P.z=4.1;this.P.yaw=1.2;this.P.pitch=-.18;}
  ok(x,z){return x>-7.6&&x<7&&z>-5.6&&z<5.6&&!this.colliders.some(w=>x>w[0]-.22&&x<w[1]+.22&&z>w[2]-.22&&z<w[3]+.22);}
  input(){
    const cv=this.canvas,keys=this.keys={};
    addEventListener("keydown",e=>{if(!this.active||/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||""))return;keys[e.key.toLowerCase()]=1;if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase()))e.preventDefault();});
    addEventListener("keyup",e=>{delete keys[e.key.toLowerCase()];});
    addEventListener("blur",()=>{for(const k in keys)delete keys[k];});
    const pts=new Map();let down=null,pinch=null,hoverT=0;
    cv.addEventListener("pointerdown",e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(pts.size===2){const[a,b]=[...pts.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),dist:this.orb.dist};down=null;}
      else down={x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY,t:performance.now(),moved:0};});
    cv.addEventListener("pointermove",e=>{
      if(pts.has(e.pointerId))pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(pinch&&pts.size===2){const[a,b]=[...pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);this.orb.dist=Math.max(.3,Math.min(2,pinch.dist*pinch.d/d));return;}
      if(down){const dx=e.clientX-down.lx,dy=e.clientY-down.ly;down.moved+=Math.abs(dx)+Math.abs(dy);down.lx=e.clientX;down.ly=e.clientY;
        if(this.mode==="orbit"){this.orb.yaw-=dx*.008;this.orb.pitch=Math.max(-.2,Math.min(1.3,this.orb.pitch+dy*.006));}
        else{this.P.yaw+=dx*.0045;this.P.pitch=Math.max(-1.2,Math.min(1,this.P.pitch+dy*.0035));}
        if(down.moved>6)cv.style.cursor="grabbing";return;}
      if(e.pointerType==="mouse"){const n=performance.now();if(n-hoverT>70){hoverT=n;this.hover(e);}}
    });
    const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=null;cv.style.cursor="";const d=down;down=null;
      if(d&&d.moved<8&&performance.now()-d.t<450)this.tap(e);};
    cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",e=>{pts.delete(e.pointerId);down=null;pinch=null;});
    cv.addEventListener("pointerleave",()=>this.cb.onHover(null));
    cv.addEventListener("wheel",e=>{e.preventDefault();if(this.mode==="orbit")this.orb.dist=Math.max(.3,Math.min(2,this.orb.dist*(1+e.deltaY*.0012)));else{const s=-e.deltaY*.0025;this.tryMove(-Math.sin(this.P.yaw)*s,-Math.cos(this.P.yaw)*s);}},{passive:false});
    cv.addEventListener("dblclick",()=>{if(this.mode==="walk"){this.cb.onPick({type:"vessel",dbl:1});}});
    this.ray=new THREE.Raycaster();
  }
  rayAt(e){const b=this.canvas.getBoundingClientRect();this.ray.setFromCamera(new THREE.Vector2((e.clientX-b.left)/b.width*2-1,-((e.clientY-b.top)/b.height*2-1)),this.cam);
    const vis=o=>{while(o){if(!o.visible)return false;o=o.parent;}return true;};
    const h=this.ray.intersectObjects(this.inter,true).find(x=>x.distance<9&&vis(x.object));
    if(!h)return null;let o=h.object;while(!o.userData.pick)o=o.parent;return{pick:o.userData.pick,obj:o,dist:h.distance};}
  tap(e){const h=this.rayAt(e);if(h)this.cb.onPick(h.pick,h);}
  hover(e){
    const h=this.rayAt(e);const id=h&&h.pick.type==="bottle"?h.pick.id:null;
    if(this.hl&&this.hl!==id){const b=this.bottles[this.hl];if(b&&b.userData.body)b.userData.body.material.emissive&&b.userData.body.material.emissive.setHex(0);this.hl=null;}
    if(id&&this.hl!==id){const b=this.bottles[id];if(b.userData.body.material.emissive)b.userData.body.material.emissive.setHex(0x334455);this.hl=id;}
    this.canvas.style.cursor=h?"pointer":"";this.cb.onHover(h?h.pick:null,e.clientX,e.clientY);
  }
  tryMove(dx,dz){if(this.ok(this.P.x+dx,this.P.z))this.P.x+=dx;if(this.ok(this.P.x,this.P.z+dz))this.P.z+=dz;}
  move(dt,jv){
    const k=this.keys;let fx=-(jv?jv.y:0),sx=jv?jv.x:0;
    if(k.w||k.arrowup||k["ц"])fx+=1;if(k.s||k.arrowdown||k["ы"])fx-=1;if(k.d||k["в"])sx+=1;if(k.a||k["ф"])sx-=1;
    if(k.arrowleft)this.P.yaw+=dt*1.7;if(k.arrowright)this.P.yaw-=dt*1.7;
    if(this.mode==="orbit"){if(fx||sx){if(Math.abs(fx)>.3||Math.abs(sx)>.3){this.focus(false);this.cb.onMode&&this.cb.onMode("walk");}}return;}
    const sp=(k.shift?3.6:2.3)*dt,c=Math.cos(this.P.yaw),s=Math.sin(this.P.yaw);
    this.tryMove((-s*fx+c*sx)*sp,(-c*fx-s*sx)*sp);
  }
  resize(){const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;this.r.setSize(w,h,false);this.cam.aspect=w/h;this.cam.updateProjectionMatrix();this.w=w;this.h=h;}
  setSheet(px){this.sheet=px||0;}
  render(dt){
    const cam=this.cam;
    if(this.mode==="orbit"){const o=this.orb,t=this.target;const p=new THREE.Vector3(t.x+Math.sin(o.yaw)*Math.cos(o.pitch)*o.dist,t.y+Math.sin(o.pitch)*o.dist,t.z+Math.cos(o.yaw)*Math.cos(o.pitch)*o.dist);
      this.goal={p,look:t};}
    else{const P=this.P;this.goal={p:new THREE.Vector3(P.x,1.6,P.z),yaw:P.yaw,pitch:P.pitch};}
    const g=this.goal;let q;
    if(g.look){const m=new THREE.Matrix4().lookAt(g.p,g.look,new THREE.Vector3(0,1,0));q=new THREE.Quaternion().setFromRotationMatrix(m);}
    else q=new THREE.Quaternion().setFromEuler(new THREE.Euler(g.pitch,g.yaw,0,"YXZ"));
    if(this.camFrom){const f=this.camFrom;f.t+=dt/.7;const k=ease(Math.min(1,f.t));cam.position.lerpVectors(f.p,g.p,k);cam.quaternion.slerpQuaternions(f.q,q,k);if(f.t>=1)this.camFrom=null;}
    else{cam.position.copy(g.p);cam.quaternion.copy(q);}
    if(this.sheet>0&&this.w<760&&this.mode==="orbit")cam.setViewOffset(this.w,this.h,0,this.sheet*.42,this.w,this.h);else cam.clearViewOffset();
    // o'qituvchi
    if(this.teacher){const tp=this.teacher.position,a=Math.atan2(cam.position.x-tp.x,cam.position.z-tp.z);this.teacher.rotation.y+=(Math.max(-1,Math.min(1,a))-this.teacher.rotation.y)*Math.min(1,dt*2);this.tHead.position.y=1.78+Math.sin(this.time*1.6)*.006;}
    if(!this.ct||this.time-this.ct>1){this.ct=this.time;redraw(this.clockT,(c,w,h)=>this.drawClock(c,w,h));}
    this.r.render(this.sc,cam);
  }
}
KL.Lab3D=Lab3D;
})(globalThis.KL=globalThis.KL||{});
