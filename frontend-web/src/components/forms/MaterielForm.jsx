// src/components/forms/MaterielForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/api';

// ─── Icônes SVG épurées ──────────────────────────────────────────────────────
function PackageIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4 7.55 4.24a1.79 1.79 0 0 0-1.8 0l-3.5 2a1.79 1.79 0 0 0-.95 1.56v8.4a1.79 1.79 0 0 0 .95 1.56l3.5 2a1.79 1.79 0 0 0 1.8 0l9-5.2a1.79 1.79 0 0 0 .95-1.56V9.4a1.79 1.79 0 0 0-.95-1.56z"/><path d="M6 5v13.5M12 22V11.5M18.5 5.5l-12 7M2 7.5l10 5.5 10-5.5"/></svg>;
}

function AlertIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}

function ImageIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
}

// ─── Sous-composant de Champ Réutilisable ────────────────────────────────────
function InputField({ label, name, value, onChange, type = 'text', placeholder = '', required = false }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 transition-all"
      />
    </div>
  );
}

// ─── Composant Principal ────────────────────────────────────────────────────
export default function MaterielForm({ initialData, onSaveSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    designation: '',
    code_barre: '',
    categorie: '',
    quantite: 1,
    etat: 'NEUF',
    emplacement: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Si le matériel a déjà une image, l'afficher en aperçu
      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérification taille (max 5 Mo)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Utiliser FormData pour pouvoir envoyer le fichier image
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });
      if (imageFile) {
        payload.append('image', imageFile);
      }

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      if (initialData?.id) {
        await api.put(`api/materiels/${initialData.id}/`, payload, config);
      } else {
        await api.post('api/materiels/', payload, config);
      }

      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde du matériel:", err);
      const serverError = err.response?.data;
      if (serverError && typeof serverError === 'object') {
        const firstMessage = Object.values(serverError)[0];
        setError(Array.isArray(firstMessage) ? firstMessage[0] : firstMessage);
      } else {
        setError("Erreur de communication avec le serveur. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 overflow-hidden font-sans">
      <div className="bg-[#0C326F] px-6 py-4 text-white flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-lg">
          <PackageIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold">{initialData?.id ? "Modifier l'équipement" : 'Ajouter un équipement'}</h2>
          <p className="text-white/60 text-[11px]">Enregistrement et traçabilité du parc matériel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Désignation du matériel"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="ex: Routeur Cisco ISR 4331"
            required
          />
          <InputField
            label="Numéro de série / Tag QR (Code barre)"
            name="code_barre"
            value={formData.code_barre}
            onChange={handleChange}
            placeholder="ex: SN-UJKZ-2026-0041"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Catégorie <span className="text-rose-500">*</span>
            </label>
            <select
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-800 focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 outline-none transition-all"
            >
              <option value="">Choisir...</option>
              <option value="INFORMATIQUE">Informatique</option>
              <option value="RESEAU">Réseau / Télécoms</option>
              <option value="ELECTRONIQUE">Électronique</option>
              <option value="MESURE">Appareils de mesure</option>
            </select>
          </div>

          <InputField
            label="Quantité reçue"
            name="quantite"
            type="number"
            value={formData.quantite}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              État global <span className="text-rose-500">*</span>
            </label>
            <select
              name="etat"
              value={formData.etat}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-800 focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 outline-none transition-all"
            >
              <option value="NEUF">Neuf</option>
              <option value="BON">Bon état</option>
              <option value="PANNE">En panne</option>
              <option value="MAINTENANCE">En maintenance</option>
            </select>
          </div>
        </div>

        <InputField
          label="Emplacement (Salle / Armoire / Tiroir)"
          name="emplacement"
          value={formData.emplacement}
          onChange={handleChange}
          placeholder="ex: Labo Réseau, Armoire de gauche, Étagère 2"
          required
        />

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Spécifications ou Remarques complémentaires
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            placeholder="ex: Fourni avec deux câbles d'alimentation et un câble console."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 transition-all resize-none"
          />
        </div>

        {/* ── Champ Photo ────────────────────────────────────────────────── */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Photo du matériel
          </label>

          {imagePreview ? (
            // Aperçu de l'image sélectionnée
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Aperçu"
                className="h-36 w-48 object-cover rounded-xl border border-slate-200 shadow-sm"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow transition-colors"
                title="Supprimer la photo"
              >
                ✕
              </button>
              <p className="text-[11px] text-slate-400 mt-1">
                {imageFile ? imageFile.name : 'Photo actuelle'}
              </p>
            </div>
          ) : (
            // Zone de drop / clic pour uploader
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 w-48 h-36 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-[#0C326F] cursor-pointer transition-all group"
            >
              <ImageIcon className="h-8 w-8 text-slate-300 group-hover:text-[#0C326F] transition-colors" />
              <span className="text-[11px] text-slate-400 group-hover:text-[#0C326F] font-medium text-center px-2">
                Cliquer pour ajouter<br />une photo
              </span>
              <span className="text-[10px] text-slate-300">JPG, PNG · max 5 Mo</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
            <AlertIcon className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 border border-slate-200 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-6 bg-[#0C326F] hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
          >
            {loading ? 'Enregistrement en cours...' : "Sauvegarder l'équipement"}
          </button>
        </div>
      </form>
    </div>
  );
}