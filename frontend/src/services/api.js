import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/api`;
  }
  return 'http://localhost:8000/api';
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartcrop_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

export const apiService = {
  // Authentication methods
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data?.access_token) {
      localStorage.setItem('smartcrop_auth_token', response.data.access_token);
      localStorage.setItem('smartcrop_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.access_token) {
      localStorage.setItem('smartcrop_auth_token', response.data.access_token);
      localStorage.setItem('smartcrop_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('smartcrop_auth_token');
    localStorage.removeItem('smartcrop_user');
  },

  getImageUrl: (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
    const base = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${base}${path.startsWith('/') ? path : '/' + path}`;
  },
  // Full composite crop analysis
  analyzeCrop: async (imageFileOrUrl, farmInputs) => {
    const formData = new FormData();
    if (imageFileOrUrl) {
      if (typeof imageFileOrUrl === 'string') {
        formData.append('image_url', imageFileOrUrl);
      } else {
        formData.append('image', imageFileOrUrl);
      }
    }
    formData.append('farm_inputs_json', JSON.stringify(farmInputs));

    const response = await api.post('/analyze', formData);
    return response.data;
  },

  // Standalone disease prediction
  predictDisease: async (imageFileOrUrl, cropType) => {
    const formData = new FormData();
    if (imageFileOrUrl) {
      if (typeof imageFileOrUrl === 'string') {
        formData.append('image_url', imageFileOrUrl);
      } else {
        formData.append('image', imageFileOrUrl);
      }
    }
    formData.append('crop_type', cropType);

    const response = await api.post('/disease/predict', formData);
    return response.data;
  },

  // Standalone yield prediction
  predictYield: async (farmInputs) => {
    const response = await api.post('/yield/predict', farmInputs);
    return response.data;
  },

  // Standalone risk prediction
  predictRisk: async (farmInputs) => {
    const response = await api.post('/risk/predict', farmInputs);
    return response.data;
  },

  // What-If Simulator
  runSimulation: async (baseInputs, perturbedInputs) => {
    const response = await api.post('/simulation', {
      base_inputs: baseInputs,
      perturbed_inputs: perturbedInputs,
    });
    return response.data;
  },

  // Weather Forecast
  getWeather: async (location = 'Central Valley') => {
    const response = await api.get(`/weather?location=${encodeURIComponent(location)}`);
    return response.data;
  },

  // History CRUD
  getHistory: async () => {
    const response = await api.get('/history');
    return response.data;
  },

  getHistoryById: async (id) => {
    const response = await api.get(`/history/${id}`);
    return response.data;
  },

  deleteHistory: async (id) => {
    const response = await api.delete(`/history/${id}`);
    return response.data;
  },

  // Model Metadata & System Health
  getModelsMetadata: async () => {
    const response = await api.get('/models');
    return response.data;
  },

  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // PDF Report URL helper
  getReportUrl: (id) => `${API_BASE_URL}/report/${id}`,
};

export default apiService;
