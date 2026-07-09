// src/views/admin/DashboardAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import DashboardCard from '../../components/DashboardCard';
import { useAuth } from '../../hooks/useAuth';
import api from '../../api/api';

// Vues admin
import Materiels     from './Materiels';
import Utilisateurs  from './Utilisateurs';
import Logs          from './Logs';
import RendezVous    from './RendezVous';
import Emprunts      from './Emprunts';
import Maintenances  from './Maintenances';
import Notifications from './Notifications';

// ─── Icônes ──────────────────────────────────────────────────────
const Icons = {
  Box:      (p) => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
  Check:    (p) => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Book:     (p) => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Wrench:   (p) => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Users:    (p) => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Clock:    (p) => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Arrow:    (p) => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Alert:    (p) => <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

// ─── Mini barre de progression ────────────────────────────────────
function ProgressBar({ value, max, color = 'bg-blue-500' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
      <div className={`h-1.5 rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── Ligne d'activité récente ─────────────────────────────────────
function ActivityRow({ icon: Icon, label, sub, badge, badgeColor, time }) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700',
    amber:   'bg-amber-50 text-amber-700',
    rose:    'bg-rose-50 text-rose-600',
    blue:    'bg-blue-50 text-blue-700',
    slate:   'bg-slate-100 text-slate-500',
  };
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700 truncate">{label}</p>
        {sub && <p className="text-xs text-slate-400 truncate">{sub}</p>}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors[badgeColor] || colors.slate}`}>
            {badge}
          </span>
        )}
        {time && <span className="text-[10px] text-slate-300">{time}</span>}
      </div>
    </div>
  );
}

