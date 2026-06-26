import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import DashboardCard from '../../components/DashboardCard';
import DataTable from '../../components/DataTable';

// Vues existantes
import Maintenance    from './Maintenances';
import MaterielsEnPanne from './MaterielsEnPanne';
import Historique     from './Historique';

import api from '../../api/client';

const AlertIcon  = (p) => <svg className={p.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const WrenchIcon = (p) => <svg className={p.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.97 2.883a1 1 0 0 0-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 0 0-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 0 0-.364-1.118L2.49 11.1c-.773-.56-.374-1.81.588-1.81h4.906a1 1 0 0 0 .951-.69l1.519-4.674z" /></svg>;
const CheckIcon  = (p) => <svg className={p.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CubeIcon   = (p) => <svg className={p.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;

function TechnicienHome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats]     = useState({ pannes: 0, en_cours: 0, terminees: 0, indisponibles: 0 });
  const [interventionsRecentes, setInterventionsRecentes] = useState([]);
  const [materielsEnPanne, setMaterielsEnPanne]           = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, intRes, pannesRes] = await Promise.all([
          api.get('/maintenance/stats-technicien/'),
          api.get('/maintenance/interventions-recentes/'),
          api.get('/materiels/en-panne/'),
        ]);
        setStats(statsRes.data);
        setInterventionsRecentes(intRes.data);
        setMaterielsEnPanne(pannesRes.data);
      } catch {
        // Données de démonstration si API indisponible
        setStats({ pannes: 12, en_cours: 4, terminees: 27, indisponibles: 5 });
        setInterventionsRecentes([
          { id: 'INT-042', materiel: 'Vidéoprojecteur Epson',  priorite: 'Haute',    statut: 'En cours' },
          { id: 'INT-041', materiel: 'Imprimante HP LaserJet', priorite: 'Moyenne',  statut: 'Planifiée' },
          { id: 'INT-040', materiel: 'Dell XPS 13',            priorite: 'Critique', statut: 'En cours' },
        ]);
        setMaterielsEnPanne([
          { id: 'MAT-009', nom: 'Microscope Optique', labo: 'Biologie',     panne: 'Lentille fissurée',   date: '23/06/2026' },
          { id: 'MAT-084', nom: 'Oscilloscope',       labo: 'Électronique', panne: "Problème d'allumage", date: '22/06/2026' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
      <p className="text-sm text-slate-500 font-medium">Chargement des indicateurs...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Espace Technique</h2>
        <p className="text-sm text-slate-400 mt-0.5">Suivi en temps réel de la maintenance du parc technologique.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard title="Pannes signalées"        value={stats.pannes}        icon={AlertIcon}  color="red" />
        <DashboardCard title="Interventions en cours"  value={stats.en_cours}      icon={WrenchIcon} color="amber" />
        <DashboardCard title="Interventions terminées" value={stats.terminees}     icon={CheckIcon}  color="emerald" />
        <DashboardCard title="Matériels indisponibles" value={stats.indisponibles} icon={CubeIcon}   color="blue" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button onClick={() => navigate('/technicien/emprunts')}
          className="flex items-center gap-3 p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-left transition shadow-sm">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl"><WrenchIcon className="h-5 w-5" /></div>
          <div>
            <div className="text-sm font-bold text-slate-700">Mes Interventions</div>
            <div className="text-xs text-slate-400">Gérer les tâches actives</div>
          </div>
        </button>
        <button onClick={() => navigate('/technicien/historique')}
          className="flex items-center gap-3 p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-left transition shadow-sm">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl"><CheckIcon className="h-5 w-5" /></div>
          <div>
            <div className="text-sm font-bold text-slate-700">Historique</div>
            <div className="text-xs text-slate-400">Interventions archivées</div>
          </div>
        </button>
        <button onClick={() => navigate('/technicien/notifications')}
          className="flex items-center gap-3 p-5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-left transition shadow-sm">
          <div className="p-2.5 bg-red-50 text-red-700 rounded-xl"><AlertIcon className="h-5 w-5" /></div>
          <div>
            <div className="text-sm font-bold text-slate-700">Pannes signalées</div>
            <div className="text-xs text-slate-400">Équipements défectueux</div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DataTable
          title="Interventions Récentes"
          headers={['ID', 'Matériel', 'Priorité', 'Statut']}
          data={interventionsRecentes}
          renderRow={(item) => (
            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4 font-semibold text-slate-800">{item.id}</td>
              <td className="px-6 py-4">{item.materiel_nom || item.materiel}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  item.priorite === 'Critique' || item.priorite === 'Haute'
                    ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>{item.priorite}</span>
              </td>
              <td className="px-6 py-4">
                <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {item.statut}
                </span>
              </td>
            </tr>
          )}
        />
        <DataTable
          title="Matériels en Attente"
          headers={['Réf', 'Désignation', 'Panne', 'Date']}
          data={materielsEnPanne}
          renderRow={(item) => (
            <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4 text-slate-400 font-mono text-xs">{item.id}</td>
              <td className="px-6 py-4 font-medium text-slate-700">{item.nom}</td>
              <td className="px-6 py-4 text-slate-500 truncate max-w-[180px]">{item.panne_description || item.panne}</td>
              <td className="px-6 py-4 text-xs text-slate-400">{item.date_signalement || item.date}</td>
            </tr>
          )}
        />
      </div>
    </div>
  );
}

export default function DashboardTechnicien({ onLogout }) {
  return (
    <Layout onLogout={onLogout} role="TECHNICIEN">
      <Routes>
        {/* Route par défaut */}
        <Route index             element={<TechnicienHome />} />
        <Route path="dashboard"  element={<TechnicienHome />} />

        {/* Routes du Sidebar */}
        <Route path="emprunts"      element={<Maintenance />} />
        <Route path="historique"    element={<Historique />} />
        <Route path="notifications" element={<MaterielsEnPanne />} />
      </Routes>
    </Layout>
  );
}