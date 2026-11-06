'use strict';

/* ==========================================================================
   Lunaa Café — app.js
   Vanilla JS: carta dinámica con filtros, carrito para llevar,
   reservas con validación, persistencia en localStorage, a11y.
   ========================================================================== */

/* ----------------------------- Datos ----------------------------- */
const CATEGORIES = [
  { id: 'todos', label: 'Todo' },
  { id: 'desayunos', label: 'Desayunos' },
  { id: 'brunch', label: 'Brunch' },
  { id: 'bebidas', label: 'Cafés y bebidas' },
  { id: 'reposteria', label: 'Repostería' },
];

const DIETS = [
  { id: 'vegetariano', label: 'Vegetariano' },
  { id: 'vegano', label: 'Vegano' },
  { id: 'sin-gluten', label: 'Sin gluten' },
];

const IMG = (id, w = 640) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const MENU = [
  { id: 1, cat: 'desayunos', name: 'Tostada de aguacate y huevo poché', desc: 'Pan de masa madre, aguacate machacado, huevo poché, mezcla de semillas y chimichurri.', price: 3800, diets: ['vegetariano'], badge: 'popular', img: IMG('photo-1541519227354-08fa5d50c44d'), alt: 'Tostada de aguacate con huevo poché y semillas' },
  { id: 2, cat: 'desayunos', name: 'Granola artesana y yogur griego', desc: 'Granola tostada de avena y nueces, yogur griego natural, miel y frutos rojos.', price: 3000, diets: ['vegetariano'], img: IMG('photo-1488477181946-6428a0291777'), alt: 'Vaso de yogur griego con granola y frutos rojos' },
  { id: 3, cat: 'desayunos', name: 'Tostada francesa de brioche', desc: 'Brioche caramelizado, frutos del bosque, crema inglesa y azúcar glas.', price: 4000, diets: ['vegetariano'], badge: 'nuevo', img: IMG('photo-1484723091739-30a097e8f929'), alt: 'Tostada francesa de brioche con frutos del bosque' },
  { id: 4, cat: 'desayunos', name: 'Tostada de tomate y AOVE', desc: 'Pan de masa madre tostado, tomate rallado, aceite de oliva virgen extra y sal en escamas.', price: 2600, diets: ['vegetariano', 'vegano'], img: IMG('photo-1504754524776-8f4f37790ca0'), alt: 'Mesa de desayuno con tostadas' },
  { id: 5, cat: 'desayunos', name: 'Overnight oats y fruta', desc: 'Avena reposada en leche de almendras, chía, yogur y fruta de temporada.', price: 2700, diets: ['vegetariano', 'sin-gluten'], badge: 'nuevo', img: IMG('photo-1490645935967-10de6ba17061'), alt: 'Bol de overnight oats con fruta fresca' },
  { id: 6, cat: 'brunch', name: 'Eggs Benedict de Lunaa', desc: 'Brioche, jamón ibérico, huevo poché y salsa holandesa; patatas hash brown.', price: 4800, diets: [], badge: 'popular', img: IMG('photo-1525351484163-7529414344d8'), alt: 'Eggs Benedict con salsa holandesa' },
  { id: 7, cat: 'brunch', name: 'Tortitas de mascarpone', desc: 'Pancakes esponjosos, mascarpone, arándanos frescos y sirope de arce.', price: 4400, diets: ['vegetariano'], img: IMG('photo-1567620905732-2d1ec7ab7445'), alt: 'Torre de tortitas con arándanos y sirope' },
  { id: 8, cat: 'brunch', name: 'Bowl de quinoa y verdura asada', desc: 'Quinoa, calabaza, brócoli y pimiento asados, tofu marinado y tahini.', price: 4600, diets: ['vegetariano', 'vegano', 'sin-gluten'], img: IMG('photo-1512621776951-a57141f2eefd'), alt: 'Bowl de quinoa, verduras asadas y tofu' },
  { id: 9, cat: 'brunch', name: 'Bowl templado de temporada', desc: 'Halloumi a la plancha, kale, calabacín y pipas; vinagreta de cítricos.', price: 4200, diets: ['vegetariano', 'sin-gluten'], img: IMG('photo-1546069901-ba9599a7e63c'), alt: 'Bowl templado con halloumi y verdura' },
  { id: 10, cat: 'bebidas', name: 'Café de especialidad · Etiopía', desc: 'V60 o espresso; notas de bergamota, melocotón y jazmín.', price: 1000, diets: ['vegetariano', 'vegano', 'sin-gluten'], badge: 'popular', img: IMG('photo-1509042239860-f550ce710b93'), alt: 'Taza de café de especialidad' },
  { id: 11, cat: 'bebidas', name: 'Capuchino de avellana', desc: 'Espresso doble, leche texturizada y crema de avellana del Piamonte.', price: 1400, diets: ['vegetariano', 'sin-gluten'], img: IMG('photo-1541167760496-1628856ab772'), alt: 'Capuchino con arte latte' },
  { id: 12, cat: 'bebidas', name: 'Matcha latte ceremonial', desc: 'Grado ceremonial batido a mano con leche (o bebida vegetal +0,30 €).', price: 1600, diets: ['vegetariano', 'sin-gluten'], badge: 'nuevo', img: IMG('photo-1544787219-7f47ccb76574'), alt: 'Matcha latte ceremonial' },
  { id: 13, cat: 'bebidas', name: 'Filtrado V60 del día', desc: 'Origen rotativo; pregunta al barista. Siempre de especialidad.', price: 1500, diets: ['vegetariano', 'vegano', 'sin-gluten'], img: IMG('photo-1525610553991-2bede1a236e2'), alt: 'Filtrado V60 vertiendo agua sobre el café' },
  { id: 14, cat: 'bebidas', name: 'Flat white', desc: 'Doble ristretto y leche sedosa, 150 ml.', price: 1300, diets: ['vegetariano', 'sin-gluten'], img: IMG('photo-1442512595331-e89e73853f31'), alt: 'Barista preparando un flat white' },
  { id: 15, cat: 'reposteria', name: 'Croissant de mantequilla', desc: 'Hojaldre francés de 72 capas, mantequilla AOP, horneado cada mañana.', price: 1100, diets: ['vegetariano'], badge: 'popular', img: IMG('photo-1555507036-ab1f4038808a'), alt: 'Croissants recién horneados' },
  { id: 16, cat: 'reposteria', name: 'Coulant de chocolate', desc: 'Chocolate 70 %, corazón fundente, helado de vainilla bourbon.', price: 2400, diets: ['vegetariano'], img: IMG('photo-1551024709-8f23befc6f87'), alt: 'Coulant de chocolate con helado' },
  { id: 17, cat: 'reposteria', name: 'Tarta de chocolate', desc: 'Bizcocho húmedo de chocolate, ganache montada y crema inglesa.', price: 2200, diets: ['vegetariano'], img: IMG('photo-1578985545062-69928b1d9587'), alt: 'Tarta de chocolate' },
  { id: 18, cat: 'reposteria', name: 'Banana bread del día', desc: 'Hecho cada mañana, con mantequilla de cacahuete y plátano caramelizado.', price: 1500, diets: ['vegetariano'], img: IMG('photo-1565958011703-44f9829ba187'), alt: 'Porción de banana bread con cacahuete' },
];

