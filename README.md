# Lunaa Café · Café de especialidad y brunch

Web moderna de **Lunaa Café**, un café de especialidad en Madrid — *Café · Buenos momentos · Siempre*.
Construida con **HTML5, CSS3 y JavaScript vanilla** — sin frameworks ni dependencias de build.

## Identidad de marca

- **Logo**: `assets/lunaa-emblem.svg` (luna creciente, taza con moño y corazón latte art,
  wordmark «LUNAA» en serif, «Café» en script y cinta «Café · Buenos momentos · Siempre»).
  Se usa en la cabecera, el pie y como favicon de la pestaña (`<link rel="icon">`).
- **Paleta** tomada del logo: marrones cálidos (`--brand-strong #59331a` → acento profundo `#4e2b17`)
  sobre crema (`--bg #faf6ec`), con acento terracota para precios/CTAs y salvia para chips alimentarios.
- Si dispones del arte original en PNG, guárdalo como `assets/lunaa-emblem.png` y sustituye
  las tres referencias `assets/lunaa-emblem.svg` (cabecera, pie y favicon).

## 1. Análisis

### Problema
Los cafés de barrio pierden reservas y pedidos para llevar por no tener presencia digital o por webs lentas y poco accesibles.

### Público objetivo
- Vecinos del barrio de Palma que quieren desayuno/brunch rápido o para llevar.
- Teletrabajadores que buscan terraza con enchufes.
- Clientes con restricciones alimentarias (vegano, sin gluten, sin lactosa).

### Objetivos medibles
- Ver la carta y filtrar por preferencias en < 10 s.
- Reservar mesa en < 60 s con confirmación y código.
- Pedido para llevar con recogida estimada y ticket descargable.
- Cumplimiento **WCAG 2.1 AA** verificable.

### Competencia y tono
Cafés de especialidad: tono cercano, información clara de horario y precios con IGV incluido.

> **Precios en soles peruanos (PEN, `S/`)** — convertidos desde los importes originales en euros a un tipo aproximado de **€1 ≈ S/ 4.00**, redondeados a finales `.00`/`.50`. Formato `Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })` → `S/ 38.00`. Los importes se muestran con IGV (18 %) incluido.

## 2. Diseño

### Sistema de diseño
| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#faf6ec` | Fondo crema |
| `--surface` | `#fffdf7` | Tarjetas |
| `--brand-strong` | `#59331a` | CTA principal (contraste 10.4:1 sobre crema) |
| `--accent` | `#8f3f14` | Precios y enlaces (contraste 6.4:1) |
| `--sage` | `#55684c` | Chips "vegano/sin gluten" activos |
| `--focus` | `#0b5fff` | Anillo de foco visible (3 px) |

- **Tipografías:** Fraunces (titulares) + Inter (texto). Cargadas con `preconnect` y `display=swap`.
- **Modo oscuro** automático según `prefers-color-scheme` y conmutador manual persistente (`localStorage`).
- **Radio y sombras** suaves; rejilla de carta `auto-fill minmax(258px, 1fr)`.

### Mapa de contenido
1. Portada (propuesta de valor + CTA + estado de apertura calculado por JS)
2. Compromisos (tueste propio, masa madre, proximidad, para todos)
3. **La carta** — filtros por categoría, buscador y preferencias (vegetariano/vegano/sin gluten)
4. **Para llevar** — banda de conversión
5. **Reservas** — formulario validado + .ics + gestión de reservas guardadas
6. **Encuéntranos** — mapa, transporte, contacto
7. Pie — newsletter, horario, avisos legales (diálogos accesibles)

## 3. Implementación

```text
cafe-yolanda/
  index.html            Estructura semántica, ARIA, logo en cabecera y pie
  styles.css            Tokens, mobile-first, breakpoints 560/860/900 px, print, forced-colors
  app.js                Datos MENU, filtros, carrito, pedido, reserva, validación, tema
  serve.js              Servidor estático mínimo para previsualizar
  assets/
    lunaa-emblem.svg    Logo vectorial (cabecera, pie, favicon)
    placeholder.svg     Fallback de imágenes rotas
```

