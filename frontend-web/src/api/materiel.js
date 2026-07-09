// src/api/materiel.js
import api from './api';

export const materielAPI = {
  getAll:   ()         => api.get('materiels/'),
  getById:  (id)       => api.get(`materiels/${id}/`),
  create:   (data)     => api.post('materiels/', data),
  update:   (id, data) => api.put(`materiels/${id}/`, data),
  delete:   (id)       => api.delete(`materiels/${id}/`),
};