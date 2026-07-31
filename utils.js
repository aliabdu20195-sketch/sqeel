/* ===== UTILITIES ===== */
const U={
  fmtCur:(a,c='ر.س')=>(parseFloat(a)||0).toFixed(2)+' '+c,
  fmtNum:n=>parseInt(n||0).toLocaleString('ar-SA'),
  fmtDate:(d,mode='short')=>{const x=new Date(d);return isNaN(x)?d:mode==='short'?x.toLocaleDateString('ar-SA'):x.toLocaleString('ar-SA')},
  genId:()=>Date.now().toString(36)+Math.random().toString(36).substr(2,5),
  genBar:()=>'8'+Math.floor(Math.random()*1e11).toString().padStart(11,'0'),
  genInv:(p='INV')=>{const n=new Date();return p+'-'+n.getFullYear().toString().substr(2)+String(n.getMonth()+1).padStart(2,'0')+String(n.getDate()).padStart(2,'0')+'-'+Math.floor(Math.random()*9999).toString().padStart(4,'0')},
  tax:(a,r=15)=>(parseFloat(a)*r/100),
  debounce:(fn,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}},
  daysUntil:d=>{if(!d)return Infinity;const diff=new Date(d)-new Date();return Math.ceil(diff/864e5)},
  online:()=>navigator.onLine,
  ls:{get:k=>{try{return JSON.parse(localStorage.getItem(k))}catch{return null}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),del:k=>localStorage.removeItem(k)}
};

function toast(msg,type='info',dur=3000){
  const c=document.getElementById('toast-container');
  const el=document.createElement('div');
  const icons={ok:'fa-check-circle',err:'fa-times-circle',warn:'fa-exclamation-triangle',info:'fa-info-circle'};
  const cls={ok:'ok',err:'err',warn:'warn',info:''};
  el.className='toast '+cls[type];
  el.innerHTML='<i class="fas '+icons[type]+'"></i><span>'+msg+'</span>';
  c.appendChild(el);
  setTimeout(()=>{el.style.opacity='0';el.style.transform='translateX(-25px)';setTimeout(()=>el.remove(),300)},dur);
}

function modal(id,show){
  const m=document.getElementById(id),bd=document.getElementById('modal-backdrop');
  if(show){bd.classList.add('show');m.classList.add('show')}
  else{bd.classList.remove('show');m.classList.remove('show')}
}

function paginate(items,page=1,per=20){
  const total=items.length,pages=Math.ceil(total/per),start=(page-1)*per;
  return{items:items.slice(start,start+per),total,pages,page,per};
}

function renderPage(container,page,pages,cb){
  if(pages<=1){container.innerHTML='';return}
  let h='';
  for(let i=1;i<=pages;i++){
    if(i===1||i===pages||(i>=page-1&&i<=page+1))h+='<button class="'+(i===page?'active':'')+'" onclick="'+cb+'('+i+')">'+i+'</button>';
    else if(i===page-2||i===page+2)h+='<span>...</span>';
  }
  container.innerHTML=h;
}
