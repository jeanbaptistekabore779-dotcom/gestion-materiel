import apiClient from './client';

export const authAPI = {
  // Connexion
  login: (credentials) => apiClient.post('/token/', credentials),
  
  // Inscription
  register: (data) => apiClient.post('/utilisateurs/utilisateurs/', data),
  
  // Profil
  getProfile: () => apiClient.get('/utilisateurs/utilisateurs/me/'),
};