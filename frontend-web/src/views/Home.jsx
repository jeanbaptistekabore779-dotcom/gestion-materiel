import React, { useState, useEffect } from 'react';
import logoUjkz from '../assets/Logo.png';
import logoUO from '../assets/ujkz.png';
import logoUfrSea from '../assets/ufrsea.png';
import logoMesri from '../assets/MESRSI.jpg';
import logoLAMI from '../assets/LAMI.jpeg';


function FontImport() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');
      .font-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
      .font-mono-brand { font-family: 'JetBrains Mono', monospace; }

      @keyframes marquee {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        animation: marquee 20s linear infinite;
      }
      .animate-marquee:hover {
        animation-play-state: paused;
      }
    `}</style>
  );
}

function LogInIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>;
}
function UserPlusIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;
}
function PackageIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
}
function ClipboardIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>;
}
function WrenchIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
}
function ServerIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
}
function CheckCircleIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}
function MenuIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>;
}
function CloseIcon({ className }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

function SectionEyebrow({ children }) {
  return (
    <div className="font-mono-brand text-xs tracking-wide flex items-center gap-2 mb-3 text-[#2B6CB0]/70">
      <span className="text-slate-300">//</span>
      <span className="font-semibold uppercase">{children}</span>
    </div>
  );
}

function CircuitBackdrop() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.06]"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M60 0H0V60" fill="none" stroke="#173B5F" strokeWidth="0.4" />
        </pattern>
      </defs> 
    </svg>
  );
}

const slides = [
  {
    badge: 'UFR/SEA Département Informatique',
    title: 'Gérez le matériel pédagogique en toute transparence',
    subtitle: "Étudiants, enseignants et techniciens disposent d'un portail centralisé pour emprunter, suivre et gérer les équipements du département.",
    cta: 'Accéder à mon espace',
  },
  {
    badge: 'Gestion des stocks en temps réel',
    title: 'Consultez la disponibilité de chaque équipement',
    subtitle: "Le système centralise l'inventaire complet du matériel de laboratoire et pédagogique, accessible à tout moment depuis votre espace.",
    cta: 'Voir le catalogue',
  },
  {
    badge: 'Maintenance & Traçabilité',
    title: 'Signalez les pannes, suivez les interventions',
    subtitle: "Les techniciens disposent d'un tableau de bord dédié pour gérer les interventions, rédiger des rapports et archiver l'historique.",
    cta: 'Espace Technicien',
  },
];

const actualites = [
  {
    color: 'bg-[#2B6CB0] text-white',
    tag: 'Nouveau',
    title: 'Année académique 2025-2026',
    text: "Le système de gestion du matériel pédagogique est désormais opérationnel pour l'ensemble des filières du département. Les demandes d'emprunt sont ouvertes.",
  },
  {
    color: 'bg-amber-400 text-slate-900',
    tag: 'Information',
    title: "Procédure d'emprunt",
    text: "Les étudiants de Licence 3 et Master peuvent formuler leurs demandes d'emprunt en ligne. Délai de traitement : 24h ouvrables. Retrait au laboratoire sur présentation de la carte étudiant.",
  },
  {
    color: 'bg-emerald-500 text-white',
    tag: 'Maintenance',
    title: 'Signalement de pannes',
    text: 'Tout équipement défectueux doit être signalé via le portail. Les techniciens prendront en charge la demande dans les meilleurs délais pour garantir la continuité des TPs.',
  },
];

const tickerItems = [
  { Icon: CheckCircleIcon, label: 'Disponibilité en direct' },
  { Icon: CheckCircleIcon, label: "Demandes d'emprunt en ligne" },
  { Icon: CheckCircleIcon, label: 'Suivi des interventions techniques' },
];

const tickerLoop = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

const navItems = ['Catalogue', 'Emprunts', 'Maintenance'];

export default function Home({ onNavigateToLogin, onNavigateToRegister }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <FontImport />

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <img src={logoUjkz} alt="GM — Gestion-Matériel" className="h-10 w-10 object-contain shrink-0"
              onError={(e) => { e.target.style.display = 'none'; }} />
            <div className="leading-tight">
              <p className="font-display font-bold text-[#1B4F9C] text-[15px] tracking-tight">Gestion-Matériel</p>
              <p className="font-mono-brand text-[10px] text-slate-400 tracking-wide">UFR/SEA · DÉPT. INFORMATIQUE</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7">
            <a href="#fonctionnalites"
              className="font-mono-brand text-xs font-semibold tracking-wide text-slate-500 hover:text-[#1B4F9C] transition-colors uppercase">
              À propos
            </a>
            {navItems.map((item) => (
              <button key={item} onClick={onNavigateToLogin}
                className="font-mono-brand text-xs font-semibold tracking-wide text-slate-500 hover:text-[#1B4F9C] transition-colors uppercase">
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <button onClick={onNavigateToRegister}
              className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 text-[#1B4F9C] hover:border-[#1B4F9C] hover:bg-blue-50/50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              <UserPlusIcon className="h-4 w-4" />
              S'inscrire
            </button>
            <button onClick={onNavigateToLogin}
              className="flex items-center gap-2 bg-[#1B4F9C] hover:bg-[#164080] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200">
              <LogInIcon className="h-4 w-4" />
              Connexion
            </button>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/80 bg-white px-4 py-3 space-y-1">
            <a href="#fonctionnalites" onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#1B4F9C] transition-colors">
              À propos
            </a>
            {navItems.map((item) => (
              <button key={item}
                onClick={() => { setMobileMenuOpen(false); onNavigateToLogin(); }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#1B4F9C] transition-colors">
                {item}
              </button>
            ))}
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigateToRegister(); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1B4F9C] hover:bg-slate-50 transition-colors sm:hidden">
              S'inscrire
            </button>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#1B5692] to-[#173B5F]">
        <CircuitBackdrop />

        <div className="relative mx-auto max-w-7xl px-4 md:px-8 pt-20 pb-6 md:pt-28 md:pb-10">

          <div className="max-w-2xl mx-auto text-center space-y-6 text-slate-800">
            <div className="inline-flex items-center gap-2.5 bg-white/70 border border-blue-200/60 rounded-full pl-2.5 pr-4 py-1.5 font-mono-brand text-[11px] text-[#1B4F9C] tracking-wide shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {slide.badge}
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold leading-[1.1] text-[#E2EAF3] transition-all duration-500">
              {slide.title}
            </h1>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mx-auto transition-all duration-500">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button onClick={onNavigateToLogin}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-bold px-7 py-3 rounded-lg text-sm transition-colors shadow-md shadow-amber-200/60">
                {slide.cta}
              </button>
              <button onClick={onNavigateToRegister}
                className="inline-flex items-center gap-2 bg-white/80 hover:bg-white text-[#1B4F9C] border border-blue-200/80 font-semibold px-6 py-3 rounded-lg text-sm transition-colors shadow-sm">
                <UserPlusIcon className="h-4 w-4" />
                Créer un compte
              </button>
            </div>

            <div className="flex justify-center gap-1.5 pt-3">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-[#1B4F9C]' : 'w-4 bg-[#1B4F9C]/20'}`} />
              ))}
            </div>
          </div>

          <div className="mt-10 relative">
            <div className="overflow-hidden rounded-2xl border bg-white/50 backdrop-blur-sm shadow-sm">
              <div className="animate-marquee flex w-max">
                {tickerLoop.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-6 py-3.5 shrink-0">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-emerald-100">
                      <item.Icon className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <span className="font-display font-semibold text-sm text-slate-700 whitespace-nowrap">
                      {item.label}
                    </span>
                    <span className="ml-4 text-blue-300 select-none">•</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-white/90 backdrop-blur-md border border-blue-200/50 rounded-2xl p-6 text-slate-800 shadow-xl shadow-blue-100/50">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#1B4F9C]/10">
                  <ServerIcon className="h-5 w-5 text-[#1B4F9C]" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#1e3a5f]">Parc matériel Dép. Info.</h3>
              </div>
              <div className="h-px w-10 bg-amber-400 mb-4" />
              <p className="text-sm text-slate-500 leading-relaxed mb-5">
                Un inventaire numérique complet : ordinateurs, réseau, projecteurs et
                accessoires pédagogiques, suivis en temps réel du dépôt à la salle de TP.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: '150+', label: 'Équipements' },
                  { val: '24h', label: 'Délai max' },
                  { val: '99%', label: 'Disponibilité' },
                ].map((s) => (
                  <div key={s.label} className="text-center bg-blue-50/80 rounded-xl py-2.5 px-1">
                    <p className="font-display font-bold text-[#1B4F9C] text-lg leading-none">{s.val}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48V24C240 0 480 40 720 28C960 16 1200 44 1440 20V48H0Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-12">
        <SectionEyebrow>Actualités</SectionEyebrow>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rounded-2xl overflow-hidden shadow-md border border-slate-200/80">
          {actualites.map((actu, i) => (
            <div key={i} className={`${actu.color} p-6 space-y-3`}>
              <span className="font-mono-brand text-[10px] font-semibold uppercase tracking-widest opacity-70">{actu.tag}</span>
              <h3 className="font-display text-lg font-bold leading-tight">{actu.title}</h3>
              <p className="text-sm leading-relaxed opacity-90">{actu.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="fonctionnalites" className="bg-white border-y border-slate-100 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
          <div className="text-center mb-12">
            <div className="flex justify-center"><SectionEyebrow>Fonctionnalités</SectionEyebrow></div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900">Un système pensé pour le département</h2>
            <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
              Conçu pour répondre aux besoins des étudiants, enseignants, techniciens et administrateurs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { Icon: PackageIcon,   code: '01', title: 'Stock en temps réel',      desc: "Consultez instantanément la disponibilité de chaque équipement pédagogique du département." },
              { Icon: ClipboardIcon, code: '02', title: 'Demandes simplifiées',      desc: "Formulez et suivez vos demandes d'emprunt de matériel en quelques clics depuis votre espace." },
              { Icon: WrenchIcon,    code: '03', title: 'Maintenance & Traçabilité', desc: "Signalez les pannes, suivez les interventions et consultez l'historique complet du parc matériel." },
            ].map(({ Icon, code, title, desc }) => (
              <div key={title} className="group relative p-6 rounded-2xl border border-slate-100 bg-slate-50/80 hover:bg-[#1B4F9C] hover:border-[#1B4F9C] transition-all duration-300 cursor-default shadow-sm hover:shadow-lg hover:shadow-blue-100">
                <span className="absolute top-5 right-5 font-mono-brand text-[10px] text-slate-300 group-hover:text-white/25 transition-colors">{code}</span>
                <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-xl bg-[#2B6CB0] group-hover:bg-white text-white group-hover:text-[#1B4F9C] transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-slate-900 group-hover:text-white mb-2 transition-colors">{title}</h3>
                <p className="text-xs text-slate-500 group-hover:text-white/80 leading-relaxed transition-colors">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
        <div className="text-center mb-10">
          <div className="flex justify-center"><SectionEyebrow>Accès par profil</SectionEyebrow></div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-slate-800">Choisissez votre espace</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              label: 'Étudiant / Enseignant',
              desc: "Emprunter du matériel, suivre vos demandes et consulter le catalogue.",
              border: 'border-emerald-300', bg: 'bg-emerald-50', hoverBg: 'hover:bg-emerald-600',
              text: 'text-emerald-700', hoverText: 'group-hover:text-white',
              iconBg: 'bg-emerald-100', iconHoverBg: 'group-hover:bg-white',
              iconColor: 'text-emerald-600', iconHoverColor: 'group-hover:text-emerald-600',
              Icon: PackageIcon,
            },
            {
              label: 'Technicien',
              desc: 'Gérer les interventions, rédiger des rapports et suivre les pannes.',
              border: 'border-amber-300', bg: 'bg-amber-50', hoverBg: 'hover:bg-amber-600',
              text: 'text-amber-700', hoverText: 'group-hover:text-white',
              iconBg: 'bg-amber-100', iconHoverBg: 'group-hover:bg-white',
              iconColor: 'text-amber-600', iconHoverColor: 'group-hover:text-amber-600',
              Icon: WrenchIcon,
            },
            {
              label: 'Administrateur',
              desc: "Superviser l'ensemble du parc, gérer les utilisateurs et les stocks.",
              border: 'border-blue-300', bg: 'bg-blue-50', hoverBg: 'hover:bg-[#1B4F9C]',
              text: 'text-blue-700', hoverText: 'group-hover:text-white',
              iconBg: 'bg-blue-100', iconHoverBg: 'group-hover:bg-white',
              iconColor: 'text-blue-600', iconHoverColor: 'group-hover:text-[#1B4F9C]',
              Icon: ServerIcon,
            },
          ].map(({ label, desc, border, bg, hoverBg, text, hoverText, iconBg, iconHoverBg, iconColor, iconHoverColor, Icon }) => (
            <button key={label} onClick={onNavigateToLogin}
              className={`group p-6 rounded-2xl border-2 ${border} ${bg} ${hoverBg} transition-all duration-300 text-left space-y-3 shadow-sm hover:shadow-lg`}>
              <div className={`h-10 w-10 flex items-center justify-center rounded-xl ${iconBg} ${iconHoverBg} transition-colors`}>
                <Icon className={`h-5 w-5 ${iconColor} ${iconHoverColor} transition-colors`} />
              </div>
              <h3 className={`font-display font-bold text-sm ${text} ${hoverText} transition-colors`}>{label}</h3>
              <p className={`text-xs ${text} ${hoverText} opacity-80 leading-relaxed transition-colors`}>{desc}</p>
            </button>
          ))}
        </div>
      </section>

      <footer className="bg-[#0847B5] text-white">
        <div className="border-b border-white/15 bg-[#173B5F]">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-5 flex flex-wrap justify-center md:justify-between items-center gap-6">
            <span className="font-mono-brand text-[10px] font-semibold uppercase tracking-widest text-white/50">Sous tutelle de :</span>
            <div className="flex items-center gap-3">
              <img src={logoMesri} alt="MESRI" className="h-10 w-10 object-contain opacity-90 rounded"
                onError={(e) => { e.target.style.display = 'none'; }} />
              <div>
                <p className="text-[10px] font-semibold text-white/90 leading-tight">Ministère de l'Enseignement Supérieur</p>
                <p className="text-[10px] text-white/60 leading-tight">de la Recherche et de l'Innovation</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/15 hidden md:block" />
            <div className="flex items-center gap-3">
              <img src={logoUO} alt="UJKZ" className="h-10 w-10 object-contain opacity-90 rounded"
                onError={(e) => { e.target.style.display = 'none'; }} />
              <div>
                <p className="text-[10px] font-semibold text-white/90 leading-tight">Université Joseph KI-ZERBO</p>
                <p className="text-[10px] text-white/60 leading-tight">Ouagadougou, Burkina Faso</p>
              </div>
            </div>
            <div className="h-8 w-px bg-white/15 hidden md:block" />
            <div className="flex items-center gap-3">
              <img src={logoUfrSea} alt="UFR/SEA" className="h-10 w-10 object-contain opacity-90 rounded"
                onError={(e) => { e.target.style.display = 'none'; }} />
              <div>
                <p className="text-[10px] font-semibold text-white/90 leading-tight">UFR/SEA. Dépt. Informatique</p>
                <p className="text-[10px] text-white/60 leading-tight">Sciences Exactes et Appliquées</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img src={logoLAMI} alt="LAMI" className="h-10 w-10 object-contain opacity-90 rounded"
                onError={(e) => { e.target.style.display = 'none'; }} />
              <div>
                <p className="text-[10px] font-semibold text-white/90 leading-tight">LAMI</p>
                <p className="text-[10px] text-white/60 leading-tight">LAboratoire de Mathématiques et Informatique</p>
              </div>
            </div>
            <p className="font-mono-brand text-[13px] text-white/70 text-center">
              © 2026 · GM — Gestion-Matériel · Département Informatique · UFR/SEA · UJKZ
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}