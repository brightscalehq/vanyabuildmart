/* ============================================================
   BUILDMART — APPLICATION SCRIPT
   Handles: interactions (cart, search, filters, carousel),
   routing, and page rendering for dynamic views.
   Static content (images, headings, cards) lives in index.html.
   ============================================================ */

/* ------------------------------------------------------------
   1. ICON LIBRARY
   Used only where markup is generated dynamically.
   Static icons are inline in index.html.
   ------------------------------------------------------------ */
const ICONS = {
  cart:'<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  bag:'<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  truck:'<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  check:'<polyline points="20 6 9 17 4 12"/>',
  plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  minus:'<line x1="5" y1="12" x2="19" y2="12"/>',
  trash:'<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
  'arrow-right':'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  'chevron-left':'<polyline points="15 18 9 12 15 6"/>',
  'chevron-right':'<polyline points="9 18 15 12 9 6"/>',
  'map-pin':'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  'credit-card':'<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  banknote:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/>',
  smartphone:'<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
  'file-text':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  'log-in':'<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>',
  'log-out':'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'user-circle':'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M6.168 18.849a4 4 0 0 1 3.832-2.849h4a4 4 0 0 1 3.834 2.855"/>',
  heart:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  package:'<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/>',
  settings:'<circle cx="12" cy="12" r="3"/>',
  'layout-dashboard':'<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
  filter:'<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'
};
function icon(name, cls=''){
  const p = ICONS[name];
  if(!p) return '';
  return `<svg class="bm-icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
}

/* ------------------------------------------------------------
   2. IMAGE HELPERS
   Used for dynamically-generated product cards only.
   (Static images live directly in index.html.)
   ------------------------------------------------------------ */
function photoUrl(id, w=400, h=400){
  return `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}
const PRODUCT_PHOTOS = {
  1: photoUrl('1541888946425-d81bb19240f5'),
  2: photoUrl('1535813547-99c456a41d4a'),
  3: photoUrl('1621905251189-08b45d6a269e'),
  4: photoUrl('1585675100414-22cb7c9c65c5'),
  5: photoUrl('1589939705384-5185137a7f0f'),
  6: photoUrl('1600585154340-be6161a56a0c'),
  7: photoUrl('1621905252507-b35492cc74b4'),
  8: photoUrl('1558449028-b53a39d100fc'),
  9: photoUrl('1504148455328-c376907d081c'),
  10: photoUrl('1584923741368-9408a7f710c4'),
  11: photoUrl('1589923188900-85dae523342b'),
  12: photoUrl('1582293041079-7814c2f12063')
};
function productPhoto(p){
  return PRODUCT_PHOTOS[p.id] || PRODUCT_PHOTOS[1];
}

/* ------------------------------------------------------------
   3. PRODUCT DATA
   This is the fallback array. In production, replace with
   an API fetch (see loadProducts below) — the template is the
   same so database-driven products render identically.
   ------------------------------------------------------------ */
