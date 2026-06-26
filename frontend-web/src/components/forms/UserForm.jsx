import React, { useState } from 'react';

const UserForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    nom: initialData.nom || '',
    prenom: initialData.prenom || '',
    email: initialData.email || '',
    role: initialData.role || 'USER',
    filiere: initialData.filiere || '',
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8 my-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          {initialData.id ? 'Modifier le compte utilisateur' : 'Enregistrer un nouvel utilisateur'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Créez ou modifiez les accès pour les étudiants, enseignants et techniciens de l'UFR.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nom & Prénom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nom" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Nom
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              required
              value={formData.nom}
              onChange={handleChange}
              placeholder="Kaboré"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <div>
            <label htmlFor="prenom" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Prénom
            </label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              required
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Jean-Baptiste"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Email Professionnel */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Adresse Email Universitaire
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="exemple@ujkz.bf"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Rôle & Filière / Affectation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="role" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Rôle Système
            </label>
            <select
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="USER">Étudiant</option>
              <option value="ENSEIGNANT">Enseignant</option>
              <option value="TECHNICIEN">Technicien</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>

          <div>
            <label htmlFor="filiere" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Classe / Département
            </label>
            <input
              type="text"
              id="filiere"
              name="filiere"
              placeholder="Ex: Licence 3 Informatique"
              value={formData.filiere}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-[#00428C] hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-md shadow-blue-800/10 transition"
          >
            Enregistrer l'utilisateur
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;