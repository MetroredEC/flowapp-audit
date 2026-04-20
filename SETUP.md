# 🚀 Guía de Instalación - AuditMed

Esta guía te lleva paso a paso para tener la aplicación funcionando en 15 minutos.

## ⚡ Quick Start (5 minutos)

### 1. Clonar y entrar al proyecto

```bash
git clone https://github.com/metroredec/flowapp-audit.git
cd flowapp-audit
```

### 2. Frontend - Dev Mode

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173` → Click "Prueba como Auditor"

### 3. Backend - Dev Mode (en otra terminal)

```bash
cd backend
npm install
wrangler dev
```

El Worker corre en `http://localhost:8787`

**¡Listo!** La app está funcionando localmente.

---

## 🔧 Instalación Completa (Para Producción)

### Requisitos Previos

- ✅ Node.js 18+
- ✅ Git
- ✅ Cuenta Cloudflare (gratuita)
- ✅ Cuenta GitHub
- ✅ Cuenta Azure (para Entra ID)

### Paso 1: Configurar Cloudflare

#### 1.1 Instalar Wrangler

```bash
npm install -g wrangler@latest
```

#### 1.2 Autenticarse

```bash
wrangler login
```

Sigue las instrucciones en el navegador.

#### 1.3 Crear base de datos D1

```bash
cd backend
wrangler d1 create flowapp-audit-db
```

Copia el `database_id` que aparece. Actualiza `wrangler.toml`:

```toml
[[d1_databases]]
binding       = "DB"
database_name = "flowapp-audit-db"
database_id   = "tu-database-id-aqui"
```

#### 1.4 Ejecutar migraciones

```bash
wrangler d1 execute flowapp-audit-db --file migrations/0001_init.sql
```

Verifica que se crearon las tablas:

```bash
wrangler d1 execute flowapp-audit-db --command "SELECT name FROM sqlite_master WHERE type='table';"
```

#### 1.5 Desplegar Backend

```bash
wrangler publish --env production
```

Nota la URL: `https://flowapp-audit.<account>.workers.dev`

### Paso 2: Configurar Frontend

#### 2.1 Variables de entorno

```bash
cd ../frontend
cp .env.example .env.production
```

Edita `.env.production`:

```env
VITE_API_URL=https://flowapp-audit.<account>.workers.dev/api
VITE_BASE_URL=/flowapp
VITE_ENTRA_CLIENT_ID=66130291-fc50-43f1-943c-6818dac1ba99
VITE_ENTRA_TENANT_ID=480bd49c-6f89-4faa-b39e-c7728d95d130
```

#### 2.2 Build

```bash
npm run build
```

Genera la carpeta `dist/`

### Paso 3: GitHub Pages

#### 3.1 Configurar repositorio

En GitHub, ve a **Settings → Pages**:

- Source: Deploy from a branch
- Branch: `gh-pages` → `/root`

#### 3.2 Publicar con GitHub Actions (Automático)

El archivo `.github/workflows/deploy-frontend.yml` automáticamente:

1. Detecta cambios en `frontend/`
2. Compila la app
3. Despliega a GitHub Pages

Solo haz push al main:

```bash
git add .
git commit -m "Deploy inicial"
git push origin main
```

**Tu app está en:** `https://tu-usuario.github.io/flowapp`

#### 3.3 O Publicar Manual

```bash
cd frontend
npm run deploy
```

---

## 🔐 Configurar Azure Entra ID (Producción)

### Paso 1: Registrar la aplicación