const products = [
  {id:1,name:"Dangote 3X Cement — 50kg Bag",category:"Cement",price:450,originalPrice:500,rating:4.5,reviews:128,description:"High-quality Portland cement for general construction.",brand:"Dangote",unit:"Per 50kg bag",stock:240,delivery:"Delivery in 1–2 days",material:"Portland Cement",weight:"50 kg",color:"Grey",packaging:"Paper bag",badge:"Best Seller"},
  {id:2,name:"High-Strength Steel Rod — 12mm",category:"Steel",price:1200,originalPrice:1400,rating:4.8,reviews:92,description:"Premium reinforcement steel bars engineered for structural integrity.",brand:"BuildSteel",unit:"Per 12m length",stock:85,delivery:"Delivery in 2–3 days",material:"Reinforced Steel",dimensions:"12m × 12mm",weight:"10.6 kg",color:"Metallic",packaging:"Bundled",badge:"Sale"},
  {id:3,name:"Quality Zinc Roofing Sheet",category:"Roofing",price:850,originalPrice:950,rating:4.2,reviews:64,description:"Durable zinc roofing sheets designed for weather resistance.",brand:"RoofMaster",unit:"Per sheet",stock:120,delivery:"Delivery in 2–4 days",material:"Galvanized Zinc",dimensions:"2m × 0.9m",weight:"5.2 kg",color:"Silver",packaging:"Stacked",badge:"New"},
  {id:4,name:"PVC Pipe — 4 inch",category:"Plumbing",price:350,originalPrice:400,rating:4.6,reviews:47,description:"Heavy-duty PVC pipe for drainage and plumbing systems.",brand:"FlowTech",unit:"Per 6m length",stock:180,delivery:"Delivery in 1–2 days",material:"PVC",dimensions:"6m × 4in",weight:"3.1 kg",color:"White",packaging:"Single",badge:null},
  {id:5,name:"Premium Wall Paint — White (20L)",category:"Paints",price:2500,originalPrice:2800,rating:4.9,reviews:210,description:"Premium quality interior wall paint with a washable finish.",brand:"PureCoat",unit:"Per 20L bucket",stock:45,delivery:"Delivery in 2–3 days",material:"Acrylic Emulsion",weight:"24 kg",color:"White",packaging:"Plastic pail",badge:"Best Seller"},
  {id:6,name:"Ceramic Floor Tiles (Box)",category:"Tiles",price:750,originalPrice:800,rating:4.4,reviews:56,description:"Elegant ceramic floor tiles with a scratch-resistant glaze.",brand:"TileStone",unit:"Per box (1.44m²)",stock:96,delivery:"Delivery in 3–5 days",material:"Ceramic",dimensions:"600 × 600 mm",weight:"22 kg",color:"Beige",packaging:"Box of 4",badge:null},
  {id:7,name:"Water Tank — 1000L",category:"Tanks",price:4500,originalPrice:5000,rating:4.3,reviews:38,description:"Food-grade plastic water storage tank. UV stabilized.",brand:"AquaSafe",unit:"Per tank",stock:22,delivery:"Delivery in 3–5 days",material:"Food-grade HDPE",dimensions:"1.2m × 1.05m",weight:"28 kg",color:"Black",packaging:"Single",badge:"Limited"},
  {id:8,name:"Electrical Cable — 100m Roll",category:"Electrical",price:1800,originalPrice:2000,rating:4.7,reviews:79,description:"High-conductivity copper electrical wire.",brand:"VoltLine",unit:"Per 100m roll",stock:60,delivery:"Delivery in 1–3 days",material:"Copper / PVC",dimensions:"100m × 2.5mm²",weight:"7.2 kg",color:"Black",packaging:"Roll",badge:null},
  {id:9,name:"Heavy-Duty Cordless Drill",category:"Tools",price:1800,originalPrice:2200,rating:4.7,reviews:145,description:"Powerful cordless drill with rechargeable battery.",brand:"PowerPro",unit:"Per unit",stock:34,delivery:"Delivery in 1–2 days",material:"Steel / Plastic",weight:"1.8 kg",color:"Yellow / Black",packaging:"Case",badge:"Best Seller"},
  {id:10,name:"Heavy-Duty Wheelbarrow",category:"Tools",price:950,originalPrice:1100,rating:4.5,reviews:33,description:"Sturdy steel wheelbarrow with a reinforced frame.",brand:"SiteMate",unit:"Per unit",stock:0,delivery:"Restocking soon",material:"Steel",dimensions:"150 × 65 × 65 cm",weight:"18 kg",color:"Red",packaging:"Assembled",badge:null},
  {id:11,name:"Shovel & Spade Set",category:"Tools",price:400,originalPrice:500,rating:4.2,reviews:21,description:"Durable digging tools with wooden handles.",brand:"GardenGear",unit:"Per set of 2",stock:55,delivery:"Delivery in 1–2 days",material:"Steel / Wood",weight:"2.4 kg",color:"Brown / Silver",packaging:"Boxed set",badge:"Sale"},
  {id:12,name:"Safety Helmet & Gloves Kit",category:"Hardware",price:250,originalPrice:350,rating:4.8,reviews:88,description:"Essential PPE kit for construction site safety.",brand:"SafeGuard",unit:"Per kit",stock:140,delivery:"Delivery in 1–2 days",material:"HDPE / Leather",weight:"0.6 kg",color:"Yellow / Black",packaging:"Boxed",badge:"Best Seller"}
];
const BRANDS = [...new Set(products.map(p => p.brand))];

/* ------------------------------------------------------------
   4. STATE
   ------------------------------------------------------------ */
let cart = JSON.parse(localStorage.getItem('buildmartCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('buildmart_wishlist')) || [];
let currentUser = JSON.parse(localStorage.getItem('buildmart_user')) || null;

function saveState(){
  localStorage.setItem('buildmartCart', JSON.stringify(cart));
  localStorage.setItem('buildmart_wishlist', JSON.stringify(wishlist));
  updateHeaderCounts();
}
function updateHeaderCounts(){
  const el = document.getElementById('cart-count');
  if(el) el.innerText = cart.reduce((s,i)=>s+i.qty,0);
}
function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.innerHTML = `${icon('check','bm-icon-gold')}<span>${msg}</span>`;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 3000);
}

/* ------------------------------------------------------------
   5. ROUTER
   ------------------------------------------------------------ */
