// src/views/admin/Maintenances.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const STATUT_CONFIG = {
  EN_COURS: { label: 'En cours',  bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500',    pulse: true  },
  TERMINE:  { label: 'Terminé',   bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', pulse: false },
  ANNULE:   { label: 'Annulé',    bg: 'bg-slate-100',  text: 'text-slate-500',   dot: 'bg-slate-400',   pulse: false },
};

const fmt = (d) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch { return d; }
};

export default function Maintenances() {
  const [maintenances, setMaintenances] = useState([]);
  const [materiels,    setMateriels]    = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [showForm,     setShowForm]     = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState('');

  const [formData, setFormData] = useState({
    materiel:              '',
    categorie_maintenance: '',
    dateDebut:             '',
    dateFin:               '',
    description:           '',
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [mainRes, matRes, catRes] = await Promise.all([
        api.get('maintenance/'),           // ← corrigé
        api.get('materiels/'),
        api.get('maintenance/categories/'), // ← corrigé
      ]);
      setMaintenances(Array.isArray(mainRes.data) ? mainRes.data : mainRes.data?.results ?? []);
      setMateriels(Array.isArray(matRes.data)     ? matRes.data  : matRes.data?.results  ?? []);
      setCategories(Array.isArray(catRes.data)    ? catRes.data  : catRes.data?.results  ?? []);
    } catch (err) {
      console.error('Erreur chargement:', err.response?.data);
      setError('Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('maintenance/', {
        materiel:              parseInt(formData.materiel),
        categorie_maintenance: parseInt(formData.categorie_maintenance),
        dateDebut:             formData.dateDebut,
        dateFin:               formData.dateFin || null,
        description:           formData.description,
      });
      await fetchAll();
      setShowForm(false);
      setFormData({ materiel: '', categorie_maintenance: '', dateDebut: '', dateFin: '', description: '' });
    } catch (err) {
      console.error('Erreur création:', err.response?.data);
      const serverError = err.response?.data;
      if (serverError && typeof serverError === 'object') {
        const msg = Object.entries(serverError).map(([k, v]) => `${k} : ${Array.isArray(v) ? v[0] : v}`).join(' | ');
        setError(msg);
      } else {
        setError("Erreur lors de la création.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ADMIN peut seulement ANNULER (pas terminer — c'est le technicien)
  const handleAnnuler = async (id) => {
    if (!window.confirm('Annuler cette maintenance ?')) return;
    try {
      await api.patch(`maintenance/${id}/`, { statut: 'ANNULE' });
      await fetchAll();
    } catch (err) {
      console.error('Erreur annulation:', err.response?.data);
      setError('Erreur lors de l\'annulation.');
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Supervision de la Maintenance</h3>
          <p className="text-xs text-slate-400">Signalez les pannes — les techniciens clôturent les interventions.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError(''); }}
          className={`text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm ${
            showForm ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-[#1E40AF] text-white hover:bg-blue-800'
          }`}>
          {showForm ? '✕ Fermer' : '🔧 Signaler une panne'}
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">⚠️ {error}</div>}

      {/* Formulaire */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 max-w-xl">
          <h4 className="font-bold text-slate-700 text-sm border-b border-slate-100 pb-2">Nouvelle fiche de maintenance</h4>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Matériel défaillant <span className="text-rose-500">*</span></label>
            <select required value={formData.materiel} onChange={(e) => setFormData({ ...formData, materiel: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]">
              <option value="">-- Sélectionner un matériel --</option>
              {materiels.map(m => <option key={m.id} value={m.id}>{m.designation} {m.code_barre ? `(${m.code_barre})` : ''}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Catégorie <span className="text-rose-500">*</span></label>
            <select required value={formData.categorie_maintenance} onChange={(e) => setFormData({ ...formData, categorie_maintenance: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]">
              <option value="">-- Sélectionner une catégorie --</option>
              {categories.length === 0
                ? <option disabled>Aucune catégorie — créez-en via l'admin Django</option>
                : categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)
              }
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Date de début <span className="text-rose-500">*</span></label>
              <input type="date" required value={formData.dateDebut} onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Date de fin prévue</label>
              <input type="date" value={formData.dateFin} min={formData.dateDebut} onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Description <span className="text-rose-500">*</span></label>
            <textarea required rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: L'écran ne s'allume plus, problème d'alimentation..."
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF] resize-none" />
          </div>

          <button type="submit" disabled={submitting}
            className="bg-[#1E40AF] hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
            {submitting ? '⏳ Envoi…' : '🚀 Créer la fiche de maintenance'}
          </button>
        </form>
      )}

      {/* Tableau */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <div className="w-6 h-6 border-4 border-blue-100 border-t-[#1E40AF] rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Chargement…</span>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-slate-700">Fiches de Maintenance</h4>
              <p className="text-xs text-slate-400">{maintenances.length} fiche{maintenances.length > 1 ? 's' : ''}</p>
            </div>
            <button onClick={fetchAll} className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
              ↻ Actualiser
            </button>
          </div>
          {maintenances.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">Aucune fiche de maintenance.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['ID', 'Matériel', 'Catégorie', 'Début', 'Fin prévue', 'Statut', 'Actions ADMIN'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {maintenances.map((item) => {
                    const s = STATUT_CONFIG[item.statut] ?? STATUT_CONFIG.EN_COURS;
                    const nomMateriel = item.materiel_nom ?? item.materiel?.designation ?? `Matériel #${item.materiel}`;
                    const nomCategorie = item.categorie_maintenance_details?.nom ?? item.categorie_maintenance?.nom ?? '—';
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-4 font-mono text-xs text-slate-400">MNT-{String(item.id).padStart(3, '0')}</td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-700 text-sm">{nomMateriel}</div>
                          {item.description && <div className="text-xs text-slate-400 line-clamp-1">{item.description}</div>}
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500">{nomCategorie}</td>
                        <td className="px-4 py-4 text-xs text-slate-400 whitespace-nowrap">{fmt(item.dateDebut)}</td>
                        <td className="px-4 py-4 text-xs text-slate-400 whitespace-nowrap">{fmt(item.dateFin)}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${s.pulse ? 'animate-pulse' : ''}`} />
                            {s.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {/* ADMIN peut seulement annuler — le technicien termine */}
                          {item.statut === 'EN_COURS' && (
                            <button onClick={() => handleAnnuler(item.id)}
                              className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors px-2.5 py-1 rounded-lg hover:bg-rose-50">
                              ✕ Annuler
                            </button>
                          )}
                          {item.statut !== 'EN_COURS' && <span className="text-xs text-slate-300 italic">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}