const DIET_LABEL = Object.fromEntries(DIETS.map(d => [d.id, d.label]));
const STORAGE = { cart: 'lunaa_cart_v1', reservas: 'lunaa_reservas', theme: 'lunaa_theme' };

/* ----------------------------- Utilidades ----------------------------- */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const formatPrice = cents =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(cents / 100);
const loadJSON = (key, fallback) => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
};
const saveJSON = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* modo privado */ }
};
const escapeHTML = s => String(s).replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isPhoneValid = v => v.replace(/\D/g, '').length >= 9 && /^[+()\-.\s\d]+$/.test(v);
const isEmailValid = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const pad = n => String(n).padStart(2, '0');
const randomCode = prefix =>
  `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString(36).slice(-2).toUpperCase()}`;

const toastEl = qs('#toast');
let toastTimer = null;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
}

/* Trampolín de foco para el drawer del carrito */
function trapFocus(container, event) {
  const focusables = qsa('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', container)
    .filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!focusables.length) return;
  const first = focusables[0], last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

/* ----------------------------- Tema claro/oscuro ----------------------------- */
const themeToggle = qs('#theme-toggle');
const rootEl = document.documentElement;
function applyTheme(theme) {
  rootEl.setAttribute('data-theme', theme);
  const dark = theme === 'dark';
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
}
(function initTheme() {
  const saved = loadJSON(STORAGE.theme, null);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved ?? (prefersDark ? 'dark' : 'light'));
})();
themeToggle.addEventListener('click', () => {
  const next = rootEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  saveJSON(STORAGE.theme, next);
  applyTheme(next);
});