function navigate(page, param = null){
  if(heroTimer){ clearInterval(heroTimer); heroTimer = null; }
  window.scrollTo(0,0);
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  const c = document.getElementById('app-container');
  switch(page){
    case 'home':     location.reload(); return;
    case 'category': renderListing(c, param); break;
    case 'search':   renderListing(c, null, param); break;
    case 'product':  renderProductDetails(c, param); break;
    case 'cart':     renderCart(c); break;
    case 'checkout': renderCheckout(c); break;
    case 'login':    renderLogin(c); break;
    case 'register': renderRegister(c); break;
    case 'account':  renderAccount(c); break;
    case 'wishlist': renderWishlist(c); break;
    case 'about':    renderAbout(c); break;
    case 'contact':  renderContact(c); break;
    default:         location.reload();
  }
}

/* ------------------------------------------------------------
   6. STARS
   ------------------------------------------------------------ */
function renderStars(r){
  let h = '<span class="product-stars">';
  for(let i=1;i<=5;i++){
    h += `<svg class="bm-icon ${i<=Math.round(r)?'':'off'}" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  }
  return h + '</span>';
}

/* ------------------------------------------------------------
   7. DYNAMIC PRODUCT CARD
   Used for database-driven products and dynamically rendered
   views. Static cards are written directly in index.html.
   ------------------------------------------------------------ */
function createProductCard(p){
  const disc = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  const inStock = p.stock > 0;
  let badge = '';
  if(p.badge === 'Best Seller') badge = `<span class="product-badge best">Best Seller</span>`;
  else if(p.badge === 'New')    badge = `<span class="product-badge new">New</span>`;
  else if(p.badge === 'Sale' || disc >= 10) badge = `<span class="product-badge sale">Sale</span>`;
  else if(p.badge === 'Limited') badge = `<span class="product-badge sale">Limited</span>`;

  return `
    <div class="product-card" onclick="navigate('product', ${p.id})">
      <div class="product-media">
        <img src="${productPhoto(p)}" alt="${p.name}" loading="lazy">
        ${badge}
        ${disc>0 ? `<span class="product-discount">-${disc}%</span>` : ''}
      </div>
      <div class="product-body">
        <div class="product-name" title="${p.name}">${p.name}</div>
        <div class="product-rating-row">
          ${renderStars(p.rating)}
          <span class="product-review">${p.rating} (${p.reviews})</span>
        </div>
        <div class="product-unit">${p.unit}</div>
        <div class="product-price-row">
          <span class="product-price-now">D${p.price.toLocaleString()}</span>
          <span class="product-price-was">D${p.originalPrice.toLocaleString()}</span>
        </div>
        <div class="product-stock ${inStock?'':'out'}">
          <span class="dot"></span>${inStock?'In Stock':'Out of Stock'}
        </div>
        <div class="product-delivery">${icon('truck','bm-icon-xs')} ${p.delivery}</div>
        <button class="add-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})" ${inStock?'':'disabled'}>
          ${icon('cart','bm-icon-sm')} ${inStock?'Add to Cart':'Out of Stock'}
        </button>
      </div>
    </div>`;
}

/* ------------------------------------------------------------
   8. HERO CAROUSEL
   Slides are static in HTML; this only handles sliding.
   ------------------------------------------------------------ */
let heroIndex = 0, heroTimer = null;
const HERO_INTERVAL = 5000;

function initHeroCarousel(){
  const wrap = document.getElementById('heroWrap');
  if(!wrap) return;
  const track = document.getElementById('heroTrack');
  if(!track || !track.children.length) return;
  const total = track.children.length;
  const perView = () => window.innerWidth <= 640 ? 1 : (window.innerWidth <= 900 ? 2 : 4);
  const maxIndex = () => Math.max(0, total - perView());

  function goTo(i){
    heroIndex = Math.max(0, Math.min(i, maxIndex()));
    const cardW = track.children[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${heroIndex * (cardW + 16)}px)`;
  }
  function next(){ heroIndex < maxIndex() ? goTo(heroIndex+1) : goTo(0); }
  function prev(){ heroIndex > 0 ? goTo(heroIndex-1) : goTo(maxIndex()); }
  function startAuto(){ stopAuto(); heroTimer = setInterval(next, HERO_INTERVAL); }
  function stopAuto(){ if(heroTimer){ clearInterval(heroTimer); heroTimer = null; } }

  const nextBtn = document.getElementById('heroNext');
  const prevBtn = document.getElementById('heroPrev');
  if(nextBtn) nextBtn.addEventListener('click', ()=>{ next(); startAuto(); });
  if(prevBtn) prevBtn.addEventListener('click', ()=>{ prev(); startAuto(); });
  wrap.addEventListener('mouseenter', stopAuto);
  wrap.addEventListener('mouseleave', startAuto);
  window.addEventListener('resize', ()=> goTo(Math.min(heroIndex, maxIndex())));
  goTo(0);
  startAuto();
}

/* ------------------------------------------------------------
   9. LISTING PAGE (category & search — dynamic)
   ------------------------------------------------------------ */
let listingState = { category:null, search:null, sort:'default', priceMax:5000, brands:[], inStock:false };

