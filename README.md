# Placas ProViajes

App para generar placas de marketing (imagen y video), ideas de contenido con IA, y calendario de fechas para ProViajes.

## Antes de publicar: probalo en tu computadora

1. Instalá [Node.js](https://nodejs.org) si no lo tenés (versión 18 o superior).
2. Abrí una terminal dentro de esta carpeta (`proviajes-app`).
3. Corré:
   ```
   npm install
   npm run dev
   ```
4. Abrí la URL que te muestra (algo como `http://localhost:5173`) y probá que todo funcione.

## Publicar en Vercel — paso a paso

### 1. Subir el código a GitHub

1. Entrá a [github.com](https://github.com) y creá un repositorio nuevo (ej: `placas-proviajes`), vacío, sin README.
2. En la terminal, dentro de esta carpeta:
   ```
   git init
   git add .
   git commit -m "Primera versión de Placas ProViajes"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/placas-proviajes.git
   git push -u origin main
   ```
   (Reemplazá `TU-USUARIO` por tu usuario de GitHub — el mismo que usaste para el cotizador de traslados.)

### 2. Conectar con Vercel

1. Entrá a [vercel.com](https://vercel.com) y logueate con tu cuenta de GitHub (la misma de siempre).
2. Tocá **"Add New..." → "Project"**.
3. Elegí el repositorio `placas-proviajes` que acabás de subir.
4. Vercel detecta automáticamente que es un proyecto Vite/React — dejá la configuración default (Build Command: `npm run build`, Output Directory: `dist`).
5. Tocá **"Deploy"**.
6. En 1-2 minutos te da una URL pública (tipo `placas-proviajes.vercel.app`) — esa es tu web.

### 3. Actualizaciones futuras

Cada vez que quieras subir un cambio (por ejemplo, una nueva versión de `App.jsx` que te comparta):
```
git add .
git commit -m "Actualización"
git push
```
Vercel vuelve a publicar solo, automáticamente, en 1-2 minutos.

## Importante: qué funciona igual y qué no, fuera de Claude

- **Buscador de fotos/videos reales (Pexels)**: funciona igual, pegando tu API key dentro de la app.
- **Calendario con eventos guardados**: funciona igual (ahora usa el almacenamiento del navegador).
- **Generador de ideas con IA / Info de eventos**: en esta versión publicada van a usar siempre las **plantillas locales** (no la IA en vivo), porque la conexión directa a la IA de Anthropic solo existe dentro de Claude. Si más adelante querés que use IA real ahí también, hace falta:
  1. Conseguir tu propia API key en [console.anthropic.com](https://console.anthropic.com).
  2. Armar una función pequeña de backend (ej: una "Vercel Function") que la use, para no exponer la key en el navegador.
  
  Avisame cuando quieras dar ese paso y te ayudo a armarlo.
