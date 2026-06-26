// src/services/api.js
import axios from 'axios';

// Instance Axios configurée avec l'URL de ton backend Django
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter automatiquement le Token JWT s'il existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// SERVICES AUTHENTIFICATION (SÉCURISÉ)
// ============================================================
export const authService = {
  // Connexion réelle au backend Django Simple JWT
  login: async (username, password) => {
    try {
      // 1. On récupère les tokens
      const response = await api.post('api/token/', { username, password });
      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;
      
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      // 2. SÉCURITÉ : On demande UNIQUEMENT les infos de l'utilisateur connecté
      // (Cela correspond à l'action @action(url_path='me') dans ton ViewSet Django)
      const userResponse = await api.get('api/utilisateurs/utilisateurs/me/');
      const userData = userResponse.data;

      // 3. On sauvegarde
      localStorage.setItem('user', JSON.stringify(userData));
      return { user: userData, access: accessToken };
    } catch (error) {
      console.error('Erreur de connexion API:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Inscription réelle liée à ton API
  register: async (userData) => {
    try {
      const response = await api.post('api/utilisateurs/utilisateurs/inscription/', userData); // Ajouté /inscription/
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'inscription API:", error);
      throw error;
    }
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
};

// ============================================================
// SERVICES STATISTIQUES (URLS CORRIGÉES POUR DJANGO)
// ============================================================

// Stats pour un étudiant/enseignant normal
export const getStatsUtilisateur = async () => {
  try {
    // Correspond à url_path='stats' dans ton UtilisateurViewSet
    const response = await api.get('api/utilisateurs/utilisateurs/stats/');
    return response.data;
  } catch (error) {
    return { totalMateriels: 0, empruntsActifs: 0, demandesEnAttente: 0, materielsEnRetard: 0 };
  }
};

// Stats pour l'Administrateur
export const getStatsAdmin = async () => {
  try {
    // Correspond à url_path='stats-admin' dans ton UtilisateurViewSet
    const response = await api.get('api/utilisateurs/utilisateurs/stats-admin/');
    return response.data;
  } catch (error) {
    return { total_materiels: 0, demandes_a_valider: 0, materiels_en_maintenance: 0, emprunts_en_retard_globaux: 0 };
  }
};

// ============================================================
// SERVICES MATÉRIELS & OPÉRATIONS
// ============================================================

// Récupère l'ensemble du catalogue de matériels
export const getMateriels = async () => {
  const response = await api.get('api/materiels/materiels/');
  return response.data.results || response.data;
};

// Récupère uniquement les emprunts de l'utilisateur connecté
export const getMesEmprunts = async () => {
  const response = await api.get('api/emprunts/mes-emprunts/');
  return response.data.results || response.data;
};

// Récupère les rendez-vous pris par l'utilisateur
export const getMesRendezVous = async () => {
  const response = await api.get('api/rendezvous/mes-rendezvous/');
  return response.data.results || response.data;
};

// Liste des notifications reçues
export const getMesNotifications = async () => {
  const response = await api.get('api/notifications/mes-notifications/');
  return response.data.results || response.data;
};

// [ADMIN] Liste globale des demandes d'emprunts en attente de validation
export const getEmpruntsEnAttente = async () => {
  const response = await api.get('api/emprunts/emprunts-en-attente/');
  return response.data.results || response.data;
};

// [ADMIN] Liste globale de tous les utilisateurs inscrits
export const getUtilisateurs = async () => {
  const response = await api.get('api/utilisateurs/utilisateurs/');
  return response.data.results || response.data;
};

// [TECHNICIEN / ADMIN] Liste de tous les matériels actuellement déclarés en panne
export const getMaintenanceEnCours = async () => {
  const response = await api.get('api/maintenance/maintenances/');
  return response.data.results || response.data;
};

export default api;