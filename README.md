# 🏥 AuditMed - Sistema de Auditoría Médica

Sistema completo de auditoría médica con interfaz web moderna, integración con Azure Entra ID y backend serverless en Cloudflare Workers.

## 🎯 Características

- ✅ **Dashboard de KPIs** con 8 métricas de calidad
- ✅ **Gestión de Auditorías** con formularios dinámicos
- ✅ **Asignación Inteligente** de historias clínicas a auditores
- ✅ **Retroalimentación y Seguimiento** con Kanban
- ✅ **Análisis de Pedidos** (medicamentos, laboratorios, imágenes)
- ✅ **Generación de Alertas** automáticas
- ✅ **Autenticación Entra ID** (OAuth 2.0)
- ✅ **Persistencia en Cloudflare D1, R2, KV**
- ✅ **Exportación PDF/CSV**
- ✅ **Interfaz responsiva** para desktop y móvil

## 📦 Estructura del Proyecto

```
flowapp-audit/
├── frontend/                  # React SPA (GitHub Pages)
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/            # Páginas de la app
│   │   ├── utils/            # Funciones auxiliares
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── store.ts          # Zustand state management
│   │   └── types.ts          # TypeScript interfaces
│   ├── public/               # Assets estáticos
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/                   # Cloudflare Workers
│   ├── src/
│   │   ├── index.ts          # Router principal
│   │   ├── auth.ts           # Autenticación Entra ID
│   │   ├── audits.ts         # Endpoint de auditorías
│   │   ├── assignments.ts    # Endpoint de asignaciones
│   │   ├── feedback.ts       # Endpoint de retroalimentación
│   │   └── orders.ts         # Endpoint de pedidos
│   ├── migrations/
│   │   └── 0001_init.sql    # Schema D1
│   ├── package.json
│   ├── wrangler.toml         # Configuración Cloudflare
│   └── tsconfig.json
└── README.md
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18+
- Git
- Cuenta Cloudflare con D1, R2, KV habilitados
- Cuenta GitHub (para GitHub Pages)
- App registrada en Azure Entra ID

### 1. Clonar el Repositorio

```bash
git clone <tu-repo>
cd flowapp-audit
```

### 2. Backend - Cloudflare Workers

#### 2.1 Instalar dependencias

```bash
cd backend
npm install
```

#### 2.2 Configurar wrangler.toml

El archivo ya contiene los valores correctos. Verifica:

```toml
[vars]
ENTRA_TENANT_ID    = "480bd49c-6f89-4faa-b39e-c7728d95d130"
ENTRA_CLIENT_ID    = "66130291-fc50-43f1-943c-6818dac1ba99"
ENTRA_API_AUDIENCE = "api://66130291-fc50-43f1-943c-6818dac1ba99"
ALLOWED_ORIGINS    = "https://metroredec.github.io"
PLATFORM_URL       = "https://metroredec.github.io/flowapp"
```

#### 2.3 Crear la base de datos D1

```bash
wrangler d1 create flowapp-audit-db
```

Copia el `database_id` al `wrangler.toml`.

#### 2.4 Ejecutar migraciones

```bash
wrangler d1 execute flowapp-audit-db --file migrations/0001_init.sql
```

#### 2.5 Desplegar

```bash
wrangler publish
```

La URL será: `https://flowapp-audit.<tu-cuenta>.workers.dev`

### 3. Frontend - React + GitHub Pages

#### 3.1 Instalar dependencias

```bash
cd frontend
npm install
```

#### 3.2 Configurar variables de entorno

Crear `.env` en `frontend/`:

```env
VITE_API_URL=https://flowapp-audit.<tu-cuenta>.workers.dev/api
VITE_BASE_URL=/flowapp
VITE_ENTRA_CLIENT_ID=66130291-fc50-43f1-943c-6818dac1ba99
VITE_ENTRA_TENANT_ID=480bd49c-6f89-4faa-b39e-c7728d95d130
```

#### 3.3 Desarrollo local

```bash
npm run dev
```

Accede a `http://localhost:5173`

#### 3.4 Build para producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para GitHub Pages.

#### 3.5 Desplegar en GitHub Pages

Opción A: Con gh-pages

```bash
npm run deploy
```

Opción B: Manual

```bash
# Copiar dist/ a la rama gh-pages
git checkout gh-pages
cp -r frontend/dist/* .
git add .
git commit -m "Deploy"
git push origin gh-pages
```

Tu app estará en: `https://metroredec.github.io/flowapp`

## 👤 Usuarios de Prueba

### Sin Entra ID (Modo Demo)

En la pantalla de login, usa:

