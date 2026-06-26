import React, { useState } from 'react';

const EmpruntForm = ({ onSubmit, onCancel, initialData = {}, availableEquipment = [] }) => {
  const [formData, setFormData] = useState({
    equipmentId: initialData.equipmentId || '',
    quantity: initialData.quantity || 1,
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    purpose: initialData.purpose || '',
    supervisor: initialData.supervisor || '',
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-8 my-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="border-b border-slate-100 pb-5 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Demande d'Emprunt de Matériel</h2>
        <p className="text-xs text-slate-500 mt-1">
          Veuillez renseigner les détails de l'allocation pour validation par l'équipe technique.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Choix du matériel */}
        <div>
          <label htmlFor="equipmentId" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Matériel requis
          </label>
          <div className="relative">
            <select
              id="equipmentId"
              name="equipmentId"
              required
              value={formData.equipmentId}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>Choisir un équipement du catalogue</option>
              {availableEquipment.map((eq) => (
                <option key={eq.id} value={eq.id}>{eq.name} ({eq.availableQty} disponibles)</option>
              ))}
              {availableEquipment.length === 0 && (
                <option value="demo">Kit Oscilloscope / Arduino (Exemple)</option>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <span className="text-xs">▼</span>
            </div>
          </div>
        </div>

        {/* Quantité & Enseignant encadrant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Quantité
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              required
              value={formData.quantity}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <div>
            <label htmlFor="supervisor" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Enseignant responsable du TP
            </label>
            <input
              type="text"
              id="supervisor"
              name="supervisor"
              required
              value={formData.supervisor}
              onChange={handleChange}
              placeholder="Ex: Dr. Kaboré"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Dates de début et de fin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Date de retrait
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Date de restitution prévue
            </label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              required
              value={formData.endDate}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Motif */}
        <div>
          <label htmlFor="purpose" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Cadre d'utilisation / Projet
          </label>
          <textarea
            id="purpose"
            name="purpose"
            rows="3"
            required
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Ex: Réalisation des manipulations du TP d'Électronique de puissance."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-[#00428C] hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-md shadow-blue-800/10 transition"
          >
            🚀 Soumettre la demande
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmpruntForm;