import axios from 'axios';

export const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

export const fetchMachines = async () => {
  const res = await api.get('/machines');
  return res.data;
};

export const fetchMachineDetail = async (machineId: string) => {
  const res = await api.get(`/machines/${machineId}`);
  return res.data;
};

export const fetchMachineShap = async (machineId: string) => {
  const res = await api.get(`/machines/${machineId}/shap`);
  return res.data;
};

export const fetchPredictions = async (limit = 50) => {
  const res = await api.get(`/predictions?limit=${limit}`);
  return res.data;
};

export const fetchEvents = async (limit = 100) => {
  const res = await api.get(`/mlops/events?limit=${limit}`);
  return res.data;
};

export const fetchModels = async () => {
  const res = await api.get('/mlops/models');
  return res.data;
};

export const fetchDriftStatus = async () => {
  const res = await api.get('/mlops/drift_status');
  return res.data;
};

export const triggerRetrain = async () => {
  const res = await api.post('/mlops/retrain');
  return res.data;
};

export const triggerRollback = async () => {
  const res = await api.post('/mlops/rollback');
  return res.data;
};

export const startStreamer = async (mode: string) => {
  const res = await api.post(`/streamer/start?mode=${mode}`);
  return res.data;
};

export const stopStreamer = async () => {
  const res = await api.post('/streamer/stop');
  return res.data;
};

export default api;
