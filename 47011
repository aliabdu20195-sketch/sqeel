/* ===== DATABASE ENGINE ===== */
const DB_NAME='GroceryERP_v2',DB_VER=1;
let dbConn=null;

const DB={
  async open(){
    return new Promise((res,rej)=>{
      const req=indexedDB.open(DB_NAME,DB_VER);
      req.onerror=()=>rej(req.error);
      req.onsuccess=()=>{dbConn=req.result;res(dbConn)};
      req.onupgradeneeded=e=>{
        const d=e.target.result;
        const stores=[
          {n:'products',k:'id',aI:true,idx:[{n:'barcode',k:'barcode',u:true},{n:'cat',k:'category'},{n:'name',k:'name'}]},
          {n:'inventory',k:'id',aI:true,idx:[{n:'pid',k:'product_id'}]},
          {n:'sales',k:'id',aI:true,idx:[{n:'date',k:'date'},{n:'sync',k:'synced'}]},
          {n:'sale_items',k:'id',aI:true,idx:[{n:'sid',k:'sale_id'}]},
          {n:'purchases',k:'id',aI:true,idx:[{n:'date2',k:'date'},{n:'sync2',k:'synced'}]},
          {n:'purchase_items',k:'id',aI:true,idx:[{n:'pid2',k:'purchase_id'}]},
          {n:'suppliers',k:'id',aI:true,idx:[{n:'sname',k:'name'}]},
          {n:'customers',k:'id',aI:true,idx:[{n:'phone',k:'phone',u:true},{n:'cname',k:'name'}]},
          {n:'movements',k:'id',aI:true,idx:[{n:'mpid',k:'product_id'},{n:'mdate',k:'date'}]},
          {n:'settings',k:'key'},
          {n:'users',k:'id',aI:true}
        ];
        stores.forEach(s=>{
          if(!d.objectStoreNames.contains(s.n)){
            const st=d.createObjectStore(s.n,{keyPath:s.k,autoIncrement:s.aI||false});
            (s.idx||[]).forEach(i=>st.createIndex(i.n,i.k,{unique:!!i.u}));
          }
        });
      };
    });
  },

  tx(store,mode='readonly'){return dbConn.transaction(store,mode).objectStore(store)},

  async add(store,data){
    data.created_at=data.updated_at=new Date().toISOString();
    return new Promise((res,rej)=>{const r=DB.tx(store,'readwrite').add(data);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
  },
  async get(store,id){return new Promise((res,rej)=>{const r=DB.tx(store).get(id);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})},
  async getAll(store,idx=null,q=null){
    return new Promise((res,rej)=>{
      const s=DB.tx(store);const src=idx?s.index(idx):s;
      const r=q?src.getAll(q):src.getAll();
      r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)
    });
  },
  async put(store,data){
    data.updated_at=new Date().toISOString();
    return new Promise((res,rej)=>{const r=DB.tx(store,'readwrite').put(data);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
  },
  async del(store,id){return new Promise((res,rej)=>{const r=DB.tx(store,'readwrite').delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})},
  async clear(store){return new Promise((res,rej)=>{const r=DB.tx(store,'readwrite').clear();r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})},

  async set(k,v){return DB.put('settings',{key:k,value:v})},
  async getSet(k){const r=await DB.get('settings',k);return r?r.value:null},

  async search(store,field,term){
    const all=await DB.getAll(store);
    if(!term)return all;
    const t=term.toLowerCase();
    return all.filter(x=>x[field]&&x[field].toString().toLowerCase().includes(t));
  }
};
