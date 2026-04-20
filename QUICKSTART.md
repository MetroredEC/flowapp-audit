# 🚀 Quick Start - AuditMed

Guía rápida para levantar la aplicación en 10 minutos.

## ⚡ Opción 1: Desarrollo Local (Más Rápido)

### Requisitos
- Node.js 18+
- npm o yarn

### Paso 1: Setup Backend
```bash
cd backend
npm install
npm run dev
```
Esto abre un servidor en `http://localhost:8787`

### Paso 2: Setup Frontend (otra terminal)
```bash
cd frontend
npm install
npm run dev
```
La app está en `http://localhost:5173`

**¡Listo!** Usa las credenciales de prueba:
- **Auditor**: `auditor@metrored.com`
- **Admin**: `admin@metrored.com`

---

## 🌍 Opción 2: Deploy a Producción

### Frontend → GitHub Pages

```bash
cd frontend
npm run build
npm run deploy
```

Estará en: `https://metroredec.github.io/flowapp`

### Backend → Cloudflare Workers

```bash
# 1. Instalar wrangler
npm install -g @cloudflare/wrangler

# 2. Autenticarse
wrangler login

# 3. Crear base de datos
wrangler d1 create flowapp-audit-db

# Copiar el database_id a backend/wrangler.toml

# 4. Ejecutar migraciones
wrangler d1 execute flowapp-audit-db --file backend/migrations/0001_init.sql

# 5. Deploy
cd backend
wrangler publish --env production
```

Tu worker estará en: `https://flowapp-audit.<cuenta>.workers.dev`

---

## 📊 Cargar Datos de Prueba

### Opción A: CSV (ARC_AUDITORIA_MEDICA)
1. Abre la app
2. Ve a Dashboard
3. Sección "Cargar Datos"
4. Selecciona tu CSV
5. ✅ Automáticamente se procesan

### Opción B: XLSX (BASE PEDIDOS)
1. Ve a Gestión > Pedidos
2. Carga tu archivo XLSX
3. ✅ Se generan alertas automáticamente

---

## 🧪 Usuarios de Prueba

| Email | Rol |
|-------|-----|
| auditor@metrored.com | Auditor |
| admin@metrored.com | Admin |

---

## 📚 Documentación Completa

Ver `README.md` para detalles completos.
