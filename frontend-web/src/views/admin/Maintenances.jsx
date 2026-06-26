// src/views/admin/Maintenances.jsx
import React, { useState } from 'react';
import DataTable from '../../components/DataTable';

export default function Maintenances() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ materiel: '', technicien: 'Issa Ouedraogo', urgence: 'Moyenne' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: `MNT-${tasks.length + 10}`,
      materiel: formData.materiel,
      technicien: formData.technicien,
      urgence: formData.urgence,
      etat: 'Assignée'
    };
    setTasks([newTask, ...tasks]);
    setShowForm(false);
    setFormData({ ...formData, materiel: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Supervision de la Maintenance</h3>
          <p className="text-xs text-slate-400">Envoyez des ordres de réparation aux techniciens.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="text-sm font-semibold px-4 py-2 bg-[#1E40AF] text-white rounded-xl">
          {showForm ? '✕ Fermer' : '🔧 Lancer une maintenance'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 max-w-xl animate-fadeIn">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Matériel défaillant *</label>
            <input type="text" required value={formData.materiel} onChange={(e) => setFormData({...formData, materiel: e.target.value})} placeholder="Ex: Commutateur Cisco Salle 3" className="w-full px-3 py-2 border rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Urgence</label>
            <select value={formData.urgence} onChange={(e) => setFormData({...formData, urgence: e.target.value})} className="w-full px-3 py-2 border rounded-xl text-sm">
              <option value="Basse">🟢 Basse</option>
              <option value="Moyenne">🟡 Moyenne</option>
              <option value="Haute">🔴 Haute (Critique)</option>
            </select>
          </div>
          <button type="submit" className="bg-[#1E40AF] text-white text-xs font-bold px-4 py-2.5 rounded-xl">🚀 Assigner au technicien</button>
        </form>
      )}

      <DataTable
        title="Ordres de Réparation Émis"
        headers={['ID', 'Matériel concerné', 'Technicien assigné', 'Priorité', 'État']}
        data={tasks}
        renderRow={(task) => (
          <tr key={task.id} className="hover:bg-slate-50/50 transition-colors animate-fadeIn">
            <td className="px-6 py-4 font-mono text-xs font-bold">{task.id}</td>
            <td className="px-6 py-4 font-semibold text-slate-700">{task.materiel}</td>
            <td className="px-6 py-4 text-slate-600">{task.technicien}</td>
            <td className="px-6 py-4"><span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{task.urgence}</span></td>
            <td className="px-6 py-4 text-amber-600 font-medium">{task.etat}</td>
          </tr>
        )}
      />
    </div>
  );
}