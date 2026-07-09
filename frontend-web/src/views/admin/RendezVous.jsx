// src/views/admin/RendezVous.jsx
import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import api from '../../api/api';

const JOURS = [
  { value: 'LUNDI',    label: 'Lundi' },
  { value: 'MARDI',    label: 'Mardi' },
  { value: 'MERCREDI', label: 'Mercredi' },
  { value: 'JEUDI',    label: 'Jeudi' },
  { value: 'VENDREDI', label: 'Vendredi' },
  { value: 'SAMEDI',   label: 'Samedi' },
];

const JOUR_LABEL = Object.fromEntries(JOURS.map(j => [j.value, j.label]));

const TYPE_STYLES = {
  RETRAIT: { label: 'Retrait Matériel', bg: 'bg-blue-50',    text: 'text-blue-700' },
  RETOUR:  { label: 'Retour Matériel',  bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

function TypeBadge({ type }) {
  const c = TYPE_STYLES[type] ?? { label: type ?? '—', bg: 'bg-slate-100', text: 'text-slate-600' };
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

const emptyCreneau = { jour_semaine: 'LUNDI', heure_debut: '08:00', heure_fin: '12:00', lieu: 'Magasin Central UFR/SEA', capacite: 1 };

export default function RendezVous() {
  // ── Rendez-vous planifiés ──────────────────────────────
  const [rdv, setRdv]         = useState([]);
  const [loadingRdv, setLoadingRdv] = useState(true);
  const [errorRdv, setErrorRdv]     = useState('');

  // ── Créneaux de disponibilité ──────────────────────────
  const [creneaux, setCreneaux]         = useState([]);
  const [loadingCreneaux, setLoadingCreneaux] = useState(true);
  const [errorCreneaux, setErrorCreneaux]     = useState('');
  const [showForm, setShowForm]         = useState(false);
  const [editingId, setEditingId]       = useState(null);
  const [formData, setFormData]         = useState(emptyCreneau);
  const [submitting, setSubmitting]     = useState(false);

  useEffect(() => { fetchRdv(); fetchCreneaux(); }, []);

  const fetchRdv = async () => {
    try {
      setLoadingRdv(true);
      setErrorRdv('');
      const res = await api.get('rendezvous/');
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setRdv(data);
    } catch (err) {
      console.error('Erreur chargement rendez-vous:', err.response?.data);
      setErrorRdv('Impossible de charger les rendez-vous.');
    } finally {
      setLoadingRdv(false);
    }
  };

  const fetchCreneaux = async () => {
    try {
      setLoadingCreneaux(true);
      setErrorCreneaux('');
      const res = await api.get('disponibilites/');
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setCreneaux(data);
    } catch (err) {
      console.error('Erreur chargement créneaux:', err.response?.data);
      setErrorCreneaux("La configuration des créneaux n'est pas encore disponible côté serveur.");
    } finally {
      setLoadingCreneaux(false);
    }
  };

  const handleOuvrirEdition = (c) => {
    setEditingId(c.id);
    setFormData({
      jour_semaine: c.jour_semaine ?? 'LUNDI',
      heure_debut: c.heure_debut ?? '08:00',
      heure_fin: c.heure_fin ?? '12:00',
      lieu: c.lieu ?? 'Magasin Central UFR/SEA',
      capacite: c.capacite ?? 1,
    });
    setShowForm(true);
  };

  const handleOuvrirCreation = () => {
    setEditingId(null);
    setFormData(emptyCreneau);
    setShowForm(true);
  };

  const handleFermer = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyCreneau);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorCreneaux('');
    try {
      if (editingId) {
        await api.patch(`disponibilites/${editingId}/`, formData);
      } else {
        await api.post('disponibilites/', formData);
      }
      await fetchCreneaux();
      handleFermer();
    } catch (err) {
      console.error('Erreur enregistrement créneau:', err.response?.data);
      const serverError = err.response?.data;
      if (serverError && typeof serverError === 'object') {
        const msg = Object.entries(serverError)
          .map(([k, v]) => `${k} : ${Array.isArray(v) ? v[0] : v}`)
          .join(' | ');
        setErrorCreneaux(msg);
      } else {
        setErrorCreneaux("Erreur lors de l'enregistrement du créneau.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm('Retirer ce créneau ? Les étudiants ne pourront plus être placés dessus.')) return;
    try {
      await api.delete(`disponibilites/${id}/`);
      setCreneaux(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Erreur suppression créneau:', err.response?.data);
      setErrorCreneaux('Erreur lors de la suppression.');
    }
  };

  const formatDate = (d) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    catch { return d; }
  };

  // Tri des créneaux par ordre de la semaine puis par heure
  const ordreJours = JOURS.map(j => j.value);
  const creneauxTries = [...creneaux].sort((a, b) => {
    const diffJour = ordreJours.indexOf(a.jour_semaine) - ordreJours.indexOf(b.jour_semaine);
    if (diffJour !== 0) return diffJour;
    return (a.heure_debut ?? '').localeCompare(b.heure_debut ?? '');
  });

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Planification des Rendez-vous</h3>
        <p className="text-xs text-slate-400">Définissez vos créneaux hebdomadaires — les rendez-vous sont attribués automatiquement dessus.</p>
      </div>

      {/* ── Créneaux de disponibilité ─────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-slate-700">Créneaux hebdomadaires</h4>
            <p className="text-xs text-slate-400">Les jours et heures où les étudiants peuvent être reçus.</p>
          </div>
          <button
            onClick={() => (showForm ? handleFermer() : handleOuvrirCreation())}
            className={`text-xs font-semibold px-3 py-2 rounded-xl transition-colors ${
              showForm
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-[#1E40AF] text-white hover:bg-blue-800'
            }`}
          >
            {showForm ? '✕ Fermer' : '➕ Ajouter un créneau'}
          </button>
        </div>

        {errorCreneaux && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs">
            ⚠️ {errorCreneaux}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="border border-slate-100 rounded-xl p-4 space-y-4 bg-slate-50/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Jour</label>
                <select
                  value={formData.jour_semaine}
                  onChange={(e) => setFormData({ ...formData, jour_semaine: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                >
                  {JOURS.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Heure début</label>
                <input
                  type="time" required
                  value={formData.heure_debut}
                  onChange={(e) => setFormData({ ...formData, heure_debut: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Heure fin</label>
                <input
                  type="time" required
                  value={formData.heure_fin}
                  onChange={(e) => setFormData({ ...formData, heure_fin: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Capacité / créneau</label>
                <input
                  type="number" min="1" required
                  value={formData.capacite}
                  onChange={(e) => setFormData({ ...formData, capacite: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Lieu</label>
              <input
                type="text" required
                value={formData.lieu}
                onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit" disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                {submitting ? '⏳ Enregistrement…' : editingId ? '💾 Enregistrer' : '💾 Ajouter le créneau'}
              </button>
              <button
                type="button" onClick={handleFermer}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {loadingCreneaux ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-4 border-blue-100 border-t-[#1E40AF] rounded-full animate-spin" />
          </div>
        ) : creneauxTries.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">Aucun créneau défini pour l'instant.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {creneauxTries.map((c) => (
              <div key={c.id} className="border border-slate-200 rounded-xl p-3 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#1E40AF]">{JOUR_LABEL[c.jour_semaine] ?? c.jour_semaine}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleOuvrirEdition(c)} className="text-[11px] font-bold text-slate-500 hover:text-[#1E40AF]">Modifier</button>
                    <button onClick={() => handleSupprimer(c.id)} className="text-[11px] font-bold text-rose-500 hover:text-rose-700">Retirer</button>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-700">{c.heure_debut} — {c.heure_fin}</span>
                <span className="text-xs text-slate-400">{c.lieu}</span>
                <span className="text-[11px] text-slate-400">Capacité : {c.capacite} étudiant{Number(c.capacite) > 1 ? 's' : ''} / créneau</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Rendez-vous planifiés (résultat de l'attribution automatique) ── */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-700">Rendez-vous planifiés</h4>
            <p className="text-xs text-slate-400">Attribués automatiquement sur les créneaux ci-dessus.</p>
          </div>
          <button
            onClick={fetchRdv}
            className="text-xs bg-slate-100 text-slate-600 font-medium px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
            Actualiser
          </button>
        </div>

        {errorRdv && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm mb-3">
            ⚠️ {errorRdv}
          </div>
        )}

        {loadingRdv ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-7 h-7 border-4 border-blue-100 border-t-[#0C326F] rounded-full animate-spin" />
            <p className="text-sm text-slate-400">Chargement des rendez-vous...</p>
          </div>
        ) : rdv.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <p className="text-sm text-slate-400 font-medium">Aucun rendez-vous planifié.</p>
            <p className="text-xs text-slate-300 mt-1">Ils apparaîtront ici dès qu'un étudiant en demande un.</p>
          </div>
        ) : (
          <DataTable
            title="Agenda des Dépôts et Retraits"
            headers={['Bénéficiaire', "Type d'action", 'Date & Heure', 'Lieu de RDV']}
            data={rdv}
            renderRow={(item) => {
              const beneficiaire = item.utilisateur_details
                ? `${item.utilisateur_details.prenom ?? ''} ${item.utilisateur_details.nom ?? ''}`.trim()
                : item.etudiant ?? `Utilisateur #${item.utilisateur}`;
              const type = item.type_rdv ?? item.type;
              const lieu = item.lieu ?? item.guichet ?? 'Magasin Central UFR/SEA';

              let dateFormatee = '—';
              let heureFormatee = '';
              if (item.date_heure) {
                const dt = new Date(item.date_heure);
                if (!isNaN(dt)) {
                  dateFormatee = dt.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                  heureFormatee = dt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                }
              }

              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700 text-sm">{beneficiaire}</td>
                  <td className="px-6 py-4"><TypeBadge type={type} /></td>
                  <td className="px-6 py-4 text-xs text-slate-600 whitespace-nowrap">
                    📅 {dateFormatee}{heureFormatee ? ` à ${heureFormatee}` : ''}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{lieu}</td>
                </tr>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}