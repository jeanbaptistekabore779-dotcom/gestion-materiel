// src/views/users/ProfilUser.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useAuth } from '../../hooks/useAuth';
import { getPhotoUrl } from '../../utils/media';

const ROLE_LABELS = {
  ADMIN:      'Administrateur',
  TECHNICIEN: 'Technicien',
  ETUDIANT:   'Étudiant',
  ENSEIGNANT: 'Enseignant',
};

const ROLE_COLORS = {
  ADMIN:      'bg-blue-50 text-blue-700 border-blue-200',
  TECHNICIEN: 'bg-amber-50 text-amber-700 border-amber-200',
  ETUDIANT:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  ENSEIGNANT: 'bg-purple-50 text-purple-700 border-purple-200',
};

function InputField({ label, name, value, onChange, type = 'text', placeholder = '', disabled = false, required = false }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
          disabled
            ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-white border-slate-200 text-slate-800 focus:outline-none focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50'
        }`}
      />
    </div>
  );
}

export default function ProfilUser() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [formData, setFormData] = useState({
    nom:         '',
    prenom:      '',
    email:       '',
    telephone:   '',
    matricule:   '',
    departement: '',
    type_piece:  '',
    numero_piece:'',
  });

  const [photoFile, setPhotoFile]     = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [success, setSuccess]         = useState('');
  const [error, setError]             = useState('');

  // Charger le profil depuis l'API
  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await api.get('utilisateurs/me/');
        const d   = res.data;
        setFormData({
          nom:          d.nom          ?? '',
          prenom:       d.prenom       ?? '',
          email:        d.email        ?? '',
          telephone:    d.telephone    ?? '',
          matricule:    d.matricule    ?? '',
          departement:  d.departement  ?? '',
          type_piece:   d.type_piece   ?? '',
          numero_piece: d.numero_piece ?? '',
        });
        if (d.photo_profil) setPhotoPreview(getPhotoUrl(d.photo_profil));
      } catch (err) {
        console.error('Erreur profil:', err.response?.data);
        // Fallback sur les données du token JWT
        if (user) {
          setFormData({
            nom:          user.nom          ?? '',
            prenom:       user.prenom       ?? '',
            email:        user.email        ?? '',
            telephone:    user.telephone    ?? '',
            matricule:    user.matricule    ?? '',
            departement:  user.departement  ?? '',
            type_piece:   user.type_piece   ?? '',
            numero_piece: user.numero_piece ?? '',
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfil();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("La photo ne doit pas dépasser 5 Mo."); return; }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (v !== null && v !== undefined) payload.append(k, v); });
      if (photoFile) payload.append('photo_profil', photoFile);

      const res = await api.patch('utilisateurs/me/', payload);
      const updated = res.data;

      // ✅ Resynchronise l'affichage avec la VRAIE donnée renvoyée par le serveur
      // (au lieu de garder juste l'aperçu local temporaire, qui disparaît au rechargement
      // et n'est jamais visible sur les autres pages comme la Navbar)
      setFormData({
        nom:          updated.nom          ?? '',
        prenom:       updated.prenom       ?? '',
        email:        updated.email        ?? '',
        telephone:    updated.telephone    ?? '',
        matricule:    updated.matricule    ?? '',
        departement:  updated.departement  ?? '',
        type_piece:   updated.type_piece   ?? '',
        numero_piece: updated.numero_piece ?? '',
      });
      if (updated.photo_profil) setPhotoPreview(getPhotoUrl(updated.photo_profil));

      // ✅ Propage le changement au reste de l'app (Navbar, Sidebar…) via useAuth
      if (typeof setUser === 'function') {
        setUser((prev) => (prev ? { ...prev, ...updated } : updated));
      }

      setSuccess('Profil mis à jour avec succès !');
      setPhotoFile(null);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Erreur mise à jour:', err.response?.data);
      const serverError = err.response?.data;
      if (serverError && typeof serverError === 'object') {
        const msg = Object.entries(serverError).map(([k, v]) => `${k} : ${Array.isArray(v) ? v[0] : v}`).join(' | ');
        setError(msg);
      } else {
        setError('Erreur lors de la mise à jour. Veuillez réessayer.');
      }
    } finally {
      setSaving(false);
    }
  };

  const role        = user?.role?.toUpperCase() ?? 'ETUDIANT';
  const roleLabel   = ROLE_LABELS[role] ?? role;
  const roleColor   = ROLE_COLORS[role] ?? ROLE_COLORS.ETUDIANT;
  const initiales   = `${formData.prenom?.[0] ?? ''}${formData.nom?.[0] ?? ''}`.toUpperCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 gap-3">
        <div className="w-7 h-7 border-4 border-blue-100 border-t-[#0C326F] rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Chargement du profil…</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* En-tête profil */}
      <div className="bg-gradient-to-br from-[#0C326F] to-[#0a2a5e] rounded-2xl p-6 text-white flex items-center gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          {photoPreview ? (
            <img src={photoPreview} alt="Photo profil"
              className="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-lg" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {initiales || '?'}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-slate-100 transition-colors"
            title="Changer la photo"
          >
            <svg className="h-3.5 w-3.5 text-[#0C326F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handlePhotoChange} />
        </div>

        {/* Infos */}
        <div className="min-w-0">
          <h2 className="text-xl font-bold truncate">
            {formData.prenom || formData.nom ? `${formData.prenom} ${formData.nom}`.trim() : 'Mon Profil'}
          </h2>
          <p className="text-white/60 text-sm mt-0.5 truncate">{formData.email || 'email non renseigné'}</p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${roleColor}`}>
              {roleLabel}
            </span>
            {formData.matricule && (
              <span className="text-xs text-white/50 font-mono">{formData.matricule}</span>
            )}
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-700">Informations personnelles</h3>
          <p className="text-xs text-slate-400 mt-0.5">Modifiez vos informations et sauvegardez.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-medium">
              ✅ {success}
            </div>
          )}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Nom & Prénom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="ex: Jean Baptiste" required />
            <InputField label="Nom" name="nom" value={formData.nom} onChange={handleChange} placeholder="ex: KABORE" required />
          </div>

          {/* Email & Téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="ex: jean@ujkz.bf" />
            <InputField label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="ex: +226 70 00 00 00" />
          </div>

          {/* Matricule & Département */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Matricule" name="matricule" value={formData.matricule} onChange={handleChange} placeholder="ex: 2021/0041" />
            <InputField label="Département" name="departement" value={formData.departement} onChange={handleChange} placeholder="ex: Informatique" />
          </div>

          {/* Pièce d'identité */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Type de pièce</label>
              <select name="type_piece" value={formData.type_piece} onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-800 focus:outline-none focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 transition-all">
                <option value="">Choisir…</option>
                <option value="CNIB">CNIB</option>
                <option value="PASSEPORT">Passeport</option>
              </select>
            </div>
            <InputField label="Numéro de pièce" name="numero_piece" value={formData.numero_piece} onChange={handleChange} placeholder="ex: B1234567" disabled />
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => navigate(-1)}
              className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-[#0C326F] hover:bg-blue-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm">
              {saving ? 'Sauvegarde…' : 'Sauvegarder les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}