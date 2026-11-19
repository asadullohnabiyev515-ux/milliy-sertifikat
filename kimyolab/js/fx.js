// KimyoLab — vizual effektlar: alanga, tutun, portlash, sachrash, bug'lar, hid, rang shleyfi, namat, qum, o't o'chirgich, zaharli gaz
(function(KL){
"use strict";
const rr=(a,b)=>a+Math.random()*(b-a);
function tex(w,h,draw){const c=document.createElement("canvas");c.width=w;c.height=h;draw(c.getContext("2d"),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;}
class FX{
  constructor(lab){
    this.lab=lab;this.sc=lab.sc;this.t=0;this.shake=0;this.flashK=0;this.fire=null;this.spray=null;this.fogTo=null;
    const T=this.T={};
    T.soft=tex(64,64,(c,w)=>{const g=c.createRadialGradient(w/2,w/2,1,w/2,w/2,w/2);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(.45,"rgba(255,255,255,.55)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(0,0,w,w);});
    T.puff=tex(96,96,(c,w)=>{for(let i=0;i<14;i++){const x=rr(26,70),y=rr(26,70),r=rr(12,26),g=c.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,"rgba(255,255,255,.35)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();}});
    T.flame=tex(64,128,(c,w,h)=>{const g=c.createRadialGradient(w/2,h*.74,2,w/2,h*.62,h*.56);g.addColorStop(0,"rgba(255,255,235,1)");g.addColorStop(.22,"rgba(255,220,100,.95)");g.addColorStop(.6,"rgba(255,120,25,.6)");g.addColorStop(1,"rgba(255,60,0,0)");
      c.fillStyle=g;c.beginPath();c.moveTo(w/2,3);c.quadraticCurveTo(w*.98,h*.62,w/2,h-3);c.quadraticCurveTo(w*.02,h*.62,w/2,3);c.fill();});
    T.wave=tex(64,64,(c)=>{c.strokeStyle="rgba(235,245,235,.95)";c.lineWidth=3.2;c.lineCap="round";for(let i=0;i<3;i++){c.beginPath();for(let y=58;y>6;y-=2){const x=14+i*18+Math.sin(y*.23+i*1.7)*4.5;if(y===58)c.moveTo(x,y);else c.lineTo(x,y);}c.stroke();}});
    T.nose=tex(64,64,(c,w)=>{c.font="42px serif";c.textAlign="center";c.textBaseline="middle";c.fillText("👃",w/2,w/2+3);});
    T.ring=tex(64,64,(c,w)=>{const g=c.createRadialGradient(w/2,w/2,w*.3,w/2,w/2,w/2);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(.62,"rgba(255,240,200,.85)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(0,0,w,w);});
    T.crack=tex(256,256,(c,w)=>{c.strokeStyle="rgba(255,255,255,.95)";c.lineWidth=2.2;for(let k=0;k<8;k++){let x=w/2+rr(-25,25),y=w/2+rr(-25,25);c.beginPath();c.moveTo(x,y);for(let s=0;s<10;s++){x+=rr(-32,32);y+=rr(-32,32);c.lineTo(x,y);}c.stroke();}});
    this.P=[];for(let i=0;i<260;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:T.soft,transparent:true,depthWrite:false}));s.visible=false;s.renderOrder=6;this.sc.add(s);this.P.push({s,life:0});}
    this.dropGeo=new THREE.SphereGeometry(1,8,6);this.drops=[];this.shards=[];this.puddles=[];this.extra=[];
    this.fireL=new THREE.PointLight(0xff7a22,0,4.5,2);this.sc.add(this.fireL);
    this.flashL=new THREE.PointLight(0xfff1c0,0,10,2);this.sc.add(this.flashL);
  }
  // umumiy zarracha: pos, vel, life, size, grow, op, col, add (additiv), map, g (gravitatsiya), up, drag, spin, ro (renderOrder)
  spawn(o){
    const p=this.P.find(x=>x.life<=0);if(!p)return null;
    const m=p.s.material;m.map=o.map||this.T.soft;m.color.set(o.col||0xffffff);m.blending=o.add?THREE.AdditiveBlending:THREE.NormalBlending;m.rotation=Math.random()*6.28;m.opacity=0;m.needsUpdate=true;
    p.s.position.copy(o.pos);p.s.scale.setScalar(o.size||.05);p.s.visible=true;p.s.renderOrder=o.ro||6;
    Object.assign(p,{life:o.life||1,max:o.life||1,v:(o.vel||new THREE.Vector3()).clone(),grow:o.grow||0,op:o.op===undefined?.8:o.op,g:o.g||0,up:o.up||0,drag:o.drag||0,spin:o.spin||0,fin:o.fin===undefined?.15:o.fin});
    return p;
  }
  update(dt){
    this.t+=dt;
    for(const p of this.P){if(p.life<=0)continue;p.life-=dt;if(p.life<=0){p.s.visible=false;continue;}
      p.v.y+=(p.up-p.g)*dt;if(p.drag)p.v.multiplyScalar(Math.max(0,1-p.drag*dt));p.s.position.addScaledVector(p.v,dt);
      const sc=p.s.scale.x+p.grow*dt;p.s.scale.setScalar(Math.max(.001,sc));p.s.material.rotation+=p.spin*dt;
      const k=p.life/p.max,a=Math.min(1,(1-k)/Math.max(.01,p.fin));p.s.material.opacity=p.op*Math.min(a,Math.min(1,k*1.6));}
    // doimiy alanga
    const f=this.fire;
    if(f){f.k=Math.min(f.max,f.k+dt*(f.grow||0));const n=(30+40*f.k)*dt;let c=n;
      while(c>0){if(c<1&&Math.random()>c)break;c--;
        this.spawn({map:this.T.flame,add:1,col:Math.random()<.5?0xffd25a:0xff8a2a,pos:f.pos.clone().add(new THREE.Vector3(rr(-f.r,f.r)*f.k,rr(0,.02),rr(-f.r,f.r)*f.k)),
          vel:new THREE.Vector3(rr(-.05,.05),rr(.35,.65)*Math.min(1.6,.7+f.k*.4),rr(-.05,.05)),life:rr(.32,.6),size:rr(.06,.11)*(.6+f.k*.55),grow:.05,op:.95,fin:.08});}
      if(Math.random()<dt*(5+6*f.k))this.spawn({map:this.T.puff,col:0x3b3b3b,pos:f.pos.clone().add(new THREE.Vector3(rr(-.03,.03),.18*f.k+.1,rr(-.03,.03))),vel:new THREE.Vector3(rr(-.05,.05),rr(.25,.4),rr(-.05,.05)),life:rr(2,3),size:.1,grow:.32,op:.45});
      this.fireL.position.copy(f.pos).add(new THREE.Vector3(0,.2,0));this.fireL.intensity=(1.2+f.k*1.4)*(.82+Math.random()*.36);}
    else if(this.fireL.intensity>0)this.fireL.intensity=Math.max(0,this.fireL.intensity-dt*4);
    // portlash chaqnashi
    if(this.flashK>0){this.flashK*=Math.exp(-dt*7);this.flashL.intensity=14*this.flashK;if(this.flashK<.01){this.flashK=0;this.flashL.intensity=0;}}
    this.shake*=Math.exp(-dt*4);if(this.shake<.005)this.shake=0;
    // tomchilar va shisha bo'laklari
    for(let i=this.drops.length-1;i>=0;i--){const d=this.drops[i];d.v.y-=9.8*dt;d.m.position.addScaledVector(d.v,dt);
      const sy=this.surfY(d.m.position);if(d.m.position.y<=sy){this.puddle(d.m.position.x,sy,d.m.position.z,d.col,d.m.scale.x*4.2);this.sc.remove(d.m);this.drops.splice(i,1);}}
    for(const s of this.shards){if(s.rest)continue;s.v.y-=9.8*dt;s.m.position.addScaledVector(s.v,dt);s.m.rotation.x+=s.w*dt;s.m.rotation.y+=s.w*.7*dt;
      const sy=this.surfY(s.m.position)+.004;if(s.m.position.y<=sy){s.m.position.y=sy;s.v.multiplyScalar(.35);s.v.y=-s.v.y*.3;if(Math.abs(s.v.y)<.3){s.rest=1;}}}
    for(let i=this.puddles.length-1;i>=0;i--){const p=this.puddles[i];p.t+=dt;if(p.m.scale.x<p.r)p.m.scale.setScalar(Math.min(p.r,p.m.scale.x+dt*.12));if(p.t>14){p.m.material.opacity-=dt*.3;if(p.m.material.opacity<=0){this.sc.remove(p.m);this.puddles.splice(i,1);}}}
    // o't o'chirgich purkashi
    if(this.spray){const s=this.spray;s.t-=dt;const dir=s.to.clone().sub(s.from).normalize();
      for(let i=0;i<3;i++)this.spawn({col:0xffffff,pos:s.from.clone(),vel:dir.clone().multiplyScalar(rr(2.4,3.2)).add(new THREE.Vector3(rr(-.25,.25),rr(-.1,.2),rr(-.25,.25))),life:rr(.45,.7),size:.06,grow:.9,op:.7,drag:1.5});
      if(s.t<=0)this.spray=null;}
    // xonadagi gaz
    if(this.fogTo!==null&&this.sc.fog){const fg=this.sc.fog;fg.far+=(this.fogTo-fg.far)*Math.min(1,dt*.8);if(this.fogTo>30&&fg.far>28){this.sc.fog=null;this.fogTo=null;}}
    this.extra.forEach(e=>e.u&&e.u(dt));
  }
  surfY(p){return Math.abs(p.x)<2.2&&p.z<-1.88&&p.z>-3.36?.96:0;}
  puddle(x,y,z,col,r){if(this.puddles.length>36){const o=this.puddles.shift();this.sc.remove(o.m);}
    const m=new THREE.Mesh(new THREE.CircleGeometry(1,20),new THREE.MeshStandardMaterial({color:col,transparent:true,opacity:.62,roughness:.15,depthWrite:false}));
    m.rotation.x=-Math.PI/2;m.position.set(x,y+.002+Math.random()*.001,z);m.scale.setScalar(.004);this.sc.add(m);this.puddles.push({m,r:Math.min(.07,Math.max(.012,r)),t:0});}
  /* --- idish bilan bog'liq doimiy effektlar --- */
  fume(pos,col,n){let c=n;while(c>0){if(c<1&&Math.random()>c)break;c--;
    this.spawn({map:this.T.puff,col,pos:pos.clone().add(new THREE.Vector3(rr(-.02,.02),0,rr(-.02,.02))),vel:new THREE.Vector3(rr(-.04,.04),rr(.06,.14),rr(-.04,.04)),life:rr(2.4,3.6),size:.05,grow:.3,op:.42,fin:.2});}}
  smell(pos){this.spawn({map:this.T.wave,col:0xe8f2e8,pos:pos.clone().add(new THREE.Vector3(rr(-.04,.04),.03,rr(-.04,.04))),vel:new THREE.Vector3(0,rr(.07,.1),0),life:2.2,size:.075,grow:.04,op:.75});
    if(Math.random()<.35)this.spawn({map:this.T.nose,col:0xffffff,pos:pos.clone().add(new THREE.Vector3(rr(.05,.09),.12,0)),vel:new THREE.Vector3(0,.05,0),life:1.8,size:.06,op:.95});}
  plume(pos,col,r){for(let i=0;i<10;i++)this.spawn({col,pos:pos.clone().add(new THREE.Vector3(rr(-r,r)*.5,rr(-.02,0),rr(-r,r)*.5)),vel:new THREE.Vector3(rr(-.02,.02),rr(-.035,-.01),rr(-.02,.02)),life:rr(1.6,2.8),size:rr(.016,.03),grow:.05,op:.6,ro:1,fin:.1});}
  steam(pos,n){for(let i=0;i<(n||10);i++)this.spawn({map:this.T.puff,col:0xf4f6f8,pos:pos.clone(),vel:new THREE.Vector3(rr(-.2,.2),rr(.3,.7),rr(-.2,.2)),life:rr(1.2,2),size:.06,grow:.35,op:.5});}
  /* --- favqulodda holat effektlari --- */
  startFire(pos,r,opt){this.fire={pos:pos.clone(),r:r||.05,k:(opt&&opt.k)||.6,max:(opt&&opt.max)||2,grow:(opt&&opt.grow)||.05};}
  flare(){if(this.fire){this.fire.k=Math.min(this.fire.max+.6,this.fire.k+.9);}}
  stopFire(){if(!this.fire)return;const p=this.fire.pos;this.fire=null;for(let i=0;i<8;i++)this.spawn({map:this.T.puff,col:0x9a9a9a,pos:p.clone().add(new THREE.Vector3(rr(-.05,.05),.1,rr(-.05,.05))),vel:new THREE.Vector3(rr(-.06,.06),rr(.15,.3),rr(-.06,.06)),life:rr(2,3.5),size:.08,grow:.25,op:.5});}
  explode(pos,power){
    power=power||1;this.flashL.position.copy(pos).add(new THREE.Vector3(0,.15,0));this.flashK=1;this.shake=.55*power;
    this.spawn({map:this.T.ring,add:1,col:0xffe6b0,pos:pos.clone(),life:.38,size:.15,grow:7*power,op:.9,fin:.02});
    for(let i=0;i<12;i++)this.spawn({map:this.T.flame,add:1,col:i%2?0xffb347:0xff6a1a,pos:pos.clone(),vel:new THREE.Vector3(rr(-1,1),rr(.2,1.4),rr(-1,1)).multiplyScalar(.7*power),life:rr(.35,.6),size:.16,grow:2.2*power,op:.95,fin:.03});
    for(let i=0;i<30;i++)this.spawn({add:1,col:0xffd27a,pos:pos.clone(),vel:new THREE.Vector3(rr(-2.5,2.5),rr(1,3.6),rr(-2.5,2.5)).multiplyScalar(power),life:rr(.5,1.1),size:.018,g:6,op:1,fin:.02});
    for(let i=0;i<14;i++)this.spawn({map:this.T.puff,col:0x4a4a4a,pos:pos.clone().add(new THREE.Vector3(0,.1,0)),vel:new THREE.Vector3(rr(-.5,.5),rr(.2,.7),rr(-.5,.5)),life:rr(2.5,4),size:.15,grow:.75,op:.55,drag:.6});
    const gm=new THREE.MeshStandardMaterial({color:0xdff1fb,transparent:true,opacity:.55,roughness:.05,metalness:.2});
    for(let i=0;i<16;i++){const m=new THREE.Mesh(new THREE.TetrahedronGeometry(rr(.008,.022)),gm);m.position.copy(pos).add(new THREE.Vector3(rr(-.05,.05),rr(0,.15),rr(-.05,.05)));this.sc.add(m);
      this.shards.push({m,v:new THREE.Vector3(rr(-2,2),rr(1,3),rr(-2,2)).multiplyScalar(power),w:rr(-12,12)});}
  }
  splash(pos,col,n,toward){
    const mat=new THREE.MeshStandardMaterial({color:col,transparent:true,opacity:.82,roughness:.1});
    for(let i=0;i<(n||30);i++){const m=new THREE.Mesh(this.dropGeo,mat);m.scale.setScalar(rr(.004,.011));m.position.copy(pos).add(new THREE.Vector3(rr(-.03,.03),0,rr(-.03,.03)));this.sc.add(m);
      const v=new THREE.Vector3(rr(-.7,.7),rr(1.3,2.6),rr(-.7,.7));if(toward)v.addScaledVector(toward,rr(.6,1.6));this.drops.push({m,v,col});}
  }
  gasRoom(col,on){if(on){this.sc.fog=new THREE.Fog(col,1.5,32);this.fogTo=6;}else if(this.sc.fog){this.fogTo=40;}}
  blanket(pos,r){
    const geo=new THREE.ConeGeometry(r*1.9,r*2.6,20,3,true),a=geo.attributes.position;
    for(let i=0;i<a.count;i++){if(a.getY(i)<0){a.setX(i,a.getX(i)*(1+rr(-.12,.12)));a.setZ(i,a.getZ(i)*(1+rr(-.12,.12)));a.setY(i,a.getY(i)+rr(-.02,.03));}}geo.computeVertexNormals();
    const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x8d9096,roughness:.95,side:THREE.DoubleSide}));m.position.copy(pos).add(new THREE.Vector3(0,.7,0));this.sc.add(m);
    const target=pos.y+r*1.15;const e={m,u:dt=>{if(m.position.y>target)m.position.y=Math.max(target,m.position.y-dt*1.6);}};this.extra.push(e);
  }
  sand(pos,r){
    for(let i=0;i<70;i++)this.spawn({col:0xc9a46a,pos:pos.clone().add(new THREE.Vector3(rr(-r,r),rr(.25,.5),rr(-r,r))),vel:new THREE.Vector3(0,rr(-.6,-.2),0),life:rr(.5,.8),size:rr(.008,.016),g:3,op:1,fin:.02});
    const m=new THREE.Mesh(new THREE.ConeGeometry(r*1.1,r*.9,16),new THREE.MeshStandardMaterial({color:0xc9a46a,roughness:1}));m.position.copy(pos).add(new THREE.Vector3(0,r*.45,0));m.scale.setScalar(.01);this.sc.add(m);
    const e={m,u:dt=>{if(m.scale.x<1)m.scale.setScalar(Math.min(1,m.scale.x+dt*1.4));}};this.extra.push(e);
  }
  sprayAt(from,to,t){this.spray={from:from.clone(),to:to.clone(),t:t||1.4};}
  crack(mat){mat.map=this.T.crack;mat.opacity=Math.max(mat.opacity,.5);mat.needsUpdate=true;}
  clear(){
    this.stopFire();this.fire=null;this.spray=null;
    [...this.drops,...this.shards].forEach(d=>this.sc.remove(d.m));this.drops=[];this.shards=[];
    this.extra.forEach(e=>this.sc.remove(e.m));this.extra=[];
  }
}
KL.FX=FX;
})(globalThis.KL=globalThis.KL||{});
