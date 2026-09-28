document.addEventListener('DOMContentLoaded', () => {

  // ---------- helpers ----------
  const $ = id => document.getElementById(id);
  const fmt = n => '₦' + Math.round(n).toLocaleString();
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const img = id => `https://images.unsplash.com/photo-${id}?w=600&q=70&auto=format&fit=crop`;
  const PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0aaff"/><stop offset="1" stop-color="#fbf8f3"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><text x="200" y="290" font-size="120" text-anchor="middle">🍰</text></svg>');
  const CUSTOMIZABLE = ['cake', 'cupcake', 'donut', 'drink']; 
  const ZONES = [
    { id: 'wuse', label: 'Wuse / Wuse II / Garki', fee: 2500 },
    { id: 'maitama', label: 'Maitama / Asokoro', fee: 3000 },
    { id: 'central', label: 'Jabi / Utako / Life Camp', fee: 3000 },
    { id: 'gwarinpa', label: 'Gwarinpa / Kado / Dawaki', fee: 4000 },
    { id: 'outer', label: 'Kubwa / Lugbe / Apo / Lokogoma', fee: 5500 },
    { id: 'airport', label: 'Airport Road / Karu / Nyanya', fee: 6500 }
  ];
  const MAX_HEAVY_PER_DAY = 3;

  // ---------- data ----------
  const products = [
    { id: 1, name: "Velvet Rose Bloom", category: "cake", price: 18000, rating: 4.9, reviews: 124, badge: "Bestseller", image: img('1565958011703-44f9829ba187'), desc: "Signature red velvet sponge layered with vanilla bean cream cheese frosting and edible rose petals." },
    { id: 2, name: "Golden Truffle Mist", category: "cake", price: 25000, rating: 5.0, reviews: 89, badge: "Gold Leaf", image: img('1535141192574-5d4897c825a1'), desc: "Rich dark cocoa ganache with sea salt flakes and delicate 24k edible gold leaf." },
    { id: 9, name: "Moist Carrot Cake Wedge", category: "slice", price: 3500, rating: 4.9, reviews: 112, badge: "cake slices", image: img('1621303837174-89787a7d4729'), desc: "Spiced carrot sponge with crushed walnuts, raisins and cream cheese frosting." },
    { id: 10, name: "Classic Velvet Slice", category: "slice", price: 4000, rating: 5.0, reviews: 145, badge: "cake slices", image: img('1586788680434-30d324b2d46f'), desc: "Freshly sliced signature red velvet layered with vanilla cream cheese." },
    { id: 11, name: "Abuja Style Meat Pie", category: "pastry", price: 2000, rating: 4.8, reviews: 320, badge: "Hot & Fresh", image: img('1626803775151-61d756612f40'), desc: "Buttery, flaky crust packed with seasoned minced beef, carrots and potatoes." },
    { id: 3, name: "Matcha Zen Cupcake", category: "cupcake", price: 4500, rating: 4.8, reviews: 56, badge: "New", image: img('1576618148400-f54bed99fcfd'), desc: "Uji matcha chiffon cupcake topped with silky white chocolate buttercream." },
    { id: 4, name: "Berry Choux Pastry", category: "pastry", price: 5500, rating: 4.7, reviews: 42, badge: "Popular", image: img('1509440159596-0249088772ff'), desc: "Crisp craquelin choux filled with fresh raspberry whipped cream." },
    { id: 5, name: "Choco-Chip Cookie Box", category: "cookie", price: 6000, rating: 4.9, reviews: 210, badge: "Bestseller", image: img('1499636136210-6f4ee915583e'), desc: "Half-dozen gooey brown butter chocolate chip cookies with Callebaut chunks." },
    { id: 6, name: "Glazed Vanilla Donut", category: "donut", price: 3000, rating: 4.6, reviews: 38, badge: "Fresh", image: img('1551024709-8f23befc6f87'), desc: "Fluffy brioche donut dipped in vanilla bean glaze and festive sprinkles." },
    { id: 7, name: "Iced Hibiscus Rose Tea", category: "drink", price: 3500, rating: 4.9, reviews: 75, badge: "Refreshing", image: img('1556679343-c7306c1976bc'), desc: "Brewed hibiscus infused with organic rose water and fresh lime zest." }
  ];
  products.push(
    { id: 12, name: "Chocolate Fudge Slice", category: "slice", price: 3800, rating: 4.8, reviews: 96, badge: "cake slices", image: img('1578985545062-69928b1d9587'), desc: "Dense chocolate fudge sponge with silky ganache, cut fresh from the show glass." },
    { id: 13, name: "Strawberry Cream Slice", category: "slice", price: 3800, rating: 4.7, reviews: 64, badge: "cake slices", image: img('1464349095431-e9a21285b5f3'), desc: "Light vanilla sponge with strawberry cream and fresh berries." }
  );
  const byId = id => products.find(p => String(p.id) === String(id));

  const PROMOS = { SUGAR20: 0.20, SUGAR10: 0.10 };
  const PROMO_FORMAT = /^SUGAR[0-9]{2}$/;
  const NAME_FORMAT = /^[A-Za-z][A-Za-z\s'.-]{1,49}$/;
  const ADMIN_PASS = 'SUGARADMIN2026';

  const customTemplates = {
    cake: { name: "Artisanal Cake", msg: true, options: [
      { title: "Size & portions", type: "radio", items: [{ label: "6 inch (Serves 4)", price: 15000 }, { label: "8 inch (Serves 8)", price: 22000 }, { label: "10 inch (Serves 15)", price: 30000 }, { label: "12 inch (Serves 25)", price: 40000 }] },
      { title: "Sponge flavor", type: "pill", items: ["Vanilla", "Chocolate", "Red Velvet", "Strawberry", "Lemon", "Carrot"] },
      { title: "Filling", type: "pill", items: ["Vanilla Cream", "Chocolate Ganache", "Strawberry", "Caramel", "Cream Cheese"] },
      { title: "Toppings & decor", type: "check", items: [{ label: "Fresh Strawberries", price: 2000 }, { label: "Macarons", price: 2500 }, { label: "24k Gold Leaf", price: 3000 }] }
    ]},
    cupcake: { name: "Cupcake Box", msg: true, options: [
      { title: "Box quantity", type: "radio", items: [{ label: "Box of 6", price: 8500 }, { label: "Box of 12", price: 16000 }] },
      { title: "Sponge base", type: "pill", items: ["Vanilla Bean", "Rich Chocolate", "Red Velvet", "Matcha"] },
      { title: "Frosting swirl", type: "pill", items: ["Classic Buttercream", "Cream Cheese", "Nutella Ganache"] },
      { title: "Box extras", type: "check", items: [{ label: "Rainbow Sprinkles", price: 1000 }, { label: "Edible Pearls", price: 1500 }] }
    ]},
    donut: { name: "Donut Box", msg: false, options: [
      { title: "Assortment size", type: "radio", items: [{ label: "Box of 4 Ring Donuts", price: 6000 }, { label: "Box of 8 Stuffed Donuts", price: 12000 }] },
      { title: "Dough style", type: "pill", items: ["Fluffy Brioche", "Buttermilk Cake", "Cinnamon Crumb"] },
      { title: "Glaze or filling", type: "pill", items: ["Vanilla Glaze", "Dark Chocolate Mirror", "Salted Caramel Core", "Raspberry Jam Core"] },
      { title: "Crunches", type: "check", items: [{ label: "Toasted Coconut Flakes", price: 1000 }, { label: "Crushed Oreos", price: 1200 }] }
    ]},
    drink: { name: "Craft Beverage", msg: false, options: [
      { title: "Serving size", type: "radio", items: [{ label: "Regular (12oz)", price: 3500 }, { label: "Party Pitcher (Serves 6-8)", price: 18000 }] },
      { title: "Flavor profile", type: "pill", items: ["Iced Hibiscus Rose", "Ginger-Hibiscus Punch", "Vanilla Cold Brew", "Matcha Latte", "Tropical Passionfruit"] },
      { title: "Sweetness", type: "pill", items: ["Normal Sweet", "Extra Ginger Kick", "Less Sugar", "Wild Honey"] },
      { title: "Add-ons", type: "check", items: [{ label: "Oat Milk Crown", price: 800 }, { label: "Mint & Lime Sprig", price: 500 }] }
    ]}
  };

  // ---------- state ----------
  let cart = load('sugar_cart', []);
  let wishlist = load('sugar_wishlist', []);
  let orders = load('sugar_orders', []);
  let theme = localStorage.getItem('sugar_theme') || 'light';
  let activeCategory = 'all';
  let searchQuery = '';
  let promoRate = 0;
  let modalProduct = null, modalQty = 1;
  let cs = { type: 'cake', pick: [0, 0, 0], extras: [] };

  // ---------- toast ----------
  function showToast(msg, type = 'ok') {
    const t = document.createElement('div');
    const bad = type === 'error';
    t.className = `toast-animate ${bad ? 'bg-rose-600' : 'bg-brand'} text-white px-4 py-3 rounded-2xl shadow-xl text-sm font-medium flex items-center gap-2 mb-2`;
    t.innerHTML = `<iconify-icon icon="${bad ? 'lucide:alert-circle' : 'lucide:check-circle'}" class="text-base"></iconify-icon><span>${esc(msg)}</span>`;
    
    // NEW EVENT 9: animationend listener for clean DOM removal
    t.addEventListener('animationend', (e) => {
      if (e.animationName === 'slideIn' && t.dataset.leaving) t.remove();
    });

    $('toast-container').appendChild(t);
    setTimeout(() => {
      t.dataset.leaving = '1';
      t.style.opacity = '0';
      t.style.transform = 'translateY(20px)';
      t.style.transition = 'all 0.25s ease';
      setTimeout(() => t.remove(), 250);
    }, 2800);
  }

  // ---------- navigation ----------
  function switchView(id) {
    document.querySelectorAll('.view-container').forEach(el => el.classList.toggle('active', el.id === id));
    const key = id.replace('view-', '');
    document.querySelectorAll('.nav-item').forEach(a => {
      const on = a.dataset.nav === key;
      a.classList.toggle('text-plum', on);
      a.classList.toggle('font-semibold', on);
      a.classList.toggle('text-stone-400', !on);
    });
    $('views-viewport').scrollTo({ top: 0 });
    if (document.activeElement?.blur) document.activeElement.blur();
  }

  // ---------- products ----------
  function cardHTML(p) {
    const fav = wishlist.includes(p.id);
    return `
    <article data-act="view" data-id="${p.id}" class="product-card flex flex-col bg-card p-2.5 rounded-3xl border border-stone-200 shadow-sm cursor-pointer group">
      <div class="relative aspect-[4/5] rounded-2xl overflow-hidden mb-2.5 bg-stone-50">
        <span class="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 bg-white/85 text-purple text-[10px] font-bold uppercase tracking-wider rounded-md">${esc(p.badge)}</span>
        <button data-act="fav" data-id="${p.id}" aria-pressed="${fav}" aria-label="${fav ? 'Remove' : 'Add'} ${esc(p.name)} ${fav ? 'from' : 'to'} wishlist" class="absolute top-2 right-2 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm ${fav ? 'text-rose-500' : 'text-stone-500'}">
          <iconify-icon icon="${fav ? 'mdi:heart' : 'lucide:heart'}" class="text-lg"></iconify-icon>
        </button>
        <img src="${p.image}" alt="${esc(p.name)}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
      </div>
      <div class="px-1 pb-1 flex flex-col flex-1">
        <div class="flex items-center gap-1 mb-0.5"><iconify-icon icon="material-symbols:star" class="text-amber-500 text-sm"></iconify-icon><span class="text-xs font-semibold text-stone-500">${p.rating} (${p.reviews})</span></div>
        <h4 class="text-sm font-semibold text-plum leading-tight mb-1 line-clamp-2">${esc(p.name)}</h4>
        <div class="flex items-center justify-between mt-auto pt-2">
          <span class="text-sm font-bold text-plum">${fmt(p.price)}</span>
          <button data-act="add" data-id="${p.id}" aria-label="Add ${esc(p.name)} to cart" class="quick-add-btn w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center hover:bg-purple transition-colors shadow"><iconify-icon icon="lucide:plus" class="text-lg"></iconify-icon></button>
        </div>
        ${CUSTOMIZABLE.includes(p.category) ? `<button data-act="custom" data-type="${p.category}" class="mt-2 w-full min-h-[36px] text-xs font-semibold text-purple border border-purple/40 rounded-xl hover:bg-purple hover:text-white transition-colors">✨ Customize</button>` : ''}
      </div>
    </article>`;
  }

  function renderProducts() {
    let list = products.filter(p =>
      (activeCategory === 'all' || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(searchQuery) || p.desc.toLowerCase().includes(searchQuery)));
    const s = $('sort-select').value;
    if (s === 'low-high') list.sort((a, b) => a.price - b.price);
    if (s === 'high-low') list.sort((a, b) => b.price - a.price);
    if (s === 'popular') list.sort((a, b) => b.reviews - a.reviews);

    $('product-count-label').textContent = `${list.length} ${list.length === 1 ? 'item' : 'items'}`;
    $('products-grid').innerHTML = list.length ? list.map(cardHTML).join('') : `
      <div class="col-span-full text-center py-12">
        <p class="text-sm text-stone-500">No treats match your search.</p>
        <button data-act="clear-filters" class="btn-primary mt-3 !w-auto px-5">Clear filters</button>
      </div>`;
    document.querySelectorAll('.category-pill').forEach(b => b.classList.toggle('on', b.dataset.category === activeCategory));
    
    // Attach NEW EVENTS 3 & 6 to rendered product cards
    attachCardEnhancements();
  }

  function clearFilters() {
    activeCategory = 'all'; searchQuery = '';
    $('main-search-input').value = '';$('sort-select').value = 'default';
    renderProducts();
  }

  // ---------- wishlist ----------
  function toggleWishlist(id) {
    id = Number(id);
    const had = wishlist.includes(id);
    wishlist = had ? wishlist.filter(i => i !== id) : [...wishlist, id];
    save('sugar_wishlist', wishlist);
    showToast(had ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    updateBadges(); renderProducts(); renderWishlist(); renderFeatured();
  }

  function renderWishlist() {
    const items = products.filter(p => wishlist.includes(p.id));
    $('wishlist-grid').innerHTML = items.length ? items.map(cardHTML).join('') : `
      <div class="col-span-full text-center py-12">
        <p class="text-sm text-stone-500">Your wishlist is empty. Tap the heart on any treat to save it.</p>
        <button data-nav-go="view-home" class="btn-primary mt-3 !w-auto px-5">Browse menu</button>
      </div>`;
    attachCardEnhancements();
  }

  function renderFeatured() {
    $('featured-grid').innerHTML = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4).map(cardHTML).join('');
    attachCardEnhancements();
  }

  // ---------- NEW EVENTS 3, 6 & 7: Card Hover, Contextmenu & Touch Feedback ----------
  function attachCardEnhancements() {
    document.querySelectorAll('.product-card').forEach(card => {
      // NEW EVENT 6: mouseenter / mouseleave desktop hover elevation
      card.addEventListener('mouseenter', () => card.classList.add('shadow-md', '-translate-y-1'));
      card.addEventListener('mouseleave', () => card.classList.remove('shadow-md', '-translate-y-1'));

      // NEW EVENT 3: contextmenu right-click security on product images
      const imgEl = card.querySelector('img');
      if (imgEl) {
        imgEl.addEventListener('contextmenu', e => e.preventDefault());
      }
    });

    // NEW EVENT 7: touchstart / touchend mobile haptic micro-feedback
    document.querySelectorAll('.quick-add-btn').forEach(btn => {
      btn.addEventListener('touchstart', () => btn.style.transform = 'scale(0.90)', {passive: true});
      btn.addEventListener('touchend', () => btn.style.transform = 'scale(1)', {passive: true});
    });
  }

  // ---------- quick view ----------
  function openModal(p) {
    modalProduct = p; modalQty = 1;
    $('modal-img').src = p.image; $('modal-img').alt = p.name;
    $('modal-category').textContent = p.category;
    $('modal-title').textContent = p.name;
    $('modal-desc').textContent = p.desc;
    updateModalPrice();
    $('modal-custom-wrap').classList.toggle('hidden', !CUSTOMIZABLE.includes(p.category));
    $('quick-view-modal').classList.remove('hidden');$('close-modal-btn').focus();
  }
  function updateModalPrice() {
    $('modal-qty').textContent = modalQty;
    $('modal-price').textContent = fmt(modalProduct.price * modalQty);
  }
  const closeModals = () => document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));

  // ---------- customizer ----------
  const tpl = () => customTemplates[cs.type];
  function resetCustom(type) {
    cs = { type, pick: [0, 0, 0], extras: [] };
    $('custom-msg-input').value = ''; $('msg-count').textContent = '0/40';$('custom-msg-box').classList.toggle('hidden', !customTemplates[type].msg);
    document.querySelectorAll('.treat-type-btn').forEach(b => b.classList.toggle('on', b.dataset.type === type));
    renderCustomizer();
  }

  function customTotal() {
    const t = tpl();
    return t.options[0].items[cs.pick[0]].price + cs.extras.reduce((s, i) => s + t.options[3].items[i].price, 0);
  }

  function renderCustomizer() {
    const t = tpl();
    $('dynamic-options-wrapper').innerHTML = t.options.map((o, g) => {
      let body = '';
      if (o.type === 'radio') {
        body = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${o.items.map((it, i) => `
          <button type="button" data-g="${g}" data-i="${i}" class="chip rect justify-between w-full ${cs.pick[g] === i ? 'on' : ''}"><span>${esc(it.label)}</span><span class="opacity-70">${fmt(it.price)}</span></button>`).join('')}</div>`;
      } else if (o.type === 'pill') {
        body = `<div class="flex flex-wrap gap-2">${o.items.map((it, i) => `
          <button type="button" data-g="${g}" data-i="${i}" class="chip rect ${cs.pick[g] === i ? 'on' : ''}">${esc(it)}</button>`).join('')}</div>`;
      } else {
        body = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${o.items.map((it, i) => `
          <label class="flex items-center gap-2 text-sm font-medium text-plum cursor-pointer min-h-[40px]"><input type="checkbox" data-x="${i}" ${cs.extras.includes(i) ? 'checked' : ''} class="w-4 h-4 accent-purple"><span>${esc(it.label)} (+${fmt(it.price)})</span></label>`).join('')}</div>`;
      }
      return `<div class="panel"><h4 class="panel-title">${esc(o.title)}</h4>${body}</div>`;
    }).join('');
    $('builder-total-price').textContent = fmt(customTotal());
  }

  function addCustomToCart() {
    const t = tpl();
    const msg = $('custom-msg-input').value.trim();
    const details = [
      t.options[0].items[cs.pick[0]].label, t.options[1].items[cs.pick[1]], t.options[2].items[cs.pick[2]],
      ...cs.extras.map(i => t.options[3].items[i].label), msg ? `"${msg}"` : ''
    ].filter(Boolean).join(' | ');
    addToCart({ id: 'custom-' + Date.now(), name: `Custom ${t.name}`, price: customTotal(), qty: 1, image: img('1535141192574-5d4897c825a1'), details });
    resetCustom(cs.type);
    switchView('view-cart');
  }

  // ---------- cart ----------
  function addToCart(item, qty = 1) {
    const ex = cart.find(i => String(i.id) === String(item.id));
    if (ex) ex.qty += qty; else cart.push({ ...item, qty });
    persistCart();
    showToast('Added to basket!');
  }
  function persistCart() { save('sugar_cart', cart); updateBadges(); renderCart(); }

  function totals() {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const zone = ZONES.find(z => z.id === $('checkout-neighborhood').value);
    const delivery = cart.length && !isPickup() && zone ? zone.fee : 0;
    const discount = subtotal * promoRate;
    return { subtotal, delivery, discount, total: subtotal + delivery - discount };
  }

  function renderCart() {
    $('cart-items-container').innerHTML = cart.length ? cart.map(i => `
      <div class="flex gap-3 p-3 bg-card rounded-2xl border border-stone-200 shadow-sm items-center">
        <img src="${i.image}" alt="" loading="lazy" class="w-16 h-16 rounded-xl object-cover shrink-0">
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start gap-2">
            <h3 class="text-sm font-bold text-plum truncate">${esc(i.name)}</h3>
            <button data-act="cart-del" data-id="${esc(i.id)}" aria-label="Remove ${esc(i.name)}" class="text-stone-400 hover:text-rose-500 p-1"><iconify-icon icon="lucide:x" class="text-lg"></iconify-icon></button>
          </div>
          ${i.details ? `<p class="text-xs text-stone-400 truncate">${esc(i.details)}</p>` : ''}
          <div class="flex items-center justify-between mt-1.5 gap-2">
            <span class="text-sm font-bold text-plum">${fmt(i.price * i.qty)}</span>
            <div class="flex items-center gap-2">
              <button data-act="cart-minus" data-id="${esc(i.id)}" aria-label="Decrease quantity" class="qty-btn"><iconify-icon icon="lucide:minus"></iconify-icon></button>
              <span class="text-sm font-bold w-5 text-center">${i.qty}</span>
              <button data-act="cart-plus" data-id="${esc(i.id)}" aria-label="Increase quantity" class="qty-btn"><iconify-icon icon="lucide:plus"></iconify-icon></button>
            </div>
          </div>
        </div>
      </div>`).join('') : `
      <div class="text-center py-10 panel">
        <p class="text-sm text-stone-500">Your basket is empty.</p>
        <button data-nav-go="view-home" class="btn-primary mt-3 !w-auto px-5">Browse menu</button>
      </div>`;

    const t = totals();
    $('summary-subtotal').textContent = fmt(t.subtotal);
    $('summary-delivery').textContent = fmt(t.delivery);$('summary-total').textContent = fmt(t.total);
    const row = $('discount-row');
    row.classList.toggle('hidden', !promoRate);
    row.classList.toggle('flex', !!promoRate);
    $('discount-label').textContent = `Discount (${Math.round(promoRate * 100)}%)`;
    $('summary-discount').textContent = `-${fmt(t.discount)}`;
    updateDateHint();
  }

  // ---------- promo ----------
  function applyPromo() {
    const code = $('promo-code-input').value.trim().toUpperCase();
    const fb = $('promo-feedback');
    fb.classList.remove('hidden');
    if (!PROMO_FORMAT.test(code)) {
      promoRate = 0; fb.textContent = '✕ Format should be SUGAR followed by 2 digits, e.g. SUGAR20.'; fb.className = 'text-xs mt-2 font-semibold text-rose-500';
    } else if (!PROMOS[code]) {
      promoRate = 0; fb.textContent = '✕ That code is not valid.'; fb.className = 'text-xs mt-2 font-semibold text-rose-500';
      showToast('Invalid promo code', 'error');
    } else {
      promoRate = PROMOS[code]; fb.textContent = `✓ ${code} applied — ${Math.round(promoRate * 100)}% off.`; fb.className = 'text-xs mt-2 font-semibold text-emerald-600';
      showToast('🎉 Promo applied!');
    }
    renderCart();
  }

  // ---------- checkout + validation ----------
  const isPickup = () => document.querySelector('input[name="fulfil"]:checked').value === 'pickup';
  const isHeavy = () => cart.some(i => String(i.id).startsWith('custom') || i.qty >= 5);
  const heavyOn = d => orders.filter(o => o.deliveryDate === d && o.isBulkOrCustom).length;
  function updateDateHint() {
    const d = $('checkout-date').value, hint =$('date-hint');
    if (!d || !isHeavy()) { hint.textContent = ''; return; }
    const left = MAX_HEAVY_PER_DAY - heavyOn(d);
    hint.textContent = left > 0 ? `${left} of ${MAX_HEAVY_PER_DAY} custom/bulk slots left on this date.` : '⚠ Fully booked for custom/bulk orders on this date. Please pick another.';
    hint.className = 'text-xs mt-1 ' + (left > 0 ? 'text-stone-500' : 'text-rose-500 font-semibold');
  }
  const todayStr = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };

  function setErr(field, msg) {
    const p = document.querySelector(`.err[data-for="${field}"]`);
    const input = $('checkout-' + field);
    if (p) { p.textContent = msg || ''; p.classList.toggle('hidden', !msg); }
    if (input) input.classList.toggle('invalid', !!msg);
    return !msg;
  }
  function validateField(field) {
    if (field === 'name') {
      const v = $('checkout-name').value.trim();
      return setErr('name', !v ? 'Please enter your name.' : !NAME_FORMAT.test(v) ? 'Use letters, spaces, apostrophes or hyphens only.' : '');
    }
    if (field === 'address') {
      if (isPickup()) return setErr('address', '');
      return setErr('address', $('checkout-address').value.trim().length < 5 ? 'Enter a delivery address.' : '');
    }
    const d = $('checkout-date').value;
    return setErr('date', !d ? 'Choose a date.' : d < todayStr() ? 'Date cannot be in the past.' : '');
  }
  const validateAll = () => ['name', 'address', 'date'].map(validateField).every(Boolean);

  function placeOrder() {
    if (!cart.length) return showToast('Your basket is empty!', 'error');
    if (!validateAll()) return showToast('Please fix the highlighted fields.', 'error');

    const date = $('checkout-date').value;
    const bulk = isHeavy();
    if (bulk && heavyOn(date) >= MAX_HEAVY_PER_DAY)
      return showToast('Our kitchen is fully booked for custom orders on that date. Please pick another day.', 'error');

    const t = totals();
    const orderId = 'SC-2026-' + String(orders.length + 1).padStart(3, '0');
    orders.push({
      orderId, customerName: $('checkout-name').value.trim(),
      address: isPickup() ? 'Store pickup' : $('checkout-address').value.trim(),
      neighborhood: isPickup() ? 'Pickup (free)' : (ZONES.find(z => z.id === $('checkout-neighborhood').value) || {}).label,
      deliveryDate: date, items: cart.map(i => ({ ...i })), total: t.total, fee: t.delivery, isBulkOrCustom: bulk, status: 'New'
    });
    save('sugar_orders', orders);

    $('conf-order-num').textContent = orderId;
    $('conf-order-total').textContent = fmt(t.total);$('conf-order-date').textContent = new Date(date + 'T00:00').toLocaleDateString('en-NG', { dateStyle: 'long' });

    cart = []; promoRate = 0;
    $('promo-code-input').value = '';$('promo-feedback').classList.add('hidden');
    ['name', 'address', 'date'].forEach(f => { $('checkout-' + f).value = ''; setErr(f, ''); });
    persistCart();
    switchView('view-confirmation');
    showToast('🎉 Order placed successfully!');
  }

  // ---------- admin ----------
  function renderAdmin() {
    $('admin-total-orders').textContent = orders.length;
    const days = {};
    orders.filter(o => o.isBulkOrCustom).forEach(o => { days[o.deliveryDate] = (days[o.deliveryDate] || 0) + 1; });
    $('admin-capacity').innerHTML = Object.keys(days).sort().map(d => `<div class="flex justify-between text-sm"><span>${esc(d)}</span><span class="font-semibold ${days[d] >= MAX_HEAVY_PER_DAY ? 'text-rose-500' : 'text-plum'}">${days[d]}/${MAX_HEAVY_PER_DAY} slots${days[d] >= MAX_HEAVY_PER_DAY ? ' · FULL' : ''}</span></div>`).join('') || '<p class="text-sm text-stone-400">No custom or bulk orders booked yet.</p>';
    $('admin-orders-list').innerHTML = orders.length ? orders.slice().reverse().map(o => `
      <div class="panel text-sm space-y-1.5">
        <div class="flex justify-between font-bold text-plum gap-2"><span>${esc(o.orderId)}</span><span class="text-purple">${fmt(o.total)}</span></div>
        <p class="text-stone-600"><strong>Customer:</strong> ${esc(o.customerName)}</p>
        <p class="text-stone-600"><strong>Location:</strong> ${esc(o.address)} (${esc(o.neighborhood)})</p>
        <p class="text-stone-600"><strong>Date:</strong> ${esc(o.deliveryDate)}${o.isBulkOrCustom ? ' <span class="text-purple font-semibold">· Custom/bulk</span>' : ''}</p>
        <select data-status="${esc(o.orderId)}" aria-label="Order status" class="field !min-h-[36px] !py-1">${['New', 'Baking', 'Ready', 'Delivered'].map(s => `<option ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select>
        <ul class="list-disc pl-4 text-stone-600 text-xs pt-1.5 border-t border-stone-200">${o.items.map(i => `<li>${i.qty}× ${esc(i.name)}${i.details ? ' (' + esc(i.details) + ')' : ''}</li>`).join('')}</ul>
      </div>`).join('') : `<p class="text-sm text-stone-400 py-6">No orders recorded yet.</p>`;
  }
  function openAdmin() { switchView('view-admin'); renderAdmin(); }

  // ---------- theme + badges ----------
  function applyTheme() {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    $('theme-toggle-btn').innerHTML = `<iconify-icon icon="lucide:${theme === 'dark' ? 'moon' : 'sun'}"></iconify-icon>`;
  }
  function updateBadges() {
    $('cart-badge').textContent = cart.reduce((s, i) => s + i.qty, 0);$('wishlist-badge').textContent = wishlist.length;
    $('wishlist-badge').classList.toggle('hidden', !wishlist.length);
  }

  // ---------- events ----------
  document.addEventListener('click', e => {
    const goto = e.target.closest('[data-nav-go]');
    if (goto) return switchView(goto.dataset.navGo);
    const cat = e.target.closest('[data-cat-go]');
    if (cat) { activeCategory = cat.dataset.catGo; renderProducts(); return switchView('view-home'); }
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const { act, id } = el.dataset;
    if (act === 'fav') return toggleWishlist(id);
    if (act === 'add') { const p = byId(id); return addToCart({ id: p.id, name: p.name, price: p.price, image: p.image }); }
    if (act === 'view') return openModal(byId(id));
    if (act === 'custom') { resetCustom(el.dataset.type); return switchView('view-builder'); }
    if (act === 'clear-filters') return clearFilters();
    const row = cart.find(i => String(i.id) === String(id));
    if (act === 'cart-del') { cart = cart.filter(i => i !== row); return persistCart(); }
    if (act === 'cart-plus') { row.qty++; return persistCart(); }
    if (act === 'cart-minus') { if (row.qty > 1) row.qty--; else cart = cart.filter(i => i !== row); return persistCart(); }
  });

  document.querySelectorAll('.nav-item').forEach(a => a.addEventListener('click', e => { e.preventDefault(); switchView('view-' + a.dataset.nav); }));
  $('logo-header').addEventListener('click', () => switchView('view-home'));$('nav-cart-btn').addEventListener('click', () => switchView('view-cart'));
  $('nav-wishlist-btn').addEventListener('click', () => switchView('view-wishlist'));$('builder-jump-btn').addEventListener('click', () => switchView('view-builder'));
  $('builder-back-btn').addEventListener('click', () => switchView('view-home'));$('continue-shopping-btn').addEventListener('click', () => switchView('view-home'));

  $('main-search-input').addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase().trim();
    if (!$('view-home').classList.contains('active')) switchView('view-home');
    renderProducts();
  });
  $('sort-select').addEventListener('change', renderProducts);
  document.querySelectorAll('.category-pill').forEach(p => p.addEventListener('click', () => {
    activeCategory = p.dataset.category; renderProducts();
    p.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }));

  // modal
  $('close-modal-btn').addEventListener('click', closeModals);$('modal-custom-btn').addEventListener('click', () => { const type = modalProduct.category; closeModals(); resetCustom(type); switchView('view-builder'); });
  $('quick-view-modal').addEventListener('click', e => { if (e.target.id === 'quick-view-modal') closeModals(); });$('modal-minus').addEventListener('click', () => { if (modalQty > 1) { modalQty--; updateModalPrice(); } });
  $('modal-plus').addEventListener('click', () => { if (modalQty < 20) { modalQty++; updateModalPrice(); } });$('modal-add-btn').addEventListener('click', () => {
    const p = modalProduct;
    addToCart({ id: p.id, name: p.name, price: p.price, image: p.image }, modalQty);
    closeModals();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModals(); });

  // builder
  document.querySelectorAll('.treat-type-btn').forEach(b => b.addEventListener('click', () => resetCustom(b.dataset.type)));
  $('dynamic-options-wrapper').addEventListener('click', e => {
    const b = e.target.closest('[data-g]');
    if (!b) return;
    cs.pick[Number(b.dataset.g)] = Number(b.dataset.i);
    renderCustomizer();
  });
  $('dynamic-options-wrapper').addEventListener('change', e => {
    if (e.target.dataset.x === undefined) return;
    cs.extras = [...document.querySelectorAll('#dynamic-options-wrapper [data-x]:checked')].map(c => Number(c.dataset.x));
    $('builder-total-price').textContent = fmt(customTotal());
  });
  $('custom-msg-input').addEventListener('input', e => {$('msg-count').textContent = `${e.target.value.length}/40`; });
  $('add-custom-treat-btn').addEventListener('click', addCustomToCart);

  // cart + checkout
  $('clear-cart-btn').addEventListener('click', () => { cart = []; persistCart(); showToast('Basket cleared'); });
  $('apply-promo-btn').addEventListener('click', applyPromo);$('promo-code-input').addEventListener('keyup', e => { if (e.key === 'Enter') applyPromo(); });
  
  // NEW EVENT 5: paste auto-formatting for promo code input
  $('promo-code-input').addEventListener('paste', e => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    e.target.value = pasted.trim().toUpperCase();
    showToast('Promo code pasted and formatted!');
  });

  // NEW EVENT 2: focus state helper for promo input
  $('promo-code-input').addEventListener('focus', () => {$('promo-feedback').classList.add('hidden');
  });

  const syncFulfil = () => {
    $('zone-wrap').classList.toggle('hidden', isPickup());$('address-wrap').classList.toggle('hidden', isPickup());
    validateField('address'); renderCart();
  };
  document.querySelectorAll('input[name="fulfil"]').forEach(r => r.addEventListener('change', syncFulfil));
  $('checkout-neighborhood').addEventListener('change', syncFulfil);
  $('checkout-date').addEventListener('change', updateDateHint);$('admin-orders-list').addEventListener('change', e => {
    const id = e.target.dataset.status;
    if (!id) return;
    orders.find(o => o.orderId === id).status = e.target.value;
    save('sugar_orders', orders);
    showToast('Order status updated');
  });
  
  // NEW EVENT 1: blur event validation on checkout fields
  ['name', 'address', 'date'].forEach(f => {
    const input = $('checkout-' + f);
    if (input) {
      input.addEventListener('input', () => validateField(f));
      input.addEventListener('blur', () => validateField(f));
    }
  });

  $('final-checkout-btn').addEventListener('click', placeOrder);

  // NEW EVENT 4: copy tracker on reference number element
  $('conf-order-num').addEventListener('copy', () => {
    showToast('📋 Order reference copied via clipboard event!');
  });

  $('copy-ref-btn').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('conf-order-num').textContent); showToast('Reference copied'); }
    catch { showToast('Unable to copy reference', 'error'); }
  });

  // admin
  $('admin-login-trigger').addEventListener('click', () => {
    if (sessionStorage.getItem('sugar_admin_auth') === 'true') openAdmin();
    else { $('admin-modal').classList.remove('hidden');$('admin-pass-input').focus(); }
  });
  $('close-admin-modal').addEventListener('click', closeModals);$('admin-modal').addEventListener('click', e => { if (e.target.id === 'admin-modal') closeModals(); });
  const adminLogin = () => {
    if ($('admin-pass-input').value.trim() === ADMIN_PASS) {
      sessionStorage.setItem('sugar_admin_auth', 'true');
      $('admin-pass-input').value = ''; closeModals(); openAdmin(); showToast('Owner verified');
    } else showToast('Incorrect passcode', 'error');
  };
  $('submit-admin-login').addEventListener('click', adminLogin);
  $('admin-pass-input').addEventListener('keyup', e => { if (e.key === 'Enter') adminLogin(); });$('admin-logout-btn').addEventListener('click', () => { sessionStorage.removeItem('sugar_admin_auth'); switchView('view-home'); showToast('Admin locked'); });

  // theme
  $('theme-toggle-btn').addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('sugar_theme', theme);
    applyTheme();
    showToast(theme === 'dark' ? '🌙 Dark mode on' : '☀️ Light mode on');
  });

  // ---------- landing page ----------
  let reviews = load('sugar_reviews', [
    { name: 'Amaka O.', stars: 5, text: 'The red velvet cake was amazing. Everyone at the party asked where it was from!' },
    { name: 'Tunde B.', stars: 5, text: 'Custom donut box arrived fresh and right on time in Gwarinpa.' },
    { name: 'Halima S.', stars: 4, text: 'Love the carrot cake slice. Pickup was quick and easy.' }
  ]);
  let reviewStars = 0;

  function renderZones() {
    $('zones-list').innerHTML = `<div class="flex justify-between py-2"><span>Store pickup</span><span class="font-bold text-emerald-600">Free</span></div>` +
      ZONES.map(z => `<div class="flex justify-between py-2"><span>${esc(z.label)}</span><span class="font-bold text-plum">${fmt(z.fee)}</span></div>`).join('');
  }
  function renderReviews() {
    $('reviews-list').innerHTML = reviews.slice(0, 6).map(r => `
      <figure class="panel"><div class="text-amber-500 text-lg" aria-label="${r.stars} out of 5 stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
      <blockquote class="text-sm text-plum my-2">“${esc(r.text)}”</blockquote><figcaption class="text-xs font-semibold text-purple">${esc(r.name)}</figcaption></figure>`).join('');
    document.querySelectorAll('#star-picker button').forEach(b => { b.style.color = Number(b.dataset.star) <= reviewStars ? '#f59e0b' : '#d6d3d1'; });
  }

  $('star-picker').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    reviewStars = Number(b.dataset.star); renderReviews();
  });
  $('review-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('review-name').value.trim(), text =$('review-text').value.trim();
    if (!reviewStars) return showToast('Please pick a star rating.', 'error');
    if (!name || text.length < 5) return showToast('Add your name and a short review.', 'error');
    reviews.unshift({ name, stars: reviewStars, text });
    save('sugar_reviews', reviews);
    e.target.reset(); reviewStars = 0; renderReviews();
    showToast('Thanks for your review! ⭐');
  });
  $('faq-list').addEventListener('click', e => {
    const q = e.target.closest('.faq-q'); if (!q) return;
    const open = q.nextElementSibling.classList.toggle('hidden') === false;
    q.setAttribute('aria-expanded', String(open));
    q.querySelector('iconify-icon').setAttribute('icon', open ? 'lucide:minus' : 'lucide:plus');
  });
  $('newsletter-form').addEventListener('submit', e => {
    e.preventDefault();
    if (!$('newsletter-email').value.trim()) return showToast('Please enter your email.', 'error');
    e.target.reset(); showToast("You're on the list! 🍓");
  });

  // ---------- NEW EVENT 8: online / offline network connection monitor ----------
  window.addEventListener('offline', () => showToast('⚠️ You are offline. Changes are saved locally!', 'error'));
  window.addEventListener('online', () => showToast('✅ Connection restored!', 'ok'));

  // ---------- NEW EVENT 10: visibilitychange tab state saver ----------
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      save('sugar_cart', cart);
      save('sugar_wishlist', wishlist);
    }
  });

  // back-to-top (scroll event)
  $('views-viewport').addEventListener('scroll', () => {
    const show = $('views-viewport').scrollTop > 400;
    $('to-top').classList.toggle('opacity-0', !show);$('to-top').classList.toggle('pointer-events-none', !show);
  });
  $('to-top').addEventListener('click', () =>$('views-viewport').scrollTo({ top: 0, behavior: 'smooth' }));

  // scroll-reveal
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); } }), { root: $('views-viewport'), threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));

  // broken-image safety net
  const fixImg = im => { if (!im.dataset.fb) { im.dataset.fb = '1'; im.src = PLACEHOLDER; } };
  document.addEventListener('error', e => { if (e.target.tagName === 'IMG') fixImg(e.target); }, true);
  window.addEventListener('resize', () => { if (window.innerWidth >= 1024) $('quick-view-modal').classList.add('hidden'); });

  // ---------- init ----------
  $('checkout-neighborhood').innerHTML = ZONES.map(z => `<option value="${z.id}">${z.label} — ${fmt(z.fee)}</option>`).join('');
  document.querySelectorAll('img').forEach(im => { if (im.complete && im.naturalWidth === 0) fixImg(im); });
  renderFeatured(); renderZones(); renderReviews();
  $('checkout-date').min = todayStr();
  applyTheme();
  updateBadges();
  renderProducts();
  renderWishlist();
  renderCart();
  resetCustom('cake');
});