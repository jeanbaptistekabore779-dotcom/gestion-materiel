// src/api/maintenance.js
import apiClient from './client';

export const maintenanceAPI = {
  getAll: () => apiClient.get('/maintenance/maintenances/'),
  getById: (id) => apiClient.get(`/maintenance/maintenances/${id}/`),
  create: (data) => apiClient.post('/maintenance/maintenances/', data),
  update: (id, data) => apiClient.put(`/maintenance/maintenances/${id}/`, data),
  delete: (id) => apiClient.delete(`/maintenance/maintenances/${id}/`),
};