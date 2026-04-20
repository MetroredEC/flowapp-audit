# 📊 KPIs - Sistema de Auditoría Médica

## Descripción General

Los Indicadores Clave de Desempeño (KPIs) miden la calidad de la atención médica y la adherencia a protocolos. Se actualizan en tiempo real a partir de los datos de auditoría.

---

## 1. Auditorías Realizadas

**Métrica:** Contador de auditorías completadas

**Fórmula:**
```
Auditorías Realizadas = COUNT(audits WHERE status = 'Completada')
```

**Meta:** Variable según el mes y cantidad de historias

**Interpretación:**
- Mide la productividad del equipo auditor
- Demuestra avance en el cronograma de auditoría
- Tendencia: debe aumentar progresivamente

**Acciones si no cumple:**
- Aumentar recursos auditores
- Revisar asignaciones de carga
- Extender el período de auditoría

---

## 2. Cumplimiento de Calidad en Registro Clínico

**Métrica:** Porcentaje de historias con score ≥90%

**Fórmula:**
```
% = (# HC con score ≥ 90%) / (Total HC auditadas) × 100
```

**Meta:** ≥ 85%

**Score de HC:** 
```
Score = (Parámetros con 1) / (Parámetros aplicables) × 100
```

**Status Semáforo:**
- 🟢 Verde: ≥ 85%
- 🟡 Amarillo: 80-84%
- 🔴 Rojo: < 80%

**Interpretación:**
- Indica calidad general de registros médicos
- Refleja adherencia a estándares de documentación
- Parámetros evaluados: anamnesis, examen físico, diagnóstico, tratamiento

**Hallazgos frecuentes:**
- Falta de documentación de signos vitales
- Diagnósticos sin justificación clínica
- Tratamientos sin dosis especificadas

---

## 3. Índice de Eficiencia en Toma de Signos Vitales

**Métrica:** % HC con signos vitales registrados completos

**Fórmula:**
```
% = (# HC con TA, FC, FR, SO2 registrados) / (Total HC auditadas) × 100
```

**Meta:** ≥ 90%

**Signos Vitales Requeridos:**
- TA (Tensión Arterial)
- FC (Frecuencia Cardíaca)
- FR (Frecuencia Respiratoria)
- SO2 (Saturación de Oxígeno)
- Temperatura (en urgencias)

**Status Semáforo:**
- 🟢 Verde: ≥ 90%
- 🟡 Amarillo: 85-89%
- 🔴 Rojo: < 85%

**Interpretación:**
- Signos vitales son base del diagnóstico
- Ausencia indica riesgo clínico
- Crítico en: Emergencia, Cirugía, Pediatría

---

## 4. Pertinencia de Exámenes Complementarios

**Métrica:** % HC con exámenes justificados

**Fórmula:**
```
% = (# HC marcadas como "Pertinente") / (Total HC auditadas) × 100
```

**Meta:** > 90%

**Criterios de Pertinencia:**
- Examen solicitado correlaciona con diagnóstico
- Cantidad apropiada para el diagnóstico
- No hay duplicación innecesaria

**Exámenes Evaluados:**
- Laboratorios: hemograma, bioquímica, etc.
- Imágenes: radiografía, ecografía, TAC, RM
- Otros: EKG, espirometría, etc.

**Status Semáforo:**
- 🟢 Verde: ≥ 90%
- 🟡 Amarillo: 85-89%
- 🔴 Rojo: < 85%

**Impacto:**
- Evita costos innecesarios
- Reduce exposición a radiación
- Mejora eficiencia diagnóstica

---

## 5. Cumplimiento de Guías de Práctica Clínica

**Métrica:** % HC que siguen protocolos institucionales

**Fórmula:**
```
% = (# HC con adherencia a guías) / (Total HC auditadas) × 100
```

**Meta:** ≥ 90%

**Guías Evaluadas por Especialidad:**

| Especialidad | Guías Principales |
|--------------|------------------|
| Medicina General | Manejo HTA, Diabetes, Infecciones |
| Cardiología | Arritmias, IAM, Insuficiencia Cardíaca |
| Gastroenterología | Úlcera péptica, ERGE, Pancreatitis |
| Neurología | Migrañas, ACV, Epilepsia |
| Cirugía | Profilaxis antibiótica, DVT |

**Status Semáforo:**
- 🟢 Verde: ≥ 90%
- 🟡 Amarillo: 85-89%
- 🔴 Rojo: < 85%

---

## 6. Cumplimiento de Auditorías por Auditor

**Métrica:** Auditorías realizadas vs planificadas por cada auditor

**Fórmula:**
```
% = (Auditorías realizadas) / (Auditorías planificadas) × 100
```

**Meta:** > 95%

**Interpretación:**
- Mide productividad individual
- Identifica auditores con retraso
- Base para incentivos y reconocimientos

**Desgloses:**
- Por mes
- Por especialidad
- Por centro médico

**Acciones si no cumple:**
- Revisar asignación de carga
- Capacitación adicional
- Recursos adicionales

---

## 7. Cumplimiento en Retroalimentación y Seguimiento

