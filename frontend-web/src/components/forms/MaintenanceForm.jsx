// src/components/forms/MaintenanceForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';

// ─── Icônes SVG ─────────────────────────────────────────────────────────────
function WrenchIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
}
function AlertIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}

// ─── Composant Principal ────────────────────────────────────────────────────
export default function MaintenanceForm({ onSaveSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [materiels, setMateriels] = useState([]);
  const [loadingMateriels, setLoadingMateriels] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    materiel: '', // ID du matériel concerné
    type_maintenance: 'CORRECTIVE', // CORRECTIVE (Panne) ou PREVENTIVE (Entretien)
    priorite: 'MOYENNE', // FAIBLE, MOYENNE, CRITIQUE
    description_panne: '',
    cout_estime: 0,
  });

  // Récupérer la liste complète du matériel pour cibler l'appareil défectueux
  useEffect(() => {
    const fetchMateriels = async () => {
      try {
        const res = await api.get('api/materiels/');
        const liste = Array.isArray(res.data) ? res.data : res.data.results || [];
        setMateriels(liste);
      } catch (err) {
        console.error("Erreur liste matériel pour maintenance:", err);
        setError("Impossible de charger les équipements pour le ticket de maintenance.");
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

    try {
      // Envoi à l'API Django : api/maintenance/
      await api.post('api/maintenance/', {
        materiel: parseInt(formData.materiel),
        type_maintenance: formData.type_maintenance,
        priorite: formData.priorite,
        description: formData.description_panne,
        cout: parseFloat(formData.cout_estime) || 0,
        statut: 'EN_COURS' // Statut initial automatique
      });

      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error("Erreur enregistrement maintenance:", err);
      const serverError = err.response?.data;
      if (serverError && typeof serverError === 'object') {
        const firstMessage = Object.values(serverError)[0];
        setError(Array.isArray(firstMessage) ? firstMessage[0] : firstMessage);
      } else {
        setError("Erreur lors de l'ouverture du ticket de maintenance.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 overflow-hidden font-sans">
      <div className="bg-[#0C326F] px-6 py-4 text-white flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-lg">
          <WrenchIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold">Déclarer un incident / Maintenance</h2>
          <p className="text-white/60 text-[11px]">Création d'un ticket d'intervention technique</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Choix du matériel en panne */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Équipement concerné <span className="text-rose-500">*</span>
          </label>
          <select
            name="materiel"
            value={formData.materiel}
            onChange={handleChange}
            required
            disabled={loadingMateriels}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-800 focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 outline-none transition-all disabled:opacity-60"
          >
            <option value="">{loadingMateriels ? 'Chargement du parc...' : 'Sélectionner l\'appareil défaillant...'}</option>
            {materiels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.designation} — (Code: {m.code_barre})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Type de Maintenance */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Type d'intervention <span className="text-rose-500">*</span>
            </label>
            <select
              name="type_maintenance"
              value={formData.type_maintenance}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-800 focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 outline-none transition-all"
            >
              <option value="CORRECTIVE">Corrective (Réparation de panne)</option>
              <option value="PREVENTIVE">Préventive (Entretien / Calibration)</option>
            </select>
          </div>

          {/* Niveau de Priorité */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Niveau d'urgence <span className="text-rose-500">*</span>
            </label>
            <select
              name="priorite"
              value={formData.priorite}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white text-slate-800 focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 outline-none transition-all"
            >
              <option value="FAIBLE">Faible (Utilisable ou non urgent)</option>
              <option value="MOYENNE">Moyenne (Bloquant pour certains TP)</option>
              <option value="CRITIQUE">Critique (Urgent / Équipement hors service)</option>
            </select>
          </div>
        </div>

        {/* Coût estimé (Optionnel) */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Coût estimé des pièces (FCFA)
          </label>
          <input
            type="number"
            name="cout_estime"
            min="0"
            value={formData.cout_estime}
            onChange={handleChange}
            placeholder="0"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 transition-all"
          />
        </div>

        {/* Description de la panne */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Rapport de dysfonctionnement / Symptômes <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="description_panne"
            value={formData.description_panne}
            onChange={handleChange}
            rows="3"
            required
            placeholder="Décrivez précisément le comportement anormal (ex: L'écran de l'oscilloscope scintille et s'éteint après 5 minutes d'utilisation)."
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
            {loading ? 'Ouverture...' : 'Ouvrir le ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}