// src/views/technicien/Interventions.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import DataTable from '../../components/DataTable';

const fmt = (d) => {
  if (!d) return 'Non renseignée';
  try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch { return d; }
};

export default function Interventions() {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [submitting, setSubmitting]       = useState(false);
  const [selectedInt, setSelectedInt]     = useState(null);
  const [rapport, setRapport]             = useState('');
  const [statutFinal, setStatutFinal]     = useState('DISPONIBLE');

  useEffect(() => { fetchInterventions(); }, []);

  const fetchInterventions = async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await api.get('maintenance/');
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setInterventions(data.filter(i => i.statut === 'EN_COURS'));
    } catch (err) {
      console.error('Erreur chargement interventions:', err.response?.data);
      setError('Impossible de charger vos interventions.');
    } finally {
      setLoading(false);
    }
  };

  const handleOuvrirTraitement = (item) => {
    setSelectedInt(item);
    setRapport('');
    setStatutFinal('DISPONIBLE');
  };

  const handleResolution = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.patch(`maintenance/${selectedInt.id}/`, {
        statut: 'TERMINE',
        dateFin: new Date().toISOString().split('T')[0],
        description: rapport ? `${selectedInt.description}\n\nRapport technicien : ${rapport}` : selectedInt.description,
      });

      if (selectedInt.materiel) {
        await api.patch(`materiels/${selectedInt.materiel}/`, {
          statut: statutFinal,
          etat: statutFinal === 'DISPONIBLE' ? 'DISPONIBLE' : 'HORS_SERVICE',
        });
      }

      setSelectedInt(null);
      setRapport('');
      await fetchInterventions();
    } catch (err) {
      console.error('Erreur résolution intervention:', err.response?.data);
      setError("Impossible d'enregistrer le rapport. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Interventions en cours</h3>
        <p className="text-xs text-slate-400">Rédigez vos rapports techniques pour clôturer les pannes.</p>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">⚠️ {error}</div>}

      {selectedInt && (
        <form onSubmit={handleResolution} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-700 text-sm border-b border-slate-100 pb-2">
            Résolution de l'intervention MNT-{String(selectedInt.id).padStart(3, '0')}
            <span className="text-[#1E40AF]"> {selectedInt.materiel_nom ?? selectedInt.materiel?.designation ?? ''}</span>
          </h4>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
            <p><span className="font-semibold text-slate-500">Panne signalée :</span> {selectedInt.description}</p>
            <p className="mt-1"><span className="font-semibold text-slate-500">Date de début :</span> {fmt(selectedInt.dateDebut)}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Diagnostic et rapport technique <span className="text-rose-500">*</span></label>
            <textarea
              required
              rows="3"
              value={rapport}
              onChange={(e) => setRapport(e.target.value)}
              placeholder="Décrivez les actions menées (ex : remplacement de la pièce, nettoyage des filtres)"
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF] resize-none"
            />
          </div>

          <div className="w-56">
            <label className="block text-xs font-semibold text-slate-500 mb-1">État du matériel</label>
            <select
              value={statutFinal}
              onChange={(e) => setStatutFinal(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
            >
              <option value="DISPONIBLE">🟢 Réparé, remis en stock</option>
              <option value="HORS_SERVICE">🔴 Irréparable, mis au rebut</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors">
              {submitting ? 'Enregistrement en cours' : "Valider l'intervention"}
            </button>
            <button type="button" onClick={() => setSelectedInt(null)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors">
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <div className="w-6 h-6 border-4 border-blue-100 border-t-[#1E40AF] rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Chargement de vos interventions</span>
        </div>
      ) : (
        <DataTable
          title="Vos tâches actives"
          headers={['ID', 'Matériel', 'Panne signalée', 'Date affectation', 'Action']}
          data={interventions}
          emptyMessage="Aucune intervention en cours actuellement."
          renderRow={(item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800">MNT-{String(item.id).padStart(3, '0')}</td>
              <td className="px-6 py-4 font-medium text-slate-700">
                {item.materiel_nom ?? item.materiel?.designation ?? `Matériel #${item.materiel}`}
              </td>
              <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{item.description}</td>
              <td className="px-6 py-4 text-xs text-slate-400">{fmt(item.dateDebut)}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleOuvrirTraitement(item)}
                  className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Traiter
                </button>
              </td>
            </tr>
          )}
        />
      )}
    </div>
  );
}