import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Full composite crop analysis
  analyzeCrop: async (imageFile, farmInputs) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    formData.append('farm_inputs_json', JSON.stringify(farmInputs));

    const response = await api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Standalone disease prediction
  predictDisease: async (imageFile, cropType) => {
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    formData.append('crop_type', cropType);

    const response = await api.post('/disease/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
