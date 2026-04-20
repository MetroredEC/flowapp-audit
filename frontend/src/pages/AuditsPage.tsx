import React, { useState } from 'react';

const AuditsPage: React.FC = () => {
  const [audits] = useState<any[]>([
    {
      id: 1,
      admision: 'ADM-001',
      medico: 'Dr. Juan García',
      especialidad: 'Medicina General',
      score: 92,
      fecha: '2025-01-15',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Auditorías</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Nueva Auditoría
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Admisión</th>
              <th className="px-6 py-3 text-left font-semibold">Médico</th>
              <th className="px-6 py-3 text-left font-semibold">Especialidad</th>
              <th className="px-6 py-3 text-right font-semibold">Score</th>
              <th className="px-6 py-3 text-left font-semibold">Fecha</th>
              <th className="px-6 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {audits.map((audit) => (
              <tr key={audit.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{audit.admision}</td>
                <td className="px-6 py-3">{audit.medico}</td>
                <td className="px-6 py-3">{audit.especialidad}</td>
                <td className="px-6 py-3 text-right">
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">
                    {audit.score}%
                  </span>
                </td>
                <td className="px-6 py-3">{audit.fecha}</td>
                <td className="px-6 py-3 text-center">
                  <button className="text-blue-600 hover:text-blue-800">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditsPage;
