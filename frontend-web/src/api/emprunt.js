// src/api/emprunt.js
import api from './api';

export const empruntAPI = {
  getAll:   ()         => api.get('emprunts/'),
  getById:  (id)       => api.get(`emprunts/${id}/`),
  create:   (data)     => api.post('emprunts/', data),
  valider:  (id, data) => api.post(`emprunts/${id}/valider/`, data),
  refuser:  (id, data) => api.post(`emprunts/${id}/refuser/`, data),
  retourner:(id, data) => api.post(`emprunts/${id}/retourner/`, data),
};