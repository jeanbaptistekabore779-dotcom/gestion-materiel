// src/views/admin/Utilisateurs.jsx
import React, { useState } from 'react';
import DataTable from '../../components/DataTable';

export default function Utilisateurs() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', nom: '', prenom: '', email: '', role: 'ETUDIANT' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: users.length + 1,
      ...formData
    };
    setUsers([newUser, ...users]);
    setShowForm(false);
    setFormData({ username: '', nom: '', prenom: '', email: '', role: 'ETUDIANT' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Gestion des Utilisateurs</h3>
          <p className="text-xs text-slate-400">Enregistrez de nouveaux comptes pour la simulation.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-semibold px-4 py-2 bg-[#1E40AF] text-white rounded-xl hover:bg-blue-800 transition-colors"
        >
          {showForm ? '✕ Fermer' : '➕ Ajouter un utilisateur'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 max-w-xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Identifiant *</label>
              <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} placeholder="ex: saratou" className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Rôle</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border rounded-xl text-sm">
                <option value="ETUDIANT">Étudiant</option>
                <option value="ENSEIGNANT">Enseignant</option>
                <option value="TECHNICIEN">Technicien</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nom *</label>
              <input type="text" required value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Prénom *</label>
              <input type="text" required value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>
          </div>
          <button type="submit" className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl">💾 Créer le compte</button>
        </form>
      )}

      <DataTable
        title="Comptes Utilisateurs Enregistrés"
        headers={['ID', 'Identifiant', 'Nom & Prénom', 'Rôle']}
        data={users}
        renderRow={(user) => (
          <tr key={user.id} className="hover:bg-slate-50/50 transition-colors animate-fadeIn">
            <td className="px-6 py-4 text-slate-400 font-mono text-xs">#{user.id}</td>
            <td className="px-6 py-4 font-semibold text-slate-700">{user.username}</td>
            <td className="px-6 py-4">{user.prenom} {user.nom}</td>
            <td className="px-6 py-4">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">{user.role}</span>
            </td>
          </tr>
        )}
      />
    </div>
  );
}