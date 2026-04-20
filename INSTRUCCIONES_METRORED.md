# 🏥 Instrucciones Específicas para Metrored

Guía personalizada para el equipo de Metrored.

## 🎯 Tu Configuración

```
Frontend:  https://metroredec.github.io/flowapp
Backend:   https://flowapp-audit.<account>.workers.dev/api
Entra ID:  480bd49c-6f89-4faa-b39e-c7728d95d130
App ID:    66130291-fc50-43f1-943c-6818dac1ba99
Database:  flowapp-audit-db (D1)
Storage:   flowapp-files (R2)
Cache:     flowapp-kv (KV)
```

## ⚡ Inicio Rápido (15 min)

### 1. Clonar Repositorio

```bash
git clone https://github.com/metroredec/flowapp-audit.git
cd flowapp-audit
npm install
```

### 2. Backend Local

```bash
cd backend
npm install
npx wrangler login  # Ingresa credenciales Cloudflare
npm run dev
```

Accede: `http://localhost:8787`

### 3. Frontend Local

```bash
cd frontend
npm install
npm run dev
```

Accede: `http://localhost:5173`

### 4. Login de Prueba

Sin credenciales reales:
- **Email:** auditor@metrored.com (Auditor)
- **Email:** admin@metrored.com (Admin)

Solo click en el botón.

## 📊 Cargar Tus Datos

### Datos Médicos (ARC_AUDITORIA_MEDICA)

1. Dashboard > "Cargar Datos"
2. Selecciona tu archivo CSV
3. Se cargan automáticamente

**Formato esperado:**
```
FECHA_ADMISION;CENTRO_MEDICO;ESPECIALIDAD;NOMBRE_MEDICO;ADMISION;HISTORIA CLINICA;NOMBRES COMPLETOS
24/3/2025;CM CONDADO;MEDICINA GENERAL;...
```

### Pedidos (BASE PEDIDOS)

1. Gestión > Pedidos > Cargar
2. Selecciona XLSX
3. Sistema genera alertas automáticamente

## 🔧 Configuración Personalizada

### Cambiar Parámetros de Auditoría

Edita: `frontend/public/data/parametros_auditoria.csv`

```csv
id,nombre,descripcion,categoria,aplicable_a
19,Mi Parámetro,Descripción,Categoría,Todas
```

Reload la página. Se activa automáticamente.

### Cambiar Especialidades

Edita: `frontend/public/data/estratificacion.json`

```json
{
  "specialties": {
    "Mi Especialidad": {
      "minSample": 10,
      "samplingRate": 0.15,
      "riskLevel": "medio"
    }
  }
}
```

### Agregar Centros

Edita: `frontend/public/data/centros.json`

```json
{
  "centers": [
    {
      "code": "CM NUEVO",
      "name": "Centro Nuevo",
      "city": "Ciudad"
    }
  ]
}
```

### Agregar Auditores

Edita: `frontend/public/data/users.json`

```json
{
  "users": [
    {
      "id": "auditor-4",
      "username": "auditor4@metrored.com",
      "name": "Dr. Nuevo Auditor",
      "roles": ["Auditor"],
      "specialty": "Cardiología",
      "center": "CM Kennedy"
    }
  ]
}
```

## 🚀 Desplegar a Producción

### Backend

```bash
cd backend

# Una sola vez
wrangler login
npx wrangler d1 create flowapp-audit-db
npx wrangler d1 execute flowapp-audit-db --file migrations/0001_init.sql

# Cada deployment
npm run deploy
```

**Verifica:**
```bash
curl https://flowapp-audit.<account>.workers.dev/api/health
# {"status":"ok",...}
```

### Frontend

```bash
cd frontend

# Primero
npm run build

# Luego
npm run deploy
```

**Verifica:**
```
https://metroredec.github.io/flowapp
```

## 📈 KPIs para Metrored

Especialmente para ustedes:

