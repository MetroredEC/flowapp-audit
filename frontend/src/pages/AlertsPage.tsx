import React from 'react';

const AlertsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Alertas del Sistema</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Alertas de reconsulta, exceso de medicamentos, laboratorios e imágenes.</p>
      </div>
    </div>
  );
};

export default AlertsPage;
