// src/views/admin/Emprunts.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';

// ─── Config statuts ───────────────────────────────────────────────────────────
const STATUTS = {
  EN_ATTENTE:     { label: 'En attente',       bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500',   pulse: true  },
  APPROUVE:       { label: 'Approuvé',          bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500',    pulse: false },
  EN_COURS:       { label: 'En cours',          bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', pulse: true  },
  RETOUR_DECLARE: { label: 'Retour déclaré',    bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500',  pulse: true  },
  RETOURNE:       { label: 'Retourné',          bg: 'bg-slate-100',  text: 'text-slate-500',   dot: 'bg-slate-400',   pulse: false },
  REFUSE:         { label: 'Refusé',            bg: 'bg-rose-50',    text: 'text-rose-600',    dot: 'bg-rose-500',    pulse: false },
  EN_RETARD:      { label: 'En retard',         bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-500',  pulse: true  },
  PERDU:          { label: 'Perdu / Dégradé',   bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-600',     pulse: false },
};

function StatutBadge({ statut }) {
  const c = STATUTS[statut] ?? { label: statut, bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400', pulse: false };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-black/5 ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot} ${c.pulse ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  );
}

const ETAT_RETOUR_OPTIONS = [
  { value: 'BON_ETAT',     label: '✅ Bon état' },
  { value: 'INCOMPLET',    label: '⚠️ Incomplet' },
  { value: 'ENDOMMAGE',    label: '🔧 Endommagé (part en maintenance)' },
  { value: 'HORS_SERVICE', label: '❌ Hors service (perte définitive)' },
];

// ─── Modal Valider (avec RDV) ─────────────────────────────────────────────────
function ModalValider({ emprunt, onClose, onSuccess }) {
  const [typeRdv, setTypeRdv] = useState('RETRAIT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const handleValider = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.post(`emprunts/${emprunt.id}/valider/`, { type_rdv: typeRdv });
      setConfirmation({ rdv: res.data.rdv, lieu: res.data.lieu });
      // On passe les modifications renvoyées ou le statut cible
      setTimeout(() => onSuccess(res.data.statut ? res.data : { statut: 'APPROUVE' }), 1200);
    } catch (err) {
      setError(err.response?.data?.error ?? 'Erreur lors de la validation.');
    } finally {
      setLoading(false);
    }
  };

  const nom = emprunt.materiel_nom ?? emprunt.materiel?.designation ?? `Matériel #${emprunt.materiel}`;
  const demandeur = emprunt.utilisateur_details
    ? `${emprunt.utilisateur_details.prenom ?? ''} ${emprunt.utilisateur_details.nom ?? ''}`.trim()
    : `Utilisateur #${emprunt.utilisateur}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-emerald-600 px-6 py-4 text-white">
          <h3 className="font-bold text-sm">Valider la demande d'emprunt</h3>
          <p className="text-emerald-100 text-xs mt-0.5">{nom} — {demandeur}</p>
        </div>
        <div className="p-6 space-y-4">
          {confirmation ? (
            <div className="text-center py-4 space-y-2">
              <div className="text-3xl">✅</div>
              <p className="text-sm font-semibold text-slate-700">Rendez-vous attribué automatiquement</p>
              <p className="text-xs text-slate-500">📅 {confirmation.rdv} — {confirmation.lieu}</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
                Le rendez-vous est attribué automatiquement sur le prochain créneau libre défini
                dans Planification des Rendez-vous, puis l'étudiant est notifié.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Type de rendez-vous</label>
                <select
                  value={typeRdv}
                  onChange={e => setTypeRdv(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="RETRAIT">Retrait du matériel</option>
                  <option value="RETOUR">Retour du matériel</option>
                </select>
              </div>

              {error && <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-xl">{error}</p>}

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
                  Annuler
                </button>
                <button
                  onClick={handleValider}
                  disabled={loading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  {loading ? 'Attribution en cours...' : '✓ Valider & attribuer un RDV'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Modal Refuser ────────────────────────────────────────────────────────────
function ModalRefuser({ emprunt, onClose, onSuccess }) {
  const [motif, setMotif] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRefuser = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.post(`emprunts/${emprunt.id}/refuser/`, { motif });
      onSuccess(res.data?.statut ? res.data : { statut: 'REFUSE' });
    } catch (err) {
      setError(err.response?.data?.error ?? 'Erreur lors du refus.');
    } finally {
      setLoading(false);
    }
  };

  const nom = emprunt.materiel_nom ?? emprunt.materiel?.designation ?? `Matériel #${emprunt.materiel}`;
  const demandeur = emprunt.utilisateur_details
    ? `${emprunt.utilisateur_details.prenom ?? ''} ${emprunt.utilisateur_details.nom ?? ''}`.trim()
    : `Utilisateur #${emprunt.utilisateur}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-rose-600 px-6 py-4 text-white">
          <h3 className="font-bold text-sm">Refuser la demande</h3>
          <p className="text-rose-100 text-xs mt-0.5">{nom} — {demandeur}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Motif du refus</label>
            <textarea
              value={motif}
              onChange={e => setMotif(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">Optionnel — l'étudiant sera notifié automatiquement.</p>
          </div>
          {error && <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-xl">{error}</p>}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
              Annuler
            </button>
            <button
              onClick={handleRefuser}
              disabled={loading}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
            >
              {loading ? 'Refus...' : '✕ Confirmer le refus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Confirmer le retrait physique (APPROUVE → EN_COURS, stock -1) ──────
function ModalConfirmerRetrait({ emprunt, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmer = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.post(`emprunts/${emprunt.id}/confirmer-retrait/`);
      onSuccess(res.data?.statut ? res.data : { statut: 'EN_COURS', date_sortie: new Date().toISOString() });
    } catch (err) {
      setError(err.response?.data?.error ?? 'Erreur lors de la confirmation du retrait.');
    } finally {
      setLoading(false);
    }
  };

  const nom = emprunt.materiel_nom ?? emprunt.materiel?.designation ?? `Matériel #${emprunt.materiel}`;
  const demandeur = emprunt.utilisateur_details
    ? `${emprunt.utilisateur_details.prenom ?? ''} ${emprunt.utilisateur_details.nom ?? ''}`.trim()
    : `Utilisateur #${emprunt.utilisateur}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-blue-700 px-6 py-4 text-white">
          <h3 className="font-bold text-sm">Confirmer le retrait physique</h3>
          <p className="text-blue-100 text-xs mt-0.5">{nom} — {demandeur}</p>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
            À confirmer uniquement lorsque le matériel a été physiquement remis à l'étudiant lors du rendez-vous.
            Cette action décrémente le stock disponible.
          </p>
          {error && <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-xl">{error}</p>}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
              Annuler
            </button>
            <button
              onClick={handleConfirmer}
              disabled={loading}
              className="px-5 py-2 bg-blue-700 hover:bg-blue-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
            >
              {loading ? 'Confirmation...' : '📤 Confirmer le retrait'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Confirmer le retour (RETOUR_DECLARE → RETOURNE/PERDU) ──────────────
function ModalConfirmerRetour({ emprunt, onClose, onSuccess }) {
  const [etatRetour, setEtatRetour] = useState('BON_ETAT');
  const [observations, setObservations] = useState(emprunt.observations ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmer = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.post(`emprunts/${emprunt.id}/confirmer-retour/`, {
        etat_retour: etatRetour,
        observations,
      });
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.error ?? 'Erreur lors de la confirmation du retour.');
    } finally {
      setLoading(false);
    }
  };

  const nom = emprunt.materiel_nom ?? emprunt.materiel?.designation ?? `Matériel #${emprunt.materiel}`;
  const demandeur = emprunt.utilisateur_details
    ? `${emprunt.utilisateur_details.prenom ?? ''} ${emprunt.utilisateur_details.nom ?? ''}`.trim()
    : `Utilisateur #${emprunt.utilisateur}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-orange-600 px-6 py-4 text-white">
          <h3 className="font-bold text-sm">Vérifier et confirmer le retour</h3>
          <p className="text-orange-100 text-xs mt-0.5">{nom} — {demandeur}</p>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
            L'étudiant a déclaré avoir rendu le matériel. Vérifiez son état physique avant de confirmer —
            le stock ne sera mis à jour qu'après cette validation.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">État constaté <span className="text-rose-500">*</span></label>
            <select
              value={etatRetour}
              onChange={e => setEtatRetour(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {ETAT_RETOUR_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {(etatRetour === 'ENDOMMAGE' || etatRetour === 'HORS_SERVICE') && (
            <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
              {etatRetour === 'ENDOMMAGE'
                ? "Le matériel réintègre le stock mais sera marqué « En panne » et l'emprunt sera classé « Perdu / Dégradé »."
                : "Le matériel sera retiré définitivement du parc utilisable et l'emprunt sera classé « Perdu / Dégradé »."}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Observations sur l'état du matériel</label>
            <textarea
              value={observations}
              onChange={e => setObservations(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">Optionnel — précisez tout défaut ou élément manquant.</p>
          </div>

          {error && <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-xl">{error}</p>}

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
              Annuler
            </button>
            <button
              onClick={handleConfirmer}
              disabled={loading}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
            >
              {loading ? 'Confirmation...' : '✅ Confirmer le retour'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Composant Principal ──────────────────────────────────────────────────────
export default function Emprunts() {
  const [emprunts, setEmprunts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [modal, setModal] = useState(null); // { type: 'valider'|'refuser'|'confirmer-retrait'|'confirmer-retour', emprunt }

  useEffect(() => { fetchEmprunts(); }, []);

  const fetchEmprunts = async () => {
    try {
      setLoading(true);
      const res = await api.get('emprunts/');
      const data = Array.isArray(res.data) ? res.data : res.data.results ?? [];
      setEmprunts(data);
    } catch (err) {
      setError('Impossible de charger les emprunts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalSuccess = (id, modifications) => {
    setEmprunts(prev => prev.map(e => e.id === id ? { ...e, ...modifications } : e));
    setModal(null);
  };

  const formatDate = (d) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
    catch { return d; }
  };

  const filtered = filtreStatut ? emprunts.filter(e => e.statut === filtreStatut) : emprunts;

  const counts = Object.fromEntries(
    Object.keys(STATUTS).map(s => [s, emprunts.filter(e => e.statut === s).length])
  );

  return (
    <div className="space-y-6">

      {/* Modals */}
      {modal?.type === 'valider' && (
        <ModalValider emprunt={modal.emprunt} onClose={() => setModal(null)}
          onSuccess={(modifs) => handleModalSuccess(modal.emprunt.id, modifs)} />
      )}
      {modal?.type === 'refuser' && (
        <ModalRefuser emprunt={modal.emprunt} onClose={() => setModal(null)}
          onSuccess={(modifs) => handleModalSuccess(modal.emprunt.id, modifs)} />
      )}
      {modal?.type === 'confirmer-retrait' && (
        <ModalConfirmerRetrait emprunt={modal.emprunt} onClose={() => setModal(null)}
          onSuccess={(modifs) => handleModalSuccess(modal.emprunt.id, modifs)} />
      )}
      {modal?.type === 'confirmer-retour' && (
        <ModalConfirmerRetour emprunt={modal.emprunt} onClose={() => setModal(null)}
          onSuccess={(modifs) => handleModalSuccess(modal.emprunt.id, modifs)} />
      )}

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Gestion des Emprunts</h3>
          <p className="text-xs text-slate-400">Valisez, refusez, confirmez les retraits et les retours de matériel.</p>
        </div>
        <button onClick={fetchEmprunts}
          className="text-xs bg-slate-100 text-slate-600 font-medium px-3 py-2 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          Actualiser
        </button>
      </div>

      {/* Compteurs rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { key: 'EN_ATTENTE',     label: 'En attente',       color: 'border-amber-200 bg-amber-50 text-amber-700' },
          { key: 'APPROUVE',       label: 'Retrait à faire',  color: 'border-blue-200 bg-blue-50 text-blue-700' },
          { key: 'EN_COURS',       label: 'En cours',         color: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
          { key: 'RETOUR_DECLARE', label: 'Retours à vérifier', color: 'border-orange-200 bg-orange-50 text-orange-700' },
          { key: 'RETOURNE',       label: 'Retournés',        color: 'border-slate-200 bg-slate-50 text-slate-600' },
        ].map(({ key, label, color }) => (
          <button key={key} onClick={() => setFiltreStatut(filtreStatut === key ? '' : key)}
            className={`p-3 rounded-xl border text-left transition-all ${color} ${filtreStatut === key ? 'ring-2 ring-offset-1 ring-current' : 'opacity-80 hover:opacity-100'}`}>
            <div className="text-2xl font-bold">{counts[key] ?? 0}</div>
            <div className="text-[11px] font-medium mt-0.5">{label}</div>
          </button>
        ))}
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-7 h-7 border-4 border-blue-100 border-t-[#0C326F] rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Chargement des emprunts...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <p className="text-sm text-slate-400 font-medium">
            {filtreStatut ? `Aucun emprunt avec le statut "${STATUTS[filtreStatut]?.label}".` : 'Aucun emprunt enregistré.'}
          </p>
          {filtreStatut && (
            <button onClick={() => setFiltreStatut('')} className="text-xs text-[#0C326F] font-semibold mt-2 hover:underline">
              Afficher tous les emprunts
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-slate-700">Flux des Emprunts</h4>
              <p className="text-xs text-slate-400">{filtered.length} emprunt{filtered.length > 1 ? 's' : ''}{filtreStatut ? ` · filtre : ${STATUTS[filtreStatut]?.label}` : ''}</p>
            </div>
            {filtreStatut && (
              <button onClick={() => setFiltreStatut('')} className="text-xs text-slate-400 hover:text-slate-600">✕ Effacer filtre</button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  {['Emprunteur', 'Matériel', 'Date sortie', 'Retour prévu', 'Retour effectif', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((item) => {
                  const demandeur = item.utilisateur_details
                    ? `${item.utilisateur_details.prenom ?? ''} ${item.utilisateur_details.nom ?? ''}`.trim()
                    : `Utilisateur #${item.utilisateur}`;
                  const nomMateriel = item.materiel_nom ?? item.materiel?.designation ?? `Matériel #${item.materiel}`;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-700 text-sm">{demandeur}</div>
                        {item.utilisateur_details?.email && (
                          <div className="text-[11px] text-slate-400">{item.utilisateur_details.email}</div>
                        )}
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-700 text-sm max-w-[180px]">
                        <div className="line-clamp-1">{nomMateriel}</div>
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(item.date_sortie)}
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(item.date_retour_prevue)}
                      </td>
                      <td className="px-4 py-4 text-xs whitespace-nowrap">
                        {item.date_retour_effective
                          ? <span className="text-emerald-600 font-medium">{formatDate(item.date_retour_effective)}</span>
                          : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-4">
                        <StatutBadge statut={item.statut} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {item.statut === 'EN_ATTENTE' && (
                            <>
                              <button onClick={() => setModal({ type: 'valider', emprunt: item })}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors">
                                ✓ Valider
                              </button>
                              <button onClick={() => setModal({ type: 'refuser', emprunt: item })}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold transition-colors">
                                ✕ Refuser
                              </button>
                            </>
                          )}
                          {item.statut === 'APPROUVE' && (
                            <button onClick={() => setModal({ type: 'confirmer-retrait', emprunt: item })}
                              className="px-2.5 py-1 bg-blue-700 hover:bg-blue-900 text-white rounded-lg text-[11px] font-bold transition-colors">
                              Confirmer retrait
                            </button>
                          )}
                          {item.statut === 'RETOUR_DECLARE' && (
                            <button onClick={() => setModal({ type: 'confirmer-retour', emprunt: item })}
                              className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[11px] font-bold transition-colors">
                              Vérifier retour
                            </button>
                          )}
                          {(item.statut === 'EN_COURS' || item.statut === 'EN_RETARD') && (
                            <span className="text-[11px] text-slate-300 italic">En attente de déclaration</span>
                          )}
                          {['RETOURNE', 'REFUSE', 'PERDU'].includes(item.statut) && (
                            <span className="text-[11px] text-slate-300 italic">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}