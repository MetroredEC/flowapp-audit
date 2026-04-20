# 🧪 Testing - AuditMed

Guía completa para testear la aplicación en desarrollo local.

## Inicio Rápido (5 minutos)

### 1. Setup

```bash
# Clonar y entrar
git clone <repo>
cd flowapp-audit

# Instalar todo
bash setup.sh

# O manual:
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Backend

```bash
cd backend
npm run dev
```

Deberías ver: `✨ Ready on http://localhost:8787`

### 3. Frontend (otra terminal)

```bash
cd frontend
npm run dev
```

Accede a: `http://localhost:5173`

### 4. Login

Haz click en **"Prueba como Auditor"** o **"Prueba como Admin"**

---

## Testing Detallado

### Backend Testing

#### Health Check
```bash
curl http://localhost:8787/api/health
```

Esperado:
```json
{
  "status": "ok",
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

#### Login (Simulado)
```bash
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"code":"test","redirectUri":"http://localhost:5173/auth/callback"}'
```

#### Get User Info
```bash
curl http://localhost:8787/api/auth/me \
  -H "X-Session-ID: test-session-123"
```

#### List Audits
```bash
curl "http://localhost:8787/api/audits?month=2025-01&specialty=Medicina%20General"
```

#### Create Audit
```bash
curl -X POST http://localhost:8787/api/audits \
  -H "Content-Type: application/json" \
  -H "X-Session-ID: test-session-123" \
  -d '{
    "admision": "ADM-001",
    "auditorId": "user-1",
    "specialty": "Medicina General",
    "medico": "Dr. Garcia",
    "parameters": {"1": 1, "2": 1, "3": 0},
    "score": 85,
    "recommendation": "Mejorar documentación"
  }'
```

#### Test CORS
```bash
curl -X OPTIONS http://localhost:8787/api/audits \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

Debería retornar headers con `Access-Control-Allow-Origin`.

### Frontend Testing

#### 1. Login Flow

**Test Manual:**
1. Abrir http://localhost:5173
2. Ver página de login
3. Click "Prueba como Auditor"
4. Debería redirigir a `/dashboard`
5. Usuario cargado: "Dr. Auditor"

**Test Admin:**
1. Abrir http://localhost:5173
2. Click "Prueba como Admin"
3. Debería verse botón "Administración" en sidebar
4. Otros usuarios no lo ven

#### 2. Dashboard

**Verificar:**
- [ ] 8 KPI cards visibles
- [ ] Semáforos en colores correctos
- [ ] Filtros (mes, especialidad, ciudad) funcionan
- [ ] Tabla detallada renderiza
- [ ] Uploader de archivo presente

**Test Uploader:**
1. Prepare un CSV de prueba
2. Click "Seleccionar archivo"
3. Debería mostrar: "✓ N registros cargados"

#### 3. Auditorías

**Test List:**
1. Navegar a "Auditorías"
2. Ver tabla con datos de ejemplo
3. Click en "Ver" abre detalle (placeholder)

**Test Create:**
1. Click "+ Nueva Auditoría"
2. Debería abrir modal/página de creación
3. Formulario con parámetros

#### 4. Asignaciones

**Test:**
1. Navegar a "Asignaciones"
2. Ver tabla de historias asignadas
3. Verificar round-robin (distribución balanceada)

#### 5. Retroalimentación

**Test Kanban:**
1. Navegar a "Retroalimentación"
2. Ver columnas: Pendiente | Enviado | Cerrado
3. Drag & drop de tarjetas (si está implementado)

#### 6. Alertas

**Test:**
1. Navegar a "Alertas"
2. Cargar archivo BASE PEDIDOS
3. Verificar alertas generadas:
   - EXCESS_MEDS (>5 recetas)
   - EXCESS_LAB (≥5 laboratorios)
   - EXCESS_IMAGING (≥2 imágenes)

#### 7. Admin

**Test (solo como Admin):**
1. Navegar a "Administración"
2. Gestión de usuarios
3. Logs de auditoría
4. Configuración del sistema

---

## Test Data

### CSV de Prueba

Crea `test-audit.csv`:

```csv
FECHA_ADMISION;CENTRO_MEDICO;ESPECIALIDAD;NOMBRE_MEDICO;ADMISION;HISTORIA CLINICA;NOMBRES COMPLETOS
01/01/2025;CM KENNEDY;Medicina General;Dr. Garcia;ADM-001;12345678;Juan Perez Garcia
02/01/2025;CM CONDADO;Cardiologia;Dr. Lopez;ADM-002;87654321;Maria Rodriguez Lopez
03/01/2025;CM CUMBAYA;Dermatologia;Dra. Martinez;ADM-003;11223344;Carlos Sanchez Martinez
```

### XLSX de Prueba (Base Pedidos)

Estructura esperada:
```
FECHA ADMISION | CENTRO_MEDICO | ESPECIALIDAD | NOMBRE_MEDICO | # RECETAS | # PEDIDOS LAB | # PEDIDOS IMG
01/01/2025     | CM KENNEDY    | Med Gen      | Dr. Garcia    | 6         | 5            | 2
```

