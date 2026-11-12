const money = n => n == null ? "PRICE TO BE CONFIRMED" : new Intl.NumberFormat("en-ZA",{style:"currency",currency:"ZAR",maximumFractionDigits:0}).format(n);
const grid = document.getElementById("productGrid");
let bag = JSON.parse(localStorage.getItem("veleraBag") || "[]");
let wishlist = JSON.parse(localStorage.getItem("veleraWishlist") || "[]");
let activeFilter = "all";
let activeProduct = null;

function productArt(p){
  if(p.image) return `<img src="${p.image}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover">`;
  return `<div class="placeholder-dress"></div><span class="placeholder-label">VELÉRA · IMAGE COMING SOON</span>`;
}
function visibleProducts(){
  const term=(document.getElementById("productSearch")?.value||"").trim().toLowerCase();
  let list=PRODUCTS.filter(p=>(activeFilter==="all"||p.category===activeFilter)&&(!term||`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(term)));
  const sort=document.getElementById("sortProducts")?.value||"featured";
  if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
  if(sort==="price-low") list.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity));
  if(sort==="price-high") list.sort((a,b)=>(b.price??-Infinity)-(a.price??-Infinity));
  return list;
}
function renderProducts(){
  const list=visibleProducts();
  grid.innerHTML=list.length?list.map(p=>`<article class="product-card">
    <div class="product-image" data-view="${p.id}">${productArt(p)}<button class="wishlist-btn ${wishlist.includes(p.id)?"saved":""}" data-wish="${p.id}" aria-label="${wishlist.includes(p.id)?"Remove from":"Add to"} wishlist">${wishlist.includes(p.id)?"♥":"♡"}</button></div>
    <div class="product-info"><div class="product-top"><h3 class="product-name">${p.name}</h3><span class="product-price">${money(p.price)}</span></div>
    <div class="product-meta">${p.category.toUpperCase()} · ${(p.sizes||[]).join(" / ")}</div>
    <div class="product-actions"><button class="small-action" data-view="${p.id}">VIEW DETAILS</button><button class="small-action primary" data-add="${p.id}">SELECT SIZE</button></div></div>
  </article>`).join(""):'<p class="empty-results">No dresses match that search. Try another name or category.</p>';
}
function showModal(id){
  activeProduct=PRODUCTS.find(p=>p.id===id); if(!activeProduct)return;
  const p=activeProduct;
  document.getElementById("modalContent").innerHTML=`<div class="modal-layout"><div class="modal-art">${productArt(p)}</div><div class="modal-copy"><p class="eyebrow">THE VELÉRA COLLECTION</p><h2>${p.name}</h2><strong>${money(p.price)}</strong><p>${p.description}</p><p class="product-detail-note">${p.details||"Please check the product measurements and fabric details with us before ordering."}</p><label for="sizeSelect">CHOOSE YOUR SIZE</label><select class="size-select" id="sizeSelect"><option value="">Select size</option>${(p.sizes||[]).map(s=>`<option>${s}</option>`).join("")}</select><button class="dark-button" id="addFromModal">ADD TO BAG ↗</button><p>Availability, delivery and the final total are confirmed before payment.</p><a class="text-link" href="#size-guide" id="modalSizeGuide">VIEW SIZE GUIDE ↗</a></div></div>`;
  document.getElementById("productModal").classList.add("show");
  document.getElementById("productModal").setAttribute("aria-hidden","false");
  document.getElementById("addFromModal").addEventListener("click",()=>{const size=document.getElementById("sizeSelect").value;if(!size){toast("Please select a size.");return;}addToBag(p.id,size);closeModal();});
  document.getElementById("modalSizeGuide").addEventListener("click",closeModal);
}
function closeModal(){document.getElementById("productModal").classList.remove("show");document.getElementById("productModal").setAttribute("aria-hidden","true");}
function saveBag(){localStorage.setItem("veleraBag",JSON.stringify(bag));}
function addToBag(id,size){const p=PRODUCTS.find(x=>x.id===id);if(!p)return;const found=bag.find(x=>x.id===id&&x.size===size);if(found)found.qty=(found.qty||1)+1;else bag.push({id,size,qty:1});saveBag();renderBag();toast(`${p.name} added to your bag.`);}
function renderBag(){
  document.getElementById("bagCount").textContent=bag.reduce((n,x)=>n+(x.qty||1),0);
  const items=document.getElementById("bagItems");
  if(!bag.length){items.innerHTML='<p class="empty-bag">Your bag is waiting for something lovely.</p>';document.getElementById("subtotal").textContent="R0";return;}
  items.innerHTML=bag.map((item,i)=>{const p=PRODUCTS.find(x=>x.id===item.id);if(!p)return "";return `<div class="bag-row"><div class="bag-thumb">V.</div><div class="bag-row-info"><strong>${p.name}</strong><small>Size: ${item.size} · ${money(p.price)}</small><div class="quantity-control"><button data-qty="${i}" data-step="-1" aria-label="Decrease quantity">−</button><span>${item.qty||1}</span><button data-qty="${i}" data-step="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${i}">REMOVE</button></div>`}).join("");
  const known=bag.every(item=>PRODUCTS.find(p=>p.id===item.id)?.price!=null);
  const total=bag.reduce((sum,item)=>sum+((PRODUCTS.find(p=>p.id===item.id)?.price||0)*(item.qty||1)),0);
  document.getElementById("subtotal").textContent=known?money(total):"To be confirmed";
}
function openBag(){document.getElementById("bagDrawer").classList.add("open");document.getElementById("overlay").classList.add("show");document.getElementById("bagDrawer").setAttribute("aria-hidden","false");}
function closeBag(){document.getElementById("bagDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("show");document.getElementById("bagDrawer").setAttribute("aria-hidden","true");}
function toast(message){let el=document.querySelector(".toast");if(!el){el=document.createElement("div");el.className="toast";document.body.appendChild(el);}el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2400);}
function whatsappUrl(){
  const number=STORE_CONFIG.whatsappNumber;
  if(!number||number.includes("ADD_YOUR")){toast("Add your WhatsApp number in products.js before taking orders.");return;}
  if(!bag.length){toast("Your bag is empty.");return;}
  const lines=bag.map(item=>{const p=PRODUCTS.find(x=>x.id===item.id);return `• ${p.name} — size ${item.size} — qty ${item.qty||1} — ${money(p.price)}`;});
  const known=bag.every(item=>PRODUCTS.find(p=>p.id===item.id)?.price!=null);
  const total=bag.reduce((sum,item)=>sum+((PRODUCTS.find(p=>p.id===item.id)?.price||0)*(item.qty||1)),0);
  const msg=`Hello VELÉRA, please confirm this order request:\n${lines.join("\n")}\nSubtotal: ${known?money(total):"Please confirm"}\nPlease confirm stock, delivery fee, delivery estimate and final amount before I pay.`;
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`,"_blank","noopener");
}
function toggleWishlist(id){wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];localStorage.setItem("veleraWishlist",JSON.stringify(wishlist));renderProducts();toast(wishlist.includes(id)?"Saved to your wishlist.":"Removed from your wishlist.");}