**Métrica:** % Hallazgos con retroalimentación oportuna

**Fórmula:**
```
% = (Hallazgos cerrados en plazo) / (Hallazgos totales) × 100
```

**Meta:** ≥ 90%

**Plazo Según Severidad:**

| Severidad | Plazo | Ejemplos |
|-----------|-------|----------|
| Crítica | 3 días | Error diagnóstico, medicación |
| Alta | 7 días | Incumplimiento guías |
| Media | 14 días | Documentación incompleta |
| Baja | 30 días | Recomendaciones |

**Status del Hallazgo:**
- 📋 Pendiente: Asignado, sin respuesta
- 📨 Enviado: Médico recibió, en revisión
- ✅ Cerrado: Resuelta y documentada

**KPI de Seguimiento:**
- Cierre en tiempo: ≥ 90%
- Documentación de correcciones: ≥ 80%
- Reauditoría de hallazgos críticos: ≥ 100%

---

## 8. Índice de Reconsulta Mensual

**Métrica:** % Pacientes con múltiples consultas misma especialidad

**Fórmula:**
```
% = (# pacientes con ≥2 citas en misma especialidad) / 
    (# pacientes únicos del mes) × 100
```

**Meta:** < 10% (indicador de control)

**Criterio:** Citas dentro de 7 días = reconsulta

**Interpretación:**
- Alto %: Puede indicar diagnósticos incompletos
- Bajo %: Buena resolución en primera consulta
- Varía por especialidad (Urgencia vs Control)

**Análisis Detallado:**
- Por especialidad
- Por médico
- Por diagnóstico

**Acciones si es alto:**
- Revisar calidad de diagnóstico
- Evaluación de médicos con alto índice
- Capacitación en criterios diagnósticos

---

## 9. Índices de Uso (Laboratorios e Imágenes)

**Métricas Adicionales:**

### Laboratorios
```
# Total de solicitudes de laboratorio
Promedio por consulta = Total / # consultas

Meta: Según especialidad
- Medicina General: 0.5-1.0 por consulta
- Cardiología: 1.0-1.5 por consulta
- Cirugía: 2.0-3.0 por consulta
```

### Imágenes
```
# Total de solicitudes de imagen
Promedio por consulta = Total / # consultas

Meta: Según especialidad
- Medicina General: 0.2-0.5 por consulta
- Traumatología: 1.0-1.5 por consulta
- Radiología: 2.0-3.0 por consulta
```

**Indicador:** Exceso sugiere práctica defensiva

---

## 🎯 Status Semáforo

### Cálculo de Status

```javascript
function getMetaStatus(value, target, tolerance = 5) {
  const diff = Math.abs(value - target);
  if (diff <= tolerance) return 'green';
  if (diff <= tolerance * 2) return 'yellow';
  return 'red';
}
```

### Interpretación

| Color | Rango | Acción |
|-------|-------|--------|
| 🟢 Verde | Meta ± 5% | Mantener |
| 🟡 Amarillo | Meta ± 10% | Monitorear |
| 🔴 Rojo | > Meta ± 10% | Intervenir |

---

## 📈 Desgloses Disponibles

Todos los KPIs se pueden filtrar por:

1. **Mes** - Temporal
2. **Ciudad** - Ubicación geográfica
3. **Centro Médico** - Instalación específica
4. **Especialidad** - Rama médica
5. **Médico** - Individual
6. **Auditor** - Por quién se audita

**Ejemplo:**
- KPI: "Cumplimiento de Calidad"
- Filtro: "Febrero 2025, Cardiology, CM Kennedy"
- Resultado: 87% solo para esa combinación

---

## 📊 Dashboard Views

### Vista Principal
- Grid de 8 KPI cards con status semáforo
- Valores actuales vs metas
- Tendencia (↑ ↓ →)

### Vista Detallada
- Tabla con métricas desglosadas
- Gráficos de tendencia temporal
- Comparativas entre grupos

### Vista de Drilldown
- Click en KPI abre detalles
- Filtros adicionales
- Datos a nivel de HC

---

## 🔧 Configuración de KPIs

Los KPIs se pueden personalizar en: `frontend/public/data/kpi-config.json`

```json
{
  "kpis": {
    "quality_compliance": {
      "name": "Cumplimiento de Calidad",
      "target": 85,
      "tolerance": 5,
      "unit": "%",
      "formula": "scoreGte90 / total",
      "enabled": true
    }
  }
}
```

---

## 📝 Notas Importantes

1. Los KPIs se **calculan en tiempo real** a partir de las auditorías guardadas
2. Requieren mínimo 10 auditorías para ser significativos
3. La mayoría son porcentajes (0-100%)
4. El "Índice de Reconsulta" es inverso (menor es mejor)
5. Se guardan en caché horariamente en KV para performance

---

## 🔗 Referencias

- **Norma ISO 9001:2015** - Gestión de Calidad
- **Resolución 2654 (MINSA Ecuador)** - Auditoría Médica
- **ICONTEC** - Estándares de Calidad en Salud

**Última actualización:** Enero 2025
