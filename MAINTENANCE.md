# 🔧 Mantenimiento y Troubleshooting

Guía de solución de problemas comunes y tareas de mantenimiento.

## 📋 Índice

1. [Problemas Comunes](#problemas-comunes)
2. [Monitoreo](#monitoreo)
3. [Mantenimiento Preventivo](#mantenimiento-preventivo)
4. [Backups y Recuperación](#backups-y-recuperación)
5. [Performance Tuning](#performance-tuning)

---

## 🚨 Problemas Comunes

### 1. Login No Funciona

#### Síntoma: "Unauthorized" o token inválido

**Causa probable:** Entra ID mal configurado

**Solución:**

```bash
# Verificar wrangler.toml
cat backend/wrangler.toml | grep ENTRA

# Esperado:
# ENTRA_TENANT_ID    = "480bd49c-6f89-4faa-b39e-c7728d95d130"
# ENTRA_CLIENT_ID    = "66130291-fc50-43f1-943c-6818dac1ba99"

# Verificar en Azure Portal
# https://portal.azure.com
# App registrations > flowapp
# Overview > Application (client) ID
# Directory (tenant) ID
```

**Si sigue fallando:**

```bash
# Ver logs del worker
cd backend
wrangler tail --env production

# Buscar "Token verification failed"
```

---

### 2. CORS Errors

#### Síntoma: "Access to XMLHttpRequest blocked by CORS"

**Causa probable:** ALLOWED_ORIGINS mal configurado

**Solución:**

```bash
# En wrangler.toml (dev)
[vars]
ALLOWED_ORIGINS = "http://localhost:5173,http://localhost:3000"

# En wrangler.toml (prod)
[env.production.vars]
ALLOWED_ORIGINS = "https://metroredec.github.io"
```

**Verificar dominio exacto:**

```javascript
// En DevTools > Network > XHR
// Haz una llamada API y ve el encabezado:
// Request headers > Origin: https://metroredec.github.io

// Debe coincidir exactamente con ALLOWED_ORIGINS
```

---

### 3. D1 Database Not Found

#### Síntoma: "D1_ERROR: Database not found"

**Causa probable:** database_id incorrecto

**Solución:**

```bash
# Listar bases de datos
wrangler d1 list

# Output:
# ✓ Databases:
#  Name                 ID
#  flowapp-audit-db    f53d9fe8-d1bd-4348-8b70-1ce299b5f247

# Copiar el ID exacto a wrangler.toml
```

**Si la BD fue eliminada:**

```bash
# Recrear
wrangler d1 create flowapp-audit-db --environment production

# Ejecutar migraciones
wrangler d1 execute flowapp-audit-db --file migrations/0001_init.sql --env production
```

---

### 4. Frontend No Carga Datos

#### Síntoma: Dashboard vacío, sin KPIs

**Causa probable:** API URL incorrecto

**Solución:**

```bash
# Verificar frontend/.env
cat frontend/.env

# Debe tener:
VITE_API_URL=https://flowapp-audit.<tu-cuenta>.workers.dev/api

# No:
VITE_API_URL=http://localhost:8787/api  # (en producción)
```

**Verificar llamadas:**

```javascript
// DevTools > Network > XHR
// Haz clic en /audits
// Status debe ser 200, no 404 o 500

// Si 401: problema de autenticación (ver #1)
// Si 404: endpoint no existe o URL mal
// Si 500: error del servidor (ver logs del worker)
```

---

### 5. Build Falla

#### Síntoma: `npm run build` da error

**Causa probable:** TypeScript errors

**Solución:**

```bash
# Frontend
cd frontend

# Ver todos los errores
npx tsc --noEmit

# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install

# Build verbose
npm run build -- --debug

# Buscar línea con error
```

**Backend:**

```bash
cd backend

# Compilar TypeScript
npx tsc --noEmit

# Verificar sintaxis
npx eslint src/

# Si aún falla
npm ci
npm run build
```

---

### 6. Performance Lento

#### Síntoma: Página tarda >3s en cargar

**Causa probable:** Red lenta o muchos datos

**Solución:**

```bash
# Frontend - Analizar bundle
npm install -g webpack-bundle-analyzer

# Verificar tamaño
ls -lh frontend/dist/assets/

# Debe ser:
# main-*.js < 300KB
# vendor-*.js < 150KB

# Si es más grande, optimizar importes en src/
```

**Backend - Aumentar timeouts:**

```toml
# wrangler.toml
[limits]
timeout = 30000  # 30 segundos
```

---

### 7. Datos No Se Guardan

#### Síntoma: Creo auditoría pero desaparece al recargar

**Causa probable:** D1 no está persistiendo

**Solución:**

```bash
# Verificar que las migraciones corrieron
wrangler d1 execute flowapp-audit-db "SELECT COUNT(*) FROM audits;"

# Si da error: tabla no existe
# Ejecutar migraciones
wrangler d1 execute flowapp-audit-db --file migrations/0001_init.sql

# Si tabla existe pero vacía
# Verificar INSERT en audits.ts

# Ver datos guardados
wrangler d1 execute flowapp-audit-db "SELECT * FROM audits LIMIT 10;" --json
```

---

## 📊 Monitoreo

### Logs en Tiempo Real

```bash
# Backend
cd backend
wrangler tail --env production --format pretty

# Ver solo errores
wrangler tail --env production --status error
```

### Métricas Cloudflare

1. Abre: https://dash.cloudflare.com
2. Workers > flowapp-audit
3. Analytics > Requests, Errors, CPU time

### GitHub Pages Health

```bash
# Ver deployment status
curl -I https://metroredec.github.io/flowapp

# Status debe ser 200
```

### Database Size

```bash
# Ver tamaño D1
wrangler d1 execute flowapp-audit-db "
  SELECT 
    (SELECT COUNT(*) FROM audits) as audits,
    (SELECT COUNT(*) FROM assignments) as assignments,
    (SELECT COUNT(*) FROM feedback) as feedback,
    (SELECT COUNT(*) FROM alerts) as alerts;
" --json
```

---

## 🛡️ Mantenimiento Preventivo

### Diario

```bash
# Verificar logs
wrangler tail --env production --status error

# Si hay errores, investigar inmediatamente
```

### Semanal

```bash
# Backup de base de datos
wrangler d1 export flowapp-audit-db > backups/audit-$(date +%Y%m%d).sql

# Verificar que el archivo no esté vacío
wc -l backups/audit-*.sql

# Archivar en cloud
gsutil cp backups/audit-*.sql gs://your-bucket/
```

### Mensual

```bash
# Analizar performance
# https://dash.cloudflare.com > Performance

# Limpiar datos antiguos (>12 meses)
wrangler d1 execute flowapp-audit-db "
  DELETE FROM audits 
  WHERE audit_date < date('now', '-12 months');
"

# Purgar alerts resueltas
wrangler d1 execute flowapp-audit-db "
  DELETE FROM alerts 
  WHERE resolved = TRUE 
  AND created_at < date('now', '-90 days');
"

# Reindex database
wrangler d1 execute flowapp-audit-db "VACUUM;"
```

---

## 💾 Backups y Recuperación

### Hacer Backup Completo

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/mnt/backups/flowapp"
DATE=$(date +%Y%m%d_%H%M%S)
BUCKET="gs://your-backup-bucket"

mkdir -p $BACKUP_DIR

# D1 Database
wrangler d1 export flowapp-audit-db > $BACKUP_DIR/db_$DATE.sql

# R2 Files
wrangler r2 object list flowapp-files --recursive \
  > $BACKUP_DIR/r2_manifest_$DATE.txt

# Config
cp backend/wrangler.toml $BACKUP_DIR/wrangler_$DATE.toml
cp frontend/.env $BACKUP_DIR/env_$DATE.txt

# Upload to cloud
gsutil -m cp -r $BACKUP_DIR/* $BUCKET/

# Keep local backups (últimos 30 días)
find $BACKUP_DIR -mtime +30 -delete

echo "✅ Backup completado: $BACKUP_DIR"
```

**Ejecutar automáticamente:**

```bash
# Cron (Linux/Mac)
crontab -e
# 0 2 * * * /path/to/backup.sh

# Windows Task Scheduler
# Crear tarea que ejecute: backup.ps1
```

### Recuperar Backup

```bash
# Si la BD se corrupta

# 1. Exportar datos salvables
wrangler d1 export flowapp-audit-db > corrupted.sql

# 2. Recrear DB
wrangler d1 create flowapp-audit-db --environment production

# 3. Restaurar desde backup
wrangler d1 execute flowapp-audit-db < backups/audit-2025-01-20.sql

# 4. Verificar integridad
wrangler d1 execute flowapp-audit-db "PRAGMA integrity_check;"
```

---

## ⚡ Performance Tuning

### Frontend

```typescript
// src/App.tsx - Lazy loading
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const AuditsPage = React.lazy(() => import('./pages/AuditsPage'));

// Suspense fallback
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
  </Routes>
</Suspense>
```

### Backend - Indexing

```sql
-- En migrations/0001_init.sql
CREATE INDEX idx_audits_month_specialty 
ON audits(audit_date, specialty);

CREATE INDEX idx_feedback_status_date 
ON feedback(status, due_date);

CREATE INDEX idx_alerts_type_resolved 
ON alerts(type, resolved);
```

### Caché KV

```typescript
// src/index.ts
async function getCachedAudits(month: string, env: Env) {
  const cacheKey = `audits:${month}`;
  
  // Intentar desde caché
  const cached = await env.KV.get(cacheKey, 'json');
  if (cached) return cached;
  
  // Si no, consultar DB
  const result = await env.DB.prepare(
    'SELECT * FROM audits WHERE strftime("%Y-%m", audit_date) = ?'
  ).bind(month).all();
  
  // Guardar en caché (1 hora)
  await env.KV.put(
    cacheKey,
    JSON.stringify(result.results),
    { expirationTtl: 3600 }
  );
  
  return result.results;
}
```

---

## 🔄 Updates y Versioning

### Versión Frontal

```bash
# En package.json
"version": "1.0.0"

# Bump version
npm version minor  # 1.0.0 -> 1.1.0
npm version patch  # 1.0.0 -> 1.0.1

# Commit y tag
git push --tags
```

### Desplegar Actualización

```bash
# Backend
cd backend
# Cambiar código
npm run deploy

# Frontend
cd frontend
npm run build
npm run deploy

# GitHub Pages se actualiza automáticamente
```

### Rollback (si hay problemas)

```bash
# Frontend
git revert <commit>
git push origin main

# Backend
git checkout <commit>
npm run deploy
```

---

## 🆘 Emergencias

### Site Down (502/503)

```bash
# 1. Verificar status
curl https://flowapp-audit.<account>.workers.dev/api/health

# 2. Ver logs inmediatamente
wrangler tail --env production --status error

# 3. Si es error de DB
wrangler d1 execute flowapp-audit-db "SELECT 1;"

# 4. Si es error de código
# Rollback inmediato:
git checkout main
npm run deploy

# 5. Notificar al equipo
# Email a: tech@metrored.com
```

### Data Corruption

```bash
# 1. STOP all writes
# Cambiar permisos en D1 a read-only

# 2. Backup corrupted state
wrangler d1 export flowapp-audit-db > corrupted_$(date +%s).sql

# 3. Restore from last good backup
# Recrear DB y restaurar

# 4. Analyze what went wrong
# Revisar logs del período

# 5. Deploy fix
npm run deploy
```

---

## 📞 Escalation

Si un problema no se puede resolver:

1. **Documentar:** Captura de pantalla, logs, pasos
2. **Contactar:** tech@metrored.com
3. **GitHub:** Abrir issue con detalles
4. **SLA:** Respuesta en <2 horas (crítico)

---

**Última actualización:** Enero 2025  
**Versión:** 1.0