/* ----------------------------- Estado de apertura ----------------------------- */
(function renderOpenStatus() {
  const pill = qs('#open-status');
  const now = new Date();
  const day = now.getDay(); // 0 = domingo
  const minutes = now.getHours() * 60 + now.getMinutes();
  const schedules = { 0: [540, 1050], 2: [510, 1020], 3: [510, 1020], 4: [510, 1020], 5: [510, 1020], 6: [540, 1050] };
  const today = schedules[day];
  if (today && minutes >= today[0] && minutes < today[1]) {
    pill.dataset.state = 'open';
    pill.textContent = `Abierto ahora · hasta las ${pad(Math.floor(today[1] / 60))}:${pad(today[1] % 60)}`;
  } else {
    pill.dataset.state = 'closed';
    pill.textContent = 'Cerrado ahora · abrimos de martes a domingo, 08:30';
  }
})();

/* ----------------------------- Navegación móvil ----------------------------- */
const navToggle = qs('#nav-toggle');
const primaryNav = qs('#nav-primary');
navToggle.addEventListener('click', () => {
  const open = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
});
qsa('#nav-primary a').forEach(link =>
  link.addEventListener('click', () => {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  })
);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.focus();
  }
});

/* ----------------------------- Carta: filtros y render ----------------------------- */
const grid = qs('#menu-grid');
const emptyState = qs('#menu-empty');
const countEl = qs('#menu-count');
const statusEl = qs('#menu-status');
const searchInput = qs('#menu-search');
const clearSearchBtn = qs('#clear-search');
const resetFiltersBtn = qs('#reset-filters');
const emptyResetBtn = qs('#empty-reset');
const categoryChipsWrap = qs('#category-chips');
const dietChipsWrap = qs('#diet-chips');

let activeCategory = 'todos';
let activeDiets = new Set();
let query = '';

function renderChips() {
  categoryChipsWrap.innerHTML = CATEGORIES.map(c => `
    <button type="button" class="chip chip-category" data-category="${c.id}" aria-pressed="${c.id === activeCategory}">${escapeHTML(c.label)}</button>
  `).join('');
  dietChipsWrap.innerHTML = DIETS.map(d => `
    <button type="button" class="chip chip-diet" data-diet="${d.id}" aria-pressed="${activeDiets.has(d.id)}">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>
      ${escapeHTML(d.label)}
    </button>
  `).join('');
}

