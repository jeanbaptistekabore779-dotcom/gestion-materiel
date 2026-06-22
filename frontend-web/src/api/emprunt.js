import apiClient from './client';

export const empruntAPI = {
  // Liste des emprunts
  getAll: () => apiClient.get('/emprunts/emprunts/'),
  
  // Créer un emprunt
  create: (data) => apiClient.post('/emprunts/emprunts/', data),
  
  // Retourner un matériel
  retour: (id) => apiClient.put(`/emprunts/emprunts/${id}/retour/`),
};