1. Ve a [Azure Portal](https://portal.azure.com)
2. **Azure Entra ID → App registrations → New registration**
3. Nombre: `AuditMed`
4. **Redirect URI:** 
   - Tipo: Web
   - URL: `https://tu-usuario.github.io/flowapp/auth/callback`

### Paso 2: Obtener credenciales

1. Ve a **Overview**
2. Copia:
   - **Application (client) ID** → `VITE_ENTRA_CLIENT_ID`
   - **Directory (tenant) ID** → `VITE_ENTRA_TENANT_ID`

### Paso 3: Crear Client Secret (Solo si necesitas auth real)

1. Ve a **Certificates & secrets → New client secret**
2. Expiration: 12 meses
3. Copia el valor → Guárdalo seguro (no se vuelve a mostrar)

Esto lo usarías en el backend (no en frontend por seguridad).

### Paso 4: Configurar permisos API

1. Ve a **API permissions**
2. **Add a permission → Microsoft Graph → Delegated permissions**
3. Busca y agrega:
   - `email`
   - `profile`
   - `openid`

---

## 📊 Cargar Datos Iniciales

### Archivo: ARC_AUDITORIA_MEDICA.csv

1. Descarga tu CSV con los registros médicos
2. En la app: **Dashboard → Cargar Datos**
3. Selecciona el CSV
4. Automáticamente se detectan 592K registros

El CSV debe tener estas columnas:

```
FECHA_ADMISION;CENTRO_MEDICO;ESPECIALIDAD;NOMBRE_MEDICO;ADMISION;HISTORIA CLINICA;NOMBRES COMPLETOS
24/3/2025;CM CONDADO;MEDICINA GENERAL;JORGE LUIS RODRIGUEZ;CEX012-10-0010889897;1721743498;NADIA NATALIA PALACIOS
```

### Archivo: BASE_PEDIDOS.xlsx

1. En la app: **Gestión → Pedidos**
2. Cargar XLSX
3. Automáticamente genera alertas de:
   - Reconsulta en 7 días
   - Exceso medicamentos
   - Exceso laboratorio
   - Exceso imágenes

---

## 🧪 Usuarios de Prueba

Sin Entra ID configurado, usa estos:

| Email | Rol | Centro |
|-------|-----|--------|
| auditor@metrored.com | Auditor | CM Kennedy |
| admin@metrored.com | Admin | - |

---

## ✅ Checklist de Despliegue

### Desarrollo Local ✓

- [ ] `cd frontend && npm run dev` funciona
- [ ] `cd backend && wrangler dev` funciona
- [ ] Login con test users funciona
- [ ] Dashboard carga KPIs

### Producción ✓

- [ ] Cloudflare D1 creada y migraciones ejecutadas
- [ ] Backend deploy exitoso
- [ ] Frontend `.env.production` configurado
- [ ] Frontend build sin errores
- [ ] GitHub Pages configurado en Settings
- [ ] Primera publicación exitosa
- [ ] CORS configurado (ALLOWED_ORIGINS)
- [ ] Entra ID app registrada en Azure

### Datos ✓

- [ ] CSV cargado en dashboard
- [ ] 592K registros procesados
- [ ] BASE PEDIDOS cargada
- [ ] Alertas generadas correctamente

---

## 🐛 Troubleshooting

### "Module not found" error

```bash
# Limpiar cache
rm -rf node_modules package-lock.json
npm install
```

### "Cannot find database_id"

```bash
# Listar tus bases de datos
wrangler d1 list

# Copiar el ID a wrangler.toml
```

### Frontend no conecta al backend

```bash
# Verificar CORS en wrangler.toml
ALLOWED_ORIGINS = "https://tu-usuario.github.io"

# Verificar que wrangler.toml tiene VITE_API_URL correcto
```

### GitHub Pages muestra 404

```bash
# Verifica que el base URL es correcto
VITE_BASE_URL=/flowapp

# Verifica que existe gh-pages branch
git branch -a
```

### Entra ID redirige mal

```bash
# Verifica Redirect URI en Azure Portal
# Debe ser exactamente:
# https://tu-usuario.github.io/flowapp/auth/callback
```

---

## 📚 Recursos Adicionales

- [Cloudflare Workers Tutorial](https://developers.cloudflare.com/workers/get-started/)
- [D1 Database Guide](https://developers.cloudflare.com/d1/get-started/)
- [GitHub Pages Setup](https://pages.github.com/)
- [Microsoft Entra ID Docs](https://learn.microsoft.com/en-us/entra/identity-platform/)
- [React Router Guide](https://reactrouter.com/start)

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs: `wrangler tail`
2. Abre DevTools (F12) en el navegador
3. Revisa la consola para errores
4. Crea un issue en GitHub

¡Listo para auditar! 🎉
