// KimyoLab — offline ishlash (stale-while-revalidate)
const V="kimyolab-v3";
const CORE=["./","index.html","style.css","manifest.webmanifest","icon.svg","icon-192.png","icon-512.png","vendor/three.min.js",
  ...["elements","chem","species","rules","engine","content","ui","lab3d","lab","table","molecules","learn","tools","main"].map(f=>`js/${f}.js`)];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:true});
    const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res;}).catch(()=>hit);
    return hit||net;
  }));
});
