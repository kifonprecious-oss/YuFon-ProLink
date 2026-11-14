import React, { useState, useEffect } from 'react';
import { ShieldCheck, MapPin, Briefcase, Award, ExternalLink, MessageSquare, FileText, User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';

export default function ProfileDetailPage() {
  const { lang } = useLanguage();
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = id ? `${API_BASE_URL}/api/users/${id}` : `${API_BASE_URL}/api/profile`;
        const res = await fetch(endpoint);
        const data = await res.json();
        if (res.ok && data) {
          setProfessional(data);
        } else {
          const localUser = JSON.parse(localStorage.getItem('currentUser'));
          if (localUser && (!id || localUser._id === id || localUser.id === id)) {
            setProfessional(localUser);
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile details:', err);
        const localUser = JSON.parse(localStorage.getItem('currentUser'));
        if (localUser) setProfessional(localUser);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center text-slate-400 text-xs">
          {lang === 'fr' ? 'Chargement du profil...' : 'Loading profile...'}
        </div>
        <Footer />
      </div>
    );
  }

  const prof = professional || {};

  return (
    <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 z-20">
        
        {/* Profile Header Card */}
        <div className="bg-[#111622]/80 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 backdrop-blur-md">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 font-black text-2xl shadow-lg">
              {prof.name ? prof.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : <User className="h-8 w-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-white">{prof.name || 'User Profile'}</h1>
                {prof.isApproved && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" /> {lang === 'fr' ? 'Vérifié' : 'Verified'}
                  </span>
                )}
              </div>
              <p className="text-emerald-400 text-xs font-semibold mb-2">{prof.category || prof.title || 'Professional'}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                {prof.location && (
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-500" /> {prof.location}</span>
                )}
                <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5 text-slate-500" /> {prof.completedProjects || 0} {lang === 'fr' ? 'projets terminés' : 'projects completed'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link 
              to="/chat" 
              className="bg-[#0A0D14] hover:bg-slate-800 text-emerald-300 border border-slate-700 font-bold px-5 py-3 rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-md"
            >
              <MessageSquare className="h-4 w-4 text-emerald-400" /> {lang === 'fr' ? 'Envoyer un Message' : 'Send Message'}
            </Link>
            <Link 
              to="/contract" 
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs transition flex items-center justify-center gap-2 shadow-lg"
            >
              <FileText className="h-4 w-4" /> {lang === 'fr' ? 'Engager / Contrat' : 'Hire / Contract'}
            </Link>
          </div>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Bio & Portfolio */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-[#111622]/60 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
              <h2 className="text-base font-black text-white mb-3">{lang === 'fr' ? 'À propos de moi' : 'About Me'}</h2>
              <p className="text-slate-300 text-xs leading-relaxed">
                {prof.bio || (lang === 'fr' ? 'Aucune description fournie pour le moment.' : 'No biography provided yet.')}
              </p>
            </div>

            {/* Portfolio Showcase */}
            <div className="bg-[#111622]/60 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
              <h2 className="text-base font-black text-white mb-4">{lang === 'fr' ? 'Projets Récents & Portfolio' : 'Portfolio Showcase'}</h2>
              {prof.portfolioItems && prof.portfolioItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prof.portfolioItems.map((item, idx) => (
                    <div key={idx} className="bg-[#0A0D14] border border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-emerald-500/50 transition">
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{item.category}</span>
                        <h3 className="text-white font-bold text-sm mt-1 mb-2">{item.title}</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 text-xs text-center py-6">
                  {lang === 'fr' ? 'Aucun élément de portfolio ajouté pour le moment.' : 'No portfolio items added yet.'}
                </div>
              )}
            </div>

            {/* Certifications (Only rendered if present) */}
            {prof.certifications && prof.certifications.length > 0 && (
              <div className="bg-[#111622]/60 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                <h2 className="text-base font-black text-white mb-4">{lang === 'fr' ? 'Certifications & Diplômes' : 'Certifications & Credentials'}</h2>
                <div className="space-y-3">
                  {prof.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-[#0A0D14] p-4 rounded-2xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <Award className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-xs">{cert.name}</h3>
                          <p className="text-slate-400 text-[10px]">{cert.issuer}</p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-300 font-semibold bg-[#111622] px-3 py-1 rounded-xl border border-slate-700">{cert.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Skills & Info */}
          <div className="space-y-6">
            <div className="bg-[#111622]/60 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-md">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">{lang === 'fr' ? 'Compétences & Technologies' : 'Skills & Stack'}</h3>
                {prof.skills && prof.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {prof.skills.map((skill, idx) => (
                      <span key={idx} className="bg-[#0A0D14] text-emerald-300 border border-slate-800 text-[11px] font-medium px-3 py-1.5 rounded-xl">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs">{prof.category || (lang === 'fr' ? 'Développement général' : 'General Software Development')}</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{lang === 'fr' ? 'Membre depuis' : 'Member Since'}</span>
                  <span className="text-slate-400 font-medium">
                    {prof.createdAt ? new Date(prof.createdAt).toLocaleDateString() : (lang === 'fr' ? 'Récemment' : 'Recently')}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
      <Footer />
    </div>
  );
}