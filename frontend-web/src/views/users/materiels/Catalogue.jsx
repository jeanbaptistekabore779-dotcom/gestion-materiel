// src/views/users/materiels/Catalogue.jsx
import React, { useState } from 'react';

export default function Catalogue() {
  const [items, setItems] = useState([]);

  // Permet de charger un équipement en direct pour la démo
  const simulerChargementCatalogue = () => {
    const exemple = {
      id: 'MAT-771',
      nom: 'Valise Réseau Cisco Pédagogique',
      categorie: 'Informatique',
      dispo: 3,
      description: 'Contient 2 Switchs 2960 et 1 Routeur 1941 pour les TP de réseaux.'
    };
    setItems([exemple, ...items]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Catalogue des Équipements</h3>
          <p className="text-xs text-slate-400">Consultez la liste des matériels pédagogiques disponibles pour vos travaux pratiques.</p>
        </div>
        <button
          onClick={simulerChargementCatalogue}
          className="text-xs bg-slate-900 text-white font-medium px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
        >
          🔄 Charger un exemple de matériel
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <p className="text-sm text-slate-400 font-medium">Aucun matériel disponible dans le catalogue pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                    {item.categorie}
                  </span>
                  <h4 className="font-bold text-slate-800 mt-1">{item.nom}</h4>
                </div>
                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 font-semibold">
                  {item.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
              <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  ● {item.dispo} disponible(s)
                </span>
                <button className="text-xs font-bold text-[#1E40AF] hover:underline">
                  Voir les détails →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}