| KPI | Meta | Acción |
|-----|------|--------|
| Auditorías/mes | 100+ | Aumentar si < 80 |
| Calidad | ≥85% | Investigar si < 80% |
| Reconsultas | ≤10% | Revisar si > 15% |
| Retroalimentación | ≥90% | Recordatorios si < 80% |

Filtros útiles:
- Por centro (CM Kennedy, CM Condado, etc)
- Por especialidad (Medicina General, Cardiología)
- Por mes
- Por auditor

## 🔐 Usuarios en Producción

Basados en Entra ID:

1. Cada usuario debe estar en:
   - Azure Entra ID (admin.microsoft.com)
   - Asignado a la app "flowapp"
   - Con rol "Auditor" o "Admin"

2. Al primer login:
   - Se crea automáticamente en la DB
   - Se sincroniza nombre y email
   - Se asignan permisos según rol

## 📤 Exportar Reportes

### PDF (Para directivos)

```
Dashboard > [Cada KPI] > Descargar PDF
```

Incluye:
- Gráfico del KPI
- Meta vs Actual
- Tendencia

### CSV (Para análisis)

```
Auditorías > Descargar CSV
```

Compatible con:
- Excel
- Power BI
- Google Sheets

### JSON (Para backup)

```
[Cualquier página] > Exportar JSON
```

Úsalo para:
- Backup completo
- Migración de datos
- Integración con otros sistemas

## 🐛 Problemas Frecuentes

### No puedo login

**Causa:** Credenciales Entra ID incorrectas

**Solución:**
```bash
# Verificar en wrangler.toml
cat backend/wrangler.toml | grep ENTRA
```

Debe coincidir con Azure Entra ID.

### Los datos no se guardan

**Causa:** D1 no está sincronizado

**Solución:**
```bash
cd backend
wrangler d1 execute flowapp-audit-db "SELECT COUNT(*) FROM audits;"
```

Debe retornar un número. Si da error, ejecutar migraciones.

### La página carga lento

**Causa:** Demasiados registros

**Solución:**

1. Usa filtros (mes, especialidad)
2. Exporta datos antiguos a CSV
3. Limpia base de datos

```bash
wrangler d1 execute flowapp-audit-db "
  DELETE FROM audits 
  WHERE audit_date < date('now', '-6 months');
"
```

## 📞 Soporte Metrored

Para preguntas:

- **Técnico:** tech@metrored.com
- **Negocio:** director@metrored.com
- **Emergencias:** +593-999-123456

## 📅 Mantenimiento Programado

### Semanal (Viernes 20:00-22:00)

- Backup de datos
- Verificación de logs
- Limpieza de caché

### Mensual (Primer sábado)

- Análisis de performance
- Actualización de parámetros
- Revisión de alertas

### Trimestral (Enero, Abril, Julio, Octubre)

- Actualización de dependencias
- Revisión de seguridad
- Planeación de mejoras

## ✅ Checklist Inicial

- [ ] Cloné el repositorio
- [ ] Instalé Node.js
- [ ] Ejecuté `npm install`
- [ ] Backend funciona en localhost:8787
- [ ] Frontend funciona en localhost:5173
- [ ] Login con auditor@metrored.com OK
- [ ] Cargué datos de prueba
- [ ] Dashboard muestra KPIs
- [ ] Exporté PDF sin errores
- [ ] Contacté a tech@metrored.com

## 🎓 Capacitación del Equipo

Para auditar:

1. **Video (5 min):** Workflow de auditoría
2. **Documentación:** README.md
3. **Sandbox:** Cuenta de prueba
4. **Soporte:** Chat en vivo

Para administradores:

1. **Docs:** DEPLOYMENT.md + MAINTENANCE.md
2. **Demo:** Setup en desarrollo
3. **Producción:** Paso a paso con tech
4. **On-call:** Rotación de soporte

---

**¡Listo para auditar!** 🎉

Cualquier pregunta: tech@metrored.com