---

## Performance Testing

### Bundle Size

```bash
cd frontend
npm run build
ls -lh dist/
```

Esperado: < 500KB (gzipped)

### Load Time

1. Abre DevTools (F12)
2. Pestaña Network
3. Recarga la página
4. Verifica:
   - DOMContentLoaded < 2s
   - Load < 3s
   - Largest Contentful Paint < 2.5s

### Database Query Performance

```bash
wrangler d1 execute flowapp-audit-db --command "
  SELECT 
    COUNT(*) as total,
    AVG(LENGTH(parameters)) as avg_params_size
  FROM audits
" --remote
```

---

## Unit Tests (Ejemplos)

### Helper Functions

```javascript
// Test: calculateScore
const params = { '1': 1, '2': 1, '3': 0, '4': null };
const score = calculateScore(params);
console.assert(score === 66.67, 'Score should be 66.67');

// Test: maskPatientName
const masked = maskPatientName('Juan Carlos Garcia');
console.assert(masked === 'J*** C***** G*****', 'Name should be masked');

// Test: getMetaStatus
const status = getMetaStatus(92, 85, 5);
console.assert(status === 'green', 'Status should be green');
```

### Running Tests

```bash
cd frontend
npm test  # Si tienes Jest/Vitest configurado
```

---

## Integration Testing

### End-to-End Flow

1. **Login**
   - Click "Prueba como Auditor"
   - Ver dashboard

2. **Upload Data**
   - Cargar CSV de ejemplo
   - Verificar en DB

3. **Create Audit**
   - Ir a "Auditorías"
   - Click "+ Nueva"
   - Rellenar formulario
   - Guardar

4. **Verify Storage**
   - Recargar página
   - Datos deben persistir

5. **Export**
   - Click "Exportar CSV"
   - Descargar archivo
   - Verificar estructura

---

## Common Test Cases

### Caso 1: Nuevo Auditor

```
Pasos:
1. Login como Auditor
2. Ver asignaciones personales
3. Seleccionar HC
4. Rellenar formulario (18 parámetros)
5. Calcular score
6. Guardar y pasar a siguiente

Verificar:
- Score correcto (parámetros válidos / total)
- Datos persistidos en DB
- Siguiente HC asignado
```

### Caso 2: Admin Revisa Hallazgos

```
Pasos:
1. Login como Admin
2. Navegar a "Retroalimentación"
3. Ver hallazgos pendientes
4. Filtrar por severidad
5. Mover a "Enviado"
6. Documentar evidencia de cierre

Verificar:
- KPI de retroalimentación actualiza
- Status persiste tras reload
```

### Caso 3: Generación de Alertas

```
Pasos:
1. Cargar BASE PEDIDOS (>5 recetas, ≥5 labs, ≥2 imágenes)
2. Sistema genera automáticamente alertas
3. Navegar a "Alertas"
4. Filtrar por tipo
5. Ver sugerencias de acción

Verificar:
- Alertas correctas por tipo
- Count matches datos cargados
- Sugerencias pertinentes
```

---

## Debugging

### Frontend Debugging

```javascript
// En consola del navegador
// Ver store state
console.log(useAppStore.getState());

// Monitorear cambios
useAppStore.subscribe((state) => {
  console.log('Store changed:', state);
});
```

### Backend Debugging

```bash
# Ver logs en tiempo real
wrangler tail

# Con filtros
wrangler tail --status error
wrangler tail --search "audits"
```

### Database Debugging

```bash
# Ver tablas
wrangler d1 execute flowapp-audit-db --command ".schema" --remote

# Ver datos
wrangler d1 execute flowapp-audit-db --command "SELECT * FROM audits LIMIT 5" --remote

# Contar registros
wrangler d1 execute flowapp-audit-db --command "SELECT COUNT(*) FROM audits" --remote
```

---

## Checklist de Testing

- [ ] Setup completo sin errores
- [ ] Backend levanta en localhost:8787
- [ ] Frontend levanta en localhost:5173
- [ ] Login funciona (ambos perfiles)
- [ ] Dashboard carga y muestra KPIs
- [ ] Upload de CSV procesa datos
- [ ] Auditorías CRUD funciona
- [ ] Score se calcula correctamente
- [ ] Alertas se generan
- [ ] KPIs se actualizan con datos nuevos
- [ ] Filtros funcionan en todos los módulos
- [ ] Exportación CSV/JSON funciona
- [ ] No hay errores en consola
- [ ] CORS no bloquea requests
- [ ] DB persiste datos
- [ ] Performance aceptable (< 3s load)

---

## Reportar Bugs

Si encuentras un bug:

```
Título: [ÁREA] Descripción breve

Descripción:
- Pasos para reproducir
- Resultado esperado
- Resultado actual
- Screenshots si aplica

Logs:
- Error de consola
- Stack trace
- Versión de Node.js
```

---

**Última actualización:** Enero 2025
