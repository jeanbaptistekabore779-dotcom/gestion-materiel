// src/views/Home.jsx
// Page d'accueil publique — UJKZ | Gestion-Matériel
// Composant React monolithique et autonome.
// Charte graphique Campus Faso : Bleu royal (blue-800) + Orange (amber-500).

import React from "react"

/* -------------------------------------------------------------------------- */
/* Icônes (SVG inline — remplacent lucide-react)                             */
/* -------------------------------------------------------------------------- */

function GraduationCapIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

function LogInIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  )
}

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function ShieldCheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function PackageSearchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
      <circle cx="18.5" cy="15.5" r="2.5" />
      <path d="M20.3 17.3 22 19" />
    </svg>
  )
}

function ClipboardCheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  )
}

function WrenchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

const features = [
  {
    Icon: PackageSearchIcon,
    title: "Consultation du stock en temps réel",
    description:
      "Visualisez instantanément la disponibilité de chaque équipement : ordinateurs, projecteurs, kits scientifiques et plus encore.",
  },
  {
    Icon: ClipboardCheckIcon,
    title: "Demandes d'emprunt simplifiées",
    description:
      "Étudiants et enseignants formulent leurs demandes en quelques clics et suivent leur validation en direct.",
  },
  {
    Icon: WrenchIcon,
    title: "Suivi & maintenance facilités",
    description:
      "Techniciens et administrateurs signalent les pannes, planifient les réparations et tracent chaque intervention.",
  },
]

/* -------------------------------------------------------------------------- */
/* Composant principal lié avec App.jsx                                      */
/* -------------------------------------------------------------------------- */
export default function Home({ onNavigateToLogin }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 antialiased">
      {/* ----------------------------- NAVBAR ----------------------------- */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-gray-50/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-800 text-white">
              <GraduationCapIcon className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-slate-900 md:text-base">
              <span className="text-blue-800">UJKZ</span>
              <span className="mx-1.5 text-slate-300">|</span>
              Gestion-Matériel
            </span>
          </div>

          {/* Bouton connecté à l'état de l'App */}
          <button
            onClick={onNavigateToLogin}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-800 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-900 shadow-sm"
          >
            <LogInIcon className="h-4 w-4" />
            Espace Privé
          </button>
        </div>
      </header>

      <main>
        {/* ------------------------------ HERO ------------------------------ */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-amber-500" />
                Plateforme officielle de l'Université Joseph KI-ZERBO
              </span>

              <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                Simplifiez la gestion et la traçabilité du{" "}
                <span className="text-blue-800">matériel pédagogique</span>
              </h1>

              <p className="max-w-xl text-pretty text-base leading-relaxed text-slate-500 md:text-lg">
                Consultez le stock disponible, formulez vos demandes d'emprunt et suivez la maintenance des
                équipements universitaires, le tout depuis un portail unique, clair et sécurisé.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Bouton d'action principal connecté à la connexion */}
                <button
                  onClick={onNavigateToLogin}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-800 px-6 text-base font-medium text-white transition-colors hover:bg-blue-900 shadow-md"
                >
                  Accéder au portail
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
                <span className="text-sm text-slate-500 sm:ml-2">
                  Étudiants, enseignants, techniciens &amp; administrateurs.
                </span>
              </div>
            </div>

            {/* Illustration */}
            <div className="relative">
              <div className="absolute inset-0 -z-10 translate-y-4 rounded-3xl bg-blue-800/5 blur-2xl" aria-hidden="true" />
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-blue-800/5">
                <div className="bg-gradient-to-br from-blue-800/10 via-white to-amber-500/10 p-6 md:p-8 flex justify-center items-center h-64 md:h-80">
                  {/* Une icône géante stylisée en attendant ton image physique réelle hero-equipment.png */}
                  <div className="text-center text-blue-800/30">
                    <PackageSearchIcon className="h-28 w-28 mx-auto stroke-[1.2]" />
                    <span className="text-xs font-semibold text-slate-400 mt-2 block">UJKZ Portail Matériel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------- FEATURES ---------------------------- */}
        <section className="border-t border-slate-200 bg-white/40">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Tout le cycle de vie du matériel, au même endroit
              </h2>
              <p className="text-pretty text-slate-500">
                Une expérience pensée pour chaque rôle de la communauté universitaire.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className="group rounded-2xl border border-slate-200 bg-gray-50 p-6 shadow-sm transition-shadow hover:shadow-md">
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-800/10 text-blue-800 transition-colors group-hover:bg-blue-800 group-hover:text-white">
                    <feature.Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mb-2 text-balance text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ----------------------------- FOOTER ----------------------------- */}
      <footer className="border-t border-slate-200 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <p className="text-center text-sm text-slate-500">
            © 2026 Université Joseph KI-ZERBO. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}