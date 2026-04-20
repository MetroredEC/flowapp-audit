# 📦 ENTREGA - AuditMed Sistema de Auditoría Médica

## ✅ Lo que Incluye Este Paquete

### 1. Frontend React (Carpeta: `frontend/`)

**Stack:**
- React 18 + TypeScript
- Vite (build tool ultrarrápido)
- React Router (navegación)
- Zustand (state management)
- Tailwind CSS (estilos)

**Archivos principales:**
```
frontend/
├── src/
│   ├── App.tsx              # Aplicación principal
│   ├── main.tsx             # Entry point
│   ├── store.ts             # Zustand store global
│   ├── types.ts             # TypeScript interfaces
│   ├── components/
│   │   └── Layout.tsx       # Layout con sidebar
│   ├── pages/
│   │   ├── LoginPage.tsx    # Autenticación
│   │   ├── DashboardPage.tsx # KPIs y métricas
│   │   ├── AuditsPage.tsx   # Auditorías
│   │   ├── AssignmentsPage.tsx
│   │   ├── FeedbackPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── AlertsPage.tsx
│   │   └── AdminPage.tsx
│   └── utils/
│       ├── api.ts           # Cliente HTTP
│       └── helpers.ts       # Funciones auxiliares
├── public/
│   ├── index.html
│   └── data/                # Datos de prueba
│       ├── parametros_auditoria.csv
│       ├── estratificacion.json
│       └── users.json
├── package.json
├── vite.config.ts
└── tsconfig.json
```

**Funcionalidades:**
- ✅ Dashboard con 8 KPIs
- ✅ Carga de CSV y XLSX
- ✅ Formularios dinámicos
- ✅ Enmascaramiento de datos sensibles
- ✅ Exportación PDF/CSV
- ✅ Responsive design

---

### 2. Backend Cloudflare Workers (Carpeta: `backend/`)

**Stack:**
- Cloudflare Workers (servidor serverless)
- D1 SQLite Database
- R2 Object Storage
- KV Namespaces (cache/sesiones)
- TypeScript

**Archivos principales:**
```
backend/
├── src/
│   ├── index.ts             # Router principal
│   ├── auth.ts              # OAuth 2.0 + Entra ID
│   ├── audits.ts            # Endpoints de auditorías
│   ├── assignments.ts       # Endpoints de asignaciones
│   ├── feedback.ts          # Endpoints de retroalimentación
│   └── orders.ts            # Endpoints de pedidos/alertas
├── migrations/
│   └── 0001_init.sql        # Schema D1 (tablas)
├── package.json
├── wrangler.toml            # Configuración Cloudflare
└── tsconfig.json
```

**Endpoints API:**
- `POST /api/auth/login` - Autenticación
- `GET/POST /api/audits` - Gestión de auditorías
- `GET/POST /api/assignments` - Asignaciones
- `GET/POST /api/feedback` - Retroalimentación
- `GET /api/alerts` - Alertas del sistema

---

### 3. Datos de Ejemplo (Carpeta: `frontend/public/data/`)

1. **parametros_auditoria.csv** - 18 parámetros binarios
2. **estratificacion.json** - Estratificación por especialidad
3. **users.json** - Usuarios de prueba

---

### 4. Documentación (Raíz del proyecto)

