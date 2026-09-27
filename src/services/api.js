const rawBase = (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || import.meta.env.VITE_BACKEND_URL)) || '';
const API_BASE = rawBase 
  ? (rawBase.endsWith('/api') ? rawBase : `${rawBase.replace(/\/+$/, '')}/api`) 
  : '/api';

function getAuthHeader() {
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('sahayak_token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (e) {
    return {};
  }
}

async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const targetUrl = `${API_BASE}${cleanEndpoint}`;

  try {
    const response = await fetch(targetUrl, {
      ...options,
      headers
    });

    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const rawText = await response.text();
      if (rawText.trim().startsWith('<!DOCTYPE') || rawText.trim().startsWith('<html')) {
        data = { detail: `Server returned HTML page (${response.status}) instead of API response.` };
      } else {
        try {
          data = JSON.parse(rawText);
        } catch (e) {
          data = { detail: rawText || `HTTP error ${response.status}` };
        }
      }
    }

    if (!response.ok) {
      const errorMsg = data?.detail || data?.message || data?.error || (typeof data === 'string' ? data : `Request failed with status ${response.status}`);
      console.warn(`[Sahayak API Error] ${options.method || 'GET'} ${cleanEndpoint} (${response.status}):`, errorMsg);
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.status) throw err;
    console.warn(`[Sahayak API Network Error] ${options.method || 'GET'} ${cleanEndpoint}:`, err.message);
    const networkError = new Error(err.message || 'Network request failed. Please check your connection.');
    networkError.status = 0;
    throw networkError;
  }
}

export const api = {
  // Authentication & OTP APIs
  sendOtp: (identifier) => request('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ identifier })
  }),

  resendOtp: (identifier) => request('/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ identifier })
  }),

  verifyOtp: (identifier, otp, extraData = {}) => request('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ identifier, otp, ...extraData })
  }),

  // User & Profile APIs
  getCurrentUser: () => request('/users/me'),
  getDemoUser: () => request('/users/demo'),
  getProfile: () => request('/profile'),
  updateProfile: (profileData) => request('/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),

  // AI Chat APIs
  sendChatMessage: (message, language = 'en', input_mode = 'text', user_id = null, conversation_id = 'default') => request('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, language, input_mode, user_id, conversation_id })
  }),
  getChatHistory: () => request('/chat/history'),
  clearChatHistory: () => request('/chat/history', { method: 'DELETE' }),

  // Schemes APIs
  getSchemes: () => request('/schemes'),
  searchSchemes: (user_type, requirement, state) => request('/schemes/search', {
    method: 'POST',
    body: JSON.stringify({ user_type, requirement, state })
  }),

  // Knowledge Domain APIs
  getPmfby: () => request('/pmfby'),
  getPacs: () => request('/pacs'),
  getCooperative: () => request('/cooperative'),
  getFinancial: () => request('/financial'),
  getOfficialSources: () => request('/sources'),

  // RAG Search
  ragSearch: (query, category = null, limit = 5) => request('/rag/search', {
    method: 'POST',
    body: JSON.stringify({ query, category, limit })
  }),

  // Grievance APIs
  getGrievanceGuidance: (category, description) => request('/grievance/guidance', {
    method: 'POST',
    body: JSON.stringify({ category, description })
  }),
  draftGrievance: (grievanceData) => request('/grievance/draft', {
    method: 'POST',
    body: JSON.stringify(grievanceData)
  }),
  getGrievances: () => request('/grievances'),

  // Voice APIs
  synthesizeVoice: (text, language = 'hi') => request('/voice/synthesize', {
    method: 'POST',
    body: JSON.stringify({ text, language })
  }),
  transcribeVoice: (audioBlob, language = 'hi') => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'speech.wav');
    formData.append('language', language);
    return request('/voice/transcribe', {
      method: 'POST',
      body: formData
    });
  },

  // Admin APIs
  getAdminStats: () => request('/admin/stats'),
  getDocuments: () => request('/admin/documents'),
  uploadDocument: (formData) => request('/admin/documents/upload', {
    method: 'POST',
    body: formData
  }),
  reindexDocument: (doc_id) => request(`/admin/documents/index?doc_id=${doc_id}`, {
    method: 'POST'
  }),
  deleteDocument: (doc_id) => request(`/admin/documents/${doc_id}`, {
    method: 'DELETE'
  }),
  getHealth: () => request('/health')
};

export default api;
