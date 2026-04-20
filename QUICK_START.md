# ⚡ Quick Start - AuditMed

Inicia tu sistema de auditoría médica en 5 minutos.

## 1. Clonar y Configurar

```bash
# Clonar repositorio
git clone https://github.com/metroredec/flowapp-audit.git
cd flowapp-audit

# Instalar dependencias
npm install
npm run setup
```

## 2. Desarrollo Local

### Terminal 1: Backend

```bash
cd backend
npx wrangler login  # Primera vez solo
npm run dev
```

Accede a: `http://localhost:8787`

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

Accede a: `http://localhost:5173`

## 3. Login de Prueba

En la pantalla de login:

**Opción 1: Como Auditor**
```
Email: auditor@metrored.com
Rol: Auditor
```

**Opción 2: Como Admin**
```
Email: admin@metrored.com
Rol: Admin
```

No necesitas credenciales reales. Solo haz click en el botón.

## 4. Cargar Datos

1. Ve a Dashboard
2. Sección "Cargar Datos"
3. Selecciona tu CSV o Excel con los registros médicos
4. Automáticamente se cargan y se calculan los KPIs

### Formato de archivo

**CSV (ARC_AUDITORIA_MEDICA):**
```
FECHA_ADMISION;CENTRO_MEDICO;ESPECIALIDAD;NOMBRE_MEDICO;ADMISION;HISTORIA CLINICA;NOMBRES COMPLETOS
24/3/2025;CM CONDADO;MEDICINA GENERAL;JORGE LUIS RODRIGUEZ SALGAR;CEX012-10-0010889897;1721743498;NADIA NATALIA PALACIOS BOWEN
```

**Excel (BASE PEDIDOS):**
```
FECHA ADMISION | CENTRO_MEDICO | ESPECIALIDAD | # PEDIDOS IMG | # PEDIDOS LAB | # RECETAS
24/3/2025     | CM CONDADO    | MEDICINA    | 1            | 3            | 2
```

## 5. Ver KPIs

Dashboard muestra automáticamente:
- ✅ Auditorías realizadas
- ✅ Cumplimiento de calidad
- ✅ Índices de eficiencia
- ✅ Alertas del sistema

Con filtros por:
- Mes
- Especialidad
- Centro médico

## 6. Crear Auditoría

1. Ve a "Auditorías"
2. Botón "+ Nueva Auditoría"
3. Completa parámetros binarios (1/0/NA)
4. Sistema calcula score automáticamente
5. Genera recomendación

## 7. Desplegar a Producción

### Backend (Cloudflare Workers)

```bash
cd backend

# Autenticar (primera vez)
wrangler login

# Desplegar
npm run deploy
```

Tu URL: `https://flowapp-audit.<account>.workers.dev`

### Frontend (GitHub Pages)

```bash
cd frontend

# Build
npm run build

# Desplegar
npm run deploy
```

Tu URL: `https://github-user.github.io/flowapp-audit`

## 📊 Parámetros de Auditoría

Por defecto incluye 18 parámetros:

1. Signos vitales completos
2. Antecedentes clínicos
3. Medicamentos actuales
4. Alergias documentadas
5. Examen físico completo
6. Diagnóstico principal
7. Diagnósticos secundarios
8. Justificación diagnóstica
9. Solución terapéutica
10. Medicamentos pertinentes
11. Dosis apropiadas
12. Laboratorios ordenados
13. Imágenes apropiadas
14. Prescripción clara
15. Instrucciones al paciente
16. Seguimiento establecido
17. Cumplimiento guías
18. Documentación de evidencia

Editable en: `frontend/public/data/parametros_auditoria.csv`

## 🎯 KPIs Principales

| KPI | Meta | Status |
|-----|------|--------|
| Cumplimiento de Calidad | ≥85% | 🟢 Verde |
| Signos Vitales | ≥90% | 🟡 Amarillo |
| Pertinencia Exámenes | >90% | 🟢 Verde |
| Adherencia Guías | ≥90% | 🟡 Amarillo |
| Cumplimiento Auditores | >95% | 🟢 Verde |
| Retroalimentación Oportuna | ≥90% | 🟡 Amarillo |
| Índice Reconsulta | ≤10% | 🟡 Amarillo |

## 🔧 Configuración Básica

### Cambiar Estratificación

Edita: `frontend/public/data/estratificacion.json`

```json
{
  "specialties": {
    "Medicina General": {
      "minSample": 20,
      "samplingRate": 0.15
    }
  }
}
```

### Cambiar Centros Médicos

Edita: `frontend/public/data/centros.json`

```json
{
  "centers": [
    {
      "code": "CM KENNEDY",
      "name": "Centro Médico Kennedy",
      "city": "Quito"
    }
  ]
}
```

### Agregar Usuarios

Edita: `frontend/public/data/users.json`

## 🚨 Alertas Automáticas

El sistema genera alertas cuando:

| Condición | Umbral | Acción |
|-----------|--------|--------|
| Medicamentos | >5 | Revisar pertinencia |
| Laboratorios | ≥5 | Evaluar necesidad |
| Imágenes | ≥2 | Evaluar pertinencia |
| Reconsulta | ≤7 días | Investigar causa |

## 📱 Responsive Design

La app funciona en:
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

## 🔐 Privacidad

Por defecto:
- Nombres enmascarados (J*** G***)
- HC enmascaradas (***4098)
- IDs hasheados en sesión

Toggle "Mostrar datos reales" en settings (sesión local).

## 📤 Exportar Datos

1. **PDF** - Reporte completo con gráficas
2. **CSV** - Tabla de auditorías (Excel compatible)
3. **JSON** - Backup completo (import/export)

Botones en cada módulo.

## 🐛 Reportar Problemas

Si algo no funciona:

1. Abre DevTools (F12)
2. Ve a Console
3. Copia el error
4. Reporta en Issues de GitHub

## 📞 Contacto

- **Email**: tech@metrored.com
- **GitHub Issues**: [Reportar problema](https://github.com/metroredec/flowapp-audit/issues)
- **Docs**: Ver README.md para guía completa

---

¡Listo! Tu sistema de auditoría está activo. 🎉

**Próximo paso:** Importa tus datos y comienza a auditar.
