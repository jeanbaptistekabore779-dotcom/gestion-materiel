// src/views/auth/Register.jsx
import React, { useState } from 'react';
import api from '../../api/api';

//Icônes (Isolées pour de meilleures performances)
function UserPlusIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;
}
function CheckIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function AlertIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}
function EyeIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function EyeOffIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}
function CameraIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
}

//Étapes de l'inscription
const STEPS = [
  { id: 1, label: 'Identité' },
  { id: 2, label: 'Académique' },
  { id: 3, label: 'Confirmation' },
];

// Champ générique réutilisable 
function Field({ label, name, value, onChange, type = 'text', placeholder = '', required = false, readOnly = false, children }) {
  const maxDate = type === 'date' ? new Date().toISOString().split('T')[0] : undefined;
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          max={maxDate}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none
            ${readOnly
              ? 'bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed'
              : 'bg-white border-slate-200 text-slate-800 focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50'
            } ${children ? 'pr-11' : ''}`}
        />
        {children}
      </div>
    </div>
  );
}

const Spinner = () => (
  <span style={{
    display: 'inline-block', width: '1rem', height: '1rem',
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
  }} />
);

//  Composant Unique Principal
export default function RegisterCNIB({ onSuccess, onNavigateToLogin }) {
  const [step, setStep]             = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Rôle sélectionné (Étudiant par défaut)
  const [role, setRole] = useState('ETUDIANT');

  // Photo de profil
  const [photo, setPhoto]               = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Étape 1 — Identité
  const [identite, setIdentite] = useState({
    nom: '', prenom: '', dateNaissance: '', lieuNaissance: '',
    sexe: '', numeroCnib: '', nationalite: 'Burkinabè',
  });

  // Étape 2 — Académique + accès
  const [academique, setAcademique] = useState({
    matricule: '', filiere: '', niveau: 'Licence 1',
    annee: '2025-2026', telephone: '', email: '',
    username: '', password: '', passwordConfirm: '',
  });

  const handleIdentite = (e) => {
    const { name, value } = e.target;
    setIdentite((p) => ({
      ...p,
      [name]: name === 'numeroCnib' ? value.toUpperCase() : value,
    }));
  };
  const handleAcademique = (e) => {
    const { name, value } = e.target;
    if (name === 'matricule') {
      setAcademique((p) => ({ ...p, matricule: value.toUpperCase() }));
      return;
    }
    if (name === 'telephone') {
      // Autorise seulement chiffres et + pendant la saisie, sans forcer le préfixe
      setAcademique((p) => ({ ...p, telephone: value.replace(/[^\d+]/g, '') }));
      return;
    }
    setAcademique((p) => ({ ...p, [name]: value }));
  };

  // Normalise un numéro saisi (8 chiffres locaux OU +226 + 8 chiffres) vers +226XXXXXXXX
  const normaliserTelephone = (valeur) => {
    const v = valeur.trim();
    if (/^\+226\d{8}$/.test(v)) return v;
    if (/^226\d{8}$/.test(v)) return `+${v}`;
    if (/^\d{8}$/.test(v)) return `+226${v}`;
    return v; // format non reconnu, laissé tel quel pour que la validation l'affiche en erreur
  };

  // ─── Contrôle de la date de naissance ───────────────────────────
  // Règle : date valide, pas dans le futur, âge minimum de 15 ans
  // (âge légal minimum pour la CNIB au Burkina Faso).
  const AGE_MINIMUM = 15;

  const calculerAge = (dateStr) => {
    const naissance = new Date(dateStr);
    const aujourdHui = new Date();
    let age = aujourdHui.getFullYear() - naissance.getFullYear();
    const m = aujourdHui.getMonth() - naissance.getMonth();
    if (m < 0 || (m === 0 && aujourdHui.getDate() < naissance.getDate())) {
      age--;
    }
    return age;
  };

  const erreurDateNaissance = () => {
    if (!identite.dateNaissance) return null; // champ non obligatoire à la saisie, contrôlé seulement si rempli
    const date = new Date(identite.dateNaissance);
    if (isNaN(date.getTime())) return 'Date de naissance invalide.';
    if (date > new Date()) return 'La date de naissance ne peut pas être dans le futur.';
    if (calculerAge(identite.dateNaissance) < AGE_MINIMUM) {
      return `Vous devez avoir au moins ${AGE_MINIMUM} ans pour vous inscrire.`;
    }
    return null;
  };

  // ─── Contrôle du numéro CNIB ─────────────────────────────────────
  // Format officiel : 1 lettre + 8 chiffres (ex : B19879012).
  const CNIB_REGEX = /^[A-Za-z]\d{8}$/;

  const erreurCnib = () => {
    const valeur = identite.numeroCnib.trim();
    if (!valeur) return 'Le numéro CNIB est obligatoire.';
    if (!CNIB_REGEX.test(valeur)) {
      return 'Le numéro CNIB doit être au format 1 lettre + 8 chiffres (ex : B19879012).';
    }
    return null;
  };

  // ─── Contrôle du numéro de téléphone ─────────────────────────────
  // Accepte soit +226 + 8 chiffres, soit directement 8 chiffres locaux.
  const erreurTelephone = () => {
    const valeur = academique.telephone.trim();
    if (!valeur) return 'Le numéro de téléphone est obligatoire.';
    const estValide = /^\+226\d{8}$/.test(valeur) || /^226\d{8}$/.test(valeur) || /^\d{8}$/.test(valeur);
    if (!estValide) {
      return 'Format attendu : 8 chiffres, avec ou sans indicatif +226 (ex : +22667024005 ou 67024005).';
    }
    return null;
  };
  //  Contrôle du numéro matricule 
  // ÉTUDIANT Format : 1 lettre (E = BAC étranger, N = BAC national) + 10 chiffres
  // + 1 chiffre final indiquant le sexe (1 = garçon, 2 = fille).
  // Ex : E02215320221 (garçon, BAC étranger), N02256789022 (fille, BAC national).
  // ENSEIGNANT Format non standardisé connu à ce jour : contrôle simple
  // (non vide, alphanumérique, au moins 4 caractères). À resserrer dès que
  // le format officiel du matricule enseignant sera connu.
  const MATRICULE_REGEX = /^[EN]\d{10}([12])$/;
  const MATRICULE_ENSEIGNANT_REGEX = /^[A-Za-z0-9]{4,20}$/;

  const erreurMatricule = () => {
    const valeur = academique.matricule.trim();
    if (!valeur) return 'Le numéro matricule est obligatoire.';

    if (role === 'ENSEIGNANT') {
      if (!MATRICULE_ENSEIGNANT_REGEX.test(valeur)) {
        return 'Le matricule doit contenir au moins 4 caractères alphanumériques.';
      }
      return null;
    }

    const match = valeur.match(MATRICULE_REGEX);
    if (!match) {
      return 'Format attendu : 1 lettre (E ou N) + 10 chiffres + 1 chiffre (1 ou 2), ex : E02215320221.';
    }
    const chiffreSexe = match[1];
    if (identite.sexe) {
      const sexeAttendu = chiffreSexe === '1' ? 'Masculin' : 'Féminin';
      if (identite.sexe !== sexeAttendu) {
        return `Le dernier chiffre du matricule (${chiffreSexe}) correspond à "${sexeAttendu}", mais vous avez indiqué "${identite.sexe}" à l'étape 1.`;
      }
    }
    return null;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("La photo ne doit pas dépasser 5 Mo.");
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError('');
  };

  // Validation de l'étape 1 (Active le bouton continuer)
  const step1Valid =
    identite.nom &&
    identite.prenom &&
    identite.numeroCnib &&
    !erreurDateNaissance() &&
    !erreurCnib();

  const handleContinuer = () => {
    const errCnib = erreurCnib();
    const errDate = erreurDateNaissance();
    if (errCnib || errDate) {
      setError(errCnib || errDate);
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMatricule = erreurMatricule();
    const errTelephone = erreurTelephone();
    if (errMatricule) {
      setError(errMatricule);
      return;
    }
    if (errTelephone) {
      setError(errTelephone);
      return;
    }
    if (academique.password !== academique.passwordConfirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('identifiant', academique.username);
      formData.append('mot_de_passe', academique.password);
      formData.append('email', academique.email);
      formData.append('prenom', identite.prenom);
      formData.append('nom', identite.nom);
      formData.append('numero_piece', identite.numeroCnib);
      formData.append('type_piece', 'CNIB');
      formData.append('role', role);
      formData.append('matricule', academique.matricule);
      formData.append('departement', academique.filiere);
      formData.append('telephone', normaliserTelephone(academique.telephone));
      if (photo) formData.append('photo_profil', photo);

      await api.post('utilisateurs/inscription/', formData);
      setStep(3);
      if (onSuccess) onSuccess();
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const first = Object.values(data)[0];
        setError(Array.isArray(first) ? first[0] : first);
      } else {
        setError("Erreur lors de l'inscription. Vérifiez les champs et réessayez.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col items-center justify-start py-10 px-4 font-sans">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div className="w-full max-w-2xl mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#0C326F] text-white px-4 py-1.5 rounded-full text-xs font-bold mb-4">
          <UserPlusIcon className="h-4 w-4" />
          Inscription GM / UFR/SEA
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Créer votre compte étudiant</h1>
        <p className="text-slate-500 text-sm mt-1">Remplissez le formulaire pour accéder au portail</p>
      </div>

      {/* Indicateur d'étapes */}
      {step < 3 && (
        <div className="w-full max-w-2xl mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    step > s.id   ? 'bg-emerald-500 border-emerald-500 text-white' :
                    step === s.id ? 'bg-[#0C326F] border-[#0C326F] text-white' :
                                    'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {step > s.id ? <CheckIcon className="h-4 w-4" /> : s.id}
                  </div>
                  <span className={`text-[10px] font-semibold hidden sm:block ${step >= s.id ? 'text-slate-700' : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded transition-all ${step > s.id ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Formulaire Multi-étapes */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

        {/* ── ÉTAPE 1 : Identité ────────────────────────────────── */}
        {step === 1 && (
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Informations d'identité</h2>
              <p className="text-xs text-slate-500 mt-1">Renseignez vos informations personnelles telles qu'elles figurent sur votre CNIB.</p>
            </div>

            {/* Sélecteur de rôle */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Je m'inscris en tant que <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('ETUDIANT')}
                  className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    role === 'ETUDIANT'
                      ? 'bg-[#0C326F] border-[#0C326F] text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Étudiant
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ENSEIGNANT')}
                  className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    role === 'ENSEIGNANT'
                      ? 'bg-[#0C326F] border-[#0C326F] text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Enseignant
                </button>
              </div>
            </div>

            {/* Photo de profil */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                {photoPreview ? (
                  <img src={photoPreview} alt="Aperçu" className="h-20 w-20 rounded-full object-cover border-2 border-slate-200" />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                    <CameraIcon className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Photo de profil
                </label>
                <label className="inline-block cursor-pointer text-xs font-semibold px-4 py-2 rounded-xl bg-[#0C326F] text-white hover:bg-blue-900 transition-colors">
                  {photo ? 'Changer la photo' : 'Choisir une photo'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1">JPEG ou PNG, 5 Mo max (facultatif).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nom" name="nom" value={identite.nom} onChange={handleIdentite} placeholder="KABORÉ" required />
              <Field label="Prénom(s)" name="prenom" value={identite.prenom} onChange={handleIdentite} placeholder="Jean Baptiste" required />
              <div>
                <Field label="Numéro CNIB" name="numeroCnib" value={identite.numeroCnib} onChange={handleIdentite} placeholder="B123456789" required />
                {identite.numeroCnib && erreurCnib() && (
                  <p className="text-[11px] text-rose-500 mt-1">{erreurCnib()}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Sexe</label>
                <select name="sexe" value={identite.sexe} onChange={handleIdentite}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 outline-none transition-all">
                  <option value="">Choisir...</option>
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                </select>
              </div>
              <div>
                <Field
                  label="Date de naissance"
                  name="dateNaissance"
                  value={identite.dateNaissance}
                  onChange={handleIdentite}
                  type="date"
                />
                {identite.dateNaissance && erreurDateNaissance() && (
                  <p className="text-[11px] text-rose-500 mt-1">{erreurDateNaissance()}</p>
                )}
              </div>
              <Field label="Lieu de naissance" name="lieuNaissance" value={identite.lieuNaissance} placeholder="Ouagadougou" onChange={handleIdentite} />
              <Field label="Nationalité" name="nationalite" value={identite.nationalite} onChange={handleIdentite} />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                <AlertIcon className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button type="button" onClick={onNavigateToLogin}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                ← Déjà inscrit ? Se connecter
              </button>
              <button type="button" onClick={handleContinuer} disabled={!step1Valid}
                className="py-2.5 px-8 bg-[#0C326F] hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-sm">
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 2 : Académique + accès ─────────────────────── */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Informations académiques</h2>
              <p className="text-xs text-slate-500 mt-1">Complétez votre profil et créez vos identifiants de connexion.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Field
                  label="Numéro matricule"
                  name="matricule"
                  value={academique.matricule}
                  onChange={handleAcademique}
                  placeholder={role === 'ENSEIGNANT' ? 'Ex : ENS2025014' : 'E02215320221'}
                  required
                />
                {academique.matricule && erreurMatricule() && (
                  <p className="text-[11px] text-rose-500 mt-1">{erreurMatricule()}</p>
                )}
              </div>
              <div>
                <Field label="Téléphone" name="telephone" value={academique.telephone} onChange={handleAcademique} type="tel" placeholder="+22667024005" required />
                {academique.telephone && erreurTelephone() && (
                  <p className="text-[11px] text-rose-500 mt-1">{erreurTelephone()}</p>
                )}
              </div>
              {role === 'ETUDIANT' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                    Filière <span className="text-rose-500">*</span>
                  </label>
                  <select name="filiere" value={academique.filiere} onChange={handleAcademique} required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 outline-none transition-all">
                    <option value="">Choisir une filière</option>
                    <option value="Informatique(SIR)">Informatique(SIR)</option>
                    <option value="Informatique(GL)">Informatique(GL)</option>
                    <option value="Physique">Physique</option>
                    <option value="Chimie">Chimie</option>
          
                    <option value="Sciences de la Terre">Sciences de la Terre</option>
                  </select>
                </div>
              )}
              {role === 'ETUDIANT' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                    Niveau <span className="text-rose-500">*</span>
                  </label>
                  <select name="niveau" value={academique.niveau} onChange={handleAcademique} required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 outline-none transition-all">
                    <option value="Licence 1">Licence 1</option>
                    <option value="Licence 2">Licence 2</option>
                    <option value="Licence 3">Licence 3</option>
                    <option value="Master 1">Master 1</option>
                    <option value="Master 2">Master 2</option>
                  </select>
                </div>
              )}
              {role === 'ETUDIANT' && (
                <Field label="Année académique" name="annee" value={academique.annee} onChange={handleAcademique} readOnly />
              )}
              <Field label="Email universitaire" name="email" value={academique.email} onChange={handleAcademique} type="email" placeholder="prenom.nom@ujkz.bf" required />
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-slate-700">Accès au portail</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Identifiant de connexion" name="username" value={academique.username} onChange={handleAcademique} placeholder="j.kabore" required />
                <div />
                <Field label="Mot de passe" name="password" value={academique.password} onChange={handleAcademique} type={showPassword ? 'text' : 'password'} placeholder="••••••••" required>
                  <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" tabIndex={-1}>
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </Field>
                <Field label="Confirmer le mot de passe" name="passwordConfirm" value={academique.passwordConfirm} onChange={handleAcademique} type={showPassword ? 'text' : 'password'} placeholder="••••••••" required />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                <AlertIcon className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors">
                ← Retour
              </button>
              <button type="submit" disabled={submitting}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2">
                {submitting ? <><Spinner /> Création en cours...</> : '✅ Créer mon compte'}
              </button>
            </div>
          </form>
        )}

        {/* ── ÉTAPE 3 : Confirmation ────────────────────────────── */}
        {step === 3 && (
          <div className="p-10 text-center space-y-6">
            <div className="mx-auto h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
              <CheckIcon className="h-10 w-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Compte créé avec succès !</h2>
              <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
                Bienvenue <strong>{identite.prenom} {identite.nom}</strong> ! Votre compte a été enregistré.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 max-w-xs mx-auto border border-slate-100">
              {role === 'ETUDIANT' && (
                <p className="text-xs text-slate-500"><span className="font-semibold">Filière :</span> {academique.filiere}</p>
              )}
              {role === 'ETUDIANT' && (
                <p className="text-xs text-slate-500"><span className="font-semibold">Niveau :</span> {academique.niveau}</p>
              )}
              <p className="text-xs text-slate-500"><span className="font-semibold">Identifiant :</span> {academique.username}</p>
            </div>
            <button onClick={onNavigateToLogin}
              className="w-full max-w-xs mx-auto py-3 bg-[#0C326F] hover:bg-blue-900 text-white font-bold rounded-xl text-sm transition-all shadow-md block">
              Accéder à mon espace →
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-slate-400 text-center max-w-md">
        © 2026 · Projet de Fin de Cycle · Département Informatique · UJKZ
      </p>
    </div>
  );
}


