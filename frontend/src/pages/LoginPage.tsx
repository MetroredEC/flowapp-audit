import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, setSession, setUser } = useAppStore();

  useEffect(() => {
    // Check if already logged in
    if (session) {
      navigate('/dashboard');
      return;
    }

    // Check for callback from Entra ID
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code) {
      handleCallback(code);
    }
  }, [session, navigate]);

  const handleCallback = async (code: string) => {
    try {
      // Store session with test data (in production, verify with backend)
      const testSession = {
        sessionId: 'test-session-' + Math.random().toString(36),
        user: {
          id: 'test-user-1',
          username: 'auditor@metrored.com',
          name: 'Dr. Auditor',
          email: 'auditor@metrored.com',
          roles: ['Auditor'],
        },
      };

      setSession(testSession);
      setUser(testSession.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Callback error:', error);
    }
  };

  const handleLoginClick = () => {
    // In production, redirect to Entra ID
    const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID || '66130291-fc50-43f1-943c-6818dac1ba99';
    const tenantId = import.meta.env.VITE_ENTRA_TENANT_ID || '480bd49c-6f89-4faa-b39e-c7728d95d130';
    const redirectUri = `${window.location.origin}${import.meta.env.VITE_BASE_URL || '/flowapp'}/auth/callback`;

    const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=api://66130291-fc50-43f1-943c-6818dac1ba99/.default`;

    window.location.href = authUrl;
  };

  const handleTestLogin = (role: 'Auditor' | 'Admin') => {
    const testSession = {
      sessionId: 'test-session-' + Math.random().toString(36),
      user: {
        id: `test-user-${role}`,
        username: `${role.toLowerCase()}@metrored.com`,
        name: role === 'Admin' ? 'Dr. Administrador' : 'Dr. Auditor',
        email: `${role.toLowerCase()}@metrored.com`,
        roles: [role],
        specialty: role === 'Auditor' ? 'Medicina General' : undefined,
        center: role === 'Auditor' ? 'CM Kennedy' : undefined,
      },
    };

    setSession(testSession);
    setUser(testSession.user);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AuditMed</h1>
          <p className="text-gray-600">Sistema de Auditoría Médica</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleLoginClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Iniciar sesión con Microsoft Entra ID
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Modo de prueba</span>
            </div>
          </div>

          <button
            onClick={() => handleTestLogin('Auditor')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition text-sm"
          >
            Prueba como Auditor
          </button>

          <button
            onClick={() => handleTestLogin('Admin')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition text-sm"
          >
            Prueba como Admin
          </button>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> Esta es una demostración. En producción, usa tu cuenta Microsoft.
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2025 Metrored - Centros Médicos</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
