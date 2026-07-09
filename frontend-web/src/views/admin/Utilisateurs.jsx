// src/views/admin/Utilisateurs.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import api from '../../api/api';

const emptyForm = {
  identifiant: '', mot_de_passe: '', email: '', nom: '', prenom: '',
  telephone: '', type_piece: 'CNIB', numero_piece: '',
  matricule: '', departement: '', role: 'ETUDIANT',
};

const ROLE_LABELS = {
  ETUDIANT: 'Étudiant',
  ENSEIGNANT: 'Enseignant',
  TECHNICIEN: 'Technicien',
  ADMIN: 'Administrateur',
};

const STATUT_STYLES = {
  ACTIF:     { label: 'Actif',     bg: 'bg-emerald-50', text: 'text-emerald-700' },
  SUSPENDU:  { label: 'Suspendu',  bg: 'bg-amber-50',   text: 'text-amber-700' },
  SIGNALE:   { label: 'Signalé',   bg: 'bg-rose-50',    text: 'text-rose-600' },
};

function StatutBadge({ statut }) {
  const c = STATUT_STYLES[statut] ?? STATUT_STYLES.ACTIF;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {c.label}
    </span>
  );
}

// ─── Modal Signaler aux autorités ──────────────────────────────────
function ModalSignaler({ user, onClose, onSuccess }) {
  const [motif, setMotif] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignaler = async () => {
    if (!motif.trim()) { setError('Le motif du signalement est obligatoire.'); return; }
    setLoading(true); setError('');
    try {
      await api.post(`utilisateurs/${user.id}/signaler/`, { motif });
      onSuccess('SIGNALE');
    } catch (err) {
      setError(err.response?.data?.error ?? 'Erreur lors du signalement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-rose-600 px-6 py-4 text-white">
          <h3 className="font-bold text-sm">Signaler aux autorités</h3>
          <p className="text-rose-100 text-xs mt-0.5">{user.prenom} {user.nom} — {user.identifiant}</p>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
            Le signalement est transmis à l'administration de l'UFR/SEA pour suite à donner (matériel non rendu, dégradation, etc.).
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Motif du signalement *</label>
            <textarea
              value={motif}
              onChange={e => setMotif(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
            />
          </div>
          {error && <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-xl">{error}</p>}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
              Annuler
            </button>
            <button
              onClick={handleSignaler}
              disabled={loading}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
            >
              {loading ? 'Envoi...' : '🚩 Confirmer le signalement'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Utilisateurs() {
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);
  const [modal, setModal]           = useState(null); // { type: 'signaler', user }
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('utilisateurs/');
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setUsers(data);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err.response?.data);
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  const handleOuvrirEdition = (user) => {
    setEditingId(user.id);
    setFormData({
      identifiant: user.identifiant ?? '',
      mot_de_passe: '', // non modifiable ici — le backend ne l'accepte pas en édition
      email: user.email ?? '',
      nom: user.nom ?? '',
      prenom: user.prenom ?? '',
      telephone: user.telephone ?? '',
      type_piece: user.type_piece ?? 'CNIB',
      numero_piece: user.numero_piece ?? '',
      matricule: user.matricule ?? '',
      departement: user.departement ?? '',
      role: user.role ?? 'ETUDIANT',
    });
    setError(null);
    setShowForm(true);
  };

  const handleOuvrirCreation = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError(null);
    setShowForm(true);
  };

  const handleFermer = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        // Édition : pas de mot_de_passe (le serializer d'update ne l'accepte pas)
        const { mot_de_passe, ...payload } = formData;
        await api.patch(`utilisateurs/${editingId}/`, payload);
      } else {
        await api.post('utilisateurs/', formData);
      }
      await fetchUsers();
      handleFermer();
    } catch (err) {
      console.error('Erreur enregistrement utilisateur:', err.response?.data);
      const serverError = err.response?.data;
      if (serverError && typeof serverError === 'object') {
        const msg = Object.entries(serverError)
          .map(([k, v]) => `${k} : ${Array.isArray(v) ? v[0] : v}`)
          .join(' | ');
        setError(msg);
      } else {
        setError("Erreur lors de l'enregistrement.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleSuspension = async (user) => {
    const suspendu = user.statut === 'SUSPENDU';
    const confirmMsg = suspendu
      ? `Réactiver le compte de ${user.prenom} ${user.nom} ?`
      : `Suspendre le compte de ${user.prenom} ${user.nom} ? Il ne pourra plus se connecter ni emprunter de matériel.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await api.post(`utilisateurs/${user.id}/suspendre/`);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, statut: res.data.statut } : u));
    } catch (err) {
      console.error('Erreur suspension:', err.response?.data);
      setError('Erreur lors de la mise à jour du statut.');
    }
  };

  const handleModalSuccess = (id, nouveauStatut) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, statut: nouveauStatut } : u));
    setModal(null);
  };

  return (
    <div className="space-y-6">

      {modal?.type === 'signaler' && (
        <ModalSignaler
          user={modal.user}
          onClose={() => setModal(null)}
          onSuccess={(s) => handleModalSuccess(modal.user.id, s)}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Gestion des Utilisateurs</h3>
          <p className="text-xs text-slate-400">Comptes étudiants, enseignants et techniciens de l'UFR/SEA.</p>
        </div>
        <button
          onClick={() => (showForm ? handleFermer() : handleOuvrirCreation())}
          className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
            showForm
              ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              : 'bg-[#1E40AF] text-white hover:bg-blue-800'
          }`}
        >
          {showForm ? '✕ Fermer' : '➕ Ajouter un utilisateur'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          ⚠️ {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-700 text-sm border-b border-slate-100 pb-2">
            {editingId ? `Modifier — ${formData.prenom} ${formData.nom}` : 'Nouveau compte utilisateur'}
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Identifiant *</label>
              <input
                type="text" required
                value={formData.identifiant}
                onChange={(e) => setFormData({ ...formData, identifiant: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Rôle</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              >
                <option value="ETUDIANT">Étudiant</option>
                <option value="ENSEIGNANT">Enseignant</option>
                <option value="TECHNICIEN">Technicien</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nom *</label>
              <input
                type="text" required
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Prénom *</label>
              <input
                type="text" required
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Email *</label>
              <input
                type="email" required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Téléphone *</label>
              <input
                type="text" required
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Type de pièce *</label>
              <select
                value={formData.type_piece}
                onChange={(e) => setFormData({ ...formData, type_piece: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              >
                <option value="CNIB">CNIB</option>
                <option value="PASSEPORT">Passeport</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">N° de pièce *</label>
              <input
                type="text" required
                value={formData.numero_piece}
                onChange={(e) => setFormData({ ...formData, numero_piece: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Matricule</label>
              <input
                type="text"
                value={formData.matricule}
                onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Département</label>
              <input
                type="text"
                value={formData.departement}
                onChange={(e) => setFormData({ ...formData, departement: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
          </div>

          {!editingId && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Mot de passe *</label>
              <input
                type="password" required
                autoComplete="new-password"
                value={formData.mot_de_passe}
                onChange={(e) => setFormData({ ...formData, mot_de_passe: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
          )}

          <div className="pt-2 flex gap-2">
            <button
              type="submit" disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              {submitting ? '⏳ Enregistrement…' : editingId ? '💾 Enregistrer les modifications' : '💾 Créer le compte'}
            </button>
            <button
              type="button" onClick={handleFermer}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <DataTable
        title="Comptes Utilisateurs Enregistrés"
        headers={['Identifiant', 'Nom & Prénom', 'Email', 'Rôle', 'Statut', 'Actions']}
        data={loading ? [] : users}
        emptyMessage={loading ? 'Chargement…' : 'Aucun utilisateur enregistré.'}
        renderRow={(user) => (
          <tr key={user.id} className="bg-white hover:bg-slate-50/80 transition-all duration-200 group shadow-sm rounded-xl">
            {/* Identifiant */}
            <td className="px-6 py-4 text-sm font-semibold text-slate-800 rounded-l-xl border-y border-l border-slate-100">
              {user.identifiant}
            </td>
            
            {/* Nom & Prénom */}
            <td className="px-6 py-4 text-sm text-slate-600 border-y border-slate-100">
              {user.prenom} {user.nom}
            </td>
            
            {/* Email */}
            <td className="px-6 py-4 text-xs text-slate-500 font-mono border-y border-slate-100">
              {user.email}
            </td>
            
            {/* Rôle */}
            <td className="px-6 py-4 border-y border-slate-100">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </td>
            
            {/* Statut */}
            <td className="px-6 py-4 border-y border-slate-100">
              <StatutBadge statut={user.statut ?? 'ACTIF'} />
            </td>
            
            {/* Actions (Boutons sous forme d'icônes épurées) */}
            <td className="px-6 py-4 text-right rounded-r-xl border-y border-r border-slate-100">
              <div className="flex items-center gap-2 justify-end">
                {/* Modifier */}
                <button
                  onClick={() => handleOuvrirEdition(user)}
                  title="Modifier"
                  className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                </button>

                {/* Suspendre / Réactiver */}
                <button
                  onClick={() => handleToggleSuspension(user)}
                  title={user.statut === 'SUSPENDU' ? 'Réactiver' : 'Suspendre'}
                  className={`p-1.5 rounded-lg transition-colors ${
                    user.statut === 'SUSPENDU'
                      ? 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50'
                      : 'text-amber-500 hover:text-amber-700 hover:bg-amber-50'
                  }`}
                >
                  {user.statut === 'SUSPENDU' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  )}
                </button>

                {/* Signaler */}
                <button
                  onClick={() => setModal({ type: 'signaler', user })}
                  title="Signaler aux autorités"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.205.654l2.266.906a9 9 0 005.413.388l1.54-.385A.75.75 0 0021 15.016V3.544a.75.75 0 00-.972-.718l-1.65.412a9 9 0 01-5.412-.387l-2.267-.907A9 9 0 004.5 2.25L3 2.625V15z" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        )}
      />
    </div>
  );
}