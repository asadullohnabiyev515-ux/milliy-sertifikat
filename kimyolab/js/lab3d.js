// KimyoLab — 3D laboratoriya xonasi (Three.js r150): xona, javon, tajriba stoli, jonli idish, asboblar, kamera
(function(KL){
"use strict";
const BT=0.96, VX=0, VZ=-2.25;                       // stol usti balandligi va idish joyi
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
const lerpA=(a,b,t)=>{let d=(b-a)%(Math.PI*2);if(d>Math.PI)d-=Math.PI*2;if(d<-Math.PI)d+=Math.PI*2;return a+d*t;};
// cho'kma turlari: n — zarrachalar soni (1 ulushga), s — o'lcham, v — cho'kish tezligi, m — ko'rinish
const FORMS={gel:{n:55,cap:44,s:[.007,.016],v:[.004,.01],m:"gel"},curd:{n:44,cap:44,s:[.0035,.0075],v:[.016,.03],m:"o",clump:1},
  cryst:{n:110,cap:80,s:[.0011,.002],v:[.005,.01],m:"o"},glitter:{n:70,cap:60,s:[.003,.0055],v:[.008,.015],m:"gl"},
  powder:{n:55,cap:40,s:[.0014,.0028],v:[.015,.025],m:"o"},flake:{n:40,cap:30,s:[.003,.006],v:[.01,.02],m:"o",clump:1}};
function rIn(prof,y){for(let i=1;i<prof.length;i++){const[a,ya]=prof[i-1],[b,yb]=prof[i];if(y<=yb)return yb===ya?b:a+(b-a)*(y-ya)/(yb-ya);}return prof[prof.length-1][0];}
function lathe(prof,y0,y1,seg=40){
  const pts=[new THREE.Vector2(0,y0)];
  pts.push(new THREE.Vector2(Math.max(.001,rIn(prof,y0)),y0));
  prof.forEach(([r,y])=>{if(y>y0&&y<y1)pts.push(new THREE.Vector2(r,y));});
  pts.push(new THREE.Vector2(Math.max(.001,rIn(prof,y1)),y1),new THREE.Vector2(0,y1));
  return new THREE.LatheGeometry(pts,seg);
}
// Frenel effekti: sirtga qiya qaralganda shaffoflik kamayadi — shisha devorlari va suyuqlik hajmi aniq ko'rinadi
function fresnel(mat,k,pw,glow){mat.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace("#include <output_fragment>",
  `float fr_=pow(1.0-abs(dot(normal,normalize(vViewPosition))),${pw.toFixed(2)});outgoingLight+=vec3(fr_*${glow.toFixed(3)});diffuseColor.a=min(1.0,diffuseColor.a+fr_*${k.toFixed(3)});
  #include <output_fragment>`);};mat.customProgramCacheKey=()=>"fr"+k+"_"+pw+"_"+glow;return mat;}
// loyqalik turi: qanchalik xira qiladi (op) va suyuqlikni qanchalik bo'yaydi (cw)
const TURB={cryst:{op:.93,cw:1},powder:{op:.72,cw:.9},gel:{op:.42,cw:.7},curd:{op:.3,cw:.45},glitter:{op:.26,cw:.4},flake:{op:.38,cw:.5}};
// cho'kma hosil bo'lganda ichida tarqaladigan bulut: soni, shaffofligi, umri
const CLOUD={gel:[7,.5,6],curd:[6,.55,2.6],cryst:[9,.55,8],glitter:[3,.28,3],powder:[4,.5,3],flake:[4,.45,3]};
function wrapText(c,txt,x,y,maxW,lh){const words=txt.split(" ");let line="";for(const w of words){const t=line?line+" "+w:w;if(c.measureText(t).width>maxW&&line){c.fillText(line,x,y);y+=lh;line=w;}else line=t;}if(line)c.fillText(line,x,y);return y;}

class Lab3D{
  constructor(canvas,host,cb){
    this.cb=cb;this.host=host;this.canvas=canvas;
    this.mobile=matchMedia("(pointer:coarse)").matches;
    const r=this.r=new THREE.WebGLRenderer({canvas,antialias:!this.mobile,powerPreference:"high-performance"});
    this.dpr=Math.min(devicePixelRatio,this.mobile?1.5:2);r.setPixelRatio(this.dpr);
    r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=.82;
    r.shadowMap.enabled=!this.mobile;r.shadowMap.type=THREE.PCFSoftShadowMap;
    this.sc=new THREE.Scene();this.sc.background=new THREE.Color(0xd5dde4);
    this.cam=new THREE.PerspectiveCamera(60,1,.02,60);
    this.inter=[];this.tweens=[];this.colliders=[];this.time=0;this.sheet=0;this.sideOff=0;this.queue=[];this.busy=false;
    this.env();this.room();this.decor();this.bench();this.rack();this.side();this.hanger();this.people();
    this.vg=new THREE.Group();this.sc.add(this.vg);this.fxBuild();this.efx=new KL.FX(this);this.setVessel("stakan");
    this.navBuild();
    // o'quvchi eshik yonida, kiyim ilgichiga qarab turadi; kamera — orqasidan (3-shaxs)
    this.pl={x:-5.9,z:4.7,rot:-1.53,spd:0,path:null,cb:null};this.mode="follow";
    this.camO={yaw:-1.53+Math.PI,pitch:.3,dist:2.8,drag:-9};this.orb={yaw:0,pitch:.32,dist:.85};
    this.cpos=new THREE.Vector3();this.clook=new THREE.Vector3();this.camSnap=true;
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
  /* ---------- reaktivlar polkasi: tajriba stoli ustida, 4 pog'ona ---------- */
  rack(){
    const W=3.0,TY=[0,.2,.4,.6],TZ=[-2.8,-2.95,-3.1,-3.25],lam=M(0xf1ede4,{roughness:.55}),edge=M(0xb98a5a,{roughness:.5});
    for(let i=1;i<4;i++){const st=this.box(W,TY[i],.15,lam,0,BT+TY[i]/2,TZ[i]);st.receiveShadow=true;this.box(W,.014,.006,edge,0,BT+TY[i]-.007,TZ[i]+.078);}
    this.box(W,.03,.15,lam,0,BT+.015,TZ[0]);this.box(W,.014,.006,edge,0,BT+.023,TZ[0]+.078);
    this.box(W+.06,.9,.03,M(0xe2ddd0),0,BT+.45,-3.34);[-1,1].forEach(k=>this.box(.03,.9,.64,edge,k*(W/2+.015),BT+.45,-3.03));
    const by=g=>KL.SHELF.filter(x=>x.g===g),sol=by("solid");
    const rows=[[sol.slice(0,6),sol.slice(6)],[[...by("acid"),...by("base")],by("ind")],[by("salt"),[]],[by("org"),[]]];
    this.bottles={};
    rows.forEach(([left,right],ri)=>{
      const xs=[],gap=right.length?.62:0,a=-W/2+.12,d=W/2-.12;
      const span=(n,x0,x1)=>{for(let i=0;i<n;i++)xs.push(n>1?x0+(x1-x0)*i/(n-1):(x0+x1)/2);};
      if(gap){span(left.length,a,-gap/2);span(right.length,gap/2,d);}else span(left.length,a,d);
      [...left,...right].forEach((sh,i)=>{const bo=this.bottle(sh);bo.scale.setScalar(ri===2?.82:.9);
        const home={x:xs[i],y:BT+TY[ri]+(ri===0?.03:0),z:TZ[ri]};bo.position.set(home.x,home.y,home.z);bo.userData.home=home;this.sc.add(bo);this.bottles[sh.id]=bo;});
    });
  }
  /* ---------- o'ng devor: mo'rili shkaf va yuvinish joyi ---------- */
  side(){
    const lam=M(0xe9ecef,{roughness:.5}),dark=M(0x2e3a44,{roughness:.35,metalness:.1}),Z=.4;
    this.box(.8,.9,1.6,lam,7.58,.45,Z);this.box(.86,.05,1.66,dark,7.57,.925,Z);
    [-.77,.77].forEach(dz=>this.box(.8,1.3,.06,lam,7.58,1.6,Z+dz));this.box(.86,.5,1.66,lam,7.57,2.5,Z);this.box(.04,1.3,1.5,M(0xdde4ea),7.96,1.6,Z);
    const g=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.75),new THREE.MeshStandardMaterial({color:0xcfe6f5,transparent:true,opacity:.22,roughness:.05,metalness:.2,depthWrite:false}));g.position.set(7.17,1.87,Z);g.rotation.y=-Math.PI/2;this.sc.add(g);
    this.box(.02,.04,1.5,M(0x888888,{metalness:.7}),7.16,1.48,Z);this.box(.5,.02,1.3,M(0xffffff,{emissive:0xffffff,emissiveIntensity:.8}),7.6,2.24,Z);
    const pt=ctex(256,48,(c,w,h)=>{c.fillStyle="#2c3e50";c.fillRect(0,0,w,h);c.fillStyle="#fff";c.font="bold 24px sans-serif";c.textAlign="center";c.fillText("Mo'rili shkaf",w/2,32);});
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(.8,.15),new THREE.MeshBasicMaterial({map:pt}));pl.position.set(7.13,2.5,Z);pl.rotation.y=-Math.PI/2;this.sc.add(pl);
    const f=new THREE.Mesh(lathe(PROF.kolba,0,.28),new THREE.MeshStandardMaterial({color:0xeef6fb,transparent:true,opacity:.3,depthWrite:false}));f.position.set(7.6,.95,Z+.25);this.sc.add(f);
    const l=new THREE.Mesh(lathe(PROF.kolba,.004,.1),new THREE.MeshStandardMaterial({color:0xf28c28,transparent:true,opacity:.75}));l.position.set(7.6,.95,Z+.25);this.sc.add(l);
    this.colliders.push([7.05,8,Z-.9,Z+.9]);
    this.box(.7,.9,1.5,lam,7.62,.45,-3.1);this.box(.76,.05,1.56,dark,7.61,.925,-3.1);this.box(.5,.03,.6,M(0x9aa4ae,{metalness:.6,roughness:.3}),7.58,.94,-3.1);
    this.cyl(.015,.015,.3,M(0xcccccc,{metalness:.9,roughness:.2}),7.85,1.1,-3.1);this.box(.22,.02,.02,M(0xcccccc,{metalness:.9,roughness:.2}),7.75,1.25,-3.1);
    this.colliders.push([7.15,8,-3.9,-2.3]);
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
    const lw=k==="drop"?.085:.125;const L=new THREE.Mesh(new THREE.PlaneGeometry(lw,lw*.45),new THREE.MeshBasicMaterial({map:lbl}));
    L.position.set(0,k==="gas"?.1:(h||.15)*.5,k==="gas"?.075:k==="drop"?.045:k==="piece"||k==="powder"?.074:k==="water"?.068:.065);g.add(L);
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
    const bat=this.battery=new THREE.Group();bat.position.set(.62,BT,VZ-.05);this.sc.add(bat);
    this.box(.26,.13,.16,M(0x37474f,{roughness:.5}),0,.065,0,bat);this.box(.2,.06,.005,M(0x263238,{emissive:0x0,}),0,.07,.082,bat);
    this.batLed=this.cyl(.008,.008,.01,M(0x330000,{emissive:0x000000}),.08,.135,.04,bat);
    this.cyl(.012,.012,.03,M(0xc62828),-.06,.14,0,bat);this.cyl(.012,.012,.03,M(0x222222),.04,.14,0,bat);
    bat.traverse(o=>{if(o.isMesh)this.pick(o,{type:"battery"});});
    // UV lampa
    const uv=this.uvLamp=new THREE.Group();uv.position.set(-.5,BT,VZ-.08);this.sc.add(uv);
    this.box(.14,.02,.14,M(0x333333),0,.01,0,uv);this.cyl(.007,.007,.6,M(0x999999,{metalness:.8}),0,.3,0,uv);
    const arm=this.box(.36,.012,.012,M(0x999999,{metalness:.8}),.17,.6,.0,uv);void arm;
    this.uvHead=this.box(.14,.05,.07,M(0x2b2b2b),.34,.58,.0,uv);this.uvTube=this.box(.12,.012,.05,M(0x6a3fb5,{emissive:0x000000}),.34,.552,0,uv);
    this.uvL=new THREE.SpotLight(0x9b5cff,0,1.8,.7,.5);this.uvL.position.set(.34,.55,0);uv.add(this.uvL);this.uvL.target.position.set(.5,.25,.08);uv.add(this.uvL.target);
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
  setGear(g){this.coat.visible=!g.xalat;this.gog.visible=!g.koz;this.glv.visible=!g.qol;KL.dressHuman(this.player,g);}
  people(){
    this.player=KL.makeHuman({shirt:0x3d6fb5,pants:0x2f3640,hair:0x2b1d14});this.sc.add(this.player);
    const t=this.teacher=KL.makeHuman({coat:1,glasses:1,hair:0x8a8a8a,pants:0x3b3f4a,shirt:0xffffff,long:0});
    t.userData.h.P.gog.userData.fixed=1;t.userData.h.P.gog.visible=true;this.sc.add(t);
    t.traverse(o=>{if(o.isMesh)this.pick(o,{type:"teacher"});});
    this.tch={x:-2.4,z:-4.95,rot:.5,path:null,spd:0,cb:null};
  }
  /* ---------- idish ---------- */
  setVessel(type){
    this.type=type;const g=this.vg;while(g.children.length)g.remove(g.children[0]);
    const P=this.prof=PROF[type];this.H=P[P.length-1][1];this.fillMax=FILL[type];
    g.position.set(VX,BASE[type],VZ);
    const outer=P.map(([r,y],i)=>[r+.0035,i===0?-.0035:y]);outer.push([P[P.length-1][0]+.007,this.H+.004]);
    this.glassMat=fresnel(new THREE.MeshStandardMaterial({color:0xf2f8fc,transparent:true,opacity:.1,roughness:.04,metalness:.1,side:THREE.DoubleSide,depthWrite:false,envMapIntensity:1.1}),.5,2.6,.16);
    const glass=new THREE.Mesh(new THREE.LatheGeometry(outer.map(p=>new THREE.Vector2(p[0],p[1])),48),this.glassMat);glass.renderOrder=3;g.add(glass);this.pick(glass,{type:"vessel"});
    const hl=new THREE.Mesh(new THREE.PlaneGeometry(.012,this.H*.8),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.18,depthWrite:false}));hl.position.set(-rIn(P,this.H*.5)*.7,this.H*.5,rIn(P,this.H*.5)*.72);hl.rotation.y=-.75;hl.renderOrder=4;g.add(hl);
    if(type!=="probirka"){for(let i=1;i<=4;i++){const y=this.fillMax*i/4;const r0=rIn(P,y);const m=new THREE.Mesh(new THREE.BoxGeometry(.025,.002,.002),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5}));m.position.set(0,y,r0+.004);g.add(m);}}
    this.liqMat=fresnel(new THREE.MeshStandardMaterial({color:0xdcecf6,emissive:0x000000,transparent:true,opacity:.35,roughness:.35,metalness:0,depthWrite:false,envMapIntensity:.25}),.24,1.8,0);
    this.liq=new THREE.Mesh(new THREE.BufferGeometry(),this.liqMat);this.liq.renderOrder=1;g.add(this.liq);this.liqH=-1;
    // menisk: suyuqlik sathidagi yorqin halqa — tiniq suyuqlik ham ko'rinadi
    this.men=new THREE.Mesh(new THREE.TorusGeometry(1,.011,6,56),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5,depthWrite:false}));this.men.rotation.x=Math.PI/2;this.men.renderOrder=2;this.men.visible=false;g.add(this.men);
    this.layerG=new THREE.Group();g.add(this.layerG);this.layerKey="";
    this.pieceG=new THREE.Group();g.add(this.pieceG);this.pieceMap={};
    this.tripod.visible=type!=="probirka";this.clamp.visible=type==="probirka";
    if(this.fx){const f=this.fx;g.add(f.bub,f.pO,f.pG,f.pS,f.lumps,f.foam,f.rods,f.stir,f.tube);f.B.length=0;f.Pp.length=0;f.L.length=0;this.foam=0;this.foamH=-1;}
    this.vol=this.volTable();this.layerTop=.0015;
    // kamera fokus nuqtasi
    this.target=new THREE.Vector3(VX,BASE[type]+this.H*.45,VZ);
  }
  volTable(){const P=this.prof,N=80,t=[0];for(let i=1;i<=N;i++){const y0=this.fillMax*(i-1)/N,y1=this.fillMax*i/N,r=rIn(P,(y0+y1)/2);t.push(t[i-1]+Math.PI*r*r*(y1-y0));}return t;}
  levelY(f){const t=this.vol,N=t.length-1,v=f*t[N];for(let i=1;i<=N;i++)if(t[i]>=v){const a=(v-t[i-1])/(t[i]-t[i-1]||1);return this.fillMax*(i-1+a)/N;}return this.fillMax;}
  fxBuild(){
    const sg=new THREE.SphereGeometry(1,8,6),z=new THREE.Matrix4().makeScale(0,0,0),wc=new THREE.Color(1,1,1);
    const bub=new THREE.InstancedMesh(sg,new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.55,roughness:.05,depthWrite:false}),260);bub.renderOrder=2;bub.frustumCulled=false;
    const inst=(geo,mat,n)=>{const m=new THREE.InstancedMesh(geo,mat,n);m.frustumCulled=false;for(let i=0;i<n;i++){m.setMatrixAt(i,z);m.setColorAt(i,wc);}return m;};
    const pO=inst(new THREE.IcosahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9}),240);
    const pG=inst(new THREE.SphereGeometry(1,10,8),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.35,transparent:true,opacity:.74,depthWrite:false,envMapIntensity:.35}),100);pG.renderOrder=2;
    const pS=inst(new THREE.CylinderGeometry(1,1,.22,6),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.2,metalness:.85,emissive:0x5a4400}),90);
    const lumps=inst(new THREE.DodecahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:0xffffff,roughness:1}),140);
    for(let i=0;i<260;i++)bub.setMatrixAt(i,z);
    const foam=new THREE.Mesh(new THREE.BufferGeometry(),new THREE.MeshStandardMaterial({color:0xfbfbf8,transparent:true,opacity:.9,roughness:.95,depthWrite:false}));foam.renderOrder=2;
    const rods=new THREE.Group();const rm=M(0x2b2b2b,{roughness:.6});
    this.rodC=new THREE.Mesh(new THREE.CylinderGeometry(.005,.005,.27,10),rm.clone());this.rodA=new THREE.Mesh(new THREE.CylinderGeometry(.005,.005,.27,10),rm.clone());
    rods.add(this.rodC,this.rodA);const bar=new THREE.Mesh(new THREE.BoxGeometry(.2,.012,.03),M(0xe0e0e0));rods.add(bar);this.rodBar=bar;
    const wireM=[M(0x222222),M(0xc62828)];this.wires=[0,1].map(i=>{const w=new THREE.Mesh(new THREE.BufferGeometry(),wireM[i]);this.sc.add(w);return w;});
    const stir=new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,.32,8),new THREE.MeshStandardMaterial({color:0xeef6fb,transparent:true,opacity:.55}));
    const tube=new THREE.Mesh(new THREE.CylinderGeometry(.005,.005,.34,8),new THREE.MeshStandardMaterial({color:0xeef6fb,transparent:true,opacity:.6}));
    this.fx={bub,pO,pG,pS,lumps,foam,rods,stir,tube,B:[],Pp:[],L:[],steam:[],m:new THREE.Matrix4(),q:new THREE.Quaternion(),s:new THREE.Vector3(),p:new THREE.Vector3()};
    const st=ctex(64,64,(c,w)=>{const g=c.createRadialGradient(w/2,w/2,2,w/2,w/2,w/2);g.addColorStop(0,"rgba(255,255,255,.9)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(0,0,w,w);});
    for(let i=0;i<26;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:st,transparent:true,opacity:0,depthWrite:false}));s.visible=false;this.sc.add(s);this.fx.steam.push({s,life:0});}
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:st,color:0xffd54a,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));sp.scale.setScalar(.12);this.sc.add(sp);this.fx.spark=sp;
  }
  // --- har kadr: idish ko'rinishini dvigatel holatiga moslash ---
  update(dt,v){
    this.time+=dt;const f=this.fx,P=this.prof;
    // suyuqlik
    const top=v.level>0?this.levelY(v.level):0;
    if(Math.abs(top-this.liqH)>.0008){this.liqH=top;this.liq.geometry.dispose();this.liq.geometry=top>.002?lathe(P,.0015,top):new THREE.BufferGeometry();
      this.men.visible=top>.004;const mr=rIn(P,top)-.0005;this.men.position.y=top;this.men.scale.set(mr,mr,mr);}
    const TB=TURB[v.turbF]||TURB.cryst;
    if(v.col){const c=new THREE.Color(v.col.c);if(v.turb>.02)c.lerp(new THREE.Color(v.turbCol),Math.min(.85,v.turb*.8*TB.cw));
      const h0={};c.getHSL(h0);if(h0.s>.35)c.setHSL(h0.h,Math.min(1,h0.s*1.1),h0.l*(.62+.3*(1-h0.s)));
      if(this.slowCol>0)this.slowCol-=dt;this.liqMat.color.lerp(c,Math.min(1,dt*(this.slowCol>0?.8:3)));
      const hsl={};this.liqMat.color.getHSL(hsl);const sat=Math.min(1,hsl.s*(1-Math.abs(hsl.l-.5)*1.4)*1.6);
      this.liqMat.emissive.copy(this.liqMat.color).multiplyScalar(.2*sat+.03);
      const op=Math.min(.95,Math.max(v.col.alpha<.33?.2:v.col.alpha,v.turb*TB.op));this.liqMat.opacity+=(op-this.liqMat.opacity)*Math.min(1,dt*3);}
    // cho'kma qatlamlari
    const key=v.layers.map(l=>l.id+":"+(l.amt*20|0)).join("|");
    let ly=.0015;
    if(key!==this.layerKey){this.layerKey=key;this.layerG.children.forEach(m=>m.geometry.dispose());this.layerG.clear();
      const k=this.type==="probirka"?.03:this.type==="kolba"?.014:.012;
      v.layers.forEach(l=>{const S=KL.SOLIDS[l.id],fm=S.form||"cryst",fk={gel:2.6,curd:1.5,flake:1.3,cryst:.75,glitter:.9,metal:.5}[fm]||.85,h=Math.min(.08,Math.max(.003,l.amt*k*fk));
        const mat=fm==="gel"?new THREE.MeshStandardMaterial({color:l.c,transparent:true,opacity:.74,roughness:.35,depthWrite:false}):fm==="glitter"?M(l.c,{roughness:.28,metalness:.6,emissive:new THREE.Color(l.c).multiplyScalar(.12)}):fm==="metal"?M(l.c,{roughness:.5,metalness:.7}):M(l.c,{roughness:fm==="curd"?1:.85});
        const m=new THREE.Mesh(lathe(P,ly,ly+h,32),mat);if(fm==="gel")m.renderOrder=1;this.layerG.add(m);ly+=h;});
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
    // ko'pik: shiddatli gaz ajralganda yuzada yig'iladi
    const fk=(v.gas.CO2||0)*1.7+(v.gas.O2||0)*1.5+(v.gas.H2||0)*.4;
    this.foam=Math.max(0,Math.min(1.3,(this.foam||0)+fk*dt*1.5-(this.foam||0)*dt/2.2));
    const fh=top>.003?Math.min(.08,this.foam*.055):0;
    if(Math.abs(fh-this.foamH)>.0015||Math.abs(top-(this.foamTop||0))>.002){this.foamH=fh;this.foamTop=top;f.foam.geometry.dispose();f.foam.geometry=fh>.002?lathe(P,top,Math.min(this.H+.02,top+fh),32):new THREE.BufferGeometry();}
    this.foamOver=fh>0&&top+fh>this.H-.004&&this.foam>.45;
    // rangli gazlar, bug'lar va hid
    const mouth=this.vg.position.clone().add(new THREE.Vector3(0,this.H+.01,0)),E=this.efx;
    if(this.vg.visible){
      if(v.gas.Cl2)E.fume(mouth,0xcbe25a,v.gas.Cl2*30*dt);
      if(v.gas.NO)E.fume(mouth,0xa5491c,v.gas.NO*45*dt);
      if(v.vap&&v.vap.br2)E.fume(mouth,0xd98a2a,3.5*dt);
      if(v.vap&&v.vap.i2)E.fume(mouth,0x8a4fd1,3.5*dt);
      if(v.smell&&v.smell.length&&top>0){this.smT=(this.smT||0)-dt;if(this.smT<=0){this.smT=.9;E.smell(mouth);}}}
    this.bubbles(dt,v,top,ly,rx);this.particles(dt,v,top,ly);this.steamFx(dt,v,top);E.update(dt);
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
      const bp=this.battery.position,a=new THREE.Vector3(VX+(i?rx:-rx),BASE[this.type]+.32,VZ),b=new THREE.Vector3(bp.x+(i?-.06:.04),BT+.15,bp.z);
      const mid=a.clone().lerp(b,.5).add(new THREE.Vector3(0,.12,.05));w.geometry.dispose();w.geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a,mid,b]),16,.004,6,false);});
  }
  bubbles(dt,v,top,ly,rx){
    const f=this.fx,B=f.B,P=this.prof;
    if(top>.003){
      let rate=0;for(const g in v.gas)rate+=v.gas[g];rate=Math.min(260,rate*110);
      const boil=v.boil?70:0,tube=v.gasIn?45:0,ec=v.elec?Math.min(60,v.elec.cat*1100):0,ea=v.elec?Math.min(60,v.elec.an*1100):0;
      const spawn=(n,fn)=>{let k=n*dt;while(k>0&&B.length<260){if(k<1&&Math.random()>k)break;k--;B.push(fn());}};
      const pc=Object.values(this.pieceMap);
      const big=rate>110;
      spawn(rate,()=>{let x,z;const fromPiece=pc.length&&Math.random()<.8;if(fromPiece){const o=pc[Math.random()*pc.length|0];x=o.position.x+rr(-.01,.01);z=o.position.z+rr(-.01,.01);}else{const r=rIn(P,ly+.01)*.75*Math.sqrt(Math.random()),a=Math.random()*7;x=Math.cos(a)*r;z=Math.sin(a)*r;}
        return{x,y:ly+.006,z,r:big?rr(.0028,.0072):rr(.0015,.0042),v:big?rr(.1,.2):rr(.06,.13),w:Math.random()*7};});
      spawn(boil,()=>{const r=rIn(P,ly+.01)*.7*Math.sqrt(Math.random()),a=Math.random()*7;return{x:Math.cos(a)*r,y:ly+.004,z:Math.sin(a)*r,r:rr(.003,.007),v:rr(.1,.2),w:Math.random()*7};});
      spawn(tube,()=>({x:rx*.6+rr(-.004,.004),y:.01,z:rr(-.004,.004),r:rr(.002,.004),v:rr(.08,.12),w:0}));
      spawn(ec,()=>({x:-rx+rr(-.004,.004),y:rr(.06,top*.9),z:rr(-.004,.004),r:rr(.0012,.0025),v:rr(.05,.09),w:0}));
      spawn(ea,()=>({x:rx+rr(-.004,.004),y:rr(.06,top*.9),z:rr(-.004,.004),r:rr(.0012,.003),v:rr(.05,.09),w:0}));
    }
    let popped=0;
    for(let i=B.length-1;i>=0;i--){const b=B[i];b.y+=b.v*dt;b.x+=Math.sin(this.time*8+b.w)*.004*dt;if(b.y>=top-.002){B.splice(i,1);popped++;}}
    if(popped&&Math.random()<.5)KL.sfx.bubble();
    const m=f.m,q=f.q,s=f.s,p=f.p;
    for(let i=0;i<260;i++){if(i<B.length){const b=B[i];p.set(b.x,b.y,b.z);s.setScalar(b.r);m.compose(p,q,s);}else m.makeScale(0,0,0);f.bub.setMatrixAt(i,m);}
    f.bub.instanceMatrix.needsUpdate=true;
  }
  particles(dt,v,top,ly){
    const f=this.fx,P=this.prof;
    if(this.pptQ&&this.pptQ.length&&top>.003){this.pptQ.forEach(([id,n])=>{const S=KL.SOLIDS[id];if(!S)return;const F=FORMS[S.form||"cryst"];if(!F)return;
      const c=new THREE.Color(S.c);let k=Math.min(F.cap,Math.ceil(n*F.n));
      const C=CLOUD[S.form||"cryst"];if(C&&this.vg.visible){const cn=Math.min(C[0]*1.6,Math.ceil(C[0]*Math.min(1.5,n*1.4))),o=this.vg.position;
        for(let j=0;j<cn;j++){const y=rr(ly+.01,top-.006),r=rIn(P,y)*.62*Math.sqrt(Math.random()),a=Math.random()*7;
          this.efx.spawn({col:S.c,pos:new THREE.Vector3(o.x+Math.cos(a)*r,o.y+y,o.z+Math.sin(a)*r),vel:new THREE.Vector3(rr(-.004,.004),-rr(.004,.016),rr(-.004,.004)),life:rr(C[2]*.6,C[2]),size:rr(.035,.065)*(this.type==="probirka"?.55:1),grow:.012,op:C[1],ro:2,fin:.3});}}
      const sc=this.type==="probirka"?.6:1;
      while(k-->0&&f.Pp.length<400){const y=rr(ly+.01,top),r=rIn(P,y)*.8*Math.sqrt(Math.random()),a=Math.random()*7;
        const irr=F.m==="gel"||F.clump;
        const q={x:Math.cos(a)*r,y,z:Math.sin(a)*r,v:rr(F.v[0],F.v[1]),s:rr(F.s[0],F.s[1])*sc,c,m:F.m,id,cl:F.clump,w:Math.random()*7,kx:irr?rr(.75,1.6):1,ky:irr?rr(.45,1):1,kz:irr?rr(.75,1.5):1};f.Pp.push(q);
        if(F.clump){for(let j=0;j<3&&k>0;j++,k--)f.Pp.push(Object.assign({},q,{x:q.x+rr(-.005,.005),y:q.y+rr(-.004,.004),z:q.z+rr(-.005,.005),s:q.s*rr(.5,1),kx:rr(.7,1.5),ky:rr(.5,1),kz:rr(.7,1.4)}));}}});}
    this.pptQ=[];
    for(let i=f.Pp.length-1;i>=0;i--){const q=f.Pp[i];q.y-=q.v*dt;
      if(q.m==="gel"){q.x+=Math.sin(this.time*1.5+q.w)*.004*dt;q.z+=Math.cos(this.time*1.3+q.w)*.004*dt;}
      if(q.y<=ly+.002){if(q.cl&&f.L.length<140)f.L.push({x:q.x,z:q.z,s:q.s*1.35,c:q.c,id:q.id,w:q.w,kx:q.kx,ky:q.ky*.8,kz:q.kz});f.Pp.splice(i,1);}}
    if(f.L.length){const have=new Set(v.layers.map(l=>l.id));f.L=f.L.filter(l=>have.has(l.id));}
    const m=f.m,s=f.s,p=f.p,q=f.q,e=new THREE.Euler();
    const fill=(mesh,list,cap,rot)=>{let n=0;for(const a of list){if(n>=cap)break;p.set(a.x,a.y,a.z);s.set(a.s*(a.kx||1),a.s*(a.ky||1),a.s*(a.kz||1));if(rot){e.set(this.time*2.5+a.w,a.w,this.time+a.w);q.setFromEuler(e);}else q.identity();
        m.compose(p,q,s);mesh.setMatrixAt(n,m);mesh.setColorAt(n,a.c);n++;}
      for(let i=n;i<cap;i++){m.makeScale(0,0,0);mesh.setMatrixAt(i,m);}mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;};
    fill(f.pO,f.Pp.filter(a=>a.m==="o"),240,false);fill(f.pG,f.Pp.filter(a=>a.m==="gel"),100,false);fill(f.pS,f.Pp.filter(a=>a.m==="gl"),90,true);
    fill(f.lumps,f.L.map(l=>({x:l.x,y:ly+l.s*.3,z:l.z,s:l.s,c:l.c,w:l.w,kx:l.kx,ky:l.ky,kz:l.kz})),140,false);
    q.identity();f.pS.material.emissiveIntensity=.55+Math.sin(this.time*9)*.45;
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
    let t=0,phase=0,poured=false;const q=this.queue.length?.6:1,D=[.5,.22,.45,.2,.5].map(x=>x*q);
    const mouth=new THREE.Vector3();
    this.tweens.push(dt=>{
      t+=dt;if(t>D[phase]){t-=D[phase];phase++;}
      const hh=this.player.userData.h;
      if(phase>=5){b.position.copy(from);b.rotation.set(0,0,0);this.stream(false);hh.reach=0;this.nextPour();return false;}
      const k=ease(Math.min(1,t/D[phase]));hh.reach=phase===0?k*.8:phase<3?.8+.2*Math.min(1,phase+k-1):phase===3?1-k*.4:.6*(1-k);
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
  /* ---------- harakat: o'quvchi (3-shaxs), yo'l topish, o'qituvchi ---------- */
  ok(x,z){return x>-7.6&&x<7&&z>-5.6&&z<5.6&&!this.colliders.some(w=>x>w[0]-.22&&x<w[1]+.22&&z>w[2]-.22&&z<w[3]+.22);}
  navBuild(){const C=.25,X0=-8,Z0=-6,NX=64,NZ=48,b=new Uint8Array(NX*NZ);
    for(let j=0;j<NZ;j++)for(let i=0;i<NX;i++)b[j*NX+i]=this.ok(X0+(i+.5)*C,Z0+(j+.5)*C)?0:1;this.nav={C,X0,Z0,NX,NZ,b};}
  los(x0,z0,x1,z1){const d=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.ceil(d/.1));for(let i=1;i<=n;i++){const t=i/n;if(!this.ok(x0+(x1-x0)*t,z0+(z1-z0)*t))return false;}return true;}
  // A* qidiruvi (0,25 m katakli to'r) + ko'rinish chizig'i bo'yicha to'g'rilash
  findPath(x0,z0,x1,z1){
    if(this.ok(x1,z1)&&this.los(x0,z0,x1,z1))return[{x:x1,z:z1}];
    const n=this.nav,NX=n.NX,NZ=n.NZ,idx=(i,j)=>j*NX+i,free=(i,j)=>i>=0&&j>=0&&i<NX&&j<NZ&&!n.b[idx(i,j)];
    const cell=(x,z)=>[Math.floor((x-n.X0)/n.C),Math.floor((z-n.Z0)/n.C)];
    const near=([i,j])=>{if(free(i,j))return[i,j];for(let r=1;r<8;r++)for(let a=-r;a<=r;a++)for(const[b,c]of[[a,-r],[a,r],[-r,a],[r,a]])if(free(i+b,j+c))return[i+b,j+c];return null;};
    const S=near(cell(x0,z0)),T=near(cell(x1,z1));if(!S||!T)return null;
    const N=NX*NZ,g=new Float32Array(N).fill(1e9),from=new Int32Array(N).fill(-1),closed=new Uint8Array(N),H=[];
    const push=(k,f)=>{H.push([f,k]);let i=H.length-1;while(i>0){const q=(i-1)>>1;if(H[q][0]<=H[i][0])break;[H[q],H[i]]=[H[i],H[q]];i=q;}};
    const pop=()=>{const t=H[0],l=H.pop();if(H.length){H[0]=l;let i=0;for(;;){const a=2*i+1,b=a+1;let m=i;if(a<H.length&&H[a][0]<H[m][0])m=a;if(b<H.length&&H[b][0]<H[m][0])m=b;if(m===i)break;[H[m],H[i]]=[H[i],H[m]];i=m;}}return t;};
    const s0=idx(S[0],S[1]),t0=idx(T[0],T[1]);g[s0]=0;push(s0,0);
    while(H.length){const k=pop()[1];if(closed[k])continue;closed[k]=1;if(k===t0)break;const i=k%NX,j=(k/NX)|0;
      for(let di=-1;di<=1;di++)for(let dj=-1;dj<=1;dj++){if(!di&&!dj)continue;const a=i+di,b=j+dj;if(!free(a,b))continue;if(di&&dj&&(!free(i+di,j)||!free(i,j+dj)))continue;
        const kk=idx(a,b),ng=g[k]+(di&&dj?1.414:1);if(ng<g[kk]){g[kk]=ng;from[kk]=k;push(kk,ng+Math.hypot(a-T[0],b-T[1]));}}}
    if(t0!==s0&&from[t0]<0)return null;
    const pts=[];for(let k=t0;k!==-1&&k!==s0;k=from[k])pts.push({x:n.X0+((k%NX)+.5)*n.C,z:n.Z0+(((k/NX)|0)+.5)*n.C});
    pts.reverse();if(this.ok(x1,z1))pts.push({x:x1,z:z1});if(!pts.length)return null;
    const out=[];let cx=x0,cz=z0,i=0;
    while(i<pts.length){let j=pts.length-1;while(j>i&&!this.los(cx,cz,pts[j].x,pts[j].z))j--;out.push(pts[j]);cx=pts[j].x;cz=pts[j].z;i=j+1;}
    return out;
  }
  benchSpot(){return{x:VX-.42,z:VZ+.86,rot:Math.PI};}
  nearBench(){const b=this.benchSpot();return Math.hypot(this.pl.x-b.x,this.pl.z-b.z)<1.05;}
  hangerSpot(){return{x:-6.4,z:4.05};}
  nearHanger(){const h=this.hangerSpot();return Math.hypot(this.pl.x-h.x,this.pl.z-h.z)<1.3;}
  walkTo(x,z,cb){const p=this.findPath(this.pl.x,this.pl.z,x,z);if(!p){this.pl.x=x;this.pl.z=z;cb&&cb();return false;}
    this.pl.path=p;this.pl.cb=cb||null;if(this.mode!=="follow"){this.toFollow();}return true;}
  toFollow(){if(this.mode==="follow")return;this.camO.yaw=Math.atan2(this.cam.position.x-this.pl.x,this.cam.position.z-this.pl.z);this.camO.pitch=Math.max(.18,Math.min(.8,this.camO.pitch));this.mode="follow";this.player.visible=true;this.rackMode=false;}
  goBench(cb){const b=this.benchSpot();
    const arrive=()=>{this.pl.x=b.x;this.pl.z=b.z;this.pl.rot=b.rot;this.pl.path=null;if(this.mode!=="orbit"){this.mode="bench";this.player.visible=true;}this.cb.onMode&&this.cb.onMode();cb&&cb();};
    if(Math.hypot(this.pl.x-b.x,this.pl.z-b.z)<.3){arrive();return;}
    if(this.mode==="orbit")this.toFollow();
    if(!this.walkTo(b.x,b.z,arrive))arrive();this.cb.onMode&&this.cb.onMode();}
  goHanger(cb){const h=this.hangerSpot();
    const arrive=()=>{this.pl.rot=Math.atan2(-7.25-this.pl.x,4.75-this.pl.z);this.camO.yaw=this.pl.rot+Math.PI;cb&&cb();};
    if(this.nearHanger()&&this.mode!=="orbit"){this.toFollow();arrive();return;}
    this.toFollow();this.walkTo(h.x,h.z,arrive);}
  focus(on){
    if(on){if(this.mode==="orbit")return;this.mode="orbit";this.player.visible=false;const tall=this.w/this.h<.8;this.orb.yaw=0;this.orb.pitch=.3;this.orb.dist=(this.type==="probirka"?.62:.82)*(tall?1.25:1);}
    else{if(this.mode!=="orbit")return;this.rackMode=false;this.player.visible=true;if(this.nearBench()){const b=this.benchSpot();this.pl.x=b.x;this.pl.z=b.z;this.pl.rot=b.rot;this.mode="bench";}else this.toFollow();}
  }
  showRack(){if(this.mode!=="orbit"){this.mode="orbit";this.player.visible=false;}this.rackMode=true;this.orb.yaw=0;this.orb.pitch=.42;this.orb.dist=this.w/this.h<.8?1.75:1.35;}
  unRack(){if(this.rackMode)this.focus(false);}
  // idishga yaqindan qarash (javon ko'rinishidan ham)
  focusVessel(){if(this.mode==="orbit"&&!this.rackMode)return;if(this.rackMode){this.rackMode=false;this.mode="bench";}this.focus(true);}
  move(dt,jv){
    const k=this.keys,pl=this.pl;let ix=jv?jv.x:0,iy=jv?jv.y:0;
    if(k.w||k.arrowup||k["ц"])iy-=1;if(k.s||k.arrowdown||k["ы"])iy+=1;if(k.a||k.arrowleft||k["ф"])ix-=1;if(k.d||k.arrowright||k["в"])ix+=1;
    const mag=Math.min(1,Math.hypot(ix,iy));let mx=0,mz=0,spd=0;
    if(mag>.08){
      if(this.mode!=="follow"){this.toFollow();this.cb.onMode&&this.cb.onMode();}
      pl.path=null;pl.cb=null;
      // kameraga nisbatan yo'nalish: joystik yuqoriga — kamera qaragan tomonga
      const y=this.camO.yaw,fx=-Math.sin(y),fz=-Math.cos(y);
      mx=fx*(-iy)-fz*ix;mz=fz*(-iy)+fx*ix;const L=Math.hypot(mx,mz)||1;mx/=L;mz/=L;
      spd=(k.shift||mag>.93?3.3:1.7)*Math.max(.4,mag);
    }else if(pl.path&&pl.path.length){
      const w=pl.path[0],dx=w.x-pl.x,dz=w.z-pl.z,d=Math.hypot(dx,dz);
      if(d<.1){pl.path.shift();if(!pl.path.length){pl.path=null;const cb=pl.cb;pl.cb=null;cb&&cb();}}
      else{mx=dx/d;mz=dz/d;spd=Math.min(3,d*4+.8);}
    }
    if(spd>0){const nx=pl.x+mx*spd*dt,nz=pl.z+mz*spd*dt;let moved=false;
      if(this.ok(nx,pl.z)){pl.x=nx;moved=true;}if(this.ok(pl.x,nz)){pl.z=nz;moved=true;}
      if(!moved&&pl.path){pl.path=null;pl.cb=null;}
      pl.rot=lerpA(pl.rot,Math.atan2(mx,mz),Math.min(1,dt*10));}
    pl.spd+=(spd-pl.spd)*Math.min(1,dt*9);
    // kamera asta-sekin o'quvchining orqasiga o'tadi (GTA uslubi)
    if(this.mode==="follow"&&pl.spd>.4&&this.time-this.camO.drag>1.3)this.camO.yaw=lerpA(this.camO.yaw,pl.rot+Math.PI,Math.min(1,dt*(pl.path?2.2:1.5)));
    this.player.position.set(pl.x,0,pl.z);this.player.rotation.y=pl.rot;KL.animHuman(this.player,dt,pl.spd);
    this.tchUpdate(dt);
  }
  tchUpdate(dt){const t=this.tch;let spd=0;
    if(t.path&&t.path.length){const w=t.path[0],dx=w.x-t.x,dz=w.z-t.z,d=Math.hypot(dx,dz);
      if(d<.1){t.path.shift();if(!t.path.length){t.path=null;const cb=t.cb;t.cb=null;cb&&cb();}}
      else{const v=t.fast?3.2:1.5;t.x+=dx/d*Math.min(d,v*dt);t.z+=dz/d*Math.min(d,v*dt);t.rot=lerpA(t.rot,Math.atan2(dx,dz),Math.min(1,dt*10));spd=v;}}
    else t.rot=lerpA(t.rot,Math.atan2(this.pl.x-t.x,this.pl.z-t.z),Math.min(1,dt*2));
    t.spd+=(spd-t.spd)*Math.min(1,dt*8);
    this.teacher.position.set(t.x,0,t.z);this.teacher.rotation.y=t.rot;KL.animHuman(this.teacher,dt,t.spd);}
  teacherTo(x,z,fast,cb){const p=this.findPath(this.tch.x,this.tch.z,x,z);this.tch.fast=fast;if(p){this.tch.path=p;this.tch.cb=cb||null;}else{this.tch.x=x;this.tch.z=z;cb&&cb();}}
  teacherHelp(){const b=this.benchSpot();this.teacherTo(b.x-.85,b.z+.3,true);}
  teacherHome(){this.teacherTo(-2.4,-4.95,false);}
  /* ---------- favqulodda holat effektlari ---------- */
  mouthPos(){return this.vg.position.clone().add(new THREE.Vector3(0,this.H+.01,0));}
  effect(kind,o){o=o||{};const E=this.efx,m=this.mouthPos(),c=this.vg.position.clone().add(new THREE.Vector3(0,this.H*.5,0)),r=rIn(this.prof,this.H*.5)+.04;
    if(kind==="explode"){E.explode(c,o.power||1);this.vg.visible=false;}
    if(kind==="fire")E.startFire(m,Math.max(.03,rIn(this.prof,this.H)*.9),o);
    if(kind==="splash"){const to=new THREE.Vector3(this.pl.x-m.x,0,this.pl.z-m.z).normalize();E.splash(m,o.col||0xdcecf6,o.n||34,to);}
    if(kind==="steam")E.steam(m,16);
    if(kind==="crack"){E.crack(this.glassMat);E.splash(this.vg.position.clone().add(new THREE.Vector3(0,.03,0)),o.col||0xdcecf6,22,null);}
    if(kind==="gas")E.gasRoom(o.col||0xc8d86a,true);
    if(kind==="gasClear")E.gasRoom(0,false);
    if(kind==="blanket"){E.blanket(this.vg.position.clone().add(new THREE.Vector3(0,this.H,0)),r);E.stopFire();}
    if(kind==="sand"){E.sand(this.vg.position.clone().add(new THREE.Vector3(0,this.H,0)),r);setTimeout(()=>E.stopFire(),900);}
    if(kind==="spray"){E.sprayAt(new THREE.Vector3(this.tch.x,1.1,this.tch.z),m,1.6);setTimeout(()=>E.stopFire(),1100);}
    if(kind==="water"){E.splash(m,0xbfe3ff,22,null);E.steam(m,16);E.flare();}
    if(kind==="flare")E.flare();
    if(kind==="flinch")this.player.userData.h.flinch=1;
  }
  resetFx(){this.efx.clear();this.vg.visible=true;}
  // rangli eritma qo'shilganda — rang bulut bo'lib pastga tarqaladi, keyin aralashadi
  plume(col){if(!this.vg.visible)return;const y=Math.max(.014,this.liqH||0),p=this.vg.position.clone().add(new THREE.Vector3(0,y-.006,0));
    this.efx.plume(p,new THREE.Color(col).getHex(),rIn(this.prof,y)*.7);this.slowCol=2.2;}
  input(){
    const cv=this.canvas,keys=this.keys={};
    addEventListener("keydown",e=>{if(!this.active||/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||""))return;keys[e.key.toLowerCase()]=1;if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase()))e.preventDefault();});
    addEventListener("keyup",e=>{delete keys[e.key.toLowerCase()];});
    addEventListener("blur",()=>{for(const k in keys)delete keys[k];});
    const pts=new Map();let down=null,pinch=null,hoverT=0;
    cv.addEventListener("pointerdown",e=>{try{cv.setPointerCapture(e.pointerId);}catch(x){}pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(pts.size===2){const[a,b]=[...pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);pinch={d,dist:this.mode==="orbit"?this.orb.dist:this.camO.dist};down=null;}
      else down={x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY,t:performance.now(),moved:0};});
    cv.addEventListener("pointermove",e=>{
      if(pts.has(e.pointerId))pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(pinch&&pts.size===2){const[a,b]=[...pts.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(this.mode==="orbit")this.orb.dist=Math.max(.3,Math.min(2.4,pinch.dist*pinch.d/d));else{this.toFollow();this.camO.dist=Math.max(1.3,Math.min(5.5,pinch.dist*pinch.d/d));}return;}
      if(down){const dx=e.clientX-down.lx,dy=e.clientY-down.ly;down.moved+=Math.abs(dx)+Math.abs(dy);down.lx=e.clientX;down.ly=e.clientY;
        if(down.moved<6)return;
        if(this.mode==="orbit"){this.orb.yaw-=dx*.008;this.orb.pitch=Math.max(-.2,Math.min(1.3,this.orb.pitch+dy*.006));}
        else{if(this.mode==="bench"){this.toFollow();this.cb.onMode&&this.cb.onMode();}this.camO.yaw-=dx*.0065;this.camO.pitch=Math.max(-.12,Math.min(1.15,this.camO.pitch+dy*.0045));this.camO.drag=this.time;}
        cv.style.cursor="grabbing";return;}
      if(e.pointerType==="mouse"){const n=performance.now();if(n-hoverT>70){hoverT=n;this.hover(e);}}
    });
    const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=null;cv.style.cursor="";const d=down;down=null;if(d&&d.moved<8&&performance.now()-d.t<450)this.tap(e);};
    cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",e=>{pts.delete(e.pointerId);down=null;pinch=null;});
    cv.addEventListener("pointerleave",()=>this.cb.onHover(null));
    cv.addEventListener("wheel",e=>{e.preventDefault();if(this.mode==="orbit")this.orb.dist=Math.max(.3,Math.min(2.4,this.orb.dist*(1+e.deltaY*.0012)));else{this.toFollow();this.camO.dist=Math.max(1.3,Math.min(5.5,this.camO.dist*(1+e.deltaY*.001)));}},{passive:false});
    this.ray=new THREE.Raycaster();
  }
  rayAt(e){const b=this.canvas.getBoundingClientRect();this.ray.setFromCamera(new THREE.Vector2((e.clientX-b.left)/b.width*2-1,-((e.clientY-b.top)/b.height*2-1)),this.cam);
    const vis=o=>{while(o){if(!o.visible)return false;o=o.parent;}return true;};
    const h=this.ray.intersectObjects(this.inter,true).find(x=>x.distance<12&&vis(x.object));
    if(!h)return null;let o=h.object;while(!o.userData.pick)o=o.parent;return{pick:o.userData.pick,obj:o,dist:h.distance};}
  tap(e){
    const h=this.rayAt(e);if(h){this.cb.onPick(h.pick,h);return;}
    if(this.mode==="orbit")return;
    // polga bosilsa — o'sha joyga yuradi; stol yoniga bosilsa — stolga
    const r=this.ray.ray;if(r.direction.y>-.02)return;const t=-r.origin.y/r.direction.y,x=r.origin.x+r.direction.x*t,z=r.origin.z+r.direction.z*t;
    if(Math.abs(x)<2.6&&z<-1.3&&z>-3.7){this.goBench();return;}
    if(!this.ok(x,z))return;
    if(this.walkTo(x,z,null)){this.efx.spawn({map:this.efx.T.ring,col:0x4fd1c5,pos:new THREE.Vector3(x,.03,z),size:.12,grow:.8,life:.55,op:.9,fin:.05});this.cb.onMode&&this.cb.onMode();}
  }
  hover(e){
    const h=this.rayAt(e);const id=h&&h.pick.type==="bottle"?h.pick.id:null;
    if(this.hl&&this.hl!==id){const b=this.bottles[this.hl];if(b&&b.userData.body&&b.userData.body.material.emissive)b.userData.body.material.emissive.setHex(0);this.hl=null;}
    if(id&&this.hl!==id){const b=this.bottles[id];if(b.userData.body.material.emissive)b.userData.body.material.emissive.setHex(0x334455);this.hl=id;}
    this.canvas.style.cursor=h?"pointer":"";this.cb.onHover(h?h.pick:null,e.clientX,e.clientY);
  }
  resize(){const w=this.host.clientWidth,h=this.host.clientHeight;if(!w||!h)return;this.r.setSize(w,h,false);const asp=w/h;this.cam.aspect=asp;
    // tik ekranda gorizontal ko'rish burchagi juda tor bo'lmasligi uchun
    this.cam.fov=asp>=1?60:Math.min(84,Math.max(60,2*Math.atan(Math.tan(27*Math.PI/180)/asp)*180/Math.PI));
    this.cam.updateProjectionMatrix();this.w=w;this.h=h;}
  setSheet(px,right){this.sheet=px||0;this.sideOff=right||0;}
  render(dt){
    const cam=this.cam,pl=this.pl;let pos,look;
    if(this.mode==="orbit"){const o=this.orb,t=this.target;pos=new THREE.Vector3(t.x+Math.sin(o.yaw)*Math.cos(o.pitch)*o.dist,t.y+Math.sin(o.pitch)*o.dist,t.z+Math.cos(o.yaw)*Math.cos(o.pitch)*o.dist);look=t.clone();}
    // stol oldida: yelka ortidan yaqin kadr — idish markazda va yirik, o'quvchining boshi va qo'li chap chetda
    else if(this.mode==="bench"){const tall=this.w/this.h<.8,fx=Math.sin(pl.rot),fz=Math.cos(pl.rot),sd=tall?.46:.64,bk=tall?.92:.8;
      pos=new THREE.Vector3(pl.x-fz*sd-fx*bk,tall?2.08:2,pl.z+fx*sd-fz*bk);look=new THREE.Vector3(VX+.02,BASE[this.type]+this.H*.42,VZ-.12);}
    else{const o=this.camO,t=new THREE.Vector3(pl.x,1.45,pl.z);
      pos=new THREE.Vector3(t.x+Math.sin(o.yaw)*Math.cos(o.pitch)*o.dist,t.y+Math.sin(o.pitch)*o.dist,t.z+Math.cos(o.yaw)*Math.cos(o.pitch)*o.dist);
      pos.x=Math.max(-7.75,Math.min(7.75,pos.x));pos.z=Math.max(-5.75,Math.min(5.75,pos.z));pos.y=Math.max(.45,Math.min(3.4,pos.y));look=t;}
    const k=this.camSnap?1:1-Math.exp(-dt*(this.mode==="orbit"?10:7));this.camSnap=false;
    this.cpos.lerp(pos,k);this.clook.lerp(look,k);cam.position.copy(this.cpos);
    const sh=this.efx.shake;if(sh)cam.position.add(new THREE.Vector3((Math.random()-.5)*sh*.14,(Math.random()-.5)*sh*.14,(Math.random()-.5)*sh*.14));
    cam.lookAt(this.clook);
    // panel ochiq bo'lsa, idish panel ortida qolmasligi uchun tasvirni bo'sh tomonga suramiz
    if(this.mode==="orbit"&&(this.sheet>0||this.sideOff>0))cam.setViewOffset(this.w,this.h,this.sideOff*.5,this.sheet*.42,this.w,this.h);else cam.clearViewOffset();
    if(!this.ct||this.time-this.ct>1){this.ct=this.time;redraw(this.clockT,(c,w,h)=>this.drawClock(c,w,h));}
    this.ft=(this.ft||0)+dt;this.fn=(this.fn||0)+1;
    if(this.fn>=90){const avg=this.ft/this.fn;this.ft=0;this.fn=0;if(avg>1/26&&this.dpr>1){this.dpr=Math.max(1,this.dpr-.25);this.r.setPixelRatio(this.dpr);this.resize();}}
    this.r.render(this.sc,cam);
  }
}
KL.Lab3D=Lab3D;
})(globalThis.KL=globalThis.KL||{});
