import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, ShieldCheck, Wrench, ArrowRight, 
  MessageSquare, Building2, Zap, Droplet, Cog, Cpu, Compass, Layers, DollarSign, Calendar, FileText 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function FindJobsPage() {
  const { lang } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categories aligned with service requests
  const categories = [
    { id: 'All', labelEn: 'All Categories', labelFr: 'Toutes les Catégories', icon: Layers },
    { id: 'Construction', labelEn: 'Construction & Renovation', labelFr: 'Construction & Rénovation', icon: Building2 },
    { id: 'Electrical', labelEn: 'Electrical & Wiring', labelFr: 'Électricité & Câblage', icon: Zap },
    { id: 'Plumbing', labelEn: 'Plumbing & Sanitation', labelFr: 'Plomberie & Assainissement', icon: Droplet },
    { id: 'Mechanical', labelEn: 'Mechanical & HVAC', labelFr: 'Mécanique & Climatisation', icon: Cog },
    { id: 'ICT & Telecom', labelEn: 'ICT & Networks', labelFr: 'TIC & Réseaux', icon: Cpu },
    { id: 'Architecture', labelEn: 'Architecture & Planning', labelFr: 'Architecture & Planification', icon: Compass },
    { id: 'Engineering', labelEn: 'Civil Engineering', labelFr: 'Génie Civil', icon: Wrench }
  ];

  // Fetch client job postings from MongoDB backend API
  useEffect(() => {
    fetch('http://localhost:5000/api/client-requests')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          setJobs([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch client jobs:', err);
        setJobs([]);
        setLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = (job.projectTitle && job.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApplyJob = (jobTitle) => {
    alert(
      lang === 'fr'
        ? `Candidature envoyée avec succès pour le poste : "${jobTitle}". Le client vérifié examinera votre profil et vous contactera.`
        : `Application successfully submitted for "${jobTitle}". The client will review your professional credentials and reach out.`
    );
  };

  return (
    <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-20">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 bg-[#111622] border border-slate-800 text-emerald-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 shadow-inner">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> 
            {lang === 'fr' ? 'Tableau des Offres et Projets Clients' : 'Verified Client Job Marketplace'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {lang === 'fr' ? 'Trouvez des Missions et Postulez' : 'Browse Open Jobs & Contracts'}
          </h1>
          <p className="text-slate-300 text-sm mt-2">
            {lang === 'fr' 
              ? 'Parcourez les offres de projets publiées par des clients vérifiés et proposez vos services.' 
              : 'Explore open service requests posted by clients across Cameroon and submit your proposal.'}
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
                placeholder={lang === 'fr' ? 'Rechercher par titre de mission, description...' : 'Search by job title, description, or location...'} 
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

        {/* Jobs Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-3"></div>
            {lang === 'fr' ? 'Chargement des offres d’emploi...' : 'Loading open job requests...'}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => {
              const jobId = job._id || job.id;
              const title = job.projectTitle || job.title;

              return (
                <div key={jobId} className="bg-[#111622]/60 border border-slate-800 rounded-3xl p-6 shadow-2xl hover:border-emerald-500/50 transition flex flex-col justify-between backdrop-blur-md">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            {job.category || 'General Project'}
                          </span>
                          <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3" /> {lang === 'fr' ? 'Client Vérifié' : 'Verified Client'}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-white">{title}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-400 flex items-center gap-1 bg-[#0A0D14] px-3 py-1.5 rounded-2xl border border-slate-800">
                          <DollarSign className="h-3.5 w-3.5 text-slate-400" /> {job.budget || 'Negotiated'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
                      {job.description || 'No detailed project description provided.'}
                    </p>

                    <div className="space-y-2 text-xs text-slate-400 pb-4 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        <span>{job.location || 'Buea, Cameroon'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>{job.timeline || job.createdAt || 'Flexible Timeline'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="mt-4 pt-4 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {lang === 'fr' ? 'Publié par :' : 'Posted by:'} <strong className="text-white">{job.professionalName || job.clientName || 'Client'}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/chat?proName=${encodeURIComponent(job.professionalName || job.clientName || 'Client')}`}
                        className="bg-[#0A0D14] hover:bg-slate-800 text-emerald-300 border border-slate-700 p-2.5 rounded-2xl transition shadow"
                        title={lang === 'fr' ? 'Contacter le client' : 'Message Client'}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => handleApplyJob(title)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-2xl text-xs transition shadow-lg flex items-center gap-1.5"
                      >
                        {lang === 'fr' ? 'Postuler' : 'Apply Now'} <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#111622]/40 border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto">
            <FileText className="h-12 w-12 text-emerald-400 mx-auto mb-3 opacity-80" />
            <h3 className="text-lg font-bold text-white">
              {lang === 'fr' ? 'Aucune offre d’emploi disponible pour le moment' : 'No Open Job Postings Yet'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              {lang === 'fr'
                ? 'Aucun client n’a encore publié de demande de projet. Soyez le premier à poster une offre !'
                : 'There are currently no open service requests in the database. When clients post jobs, they will appear right here.'}
            </p>
            <Link 
              to="/post-request" 
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs transition shadow inline-block"
            >
              {lang === 'fr' ? 'Publier une Offre (Client)' : 'Post a Job Request'}
            </Link>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}