// ─── Page d'accueil Admin ─────────────────────────────────────────
function AdminHome({ stats, emprunts, loading }) {
  const navigate = useNavigate();

  const quickActions = [
    { label: 'Ajouter un matériel',    sub: 'Enregistrer un équipement',      path: '/admin/materiels',    icon: Icons.Box,    color: 'bg-blue-50 text-blue-700' },
    { label: 'Gérer les emprunts',     sub: 'Valider ou refuser les demandes', path: '/admin/emprunts',     icon: Icons.Book,   color: 'bg-indigo-50 text-indigo-700' },
    { label: 'Gérer les utilisateurs', sub: 'Comptes étudiants & enseignants', path: '/admin/users',        icon: Icons.Users,  color: 'bg-purple-50 text-purple-700' },
    { label: 'Voir les maintenances',  sub: 'Suivi des interventions',         path: '/admin/maintenances', icon: Icons.Wrench, color: 'bg-orange-50 text-orange-700' },
  ];

  // Calcul du taux de disponibilité (sur la base des UNITÉS, pas des fiches)
  const tauxDispo = stats.total > 0 ? Math.round((stats.disponibles / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tableau de bord</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Vue d'ensemble du parc matériel de l'UFR/SEA — UJKZ
          </p>
        </div>
        <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* ── Cartes stats ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Unités totales"
          value={stats.total}
          icon={Icons.Box}
          color="blue"
          subtitle={`${stats.disponibles} disponibles`}
          loading={loading}
          onClick={() => navigate('/admin/materiels')}
        />
        <DashboardCard
          title="Disponibles"
          value={stats.disponibles}
          icon={Icons.Check}
          color="emerald"
          subtitle={`${tauxDispo}% du parc`}
          loading={loading}
          onClick={() => navigate('/admin/materiels')}
        />
        <DashboardCard
          title="En cours"
          value={stats.enCours}
          icon={Icons.Book}
          color="indigo"
          subtitle="unités physiquement sorties"
          loading={loading}
          onClick={() => navigate('/admin/emprunts')}
        />
        <DashboardCard
          title="À traiter"
          value={stats.aTraiter}
          icon={Icons.Clock}
          color="amber"
          subtitle="demandes, retraits ou retours"
          loading={loading}
          onClick={() => navigate('/admin/emprunts')}
        />
        <DashboardCard
          title="En maintenance"
          value={stats.maintenance}
          icon={Icons.Wrench}
          color="orange"
          subtitle="fiches en panne"
          loading={loading}
          onClick={() => navigate('/admin/maintenances')}
        />
      </div>

      {/* ── Ligne 2 : Disponibilité + Activité récente ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Répartition du parc */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-700">Répartition du parc</h3>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-8 bg-slate-100 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Disponibles</span>
                  <span className="text-emerald-600 font-bold">{stats.disponibles} / {stats.total}</span>
                </div>
                <ProgressBar value={stats.disponibles} max={stats.total} color="bg-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Unités empruntées</span>
                  <span className="text-blue-600 font-bold">{stats.total - stats.disponibles} / {stats.total}</span>
                </div>
                <ProgressBar value={stats.total - stats.disponibles} max={stats.total} color="bg-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">En maintenance</span>
                  <span className="text-orange-600 font-bold">{stats.maintenance}</span>
                </div>
                <ProgressBar value={stats.maintenance} max={Math.max(stats.maintenance, 1)} color="bg-orange-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">Utilisateurs</span>
                  <span className="text-purple-600 font-bold">{stats.utilisateurs}</span>
                </div>
                <ProgressBar value={stats.utilisateurs} max={Math.max(stats.utilisateurs, 10)} color="bg-purple-500" />
              </div>
            </div>
          )}
        </div>

        {/* Emprunts récents */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-700">Emprunts récents</h3>
            <button
              onClick={() => navigate('/admin/emprunts')}
              className="text-xs text-[#0C326F] font-semibold hover:underline flex items-center gap-1"
            >
              Voir tout <Icons.Arrow className="h-3 w-3" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />)}
            </div>
          ) : emprunts.length === 0 ? (
            <div className="text-center py-8 text-slate-300 text-sm">Aucun emprunt enregistré</div>
          ) : (
            <div>
              {emprunts.slice(0, 5).map((e) => {
                const nom = e.materiel_nom ?? e.materiel?.designation ?? `Matériel #${e.materiel}`;
                const demandeur = e.utilisateur_details
                  ? `${e.utilisateur_details.prenom ?? ''} ${e.utilisateur_details.nom ?? ''}`.trim() || e.utilisateur_details.username
                  : `Utilisateur #${e.utilisateur}`;
                const statutColors = {
                  EN_ATTENTE: 'amber', APPROUVE: 'blue', EN_COURS: 'emerald',
                  RETOURNE: 'slate', REFUSE: 'rose', EN_RETARD: 'rose',
                };
                const statutLabels = {
                  EN_ATTENTE: 'En attente', APPROUVE: 'Approuvé', EN_COURS: 'En cours',
                  RETOURNE: 'Retourné', REFUSE: 'Refusé', EN_RETARD: 'En retard',
                };
                return (
                  <ActivityRow
                    key={e.id}
                    icon={Icons.Book}
                    label={nom}
                    sub={demandeur}
                    badge={statutLabels[e.statut] ?? e.statut}
                    badgeColor={statutColors[e.statut] ?? 'slate'}
                    time={e.date_sortie ? new Date(e.date_sortie).toLocaleDateString('fr-FR') : ''}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Actions rapides ───────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 mb-3">Actions rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((a) => (
            <button
              key={a.path}
              onClick={() => navigate(a.path)}
              className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-md hover:-translate-y-0.5 text-left transition-all duration-150 group"
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${a.color}`}>
                <a.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-700 truncate">{a.label}</div>
                <div className="text-[11px] text-slate-400 truncate">{a.sub}</div>
              </div>
              <Icons.Arrow className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 shrink-0 ml-auto transition-colors" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

// ─── Composant Principal ──────────────────────────────────────────
export default function DashboardAdmin({ onLogout }) {
  const { user } = useAuth();
  const [stats, setStats]     = useState({ total: 0, disponibles: 0, aTraiter: 0, enCours: 0, maintenance: 0, utilisateurs: 0 });
  const [emprunts, setEmprunts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        const [matRes, empRes, userRes] = await Promise.all([
          api.get('materiels/'),
          api.get('emprunts/'),
          api.get('utilisateurs/').catch(() => ({ data: [] })),
        ]);
        if (!mounted) return;

        const mats  = Array.isArray(matRes.data)  ? matRes.data  : matRes.data?.results  ?? [];
        const emps  = Array.isArray(empRes.data)  ? empRes.data  : empRes.data?.results  ?? [];
        const users = Array.isArray(userRes.data) ? userRes.data : userRes.data?.results ?? [];

        // Total et disponibles = SOMME des quantités (unités), pas un
        // comptage de fiches. Une fiche "Capteur" (quantite=5) et une
        // fiche "Drone" (quantite=2) donnent bien 7 unités totales,
        // pas 2.
        setStats({
          total:       mats.reduce((sum, m) => sum + (m.quantite ?? 0), 0),
          disponibles: mats.reduce((sum, m) => sum + (m.quantite_disponible ?? 0), 0),
          // "À traiter" = dossiers qui demandent une action admin (demande non
          // encore validée, ou retrait/retour physique à confirmer).
          // "En cours" = unités RÉELLEMENT sorties du stock à cet instant.
          // On sépare ces deux notions pour ne pas laisser croire qu'un
          // dossier "en attente" correspond à du matériel physiquement dehors.
          aTraiter: emps.filter(e => ['EN_ATTENTE', 'APPROUVE', 'RETOUR_DECLARE'].includes(e.statut)).length,
          enCours:  emps.filter(e => ['EN_COURS', 'EN_RETARD'].includes(e.statut)).length,
          maintenance: mats.filter(m => m.statut === 'EN_PANNE').length,
          utilisateurs: users.length,
        });
        setEmprunts(emps);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  return (
    <Layout onLogout={onLogout} role="ADMIN">
      <Routes>
        <Route index                element={<AdminHome stats={stats} emprunts={emprunts} loading={loading} />} />
        <Route path="dashboard"     element={<AdminHome stats={stats} emprunts={emprunts} loading={loading} />} />
        <Route path="materiels"     element={<Materiels />} />
        <Route path="users"         element={<Utilisateurs />} />
        <Route path="emprunts"      element={<Emprunts />} />
        <Route path="maintenances"  element={<Maintenances />} />
        <Route path="rendez-vous"   element={<RendezVous />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="logs"          element={<Logs />} />
      </Routes>
    </Layout>
  );
}