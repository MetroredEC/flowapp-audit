import axios, { AxiosInstance } from 'axios';
import { useAppStore } from '../store';

let apiClient: AxiosInstance | null = null;

export const initApiClient = (baseURL: string = '/api') => {
  apiClient = axios.create({
    baseURL,
    timeout: 30000,
  });

  // Add auth interceptor
  apiClient.interceptors.request.use((config) => {
    const { session } = useAppStore.getState();
    if (session?.sessionId) {
      config.headers['X-Session-ID'] = session.sessionId;
    }
    return config;
  });

  // Handle 401 responses
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAppStore.getState().logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
};

export const getApiClient = (): AxiosInstance => {
  if (!apiClient) {
    initApiClient();
  }
  return apiClient!;
};

// Auth API
export const authAPI = {
  login: async (code: string, redirectUri: string) => {
    const client = getApiClient();
    return client.post('/auth/login', { code, redirectUri });
  },
  logout: async () => {
    const client = getApiClient();
    return client.post('/auth/logout');
  },
  getMe: async () => {
    const client = getApiClient();
    return client.get('/auth/me');
  },
};

// Audits API
export const auditsAPI = {
  list: async (month?: string, specialty?: string) => {
    const client = getApiClient();
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (specialty) params.append('specialty', specialty);
    return client.get(`/audits?${params.toString()}`);
  },
  create: async (data: any) => {
    const client = getApiClient();
    return client.post('/audits', data);
  },
  get: async (id: string) => {
    const client = getApiClient();
    return client.get(`/audits/${id}`);
  },
  update: async (id: string, data: any) => {
    const client = getApiClient();
    return client.put(`/audits/${id}`, data);
  },
};

// Assignments API
export const assignmentsAPI = {
  list: async (month?: string, auditorId?: string) => {
    const client = getApiClient();
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (auditorId) params.append('auditorId', auditorId);
    return client.get(`/assignments?${params.toString()}`);
  },
  create: async (data: any) => {
    const client = getApiClient();
    return client.post('/assignments', data);
  },
  update: async (id: string, data: any) => {
    const client = getApiClient();
    return client.put(`/assignments/${id}`, data);
  },
};

// Feedback API
export const feedbackAPI = {
  list: async (status?: string, month?: string) => {
    const client = getApiClient();
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (month) params.append('month', month);
    return client.get(`/feedback?${params.toString()}`);
  },
  create: async (data: any) => {
    const client = getApiClient();
    return client.post('/feedback', data);
  },
  update: async (id: string, data: any) => {
    const client = getApiClient();
    return client.put(`/feedback/${id}`, data);
  },
};

// Orders/Alerts API
export const ordersAPI = {
  process: async (rows: any[]) => {
    const client = getApiClient();
    return client.post('/orders/process', { rows });
  },
  listAlerts: async (type?: string, month?: string) => {
    const client = getApiClient();
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (month) params.append('month', month);
    return client.get(`/alerts?${params.toString()}`);
  },
};
