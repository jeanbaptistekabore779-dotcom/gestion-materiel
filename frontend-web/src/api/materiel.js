import apiClient from './client';

export const materielAPI = {
  // Liste des matériels
  getAll: () => apiClient.get('/materiels/materiels/'),
  
  // Détails d'un matériel
  getById: (id) => apiClient.get(`/materiels/materiels/${id}/`),
  
  // Ajouter
  create: (data) => apiClient.post('/materiels/materiels/', data),
  
  // Modifier
  update: (id, data) => apiClient.put(`/materiels/materiels/${id}/`, data),
  
  // Supprimer
  delete: (id) => apiClient.delete(`/materiels/materiels/${id}/`),
};