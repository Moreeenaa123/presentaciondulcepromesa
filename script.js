/* =========================================================
   DULCE PROMESA — SCRIPT PRINCIPAL
   0 Bienvenida · 1 Navbar y progreso · 2 Animaciones y contadores
   3 Imágenes de respaldo · Inicio (versículos, quiz, parallax)
   4 Historia (video) · 5 Carta (catálogo, carrusel, pedidos) · 6 Taller
   7 Encuesta y gráficos · 8 Cuentas · 9 Redes · 10 Plan (Gantt, Canvas)
   11 Contacto · 12 Efectos globales · 13 Arranque
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => '$' + Number(n).toLocaleString('es-AR');
/* Número de WhatsApp: código de país + 9 + área + número, sin "+" ni espacios */
const WA = '5491127147436';
const waLink = txt => `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;
/* Preferencia de movimiento reducido del sistema */
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Qué bloques con gráficos/animación ya entraron en pantalla (se dibujan recién ahí, para que se vea la animación) */
const seen = { q: false, cmp: false, fin: false, gantt: false };
const hasChart = typeof Chart !== 'undefined';
if (hasChart) { Chart.defaults.animation = { duration: 1300, easing: 'easeOutQuart' }; Chart.defaults.font.family = "'Nunito', sans-serif"; Chart.defaults.color = '#7c655d'; }

/* ---------- 1. NAVBAR Y PROGRESO ---------- */
const navbar = $('#navbar'), navLinks = $('#navLinks'), navToggle = $('#navToggle');
const waFloat = $('#waFloat');
addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', scrollY > 20);
  waFloat.classList.toggle('show', scrollY > 520);
  const h = document.documentElement; $('#progress').style.width = (scrollY / (h.scrollHeight - innerHeight) * 100) + '%';
}, { passive: true });
/* Menú móvil: se abre/cierra con transición (clase .open); se cierra al elegir un enlace, con Escape o al tocar fuera */
const setMenu = open => { navLinks.classList.toggle('open', open); navToggle.setAttribute('aria-expanded', open); navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); };
navToggle.onclick = () => setMenu(!navLinks.classList.contains('open'));
$$('a', navLinks).forEach((a, i) => { a.style.setProperty('--i', i); a.onclick = () => setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
document.addEventListener('click', e => { if (!navbar.contains(e.target)) setMenu(false); });
const navObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) $$('a', navLinks).forEach(a => { const on = a.getAttribute('href') === '#' + e.target.id; a.classList.toggle('on', on); on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'); });
}), { rootMargin: '-45% 0px -50% 0px' });
$$('section[id]').forEach(s => navObs.observe(s));

/* ---------- 2. ANIMACIONES AL HACER SCROLL ---------- */
const animObs = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target; el.classList.add('is-visible'); animObs.unobserve(el);
  if (el.matches('[data-count]')) countUp(el);
  $$('[data-count]', el).forEach(countUp);
  /* libera el hover una vez terminada la entrada */
  setTimeout(() => { el.removeAttribute('data-anim'); el.removeAttribute('data-delay'); el.style.transitionDelay = ''; }, 1900);
}), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
/* Cada elemento con data-anim entra al verse; data-delay="n" lo retrasa n × 0,12 s respecto de sus vecinos */
const watch = () => $$('[data-anim]:not([data-w])').forEach(el => {
  el.dataset.w = 1; if (el.dataset.delay) el.style.transitionDelay = (el.dataset.delay * .12) + 's'; animObs.observe(el); });
/* Los números cuentan desde cero hasta su valor (con desaceleración suave) */
function countUp(el) {
  if (el.dataset.done) return; el.dataset.done = 1;
  const end = +el.dataset.count, t0 = performance.now();
  if (REDUCED) { el.textContent = end.toLocaleString('es-AR'); return; }
  (function step(t) { const p = Math.min((t - t0) / 1400, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('es-AR'); if (p < 1) requestAnimationFrame(step); })(t0);
}
/* Gráficos, barras y catálogo: se activan cuando su bloque entra en pantalla */
const viewObs = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; viewObs.unobserve(e.target);
  const k = e.target.dataset.view; if (k === 'catalog') { e.target.classList.add('seen'); return; }
  seen[k] = true; ({ q: () => drawQ(), cmp: () => drawCmp(), fin: () => finCharts(), gantt: () => gantt(curG) })[k]();
}), { threshold: 0, rootMargin: '0px 0px -12% 0px' });
const watchView = (el, k) => { if (!el) return; el.dataset.view = k; viewObs.observe(el); };

/* ---------- 3. IMÁGENES DE RESPALDO ---------- */
/* Si falta un archivo en ./img/, se muestra un fondo pastel con el nombre esperado */
function guardImages(root = document) {
  $$('.ph img', root).forEach(img => {
    const fail = () => img.closest('.ph').classList.add('noimg');
    img.addEventListener('error', fail);
    if (img.complete && !img.naturalWidth) fail();
  });
}


/* ---------- INICIO: versículo para tu corazón, quiz y parallax ---------- */
/* Versículos en la versión Reina-Valera 1909 (misma traducción en toda la sección) */
const VERSES = [
  { l: 'Jeremías', c: 29, v: '11', t: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.' },
  { l: 'Filipenses', c: 4, v: '13', t: 'Todo lo puedo en Cristo que me fortalece.' },
  { l: 'Salmos', c: 23, v: '1', t: 'Jehová es mi pastor; nada me faltará.' },
  { l: 'Proverbios', c: 3, v: '5-6', t: 'Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.' },
  { l: 'Isaías', c: 41, v: '10', t: 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo: siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.' },
  { l: 'Mateo', c: 11, v: '28', t: 'Venid á mí todos los que estáis trabajados y cargados, que yo os haré descansar.' },
  { l: 'Salmos', c: 46, v: '1', t: 'Dios es nuestro amparo y fortaleza, pronto auxilio en las tribulaciones.' },
  { l: 'Romanos', c: 8, v: '28', t: 'Y sabemos que á los que aman á Dios, todas las cosas les ayudan á bien, es á saber, á los que conforme al propósito son llamados.' },
  { l: '1 Corintios', c: 13, v: '4', t: 'La caridad es sufrida, es benigna; la caridad no tiene envidia, la caridad no hace sinrazón, no se ensancha;' },
  { l: 'Salmos', c: 34, v: '8', t: 'Gustad, y ved que es bueno Jehová: dichoso el hombre que confiará en él.' },
  { l: 'Juan', c: 14, v: '27', t: 'La paz os dejo, mi paz os doy: yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.' },
  { l: 'Josué', c: 1, v: '9', t: 'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios será contigo en donde quiera que fueres.' },
  { l: 'Salmos', c: 118, v: '1', t: 'Alabad á Jehová, porque es bueno; porque para siempre es su misericordia.' },
  { l: '1 Tesalonicenses', c: 5, v: '18', t: 'Dad gracias en todo; porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.' },
  { l: 'Romanos', c: 15, v: '13', t: 'Y el Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza por la virtud del Espíritu Santo.' },
  { l: 'Isaías', c: 40, v: '31', t: 'Mas los que esperan á Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.' },
  { l: 'Filipenses', c: 4, v: '7', t: 'Y la paz de Dios, que sobrepuja todo entendimiento, guardará vuestros corazones y vuestros entendimientos en Cristo Jesús.' },
  { l: '1 Juan', c: 4, v: '19', t: 'Nosotros le amamos á él, porque él nos amó primero.' },
  { l: 'Josué', c: 24, v: '15', t: 'Pero yo y mi casa serviremos á Jehová.' },
  { l: 'Salmos', c: 127, v: '3', t: 'He aquí, heredad de Jehová son los hijos; cosa de estima el fruto del vientre.' }
];
let pi = -1, verseTimer;
/* Dibuja el versículo: las palabras aparecen una a una y la referencia llega al final */
function renderVerse(n) {
  const v = VERSES[n], box = $('#promise'), words = v.t.split(' ');
  $('#promiseText').innerHTML = '“' + words.map((w, i) => `<span class="w" style="--d:${i * 55}ms">${w}</span>`).join(' ') + '”';
  const ref = $('#promiseRef'); ref.textContent = `${v.l} ${v.c}:${v.v}`; ref.style.setProperty('--d', (words.length * 55 + 250) + 'ms');
  box.classList.remove('show'); void box.offsetWidth; box.classList.add('show');
}
/* Elige uno al azar, sin repetir el anterior; el cambio entre versículos es fluido */
const showPromise = () => {
  let n; do { n = Math.floor(Math.random() * VERSES.length); } while (n === pi); pi = n;
  const box = $('#promise'); clearTimeout(verseTimer);
  if (box.hidden) { box.hidden = false; box.classList.add('enter'); renderVerse(n); box.scrollIntoView({ block: 'nearest', behavior: REDUCED ? 'auto' : 'smooth' }); return; }
  box.classList.add('out'); verseTimer = setTimeout(() => { renderVerse(n); box.classList.remove('out'); }, REDUCED ? 0 : 280);
};
$('#openPromise').onclick = showPromise; $('#nextPromise').onclick = showPromise;

/* Parallax muy sutil en la imagen central de la portada (solo escritorio, sin movimiento reducido) */
const parImg = $('.a2 img'); let parTick = false;
if (parImg && !REDUCED && matchMedia('(min-width:761px)').matches) addEventListener('scroll', () => {
  if (parTick) return; parTick = true;
  requestAnimationFrame(() => { parTick = false; if (scrollY < innerHeight) parImg.style.transform = `translate3d(0,${Math.min(scrollY * .05, 26).toFixed(1)}px,0)`; });
}, { passive: true });

const MOMENTS = ['Desayuno', 'Merienda', 'Para regalar', 'Un antojo'], MOODS = ['Clásico', 'Frutal', 'Goloso', 'Diferente'];
const PICKS = { 'Clásico': [['Muffin de vainilla', 'Suave, tierno y de los que nunca fallan.'], ['Muffin de chocolate', 'Cacao para quienes no se complican.']],
  'Frutal': [['Muffin de limón', 'Fresco y cítrico, despierta cualquier mañana.'], ['Muffin de arándanos', 'Un toque frutal y delicado.'], ['Muffin de frutilla', 'Dulce, fresco y con aroma a fruta.']],
  'Goloso': [['Muffin de dulce de leche', 'Dulzura bien argentina.'], ['Muffin relleno de Nutella', 'Relleno cremoso para los golosos de ley.']],
  'Diferente': [['Muffin red velvet', 'Elegante y distinto.'], ['Muffin de banana y nuez', 'Casero, con nueces crocantes.'], ['Muffin de café', 'Para los que aman el aroma del café.']] };
let qm = null, qd = null;
const chipsHTML = a => a.map(x => `<button type="button" data-v="${x}">${x}</button>`).join('');
$('#quizMoment').innerHTML = chipsHTML(MOMENTS); $('#quizMood').innerHTML = chipsHTML(MOODS);
function quiz() {
  if (!qm || !qd) return;
  let name, why;
  if (qm === 'Para regalar') { name = 'Pack regalo con tarjeta personalizada'; why = `Ideal para sorprender, con tarjeta personalizada. Si querés algo ${qd.toLowerCase()}, pedilo con ese sabor.`; }
  else if (qm === 'Desayuno') { name = 'Combo “Promesa de la mañana”'; why = 'Tres muffins y una tarjetita con mensaje: ideal para empezar el día. Combinalos con sabores ' + qd.toLowerCase() + 's.'; }
  else { const o = PICKS[qd][Math.floor(Math.random() * PICKS[qd].length)]; name = o[0]; why = o[1]; }
  $('#quizResult').innerHTML = `<div><p class="mini-title">Te recomendamos</p><h3>${name}</h3><p>${why}</p><button class="btn btn-primary btn-sm btn-order" data-nombre="${name}" type="button">Pedirlo por WhatsApp</button></div>`;
}
[['#quizMoment', v => qm = v], ['#quizMood', v => qd = v]].forEach(([sel, set]) => $(sel).onclick = e => {
  const b = e.target.closest('button'); if (!b) return; $$('button', $(sel)).forEach(x => x.classList.toggle('on', x === b)); set(b.dataset.v); quiz(); });

/* ---------- 4. HISTORIA: video real y visión ---------- */
/* La miniatura funciona como portada con botón de reproducción; al tocarla arranca el video real (media/nuestra-historia.mp4). Nunca se reproduce solo. */
const vid = $('#storyVideo'), vFrame = $('#videoFrame'), vMsg = $('#videoMsg');
$('#videoPlay').onclick = () => {
  vFrame.classList.add('playing'); vid.controls = true;
  const pr = vid.play(); if (pr && pr.catch) pr.catch(() => {});
};
vid.addEventListener('ended', () => { vid.controls = false; vid.currentTime = 0; vFrame.classList.remove('playing'); });
const videoFail = () => { vFrame.classList.remove('playing'); vid.controls = false; vMsg.hidden = false; };
vid.addEventListener('error', videoFail); $('source', vid).addEventListener('error', videoFail);


const VIS = [['Próximo año', 'Consolidar las ventas locales, fortalecer la marca en redes y lograr una rentabilidad mensual estable.'],
  ['1 a 3 años', 'Llegar a más barrios de la zona sur, sumar sabores y sumar puntos de venta en ferias o iglesias.'],
  ['Más de 3 años', 'Tener un pequeño local propio o taller de producción y generar empleo.'],
  ['Más de 10 años', 'Ser una marca regional reconocida por su calidad y su mensaje positivo.']];
$('#vision').innerHTML = VIS.map((v, i) => `<button class="${i ? '' : 'on'}" data-i="${i}">${v[0]}</button>`).join('');
$('#visionText').textContent = VIS[0][1];
$('#vision').onclick = e => { const b = e.target.closest('button'); if (!b) return;
  $$('#vision button').forEach(x => x.classList.toggle('on', x === b)); $('#visionText').textContent = VIS[b.dataset.i][1]; };

/* ---------- 5. CARTA ---------- */
const P = (n, slug, cat, d, star) => ({ n, slug, cat, d, star });
const PRODUCTS = [
  P('Muffin de vainilla', 'vainilla', 'Clásicos', 'El sabor de siempre, suave y esponjoso.', 1),
  P('Muffin de chocolate', 'chocolate', 'Clásicos', 'Intenso y tierno, para los amantes del cacao.', 1),
  P('Muffin de limón', 'limon', 'Frutales y especiados', 'Fresco y cítrico, ideal para la mañana.', 1),
  P('Muffin de arándanos', 'arandanos', 'Frutales y especiados', 'Con el toque frutal de los arándanos.', 1),
  P('Muffin de banana y nuez', 'banana-nuez', 'Frutales y especiados', 'Banana madura con nueces crocantes.', 1),
  P('Muffin de dulce de leche', 'dulce-de-leche', 'Clásicos', 'Dulzura bien argentina en cada bocado.', 1),
  P('Muffin red velvet', 'red-velvet', 'Clásicos', 'Terciopelo rojo, suave y elegante.'),
  P('Muffin de manzana y canela', 'manzana-canela', 'Frutales y especiados', 'Manzana con canela, cálido y reconfortante.'),
  P('Muffin de zanahoria', 'zanahoria', 'Frutales y especiados', 'Húmedo, casero y especiado.'),
  P('Muffin de frutilla', 'frutilla', 'Frutales y especiados', 'Dulce y fresco, con aroma a frutilla.'),
  P('Muffin relleno de Nutella', 'nutella', 'Clásicos', 'Relleno cremoso de avellanas y cacao.'),
  P('Muffin de café', 'cafe', 'Clásicos', 'Para quienes aman el aroma del café.'),
  P('Muffin sin gluten', 'sin-gluten', 'Opciones y formatos', 'Una opción pensada para más personas.'),
  P('Muffin vegano', 'vegano', 'Opciones y formatos', 'Una versión vegana, igual de rica.'),
  P('Mini muffins', 'mini-muffins', 'Opciones y formatos', 'Pequeños para compartir o probar varios.'),
  P('Muffin temático', 'tematico', 'Opciones y formatos', 'Ediciones para fechas como Navidad o Pascua.'),
  P('Caja de 6 muffins surtidos', 'caja-6', 'Cajas, combos y regalos', 'Variedad de sabores y mensaje personalizable.', 1),
  P('Caja de 12 muffins', 'caja-12', 'Cajas, combos y regalos', 'Para celebrar y compartir en grande.', 1),
  P('Combo “Promesa de la mañana”', 'combo-promesa', 'Cajas, combos y regalos', '3 muffins y una tarjetita con mensaje de fe.', 1),
  P('Pack regalo con tarjeta personalizada', 'pack-regalo', 'Cajas, combos y regalos', 'Un detalle listo para regalar.', 1)
];
const cats = ['Todos', ...new Set(PRODUCTS.map(p => p.cat))];
let curCat = 'Todos';
$('#filters').innerHTML = cats.map(c => `<button class="${c === 'Todos' ? 'on' : ''}" data-c="${c}">${c}</button>`).join('');
$('#filters').onclick = e => { const b = e.target.closest('button'); if (!b) return; curCat = b.dataset.c;
  $$('#filters button').forEach(x => x.classList.toggle('on', x === b)); renderCatalog(); };
$('#search').oninput = renderCatalog;
function renderCatalog() {
  const q = $('#search').value.trim().toLowerCase();
  const list = PRODUCTS.filter(p => (curCat === 'Todos' || p.cat === curCat) && (p.n + ' ' + p.d + ' ' + p.cat).toLowerCase().includes(q));
  $('#catalog').innerHTML = list.map((p, i) => `<article class="muffin-card" style="--i:${Math.min(i, 12)}">${p.star ? '<span class="star" title="Elegido para el lanzamiento">★</span>' : ''}
    <div class="muffin-img ph"><img src="./img/${p.slug}.jpg" alt="${p.n}" loading="lazy"><span class="ph-label">${p.slug}.jpg</span></div>
    <div class="muffin-info"><span class="cat">${p.cat}</span><h4>${p.n}</h4><p>${p.d}</p><button class="btn btn-order" data-nombre="${p.n}">Pedir</button></div></article>`).join('');
  $('#noprod').hidden = list.length > 0; guardImages($('#catalog'));
}
renderCatalog();
/* Botones "Pedir": abren WhatsApp con el producto elegido (sin precios inventados) */
document.addEventListener('click', e => { const b = e.target.closest('.btn-order'); if (!b) return;
  window.open(waLink(`Hola Dulce Promesa! Quiero pedir: ${b.dataset.nombre} 🧁`), '_blank', 'noopener'); });
/* Opciones del formulario de contacto */
$('#muffin').insertAdjacentHTML('beforeend', ['Muffin Promesa Triple', ...PRODUCTS.map(p => p.n)].map(n => `<option>${n}</option>`).join(''));

/* Carrusel (3 productos principales) */
const MAIN = [['muffin-individual', 'Muffin individual artesanal', 'Elaborado el mismo día, con presentación cuidada y mensaje de fe incluido.'],
  ['caja-6', 'Cajas de 6 o 12 muffins', 'Variedad de sabores, empaque atractivo y mensaje que podés personalizar.'],
  ['combo-promesa', 'Combo “Promesa de la mañana”', 'Tres muffins y una tarjetita para empezar el día con algo rico y significativo.']];
const track = $('#carouselTrack'), dotsWrap = $('#carouselDots');
track.innerHTML = MAIN.map(m => `<div class="carousel-slide ph"><img src="./img/${m[0]}.jpg" alt="${m[1]}"><span class="ph-label">${m[0]}.jpg</span><div class="carousel-caption"><h3>${m[1]}</h3><p>${m[2]}</p></div></div>`).join('');
let cur = 0, timer;
dotsWrap.innerHTML = MAIN.map((_, i) => `<button class="carousel-dot ${i ? '' : 'active'}" aria-label="Ir a ${i + 1}"></button>`).join('');
const dots = $$('.carousel-dot');
const goTo = i => { cur = (i + MAIN.length) % MAIN.length; track.scrollTo({ left: track.clientWidth * cur, behavior: 'smooth' }); dots.forEach((d, k) => d.classList.toggle('active', k === cur)); restart(); };
dots.forEach((d, i) => d.onclick = () => goTo(i));
$('#carouselPrev').onclick = () => goTo(cur - 1); $('#carouselNext').onclick = () => goTo(cur + 1);
track.addEventListener('scroll', () => { const i = Math.round(track.scrollLeft / track.clientWidth); if (i !== cur) { cur = i; dots.forEach((d, k) => d.classList.toggle('active', k === cur)); } }, { passive: true });
const start = () => timer = setInterval(() => goTo(cur + 1), 6000), stop = () => clearInterval(timer), restart = () => { stop(); start(); };
track.onmouseenter = stop; track.onmouseleave = start; start();

/* ---------- 6. TALLER ---------- */
const TASKS = [['Producción y elaboración de muffins', 'CEO 1 y CEO 2', '4 horas diarias, de lunes a viernes', 20],
  ['Atención de pedidos y consultas', 'CEO 1', '2 horas diarias (WhatsApp, Instagram, email)', 12],
  ['Contenido para redes y marketing digital', 'CEO 1 y CEO 2', '1 hora y 30 minutos al día', 9],
  ['Embalaje, etiquetado y preparación de entregas', 'CEO 1 y CEO 2', '1 hora diaria', 6],
  ['Coordinación de entregas y logística', 'CEO 1 y CEO 2', '1 hora diaria', 6],
  ['Compras de insumos y gestión de ingresos', 'CEO 2', '2 horas semanales', 2],
  ['Administración y registro de ventas', 'CEO 2', '2 horas semanales', 2],
  ['Desarrollo de nuevos sabores y mejora', 'CEO 1 y CEO 2', '2 horas semanales', 2]];
$('#tasks').innerHTML = TASKS.map(t => `<div class="task" data-anim="fade-up"><header><span>${t[0]}</span></header><small>${t[1]} · ${t[2]}</small><div class="bar"><i data-w="${t[3] / 20 * 100}"></i></div></div>`).join('');
const barObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { $('i', e.target).style.width = $('i', e.target).dataset.w + '%'; barObs.unobserve(e.target); } }), { threshold: .4 });
$$('.bar').forEach(b => barObs.observe(b));
$('#skills').innerHTML = ['Producción gastronómica', 'Redes y marketing digital', 'Atención al cliente', 'Administración y costos', 'Gestión del tiempo', 'Creatividad e innovación', 'Trabajo en equipo', 'Higiene alimentaria'].map(s => `<span>${s}</span>`).join('');

/* ---------- 7. ENCUESTA Y GRÁFICOS ---------- */
/* Valores iniciales: gráfico 12.c del plan de negocios (orientativos). Se pueden reemplazar desde la página. */
const COL = ['#f4a6bd', '#c3a8f0', '#9fdcbf', '#fbc08c', '#a9d4f5'];
const Q = [
  { t: 'Sexo', l: ['Femenino', 'Masculino', 'Prefiero no responder'], v: [9, 5, 1] },
  { t: 'Edad', l: ['18 a 25 años', '26 a 35 años', '36 a 50 años'], v: [5, 5, 5], pie: 1 },
  { t: 'Localidad', l: ['Berazategui', 'Quilmes', 'Florencio Varela', 'Otra'], v: [9, 3, 2, 1] },
  { t: '¿Te gustan los dulces?', l: ['Sí', 'No', 'A veces'], v: [10, 1, 4] },
  { t: 'Tipo de producto', l: ['Tortas', 'Alfajores y conitos', 'Postres individuales', 'Otros'], v: [4, 5, 4, 2] },
  { t: 'Frecuencia de compra', l: ['Todos los días', 'Una vez por semana', 'Una vez al mes', 'En ocasiones especiales'], v: [2, 6, 3, 4] },
  { t: 'Gasto por compra', l: ['Menos de $3.000', '$3.000 a $6.000', 'Más de $6.000'], v: [5, 7, 3] },
  { t: 'Lo más importante', l: ['El precio', 'La calidad', 'El sabor', 'La presentación'], v: [4, 4, 5, 2] },
  { t: 'Dónde comprar', l: ['En un local', 'Redes sociales', 'WhatsApp', 'A través de conocidos'], v: [4, 4, 5, 2] },
  { t: 'Promociones', l: ['Sí', 'No', 'Tal vez'], v: [11, 1, 3] }
];
const DEFAULT = Q.map(q => [...q.v]);
try { const s = JSON.parse(localStorage.getItem('dp_survey')); if (s && s.length === Q.length) s.forEach((v, i) => Q[i].v = v); } catch (e) {}
const persist = () => { try { localStorage.setItem('dp_survey', JSON.stringify(Q.map(q => q.v))); } catch (e) {} };
let qi = 4, qChart, cmpChart;
const sum = a => a.reduce((x, y) => x + (+y || 0), 0);
$('#qChips').innerHTML = Q.map((q, i) => `<button class="${i === qi ? 'on' : ''}" data-i="${i}">${i + 1}. ${q.t}</button>`).join('');
$('#qChips').onclick = e => { const b = e.target.closest('button'); if (!b) return; qi = +b.dataset.i;
  $$('#qChips button').forEach(x => x.classList.toggle('on', x === b)); drawQ(); fillInputs(); };
function drawQ() {
  if (!seen.q || !hasChart) return;
  const q = Q[qi], tot = sum(q.v); if (qChart) qChart.destroy();
  $('#qEmpty').hidden = !!tot; $('#qChart').style.display = tot ? '' : 'none'; if (!tot) return;
  const lab = q.l.map((l, k) => `${l} (${Math.round(q.v[k] / tot * 100)}%)`);
  qChart = new Chart($('#qChart'), { type: q.pie ? 'doughnut' : 'bar',
    data: { labels: q.pie ? lab : q.l, datasets: [{ data: q.v, backgroundColor: COL, borderRadius: 10, borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: !!q.pie, position: 'bottom' }, title: { display: true, text: `${qi + 1}. ${q.t} · ${tot} respuestas`, font: { size: 15 } }, tooltip: { callbacks: { afterLabel: c => Math.round(c.raw / tot * 100) + '%' } } },
      scales: q.pie ? {} : { y: { beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: 'Personas' } } } } });
}
function drawCmp() {
  if (!seen.cmp || !hasChart) return;
  const pct = i => { const t = sum(Q[i].v) || 1; return Q[i].v.map(x => Math.round(x / t * 100)); };
  if (cmpChart) cmpChart.destroy();
  cmpChart = new Chart($('#cmpChart'), { type: 'bar', data: { labels: [...Q[4].l, ...Q[8].l].map((l, i) => (i < 4 ? '' : 'Compra: ') + l),
    datasets: [{ label: '% de encuestados', data: [...pct(4), ...pct(8)], backgroundColor: [...Array(4).fill(COL[0]), ...Array(4).fill(COL[2])], borderRadius: 8 }] },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: 'Qué prefieren y dónde compran (%)' } } } });
}
function fillInputs() { const q = Q[qi]; $('#qInputs').innerHTML = q.l.map((l, k) => `<label>${l}<input type="number" min="0" value="${q.v[k]}"></label>`).join(''); }
$('#qSave').onclick = () => { Q[qi].v = $$('#qInputs input').map(x => Math.max(0, +x.value || 0)); persist(); drawQ(); drawCmp(); $('#qMsg').textContent = 'Gráfico actualizado.'; };
$('#qClear').onclick = () => { Q[qi].v = Q[qi].l.map(() => 0); persist(); fillInputs(); drawQ(); drawCmp(); $('#qMsg').textContent = 'Pregunta vaciada: ingresá los resultados reales.'; };
$('#qReset').onclick = () => { DEFAULT.forEach((v, i) => Q[i].v = [...v]); persist(); fillInputs(); drawQ(); drawCmp(); $('#qMsg').textContent = 'Se restauraron los datos iniciales.'; };
drawQ(); fillInputs(); drawCmp();

/* ---------- 8. CUENTAS ---------- */
const FIN = {
  inv: ['Total de inversión inicial', [['Horno eléctrico / industrial pequeño', 350000], ['Batidora planetaria', 180000], ['Moldes de muffins', 45000], ['Utensilios de cocina y mesada', 60000], ['Materia prima inicial', 80000], ['Envases, cajas y etiquetas', 50000], ['Diseño de marca y packaging', 40000], ['Publicidad de lanzamiento', 30000]]],
  fix: ['Total de costos fijos mensuales', [['Luz', 60000], ['Gas', 40000], ['Agua', 35000], ['Publicidad', 20000], ['Monotributo', 55000], ['Contador', 50000], ['Tienda online', 50000], ['Combustible', 20000]]]
};
const PAL = ['#f4a6bd', '#c3a8f0', '#9fdcbf', '#fbc08c', '#a9d4f5', '#e9c9a0', '#d98aa0', '#7fd8d8'];
let pie, bar, finKey = 'inv', totalRun = 0;
/* El total cuenta desde $0 hasta su valor */
function animTotal(total) {
  const el = $('#finTotal'), me = ++totalRun;
  if (REDUCED) { el.textContent = money(total); return; }
  const t0 = performance.now();
  (function s(t) { if (me !== totalRun) return; const p = Math.min((t - t0) / 1200, 1); el.textContent = money(Math.round(total * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(s); })(t0);
}
function fin(k) {
  finKey = k; const [label, rows] = FIN[k], total = rows.reduce((s, r) => s + r[1], 0);
  $('#finLabel').textContent = label; $('#finList').innerHTML = rows.map((r, i) => `<li style="--i:${i}"><span>${r[0]}</span><b>${money(r[1])}</b></li>`).join('');
  if (seen.fin) finCharts(); else { totalRun++; $('#finTotal').textContent = money(total); }
}
/* Gráficos de cuentas: se crean al entrar en pantalla (y al cambiar de pestaña) para que se vean animados */
function finCharts() {
  const rows = FIN[finKey][1]; animTotal(rows.reduce((s, r) => s + r[1], 0));
  if (!hasChart) return; if (pie) pie.destroy(); if (bar) bar.destroy();
  const data = { labels: rows.map(r => r[0]), datasets: [{ data: rows.map(r => r[1]), backgroundColor: PAL, borderRadius: 8, borderWidth: 0 }] };
  const tip = { callbacks: { label: c => ' ' + money(c.raw) } };
  pie = new Chart($('#finPie'), { type: 'doughnut', data, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tip, title: { display: true, text: 'Distribución' } } } });
  bar = new Chart($('#finBar'), { type: 'bar', data, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: tip, title: { display: true, text: 'Por concepto' } }, scales: { y: { ticks: { callback: v => money(v) } }, x: { ticks: { display: false } } } } });
}
$('#finTabs').onclick = e => { const b = e.target.closest('button'); if (!b) return; $$('#finTabs button').forEach(x => x.classList.toggle('on', x === b)); fin(b.dataset.f); };
fin('inv');

/* ---------- 9. REDES ---------- */
const SOC = {
  ig: ['Instagram · @dulcepromesa.muffins', 'https://www.instagram.com/dulcepromesa.muffins/', ['Estilo cálido, cercano e inspirador', 'Foto de perfil: logo o muffin con mensaje', 'Reels, posts con mensajes, stories interactivas y encuestas', 'Publicar 4 veces por semana', 'Meta: 800 seguidores en 6 meses']],
  tt: ['TikTok · @dulcepromesa.muffins', 'https://www.tiktok.com/@dulcepromesa.muffins', ['Estilo juvenil y dinámico, con música suave y mensajes positivos', 'Video de presentación del negocio (15 a 30 segundos)', 'Video de venta del Muffin Promesa Triple', 'Meta: 500 seguidores en 6 meses']],
  fb: ['Facebook · Dulce Promesa Muffins', 'https://www.facebook.com/search/top?q=Dulce%20Promesa%20Muffins', ['Es uno de los canales virtuales de venta', 'El plan no detalla una estrategia propia para esta red: queda para completar', 'Se puede aprovechar el mismo contenido de Instagram']]
};
function social(k) { const s = SOC[k]; const pn = $('#socialPanel'); pn.classList.remove('panel-swap'); void pn.offsetWidth; pn.classList.add('panel-swap'); pn.innerHTML = `<h3>${s[0]}</h3><ul class="plain">${s[2].map(x => `<li>${x}</li>`).join('')}</ul><div class="btnrow"><a class="btn btn-primary btn-sm" target="_blank" rel="noopener" href="${s[1]}">Visitar perfil</a></div>`; }
$('#socialTabs').onclick = e => { const b = e.target.closest('button'); if (!b) return; $$('#socialTabs button').forEach(x => x.classList.toggle('on', x === b)); social(b.dataset.n); };
social('ig');

/* ---------- 10. PLAN: GANTT, HORAS Y CANVAS ---------- */
const PH = [
  ['1. Planificación', '#e8829f', [['Definición de objetivos', 1, 14, 8], ['Análisis de mercado y presupuesto', 1, 17, 5]]],
  ['2. Diseño y marca', '#a98bd6', [['Identidad visual y packaging', 8, 28, 10], ['Materiales promocionales', 8, 39, 12]]],
  ['3. Desarrollo de productos', '#f0a36b', [['Recetas y pruebas', 12, 37, 12], ['Selección de proveedores', 19, 44, 10], ['Control de calidad', 25, 49, 12]]],
  ['4. Marketing y comunicación', '#6fbf9c', [['Estrategia de redes sociales', 19, 49, 18], ['Contenido visual y campañas', 19, 49, 18]]],
  ['5. Lanzamiento', '#e8829f', [['Preparación de stock', 35, 49, 10], ['Evento de apertura y seguimiento', 41, 49, 5]]]
];
const VIEWS = { dias: Array.from({ length: 49 }, (_, i) => [i + 1, 1]), semanas: Array.from({ length: 7 }, (_, i) => ['S' + (i + 1), 7]), meses: [['Ago (desde el 18)', 14], ['Sep', 30], ['Oct (hasta el 5)', 5]] };
let curG = 'semanas';
function gantt(v) {
  curG = v; const cols = VIEWS[v], tpl = cols.map(c => c[1] + 'fr').join(' '), g = $('#gantt'); let k = 0;
  g.innerHTML = `<div class="grow"><div></div><div class="gcols" style="grid-template-columns:${tpl}">${cols.map(c => `<span>${v === 'dias' ? (c[0] % 7 === 1 ? c[0] : '') : c[0]}</span>`).join('')}</div></div>` +
    PH.map(([n, col, ts]) => `<div class="phase">${n}</div>` + ts.map(([t, a, b, p]) => {
      const L = (a - 1) / 49 * 100, W = (b - a + 1) / 49 * 100, done = Math.min(p, b - a + 1) / (b - a + 1);
      return `<div class="grow"><div>${t}</div><div class="gbar" style="--k:${k++}" title="Días ${a} a ${b}"><i style="left:${L}%;width:${W}%;background:${col};opacity:.28"></i><i style="left:${L}%;width:${W * done}%;background:${col}"></i></div></div>`;
    }).join('')).join('');
  /* las barras crecen de izquierda a derecha al mostrarse o al cambiar de vista */
  g.classList.remove('go'); if (seen.gantt) { void g.offsetWidth; requestAnimationFrame(() => g.classList.add('go')); }
}
$('#gTabs').onclick = e => { const b = e.target.closest('button'); if (!b) return; $$('#gTabs button').forEach(x => x.classList.toggle('on', x === b)); gantt(b.dataset.v); };
gantt('semanas');
/* Horas: las tareas "diarias" se cuentan de lunes a sábado (horario de atención); producción, de lunes a viernes */
const H = [['Producción y elaboración', 'CEO 1 y CEO 2', 4, 5], ['Atención de pedidos y consultas', 'CEO 1', 2, 6], ['Contenido para redes', 'CEO 1 y CEO 2', 1.5, 6], ['Embalaje y etiquetado', 'CEO 1 y CEO 2', 1, 6], ['Entregas y logística', 'CEO 1 y CEO 2', 1, 6], ['Compras y gestión de ingresos', 'CEO 2', 0, 0, 2], ['Administración y ventas', 'CEO 2', 0, 0, 2], ['Nuevos sabores', 'CEO 1 y CEO 2', 0, 0, 2]];
const fh = n => n.toLocaleString('es-AR') + ' h';
$('#hoursTable').innerHTML = '<thead><tr><th>Actividad</th><th>Responsable/s</th><th class="n">Por día</th><th class="n">Por semana</th><th class="n">Por mes (4 sem.)</th></tr></thead><tbody>' +
  H.map(r => { const w = r[4] || r[2] * r[3]; return `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="n">${r[2] ? fh(r[2]) : '—'}</td><td class="n">${fh(w)}</td><td class="n">${fh(w * 4)}</td></tr>`; }).join('') + '</tbody>';
const CV = [
  ['Segmentos de clientes', ['Jóvenes de 20 a 30 años, sobre todo mujeres', 'Familias y amigos que buscan regalar', 'Personas que valoran calidad y sabor artesanal', 'Clientes de Berazategui y alrededores']],
  ['Propuesta de valor', ['Postres artesanales frescos, de alta calidad y con mucho amor', 'Momentos dulces para compartir, regalar y disfrutar', 'Variedad creativa, atención cercana y apoyo al emprendimiento local']],
  ['Canales', ['WhatsApp Business (pedidos principales)', 'Instagram y TikTok', 'Delivery propio o apps', 'Eventos y encargos especiales']],
  ['Relación con clientes', ['Atención personalizada por WhatsApp', 'Contenido atractivo en Instagram y TikTok', 'Fidelización y promociones', 'Experiencia cálida y memorable']],
  ['Fuentes de ingresos', ['Venta directa de postres', 'Encargos para cumpleaños y eventos', 'Pedidos por redes y WhatsApp', 'Posibles combos y promociones']],
  ['Recursos clave', ['Recetas exclusivas y know-how', 'Equipo de cocina y utensilios', 'Marca e identidad visual', 'Comunidad de clientes en redes']],
  ['Actividades clave', ['Elaboración artesanal', 'Gestión de pedidos por WhatsApp e Instagram', 'Marketing en redes', 'Control de calidad y presentación']],
  ['Socios clave', ['Proveedores de insumos frescos', 'Emprendedores locales y colaboradores', 'Plataformas de delivery y redes', 'Contador / asesor impositivo']],
  ['Estructura de costos', ['Insumos y materias primas', 'Packaging y presentación', 'Marketing digital', 'Transporte / delivery', 'Costos fijos de cocina']]
];
$('#canvasGrid').innerHTML = CV.map(c => `<button class="cb" aria-expanded="false" data-anim="fade-up"><h4>${c[0]}</h4><ul>${c[1].map(x => `<li>• ${x}</li>`).join('')}</ul></button>`).join('');
$('#canvasGrid').onclick = e => { const b = e.target.closest('.cb'); if (b) { b.classList.toggle('open'); b.setAttribute('aria-expanded', b.classList.contains('open')); } };

/* ---------- 11. CONTACTO ---------- */
$('#waBtn').href = waLink('Hola Dulce Promesa! Quiero hacer un pedido 🧁');
$('#waFloat').href = waLink('Hola Dulce Promesa! Quiero hacer una consulta 🧁');
const form = $('#contactForm'), note = $('#formNote');
form.addEventListener('submit', e => {
  e.preventDefault();
  const nombre = form.nombre.value.trim(), tel = form.telefono.value.trim();
  const bad = msg => { note.textContent = msg; form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake'); };
  if (!nombre || !tel) return bad('Completá tu nombre y teléfono.');
  if (tel.replace(/\D/g, '').length < 6) return bad('Revisá el teléfono: parece incompleto.');
  let m = `Hola Dulce Promesa! Soy ${nombre} (tel: ${tel}).`;
  if (form.muffin.value) m += ` Me interesa: ${form.muffin.value}.`;
  if (form.mensaje.value.trim()) m += ' ' + form.mensaje.value.trim();
  window.open(waLink(m), '_blank', 'noopener'); note.textContent = '¡Gracias! Te llevamos a WhatsApp para confirmar tu pedido.'; form.reset();
});

/* ---------- 12. EFECTOS GLOBALES ---------- */
/* Onda de pulsación al hacer clic en cualquier botón */
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('.btn'); if (!b || REDUCED) return;
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), sp = document.createElement('span');
  sp.className = 'ripple'; sp.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  b.appendChild(sp); setTimeout(() => sp.remove(), 650);
});

/* ---------- 13. FOOTER Y ARRANQUE ---------- */
$('#anioActual').textContent = new Date().getFullYear();
guardImages();
/* Bloques que se activan al entrar en pantalla: encuesta, comparativa, cuentas, plan y catálogo */
watchView($('.survey'), 'q'); watchView($('#cmpChart').parentElement, 'cmp'); watchView($('.fin'), 'fin'); watchView($('.gantt-wrap'), 'gantt'); watchView($('#catalog'), 'catalog');
/* Pantalla de bienvenida breve: se retira sola (o al tocarla) y recién entonces arrancan las animaciones de la portada */
function startPage() {
  if (document.body.classList.contains('ready')) return;
  document.body.classList.remove('loading'); document.body.classList.add('ready');
  const ld = $('#loader'); if (ld) { ld.classList.add('done'); setTimeout(() => ld.remove(), 900); }
  watch();
}
const t0 = performance.now(), minShow = REDUCED ? 0 : 1200;
const whenLoaded = () => setTimeout(startPage, Math.max(0, minShow - (performance.now() - t0)));
document.readyState === 'complete' ? whenLoaded() : addEventListener('load', whenLoaded);
setTimeout(startPage, 2800); $('#loader').onclick = startPage;
window.__dp = true;
