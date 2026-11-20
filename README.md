# Mobile Web App (HTML/CSS/JS + Backend Node.js)

Proyecto completo **Mobile-First / PWA** con barra de navegación inferior nativa, Service Worker offline y backend REST en **Node.js + Express**.

## Estructura del proyecto

```text
mobile-webapp-starter/
├── package.json
├── server.js          # Servidor Express + API REST (/api/items, /api/health)
├── README.md
└── public/
    ├── index.html     # Interfaz móvil con Safe Areas y navegación inferior
    ├── styles.css     # Estilos oscuros responsivos (Mobile-First)
    ├── app.js         # Lógica del cliente, fetch API y registro PWA
    ├── manifest.json  # Manifiesto instalable en Android/iOS
    ├── sw.js          # Service Worker para soporte offline
    └── icon.svg       # Ícono vectorial de la aplicación
```

## Ejecución local

```bash
npm install
npm start
```

Abre `http://localhost:3000` en tu navegador (o activa la vista móvil en DevTools).

## Despliegue en Render

1. Sube esta carpeta a un repositorio en **GitHub**.
2. Crea un nuevo **Web Service** en **Render** conectado a tu repositorio.
3. Configura:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
