/* ===== GROCERY ERP - COMPLETE APP ===== */

const router={
  page:'dashboard',
  init(){
    document.querySelectorAll('.nav-link').forEach(l=>l.addEventListener('click',e=>{e.preventDefault();this.go(l.dataset.page)}));
    document.getElementById('sidebar-toggle').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('collapsed'));
    document.getElementById('mobile-menu-btn').addEventListener('click',()=>{document.getElementById('sidebar').classList.add('open');document.getElementById('sidebar-overlay').classList.add('show')});
    document.getElementById('sidebar-overlay').addEventListener('click',()=>{document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebar-overlay').classList.remove('show')});
    document.querySelectorAll('.modal-close').forEach(b=>b.addEventListener('click',()=>modal(b.dataset.modal,false)));
    document.getElementById('modal-backdrop').addEventListener('click',()=>{document.querySelectorAll('.modal.show').forEach(m=>m.classList.remove('show'));document.getElementById('modal-backdrop').classList.remove('show')});
  },
  go(p){
    this.page=p;
    document.querySelectorAll('.nav-link').forEach(l=>l.classList.toggle('active',l.dataset.page===p));
    document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
    const el=document.getElementById('page-'+p);if(el)el.classList.add('active');
    const titles={dashboard:'لوحة التحكم',pos:'نقطة البيع',products:'المنتجات',inventory:'المخزون',sales:'المبيعات',purchases:'المشتريات',suppliers:'الموردين',customers:'العملاء',reports:'التقارير',settings:'الإعدادات'};
    document.getElementById('page-title').textContent=titles[p]||p;
    if(window.innerWidth<=768){document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebar-overlay').classList.remove('show')}
    this.refresh(p);
  },
  refresh(p){
    if(p==='dashboard')Dash.load();
    if(p==='pos')POS.load();
    if(p==='products')Prod.load();
    if(p==='inventory')Inv.load();
    if(p==='sales')Sales.load();
    if(p==='purchases')Purch.load();
    if(p==='suppliers')Supp.load();
    if(p==='customers')Cust.load();
    if(p==='reports')Rep.load();
    if(p==='settings')Sett.load();
  }
};

const Auth={
  user:null,
  async init(){
    const saved=U.ls.get('guser');
    if(saved){this.user=saved;this.showApp()}else{document.getElementById('splash').classList.add('hidden');document.getElementById('login-screen').classList.remove('hidden')}
    document.getElementById('login-form').addEventListener('submit',e=>{e.preventDefault();this.login()});
    document.getElementById('offline-login-btn').addEventListener('click',()=>{this.user={id:1,name:'Admin',role:'admin'};U.ls.set('guser',this.user);this.showApp();toast('وضع بدون إنترنت','warn')});
    document.getElementById('logout-btn').addEventListener('click',()=>{U.ls.del('guser');location.reload()});
  },
  login(){
    const u=document.getElementById('login-username').value,p=document.getElementById('login-password').value,err=document.getElementById('login-error');
    if(u==='admin'&&p==='admin'){this.user={id:1,name:'Admin',role:'admin'};U.ls.set('guser',this.user);this.showApp()}
    else{err.textContent='بيانات الدخول غير صحيحة'}
  },
  showApp(){
    document.getElementById('splash').classList.add('hidden');
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('current-user-name').textContent=this.user.name;
    router.init();router.go('dashboard');
  }
};

const Dash={
  chart:null,
  async load(){
    const today=new Date().toISOString().split('T')[0];
    const sales=await DB.getAll('sales'),products=await DB.getAll('products'),inv=await DB.getAll('inventory');
    const todaySales=sales.filter(s=>s.date&&s.date.startsWith(today));
    document.getElementById('dash-sales').textContent=U.fmtCur(todaySales.reduce((a,s)=>a+(parseFloat(s.total)||0),0));
    document.getElementById('dash-orders').textContent=todaySales.length;
    document.getElementById('dash-products').textContent=products.length;
    let alerts=0;
    for(const i of inv){const pr=products.find(p=>p.id===i.product_id);if(pr&&i.quantity<=(pr.min_stock||5))alerts++}
    document.getElementById('dash-alerts').textContent=alerts;
    this.recent(sales);this.lowStock(products,inv);this.top(products);this.chartWeek(sales);
  },
  async recent(sales){
    const c=document.getElementById('recent-sales-list');
    const rec=sales.slice(-8).reverse();
    if(!rec.length){c.innerHTML='<div class="empty-state"><i class="fas fa-receipt"></i><p>لا توجد مبيعات</p></div>';return}
    c.innerHTML=rec.map(s=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0"><span>فاتورة #${s.invoice_number||s.id}</span><strong style="color:var(--primary)">${U.fmtCur(s.total)}</strong></div>`).join('');
  },
  async lowStock(products,inv){
    const c=document.getElementById('low-stock-list');
    const low=[];
    for(const i of inv){const pr=products.find(p=>p.id===i.product_id);if(pr&&i.quantity<=(pr.min_stock||5))low.push({name:pr.name,qty:i.quantity,min:pr.min_stock||5})}
    if(!low.length){c.innerHTML='<div class="empty-state"><i class="fas fa-check-circle"></i><p>لا توجد تنبيهات</p></div>';return}
    c.innerHTML=low.map(x=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0"><span>${x.name}</span><span style="color:var(--danger);font-weight:700">${x.qty} / ${x.min}</span></div>`).join('');
  },
  async top(products){
    const c=document.getElementById('top-products-list');
    const items=await DB.getAll('sale_items');
    const counts={};
    items.forEach(i=>{counts[i.product_id]=(counts[i.product_id]||0)+i.quantity});
    const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5);
    if(!sorted.length){c.innerHTML='<div class="empty-state"><i class="fas fa-trophy"></i><p>لا توجد بيانات</p></div>';return}
    c.innerHTML=sorted.map(([pid,qty],i)=>{const pr=products.find(p=>p.id==pid);return`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f0f0f0"><div style="width:26px;height:26px;background:var(--primary);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700">${i+1}</div><div style="flex:1">${pr?pr.name:'محذوف'}</div><strong>${qty}</strong></div>`}).join('');
  },
  async chartWeek(sales){
    const dates=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);dates.push(d.toISOString().split('T')[0])}
    const data=dates.map(d=>sales.filter(s=>s.date&&s.date.startsWith(d)).reduce((a,s)=>a+(parseFloat(s.total)||0),0));
    const ctx=document.getElementById('week-chart');if(!ctx)return;
    if(this.chart)this.chart.destroy();
    this.chart=new Chart(ctx,{type:'bar',data:{labels:dates.map(d=>new Date(d).toLocaleDateString('ar-SA',{weekday:'short'})),datasets:[{label:'المبيعات',data,backgroundColor:'#1a5f2a',borderRadius:6,barThickness:28}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
  }
};

const POS={
  cart:[],
  async load(){
    await this.renderProducts('all');
    this.renderCart();
    document.getElementById('pos-search-input').addEventListener('input',U.debounce(()=>this.search(),300));
    document.getElementById('scan-btn').addEventListener('click',()=>this.scan());
    document.getElementById('clear-cart-btn').addEventListener('click',()=>this.clear());
    document.getElementById('checkout-btn').addEventListener('click',()=>this.checkout());
    document.getElementById('hold-btn').addEventListener('click',()=>{if(!this.cart.length)return;toast('تم تعليق البيع','info');this.cart=[];this.renderCart()});
    document.getElementById('cart-discount').addEventListener('input',()=>this.updateSum());
    document.querySelectorAll('.cat-btn').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.cat-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');this.renderProducts(b.dataset.cat)}));
    this.loadCustomers();
  },
  async renderProducts(cat){
    const products=await DB.getAll('products');
    const grid=document.getElementById('pos-products-grid');
    let list=products.filter(p=>p.status!=='inactive');
    if(cat!=='all')list=list.filter(p=>p.category===cat);
    const s=document.getElementById('pos-search-input').value.toLowerCase();
    if(s)list=list.filter(p=>p.name.toLowerCase().includes(s)||(p.barcode||'').includes(s));
    if(!list.length){grid.innerHTML='<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-search"></i><p>لا توجد منتجات</p></div>';return}
    grid.innerHTML=list.map(p=>`<div class="pos-product-card" onclick="POS.add(${p.id})"><h4>${p.name}</h4><div class="price">${U.fmtCur(p.selling_price)}</div><div class="stock">متوفر: ${p.stock||0}</div></div>`).join('');
  },
  search(){const a=document.querySelector('.cat-btn.active');this.renderProducts(a?a.dataset.cat:'all')},
  async scan(){const b=prompt('أدخل الباركود:');if(!b)return;const p=(await DB.getAll('products')).find(x=>x.barcode===b);if(p)this.add(p.id);else toast('المنتج غير موجود','err')},
  async add(id){
    const p=await DB.get('products',id);if(!p)return;
    const ex=this.cart.find(i=>i.pid===id);
    if(ex){ex.qty++;ex.total=ex.qty*ex.price}
    else{this.cart.push({pid:id,name:p.name,price:parseFloat(p.selling_price)||0,cost:parseFloat(p.cost_price)||0,qty:1,total:parseFloat(p.selling_price)||0})}
    this.renderCart();toast(p.name+' تمت الإضافة','ok');
  },
  updateQty(pid,d){
    const i=this.cart.find(x=>x.pid===pid);if(!i)return;
    i.qty+=d;if(i.qty<=0){this.cart=this.cart.filter(x=>x.pid!==pid)}else{i.total=i.qty*i.price}
    this.renderCart();
  },
  remove(pid){this.cart=this.cart.filter(x=>x.pid!==pid);this.renderCart();},
  clear(){if(!this.cart.length)return;if(!confirm('إفراغ السلة؟'))return;this.cart=[];this.renderCart();},
  renderCart(){
    const c=document.getElementById('cart-items');
    if(!this.cart.length){c.innerHTML='<div class="empty-state"><i class="fas fa-shopping-cart"></i><p>السلة فارغة</p></div>'}
    else{c.innerHTML=this.cart.map(i=>`<div class="cart-item"><div class="cart-item-info"><h4>${i.name}</h4><p>${U.fmtCur(i.price)}</p></div><div class="cart-qty"><button onclick="POS.updateQty(${i.pid},-1)">-</button><span>${i.qty}</span><button onclick="POS.updateQty(${i.pid},1)">+</button></div><div class="cart-item-total">${U.fmtCur(i.total)}</div><button class="cart-item-del" onclick="POS.remove(${i.pid})"><i class="fas fa-times"></i></button></div>`).join('')}
    this.updateSum();
  },
  updateSum(){
    const sub=this.cart.reduce((a,i)=>a+i.total,0),tax=U.tax(sub),disc=parseFloat(document.getElementById('cart-discount').value)||0,tot=sub+tax-disc;
    document.getElementById('cart-subtotal').textContent=U.fmtCur(sub);document.getElementById('cart-tax').textContent=U.fmtCur(tax);document.getElementById('cart-total').textContent=U.fmtCur(tot);
  },
  async loadCustomers(){
    const c=await DB.getAll('customers');
    const s=document.getElementById('checkout-customer');
    s.innerHTML='<option value="">عميل نقدي</option>'+c.map(x=>`<option value="${x.id}">${x.name}</option>`).join('');
  },
  checkout(){
    if(!this.cart.length){toast('السلة فارغة','warn');return}
    document.getElementById('checkout-total-display').textContent=document.getElementById('cart-total').textContent;
    document.getElementById('cash-received').value='';
    document.getElementById('change-display').textContent='الباقي: 0.00 ر.س';
    modal('modal-checkout',true);
  }
};

const Prod={
  list:[],page:1,per:20,editId:null,
  async load(){
    this.list=await DB.getAll('products');
    const s=document.getElementById('filter-product-search').value.toLowerCase();
    const c=document.getElementById('filter-product-cat').value;
    const st=document.getElementById('filter-product-status').value;
    if(s)this.list=this.list.filter(p=>p.name.toLowerCase().includes(s)||(p.barcode||'').includes(s));
    if(c)this.list=this.list.filter(p=>p.category===c);
    if(st)this.list=this.list.filter(p=>p.status===st);
    this.render();
    const cats=[...new Set((await DB.getAll('products')).map(p=>p.category).filter(Boolean))];
    const sel=document.getElementById('filter-product-cat');sel.innerHTML='<option value="">كل الفئات</option>'+cats.map(c=>`<option value="${c}">${this.catName(c)}</option>`).join('');
  },
  catName(c){const n={food:'غذائية',drinks:'مشروبات',cleaning:'منظفات',personal:'عناية',other:'أخرى'};return n[c]||c},
  render(){
    const tb=document.getElementById('products-tbody'),pg=document.getElementById('products-pagination');
    if(!this.list.length){tb.innerHTML='<tr><td colspan="10" class="empty-state"><i class="fas fa-boxes"></i><p>لا توجد منتجات</p></td></tr>';pg.innerHTML='';return}
    const p=paginate(this.list,this.page,this.per);
    tb.innerHTML=p.items.map((x,i)=>`<tr><td>${(p.page-1)*p.per+i+1}</td><td>${x.barcode||'-'}</td><td>${x.name}</td><td>${this.catName(x.category)}</td><td>${U.fmtCur(x.cost_price)}</td><td>${U.fmtCur(x.selling_price)}</td><td>${x.stock||0}</td><td>${x.min_stock||5}</td><td><span class="status-badge ${x.status||'active'}">${x.status==='active'?'نشط':'غير نشط'}</span></td><td class="actions"><button class="btn-edit" onclick="Prod.edit(${x.id})"><i class="fas fa-edit"></i></button><button class="btn-del" onclick="Prod.del(${x.id})"><i class="fas fa-trash"></i></button></td></tr>`).join('');
    renderPage(pg,p.page,p.pages,'Prod.go');
  },
  go(p){this.page=p;this.render();},
  open(){this.editId=null;document.getElementById('product-modal-title').textContent='إضافة منتج';document.getElementById('form-product').reset();document.getElementById('prod-barcode').value=U.genBar();modal('modal-product',true);},
  async edit(id){const p=await DB.get('products',id);if(!p)return;this.editId=id;document.getElementById('product-modal-title').textContent='تعديل منتج';document.getElementById('prod-barcode').value=p.barcode||'';document.getElementById('prod-name').value=p.name||'';document.getElementById('prod-cat').value=p.category||'food';document.getElementById('prod-unit').value=p.unit||'piece';document.getElementById('prod-cost').value=p.cost_price||'';document.getElementById('prod-price').value=p.selling_price||'';document.getElementById('prod-stock').value=p.stock||0;document.getElementById('prod-min').value=p.min_stock||5;document.getElementById('prod-mfg').value=p.mfg_date||'';document.getElementById('prod-exp').value=p.expiry||'';document.getElementById('prod-desc').value=p.description||'';modal('modal-product',true);},
  async save(e){
    e.preventDefault();
    const data={barcode:document.getElementById('prod-barcode').value,name:document.getElementById('prod-name').value,category:document.getElementById('prod-cat').value,unit:document.getElementById('prod-unit').value,cost_price:parseFloat(document.getElementById('prod-cost').value)||0,selling_price:parseFloat(document.getElementById('prod-price').value)||0,stock:parseInt(document.getElementById('prod-stock').value)||0,min_stock:parseInt(document.getElementById('prod-min').value)||5,mfg_date:document.getElementById('prod-mfg').value,expiry:document.getElementById('prod-exp').value,description:document.getElementById('prod-desc').value,status:'active'};
    try{if(this.editId){const ex=await DB.get('products',this.editId);await DB.put('products',{...ex,...data,id:this.editId});toast('تم التحديث','ok')}
    else{const id=await DB.add('products',data);await DB.add('inventory',{product_id:id,quantity:data.stock,max_stock:data.stock*3,last_updated:new Date().toISOString()});toast('تم الإضافة','ok')}
    modal('modal-product',false);this.load();}catch(e){toast('خطأ: '+e.message,'err')}
  },
  async del(id){if(!confirm('حذف المنتج؟'))return;await DB.del('products',id);const inv=(await DB.getAll('inventory')).find(i=>i.product_id===id);if(inv)await DB.del('inventory',inv.id);toast('تم الحذف','ok');this.load();}
};

const Inv={
  tab:'current',
  async load(){
    document.querySelectorAll('#inv-tabs .tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#inv-tabs .tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('#page-inventory .tab-panel').forEach(x=>x.classList.remove('active'));document.getElementById('panel-'+b.dataset.tab).classList.add('active');this.tab=b.dataset.tab;this.loadTab();}));
    document.getElementById('btn-add-stock').addEventListener('click',()=>this.addStock());
    document.getElementById('btn-adjust').addEventListener('click',()=>this.adjust());
    document.getElementById('filter-inv-search').addEventListener('input',U.debounce(()=>this.loadTab(),300));
    document.getElementById('filter-inv-status').addEventListener('change',()=>this.loadTab());
    this.loadTab();
  },
  async loadTab(){
    if(this.tab==='current')this.loadCurrent();
    else if(this.tab==='movements')this.loadMovements();
    else this.loadAlerts();
  },
  async loadCurrent(){
    const inv=await DB.getAll('inventory'),products=await DB.getAll('products');
    const s=document.getElementById('filter-inv-search').value.toLowerCase();
    const st=document.getElementById('filter-inv-status').value;
    let data=inv.map(i=>{const p=products.find(x=>x.id===i.product_id);return{...i,product:p}}).filter(x=>x.product);
    if(s)data=data.filter(x=>x.product.name.toLowerCase().includes(s));
    if(st)data=data.filter(x=>{const m=x.product.min_stock||5;if(st==='out')return x.quantity<=0;if(st==='low')return x.quantity>0&&x.quantity<=m;if(st==='normal')return x.quantity>m;return true});
    const tb=document.getElementById('inv-tbody');
    if(!data.length){tb.innerHTML='<tr><td colspan="6" class="empty-state"><i class="fas fa-warehouse"></i><p>لا توجد بيانات</p></td></tr>';return}
    tb.innerHTML=data.map(x=>{const m=x.product.min_stock||5;let st='normal',txt='طبيعي';if(x.quantity<=0){st='out';txt='نفذ'}else if(x.quantity<=m){st='low';txt='منخفض'}return`<tr><td>${x.product.name}</td><td>${x.quantity}</td><td>${m}</td><td><span class="status-badge ${st}">${txt}</span></td><td>${U.fmtDate(x.last_updated)}</td><td class="actions"><button class="btn-edit" onclick="Inv.adjust(${x.id})"><i class="fas fa-edit"></i></button></td></tr>`}).join('');
  },
  async loadMovements(){
    const m=await DB.getAll('movements'),p=await DB.getAll('products');
    const tb=document.getElementById('movements-tbody');
    if(!m.length){tb.innerHTML='<tr><td colspan="5" class="empty-state"><i class="fas fa-exchange-alt"></i><p>لا توجد حركات</p></td></tr>';return}
    tb.innerHTML=m.slice(-30).reverse().map(x=>{const pr=p.find(z=>z.id===x.product_id);const t={in:'دخول',out:'خروج',adjustment:'تعديل'};return`<tr><td>${U.fmtDate(x.date)}</td><td>${pr?pr.name:'-'}</td><td><span class="status-badge ${x.type==='in'?'active':x.type==='out'?'out':'warn'}">${t[x.type]||x.type}</span></td><td>${x.quantity>0?'+':''}${x.quantity}</td><td>${x.reason||'-'}</td></tr>`}).join('');
  },
  async loadAlerts(){
    const inv=await DB.getAll('inventory'),products=await DB.getAll('products');
    const c=document.getElementById('inv-alerts-grid');
    const alerts=[];
    for(const i of inv){const p=products.find(x=>x.id===i.product_id);if(!p)continue;const m=p.min_stock||5;if(i.quantity<=0)alerts.push({p,i,type:'crit',msg:'نفذ بالكامل'});else if(i.quantity<=m)alerts.push({p,i,type:'low',msg:`مخزون منخفض (${i.quantity})`});const d=U.daysUntil(p.expiry);if(d<=30&&d>=0)alerts.push({p,i,type:d<=7?'crit':'low',msg:`ينتهي خلال ${d} يوم`})}
    if(!alerts.length){c.innerHTML='<div class="empty-state"><i class="fas fa-check-circle"></i><p>لا توجد تنبيهات</p></div>';return}
    c.innerHTML=alerts.map(a=>`<div class="alert-card ${a.type}"><h4>${a.p.name}</h4><p>${a.msg}</p></div>`).join('');
  },
  async addStock(){
    const n=prompt('اسم المنتج أو الباركود:');if(!n)return;
    const p=(await DB.getAll('products')).find(x=>x.name.toLowerCase().includes(n.toLowerCase())||x.barcode===n);
    if(!p){toast('المنتج غير موجود','err');return}
    const q=parseInt(prompt('الكمية:'));if(!q||q<=0)return;
    const r=prompt('السبب:')||'إضافة مخزون';
    const inv=await DB.getAll('inventory');const ex=inv.find(i=>i.product_id===p.id);
    if(ex){ex.quantity+=q;ex.last_updated=new Date().toISOString();await DB.put('inventory',ex)}
    else{await DB.add('inventory',{product_id:p.id,quantity:q,max_stock:q*3,last_updated:new Date().toISOString()})}
    await DB.add('movements',{product_id:p.id,type:'in',quantity:q,reason:r,date:new Date().toISOString(),user:Auth.user?.name||'system'});
    toast('تمت الإضافة','ok');this.loadTab();
  },
  async adjust(id){
    const n=prompt('اسم المنتج أو الباركود:');if(!n)return;
    const p=(await DB.getAll('products')).find(x=>x.name.toLowerCase().includes(n.toLowerCase())||x.barcode===n);
    if(!p){toast('غير موجود','err');return}
    const q=parseInt(prompt('الكمية الجديدة:'));if(isNaN(q))return;
    const r=prompt('السبب:')||'تعديل';
    const inv=await DB.getAll('inventory');const ex=inv.find(i=>i.product_id===p.id);
    const old=ex?ex.quantity:0;const diff=q-old;
    if(ex){ex.quantity=q;ex.last_updated=new Date().toISOString();await DB.put('inventory',ex)}
    else{await DB.add('inventory',{product_id:p.id,quantity:q,max_stock:q*3,last_updated:new Date().toISOString()})}
    await DB.add('movements',{product_id:p.id,type:'adjustment',quantity:diff,reason:r,date:new Date().toISOString(),user:Auth.user?.name||'system'});
    toast('تم التعديل','ok');this.loadTab();
  }
};

const Sales={
  async load(){
    const s=await DB.getAll('sales');const c=await DB.getAll('customers');
    const tb=document.getElementById('sales-tbody');
    if(!s.length){tb.innerHTML='<tr><td colspan="9" class="empty-state"><i class="fas fa-receipt"></i><p>لا توجد مبيعات</p></td></tr>';return}
    tb.innerHTML=s.reverse().map(x=>{const cu=c.find(z=>z.id==x.customer_id);return`<tr><td>${x.invoice_number||x.id}</td><td>${U.fmtDate(x.date)}</td><td>${cu?cu.name:'نقدي'}</td><td>${U.fmtCur(x.subtotal)}</td><td>${U.fmtCur(x.discount)}</td><td>${U.fmtCur(x.total)}</td><td>${x.payment_method==='cash'?'نقدي':x.payment_method==='card'?'بطاقة':'مدى'}</td><td><span class="status-badge paid">مكتمل</span></td><td class="actions"><button class="btn-view" onclick="Sales.view(${x.id})"><i class="fas fa-eye"></i></button></td></tr>`}).join('');
  },
  async view(id){const s=await DB.get('sales',id);if(s)alert('فاتورة: '+(s.invoice_number||s.id)+'\nالإجمالي: '+U.fmtCur(s.total))}
};

const Purch={
  async load(){
    const p=await DB.getAll('purchases');const s=await DB.getAll('suppliers');
    const tb=document.getElementById('purchases-tbody');
    if(!p.length){tb.innerHTML='<tr><td colspan="8" class="empty-state"><i class="fas fa-truck-loading"></i><p>لا توجد مشتريات</p></td></tr>';return}
    tb.innerHTML=p.reverse().map(x=>{const su=s.find(z=>z.id==x.supplier_id);return`<tr><td>${x.invoice_number||x.id}</td><td>${U.fmtDate(x.date)}</td><td>${su?su.name:'-'}</td><td>${U.fmtCur(x.subtotal)}</td><td>${U.fmtCur(x.tax)}</td><td>${U.fmtCur(x.total)}</td><td><span class="status-badge active">مكتمل</span></td><td class="actions"><button class="btn-view" onclick="alert('فاتورة شراء رقم ${x.invoice_number||x.id}')"><i class="fas fa-eye"></i></button></td></tr>`}).join('');
  }
};

const Supp={
  async load(){
    const s=await DB.getAll('suppliers');
    const tb=document.getElementById('suppliers-tbody');
    if(!s.length){tb.innerHTML='<tr><td colspan="6" class="empty-state"><i class="fas fa-handshake"></i><p>لا توجد موردين</p></td></tr>';return}
    tb.innerHTML=s.map(x=>`<tr><td>${x.name}</td><td>${x.phone||'-'}</td><td>${x.email||'-'}</td><td>${x.address||'-'}</td><td><span class="status-badge active">نشط</span></td><td class="actions"><button class="btn-edit" onclick="Supp.edit(${x.id})"><i class="fas fa-edit"></i></button><button class="btn-del" onclick="Supp.del(${x.id})"><i class="fas fa-trash"></i></button></td></tr>`).join('');
  },
  async add(){const n=prompt('اسم المورد:');if(!n)return;const ph=prompt('الهاتف:')||'',em=prompt('البريد:')||'',ad=prompt('العنوان:')||'';await DB.add('suppliers',{name:n,phone:ph,email:em,address:ad,balance:0,status:'active'});toast('تمت الإضافة','ok');this.load();},
  async edit(id){const x=await DB.get('suppliers',id);if(!x)return;const n=prompt('الاسم:',x.name);if(!n)return;x.name=n;x.phone=prompt('الهاتف:',x.phone)||x.phone;x.email=prompt('البريد:',x.email)||x.email;x.address=prompt('العنوان:',x.address)||x.address;await DB.put('suppliers',x);toast('تم التحديث','ok');this.load();},
  async del(id){if(!confirm('حذف المورد؟'))return;await DB.del('suppliers',id);toast('تم الحذف','ok');this.load();}
};

const Cust={
  async load(){
    const c=await DB.getAll('customers');
    const tb=document.getElementById('customers-tbody');
    if(!c.length){tb.innerHTML='<tr><td colspan="6" class="empty-state"><i class="fas fa-users"></i><p>لا توجد عملاء</p></td></tr>';return}
    tb.innerHTML=c.map(x=>`<tr><td>${x.name}</td><td>${x.phone||'-'}</td><td>${x.points||0}</td><td>${U.fmtCur(x.balance)}</td><td><span class="status-badge active">نشط</span></td><td class="actions"><button class="btn-edit" onclick="Cust.edit(${x.id})"><i class="fas fa-edit"></i></button><button class="btn-del" onclick="Cust.del(${x.id})"><i class="fas fa-trash"></i></button></td></tr>`).join('');
  },
  async add(){const n=prompt('اسم العميل:');if(!n)return;const ph=prompt('الهاتف:')||'';await DB.add('customers',{name:n,phone:ph,email:'',address:'',points:0,balance:0,status:'active'});toast('تمت الإضافة','ok');this.load();POS.loadCustomers();},
  async edit(id){const x=await DB.get('customers',id);if(!x)return;const n=prompt('الاسم:',x.name);if(!n)return;x.name=n;x.phone=prompt('الهاتف:',x.phone)||x.phone;await DB.put('customers',x);toast('تم التحديث','ok');this.load();POS.loadCustomers();},
  async del(id){if(!confirm('حذف العميل؟'))return;await DB.del('customers',id);toast('تم الحذف','ok');this.load();POS.loadCustomers();}
};

const Rep={
  c1:null,
  async load(){
    document.querySelectorAll('#report-tabs .tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#report-tabs .tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('#page-reports .tab-panel').forEach(x=>x.classList.remove('active'));document.getElementById('panel-'+b.dataset.tab).classList.add('active');}));
    document.getElementById('btn-gen-sales').addEventListener('click',()=>this.salesRep());
    document.getElementById('btn-gen-inv').addEventListener('click',()=>this.invRep());
    document.getElementById('btn-gen-profit').addEventListener('click',()=>this.profitRep());
    document.getElementById('btn-gen-expiry').addEventListener('click',()=>this.expiryRep());
  },
  async salesRep(){
    const f=document.getElementById('rep-from').value,t=document.getElementById('rep-to').value;
    let s=await DB.getAll('sales');if(f)s=s.filter(x=>x.date>=f);if(t)s=s.filter(x=>x.date<=t+'T23:59:59');
    const total=s.reduce((a,x)=>a+(parseFloat(x.total)||0),0),orders=s.length,avg=orders?total/orders:0,tax=s.reduce((a,x)=>a+(parseFloat(x.tax)||0),0),disc=s.reduce((a,x)=>a+(parseFloat(x.discount)||0),0);
    document.getElementById('sales-stats').innerHTML=`<div class="report-stat"><h4>الإجمالي</h4><p>${U.fmtCur(total)}</p></div><div class="report-stat"><h4>الطلبات</h4><p>${orders}</p></div><div class="report-stat"><h4>المتوسط</h4><p>${U.fmtCur(avg)}</p></div><div class="report-stat"><h4>الضريبة</h4><p>${U.fmtCur(tax)}</p></div><div class="report-stat"><h4>الخصم</h4><p>${U.fmtCur(disc)}</p></div>`;
    const daily={};s.forEach(x=>{const d=x.date.split('T')[0];daily[d]=daily[d]||{sales:0,orders:0};daily[d].sales+=x.total;daily[d].orders++});
    const dates=Object.keys(daily).sort();
    const ctx=document.getElementById('sales-rep-chart');if(this.c1)this.c1.destroy();
    this.c1=new Chart(ctx,{type:'line',data:{labels:dates.map(d=>new Date(d).toLocaleDateString('ar-SA')),datasets:[{label:'المبيعات',data:dates.map(d=>daily[d].sales),borderColor:'#1a5f2a',backgroundColor:'rgba(26,95,42,0.1)',fill:true,tension:0.4}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
    document.getElementById('sales-rep-tbody').innerHTML=dates.map(d=>`<tr><td>${new Date(d).toLocaleDateString('ar-SA')}</td><td>${U.fmtCur(daily[d].sales)}</td><td>${daily[d].orders}</td><td>${U.fmtCur(daily[d].sales/daily[d].orders)}</td></tr>`).join('');
  },
  async invRep(){
    const inv=await DB.getAll('inventory'),p=await DB.getAll('products');
    let tv=0,tc=0;
    const rows=inv.map(i=>{const pr=p.find(x=>x.id===i.product_id);if(!pr)return null;const v=i.quantity*pr.selling_price,c=i.quantity*pr.cost_price;tv+=v;tc+=c;return{pr,i,v,c}}).filter(Boolean);
    document.getElementById('inv-rep-content').innerHTML=`<div class="report-stats"><div class="report-stat"><h4>قيمة البيع</h4><p>${U.fmtCur(tv)}</p></div><div class="report-stat"><h4>التكلفة</h4><p>${U.fmtCur(tc)}</p></div><div class="report-stat"><h4>الربح المتوقع</h4><p class="pos">${U.fmtCur(tv-tc)}</p></div></div><div class="table-wrap"><table class="data-table"><thead><tr><th>المنتج</th><th>الكمية</th><th>التكلفة</th><th>القيمة</th><th>الربح</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.pr.name}</td><td>${r.i.quantity}</td><td>${U.fmtCur(r.c)}</td><td>${U.fmtCur(r.v)}</td><td class="pos">${U.fmtCur(r.v-r.c)}</td></tr>`).join('')}</tbody></table></div>`;
  },
  async profitRep(){
    const f=document.getElementById('profit-from').value,t=document.getElementById('profit-to').value;
    let s=await DB.getAll('sales');if(f)s=s.filter(x=>x.date>=f);if(t)s=s.filter(x=>x.date<=t+'T23:59:59');
    const items=await DB.getAll('sale_items');
    let rev=0,cost=0;
    s.forEach(x=>{rev+=x.total;items.filter(i=>i.sale_id===x.id).forEach(i=>cost+=(i.cost_price||0)*i.quantity)});
    const profit=rev-cost,margin=rev?(profit/rev*100).toFixed(2):0;
    document.getElementById('profit-rep-content').innerHTML=`<div class="report-stats"><div class="report-stat"><h4>الإيرادات</h4><p>${U.fmtCur(rev)}</p></div><div class="report-stat"><h4>التكلفة</h4><p>${U.fmtCur(cost)}</p></div><div class="report-stat"><h4>الربح</h4><p class="${profit>=0?'pos':'neg'}">${U.fmtCur(profit)}</p></div><div class="report-stat"><h4>الهامش</h4><p class="${profit>=0?'pos':'neg'}">${margin}%</p></div></div>`;
  },
  async expiryRep(){
    const days=parseInt(document.getElementById('expiry-days').value)||30;
    const p=await DB.getAll('products'),inv=await DB.getAll('inventory');
    const exp=p.filter(x=>{const d=U.daysUntil(x.expiry);return d<=days&&d>=0}).map(x=>{const i=inv.find(z=>z.product_id===x.id);return{pr:x,inv:i,days:U.daysUntil(x.expiry)}}).sort((a,b)=>a.days-b.days);
    const c=document.getElementById('expiry-rep-content');
    if(!exp.length){c.innerHTML='<div class="empty-state"><i class="fas fa-check-circle"></i><p>لا توجد منتجات</p></div>';return}
    c.innerHTML=`<div class="table-wrap"><table class="data-table"><thead><tr><th>المنتج</th><th>الباركود</th><th>الكمية</th><th>الانتهاء</th><th>المتبقي</th></tr></thead><tbody>${exp.map(e=>`<tr><td>${e.pr.name}</td><td>${e.pr.barcode||'-'}</td><td>${e.inv?e.inv.quantity:0}</td><td>${e.pr.expiry?U.fmtDate(e.pr.expiry):'-'}</td><td><span class="status-badge ${e.days<=7?'out':'low'}">${e.days} يوم</span></td></tr>`).join('')}</tbody></table></div>`;
  }
};

const Sett={
  async load(){
    const sn=await DB.getSet('storeName')||'بقالتك',tax=await DB.getSet('taxRate')||15,cur=await DB.getSet('currency')||'SAR',srv=await DB.getSet('serverUrl')||'';
    document.getElementById('set-store-name').value=sn;document.getElementById('set-tax').value=tax;document.getElementById('set-currency').value=cur;document.getElementById('set-server').value=srv;
    document.getElementById('form-store').addEventListener('submit',e=>{e.preventDefault();DB.set('storeName',document.getElementById('set-store-name').value);DB.set('storeAddress',document.getElementById('set-address').value);DB.set('storePhone',document.getElementById('set-phone').value);toast('تم الحفظ','ok')});
    document.getElementById('form-financial').addEventListener('submit',e=>{e.preventDefault();DB.set('taxRate',parseFloat(document.getElementById('set-tax').value)||15);DB.set('currency',document.getElementById('set-currency').value);toast('تم الحفظ','ok')});
    document.getElementById('btn-export-db').addEventListener('click',()=>this.exportDB());
    document.getElementById('btn-import-db').addEventListener('click',()=>document.getElementById('file-import-db').click());
    document.getElementById('file-import-db').addEventListener('change',e=>this.importDB(e));
    document.getElementById('btn-sync-now').addEventListener('click',()=>{toast('لا يوجد اتصال بالسيرفر','warn')});
  },
  async exportDB(){
    const data={};
    for(const s of['products','inventory','sales','sale_items','purchases','purchase_items','suppliers','customers','movements','settings'])data[s]=await DB.getAll(s);
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='backup_'+new Date().toISOString().split('T')[0]+'.json';a.click();
    toast('تم التصدير','ok');
  },
  async importDB(e){
    const f=e.target.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=async ev=>{
      try{const d=JSON.parse(ev.target.result);for(const s in d){await DB.clear(s);for(const rec of d[s]){if(s==='settings')await DB.set(rec.key,rec.value);else await DB.add(s,rec)}}toast('تم الاستيراد','ok');}catch(x){toast('ملف غير صالح','err')}
    };
    r.readAsText(f);
  }
};

document.getElementById('form-checkout').addEventListener('submit',async e=>{
  e.preventDefault();
  if(!POS.cart.length)return;
  const sub=POS.cart.reduce((a,i)=>a+i.total,0),tax=U.tax(sub),disc=parseFloat(document.getElementById('cart-discount').value)||0,total=sub+tax-disc;
  const pay=document.querySelector('input[name="pay-method"]:checked').value;
  const cid=document.getElementById('checkout-customer').value;
  const notes=document.getElementById('sale-notes').value;
  try{
    const sale={invoice_number:U.genInv('SAL'),date:new Date().toISOString(),customer_id:cid||null,subtotal:sub,tax,discount:disc,total,payment_method:pay,notes,status:'completed',synced:0,user_id:Auth.user?.id||1};
    const sid=await DB.add('sales',sale);
    for(const i of POS.cart){
      await DB.add('sale_items',{sale_id:sid,product_id:i.pid,product_name:i.name,quantity:i.qty,price:i.price,cost_price:i.cost,total:i.total});
      const inv=await DB.getAll('inventory');const ex=inv.find(x=>x.product_id===i.pid);
      if(ex){ex.quantity-=i.qty;ex.last_updated=new Date().toISOString();await DB.put('inventory',ex)}
      await DB.add('movements',{product_id:i.pid,type:'out',quantity:-i.qty,reason:'بيع '+sale.invoice_number,date:new Date().toISOString(),user:Auth.user?.name||'system'});
    }
    if(cid){const cu=await DB.get('customers',parseInt(cid));if(cu){cu.points=(cu.points||0)+Math.floor(total/10);await DB.put('customers',cu)}}
    const rc=document.getElementById('receipt-paper');
    rc.innerHTML=`<div class="receipt-header"><h2>${await DB.getSet('storeName')||'بقالتك'}</h2><p>فاتورة مبيعات</p><p>رقم: ${sale.invoice_number}</p><p>${new Date().toLocaleString('ar-SA')}</p></div><div class="receipt-items">${POS.cart.map(i=>`<div class="receipt-item"><span>${i.name} x${i.qty}</span><span>${U.fmtCur(i.total)}</span></div>`).join('')}</div><div class="receipt-total"><div class="receipt-item"><span>المجموع:</span><span>${U.fmtCur(sub)}</span></div><div class="receipt-item"><span>الضريبة:</span><span>${U.fmtCur(tax)}</span></div>${disc>0?`<div class="receipt-item"><span>الخصم:</span><span>${U.fmtCur(disc)}</span></div>`:''}<div class="receipt-item" style="font-size:15px"><span>الإجمالي:</span><span>${U.fmtCur(total)}</span></div></div><div class="receipt-footer"><p>الدفع: ${pay==='cash'?'نقدي':pay==='card'?'بطاقة':'مدى'}</p><p>شكراً لتسوقكم!</p></div>`;
    modal('modal-checkout',false);modal('modal-receipt',true);
    document.getElementById('btn-print-receipt').onclick=()=>{const w=window.open('','_blank');w.document.write('<html dir="rtl"><head><style>body{font-family:monospace;width:300px;margin:0 auto;padding:20px}</style></head><body>'+rc.innerHTML+'</body></html>');w.document.close();w.print()};
    POS.cart=[];POS.renderCart();document.getElementById('cart-discount').value=0;
    toast('تم البيع بنجاح','ok');
  }catch(e){toast('خطأ: '+e.message,'err')}
});

document.getElementById('cash-received').addEventListener('input',function(){
  const tot=parseFloat(document.getElementById('checkout-total-display').textContent.replace(/[^0-9.]/g,''))||0;
  const rec=parseFloat(this.value)||0;const ch=rec-tot;
  document.getElementById('change-display').textContent='الباقي: '+U.fmtCur(Math.max(0,ch));
  document.getElementById('change-display').style.color=ch>=0?'#27ae60':'#e74c3c';
});

document.getElementById('form-product').addEventListener('submit',e=>Prod.save(e));
document.getElementById('btn-add-product').addEventListener('click',()=>Prod.open());
document.getElementById('btn-add-supplier').addEventListener('click',()=>Supp.add());
document.getElementById('btn-add-customer').addEventListener('click',()=>Cust.add());
document.getElementById('filter-product-search').addEventListener('input',U.debounce(()=>Prod.load(),300));
document.getElementById('filter-product-cat').addEventListener('change',()=>Prod.load());
document.getElementById('filter-product-status').addEventListener('change',()=>Prod.load());

async function demo(){
  const pr=await DB.getAll('products');if(pr.length)return;
  const demo=[
    {barcode:'1234567890123',name:'أرز بسمتي 5كجم',category:'food',unit:'piece',cost_price:25,selling_price:32,stock:50,min_stock:10,status:'active'},
    {barcode:'1234567890124',name:'زيت دوار الشمس 1لتر',category:'food',unit:'piece',cost_price:8,selling_price:11,stock:40,min_stock:10,status:'active'},
    {barcode:'1234567890125',name:'حليب طازج 1لتر',category:'food',unit:'piece',cost_price:4.5,selling_price:6,stock:30,min_stock:15,status:'active'},
    {barcode:'1234567890126',name:'مياه معدنية 330مل',category:'drinks',unit:'piece',cost_price:0.5,selling_price:1,stock:100,min_stock:20,status:'active'},
    {barcode:'1234567890127',name:'عصير برتقال 1لتر',category:'drinks',unit:'piece',cost_price:5,selling_price:7,stock:25,min_stock:8,status:'active'},
    {barcode:'1234567890128',name:'صابون غسيل 1كجم',category:'cleaning',unit:'piece',cost_price:6,selling_price:8.5,stock:35,min_stock:10,status:'active'},
    {barcode:'1234567890129',name:'منظف زجاج 500مل',category:'cleaning',unit:'piece',cost_price:3,selling_price:4.5,stock:20,min_stock:5,status:'active'},
    {barcode:'1234567890130',name:'شامبو 400مل',category:'personal',unit:'piece',cost_price:12,selling_price:16,stock:15,min_stock:5,status:'active'},
    {barcode:'1234567890131',name:'معجون أسنان',category:'personal',unit:'piece',cost_price:4,selling_price:5.5,stock:45,min_stock:10,status:'active'},
    {barcode:'1234567890132',name:'سكر 1كجم',category:'food',unit:'piece',cost_price:3,selling_price:4,stock:60,min_stock:15,status:'active'},
    {barcode:'1234567890133',name:'قهوة تركية 250غ',category:'food',unit:'piece',cost_price:15,selling_price:20,stock:20,min_stock:5,status:'active'},
    {barcode:'1234567890134',name:'شاي أخضر 100كيس',category:'drinks',unit:'piece',cost_price:10,selling_price:13,stock:30,min_stock:8,status:'active'},
  ];
  for(const p of demo){const id=await DB.add('products',p);await DB.add('inventory',{product_id:id,quantity:p.stock,max_stock:p.stock*3,last_updated:new Date().toISOString()})}
  await DB.add('customers',{name:'أحمد محمد',phone:'0501234567',email:'',address:'',points:0,balance:0,status:'active'});
  await DB.add('customers',{name:'خالد عبدالله',phone:'0507654321',email:'',address:'',points:0,balance:0,status:'active'});
  await DB.add('suppliers',{name:'شركة الغذاء السعودية',phone:'0112345678',email:'',address:'الرياض',balance:0,status:'active'});
  await DB.add('suppliers',{name:'مورد المنظفات',phone:'0118765432',email:'',address:'جدة',balance:0,status:'active'});
  console.log('Demo loaded');
}

document.addEventListener('DOMContentLoaded',async()=>{
  await DB.open();
  await demo();
  Auth.init();
});
