// src/components/forms/EmpruntForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';

// ─── Icônes SVG ─────────────────────────────────────────────────────────────
function CalendarIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function AlertIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}

// ─── Composant Principal ────────────────────────────────────────────────────
export default function EmpruntForm({ onSaveSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [materiels, setMateriels] = useState([]); // Liste issue de la DB
  const [loadingMateriels, setLoadingMateriels] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    materiel: '', // Contient l'ID du matériel sélectionné
    quantite_demandee: 1,
    date_emprunt: '',
    date_retour_prevue: '',
    motif: ''
  });

  // Charger la liste du matériel depuis Django au montage du composant
  useEffect(() => {
    const fetchMateriels = async () => {
      try {
        const res = await api.get('api/materiels/');
        // On filtre optionnellement pour n'afficher que le matériel en BON état ou NEUF
        const dispo = Array.isArray(res.data) ? res.data : res.data.results || [];
        setMateriels(dispo);
      } catch (err) {
        console.error("Erreur chargement liste matériel:", err);
        setError("Impossible de récupérer la liste des équipements disponibles.");
      } finally {
        setLoadingMateriels(false);
      }
    };
    fetchMateriels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Vérification de sécurité locale sur les dates
    if (new Date(formData.date_retour_prevue) < new Date(formData.date_emprunt)) {
      setError("La date de retour prévue ne peut pas être antérieure à la date d'emprunt.");
      setLoading(false);
      return;
    }

    try {
      // Envoi du payload à l'API : api/emprunts/
      await api.post('api/emprunts/', {
        materiel: parseInt(formData.materiel), // ID du modèle ForeignKey
        quantite: parseInt(formData.quantite_demandee),
        date_debut: formData.date_emprunt,
        date_fin_prevue: formData.date_retour_prevue,
        motif: formData.motif
      });

      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error("Erreur lors de la demande d'emprunt:", err);
      const serverError = err.response?.data;
      if (serverError && typeof serverError === 'object') {
        const firstMessage = Object.values(serverError)[0];
        setError(Array.isArray(firstMessage) ? firstMessage[0] : firstMessage);
      } else {
        setError("Erreur serveur lors de la soumission. Vérifiez les stocks disponibles.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 overflow-hidden font-sans">
      <div className="bg-[#0C326F] px-6 py-4 text-white flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-lg">
          <CalendarIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold">Nouvelle demande d'emprunt</h2>
          <p className="text-white/60 text-[11px]">Formulaire de réservation de matériel pédagogique</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Sélection du matériel */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Équipement requis <span className="text-rose-500">*</span>
          </label>
          <select
            name="materiel"
            value={formData.materiel}
            onChange={handleChange}
            required
            disabled={loadingMateriels}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-800 focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 outline-none transition-all disabled:opacity-60"
          >
            <option value="">{loadingMateriels ? 'Chargement du matériel...' : 'Choisir un équipement...'}</option>
            {materiels.map((m) => (
              <option key={m.id} value={m.id} disabled={m.quantite <= 0 || m.etat === 'PANNE'}>
                {m.designation} — [{m.categorie}] ({m.quantite > 0 ? `Stock : ${m.quantite}` : 'Rupture'})
              </option>
            ))}
          </select>
        </div>

        {/* Quantité demandée */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Quantité à emprunter <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            name="quantite_demandee"
            min="1"
            value={formData.quantite_demandee}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 transition-all"
          />
        </div>

        {/* Dates de l'emprunt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Date de retrait prévue <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="date_emprunt"
              value={formData.date_emprunt}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Date de retour estimée <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="date_retour_prevue"
              value={formData.date_retour_prevue}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 transition-all"
            />
          </div>
        </div>

        {/* Motif ou Contexte du TP */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Motif de la demande / Intitulé du TP <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="motif"
            value={formData.motif}
            onChange={handleChange}
            rows="3"
            required
            placeholder="ex: Réalisation du TP 2 d'administration système (Configuration Active Directory en binôme)."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 transition-all resize-none"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
            <AlertIcon className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
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
            disabled={loading || loadingMateriels}
            className="py-2.5 px-6 bg-[#0C326F] hover:bg-blue-900 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
          >
            {loading ? 'Soumission...' : 'Soumettre la demande'}
          </button>
        </div>
      </form>
    </div>
  );
}