function getFilteredItems() {
  const q = query.trim().toLowerCase();
  return MENU.filter(item => {
    if (activeCategory !== 'todos' && item.cat !== activeCategory) return false;
    for (const diet of activeDiets) if (!item.diets.includes(diet)) return false;
    if (q) {
      const haystack = `${item.name} ${item.desc}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function cardHTML(item) {
  const badge = item.badge
    ? `<span class="dish-badge ${item.badge === 'nuevo' ? 'badge-nuevo' : ''}">${item.badge === 'nuevo' ? 'Nuevo' : 'Popular'}</span>`
    : '';
  const tags = item.diets.map(d => `<li class="dish-tag">${escapeHTML(DIET_LABEL[d])}</li>`).join('');
  return `
    <article class="dish-card">
      <div class="dish-media">
        <img src="${item.img}" alt="${escapeHTML(item.alt)}" width="640" height="420" loading="lazy" decoding="async"
             onerror="this.onerror=null;this.src='assets/placeholder.svg'">
        ${badge}
      </div>
      <div class="dish-body">
        <h3 class="dish-name">${escapeHTML(item.name)}</h3>
        <p class="dish-desc">${escapeHTML(item.desc)}</p>
        ${tags ? `<ul class="dish-tags" aria-label="Preferencias">${tags}</ul>` : ''}
        <div class="dish-foot">
          <span class="dish-price">${formatPrice(item.price)}</span>
          <button type="button" class="add-btn" data-add="${item.id}" aria-label="Añadir ${escapeHTML(item.name)} al pedido, ${formatPrice(item.price)}">
            Añadir
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>
    </article>`;
}

function hasActiveFilters() {
  return activeCategory !== 'todos' || activeDiets.size > 0 || query.trim() !== '';
}

function renderMenu() {
  const items = getFilteredItems();
  grid.innerHTML = items.map(cardHTML).join('');
  const n = items.length;
  countEl.textContent = n === 1 ? '1 plato' : `${n} platos`;
  statusEl.textContent = n === 0 ? 'Sin resultados para los filtros actuales.' : `${n} ${n === 1 ? 'plato encontrado' : 'platos encontrados'}.`;
  emptyState.hidden = n !== 0;
  resetFiltersBtn.hidden = !hasActiveFilters();
  clearSearchBtn.hidden = query.trim() === '';
}

function resetFilters() {
  activeCategory = 'todos';
  activeDiets = new Set();
  query = '';
  searchInput.value = '';
  renderChips();
  renderMenu();
}

renderChips();
renderMenu();

searchInput.addEventListener('input', e => { query = e.target.value; renderMenu(); });
clearSearchBtn.addEventListener('click', () => { query = ''; searchInput.value = ''; renderMenu(); searchInput.focus(); });
resetFiltersBtn.addEventListener('click', resetFilters);
emptyResetBtn.addEventListener('click', resetFilters);

categoryChipsWrap.addEventListener('click', e => {
  const btn = e.target.closest('[data-category]');
  if (!btn) return;
  activeCategory = btn.dataset.category;
  renderChips(); renderMenu();
});
dietChipsWrap.addEventListener('click', e => {
  const btn = e.target.closest('[data-diet]');
  if (!btn) return;
  const diet = btn.dataset.diet;
  activeDiets.has(diet) ? activeDiets.delete(diet) : activeDiets.add(diet);
  renderChips(); renderMenu();
});

/* ----------------------------- Carrito ----------------------------- */
const cartDrawer = qs('#cart-drawer');
const overlay = qs('#overlay');
const cartOpenBtn = qs('#cart-open');
const cartCloseBtn = qs('#cart-close');
const cartItemsList = qs('#cart-items');
const cartEmpty = qs('#cart-empty');
const cartFoot = qs('#cart-foot');
const cartCountEl = qs('#cart-count');
const cartSubtotalEl = qs('#cart-subtotal');
const cartTotalEl = qs('#cart-total');
const cartEtaEl = qs('#cart-eta');

/** @type {Map<number, number>} */
let cart = new Map();

function loadCart() {
  const saved = loadJSON(STORAGE.cart, []);
  if (Array.isArray(saved)) {
    cart = new Map(saved
      .filter(e => e && Number.isInteger(e.id) && MENU.some(m => m.id === e.id))
      .map(e => [e.id, Math.max(1, Math.min(20, e.qty | 0 || 1))]));
  }
}
const persistCart = () => saveJSON(STORAGE.cart, [...cart].map(([id, qty]) => ({ id, qty })));
const cartEntries = () => [...cart].map(([id, qty]) => ({ item: MENU.find(m => m.id === id), qty }));
const cartTotalCents = () => cartEntries().reduce((sum, { item, qty }) => sum + item.price * qty, 0);
const cartCount = () => [...cart.values()].reduce((a, b) => a + b, 0);

function renderCart() {
  const entries = cartEntries();
  const count = cartCount();
  cartCountEl.textContent = String(count);
  cartOpenBtn.setAttribute('aria-label', `Abrir pedido para llevar, ${count} ${count === 1 ? 'artículo' : 'artículos'}`);

  cartItemsList.innerHTML = entries.map(({ item, qty }) => `
    <li class="cart-item" data-id="${item.id}">
      <div>
        <div class="cart-item-name">${escapeHTML(item.name)}</div>
        <div class="cart-item-price">${formatPrice(item.price)} / ud.</div>
      </div>
      <div class="cart-item-linetotal">${formatPrice(item.price * qty)}</div>
      <div class="cart-item-controls">
        <button type="button" class="qty-btn" data-dec="${item.id}" aria-label="Quitar una unidad de ${escapeHTML(item.name)}">−</button>
        <span class="qty-value" aria-label="Cantidad: ${qty}">${qty}</span>
        <button type="button" class="qty-btn" data-inc="${item.id}" aria-label="Añadir una unidad de ${escapeHTML(item.name)}">+</button>
        <button type="button" class="remove-btn" data-remove="${item.id}">Eliminar</button>
      </div>
    </li>`).join('');

  const isEmpty = entries.length === 0;
  cartEmpty.hidden = !isEmpty;
  cartFoot.hidden = isEmpty;
  cartSubtotalEl.textContent = formatPrice(cartTotalCents());
  cartTotalEl.textContent = formatPrice(cartTotalCents());
  const eta = new Date(Date.now() + 20 * 60 * 1000);
  cartEtaEl.textContent = `${pad(eta.getHours())}:${pad(eta.getMinutes())} (+20 min)`;
}

function addToCart(id) {
  const item = MENU.find(m => m.id === id);
  if (!item) return;
  cart.set(id, (cart.get(id) ?? 0) + 1);
  persistCart(); renderCart();
  showToast(`${item.name} añadido al pedido`);
}
function changeQty(id, delta) {
  const next = (cart.get(id) ?? 0) + delta;
  if (next <= 0) cart.delete(id); else cart.set(id, Math.min(20, next));
  persistCart(); renderCart();
}

grid.addEventListener('click', e => {
  const btn = e.target.closest('[data-add]');
  if (btn) addToCart(Number(btn.dataset.add));
});
cartItemsList.addEventListener('click', e => {
  const inc = e.target.closest('[data-inc]');
  const dec = e.target.closest('[data-dec]');
  const rem = e.target.closest('[data-remove]');
  if (inc) changeQty(Number(inc.dataset.inc), +1);
  else if (dec) changeQty(Number(dec.dataset.dec), -1);
  else if (rem) { cart.delete(Number(rem.dataset.remove)); persistCart(); renderCart(); }
});

/* Abrir/cerrar drawer con gestión de foco */
let lastFocusedBeforeCart = null;
function openCart() {
  lastFocusedBeforeCart = document.activeElement;
  overlay.hidden = false;
  requestAnimationFrame(() => {
    overlay.classList.add('is-open');
    cartDrawer.hidden = false;
    requestAnimationFrame(() => cartDrawer.classList.add('is-open'));
  });
  document.body.style.overflow = 'hidden';
  cartCloseBtn.focus();
}
function closeCart() {
  overlay.classList.remove('is-open');
  cartDrawer.classList.remove('is-open');
  document.body.style.overflow = '';
  const done = () => { overlay.hidden = true; cartDrawer.hidden = true; cartDrawer.removeEventListener('transitionend', done); };
  cartDrawer.addEventListener('transitionend', done, { once: true });
  setTimeout(done, 400); // respaldo si no hay transición
  if (lastFocusedBeforeCart) lastFocusedBeforeCart.focus();
}
cartOpenBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
cartDrawer.addEventListener('keydown', e => { if (e.key === 'Tab') trapFocus(cartDrawer, e); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !cartDrawer.hidden) closeCart();
});
qs('#cart-empty-cta').addEventListener('click', () => {
  closeCart();
  qs('#carta').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
qs('#takeaway-cta').addEventListener('click', openCart);

/* ----------------------------- Pedido para llevar (diálogo) ----------------------------- */
const orderDialog = qs('#order-dialog');
const orderForm = qs('#order-form');
const orderErrors = qs('#order-errors');
const orderSuccess = qs('#order-success');
const orderPickup = qs('#order-pickup');
const orderSummaryList = qs('#order-summary-list');
const orderSummaryTotal = qs('#order-summary-total');
const orderCodeEl = qs('#order-code');
const orderEtaText = qs('#order-eta-text');
let lastOrder = null;

(function fillPickupOptions() {
  const frag = document.createDocumentFragment();
  for (let h = 9; h < 17; h++) {
    for (const m of [0, 15, 30, 45]) {
      if (h === 16 && m > 45) break;
      const opt = document.createElement('option');
      opt.value = `${pad(h)}:${pad(m)}`;
      opt.textContent = `${pad(h)}:${pad(m)}`;
      frag.appendChild(opt);
    }
  }
  const now = new Date();
  const rounded = new Date(now.getTime() + 25 * 60 * 1000);
  rounded.setMinutes(Math.ceil(rounded.getMinutes() / 15) * 15, 0, 0);
  const suggested = `${pad(rounded.getHours())}:${pad(rounded.getMinutes())}`;
  orderPickup.appendChild(frag);
  if (orderPickup.querySelector(`option[value="${suggested}"]`)) orderPickup.value = suggested;
})();

function renderOrderSummary() {
  orderSummaryList.innerHTML = cartEntries()
    .map(({ item, qty }) => `<li><span>${qty} × ${escapeHTML(item.name)}</span><span>${formatPrice(item.price * qty)}</span></li>`)
    .join('');
  orderSummaryTotal.textContent = formatPrice(cartTotalCents());
}

function openOrderDialog() {
  if (cart.size === 0) { showToast('Tu pedido está vacío; añade algo de la carta primero.'); return; }
  closeCart();
  renderOrderSummary();
  orderForm.hidden = false;
  orderSuccess.hidden = true;
  orderErrors.hidden = true;
  orderDialog.showModal();
  qs('#order-name').focus();
}
function closeOrderDialog() { orderDialog.close(); }

qs('#checkout-open').addEventListener('click', openOrderDialog);
qs('#order-close').addEventListener('click', closeOrderDialog);
orderDialog.addEventListener('click', e => { if (e.target === orderDialog) closeOrderDialog(); });

function showOrderErrors(errors) {
  const list = qs('ul', orderErrors);
  list.innerHTML = errors
    .map(({ id, msg }) => `<li><a href="#${id}">${escapeHTML(msg)}</a></li>`).join('');
  orderErrors.hidden = false;
  orderErrors.focus();
}
function clearOrderFieldError(input, errorEl) {
  input.removeAttribute('aria-invalid');
  errorEl.hidden = true; errorEl.textContent = '';
}
function setOrderFieldError(input, errorEl, msg) {
  input.setAttribute('aria-invalid', 'true');
  errorEl.textContent = msg; errorEl.hidden = false;
}

orderForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = qs('#order-name'), phone = qs('#order-phone');
  const nameErr = qs('#order-name-err'), phoneErr = qs('#order-phone-err');
  clearOrderFieldError(name, nameErr); clearOrderFieldError(phone, phoneErr);

  const errors = [];
  if (name.value.trim().length < 2) {
    setOrderFieldError(name, nameErr, 'Escribe al menos 2 caracteres.');
    errors.push({ id: 'order-name', msg: 'Nombre obligatorio' });
  }
  if (!isPhoneValid(phone.value.trim())) {
    setOrderFieldError(phone, phoneErr, 'Teléfono no válido (mínimo 9 dígitos).');
    errors.push({ id: 'order-phone', msg: 'Teléfono no válido' });
  }
  if (errors.length) { showOrderErrors(errors); return; }

  const code = randomCode('M');
  lastOrder = {
    code,
    name: name.value.trim(),
    phone: phone.value.trim(),
    pickup: orderPickup.value,
    payment: qs('input[name="payment"]:checked').value,
    notes: qs('#order-notes').value.trim(),
    items: cartEntries().map(({ item, qty }) => ({ name: item.name, qty, line: item.price * qty })),
    total: cartTotalCents(),
    createdAt: new Date().toISOString(),
  };

  orderCodeEl.textContent = code;
  orderEtaText.textContent = `Recoge a partir de las ${lastOrder.pickup}; te avisaremos por SMS cuando esté listo.`;
  orderForm.hidden = true;
  orderSuccess.hidden = false;
  orderSuccess.focus();

  cart.clear(); persistCart(); renderCart();
});

qs('#order-done').addEventListener('click', () => {
  closeOrderDialog();
  orderForm.reset();
});

qs('#download-ticket').addEventListener('click', () => {
  if (!lastOrder) return;
  const lines = [
    'CAFÉ LUNAA',
    'Calle de la Palma 42, Madrid · 910 123 456',
    '────────────────────────────────',
    `Ticket ${lastOrder.code} · ${new Date(lastOrder.createdAt).toLocaleString('es-ES')}`,
    `Cliente: ${lastOrder.name} · ${lastOrder.phone}`,
    `Recogida: ${lastOrder.pickup} · Pago: ${lastOrder.payment === 'al-recoger' ? 'al recoger' : 'enlace de pago'}`,
    '────────────────────────────────',
    ...lastOrder.items.map(i => `${i.qty} x ${i.name} — ${formatPrice(i.line)}`),
    '────────────────────────────────',
    `TOTAL: ${formatPrice(lastOrder.total)}`,
    lastOrder.notes ? `Notas: ${lastOrder.notes}` : '',
    '¡Gracias por elegirnos!',
  ].filter(Boolean).join('\n');
  downloadBlob(lines, `ticket-${lastOrder.code}.txt`, 'text/plain;charset=utf-8');
});

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/* ----------------------------- Reservas ----------------------------- */
const resForm = qs('#reservation-form');
const resErrors = qs('#reservation-errors');
const resConfirmation = qs('#reservation-confirmation');
const resDate = qs('#res-date');
const resTime = qs('#res-time');
const resParty = qs('#res-party');
const resNotes = qs('#res-notes');
const resNotesCount = qs('#res-notes-count');
const misReservas = qs('#mis-reservas');
let lastReservation = null;

(function fillReservationControls() {
  const timeFrag = document.createDocumentFragment();
  for (let h = 8; h < 17; h++) {
    for (const m of [0, 30]) {
      const opt = document.createElement('option');
      opt.value = `${pad(h)}:${pad(m)}`;
      opt.textContent = `${pad(h)}:${pad(m)}`;
      timeFrag.appendChild(opt);
    }
  }
  resTime.appendChild(timeFrag);
  resTime.value = '10:00';

  const partyFrag = document.createDocumentFragment();
  for (let i = 1; i <= 8; i++) {
    const opt = document.createElement('option');
    opt.value = String(i); opt.textContent = i === 1 ? '1 persona' : `${i} personas`;
    if (i === 2) opt.selected = true;
    partyFrag.appendChild(opt);
  }
  const big = document.createElement('option');
  big.value = '9+'; big.textContent = 'Más de 8 (grupo)';
  partyFrag.appendChild(big);
  resParty.appendChild(partyFrag);

  const today = new Date();
  const max = new Date(); max.setMonth(max.getMonth() + 2);
  resDate.min = today.toISOString().slice(0, 10);
  resDate.max = max.toISOString().slice(0, 10);
})();

resNotes.addEventListener('input', () => {
  resNotesCount.textContent = `${resNotes.value.length} / 240`;
});

function setFieldError(input, errorId, msg) {
  const errorEl = qs(`#${errorId}`);
  input.setAttribute('aria-invalid', 'true');
  errorEl.textContent = msg; errorEl.hidden = false;
}
function clearFieldError(input, errorId) {
  const errorEl = qs(`#${errorId}`);
  input.removeAttribute('aria-invalid');
  errorEl.hidden = true; errorEl.textContent = '';
}
function showReservationErrors(errors) {
  const list = qs('ul', resErrors);
  list.innerHTML = errors.map(({ id, msg }) => `<li><a href="#${id}">${escapeHTML(msg)}</a></li>`).join('');
  resErrors.hidden = false;
  resErrors.focus();
}

function getReservations() { return loadJSON(STORAGE.reservas, []); }
function saveReservations(list) { saveJSON(STORAGE.reservas, list); }

function formatReservationDate(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function renderMyReservations() {
  const list = getReservations()
    .filter(r => new Date(`${r.date}T23:59:59`) >= new Date())
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, 3);
  if (!list.length) { misReservas.innerHTML = ''; return; }
  misReservas.innerHTML = `
    <h3>Tus próximas reservas</h3>
    ${list.map(r => `
      <div class="reserva-item">
        <span><strong>${escapeHTML(formatReservationDate(r.date))}</strong> · ${escapeHTML(r.time)} · ${escapeHTML(String(r.party))} ${r.party === '1' || r.party === 1 ? 'persona' : 'personas'}<br><small>${escapeHTML(r.code)}</small></span>
        <button type="button" class="reserva-cancel" data-cancel="${escapeHTML(r.code)}" aria-label="Cancelar la reserva del ${escapeHTML(formatReservationDate(r.date))} a las ${escapeHTML(r.time)}">Cancelar</button>
      </div>`).join('')}`;
}

misReservas.addEventListener('click', e => {
  const btn = e.target.closest('[data-cancel]');
  if (!btn) return;
  const list = getReservations().filter(r => r.code !== btn.dataset.cancel);
  saveReservations(list);
  renderMyReservations();
  showToast('Reserva cancelada. Esperamos verte pronto.');
});

resForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = qs('#res-name'), phone = qs('#res-phone'), email = qs('#res-email');
  const privacy = qs('#res-privacy');
  [ [name, 'res-name-err'], [phone, 'res-phone-err'], [email, 'res-email-err'], [resDate, 'res-date-err'], [resTime, 'res-time-err'], [privacy, 'res-privacy-err'] ]
    .forEach(([el, id]) => clearFieldError(el, id));

  const errors = [];
  if (name.value.trim().length < 2) { setFieldError(name, 'res-name-err', 'Escribe al menos 2 caracteres.'); errors.push({ id: 'res-name', msg: 'Nombre obligatorio' }); }
  if (!isPhoneValid(phone.value.trim())) { setFieldError(phone, 'res-phone-err', 'Teléfono no válido (mínimo 9 dígitos).'); errors.push({ id: 'res-phone', msg: 'Teléfono no válido' }); }
  if (!isEmailValid(email.value.trim())) { setFieldError(email, 'res-email-err', 'Revisa el formato del correo.'); errors.push({ id: 'res-email', msg: 'Email no válido' }); }
  if (!resDate.value) { setFieldError(resDate, 'res-date-err', 'Elige una fecha.'); errors.push({ id: 'res-date', msg: 'Fecha obligatoria' }); }
  else {
    const chosen = new Date(`${resDate.value}T00:00:00`);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (chosen < today) { setFieldError(resDate, 'res-date-err', 'La fecha no puede ser anterior a hoy.'); errors.push({ id: 'res-date', msg: 'Fecha en el pasado' }); }
  }
  if (!resTime.value) { setFieldError(resTime, 'res-time-err', 'Elige una hora.'); errors.push({ id: 'res-time', msg: 'Hora obligatoria' }); }
  if (!privacy.checked) { setFieldError(privacy, 'res-privacy-err', 'Debes aceptar la política de privacidad.'); errors.push({ id: 'res-privacy', msg: 'Aceptación obligatoria' }); }

  if (errors.length) { showReservationErrors(errors); return; }
  resErrors.hidden = true;

  lastReservation = {
    code: randomCode('RSV'),
    name: name.value.trim(),
    phone: phone.value.trim(),
    email: email.value.trim(),
    date: resDate.value,
    time: resTime.value,
    party: resParty.value,
    zone: qs('#res-zone').value,
    occasion: qs('#res-occasion').value,
    notes: resNotes.value.trim(),
    createdAt: new Date().toISOString(),
  };

  const list = getReservations();
  list.push(lastReservation);
  saveReservations(list);

  qs('#confirmation-code').textContent = lastReservation.code;
  qs('#confirmation-details').innerHTML = `
    <div><dt>Fecha</dt><dd>${escapeHTML(formatReservationDate(lastReservation.date))}</dd></div>
    <div><dt>Hora</dt><dd>${escapeHTML(lastReservation.time)}</dd></div>
    <div><dt>Comensales</dt><dd>${escapeHTML(String(lastReservation.party))}</dd></div>
    <div><dt>Zona</dt><dd>${escapeHTML(lastReservation.zone)}</dd></div>`;

  resForm.hidden = true;
  resConfirmation.hidden = false;
  resConfirmation.focus();
  renderMyReservations();
  showToast('Reserva confirmada. Revisa tu correo.');
});

qs('#new-reservation').addEventListener('click', () => {
  resForm.reset();
  resNotesCount.textContent = '0 / 240';
  resConfirmation.hidden = true;
  resForm.hidden = false;
  qs('#res-name').focus();
});

qs('#download-ics').addEventListener('click', () => {
  if (!lastReservation) return;
  const r = lastReservation;
  const [y, m, d] = r.date.split('-').map(Number);
  const [hh, mm] = r.time.split(':').map(Number);
  const start = new Date(y, m - 1, d, hh, mm);
  const end = new Date(start.getTime() + 90 * 60 * 1000);
  const fmt = dt => `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Lunaa Cafe//Reserva//ES',
    'BEGIN:VEVENT',
    `UID:${r.code}@lunacafe.es`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    'SUMMARY:Reserva en Lunaa Café',
    'LOCATION:Calle de la Palma 42\\, 28004 Madrid',
    `DESCRIPTION:Código ${r.code} · ${r.party} comensales · ${r.zone}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  downloadBlob(ics, `reserva-${r.code}.ics`, 'text/calendar;charset=utf-8');
});

renderMyReservations();

/* ----------------------------- Newsletter ----------------------------- */
const newsletterForm = qs('#newsletter-form');
const newsletterEmail = qs('#newsletter-email');
const newsletterFeedback = qs('#newsletter-feedback');
newsletterForm.addEventListener('submit', e => {
  e.preventDefault();
  const value = newsletterEmail.value.trim();
  if (!isEmailValid(value)) {
    newsletterFeedback.textContent = 'Revisa el formato del correo.';
    newsletterFeedback.classList.add('error');
    newsletterEmail.focus();
    return;
  }
  newsletterFeedback.classList.remove('error');
  newsletterFeedback.textContent = '¡Bienvenido a la mesa de los lectores! Revisa tu bandeja de entrada.';
  try { localStorage.setItem('lunaa_newsletter', value); } catch { /* modo privado */ }
  newsletterForm.querySelector('button[type="submit"]').disabled = true;
  newsletterEmail.disabled = true;
});

/* ----------------------------- Diálogos legales ----------------------------- */
qsa('[data-open-dialog]').forEach(btn => {
  btn.addEventListener('click', () => { const dlg = qs(`#${btn.dataset.openDialog}`); if (dlg) dlg.showModal(); });
});
qsa('[data-close-dialog]').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('dialog')?.close());
});
qsa('dialog.modal').forEach(dlg => {
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
});

/* ----------------------------- Pie ----------------------------- */
qs('#footer-year').textContent = String(new Date().getFullYear());

/* ----------------------------- Init carrito ----------------------------- */
loadCart();
renderCart();
