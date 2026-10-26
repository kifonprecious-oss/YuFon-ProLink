import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Star, ShieldCheck, Wrench, ArrowRight, 
  MessageSquare, Building2, Zap, Droplet, Cog, Cpu, Compass, Layers, DollarSign, CheckCircle2, User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function ServicesPage() {
  const { lang } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popular Service Categories
  const categories = [
    { id: 'All', labelEn: 'All Categories', labelFr: 'Toutes les Catégories', icon: Layers },
    { id: 'Construction & Renovation', labelEn: 'Construction & Renovation', labelFr: 'Construction & Rénovation', icon: Building2 },
    { id: 'Electrical & Wiring', labelEn: 'Electrical & Wiring', labelFr: 'Électricité & Câblage', icon: Zap },
    { id: 'Plumbing & Sanitation', labelEn: 'Plumbing & Sanitation', labelFr: 'Plomberie & Assainissement', icon: Droplet },
    { id: 'Mechanical & HVAC', labelEn: 'Mechanical & HVAC', labelFr: 'Mécanique & Climatisation', icon: Cog },
    { id: 'ICT & Networks', labelEn: 'ICT & Networks', labelFr: 'TIC & Réseaux', icon: Cpu },
    { id: 'Architecture & Planning', labelEn: 'Architecture & Planning', labelFr: 'Architecture & Planification', icon: Compass },
    { id: 'Technical & Engineering Services', labelEn: 'Civil & Engineering', labelFr: 'Génie Civil', icon: Wrench }
  ];

  // Fetch verified professionals from MongoDB backend API (`/api/professionals`)
  useEffect(() => {
    fetch('http://localhost:5000/api/professionals')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProfessionals(data);
        } else {
          setProfessionals([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch professionals:', err);
        setProfessionals([]);
        setLoading(false);
      });
  }, []);

  const filteredProfessionals = professionals.filter(pro => {
    const matchesSearch = (pro.name && pro.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (pro.category && pro.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (pro.location && pro.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || pro.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-20">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 bg-[#111622] border border-slate-800 text-emerald-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 shadow-inner">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> 
            {lang === 'fr' ? 'Annuaire des Professionnels Vérifiés' : 'Verified Professional Experts Directory'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {lang === 'fr' ? 'Trouvez des Experts Qualifiés' : 'Find Verified Professionals'}
          </h1>
          <p className="text-slate-300 text-sm mt-2">
            {lang === 'fr' 
              ? 'Parcourez les profils approuvés par l’administrateur et engagez des experts qualifiés pour vos projets.' 
              : 'Browse admin-approved professional contractors and specialists ready for your next project.'}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#111622]/80 border border-slate-800 p-4 rounded-3xl shadow-2xl backdrop-blur-md mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'fr' ? 'Rechercher par nom, compétence ou ville...' : 'Search by professional name, skill, or location...'} 
                className="w-full bg-[#0A0D14] border border-slate-700/80 rounded-2xl px-4 py-3 pl-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
                    isSelected 
                      ? 'bg-emerald-500 text-slate-950 shadow-lg' 
                      : 'bg-[#0A0D14] text-slate-300 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <IconComponent className={`h-4 w-4 ${isSelected ? 'text-slate-950' : 'text-emerald-400'}`} />
                  {lang === 'fr' ? cat.labelFr : cat.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Professionals Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-3"></div>
            {lang === 'fr' ? 'Chargement des professionnels vérifiés...' : 'Loading verified professionals...'}
          </div>
        ) : filteredProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((pro) => {
              const proId = pro._id || pro.id;
              const avatarSrc = pro.profilePicture
                ? (pro.profilePicture.startsWith('http') ? pro.profilePicture : `http://localhost:5000${pro.profilePicture}`)
                : null;

              return (
                <div key={proId} className="bg-[#111622]/60 border border-slate-800 rounded-3xl p-6 shadow-2xl hover:border-emerald-500/50 transition flex flex-col justify-between backdrop-blur-md">
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      {avatarSrc ? (
                        <img src={avatarSrc} alt={pro.name} className="w-16 h-16 rounded-2xl object-cover border border-emerald-500/40 shadow" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 font-black flex items-center justify-center text-xl shadow uppercase">
                          {(pro.name || 'P').charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-black text-white">{pro.name}</h3>
                          <span className="bg-emerald-500/20 text-emerald-300 p-0.5 rounded-full" title="Verified Professional">
                            <ShieldCheck className="h-3.5 w-3.5" />
                          </span>
                        </div>
                        <p className="text-teal-400 text-xs font-semibold mt-0.5">{pro.category || 'Specialist'}</p>
                        <p className="text-slate-400 text-[11px] flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-slate-500" /> {pro.location || 'Buea, Cameroon'}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
                      {pro.bio || (lang === 'fr' ? 'Aucune biographie disponible.' : 'Experienced professional ready for hire.')}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {pro.services && pro.services.length > 0 ? (
                        pro.services.slice(0, 3).map((s, idx) => (
                          <span key={idx} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Verified Expert</span>
                      )}
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Rate</span>
                      <span className="text-xs font-black text-emerald-400">{pro.rate || '15,000 XAF / hr'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/chat?proName=${encodeURIComponent(pro.name)}`}
                        className="bg-[#0A0D14] hover:bg-slate-800 text-emerald-300 border border-slate-700 p-2.5 rounded-2xl transition shadow"
                        title={lang === 'fr' ? 'Envoyer un message' : 'Message Professional'}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                      <Link 
                        to={`/profile/${proId}`}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl text-xs transition shadow-lg flex items-center gap-1.5"
                      >
                        {lang === 'fr' ? 'Voir Profil' : 'View Profile'} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#111622]/40 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto">
            <User className="h-12 w-12 text-emerald-400 mx-auto mb-3 opacity-80" />
            <h3 className="text-lg font-bold text-white">
              {lang === 'fr' ? 'Aucun professionnel approuvé pour le moment' : 'No Approved Professionals Found'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              {lang === 'fr'
                ? 'Aucun professionnel n’a encore été vérifié et approuvé par l’administrateur.'
                : 'There are currently no verified professionals in this category. Register as a professional and get approved via the Admin panel.'}
            </p>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}