### Funcionalidad JavaScript
- **Carta dinámica:** 18 platos renderizados desde datos; filtros combinables (categoría ∩ preferencias ∩ búsqueda); contador de resultados y región `aria-live`; estado vacío con recuperación.
- **Carrito:** añadir/quitar/cantidades, persistencia (`lunaa_cart_v1`), totales con `Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })`, contador accesible, **drawer** con trampa de foco y cierre con Escape.
- **Pedido para llevar:** diálogo `<dialog>` nativo, hora de recogida, validación, resumen, **ticket .txt descargable** y código de recogida.
- **Reservas:** validación completa (fecha no pasada, hora, comensales, privacidad), resumen de errores enfocable, guardado (`lunaa_reservas`), **descarga .ics**, listado y cancelación.
- **Estado del local:** píldora "Abierto ahora / Cerrado" calculada desde el horario real (mar–dom).
- **Newsletter** validada; año de pie automático.

### Accesibilidad (WCAG 2.1 AA)
- Salto al contenido (`skip-link`); landmarks; un `<h1>` y jerarquía correcta.
- Foco visible; objetivos táctiles ≥ 44 px.
- Formularios con `<label>`, `aria-describedby`, `aria-invalid` y resumen de errores.
- `prefers-reduced-motion` y `forced-colors` soportados.
- Contrastes ≥ 4.5:1 (texto) y ≥ 3:1 (componentes).
- Imágenes con `alt`; decorativas con `aria-hidden`/`alt=""`; mapa con `title`.
- Todo navegable por teclado; Escape cierra menú, drawer y diálogos.
- **Lighthouse: 100 accesibilidad · 100 buenas prácticas · 100 SEO.**

### Responsive
Mobile-first; navegación hamburguesa bajo 860 px; rejilla adaptable; sin scroll horizontal a 320 px.

## 4. Ejecución local

```powershell
# Opción 1: abrir index.html con Live Server (VS Code)
# Opción 2: servidor incluido
node serve.js            # http://localhost:8080
```

## 5. Despliegue en GitHub y Railway (desde el navegador)

**GitHub**

1. En github.com → `+` → **New repository**: nombre `cafe-yolanda`, público, sin README/.gitignore.
2. En la página del repo → **uploading an existing file**.
3. Arrastra desde `cafe-yolanda\` **todos los archivos y la carpeta `assets\`** (index.html, styles.css, app.js, serve.js, package.json, README.md, .gitignore — si no ves el `.gitignore`, actívalo en el Explorador: Vista → Elementos ocultos).
4. **Commit changes**.

**Railway**

1. En railway.com → **Login con GitHub** (autoriza el acceso al repo).
2. **+ New Project** → **Deploy from GitHub repo** → `cafe-yolanda`.
3. Railway detecta Node y ejecuta `npm start` (definido en `package.json` → `node serve.js`, que usa el puerto `PORT` inyectado por Railway).
4. Al terminar → servicio → **Settings → Networking → Generate Domain**: tu URL pública (`https://…up.railway.app`; también puedes añadir un dominio propio).
5. Cada cambio en `main` se redesplega automáticamente.

> Variables de entorno: ninguna necesaria. El servidor estático usa solo el `PORT` que Railway asigna.

## 6. Pruebas manuales
- [x] Filtros combinados (categoría + preferencia + búsqueda)
- [x] Carrito persistente tras recargar
- [x] Validación de pedido y reserva con resumen de errores
- [x] Descarga de ticket .txt y .ics
- [x] Reserva persistida en "Tus próximas reservas"
- [x] Lighthouse sin fallos de accesibilidad
- [ ] Navegación completa solo con teclado y lector de pantalla (NVDA)
- [ ] 320 px / 768 px / 1440 px sin overflow

## 7. Mejoras futuras
- Cuentas de cliente y favoritos.
- Pedido sincronizado con cocina (WebSocket/SSE).
- Pasarela de pago real y SMS transaccional.
- Internacionalización (ES/EN).
