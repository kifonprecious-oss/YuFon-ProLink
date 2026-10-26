import React from 'react';
import { Users, HardHat } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-gradient-to-r from-[#0A0D14] via-[#111622] to-[#0A0D14] border-t border-slate-800/80 text-white py-3 px-4 z-30 shadow-2xl flex-shrink-0 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-800/60">
        
        <div className="flex items-center space-x-3 pb-3 sm:pb-0 sm:pr-2">
          <div className="w-10 h-7 rounded overflow-hidden shadow border border-slate-700 flex-shrink-0">
            <div className="w-full h-full flex">
              <div className="w-1/3 bg-green-600"></div>
              <div className="w-1/3 bg-red-600 relative flex items-center justify-center">
                <span className="text-[9px] text-yellow-300">★</span>
              </div>
              <div className="w-1/3 bg-yellow-400"></div>
            </div>
          </div>
          <div>
            <span className="block text-xs font-bold italic tracking-wide text-white">
              {lang === 'fr' ? 'Cameroun' : 'Cameroon'}
            </span>
            <span className="block text-xs font-extrabold italic text-emerald-400">
              {t.footerConnectBuild}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-3 sm:pt-0 sm:px-2">
          <div className="p-2 bg-[#111622] rounded-xl border border-slate-700/60 flex-shrink-0">
            <Users className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">{t.forClients}</h4>
            <p className="text-[10px] text-slate-300 leading-tight mt-0.5">{t.forClientsDesc}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-3 lg:pt-0 lg:px-2">
          <div className="p-2 bg-[#111622] rounded-xl border border-slate-700/60 flex-shrink-0">
            <HardHat className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">{t.forProfessionals}</h4>
            <p className="text-[10px] text-slate-300 leading-tight mt-0.5">{t.forProfessionalsDesc}</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-end space-x-3 pt-3 lg:pt-0 lg:pl-4">
          <div className="text-right">
            <div className="text-base font-black tracking-tight flex items-center justify-end">
              <span className="text-white">YuFon-</span>
              <span className="text-emerald-400">ProLink</span>
              <span className="text-[9px] text-slate-400 align-super ml-0.5">™</span>
            </div>
            <div className="text-xs font-bold italic text-emerald-400 tracking-wide">
              {t.footerTagline}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}