function renderListing(container, categoryName=null, searchQuery=null){
  listingState = { category:categoryName, search:searchQuery, sort:'default', priceMax:5000, brands:[], inStock:false };
  drawListing(container);
}
function drawListing(container){
  let f = products.slice();
  if(listingState.category && listingState.category !== 'All')
    f = f.filter(p=>p.category.toLowerCase().includes(listingState.category.toLowerCase()));
  if(listingState.search)
    f = f.filter(p=>p.name.toLowerCase().includes(listingState.search.toLowerCase())
                || p.category.toLowerCase().includes(listingState.search.toLowerCase()));
  f = f.filter(p=>p.price <= listingState.priceMax);
  if(listingState.brands.length) f = f.filter(p=>listingState.brands.includes(p.brand));
  if(listingState.inStock) f = f.filter(p=>p.stock>0);

  switch(listingState.sort){
    case 'price-asc':  f.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': f.sort((a,b)=>b.price-a.price); break;
    case 'rating':     f.sort((a,b)=>b.rating-a.rating); break;
    case 'newest':     f.sort((a,b)=>b.id-a.id); break;
    case 'best':       f.sort((a,b)=>b.reviews-a.reviews); break;
  }

  const title = listingState.search
    ? `Search: "${listingState.search}"`
    : (listingState.category && listingState.category !== 'All' ? listingState.category : 'All Products');

  const html = f.length === 0
    ? '<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-light);">No products match your filters.</p>'
    : f.map(createProductCard).join('');

  const catChecks = BRANDS.length ? products
    .map(p=>p.category).filter((v,i,a)=>a.indexOf(v)===i).map(c=>
      `<label class="filter-checkbox"><input type="checkbox" ${listingState.category===c?'checked':''} onchange="filterCat('${c}', this.checked)"> ${c}</label>`
    ).join('') : '';

  const brandChecks = BRANDS.map(b=>
    `<label class="filter-checkbox"><input type="checkbox" ${listingState.brands.includes(b)?'checked':''} onchange="filterBrand('${b}', this.checked)"> ${b}</label>`
  ).join('');
  const fill = (listingState.priceMax/5000)*100;

  container.innerHTML = `
    <h2 style="font-size:22px;margin-bottom:16px;color:var(--charcoal);">${title}</h2>
    <div class="listing-layout">
      <aside>
        <button class="filters-toggle-mobile" onclick="document.querySelector('.filters-body').classList.toggle('open')">
          ${icon('filter','bm-icon-sm')} Filters
        </button>
        <div class="filters-body">
          <div class="filter-card">
            <h4>${icon('credit-card','bm-icon-xs')} Price Range</h4>
            <input type="range" min="0" max="5000" step="50" value="${listingState.priceMax}"
                   class="price-slider" style="--fill:${fill}%"
                   oninput="updatePrice(this.value)">
            <div class="price-labels"><span>D0</span><span>D${listingState.priceMax}</span></div>
          </div>
          <div class="filter-card"><h4>${icon('grid','bm-icon-xs')} Categories</h4>${catChecks}</div>
          <div class="filter-card"><h4>${icon('shield','bm-icon-xs')} Brands</h4>${brandChecks}</div>
          <div class="filter-card">
            <h4>${icon('check','bm-icon-xs')} Availability</h4>
            <label class="filter-checkbox">
              <input type="checkbox" ${listingState.inStock?'checked':''} onchange="filterInStock(this.checked)"> In Stock Only
            </label>
          </div>
        </div>
      </aside>
      <div>
        <div class="listing-toolbar">
          <div class="listing-count">Showing <strong>${f.length}</strong> of <strong>${products.length}</strong> products</div>
          <div class="listing-sort">
            <label>Sort by:</label>
            <select onchange="changeSort(this.value)">
              <option value="default"    ${listingState.sort==='default'?'selected':''}>Featured</option>
              <option value="best"       ${listingState.sort==='best'?'selected':''}>Best Selling</option>
              <option value="newest"     ${listingState.sort==='newest'?'selected':''}>Newest</option>
              <option value="price-asc"  ${listingState.sort==='price-asc'?'selected':''}>Price: Low to High</option>
              <option value="price-desc" ${listingState.sort==='price-desc'?'selected':''}>Price: High to Low</option>
              <option value="rating"     ${listingState.sort==='rating'?'selected':''}>Highest Rated</option>
            </select>
          </div>
        </div>
        <div class="product-grid">${html}</div>
      </div>
    </div>
  `;
  updateHeaderCounts();
}
function updatePrice(v){ listingState.priceMax = parseInt(v); drawListing(document.getElementById('app-container')); }
function filterCat(v,c){ listingState.category = c ? v : null; drawListing(document.getElementById('app-container')); }
function filterBrand(b,c){
  if(c) listingState.brands.push(b);
  else listingState.brands = listingState.brands.filter(x=>x!==b);
  drawListing(document.getElementById('app-container'));
}
function filterInStock(c){ listingState.inStock = c; drawListing(document.getElementById('app-container')); }
function changeSort(v){ listingState.sort = v; drawListing(document.getElementById('app-container')); }

