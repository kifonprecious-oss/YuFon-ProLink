import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, LogIn } from 'lucide-react';
import engineerImg from '../assets/engineer.png';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function LandingPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between relative overflow-hidden min-h-screen">
      
      {/* Background Engineer Watermark / Shadow Layer (Clearer and more visible yet semi-transparent) */}
      <div className="absolute right-0 bottom-0 top-0 w-full lg:w-3/5 flex items-end justify-end pointer-events-none z-0 overflow-hidden">
        <div className="relative w-full h-full flex items-end justify-end opacity-40 lg:opacity-55 transform translate-x-8 translate-y-8 lg:translate-x-0 lg:translate-y-0">
          <img 
            src={engineerImg} 
            alt="Watermark Engineer" 
            className="w-auto h-full max-h-[700px] object-contain filter contrast-110 drop-shadow-2xl" 
          />
        </div>
      </div>

      {/* Subtle overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0D14] via-[#0A0D14]/90 to-transparent pointer-events-none z-10"></div>

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12 lg:py-20 relative z-20">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-[#111622] border border-slate-800 text-emerald-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4 shadow-inner">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> {t.heroTag}
          </span>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white">
            {lang === 'fr' ? (
              <>Connectez des Clients avec des <span className="text-emerald-400">Techniciens Vérifiés</span> & Ingénieurs</>
            ) : (
              <>Connecting Clients with <span className="text-emerald-400">Verified Technicians</span> & Engineers</>
            )}
          </h1>
          
          <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-300 font-light leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/login" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-xl transition flex items-center justify-center gap-2 text-sm sm:text-base">
              <LogIn className="h-4 w-4" /> {lang === 'fr' ? 'Se connecter' : 'Sign In'} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/register" className="bg-[#111622] hover:bg-slate-800 text-white border border-slate-700/80 font-bold px-6 py-3.5 rounded-2xl transition backdrop-blur-sm text-sm sm:text-base text-center shadow-md flex items-center justify-center gap-2">
              {lang === 'fr' ? "S'inscrire" : 'Sign Up'}
            </Link>
          </div>
        </div>
      </div>

      <Footer />

    </div>
  );
}