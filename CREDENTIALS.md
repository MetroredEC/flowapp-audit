# 🔐 Credenciales de Prueba - AuditMed

## ⚠️ SEGURIDAD

**IMPORTANTE:** Estas credenciales son SOLO para desarrollo local. 

⛔ **NUNCA commities credenciales reales a Git**

---

## 👤 Usuarios de Prueba

### Auditor

- **Email:** auditor@metrored.com
- **Nombre:** Dr. Juan Carlos García
- **Rol:** Auditor
- **Especialidad:** Medicina General
- **Centro:** CM Kennedy
- **Permisos:**
  - Ver auditorías asignadas
  - Realizar auditorías
  - Generar reportes personales
  - Ver retroalimentación asignada

**Cómo usar:**
1. En pantalla de login, click **"Prueba como Auditor"**
2. Se crea sesión automática
3. Solo ve sus auditorías asignadas

### Administrador

- **Email:** admin@metrored.com
- **Nombre:** Dr. Gerente Médico
- **Rol:** Admin
- **Especialidad:** N/A
- **Centro:** Administración
- **Permisos:**
  - Ver todos los datos
  - Asignar auditorías
  - Gestionar usuarios
  - Configurar sistema
  - Ver logs de auditoría

**Cómo usar:**
1. En pantalla de login, click **"Prueba como Admin"**
2. Se crea sesión automática
3. Acceso a panel de Administración

### Otros Auditores (en users.json)

```json
{
  "id": "user-auditor-2",
  "username": "auditor2@metrored.com",
  "name": "Dra. María López Pérez",
  "specialty": "Cardiología",
  "center": "CM Cumbayá"
}

{
  "id": "user-auditor-3",
  "username": "auditor3@metrored.com",
  "name": "Dr. Roberto Sánchez",
  "specialty": "Cirugía General",
  "center": "CM Condado"
}
```

---

## 🔑 Credenciales Cloudflare (Desarrollo)

Archivo: `backend/wrangler.toml`

```toml
[vars]
ALLOWED_ORIGINS    = "http://localhost:5173"
ENTRA_TENANT_ID    = "480bd49c-6f89-4faa-b39e-c7728d95d130"
ENTRA_CLIENT_ID    = "66130291-fc50-43f1-943c-6818dac1ba99"
ENTRA_API_AUDIENCE = "api://66130291-fc50-43f1-943c-6818dac1ba99"
PLATFORM_URL       = "http://localhost:5173"
APP_ENV            = "development"
```

### Base de Datos D1

```
Database Name: flowapp-audit-db
Database ID: f53d9fe8-d1bd-4348-8b70-1ce299b5f247
```

Comando para conexión:
```bash
wrangler d1 execute flowapp-audit-db --command "SELECT * FROM users"
```

### KV Namespace

```
Namespace: KV
ID: 095661415d644f4b924b8f11173896f0
```

### R2 Bucket

```
Bucket Name: flowapp-files
Region: auto (cualquier región)
```

---

## 🔑 Credenciales Cloudflare (Producción)

Archivo: `backend/wrangler.toml` (env.production)

```toml
[env.production.vars]
ALLOWED_ORIGINS    = "https://metroredec.github.io"
ENTRA_TENANT_ID    = "480bd49c-6f89-4faa-b39e-c7728d95d130"
ENTRA_CLIENT_ID    = "66130291-fc50-43f1-943c-6818dac1ba99"
ENTRA_API_AUDIENCE = "api://66130291-fc50-43f1-943c-6818dac1ba99"
PLATFORM_URL       = "https://metroredec.github.io/flowapp"
APP_ENV            = "production"
```

---

## 🌐 Credenciales Azure Entra ID

```
Application Name: AuditMed
Application ID: 66130291-fc50-43f1-943c-6818dac1ba99
Tenant ID: 480bd49c-6f89-4faa-b39e-c7728d95d130
API Audience: api://66130291-fc50-43f1-943c-6818dac1ba99
```

### Scopes

```
- api://66130291-fc50-43f1-943c-6818dac1ba99/access_as_user
- User.Read
- email
- profile
```

### URIs de Redirección

**Desarrollo:**
```
http://localhost:5173/auth/callback
```

**Producción:**
```
https://metroredec.github.io/flowapp/auth/callback
```

---

## 🔓 Variables de Entorno - Frontend

Archivo: `frontend/.env`

```env
# API
VITE_API_URL=http://localhost:8787/api
VITE_BASE_URL=/flowapp

# Entra ID
VITE_ENTRA_CLIENT_ID=66130291-fc50-43f1-943c-6818dac1ba99
VITE_ENTRA_TENANT_ID=480bd49c-6f89-4faa-b39e-c7728d95d130

# App
VITE_APP_NAME=AuditMed
VITE_APP_VERSION=1.0.0
```

**Para Producción:**

```env
VITE_API_URL=https://flowapp-audit.<account>.workers.dev/api
VITE_BASE_URL=/flowapp
VITE_ENTRA_CLIENT_ID=66130291-fc50-43f1-943c-6818dac1ba99
VITE_ENTRA_TENANT_ID=480bd49c-6f89-4faa-b39e-c7728d95d130
```

