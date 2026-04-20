import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { getMetaStatus, round } from '../utils/helpers';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const DashboardPage: React.FC = () => {
  const { filters, setFilters } = useAppStore();
  const [kpis, setKpis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadedData, setUploadedData] = useState<any>(null);

  useEffect(() => {
    calculateKPIs();
  }, [filters]);

  const calculateKPIs = () => {
    setLoading(true);
    
    // Simulated KPI calculations
    const mockKpis = [
      {
        id: 'audits_completed',
        name: 'Auditorías Realizadas',
        value: 87,
        target: 100,
        unit: 'auditorías',
        status: getMetaStatus(87, 100),
      },
      {
        id: 'quality_compliance',
        name: 'Cumplimiento de Calidad',
        value: 92.5,
        target: 85,
        unit: '%',
        status: getMetaStatus(92.5, 85),
      },
      {
        id: 'vital_signs',
        name: 'Índice Signos Vitales',
        value: 88.3,
        target: 90,
        unit: '%',
        status: getMetaStatus(88.3, 90),
      },
      {
        id: 'exam_relevance',
        name: 'Pertinencia Exámenes',
        value: 91.2,
        target: 90,
        unit: '%',
        status: getMetaStatus(91.2, 90),
      },
      {
        id: 'clinical_guidelines',
        name: 'Adherencia a Guías',
        value: 89.7,
        target: 90,
        unit: '%',
        status: getMetaStatus(89.7, 90),
      },
      {
        id: 'auditor_completion',
        name: 'Cumplimiento Auditores',
        value: 96.5,
        target: 95,
        unit: '%',
        status: getMetaStatus(96.5, 95),
      },
      {
        id: 'feedback_compliance',
        name: 'Retroalimentación Oportuna',
        value: 85.2,
        target: 90,
        unit: '%',
        status: getMetaStatus(85.2, 90),
      },
      {
        id: 'reconsult_rate',
        name: 'Índice de Reconsulta',
        value: 12.4,
        target: 10,
        unit: '%',
        status: getMetaStatus(12.4, 10, 3),
      },
    ];

    setKpis(mockKpis);
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(worksheet);
          setUploadedData({ type: 'excel', rows });
        } catch (error) {
          console.error('Error parsing Excel:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith('.csv')) {
      reader.onload = (event) => {
        const csv = event.target?.result as string;
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            setUploadedData({ type: 'csv', rows: results.data });
          },
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard de Auditoría</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
            <input
              type="month"
              value={filters.month || ''}
              onChange={(e) => setFilters({ month: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
            <select
              value={filters.specialty || ''}
              onChange={(e) => setFilters({ specialty: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todas</option>
              <option value="Medicina General">Medicina General</option>
              <option value="Cardiología">Cardiología</option>
              <option value="Dermatología">Dermatología</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Centro Médico</label>
            <select
              value={filters.city || ''}
              onChange={(e) => setFilters({ city: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todos</option>
              <option value="Quito">Quito</option>
              <option value="Guayaquil">Guayaquil</option>
            </select>
          </div>
        </div>
      </div>

      {/* Upload section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Cargar Datos</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="w-full"
          />
          {uploadedData && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
              ✓ {uploadedData.rows.length} registros cargados correctamente
            </div>
          )}
        </div>
      </div>

      {/* KPIs Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
          <p className="mt-4 text-gray-600">Calculando KPIs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      )}

      {/* Details table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen Detallado</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-2 font-semibold">Métrica</th>
                <th className="text-right px-4 py-2 font-semibold">Valor Actual</th>
                <th className="text-right px-4 py-2 font-semibold">Meta</th>
                <th className="text-right px-4 py-2 font-semibold">Diferencia</th>
                <th className="text-center px-4 py-2 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map((kpi) => (
                <tr key={kpi.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{kpi.name}</td>
                  <td className="text-right px-4 py-3 font-semibold">
                    {round(kpi.value)}{kpi.unit}
                  </td>
                  <td className="text-right px-4 py-3">{kpi.target}{kpi.unit}</td>
                  <td className="text-right px-4 py-3">
                    {round(kpi.value - kpi.target)}{kpi.unit}
                  </td>
                  <td className="text-center px-4 py-3">
                    <StatusBadge status={kpi.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KPICard: React.FC<{ kpi: any }> = ({ kpi }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-t-4 border-t-blue-600">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-700 text-sm">{kpi.name}</h3>
        <StatusBadge status={kpi.status} />
      </div>
      <p className="text-3xl font-bold text-gray-900">
        {round(kpi.value)}{kpi.unit}
      </p>
      <p className="text-xs text-gray-600 mt-2">
        Meta: {kpi.target}{kpi.unit}
      </p>
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            kpi.status === 'green' ? 'bg-green-600' :
            kpi.status === 'yellow' ? 'bg-yellow-500' :
            'bg-red-600'
          }`}
          style={{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };

  const labels = {
    green: '✓ OK',
    yellow: '⚠ Atención',
    red: '✗ Crítico',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status as keyof typeof colors]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
};

export default DashboardPage;