/* ------------------------------------------------------------
   10. PRODUCT DETAILS
   ------------------------------------------------------------ */
function renderProductDetails(container, productId){
  const p = products.find(x=>x.id==productId);
  if(!p){ navigate('home'); return; }
  const disc = Math.round(((p.originalPrice-p.price)/p.originalPrice)*100);
  const inStock = p.stock > 0;
  const related = products.filter(x=>x.category===p.category && x.id!==p.id).slice(0,4);
  const relatedList = related.length ? related : products.filter(x=>x.id!==p.id).slice(0,4);
  const photo = productPhoto(p);

  container.innerHTML = `
    <div style="margin-bottom:12px;font-size:13px;color:var(--text-light);">
      <span onclick="navigate('home')" style="cursor:pointer;">Home</span> /
      <span onclick="navigate('category','${p.category}')" style="cursor:pointer;">${p.category}</span> /
      <span style="color:var(--charcoal);font-weight:600;">${p.name}</span>
    </div>
    <div class="pd-wrap">
      <div class="pd-gallery">
        <div class="pd-main"><img id="pdMainImg" src="${photo}" alt="${p.name}"></div>
        <div class="pd-thumbs">
          ${[photo, `${photo}&sat=-20`, `${photo}&con=10`].map((src,i)=>
            `<button class="pd-thumb ${i===0?'active':''}" onclick="selectThumb(this,'${src}')">
              <img src="${src}" alt="View ${i+1}">
            </button>`).join('')}
        </div>
      </div>
      <div class="pd-info">
        <span class="pd-chip">${icon('grid','bm-icon-xs')} ${p.category}</span>
        <h1 class="pd-title">${p.name}</h1>
        <div class="pd-rating-row">
          ${renderStars(p.rating)}
          <span><strong style="color:var(--charcoal);">${p.rating}</strong> · ${p.reviews} reviews</span>
        </div>
        <div class="pd-price-block">
          <span class="pd-price-now">D${p.price.toLocaleString()}</span>
          <span class="pd-price-was">D${p.originalPrice.toLocaleString()}</span>
          ${disc>0 ? `<span class="pd-price-off">-${disc}% off</span>` : ''}
        </div>
        <div class="pd-stock ${inStock?'':'out'}">
          <span class="dot"></span>${inStock?`In Stock — ${p.stock} available`:'Out of Stock'}
        </div>
        <p class="pd-desc">${p.description}</p>
        <div class="pd-purchase">
          <div>
            <div class="pd-qty-label">Quantity</div>
            <div class="pd-qty">
              <button onclick="pdQty(-1)">${icon('minus','bm-icon-sm')}</button>
              <input type="text" id="pdQty" value="1" readonly>
              <button onclick="pdQty(1)">${icon('plus','bm-icon-sm')}</button>
            </div>
          </div>
          <div class="pd-actions">
            <button class="btn btn-primary" onclick="pdAdd(${p.id})" ${inStock?'':'disabled'}>
              ${icon('cart','bm-icon-sm')} Add to Cart
            </button>
            <button class="btn btn-outline" onclick="navigate('cart')">
              ${icon('bag','bm-icon-sm')} Buy Now
            </button>
          </div>
          <div class="pd-delivery">${icon('truck','bm-icon-sm')} ${p.delivery}</div>
        </div>
        <h3 class="pd-section-title">${icon('file-text','bm-icon-sm')} Specifications</h3>
        <div class="pd-specs">
          <div class="pd-spec-row"><span class="pd-spec-key">Brand</span><span class="pd-spec-val">${p.brand}</span></div>
          <div class="pd-spec-row"><span class="pd-spec-key">Category</span><span class="pd-spec-val">${p.category}</span></div>
          <div class="pd-spec-row"><span class="pd-spec-key">Selling Unit</span><span class="pd-spec-val">${p.unit}</span></div>
          ${p.material?`<div class="pd-spec-row"><span class="pd-spec-key">Material</span><span class="pd-spec-val">${p.material}</span></div>`:''}
          ${p.dimensions?`<div class="pd-spec-row"><span class="pd-spec-key">Dimensions</span><span class="pd-spec-val">${p.dimensions}</span></div>`:''}
          ${p.weight?`<div class="pd-spec-row"><span class="pd-spec-key">Weight</span><span class="pd-spec-val">${p.weight}</span></div>`:''}
          ${p.color?`<div class="pd-spec-row"><span class="pd-spec-key">Colour</span><span class="pd-spec-val">${p.color}</span></div>`:''}
          ${p.packaging?`<div class="pd-spec-row"><span class="pd-spec-key">Packaging</span><span class="pd-spec-val">${p.packaging}</span></div>`:''}
        </div>
        <h3 class="pd-section-title">${icon('file-text','bm-icon-sm')} Product Description</h3>
        <div class="pd-full-desc">${p.description}</div>
      </div>
    </div>
    <section class="pd-related">
      <h2 class="pd-related-title">${icon('heart','bm-icon-sm')} You May Also Like</h2>
      <div class="product-grid">${relatedList.map(createProductCard).join('')}</div>
    </section>
  `;
  updateHeaderCounts();
}
function selectThumb(btn, src){
  document.querySelectorAll('.pd-thumb').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('pdMainImg').src = src;
}
function pdQty(delta){
  const input = document.getElementById('pdQty');
  const title = document.querySelector('.pd-title').innerText;
  const p = products.find(x=>x.name===title);
  const max = p ? p.stock : 99;
  let v = parseInt(input.value) + delta;
  if(v<1) v=1; if(v>max) v=max;
  input.value = v;
}
function pdAdd(id){
  const qty = parseInt(document.getElementById('pdQty').value) || 1;
  const p = products.find(x=>x.id===id);
  if(!p || p.stock <= 0) return;
  const ex = cart.find(i=>i.id===id);
  if(ex) ex.qty += qty; else cart.push({id, qty});
  if(ex && ex.qty > p.stock) ex.qty = p.stock;
  saveState();
  showToast('Added to cart');
}

