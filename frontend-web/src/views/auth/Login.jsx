import React, { useState } from 'react';
import api from '../../api/api'; 

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('api/token/', { username, password });
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      setIsSuccess(true);
      setMessage('Connexion réussie !');

      // Simulation basée sur ce que l'utilisateur tape pour le test
      const inputLower = username.toLowerCase();
      if (['admin', 'technicien', 'enseignant', 'etudiant'].includes(inputLower)) {
        onLoginSuccess(inputLower);
      } else {
        // Rôle par défaut si l'identifiant ne correspond pas à un mot-clé de test
        onLoginSuccess('etudiant');
      }
      
    } catch (error) {
      setIsSuccess(false);
      setMessage('Erreur de connexion. Vérifiez vos identifiants ou le serveur.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-50 rounded-full text-blue-600 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#1E40AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Gestion-Matériel</h2>
          <p className="text-sm text-gray-500 mt-1">Portail de gestion du matériel universitaire</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur / Matricule</label>
            <input 
              type="text" 
              required
              placeholder="Ex: N° Matricule ou login"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:bg-white transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:bg-white transition-all text-sm"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-2.5 px-4 bg-[#1E40AF] hover:bg-blue-800 text-white font-medium rounded-lg shadow-md transition-colors text-sm mt-2"
          >
            Se connecter
          </button>
        </form>

        {/* Message d'état (Succès / Erreur) */}
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm font-medium text-center ${isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

      </div>
      
      <p className="text-xs text-gray-400 mt-8 text-center">
        © 2026 Université Joseph KI-ZERBO. Tous droits réservés.
      </p>
    </div>
  );
}