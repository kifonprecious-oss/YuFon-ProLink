import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { User, Mail, Briefcase, MapPin, Phone, Award, Edit3, Star, ShieldCheck, CheckCircle2, FileText, Calendar, DollarSign, Send, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function ProfilePage() {
  const { lang } = useLanguage();
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    role: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    profilePicture: ''
  });

  const [completedJobs, setCompletedJobs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    clientRequestsCount: 0,
    proposalsCount: 0,
    contractsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('currentUser')) || {};
      const currentUserId = storedUser?._id || storedUser?.id || '';

      setProfileData({
        fullName: storedUser.name || 'YuFon-ProLink User',
        email: storedUser.email || '',
        role: storedUser.role ? (storedUser.role.charAt(0).toUpperCase() + storedUser.role.slice(1)) : 'Professional & Client',
        phone: storedUser.phone || 'Not provided',
        location: storedUser.location || 'Buea, Cameroon',
        bio: storedUser.bio || '',
        skills: storedUser.services || storedUser.skills || '',
        profilePicture: storedUser.profilePicture || ''
      });

      // Qualifications are strictly loaded from user profile storage (defaulting to empty array)
      const userQualifications = JSON.parse(localStorage.getItem('userQualifications')) || [];
      setQualifications(userQualifications);

      // Fetch dynamic dashboard metrics, contracts, and reviews concurrently
      Promise.all([
        fetch('http://localhost:5000/api/contracts').then(res => res.json()).catch(() => []),
        currentUserId ? fetch(`http://localhost:5000/api/reviews/${currentUserId}`).then(res => res.json()).catch(() => []) : Promise.resolve([]),
        fetch('http://localhost:5000/api/client-requests').then(res => res.json()).catch(() => []),
        fetch('http://localhost:5000/api/proposals').then(res => res.json()).catch(() => [])
      ]).then(([contractsData, reviewsData, requestsData, proposalsData]) => {
        const realCompleted = Array.isArray(contractsData)
          ? contractsData.filter(c => (c.professionalId === currentUserId || c.clientId === currentUserId) && (c.status?.toLowerCase() === 'completed'))
          : [];
        setCompletedJobs(realCompleted);

        setReviews(Array.isArray(reviewsData) ? reviewsData : []);

        setDashboardStats({
          clientRequestsCount: Array.isArray(requestsData) ? requestsData.length : 0,
          proposalsCount: Array.isArray(proposalsData) ? proposalsData.length : 0,
          contractsCount: Array.isArray(contractsData) ? contractsData.filter(c => c.status?.toLowerCase() === 'active').length : 0
        });

        setLoading(false);
      });
    } catch (err) {
      console.error("Error reading profile data:", err);
      setLoading(false);
    }
  }, []);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + (Number(rev.rating) || 0), 0) / reviews.length).toFixed(1)
    : 0.0;

  // Resolve proper static URL for uploaded profile pictures
  const avatarImageSrc = profileData.profilePicture
    ? (profileData.profilePicture.startsWith('http') ? profileData.profilePicture : `http://localhost:5000${profileData.profilePicture}`)
    : null;

  return (
    <div className="flex flex-col min-h-screen justify-between bg-[#0A0D14] text-slate-100 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-20 space-y-8">
        
        {/* Header Banner & User Identity */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-[#111622] to-slate-900/80 border border-emerald-700/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-5">
            <div className="relative">
              {avatarImageSrc ? (
                <img 
                  src={avatarImageSrc} 
                  alt="Profile" 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-emerald-300/40 shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 font-black flex items-center justify-center text-3xl sm:text-4xl shadow-xl uppercase border-2 border-emerald-300/40">
                  {(profileData.fullName || 'U').charAt(0)}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-[#111622]" title="Verified User">
                <ShieldCheck className="h-4 w-4" />
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {profileData.fullName}
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {lang === 'fr' ? 'Vérifié' : 'Verified'}
                </span>
              </div>
              <p className="text-teal-400 text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" /> {profileData.role}
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs text-slate-300">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" /> {averageRating} ({reviews.length} {lang === 'fr' ? 'avis' : 'reviews'})
                </span>
                <span className="text-slate-500">•</span>
                <span>{completedJobs.length} {lang === 'fr' ? 'Missions Réussies' : 'Completed Gigs'}</span>
              </div>
            </div>
          </div>
          
          <Link 
            to="/profile-setup" 
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-2xl text-xs transition shadow-lg flex items-center gap-2"
          >
            <Edit3 className="h-4 w-4" /> {lang === 'fr' ? 'Modifier le Profil' : 'Edit Profile'}
          </Link>
        </div>

        {/* Integrated Dashboard Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#111622]/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">{lang === 'fr' ? 'Demandes Client' : 'Client Requests'}</p>
              <h4 className="text-2xl font-black text-white mt-1">{dashboardStats.clientRequestsCount}</h4>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-[#111622]/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">{lang === 'fr' ? 'Devis / Propositions' : 'Proposals Sent'}</p>
              <h4 className="text-2xl font-black text-white mt-1">{dashboardStats.proposalsCount}</h4>
            </div>
            <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400">
              <Send className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-[#111622]/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">{lang === 'fr' ? 'Contrats Actifs' : 'Active Contracts'}</p>
              <h4 className="text-2xl font-black text-white mt-1">{dashboardStats.contractsCount}</h4>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Layers className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-[#111622]/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">{lang === 'fr' ? 'Score de Réputation' : 'Reputation Score'}</p>
              <h4 className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-1">
                {averageRating} <Star className="h-4 w-4 fill-amber-400" />
              </h4>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Star className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Details Grid: Contact & Expertise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Contact & Personal Information */}
          <div className="bg-[#111622]/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <User className="h-4 w-4" /> {lang === 'fr' ? 'Informations Personnelles' : 'Personal Information'}
            </h3>
            
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-3 bg-[#0A0D14] p-3 rounded-2xl border border-slate-800">
                <Mail className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] text-slate-400 block">Email</span>
                  <span className="font-medium text-white truncate block">{profileData.email || 'Not provided'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#0A0D14] p-3 rounded-2xl border border-slate-800">
                <Phone className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">{lang === 'fr' ? 'Téléphone' : 'Phone'}</span>
                  <span className="font-medium text-white">{profileData.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#0A0D14] p-3 rounded-2xl border border-slate-800">
                <MapPin className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">{lang === 'fr' ? 'Localisation' : 'Location'}</span>
                  <span className="font-medium text-white">{profileData.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Expertise & Bio (Span 2 Cols) */}
          <div className="md:col-span-2 bg-[#111622]/80 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Award className="h-4 w-4" /> {lang === 'fr' ? 'Biographie & Compétences' : 'Bio & Expertise'}
              </h3>

              <div className="bg-[#0A0D14] p-4 rounded-2xl border border-slate-800 mb-4">
                <span className="text-[10px] text-slate-400 block mb-1">Bio</span>
                <p className="text-white text-xs sm:text-sm italic leading-relaxed">
                  {profileData.bio || (lang === 'fr' ? 'Aucune biographie saisie pour le moment.' : 'No biography provided yet. Edit your profile to add details.')}
                </p>
              </div>

              <div className="bg-[#0A0D14] p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-2">{lang === 'fr' ? 'Compétences / Domaines' : 'Skills & Stack'}</span>
                <div className="flex flex-wrap gap-1.5">
                  {profileData.skills ? (
                    typeof profileData.skills === 'string' ? (
                      profileData.skills.split(',').map((skill, idx) => (
                        <span key={idx} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-xl text-xs font-bold">
                          {skill.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-white">{profileData.skills}</span>
                    )
                  ) : (
                    <span className="text-slate-400 italic text-xs">{lang === 'fr' ? 'Aucune compétence enregistrée' : 'No skills listed yet'}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Tabbed Section: Completed Gigs, Reviews & Qualifications */}
        <div className="bg-[#111622]/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex border-b border-slate-800 gap-6 overflow-x-auto pb-1">
            <span className="pb-3 text-sm font-bold text-emerald-400 border-b-2 border-emerald-400 flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> {lang === 'fr' ? 'Missions Réussies' : 'Completed Gigs'} ({completedJobs.length})
            </span>
            <span className="pb-3 text-sm font-bold text-slate-400 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400" /> {lang === 'fr' ? 'Avis Clients' : 'Client Reviews'} ({reviews.length})
            </span>
            <span className="pb-3 text-sm font-bold text-slate-400 flex items-center gap-2">
              <Award className="h-4 w-4" /> {lang === 'fr' ? 'Qualifications' : 'Qualifications'} ({qualifications.length})
            </span>
          </div>

          {/* Completed Jobs Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'fr' ? 'Missions réellement exécutées via la plateforme' : 'Verified Transactions & Completed Gigs'}
            </h3>
            {completedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedJobs.map((job, idx) => (
                  <div key={job._id || idx} className="bg-[#0A0D14] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
                          {job.category || 'App Contract'}
                        </span>
                        <span className="text-teal-400 text-[11px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{job.title || job.projectTitle}</h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#0A0D14] border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                <FileText className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs">{lang === 'fr' ? 'Aucune mission terminée pour le moment.' : 'No completed app transactions or gigs recorded yet.'}</p>
              </div>
            )}
          </div>

          {/* Qualifications Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'fr' ? 'Diplômes, Certifications et Qualifications saisis' : 'User-Inputted Qualifications & Certifications'}
            </h3>
            {qualifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {qualifications.map((qual, idx) => (
                  <div key={qual.id || idx} className="bg-[#0A0D14] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                          <Award className="h-5 w-5" />
                        </div>
                        <span className="bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {qual.year}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{qual.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{qual.institution}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#0A0D14] border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                <Award className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs">{lang === 'fr' ? 'Aucune qualification saisie.' : 'No qualifications or certifications added yet.'}</p>
              </div>
            )}
          </div>

        </div>

      </div>
      <Footer />
    </div>
  );
}