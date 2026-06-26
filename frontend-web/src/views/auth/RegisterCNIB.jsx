import React, { useState } from 'react';
import api from '../../api/api';

// ─── Icônes ───────────────────────────────────────────────────────
function UserPlusIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;
}
function CheckIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function AlertIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}

// ─── Étapes ───────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Identité' },
  { id: 2, label: 'Académique' },
  { id: 3, label: 'Confirmation' },
];

// ─── Champ réutilisable ───────────────────────────────────────────
function Field({ label, name, value, onChange, type = 'text', placeholder = '', required = false, readOnly = false }) {
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
        readOnly={readOnly}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none
          ${readOnly
            ? 'bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed'
            : 'bg-white border-slate-200 text-slate-800 focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50'
          }`}
      />
    </div>
  );
}

// ─── Spinner CSS ──────────────────────────────────────────────────
const Spinner = () => (
  <span style={{
    display: 'inline-block', width: '1rem', height: '1rem',
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
  }} />
);

// ─── Composant principal ──────────────────────────────────────────
export default function RegisterCNIB({ onSuccess, onNavigateToLogin }) {
  const [step, setStep]           = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');

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

  const handleIdentite   = (e) => setIdentite((p)   => ({ ...p, [e.target.name]: e.target.value }));
  const handleAcademique = (e) => setAcademique((p) => ({ ...p, [e.target.name]: e.target.value }));

  // Validation étape 1
  const step1Valid = identite.nom && identite.prenom && identite.numeroCnib;

  // Soumission finale
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (academique.password !== academique.passwordConfirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.post('api/utilisateurs/utilisateurs/inscription/', {
        identifiant:  academique.username,   // serializer attend "identifiant"
        mot_de_passe: academique.password,   // serializer attend "mot_de_passe"
        email:        academique.email,
        prenom:       identite.prenom,
        nom:          identite.nom,
        numero_piece: identite.numeroCnib,
        type_piece:   'CNIB',
        role:         'ETUDIANT',
        matricule:    academique.matricule,
        departement:  academique.filiere,    // filiere → departement
        telephone:    academique.telephone,
      });
      setStep(3);
      if (onSuccess) onSuccess();
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const first = Object.values(data)[0];
        setError(Array.isArray(first) ? first[0] : first);
      } else {
        setError('Erreur lors de l\'inscription. Vérifiez les champs et réessayez.');
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
          Inscription — UJKZ / UFR/SEA
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

      {/* Carte */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

        {/* ── ÉTAPE 1 : Identité ────────────────────────────────── */}
        {step === 1 && (
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Informations d'identité</h2>
              <p className="text-xs text-slate-500 mt-1">Renseignez vos informations personnelles telles qu'elles figurent sur votre CNIB.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nom" name="nom" value={identite.nom} onChange={handleIdentite}
                placeholder="KABORÉ" required />
              <Field label="Prénom(s)" name="prenom" value={identite.prenom} onChange={handleIdentite}
                placeholder="Jean Baptiste" required />
              <Field label="Numéro CNIB" name="numeroCnib" value={identite.numeroCnib} onChange={handleIdentite}
                placeholder="B123456789" required />
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Sexe</label>
                <select name="sexe" value={identite.sexe} onChange={handleIdentite}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 outline-none">
                  <option value="">Choisir...</option>
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                </select>
              </div>
              <Field label="Date de naissance" name="dateNaissance" value={identite.dateNaissance} onChange={handleIdentite}
                type="date" />
              <Field label="Lieu de naissance" name="lieuNaissance" value={identite.lieuNaissance} onChange={handleIdentite}
                placeholder="Ouagadougou" />
              <Field label="Nationalité" name="nationalite" value={identite.nationalite} onChange={handleIdentite} />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button onClick={onNavigateToLogin}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                ← Déjà inscrit ? Se connecter
              </button>
              <button onClick={() => setStep(2)} disabled={!step1Valid}
                className="py-2.5 px-8 bg-[#0C326F] hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors">
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
              <Field label="Numéro matricule" name="matricule" value={academique.matricule} onChange={handleAcademique}
                placeholder="2025L3INF001" required />
              <Field label="Téléphone" name="telephone" value={academique.telephone} onChange={handleAcademique}
                type="tel" placeholder="+226 70 00 00 00" required />
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Filière <span className="text-rose-500">*</span>
                </label>
                <select name="filiere" value={academique.filiere} onChange={handleAcademique} required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 outline-none">
                  <option value="">Choisir une filière</option>
                  <option value="Informatique - SIR">Informatique — SIR</option>
                  <option value="Informatique - GL">Informatique — GL</option>
                  <option value="Mathématiques">Mathématiques</option>
                  <option value="Physique">Physique</option>
                  <option value="Chimie">Chimie</option>
                  <option value="Biologie">Biologie</option>
                  <option value="Sciences de la Terre">Sciences de la Terre</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Niveau <span className="text-rose-500">*</span>
                </label>
                <select name="niveau" value={academique.niveau} onChange={handleAcademique} required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 outline-none">
                  <option value="Licence 1">Licence 1</option>
                  <option value="Licence 2">Licence 2</option>
                  <option value="Licence 3">Licence 3</option>
                  <option value="Master 1">Master 1</option>
                  <option value="Master 2">Master 2</option>
                </select>
              </div>
              <Field label="Année académique" name="annee" value={academique.annee} onChange={handleAcademique} readOnly />
              <Field label="Email universitaire" name="email" value={academique.email} onChange={handleAcademique}
                type="email" placeholder="prenom.nom@ujkz.bf" required />
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-slate-700">Accès au portail</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Identifiant de connexion" name="username" value={academique.username} onChange={handleAcademique}
                  placeholder="j.kabore" required />
                <div />
                <Field label="Mot de passe" name="password" value={academique.password} onChange={handleAcademique}
                  type="password" placeholder="••••••••" required />
                <Field label="Confirmer le mot de passe" name="passwordConfirm" value={academique.passwordConfirm} onChange={handleAcademique}
                  type="password" placeholder="••••••••" required />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                <AlertIcon className="h-4 w-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors">
                ← Retour
              </button>
              <button type="submit" disabled={submitting}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                {submitting ? <><Spinner /> Création en cours...</> : '✅ Créer mon compte'}
              </button>
            </div>
          </form>
        )}

        {/* ── ÉTAPE 3 : Confirmation ────────────────────────────── */}
        {step === 3 && (
          <div className="p-10 text-center space-y-6">
            <div className="mx-auto h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckIcon className="h-10 w-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Compte créé avec succès !</h2>
              <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
                Bienvenue <strong>{identite.prenom} {identite.nom}</strong> !
                Votre compte a été enregistré. Vous pouvez maintenant vous connecter.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 max-w-xs mx-auto border border-slate-100">
              <p className="text-xs text-slate-500"><span className="font-semibold">Filière :</span> {academique.filiere}</p>
              <p className="text-xs text-slate-500"><span className="font-semibold">Niveau :</span> {academique.niveau}</p>
              <p className="text-xs text-slate-500"><span className="font-semibold">Identifiant :</span> {academique.username}</p>
            </div>
            <button onClick={onNavigateToLogin}
              className="w-full max-w-xs mx-auto py-3 bg-[#0C326F] hover:bg-blue-900 text-white font-bold rounded-xl text-sm transition-colors block">
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
