// src/views/users/emprunts/NouvelEmprunt.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../../api/api';

export default function NouvelEmprunt() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [materiels, setMateriels] = useState([]);
  const [loadingMateriels, setLoadingMateriels] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    materiel: '',
    date_retour_prevue: '',
    observations: '',
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('materiels/');
        const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
        setMateriels(data.filter(m => (m.quantite_disponible ?? m.quantite ?? 0) > 0));

        const preselectedId = searchParams.get('materiel');
        if (preselectedId) {
          setFormData(prev => ({ ...prev, materiel: preselectedId }));
        }
      } catch {
        setError('Impossible de charger la liste des matériels.');
      } finally {
        setLoadingMateriels(false);
      }
    };
    fetch();
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.date_retour_prevue) {
      setError('La date de retour prévue est obligatoire.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('emprunts/', {
        materiel: parseInt(formData.materiel),
        date_retour_prevue: formData.date_retour_prevue + 'T23:59:00',
        observations: formData.observations || '',
      });

      setSuccess(true);
      setFormData({ materiel: '', date_retour_prevue: '', observations: '' });
      setTimeout(() => navigate('/user/mes-emprunts'), 2500);
    } catch (err) {
      console.error('Erreur emprunt:', err.response?.data);
      const serverError = err.response?.data;
      if (serverError && typeof serverError === 'object') {
        const msg = Object.entries(serverError)
          .map(([k, v]) => `${k} : ${Array.isArray(v) ? v[0] : v}`)
          .join(' | ');
        setError(msg);
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const materielSelectionne = materiels.find(m => String(m.id) === String(formData.materiel));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-800">Demande d'emprunt</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Formulaire de réservation d'un équipement pédagogique.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-sm font-semibold text-emerald-800">Demande soumise avec succès</p>
            <p className="text-xs text-emerald-600 mt-0.5">En attente de validation par l'administration. Redirection en cours...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <p className="text-sm font-semibold text-rose-800">Une erreur est survenue</p>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500">
              Matériel souhaité <span className="text-rose-500">*</span>
            </label>
            {loadingMateriels ? (
              <div className="w-full px-4 py-3 border border-slate-200 bg-slate-50 rounded-xl text-sm text-slate-400 animate-pulse">
                Chargement des matériels disponibles...
              </div>
            ) : (
              <select
                name="materiel"
                required
                value={formData.materiel}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 text-slate-700 transition-all"
              >
                <option value="">Sélectionner un matériel</option>
                {materiels.map((m) => {
                  const nom = m.designation ?? m.nom ?? 'Matériel';
                  const dispo = m.quantite_disponible ?? m.quantite ?? 0;
                  return (
                    <option key={m.id} value={m.id}>
                      {nom} ({dispo} disponible{dispo > 1 ? 's' : ''})
                    </option>
                  );
                })}
              </select>
            )}

            {materielSelectionne && (
              <div className="mt-2 flex flex-wrap gap-2 pt-1">
                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                  {materielSelectionne.quantite_disponible ?? materielSelectionne.quantite} disponible(s)
                </span>
                {materielSelectionne.emplacement_physique && (
                  <span className="text-xs bg-slate-50 text-slate-600 px-3 py-1 rounded-full border border-slate-100">
                    {materielSelectionne.emplacement_physique}
                  </span>
                )}
                {materielSelectionne.code_barre && (
                  <span className="text-xs bg-slate-50 text-slate-400 px-3 py-1 rounded-full border border-slate-100 font-mono">
                    {materielSelectionne.code_barre}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500">
              Date de retour prévue <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="date_retour_prevue"
              required
              value={formData.date_retour_prevue}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 transition-all"
            />
            <p className="text-xs text-slate-400 mt-1">
              La date de sortie sera enregistrée automatiquement au moment de la validation.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-500">
              Motif de l'emprunt
            </label>
            <textarea
              name="observations"
              rows="3"
              value={formData.observations}
              onChange={handleChange}
              placeholder="Ex: Réalisation des travaux pratiques du module réseau."
              className="w-full px-4 py-3 border border-slate-200 bg-white rounded-xl text-sm focus:outline-none focus:border-[#0C326F] focus:ring-2 focus:ring-blue-50 resize-none transition-all"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || loadingMateriels || !formData.materiel}
              className="bg-[#0C326F] hover:bg-[#092654] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Soumettre la demande'
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-xs text-slate-400">
          Chaque demande est soumise à l'approbation du gestionnaire. Vous recevrez une mise à jour dès que le statut de votre emprunt changera.
        </p>
      </div>
    </div>
  );
}