---

## 🔒 GitHub Secrets (CI/CD)

Para auto-deployment, configura estos secrets:

### Frontend Deployment

En Settings > Secrets and variables > Actions:

```
VITE_API_URL = https://flowapp-audit.<account>.workers.dev/api
VITE_ENTRA_CLIENT_ID = 66130291-fc50-43f1-943c-6818dac1ba99
VITE_ENTRA_TENANT_ID = 480bd49c-6f89-4faa-b39e-c7728d95d130
```

### Backend Deployment

```
CLOUDFLARE_API_TOKEN = <tu-api-token>
CLOUDFLARE_ACCOUNT_ID = <tu-account-id>
```

Obtén estos valores:
1. https://dash.cloudflare.com/profile/api-tokens
2. https://dash.cloudflare.com/ (Account ID abajo a la izquierda)

---

## 🗂️ Base de Datos - Schema

### Tabla: users

```sql
SELECT * FROM users LIMIT 1;

id                | entra_id                    | username              | name              | email             | roles  | specialty        | center
user-auditor-1   | user-1@metrored...         | auditor@metrored...  | Dr. Juan Garcia   | auditor@...       | Auditor| Med General      | CM Kennedy
```

### Tabla: records

```sql
SELECT * FROM records LIMIT 1;

admision  | fecha_admision | centro_medico | especialidad | medico      | historia_clinica | nombres_completos
ADM-001   | 2025-01-01    | CM KENNEDY    | Med General  | Dr. Garcia  | 12345678        | Juan Perez Garcia
```

### Tabla: audits

```sql
SELECT * FROM audits LIMIT 1;

admision | auditor_id     | score | audit_date
ADM-001  | user-auditor-1 | 92.5  | 2025-01-15
```

---

## 🧪 Datos de Test

### CSV de Prueba

```csv
FECHA_ADMISION;CENTRO_MEDICO;ESPECIALIDAD;NOMBRE_MEDICO;ADMISION;HISTORIA CLINICA;NOMBRES COMPLETOS
01/01/2025;CM KENNEDY;Medicina General;Dr. Garcia;ADM-TEST-001;12345678;Test Patient One
02/01/2025;CM CONDADO;Cardiologia;Dr. Lopez;ADM-TEST-002;87654321;Test Patient Two
```

### Parámetros de Auditoría

Archivo: `frontend/public/data/parametros_auditoria.csv`

18 parámetros binarios (0/1) para evaluar:
- Signos vitales
- Antecedentes clínicos
- Examen físico
- Diagnóstico
- Tratamiento
- Exámenes
- Prescripción
- Seguimiento

---

## 🚀 URLs Locales vs Producción

| Servicio | Local | Producción |
|----------|-------|-----------|
| Frontend | http://localhost:5173 | https://metroredec.github.io/flowapp |
| API | http://localhost:8787/api | https://flowapp-audit.\<account\>.workers.dev/api |
| Auth Callback (Dev) | http://localhost:5173/auth/callback | https://metroredec.github.io/flowapp/auth/callback |

---

## 🔐 Buenas Prácticas

✅ **DO:**
- Usar variables de entorno para credenciales
- Guardar .env en .gitignore
- Rotación de API tokens cada 90 días
- Usar diferentes tokens para dev/prod
- Monitorear logs de acceso

❌ **DON'T:**
- Commitar credenciales en Git
- Compartir API tokens por email
- Usar mismas credenciales en dev/prod
- Dejar tokens en comentarios de código
- Exponer credentials en logs públicos

---

## 🔄 Rotación de Credenciales

### Cada 90 días:

1. **Cloudflare API Token:**
   ```bash
   # Generar nuevo en https://dash.cloudflare.com/profile/api-tokens
   # Actualizar en GitHub Secrets
   ```

2. **Entra ID (si es necesario):**
   ```bash
   # Azure Portal > Certificates & secrets > New client secret
   # Guardar en Cloudflare secure storage
   ```

3. **Revisar accesos:**
   - Logs de autenticación
   - Usuarios activos
   - Permisos otorgados

---

## ⚠️ En Caso de Compromiso

Si sospechas que las credenciales fueron comprometidas:

1. **INMEDIATAMENTE:**
   ```bash
   # Revocar API token
   # Revocar acceso en Azure
   # Cambiar contraseña de GitHub
   ```

2. **Luego:**
   ```bash
   # Generar nuevas credenciales
   # Actualizar en todos los entornos
   # Revisar logs de acceso
   # Notificar a equipo
   ```

3. **Verificar:**
   - D1 database: datos íntegros
   - R2 bucket: sin archivos extraños
   - KV namespace: sesiones limpias

---

## 📞 Soporte

Si necesitas resetear o actualizar credenciales:

1. Contacta al administrador de Cloudflare
2. Solicita acceso a Azure Portal
3. Crea issue privado en GitHub

---

**Última actualización:** Enero 2025

**⚠️ Estas credenciales son de DESARROLLO. Para PRODUCCIÓN, solicita al equipo de infraestructura.**
