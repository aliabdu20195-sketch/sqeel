const CACHE='grocery-erp-v2';
const FILES=['./','index.html','manifest.json','css/style.css','js/db.js','js/utils.js','js/app.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(!r||r.status!==200||r.type!=='basic')return r;const clone=r.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));return r}).catch(()=>e.request.mode==='navigate'?caches.match('index.html'):new Response('Offline',{status:503}))))});
