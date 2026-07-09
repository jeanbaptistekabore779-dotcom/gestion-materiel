import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../api/api';
import { useAuth } from '../../hooks/useAuth';

// Vues existantes
import NouvelEmprunt from './emprunts/NouvelEmprunt';
import MesEmprunts from './emprunts/MesEmprunts';
import Catalogue from './materiels/Catalogue';
import Detail from './materiels/Detail';
import Notifications from './notifications/Notifications';
import MesRendezVous from './rendezvous/MesRendezVous';
import Historique from './emprunts/Historique';
import ProfilUser from './ProfilUser';


// ─── Icônes ──────────────────────────────────────────────────────────
const BookOpenIcon = (p) => (
  <svg className={p.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const PlusIcon = (p) => (
  <svg className={p.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const CatalogIcon = (p) => (
  <svg className={p.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const ArrowIcon = (p) => (
  <svg className={p.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ClockIcon = (p) => (
  <svg className={p.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckCircleIcon = (p) => (
  <svg className={p.className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// ─── Statut Labels ──────────────────────────────────────────────────
const statutLabels = {
  EN_ATTENTE: { label: 'En attente', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  APPROUVE: { label: 'Approuvé', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  EN_COURS: { label: 'En cours', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  RETOURNE: { label: 'Retourné', color: 'bg-slate-100 text-slate-500 border-slate-200' },
  REFUSE: { label: 'Refusé', color: 'bg-rose-50 text-rose-600 border-rose-200' },
  EN_RETARD: { label: 'En retard', color: 'bg-orange-50 text-orange-700 border-orange-200' },
};

// ─── Stats Card ──────────────────────────────────────────────────────
const StatsCard = ({ title, value, icon: Icon, color, loading, onClick }) => {
  const colors = {
    blue: 'border-blue-200 bg-blue-50/50',
    amber: 'border-amber-200 bg-amber-50/50',
    emerald: 'border-emerald-200 bg-emerald-50/50',
  };

  const iconColors = {
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  };

  return (
    <div
      onClick={onClick}
      className={`group border ${colors[color] || colors.blue} rounded-xl p-5 bg-white hover:shadow-md transition-all cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          {loading ? (
            <div className="h-8 w-16 mt-1 rounded bg-slate-200 animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconColors[color] || iconColors.blue}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

// ─── Page d'accueil utilisateur ─────────────────────────────────────
function UserHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ actifs: 0, attente: 0, disponibles: 0, references: 0 });
  const [emprunts, setEmprunts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Nom complet de l'utilisateur
  const fullName = user ? `${user.nom || ''} ${user.prenom || ''}`.trim() : 'Utilisateur';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, matRes] = await Promise.all([
          api.get('emprunts/'),
          api.get('materiels/'),
        ]);
        const emps = Array.isArray(empRes.data) ? empRes.data : empRes.data?.results ?? [];
        const mats = Array.isArray(matRes.data) ? matRes.data : matRes.data?.results ?? [];

        setEmprunts(emps.slice(0, 4));
        setStats({
          actifs: emps.filter(e => ['EN_COURS', 'APPROUVE'].includes(e.statut)).length,
          attente: emps.filter(e => e.statut === 'EN_ATTENTE').length,
          disponibles: mats.reduce((total, m) => total + (m.quantite_disponible ?? 0), 0),
          references: mats.length,
        });
      } catch (err) {
        console.error('Erreur stats user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const fmt = (d) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch { return d; }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Bonjour, <span className="text-[#0C326F]">{fullName}</span>
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">UFR/SEA — Suivi de vos demandes de matériel pédagogique.</p>
        </div>
        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
          ● Connecté
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Emprunts Actifs"
          value={stats.actifs}
          icon={BookOpenIcon}
          color="blue"
          loading={loading}
          onClick={() => navigate('/user/mes-emprunts')}
        />
        <StatsCard
          title="Demandes en Attente"
          value={stats.attente}
          icon={ClockIcon}
          color="amber"
          loading={loading}
          onClick={() => navigate('/user/mes-emprunts')}
        />
        <StatsCard
          title="Unités Disponibles"
          value={stats.disponibles}
          icon={CheckCircleIcon}
          color="emerald"
          loading={loading}
          onClick={() => navigate('/user/catalogue')}
        />
        <StatsCard
          title="Références au Catalogue"
          value={stats.references}
          icon={CatalogIcon}
          color="blue"
          loading={loading}
          onClick={() => navigate('/user/catalogue')}
        />
      </div>

      {/* Emprunts récents */}
      {!loading && emprunts.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-700">Mes derniers emprunts</h3>
            <button
              onClick={() => navigate('/user/mes-emprunts')}
              className="text-xs text-[#0C326F] font-medium hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowIcon className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  {['Réf.', 'Matériel', 'Retour prévu', 'Statut'].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {emprunts.map(e => {
                  const nom = e.materiel_nom ?? e.materiel?.designation ?? `Matériel #${e.materiel}`;
                  const s = statutLabels[e.statut] ?? { label: e.statut, color: 'bg-slate-100 text-slate-500 border-slate-200' };
                  return (
                    <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-slate-400">REQ-{String(e.id).padStart(3, '0')}</td>
                      <td className="px-5 py-3 text-sm font-medium text-slate-700">{nom}</td>
                      <td className="px-5 py-3 text-xs text-slate-400">{fmt(e.date_retour_prevue)}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${s.color}`}>
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Actions rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/user/demande')}
          className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-[#0C326F] hover:bg-slate-50/50 transition-all text-left group"
        >
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <PlusIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 group-hover:text-[#0C326F] transition-colors">
              Nouvelle Demande d'Emprunt
            </p>
            <p className="text-xs text-slate-400">Réserver du matériel pour un projet ou un TP.</p>
          </div>
          <ArrowIcon className="h-4 w-4 text-slate-300 ml-auto group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => navigate('/user/catalogue')}
          className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-slate-50/50 transition-all text-left group"
        >
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <CatalogIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">
              Consulter le Catalogue
            </p>
            <p className="text-xs text-slate-400">Vérifier la disponibilité des équipements.</p>
          </div>
          <ArrowIcon className="h-4 w-4 text-slate-300 ml-auto group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// ─── Composant Principal ────────────────────────────────────────────
// Toutes les sous-pages (y compris Catalogue, Détail et Demande) sont
// désormais rendues À L'INTÉRIEUR du Layout, pour s'afficher dans la
// zone de contenu à droite du menu — comme les autres pages.
export default function DashboardUser({ onLogout, userType }) {
  return (
    <Layout onLogout={onLogout} role="USER" userType={userType}>
      <Routes>
        <Route index element={<UserHome />} />
        <Route path="dashboard" element={<UserHome />} />
        <Route path="mes-emprunts" element={<MesEmprunts />} />
        <Route path="historique" element={<Historique />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="rendez-vous" element={<MesRendezVous />} />
        <Route path="profil" element={<ProfilUser />} />
        <Route path="catalogue" element={<Catalogue />} />
        <Route path="catalogue/:id" element={<Detail />} />
        <Route path="demande" element={<NouvelEmprunt />} />
      </Routes>
    </Layout>
  );
}