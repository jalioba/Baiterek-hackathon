import { auth } from './firebase/config';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Автоматически добавляет Firebase ID Token к каждому запросу
const request = async (path: string, options: RequestInit = {}) => {
  const user = auth.currentUser;
  const token = user ? await user.getIdToken() : null;
  
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'API Error');
  }
  
  return response.json();
};

// API методы
export const api = {
  // Auth & User Profile
  register: (data: any) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getProfile: () => request('/api/auth/me'),
  
  // Services
  getServices: (params?: Record<string, string>) =>
    request(`/api/services?${new URLSearchParams(params)}`),
  getService: (id: string) => request(`/api/services/${id}`),
  
  // Applications
  createApplication: (data: any) =>
    request('/api/applications', { method: 'POST', body: JSON.stringify(data) }),
  getMyApplications: () => request('/api/applications/my'),
  getApplication: (id: string) => request(`/api/applications/${id}`),
  submitApplication: (id: string) =>
    request(`/api/applications/${id}/submit`, { method: 'POST' }),
  updateApplicationStatus: (id: string, status: string, comment?: string) =>
    request(`/api/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comment }),
    }),
  
  // Integrations (моки)
  verifyEGov: (iin: string) =>
    request('/api/integrations/egov/verify', { method: 'POST', body: JSON.stringify({ iin }) }),
  submitToBPM: (applicationId: string) =>
    request('/api/integrations/bpm/submit', { method: 'POST', body: JSON.stringify({ applicationId }) }),
  signWithNCA: (documents: string[], pin: string) =>
    request('/api/integrations/nca/sign', { method: 'POST', body: JSON.stringify({ documents, pin }) }),
  
  // Analytics
  getAdminDashboard: () => request('/api/analytics/dashboard'),
  
  // AI
  getAIRecommendations: (answers: any) =>
    request('/api/ai/selector', { method: 'POST', body: JSON.stringify({ answers }) }),
  sendChatMessage: (messages: any[]) =>
    request('/api/ai/chat', { method: 'POST', body: JSON.stringify({ messages }) }),
};