/* ------------------------------------------------------------
   11. CART / CHECKOUT / AUTH / DASHBOARD
   ------------------------------------------------------------ */
function renderCart(container){
  if(cart.length === 0){
    container.innerHTML = `<div class="text-center mt-20">
      <div style="color:var(--text-muted);margin-bottom:12px;">${icon('bag','bm-icon-lg bm-icon-muted')}</div>
      <h2 style="font-size:22px;margin-bottom:14px;">Your Cart is Empty</h2>
      <button class="btn btn-primary" onclick="navigate('home')">${icon('cart','bm-icon-sm')} Shop Now</button>
    </div>`;
    return;
  }
  const items = cart.map(item=>{
    const p = products.find(x=>x.id===item.id);
    return `<div class="cart-item">
      <div class="cart-media"><img src="${productPhoto(p)}" alt="${p.name}"></div>
      <div class="cart-info">
        <h3>${p.name}</h3>
        <div style="display:flex;gap:10px;align-items:baseline;margin:6px 0;">
          <span style="font-weight:800;font-size:15px;">D${p.price.toLocaleString()}</span>
          <span style="font-size:12px;color:var(--text-muted);text-decoration:line-through;">D${p.originalPrice.toLocaleString()}</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <div class="qty-control">
            <button onclick="updateQty(${item.id},-1)">${icon('minus','bm-icon-xs')}</button>
            <input type="text" value="${item.qty}" readonly>
            <button onclick="updateQty(${item.id},1)">${icon('plus','bm-icon-xs')}</button>
          </div>
          <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">${icon('trash','bm-icon-xs')} Remove</button>
        </div>
      </div>
      <div style="font-weight:800;font-size:16px;">D${(p.price*item.qty).toLocaleString()}</div>
    </div>`;
  }).join('');
  const subtotal = cart.reduce((s,i)=>{const p=products.find(x=>x.id===i.id);return s+p.price*i.qty},0);
  const delivery = 250, total = subtotal + delivery;

  container.innerHTML = `
    <h2 style="margin-bottom:16px;font-size:22px;display:flex;align-items:center;gap:8px;">${icon('cart')} Shopping Cart</h2>
    <div class="cart-layout">
      <div class="cart-items">${items}</div>
      <div class="cart-summary">
        <h3 style="margin-bottom:16px;border-bottom:1px solid var(--border-soft);padding-bottom:12px;">Order Summary</h3>
        <div class="summary-row"><span>Subtotal (${cart.reduce((a,b)=>a+b.qty,0)} items)</span><span>D${subtotal.toLocaleString()}</span></div>
        <div class="summary-row"><span>Delivery</span><span>D${delivery}</span></div>
        <div class="summary-row total"><span>Total Payable</span><span>D${total.toLocaleString()}</span></div>
        <button class="btn btn-primary btn-block mt-20" onclick="navigate('checkout')">Proceed to Checkout ${icon('arrow-right','bm-icon-sm')}</button>
      </div>
    </div>
  `;
  updateHeaderCounts();
}

