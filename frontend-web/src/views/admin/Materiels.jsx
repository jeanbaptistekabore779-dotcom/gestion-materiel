// src/views/admin/Materiels.jsx
import React, { useState, useEffect, useRef } from 'react';
import DataTable from '../../components/DataTable';
import api from '../../api/api';
import { getPhotoUrl } from '../../utils/media';

const emptyForm = {
  designation: '',
  code_barre: '',
  categorie_type: 'AUTRE',
  quantite: 1,
  emplacement_physique: '',
  description: '',
  photo: null,
};

// ─── Icônes vue ────────────────────────────────────────────────────
const IconGrid = (p) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconList = (p) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const statutStyles = {
  DISPONIBLE: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  EMPRUNTE:   'bg-blue-50 text-blue-700 border-blue-100',
  EN_PANNE:   'bg-rose-50 text-rose-600 border-rose-100',
  DEFAULT:    'bg-slate-100 text-slate-500 border-slate-200',
};

function StatutBadge({ statut }) {
  const cls = statutStyles[statut] ?? statutStyles.DEFAULT;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statut ?? 'DISPONIBLE'}
    </span>
  );
}

// ─── Carte matériel (vue grille) ───────────────────────────────────
function MaterielCard({ item, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="h-40 bg-slate-50 flex items-center justify-center overflow-hidden">
        {getPhotoUrl(item.photo) ? (
          <img src={getPhotoUrl(item.photo)} alt={item.designation} className="h-full w-full object-cover" />
        ) : (
          <span className="text-5xl"></span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-slate-800 text-sm leading-snug">{item.designation}</h4>
          <StatutBadge statut={item.statut} />
        </div>
        {item.description && (
          <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
        )}
        <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div>
            <span className="block text-[10px] uppercase text-slate-300 font-bold">Code barre</span>
            <span className="font-mono">{item.code_barre}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-300 font-bold">Catégorie</span>
            <span>{item.categorie_type ?? item.categorie}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-300 font-bold">Quantité</span>
            <span className="font-semibold text-slate-700">{item.quantite}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase text-slate-300 font-bold">Emplacement</span>
            <span className="line-clamp-1">{item.emplacement_physique || '—'}</span>
          </div>
        </div>
        <div className="mt-auto pt-3 flex items-center gap-4 border-t border-slate-50">
          <button onClick={() => onEdit(item)} className="text-xs font-bold text-[#1E40AF] hover:text-blue-800 transition-colors">
            Modifier
          </button>
          <button onClick={() => onDelete(item.id)} className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors">
            Retirer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Materiels() {
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [materiels, setMateriels]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);
  const [vue, setVue]               = useState('grille');
  const fileRef = useRef(null);

  const [formData, setFormData] = useState(emptyForm);
  const [preview, setPreview] = useState(null);

  useEffect(() => { fetchMateriels(); }, []);

  const fetchMateriels = async () => {
    try {
      setLoading(true);
      const res = await api.get('materiels/');
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setMateriels(data);
    } catch (err) {
      console.error('Erreur chargement:', err.response?.status, err.response?.data);
      setError('Impossible de charger les matériels.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(prev => ({ ...prev, photo: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, photo: null }));
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  // Ouvre le formulaire pré-rempli pour modifier un matériel existant
  const handleOuvrirEdition = (item) => {
    setEditingId(item.id);
    setFormData({
      designation: item.designation ?? '',
      code_barre: item.code_barre ?? '',
      categorie_type: item.categorie_type ?? 'AUTRE',
      quantite: item.quantite ?? 1,
      emplacement_physique: item.emplacement_physique ?? '',
      description: item.description ?? '',
      photo: null, 
    });
    setPreview(getPhotoUrl(item.photo) || null);
    setError(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ouvre le formulaire vide pour créer un nouveau matériel
  const handleOuvrirCreation = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setPreview(null);
    setError(null);
    setShowForm(true);
  };

  const handleFermer = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setPreview(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = new FormData();
      payload.append('designation', formData.designation);
      payload.append('code_barre', formData.code_barre);
      payload.append('categorie_type', formData.categorie_type);
      payload.append('quantite', formData.quantite);
      payload.append('emplacement_physique', formData.emplacement_physique || 'Dépôt Central');
      payload.append('description', formData.description);

      // Le champ photo n'est envoyé que si une NOUVELLE photo a été choisie
      // (évite d'écraser la photo existante avec du vide en mode édition)
      if (formData.photo) payload.append('photo', formData.photo);

      if (editingId) {
        // Mode édition : quantite_disponible n'est pas touché
        await api.patch(`materiels/${editingId}/`, payload);
      } else {
        // Mode création : quantite_disponible = quantite au départ
        payload.append('quantite_disponible', formData.quantite);
        await api.post('materiels/', payload);
      }

      await fetchMateriels();
      handleFermer();
    } catch (err) {
      console.error('Erreur enregistrement:', err.response?.data);
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

  const handleSupprimer = async (id) => {
    if (!window.confirm(`Retirer le matériel #${id} ?`)) return;
    try {
      await api.delete(`materiels/${id}/`);
      setMateriels(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Erreur suppression:', err.response?.data);
      setError('Erreur lors de la suppression.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Inventaire du matériel</h3>
          <p className="text-xs text-slate-400">Gérez l'ensemble du parc d'équipements pédagogiques.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle vue grille / liste */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setVue('grille')}
              title="Vue en cartes"
              className={`p-2 rounded-lg transition-colors ${vue === 'grille' ? 'bg-white shadow-sm text-[#1E40AF]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <IconGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setVue('liste')}
              title="Vue en liste"
              className={`p-2 rounded-lg transition-colors ${vue === 'liste' ? 'bg-white shadow-sm text-[#1E40AF]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <IconList className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => (showForm ? handleFermer() : handleOuvrirCreation())}
            className={`text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm ${
              showForm
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-[#1E40AF] text-white hover:bg-blue-800'
            }`}
          >
            {showForm ? '✕ Fermer' : '➕ Ajouter un matériel'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* ── Formulaire (création OU édition) ─────────────────────────────── */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-700 text-sm border-b border-slate-100 pb-2">
            {editingId ? `Modifier — ${formData.designation || 'Matériel #' + editingId}` : 'Nouvel Équipement Pédagogique'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Désignation <span className="text-rose-500">*</span></label>
              <input
                type="text" required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="Ex: Commutateur Cisco Catalyst 2960"
                className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">N° Série / Code barre <span className="text-rose-500">*</span></label>
              <input
                type="text" required
                value={formData.code_barre}
                onChange={(e) => setFormData({ ...formData, code_barre: e.target.value })}
                placeholder="Ex: SN-UJKZ-2026-0041"
                className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Catégorie</label>
              <select
                value={formData.categorie_type}
                onChange={(e) => setFormData({ ...formData, categorie_type: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              >
                <option value="ORDINATEUR">💻 Ordinateur</option>
                <option value="PROJECTEUR">📹 Vidéoprojecteur</option>
                <option value="RESEAU">🔌 Réseau (Routeur/Switch)</option>
                <option value="ACCESSOIRE">🖱️ Accessoire</option>
                <option value="AUTRE">📦 Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Quantité <span className="text-rose-500">*</span></label>
              <input
                type="number" min="1" required
                value={formData.quantite}
                onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
              {editingId && (
                <p className="text-[10px] text-slate-400 mt-1">La quantité disponible n'est pas modifiée ici.</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Emplacement</label>
              <input
                type="text"
                value={formData.emplacement_physique}
                onChange={(e) => setFormData({ ...formData, emplacement_physique: e.target.value })}
                placeholder="Ex: Labo Réseau"
                className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Description / Spécifications</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Fourni avec 2 câbles d'alimentation"
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E40AF] resize-none"
            />
          </div>

          {/* Upload photo */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Photo du matériel</label>
            <div
              onClick={() => fileRef.current.click()}
              className="flex items-center gap-4 cursor-pointer border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-blue-400 transition-colors"
            >
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Aperçu" className="h-16 w-16 object-cover rounded-lg border border-slate-200" />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold"
                  >✕</button>
                </div>
              ) : (
                <div className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center text-2xl">📷</div>
              )}
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {formData.photo ? formData.photo.name : editingId ? 'Cliquez pour changer la photo' : 'Cliquez pour ajouter une photo'}
                </p>
                <p className="text-xs text-slate-400">PNG, JPG jusqu'à 5 Mo</p>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit" disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              {submitting ? 'Enregistrement…' : editingId ? 'Enregistrer les modifications' : 'Enregistrer'}
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

      {/* ── Contenu : Grille ou Liste ─────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-7 h-7 border-4 border-blue-100 border-t-[#1E40AF] rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Chargement…</p>
        </div>
      ) : materiels.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <p className="text-sm text-slate-400 font-medium">Aucun matériel enregistré.</p>
        </div>
      ) : vue === 'grille' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {materiels.map((item) => (
            <MaterielCard key={item.id} item={item} onEdit={handleOuvrirEdition} onDelete={handleSupprimer} />
          ))}
        </div>
      ) : (
        <DataTable
          title="Parc de Matériel Référencé"
          headers={['Photo', 'Désignation', 'Code barre', 'Catégorie', 'Qté', 'Statut', 'Actions']}
          data={materiels}
          emptyMessage="Aucun matériel enregistré."
          renderRow={(item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3">
                {getPhotoUrl(item.photo) ? (
                  <img src={getPhotoUrl(item.photo)} alt={item.designation} className="h-10 w-10 rounded-lg object-cover border border-slate-200" />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg">📦</div>
                )}
              </td>
              <td className="px-4 py-4">
                <div className="font-semibold text-slate-700 text-sm">{item.designation}</div>
                {item.description && <div className="text-xs text-slate-400 line-clamp-1">{item.description}</div>}
              </td>
              <td className="px-4 py-4 font-mono text-xs text-slate-400">{item.code_barre}</td>
              <td className="px-4 py-4 text-xs text-slate-500 font-medium">{item.categorie_type ?? item.categorie}</td>
              <td className="px-4 py-4 font-mono text-sm text-slate-600 font-semibold">{item.quantite}</td>
              <td className="px-4 py-4">
                <StatutBadge statut={item.statut} />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleOuvrirEdition(item)}
                    className="text-xs font-bold text-[#1E40AF] hover:text-blue-800 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleSupprimer(item.id)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors"
                  >
                    Retirer
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      )}
    </div>
  );
}