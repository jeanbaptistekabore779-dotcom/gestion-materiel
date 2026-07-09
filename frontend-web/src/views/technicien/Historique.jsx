// src/views/technicien/Historique.jsx
import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/api';
import DataTable from '../../components/DataTable';

const fmt = (d) => {
  if (!d) return 'Non renseignée';
  try {
    return new Date(d).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return d; }
};

const dureeJours = (debut, fin) => {
  if (!debut || !fin) return null;
  const diff = Math.round((new Date(fin) - new Date(debut)) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
};

export default function Historique() {
  const [loading, setLoading]         = useState(true);
  const [maintenances, setMaintenances] = useState([]);
  const [error, setError]             = useState('');
  const [searchTerm, setSearchTerm]   = useState('');
  const [filterStatut, setFilterStatut] = useState('TOUS');

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const res = await api.get('maintenance/');
        const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
        // L'historique ne montre que les interventions clôturées ou annulées,
        // pas celles encore EN_COURS (elles restent dans "Mes interventions").
        setMaintenances(data.filter(m => ['TERMINE', 'ANNULE'].includes(m.statut)));
      } catch (err) {
        console.error("Erreur lors de la récupération de l'historique:", err);
        setError("Impossible de charger l'historique.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistorique();
  }, []);

  const filtrerMaintenances = (items) => {
    return items.filter(item => {
      const nomMateriel = (item.materiel_nom ?? item.materiel?.designation ?? '').toLowerCase();
      const description = (item.description ?? '').toLowerCase();
      const idInt = `mnt-${String(item.id).padStart(3, '0')}`;

      const matchesSearch =
        nomMateriel.includes(searchTerm.toLowerCase()) ||
        description.includes(searchTerm.toLowerCase()) ||
        idInt.includes(searchTerm.toLowerCase());

      const matchesStatut = filterStatut === 'TOUS' || item.statut === filterStatut;

      return matchesSearch && matchesStatut;
    });
  };

  const filteredMaintenances = filtrerMaintenances(maintenances);

  const stats = useMemo(() => {
    const terminees = maintenances.filter(m => m.statut === 'TERMINE');
    const durees = terminees.map(m => dureeJours(m.dateDebut, m.dateFin)).filter(d => d !== null);
    const dureeMoyenne = durees.length
      ? Math.round(durees.reduce((a, b) => a + b, 0) / durees.length)
      : null;
    return {
      total: maintenances.length,
      terminees: terminees.length,
      annulees: maintenances.filter(m => m.statut === 'ANNULE').length,
      dureeMoyenne,
    };
  }, [maintenances]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Chargement de l'historique...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Historique des interventions</h2>
        <p className="text-sm text-slate-400 mt-0.5">Consultez et recherchez parmi toutes les maintenances clôturées ou annulées.</p>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">⚠️ {error}</div>}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          <p className="text-xs text-slate-400 mt-0.5">Interventions archivées</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-emerald-600">{stats.terminees}</p>
          <p className="text-xs text-slate-400 mt-0.5">Terminées</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-slate-500">{stats.annulees}</p>
          <p className="text-xs text-slate-400 mt-0.5">Annulées</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">
            {stats.dureeMoyenne !== null ? `${stats.dureeMoyenne} j` : 'Non calculable'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Durée moyenne (terminées)</p>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            placeholder="Rechercher par matériel, ID ou description..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Statut</label>
          <select
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:border-blue-500 transition-colors"
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
          >
            <option value="TOUS">Tous les statuts</option>
            <option value="TERMINE">Terminées</option>
            <option value="ANNULE">Annulées</option>
          </select>
        </div>
      </div>

      <DataTable
        title="Interventions Clôturées"
        headers={['Code', 'Matériel', 'Date de clôture', 'Durée', 'Description', 'Statut']}
        data={filteredMaintenances}
        emptyMessage="Aucun historique ne correspond à vos critères."
        renderRow={(item) => {
          const duree = dureeJours(item.dateDebut, item.dateFin);
          return (
            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4 font-mono text-xs text-slate-400 font-semibold">
                MNT-{String(item.id).padStart(3, '0')}
              </td>
              <td className="px-6 py-4 font-medium text-slate-700">
                {item.materiel_nom ?? item.materiel?.designation ?? `Matériel #${item.materiel}`}
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">{fmt(item.dateFin)}</td>
              <td className="px-6 py-4 text-sm text-slate-500">
                {duree !== null ? `${duree} jour${duree > 1 ? 's' : ''}` : 'Non calculable'}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                {item.description || 'Aucune note renseignée.'}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
                  item.statut === 'TERMINE'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {item.statut === 'TERMINE' ? 'Réparé' : 'Annulé'}
                </span>
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
}