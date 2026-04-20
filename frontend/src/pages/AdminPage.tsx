import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Administración</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Gestión de usuarios, configuración y auditoría de sistema.</p>
      </div>
    </div>
  );
};

export default AdminPage;
