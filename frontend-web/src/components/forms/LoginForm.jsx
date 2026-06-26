import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (onLogin) {
        await onLogin(credentials);
      }
    } catch (err) {
      setError('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-xl p-8 animate-in fade-in zoom-in-95 duration-200">
      {/* Titre */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Connexion</h2>
        <p className="text-xs text-slate-500 mt-1.5">
          Accédez au portail de gestion du matériel de l’UFR/SEA
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-medium text-rose-600 animate-shake">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Adresse Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={credentials.email}
            onChange={handleChange}
            placeholder="jean.baptiste@ujkz.bf"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Mot de passe */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Mot de passe
            </label>
            <a href="#forgot" className="text-[11px] font-medium text-[#00428C] hover:underline">
              Oublié ?
            </a>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={credentials.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A3673] hover:bg-blue-800 text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-blue-900/10 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
        >
          {loading ? 'Connexion en cours...' : 'Se connecter →'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;