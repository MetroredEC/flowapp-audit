# 🚀 Guía de Despliegue - AuditMed

## Tabla de Contenidos

1. [Backend en Cloudflare Workers](#backend-cloudflare-workers)
2. [Frontend en GitHub Pages](#frontend-github-pages)
3. [Configuración de Azure Entra ID](#configuración-entra-id)
4. [Testing y Validación](#testing-validación)
5. [Troubleshooting](#troubleshooting)

---

## Backend: Cloudflare Workers

### Requisitos

- Cuenta Cloudflare con acceso a:
  - Cloudflare Workers
  - D1 (Databases)
  - R2 (Object Storage)
  - KV (Key-Value Store)
- Node.js 18+
- Wrangler CLI

### Paso 1: Instalar Wrangler

```bash
npm install -g wrangler
```

### Paso 2: Autenticarse

```bash
wrangler login
```

Se abrirá una ventana del navegador. Inicia sesión en tu cuenta Cloudflare.

### Paso 3: Configurar Base de Datos D1

Editar `backend/wrangler.toml` y verificar:

```toml
[[d1_databases]]
binding       = "DB"
database_name = "flowapp-audit-db"
database_id   = "f53d9fe8-d1bd-4348-8b70-1ce299b5f247"
```

Si no tienes el ID, crea una nueva database:

```bash
cd backend
wrangler d1 create flowapp-audit-db --remote
```

Copia el `database_id` retornado al `wrangler.toml`.

### Paso 4: Ejecutar Migraciones

```bash
wrangler d1 execute flowapp-audit-db --file migrations/0001_init.sql --remote
```

Verifica que se crearon las tablas:

```bash
wrangler d1 execute flowapp-audit-db --command "SELECT name FROM sqlite_master WHERE type='table'" --remote
```

### Paso 5: Configurar R2 (Almacenamiento de Archivos)

Crear un bucket R2:

```bash
wrangler r2 bucket create flowapp-files
```

Actualizar `wrangler.toml`:

```toml
[[r2_buckets]]
binding     = "FILES"
bucket_name = "flowapp-files"
```

### Paso 6: Configurar KV (Sesiones)

Crear un namespace KV:

```bash
wrangler kv:namespace create "KV"
```

Actualizar `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "KV"
id      = "<id-retornado>"
```

### Paso 7: Configurar Variables de Entorno

En `wrangler.toml`, actualizar:

```toml
[vars]
ALLOWED_ORIGINS    = "https://metroredec.github.io"
ENTRA_TENANT_ID    = "480bd49c-6f89-4faa-b39e-c7728d95d130"
ENTRA_CLIENT_ID    = "66130291-fc50-43f1-943c-6818dac1ba99"
ENTRA_API_AUDIENCE = "api://66130291-fc50-43f1-943c-6818dac1ba99"
PLATFORM_URL       = "https://metroredec.github.io/flowapp"
APP_ENV            = "production"
```

### Paso 8: Deploy a Producción

```bash
cd backend
npm install
wrangler publish --env production
```

Deberías ver:

```
✨ Successfully published your worker to
  https://flowapp-audit.<account-name>.workers.dev
```

**Anota esta URL** - la necesitarás para el frontend.

---

## Frontend: GitHub Pages

### Requisitos

- Repositorio GitHub
- Node.js 18+

### Paso 1: Configurar Repositorio

1. Crea un repositorio en GitHub (ej: `flowapp-audit`)
2. Clona el proyecto:

```bash
git clone https://github.com/tu-usuario/flowapp-audit.git
cd flowapp-audit
```

### Paso 2: Configurar Variables de Entorno

Copia el archivo de ejemplo:

```bash
cp frontend/.env.example frontend/.env
```

Edita `frontend/.env`:

```env
VITE_API_URL=https://flowapp-audit.<account-name>.workers.dev/api
VITE_BASE_URL=/flowapp
VITE_ENTRA_CLIENT_ID=66130291-fc50-43f1-943c-6818dac1ba99
VITE_ENTRA_TENANT_ID=480bd49c-6f89-4faa-b39e-c7728d95d130
```

### Paso 3: Build Local (Testing)

```bash
cd frontend
npm install
npm run build
```

Verifica que se cree la carpeta `dist/`.

### Paso 4: Configurar GitHub Pages

1. Ve a **Settings > Pages**
2. En "Source", selecciona **"Deploy from a branch"**
3. Selecciona **`gh-pages`** branch
4. Click en **"Save"**

### Paso 5: Crear Secrets de GitHub Actions

1. Ve a **Settings > Secrets and variables > Actions**
2. Crea los siguientes secrets:

```
VITE_API_URL=https://flowapp-audit.<account-name>.workers.dev/api
VITE_ENTRA_CLIENT_ID=66130291-fc50-43f1-943c-6818dac1ba99
VITE_ENTRA_TENANT_ID=480bd49c-6f89-4faa-b39e-c7728d95d130
```

Para el backend (deploy automático):

```
CLOUDFLARE_API_TOKEN=<tu-api-token>
CLOUDFLARE_ACCOUNT_ID=<tu-account-id>
```

Obtén estos valores desde:
- API Token: https://dash.cloudflare.com/profile/api-tokens
- Account ID: https://dash.cloudflare.com/

### Paso 6: Commit e Push

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

GitHub Actions ejecutará automáticamente el deploy.

### Paso 7: Verificar Despliegue

1. Ve a **Actions** en tu repositorio
2. Verifica que el workflow `Deploy Frontend to GitHub Pages` pasó
3. Tu app estará en: `https://tu-usuario.github.io/flowapp`

---

## Configuración: Entra ID

### Requisitos

- Acceso a Azure Portal (https://portal.azure.com)
- Permisos para crear aplicaciones

### Paso 1: Registrar Aplicación

1. Ve a **Azure Active Directory > App registrations**
2. Click en **"New registration"**
3. Rellena:
   - Name: `AuditMed`
   - Supported account types: `Single tenant`
4. Click **"Register"**

### Paso 2: Configurar URIs de Redirección

1. Ve a **Authentication**
2. Click **"Add a platform"**
3. Selecciona **"Single-page application"**
4. Añade URIs:
   ```
   http://localhost:5173/auth/callback (desarrollo)
   https://tu-usuario.github.io/flowapp/auth/callback (producción)
   ```
5. Click **"Save"**

### Paso 3: Crear API Scope

1. Ve a **Expose an API**
2. Click **"Set"** junto a "Application ID URI"
3. Acepta el valor predeterminado (api://[client-id])
4. Click **"Add a scope"**
5. Rellena:
   - Scope name: `access_as_user`
   - Admin consent display name: `Access AuditMed`
   - Admin consent description: `Allows the app to access AuditMed as the signed-in user`
6. Click **"Add scope"**

### Paso 4: Configurar Permisos

1. Ve a **API permissions**
2. Click **"Add a permission"**
3. Selecciona **"Microsoft Graph"**
4. Selecciona **"Delegated permissions"**
5. Busca y selecciona:
   - `User.Read`
   - `email`
   - `profile`
6. Click **"Add permissions"**

### Paso 5: Obtener Credenciales

1. Ve a **Overview**
2. Copia:
   - `Client ID`
   - `Tenant ID` (Directory ID)

Estas deben coincidir con los valores en `wrangler.toml`:

```toml
ENTRA_CLIENT_ID    = "<Client ID>"
ENTRA_TENANT_ID    = "<Tenant ID>"
```

**Nota:** Para aplicaciones de producción con backend-to-backend, necesitarás crear un **Client Secret**:

1. Ve a **Certificates & secrets**
2. Click **"New client secret"**
3. Copia el valor inmediatamente (no se puede ver después)
4. Este valor debe almacenarse de forma segura en Cloudflare

---

## Testing y Validación

### Test Local del Backend

```bash
cd backend
npm run dev
```

Deberías ver:

```
⛅ wrangler (development)
▲ [00:00:00.000] Ready on http://localhost:8787
```

Prueba el health check:

```bash
curl http://localhost:8787/api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

### Test Local del Frontend

```bash
cd frontend
npm run dev
```

Abre http://localhost:5173

Deberías ver la pantalla de login. Prueba ambos botones:
- "Prueba como Auditor"
- "Prueba como Admin"

### Test de Base de Datos

```bash
wrangler d1 execute flowapp-audit-db --command "SELECT COUNT(*) FROM users" --remote
```

### Test de Integración

1. Haz login en el frontend local
2. Ve a Dashboard
3. Carga un archivo CSV
4. Verifica que aparezcan los datos

---

## Troubleshooting

### Error: "Database not found"

```
Error: D1 error: database not found
```

**Solución:**

```bash
# Listar todas las databases
wrangler d1 list

# Crear si no existe
wrangler d1 create flowapp-audit-db
```

### Error: "CORS blocked"

```
Access to XMLHttpRequest at 'https://...' from origin 'https://...' has been blocked
```

**Solución:**

Verifica en `wrangler.toml`:

```toml
[vars]
ALLOWED_ORIGINS = "https://metroredec.github.io"  # Debe coincidir exactamente
```

### Error: "Unauthorized" en Login

**Solución:**

1. Verifica ENTRA_CLIENT_ID y ENTRA_TENANT_ID
2. Comprueba que la app está registrada en Azure
3. Verifica los URIs de redirección en Azure
4. Chequea logs: `wrangler tail`

### Error: GitHub Actions falla

**Solución:**

1. Verifica que los secrets están configurados
2. Chequea que el `wrangler.toml` está válido
3. Revisa los logs en la pestaña "Actions"

---

## Monitoreo en Producción

### Logs de Cloudflare Workers

```bash
wrangler tail --format json
```

### Chequear D1 Database

```bash
wrangler d1 execute flowapp-audit-db --command "SELECT * FROM audits LIMIT 5" --remote
```

### Monitorear GitHub Pages

1. Ve a **Actions** en tu repositorio
2. Verifica que los deploys son exitosos
3. Chequea el sitio en producción

---

## Checklist de Despliegue Completo

- [ ] Backend instalado y funcionando localmente
- [ ] D1 database creada y migraciones ejecutadas
- [ ] R2 bucket configurado
- [ ] KV namespace configurado
- [ ] Variables de entorno en `wrangler.toml`
- [ ] Backend deployado a Cloudflare Workers
- [ ] Frontend instalado y construido localmente
- [ ] `.env` configurado con API URL del worker
- [ ] GitHub Pages habilitado
- [ ] Secrets de GitHub Actions configurados
- [ ] App Entra ID registrada
- [ ] URIs de redirección configuradas
- [ ] Frontend deployado a GitHub Pages
- [ ] Login funcionando (ambos métodos)
- [ ] Dashboard cargando datos
- [ ] KPIs calculando correctamente

---

## URLs Importantes

| Servicio | URL |
|----------|-----|
| GitHub Pages | https://metroredec.github.io/flowapp |
| Cloudflare Worker | https://flowapp-audit.\<account\>.workers.dev |
| API Base | https://flowapp-audit.\<account\>.workers.dev/api |
| D1 Dashboard | https://dash.cloudflare.com/databases |
| GitHub Repo | https://github.com/metroredec/flowapp-audit |
| Azure Portal | https://portal.azure.com |

---

## Soporte

Si encuentras problemas:

1. Revisa los logs: `wrangler tail`
2. Verifica la consola del navegador (F12)
3. Comprueba que todas las URLs y IDs son correctos
4. Abre un issue en el repositorio

**Última actualización:** Enero 2025
