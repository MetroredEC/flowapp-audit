import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { authAPI } from '../utils/api';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, session, logout, toggleSidebar, sidebarOpen } = useAppStore();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    logout();
    navigate('/login');
  };

  const isAdmin = user?.roles?.includes('Admin');

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 text-white transition-all duration-300 overflow-hidden`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold">AuditMed</h1>
          <p className="text-sm text-gray-400 mt-2">Sistema de Auditoría</p>
        </div>

        <nav className="space-y-2 px-4 py-4">
          <NavLink to="/dashboard" icon="📊">Dashboard</NavLink>
          <NavLink to="/audits" icon="📋">Auditorías</NavLink>
          <NavLink to="/assignments" icon="👥">Asignaciones</NavLink>
          <NavLink to="/feedback" icon="💬">Retroalimentación</NavLink>
          <NavLink to="/orders" icon="📦">Pedidos</NavLink>
          <NavLink to="/alerts" icon="🚨">Alertas</NavLink>
          {isAdmin && <NavLink to="/admin" icon="⚙️">Administración</NavLink>}
        </nav>

        <div className="border-t border-gray-700 mt-4 pt-4 px-4">
          <div className="text-sm">
            <p className="text-gray-400">Usuario</p>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium transition"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded text-gray-700"
            title={sidebarOpen ? 'Cerrar barra lateral' : 'Abrir barra lateral'}
          >
            ☰
          </button>
          <div className="flex-1 text-center">
            <h2 className="text-xl font-semibold text-gray-900">Auditoría Médica</h2>
          </div>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavLink: React.FC<{ to: string; icon: string; children: string }> = ({ to, icon, children }) => {
  const navigate = useNavigate();
  const isActive = window.location.pathname.endsWith(to);

  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full text-left px-4 py-2 rounded transition ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-800'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {children}
    </button>
  );
};

export default Layout;