function renderCheckout(container){
  if(cart.length === 0){ navigate('home'); return; }
  if(!currentUser){
    container.innerHTML = `<div class="text-center mt-20">
      <div style="color:var(--text-muted);margin-bottom:12px;">${icon('user','bm-icon-lg bm-icon-muted')}</div>
      <h2 style="font-size:22px;margin-bottom:14px;">Please Login to Checkout</h2>
      <p style="margin-bottom:16px;color:var(--text-light);">You need an account to place an order.</p>
      <button class="btn btn-primary" onclick="navigate('login')">${icon('log-in','bm-icon-sm')} Login / Register</button>
    </div>`;
    return;
  }
  const subtotal = cart.reduce((s,i)=>{const p=products.find(x=>x.id===i.id);return s+p.price*i.qty},0);
  const total = subtotal + 250;

  container.innerHTML = `
    <h2 style="margin-bottom:16px;font-size:22px;display:flex;align-items:center;gap:8px;">${icon('credit-card')} Checkout</h2>
    <div class="cart-layout">
      <div class="cart-items" style="padding:20px;">
        <h3 style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">${icon('map-pin','bm-icon-sm')} Delivery Address</h3>
        <div class="form-group"><label>Full Name</label><input type="text" value="${currentUser.name}"></div>
        <div class="form-group"><label>Phone Number</label><input type="text" placeholder="+220 123 4567"></div>
        <div class="form-group"><label>Delivery Address</label><textarea rows="3" placeholder="Street, Area, City"></textarea></div>
        <h3 style="display:flex;align-items:center;gap:8px;margin:16px 0 12px;">${icon('credit-card','bm-icon-sm')} Payment Method</h3>
        <label style="display:flex;gap:8px;padding:6px 0;font-size:14px;cursor:pointer;"><input type="radio" name="payment" checked> ${icon('banknote','bm-icon-sm')} Cash on Delivery</label>
        <label style="display:flex;gap:8px;padding:6px 0;font-size:14px;cursor:pointer;"><input type="radio" name="payment"> ${icon('file-text','bm-icon-sm')} Bank Transfer</label>
        <label style="display:flex;gap:8px;padding:6px 0;font-size:14px;cursor:pointer;"><input type="radio" name="payment"> ${icon('smartphone','bm-icon-sm')} Mobile Money</label>
      </div>
      <div class="cart-summary">
        <h3 style="margin-bottom:16px;border-bottom:1px solid var(--border-soft);padding-bottom:12px;">Order Summary</h3>
        <div class="summary-row"><span>Items Total</span><span>D${subtotal.toLocaleString()}</span></div>
        <div class="summary-row"><span>Delivery</span><span>D250</span></div>
        <div class="summary-row total"><span>Total</span><span>D${total.toLocaleString()}</span></div>
        <button class="btn btn-primary btn-block mt-20" onclick="placeOrder()">Place Order ${icon('check','bm-icon-sm')}</button>
      </div>
    </div>
  `;
}

function renderLogin(container){
  container.innerHTML = `<div class="auth-container">
    <h2>${icon('log-in')} Welcome Back</h2>
    <form onsubmit="handleLogin(event)">
      <div class="form-group"><label>Email Address</label><input type="email" id="loginEmail" placeholder="you@example.com" required></div>
      <div class="form-group"><label>Password</label><input type="password" id="loginPassword" placeholder="Your password" required></div>
      <button type="submit" class="btn btn-primary btn-block">Login ${icon('arrow-right','bm-icon-sm')}</button>
    </form>
    <p>Don't have an account? <a href="#" onclick="navigate('register');return false;">Create one</a></p>
  </div>`;
}

function renderRegister(container){
  container.innerHTML = `<div class="auth-container">
    <h2>${icon('user')} Create Account</h2>
    <form onsubmit="handleRegister(event)">
      <div class="form-group"><label>Full Name</label><input type="text" id="regName" placeholder="John Doe" required></div>
      <div class="form-group"><label>Email Address</label><input type="email" id="regEmail" placeholder="you@example.com" required></div>
      <div class="form-group"><label>Password</label><input type="password" id="regPassword" placeholder="Create a password" required></div>
      <button type="submit" class="btn btn-primary btn-block">Register ${icon('arrow-right','bm-icon-sm')}</button>
    </form>
    <p>Already have an account? <a href="#" onclick="navigate('login');return false;">Login</a></p>
  </div>`;
}

function renderAccount(container){
  if(!currentUser){ navigate('login'); return; }
  container.innerHTML = `<div class="dashboard-layout">
    <div class="dashboard-sidebar">
      <h3>${icon('user-circle')} My Account</h3>
      <ul>
        <li class="active">${icon('layout-dashboard')} Dashboard</li>
        <li onclick="navigate('wishlist')">${icon('heart')} My Wishlist</li>
        <li>${icon('package')} Orders</li>
        <li>${icon('settings')} Settings</li>
        <li onclick="handleLogout()" style="color:var(--danger);">${icon('log-out')} Logout</li>
      </ul>
    </div>
    <div class="dashboard-content">
      <h2>Welcome back, ${currentUser.name}!</h2>
      <p class="mt-20">From your account dashboard you can view your recent orders, manage shipping addresses, and update your account.</p>
    </div>
  </div>`;
}

