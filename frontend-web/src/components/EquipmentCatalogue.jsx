import React, { useState } from 'react';
import { SearchIcon, SlidersHorizontalIcon, PlusIcon } from 'lucide-react';

export default function EquipmentCatalogue({ role }) {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const categories = ['Tous', 'Informatique', 'Audiovisuel', 'Laboratoire'];

  // Données de démonstration basées sur vos visuels Figma
  const items = [
    { id: 1, name: 'Ordinateur Portable Mac Pro', category: 'Informatique', status: 'Disponible', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80' },
    { id: 2, name: 'Vidéoprojecteur Epson 4K', category: 'Audiovisuel', status: 'Disponible', img: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=500&q=80' },
  ];

  return (
    <div className="space-y-6">
      {/* BARRE DE RECHERCHE & FILTRES */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un matériel, une référence..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#1A3673] focus:ring-1 focus:ring-[#1A3673] shadow-sm transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors">
            <SlidersHorizontalIcon className="h-4 w-4 text-slate-500" />
            <span>Filtres</span>
          </button>
          
          {/* BOUTON AJOUTER : Uniquement pour l'Admin (voir Capture d'écran 2026-06-18 145329.jpg) */}
          {role === 'Admin' && (
            <button className="flex items-center gap-2 bg-[#1A3673] text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-blue-900 shadow-sm transition-colors">
              <PlusIcon className="h-4 w-4" />
              <span>Ajouter</span>
            </button>
          )}
        </div>
      </div>

      {/* FILTRES PAR CATÉGORIES */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-[#1A3673] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRILLE DE CARTES MATÉRIELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-80">
            <div className="relative bg-slate-100 flex-1 overflow-hidden">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <span className="absolute top-4 left-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {item.status}
              </span>
            </div>
            <div className="p-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">{item.category}</p>
              <h3 className="font-bold text-slate-800 text-base mt-1 group-hover:text-[#1A3673] transition-colors">{item.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}