| Archivo | Descripción | Lectura |
|---------|-------------|---------|
| **QUICKSTART.md** | Inicio en 5 minutos | 2 min ⭐ |
| **SETUP.md** | Instalación completa | 15 min |
| **README.md** | Documentación técnica | 30 min |
| **wrangler.toml** | Config Cloudflare | referencia |
| **.github/workflows/** | CI/CD automatizado | referencia |

---

### 5. Configuración CI/CD (GitHub Actions)

Dos workflows automáticos:

1. **deploy-frontend.yml**
   - Detecta cambios en `frontend/`
   - Compila React
   - Publica en GitHub Pages automáticamente

2. **deploy-backend.yml**
   - Detecta cambios en `backend/`
   - Publica Worker a Cloudflare automáticamente

---

## 🚀 Cómo Comenzar

### Opción 1: Desarrollo Local (5 min)

```bash
# Terminal 1
cd frontend
npm install && npm run dev
# Abre http://localhost:5173

# Terminal 2
cd backend
npm install && wrangler dev
```

Click **"Prueba como Auditor"** → ¡Listo!

### Opción 2: Docker (1 comando)

```bash
docker-compose up
# http://localhost:5173
```

### Opción 3: Producción (15 min)

Lee **SETUP.md** sección "Instalación Completa"

---

## 📊 KPIs Implementados

Todos operativos en el Dashboard:

1. **Auditorías Realizadas** - Contador
2. **Cumplimiento de Calidad** - % HC score ≥90%
3. **Índice Signos Vitales** - % datos completos
4. **Pertinencia Exámenes** - % HC pertinentes
5. **Adherencia Guías Clínicas** - % cumplimiento
6. **Cumplimiento Auditores** - % auditorías completadas
7. **Retroalimentación Oportuna** - % en plazo
8. **Índice de Reconsulta** - % pacientes con múltiples citas

Cada KPI tiene:
- Valor actual
- Meta
- Status semáforo (verde/amarillo/rojo)
- Filtros por mes, especialidad, ciudad

---

## 🔐 Seguridad

### Autenticación

- ✅ OAuth 2.0 con Azure Entra ID
- ✅ JWT validation con JWKS
- ✅ Sesiones en KV con TTL
- ✅ CORS configurado

### Privacidad

- ✅ Enmascaramiento de nombres (K***, G***)
- ✅ Enmascaramiento de HC (***4098)
- ✅ Hash de IDs de pacientes en memoria
- ✅ Advertencia en login

### Almacenamiento

- ✅ D1: Datos transaccionales
- ✅ R2: Archivos/reportes
- ✅ KV: Sesiones con expiración

---

## 🗂️ Estructura de Carpetas Completa

```
flowapp-audit/
├── frontend/                    # SPA React
│   ├── src/
│   ├── public/data/            # Datos de ejemplo
│   ├── package.json
│   └── vite.config.ts
├── backend/                     # Workers
│   ├── src/
│   ├── migrations/
│   ├── package.json
│   └── wrangler.toml
├── .github/workflows/          # CI/CD
│   ├── deploy-frontend.yml
│   └── deploy-backend.yml
├── QUICKSTART.md               # 5 minutos
├── SETUP.md                    # 15 minutos
├── README.md                   # Documentación
└── docker-compose.yml          # Para desarrollo
```

---

## 📥 Cargar Tus Datos

### Paso 1: ARC_AUDITORIA_MEDICA.csv (592K registros)

1. Dashboard → "Cargar Datos"
2. Selecciona tu CSV
3. Auto-detecta columnas (FECHA_ADMISION, CENTRO_MEDICO, etc.)
4. Normaliza fechas (1/8/2025 → 2025-08-01)
5. Limpia BOM y tabs automáticamente

### Paso 2: BASE PEDIDOS.xlsx

1. Gestión → Pedidos
2. Cargar XLSX
3. Genera alertas de:
   - Reconsulta en 7 días
   - Exceso medicamentos (>5)
   - Exceso laboratorio (≥5)
   - Exceso imágenes (≥2)

---

## 👤 Usuarios de Prueba

**Sin Entra ID configurado** (modo demo):

```
Auditor:
  Click "Prueba como Auditor"
  Email: auditor@metrored.com
  Rol: Auditor Médico
  Centro: CM Kennedy

Admin:
  Click "Prueba como Admin"
  Email: admin@metrored.com
  Rol: Administrador
```

**Con Entra ID** (producción):
Se integra automáticamente con tu tenant Azure.

---

## 🔧 Configuración Requerida para Producción

### Cloudflare

```toml
# backend/wrangler.toml ya incluye:
ENTRA_TENANT_ID    = "480bd49c-6f89-4faa-b39e-c7728d95d130"
ENTRA_CLIENT_ID    = "66130291-fc50-43f1-943c-6818dac1ba99"
ENTRA_API_AUDIENCE = "api://66130291-fc50-43f1-943c-6818dac1ba99"
ALLOWED_ORIGINS    = "https://metroredec.github.io"
```

Solo necesitas:
1. Crear D1 database
2. Ejecutar migraciones
3. Deploy

### GitHub Pages

```env
# frontend/.env.production necesita:
VITE_API_URL=https://flowapp-audit.<tu-account>.workers.dev/api
VITE_BASE_URL=/flowapp
```

Solo necesitas:
1. Actualizar la URL del Worker
2. Push al main
3. GitHub Actions auto-deploya

---

## 📋 Checklist de Despliegue

### Desarrollo ✓
- [ ] `npm run dev` en frontend funciona
- [ ] `wrangler dev` en backend funciona
- [ ] Login con test user funciona
- [ ] Dashboard muestra KPIs

### Producción ✓
- [ ] D1 creada y migraciones ejecutadas
- [ ] Worker publicado
- [ ] GitHub Pages configurado
- [ ] `.env.production` actualizado
- [ ] Primera publicación exitosa

### Datos ✓
- [ ] CSV cargado (592K registros)
- [ ] BASE PEDIDOS cargada
- [ ] Alertas generadas

---

## 🐛 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| "Cannot find module" | `rm -rf node_modules && npm install` |
| "Port 5173 in use" | `npm run dev -- --port 5174` |
| "Database not found" | `wrangler d1 create flowapp-audit-db` |
| "CORS error" | Verifica `ALLOWED_ORIGINS` en wrangler.toml |
| "GitHub Pages 404" | Verifica `VITE_BASE_URL=/flowapp` |

---

## 📞 Soporte

### Documentación en Orden

1. ⭐ **QUICKSTART.md** - Comienza aquí
2. **SETUP.md** - Instalación paso a paso
3. **README.md** - Referencia completa

### Logs

```bash
# Frontend
DevTools (F12) → Console tab

# Backend
wrangler tail

# Database
wrangler d1 execute flowapp-audit-db --command "SELECT * FROM audits;"
```

---

## 🎯 Próximas Mejoras (Opcionales)

1. **Integración con históricos reales** - Conectar a base de datos médica existente
2. **Reportes avanzados** - Gráficas adicionales (Recharts, Chart.js)
3. **Notificaciones** - Email/SMS para retroalimentación
4. **Exportación a múltiples formatos** - Excel, PowerPoint
5. **API de terceros** - Para integración con HIS
6. **Analytics** - Seguimiento de métricas a largo plazo

---

## 📄 Licencia & Atribución

Desarrollado para **Metrored Centros Médicos** © 2025

Stack:
- React 18 (Meta)
- Vite (Evan You)
- Cloudflare Workers
- TypeScript (Microsoft)

---

## ✨ Resumen

### Lo que Recibiste

✅ SPA React 100% funcional
✅ Backend serverless (Cloudflare Workers)
✅ Autenticación Entra ID (OAuth 2.0)
✅ Base de datos D1 (SQLite)
✅ 8 KPIs operativos
✅ Carga de CSV y XLSX
✅ Generación de alertas automáticas
✅ Dashboard responsivo
✅ Documentación completa
✅ CI/CD con GitHub Actions
✅ Listo para GitHub Pages
✅ Pronto para producción

### Tiempo de Setup

- **Desarrollo:** 5 minutos
- **Producción:** 15 minutos
- **Primeros datos:** 5 minutos

### Siguiente Paso

Lee **QUICKSTART.md** y corre:

```bash
cd frontend && npm run dev
```

¡Listo para auditar! 🏥

---

**Documento generado:** Enero 2025
**Versión:** 1.0
**Estado:** Producción