grid.addEventListener("click",e=>{const view=e.target.closest("[data-view]");const add=e.target.closest("[data-add]");const wish=e.target.closest("[data-wish]");if(wish){e.stopPropagation();toggleWishlist(wish.dataset.wish);return;}if(view)showModal(view.dataset.view);if(add)showModal(add.dataset.add);});
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");activeFilter=btn.dataset.filter;renderProducts();}));
document.getElementById("productSearch").addEventListener("input",renderProducts);
document.getElementById("sortProducts").addEventListener("change",renderProducts);
document.getElementById("openBag").addEventListener("click",openBag);
document.getElementById("closeBag").addEventListener("click",closeBag);
document.getElementById("overlay").addEventListener("click",closeBag);
document.getElementById("closeModal").addEventListener("click",closeModal);
document.getElementById("productModal").addEventListener("click",e=>{if(e.target.id==="productModal")closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();closeBag();}});
document.getElementById("bagItems").addEventListener("click",e=>{const remove=e.target.closest("[data-remove]");const qty=e.target.closest("[data-qty]");if(remove)bag.splice(Number(remove.dataset.remove),1);if(qty){const i=Number(qty.dataset.qty);bag[i].qty=(bag[i].qty||1)+Number(qty.dataset.step);if(bag[i].qty<1)bag.splice(i,1);}saveBag();renderBag();});
document.getElementById("whatsappCheckout").addEventListener("click",whatsappUrl);
const yoco=document.getElementById("yocoCheckout");if(STORE_CONFIG.yocoPaymentLink){yoco.hidden=false;yoco.addEventListener("click",()=>window.open(STORE_CONFIG.yocoPaymentLink,"_blank","noopener"));}
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
document.getElementById("year").textContent=new Date().getFullYear();
if(STORE_CONFIG.instagramUrl)document.getElementById("followInstagram").href=STORE_CONFIG.instagramUrl;
if(STORE_CONFIG.whatsappNumber&&!STORE_CONFIG.whatsappNumber.includes("ADD_YOUR")){document.getElementById("footerWhatsApp").href=`https://wa.me/${STORE_CONFIG.whatsappNumber}`;document.getElementById("footerWhatsApp").target="_blank";}
renderProducts();renderBag();
