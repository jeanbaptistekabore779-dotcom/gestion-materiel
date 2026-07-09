// src/api/maintenance.js
import api from './api';

export const maintenanceAPI = {
  getAll:   ()         => api.get('maintenance/'),
  getById:  (id)       => api.get(`maintenance/${id}/`),
  create:   (data)     => api.post('maintenance/', data),
  update:   (id, data) => api.put(`maintenance/${id}/`, data),
  delete:   (id)       => api.delete(`maintenance/${id}/`),
};