function renderWishlist(container){
  if(wishlist.length === 0){
    container.innerHTML = `<div class="text-center mt-20">
      <div style="color:var(--text-muted);margin-bottom:12px;">${icon('heart','bm-icon-lg bm-icon-muted')}</div>
      <h2 style="font-size:22px;margin-bottom:14px;">Your Wishlist is Empty</h2>
      <button class="btn btn-primary" onclick="navigate('home')">Explore Products ${icon('arrow-right','bm-icon-sm')}</button>
    </div>`;
    return;
  }
  const html = wishlist.map(id=>{const p=products.find(x=>x.id===id); return p?createProductCard(p):''}).join('');
  container.innerHTML = `<h2 style="margin-bottom:16px;font-size:22px;">My Wishlist (${wishlist.length})</h2><div class="product-grid">${html}</div>`;
}

function renderAbout(container){
  container.innerHTML = `<div style="background:#fff;padding:32px;border-radius:12px;max-width:820px;margin:0 auto;box-shadow:var(--shadow-sm);">
    <h1 style="font-size:24px;margin-bottom:18px;">About BuildMart</h1>
    <p style="margin-bottom:14px;">BuildMart is The Gambia's premier online destination for building materials and construction supplies. We are dedicated to providing contractors, builders, and DIY enthusiasts with high-quality products at competitive prices.</p>
    <p>Our mission is to simplify the procurement process for construction projects of all sizes, ensuring timely delivery and exceptional customer service.</p>
  </div>`;
}
function renderContact(container){
  container.innerHTML = `<div style="background:#fff;padding:32px;border-radius:12px;max-width:620px;margin:0 auto;box-shadow:var(--shadow-sm);">
    <h1 style="font-size:24px;margin-bottom:14px;">Contact Us</h1>
    <p style="margin-bottom:20px;color:var(--text-light);">Have a question about a product or your order? We'd love to hear from you.</p>
    <div class="form-group"><label>Your Name</label><input type="text" placeholder="John Doe"></div>
    <div class="form-group"><label>Email Address</label><input type="email" placeholder="you@example.com"></div>
    <div class="form-group"><label>Message</label><textarea rows="4" placeholder="How can we help you?"></textarea></div>
    <button class="btn btn-primary">Send Message ${icon('arrow-right','bm-icon-sm')}</button>
  </div>`;
}

/* ------------------------------------------------------------
   12. CART LOGIC
   ------------------------------------------------------------ */
function addToCart(id){
  const p = products.find(x=>x.id===id);
  if(!p || p.stock <= 0) return;
  const ex = cart.find(i=>i.id===id);
  if(ex) ex.qty += 1; else cart.push({id, qty:1});
  if(ex && ex.qty > p.stock) ex.qty = p.stock;
  saveState();
  showToast('Added to cart');
}
function removeFromCart(id){
  cart = cart.filter(i=>i.id!==id);
  saveState();
  renderCart(document.getElementById('app-container'));
}
function updateQty(id, delta){
  const i = cart.find(x=>x.id===id);
  if(!i) return;
  i.qty += delta;
  if(i.qty <= 0){ removeFromCart(id); return; }
  saveState();
  renderCart(document.getElementById('app-container'));
}

/* ------------------------------------------------------------
   13. SEARCH / AUTH / MISC
   ------------------------------------------------------------ */
function handleSearch(e){
  if(e.key === 'Enter'){
    const q = e.target.value.trim();
    if(q) navigate('search', q);
  }
}
function submitSearch(){
  const q = document.getElementById('globalSearchInput').value.trim();
  if(q) navigate('search', q);
}
function handleLogin(e){
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  currentUser = {name:email.split('@')[0], email};
  localStorage.setItem('buildmart_user', JSON.stringify(currentUser));
  showToast('Logged in');
  navigate('account');
}
function handleRegister(e){
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  currentUser = {name, email};
  localStorage.setItem('buildmart_user', JSON.stringify(currentUser));
  showToast('Account created');
  navigate('account');
}
function handleLogout(){
  currentUser = null;
  localStorage.removeItem('buildmart_user');
  showToast('Logged out');
  navigate('home');
}
function placeOrder(){
  if(cart.length === 0) return;
  alert('Order Placed Successfully! (Frontend Demo)');
  cart = [];
  saveState();
  navigate('home');
}

/* ------------------------------------------------------------
   14. INIT
   ------------------------------------------------------------ */
function init(){
  updateHeaderCounts();
  initHeroCarousel();

  // Fill the Recommended Products grid from products[]
  const recGrid = document.getElementById('recommendedGrid');
  if(recGrid){
    const recs = [...products].sort(()=>Math.random()-0.5).slice(0,8);
    recGrid.innerHTML = recs.map(createProductCard).join('');
  }
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}