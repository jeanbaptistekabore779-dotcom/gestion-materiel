// src/views/users/materiels/Detail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import { getPhotoUrl } from '../../../utils/media';

// ─── Icônes ──────────────────────────────────────────────────────────────────
function ArrowLeftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ImagePlaceholder({ nom }) {
  return (
    <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-3 rounded-2xl">
      <svg className="h-16 w-16 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span className="text-sm text-slate-400 font-medium px-6 text-center">{nom}</span>
      <span className="text-xs text-slate-300">Aucune photo disponible</span>
    </div>
  );
}

function StatBadge({ label, value, color }) {
  const colors = {
    blue:  'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rose:  'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
  };
  return (
    <div className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border ${colors[color]} text-center`}>
      <span className="text-lg font-bold">{value}</span>
      <span className="text-[11px] font-medium mt-0.5">{label}</span>
    </div>
  );
}

// ─── Composant Principal ──────────────────────────────────────────────────────
export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [materiel, setMateriel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`materiels/${id}/`);
      setMateriel(response.data);
    } catch (err) {
      console.error('Erreur chargement matériel:', err);
      setError('Impossible de charger la fiche de ce matériel.');
    } finally {
      setLoading(false);
    }
  };

  // ── États de chargement / erreur ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-4 border-blue-100 border-t-[#1E40AF] rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Chargement de la fiche...</p>
      </div>
    );
  }

  if (error || !materiel) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-rose-500 mb-4">{error || 'Matériel introuvable.'}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-semibold text-[#1E40AF] hover:underline flex items-center gap-1 mx-auto"
        >
          <ArrowLeftIcon /> Retour au catalogue
        </button>
      </div>
    );
  }

  // ── Données normalisées (gère les deux variantes de champs) ───────────────
  const nom         = materiel.designation ?? materiel.nom ?? 'Matériel sans nom';
  const code        = materiel.code_barre ?? materiel.id ?? '—';
  const dispo       = materiel.quantite_disponible ?? materiel.dispo ?? materiel.quantite ?? 0;
  const total       = materiel.quantite ?? 0;
  const enEmprunt   = materiel.quantite_empruntee ?? (total - dispo);
  const enMaint     = materiel.quantite_maintenance ?? 0;
  // Le modèle Django expose le champ "photo" (ImageField) — on construit
  // l'URL complète via getPhotoUrl, comme dans le Catalogue.
  const photoUrl    = getPhotoUrl(materiel.photo ?? materiel.image);

  const etatColors = {
    NEUF:        'bg-blue-50 text-blue-700',
    BON:         'bg-emerald-50 text-emerald-700',
    PANNE:       'bg-rose-50 text-rose-600',
    MAINTENANCE: 'bg-amber-50 text-amber-700',
  };
  const etatLabels = {
    NEUF: 'Neuf', BON: 'Bon état', PANNE: 'En panne', MAINTENANCE: 'En maintenance',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn">

      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1E40AF] transition-colors"
      >
        <ArrowLeftIcon /> Retour au catalogue
      </button>

      {/* Carte principale */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* ── Photo en grand ────────────────────────────────────────────── */}
        {photoUrl && !imgError ? (
          <img
            src={photoUrl}
            alt={nom}
            onError={() => setImgError(true)}
            className="w-full h-64 sm:h-80 object-cover"
          />
        ) : (
          <div className="p-4 pb-0">
            <ImagePlaceholder nom={nom} />
          </div>
        )}

        {/* ── Infos principales ─────────────────────────────────────────── */}
        <div className="p-6 space-y-5">

          {/* Titre + badges */}
          <div className="flex flex-wrap justify-between items-start gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                {materiel.categorie ?? 'Non classé'}
              </span>
              <h2 className="text-lg font-bold text-slate-800 mt-1">{nom}</h2>
              <p className="text-xs font-mono text-slate-400 mt-0.5">{code}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              {materiel.etat && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${etatColors[materiel.etat] ?? 'bg-slate-100 text-slate-600'}`}>
                  {etatLabels[materiel.etat] ?? materiel.etat}
                </span>
              )}
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${dispo > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                {dispo > 0 ? `● ${dispo} disponible${dispo > 1 ? 's' : ''}` : '● Indisponible'}
              </span>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-3">
            <StatBadge label="Total" value={total} color="blue" />
            <StatBadge label="Disponibles" value={dispo} color="green" />
            <StatBadge label="En emprunt" value={enEmprunt} color="amber" />
          </div>

          {/* Description */}
          {materiel.description && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Spécifications / Remarques
              </h4>
              <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3 leading-relaxed">
                {materiel.description}
              </p>
            </div>
          )}

          {/* Emplacement */}
          {materiel.emplacement && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <svg className="h-4 w-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span><span className="font-semibold text-slate-600">Emplacement :</span> {materiel.emplacement}</span>
            </div>
          )}

          {/* Bouton emprunt */}
          <div className="pt-2 border-t border-slate-100">
            {dispo > 0 ? (
              <button
                onClick={() => navigate(`/user/demande?materiel=${id}`)}
                className="w-full py-3 bg-[#0C326F] hover:bg-blue-900 text-white font-bold text-sm rounded-xl transition-all shadow-sm"
              >
                Faire une demande d'emprunt
              </button>
            ) : (
              <div className="w-full py-3 bg-slate-100 text-slate-400 font-semibold text-sm rounded-xl text-center cursor-not-allowed">
                Aucune unité disponible actuellement
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}