**Auditor**
- Email: `auditor@metrored.com`
- Rol: Auditor
- Centro: CM Kennedy

**Administrador**
- Email: `admin@metrored.com`
- Rol: Admin

### Con Entra ID (Producción)

Se sincroniza automáticamente con tus usuarios en Azure Entra ID.

## 📊 KPIs Implementados

1. **Auditorías Realizadas** - Contador y tendencia
2. **Cumplimiento de Calidad** - % HC con score ≥90%
3. **Índice Signos Vitales** - % HC con datos completos
4. **Pertinencia Exámenes** - % HC pertinentes
5. **Adherencia Guías Clínicas** - % de cumplimiento
6. **Cumplimiento Auditores** - Auditorías realizadas vs planificadas
7. **Retroalimentación Oportuna** - % con retroalimentación en plazo
8. **Índice de Reconsulta** - Pacientes con múltiples citas

Cada KPI tiene:
- Valor actual
- Meta
- Status semáforo (verde/amarillo/rojo)
- Filtros por mes, especialidad, ciudad

## 🔄 Flujo de Datos

```
ARC_AUDITORIA_MEDICA.csv
        ↓
[Frontend: Cargar CSV]
        ↓
[Backend: Procesar y almacenar en D1]
        ↓
[Dashboard: Mostrar registros filtrados]
        ↓
[Auditor: Asignar historias clínicas]
        ↓
[Auditor: Completar formulario de auditoría]
        ↓
[Backend: Guardar puntuación y recomendaciones]
        ↓
[Admin: Revisar hallazgos y generar alertas]
```

## 📁 Cargar Datos

### CSV (ARC_AUDITORIA_MEDICA)

1. Ir a Dashboard
2. Sección "Cargar Datos"
3. Seleccionar archivo CSV
4. Automáticamente se detectan columnas y se normalizan fechas

**Columnas soportadas:**
- FECHA_ADMISION
- CENTRO_MEDICO
- ESPECIALIDAD
- NOMBRE_MEDICO
- ADMISION
- HISTORIA CLINICA
- NOMBRES COMPLETOS

### XLSX (BASE PEDIDOS)

1. Ir a Gestión > Pedidos
2. Cargar archivo XLSX
3. Se generan automáticamente alertas de:
   - Reconsulta en 7 días
   - Exceso medicamentos (>5)
   - Exceso laboratorio (≥5)
   - Exceso imágenes (≥2)

## 🔐 Seguridad

### Entra ID Integration

- OAuth 2.0 Authorization Code Flow
- JWT validation con JWKS
- Sessiones en KV con TTL
- CORS restringido a origen configurado

### Privacidad

- Enmascaramiento de nombres y HC por defecto
- Hash de IDs de pacientes
- Datos sensibles solo en sesión de usuario
- Advertencia en login

### Almacenamiento

- D1: Datos transaccionales
- R2: Archivos (reportes, auditorías)
- KV: Sesiones con expiración

## 📤 Exportación

### PDF

- Reporte de auditoría individual
- Reporte por médico
- Reporte mensual resumen

```bash
# Automático desde botón en UI
# Usa jsPDF + html2canvas
```

### CSV

- Auditorías completadas
- Retroalimentación pendiente
- Alertas generadas

```bash
# Descargas directo desde tablas
```

### JSON

- Backup de todas las auditorías
- Import/Export para migración

## 🐛 Troubleshooting

### "Unauthorized" al iniciar sesión

- Verifica ENTRA_TENANT_ID y ENTRA_CLIENT_ID
- Confirma que la app está registrada en Azure
- Revisa los permisos de la app en Azure Entra ID

### CORS errors

- Verifica ALLOWED_ORIGINS en wrangler.toml
- Debe coincidir exactamente con la URL de la app

### D1 no conecta

- Ejecuta: `wrangler d1 list`
- Verifica database_id en wrangler.toml
- Ejecuta migraciones: `wrangler d1 execute flowapp-audit-db --file migrations/0001_init.sql`

### Frontend no carga datos

- Verifica VITE_API_URL apunta al worker correcto
- Abre DevTools > Network para ver llamadas a API
- Revisa logs del worker: `wrangler tail`

## 📚 Documentación Adicional

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 SQLite Database](https://developers.cloudflare.com/d1/)
- [Microsoft Entra ID](https://learn.microsoft.com/es-es/entra/identity/)
- [React Router](https://reactrouter.com/)
- [Zustand State Management](https://zustand-demo.vercel.app/)

## 📝 License

Desarrollo para Metrored Centros Médicos © 2025

## 👥 Contacto

Para soporte o reportar bugs, abre un issue en el repositorio.

---

**Última actualización:** Enero 2025
