// src/views/users/materiels/Catalogue.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import { getPhotoUrl } from '../../../utils/media';

function ImagePlaceholder({ nom, compact = false }) {
  return (
    <div className={`w-full ${compact ? 'h-full' : 'h-44'} bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-2 ${compact ? 'rounded-xl' : 'rounded-t-2xl'}`}>
      <svg className={compact ? 'h-5 w-5 text-slate-300' : 'h-10 w-10 text-slate-300'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      {!compact && (
        <span className="text-[11px] text-slate-400 font-medium px-4 text-center line-clamp-1">{nom}</span>
      )}
    </div>
  );
}

function GridIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
}
function ListIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
}

export default function Catalogue() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const navigate = useNavigate();

  useEffect(() => { fetchMateriels(); }, []);

  const fetchMateriels = async () => {
    try {
      setLoading(true);
      const response = await api.get('materiels/');
      const data = Array.isArray(response.data) ? response.data : response.data.results ?? [];
      setItems(data);
    } catch (err) {
      console.error('Erreur chargement catalogue:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter((item) => {
    const matchSearch = !searchQuery ||
      (item.designation ?? item.nom ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategorie = !selectedCategorie ||
      item.categorie === selectedCategorie ||
      item.categorie_type === selectedCategorie;
    return matchSearch && matchCategorie;
  });

  const categories = [...new Set(
    items.map((i) => i.categorie ?? i.categorie_type).filter(Boolean)
  )];

  // Déclaré AVANT le return — pas dans le JSX
  const emptyMessage = (searchQuery || selectedCategorie)
    ? 'Aucun matériel ne correspond à votre recherche.'
    : 'Aucun matériel disponible dans le catalogue pour le moment.';

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Catalogue des Équipements</h3>
          <p className="text-xs text-slate-400">
            Consultez les matériels pédagogiques disponibles pour vos travaux pratiques.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
            {filtered.length} matériel{filtered.length !== 1 ? 's' : ''}
          </span>

          {/* Toggle Grille / Liste */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Affichage en grille"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-[#1E40AF]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <GridIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              title="Affichage en liste"
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white shadow-sm text-[#1E40AF]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Rechercher un matériel..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-blue-50 transition-all"
        />
        {categories.length > 0 && (
          <select
            value={selectedCategorie}
            onChange={(e) => setSelectedCategorie(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:border-[#1E40AF] transition-all"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-[#1E40AF] rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-400">Chargement du catalogue...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <p className="text-sm text-slate-400 font-medium">{emptyMessage}</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ── Affichage GRILLE (cards) ─────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const nom      = item.designation ?? item.nom ?? 'Matériel sans nom';
            const id       = item.id ?? item.code_barre ?? '—';
            const dispo    = item.quantite_disponible ?? item.quantite ?? 0;
            const photoUrl = getPhotoUrl(item.photo ?? item.image);

            return (
              <div
                key={id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Photo */}
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={nom}
                    onError={(e) => { e.target.style.display = 'none'; }}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <ImagePlaceholder nom={nom} />
                )}

                {/* Corps */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                        {item.categorie ?? item.categorie_type ?? 'Non classé'}
                      </span>
                      <h4 className="font-bold text-slate-800 mt-1 text-sm leading-snug">{nom}</h4>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 font-semibold shrink-0">
                      {typeof id === 'number' ? `MAT-${String(id).padStart(3, '0')}` : id}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                  )}

                  <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      dispo > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                    }`}>
                      {dispo > 0 ? `● ${dispo} disponible${dispo > 1 ? 's' : ''}` : '● Indisponible'}
                    </span>
                    <button
                      onClick={() => navigate(`/user/catalogue/${id}`)}
                      className="text-xs font-bold text-[#1E40AF] hover:underline"
                    >
                      Voir les détails →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Affichage LISTE ──────────────────────────────────────── */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y divide-slate-100 overflow-hidden">
          {filtered.map((item) => {
            const nom      = item.designation ?? item.nom ?? 'Matériel sans nom';
            const id       = item.id ?? item.code_barre ?? '—';
            const dispo    = item.quantite_disponible ?? item.quantite ?? 0;
            const photoUrl = getPhotoUrl(item.photo ?? item.image);

            return (
              <div
                key={id}
                onClick={() => navigate(`/user/catalogue/${id}`)}
                className="flex items-center gap-4 p-3 sm:p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {/* Miniature */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={nom}
                      onError={(e) => { e.target.style.display = 'none'; }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder nom={nom} compact />
                  )}
                </div>

                {/* Infos principales */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{nom}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md shrink-0">
                      {item.categorie ?? item.categorie_type ?? 'Non classé'}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">{item.description}</p>
                  )}
                </div>

                {/* Référence (masquée sur mobile) */}
                <span className="hidden sm:inline-block text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 font-semibold shrink-0">
                  {typeof id === 'number' ? `MAT-${String(id).padStart(3, '0')}` : id}
                </span>

                {/* Disponibilité */}
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                  dispo > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                }`}>
                  {dispo > 0 ? `● ${dispo} dispo.` : '● Indisponible'}
                </span>

                {/* Flèche */}
                <svg className="h-4 w-4 text-slate-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}