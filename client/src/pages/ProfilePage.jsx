import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
// Removed unused imports: Mail, Phone, Award, Edit3, ShieldCheck, FileText, Calendar, DollarSign, Layers, Send
import { User, Briefcase, MapPin, Star, CheckCircle2, Award, FileText } from 'lucide-react';
// Added useParams for dynamic routing
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';

export default function ProfilePage() {
  const { lang } = useLanguage();
  // Extract the user ID from the URL parameters
  const { id } = useParams(); 
  
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

  // Effect runs whenever the URL parameter 'id' changes
  useEffect(() => {
    setLoading(true);
    // Determine which user ID to fetch. If an ID is in the URL, use it.
    // Otherwise, fall back to the logged-in user (though this page seems designed for viewing others).
    const storedUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const targetUserId = id || storedUser._id || storedUser.id;

    if (!targetUserId) {
      console.error("No user ID available to fetch.");
      setLoading(false);
      return;
    }

    // --- Data Fetching ---
    // Fetch User Profile Data (Generic endpoint to get user details by ID)
    const fetchUserProfile = fetch(`${API_BASE_URL}/api/users/${targetUserId}`)
      .then(res => res.ok ? res.json() : Promise.reject('User not found'))
      .catch(err => {
        console.error("Error fetching user profile:", err);
        return null;
      });

    // Fetch dynamic metrics, contracts, and reviews concurrently
    const fetchDashboardData = Promise.all([
      // Assuming these endpoints filter by userId on the server side
      fetch(`${API_BASE_URL}/api/contracts?userId=${targetUserId}`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/api/reviews/${targetUserId}`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/api/client-requests?userId=${targetUserId}`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/api/proposals?userId=${targetUserId}`).then(res => res.json()).catch(() => [])
    ]).catch(() => [[],[],[],[]]); // Fallback to empty arrays on failure

    Promise.all([fetchUserProfile, fetchDashboardData]).then(([userData, [contractsData, reviewsData, requestsData, proposalsData]]) => {
      
      // 1. Set Profile Data (Prioritize fetched user data over localStorage)
      if (userData) {
        setProfileData({
          fullName: userData.name || 'YuFon-ProLink User',
          email: userData.email || '',
          role: userData.role ? (userData.role.charAt(0).toUpperCase() + userData.role.slice(1)) : 'Professional',
          phone: userData.phone || 'Not provided',
          location: userData.location || 'Buea, Cameroon',
          bio: userData.bio || '',
          skills: userData.services || userData.skills || '',
          profilePicture: userData.profilePicture || ''
        });
        // Assuming qualifications are returned as part of the user object or fetched separately
        setQualifications(userData.qualifications || []); 
      }

      // 2. Set Dashboard/Metrics Data
      const realCompleted = Array.isArray(contractsData)
        ? contractsData.filter(c => c.status?.toLowerCase() === 'completed')
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

  // IMPORTANT: Dependency array ensures data re-fetches when navigating between profiles
  }, [id]);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + (Number(rev.rating) || 0), 0) / reviews.length).toFixed(1)
    : 0.0;

  // Resolve proper static URL for uploaded profile pictures using API_BASE_URL
  const avatarImageSrc = profileData.profilePicture
    ? (profileData.profilePicture.startsWith('http') ? profileData.profilePicture : `${API_BASE_URL}${profileData.profilePicture}`)
    : null;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0A0D14] text-slate-100 justify-center items-center">
        <h2 className="text-2xl font-bold text-emerald-400 animate-pulse">Loading Profile...</h2>
      </div>
    );
  }

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
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {profileData.fullName}
              </h1>
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
          
          {/* Conditionally show Edit button only if viewing own profile */}
          {id === undefined && (
            <Link 
              to="/profile-setup" 
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-2xl text-xs transition shadow-lg flex items-center gap-2"
            >
              {lang === 'fr' ? 'Modifier le Profil' : 'Edit Profile'}
            </Link>
          )}
        </div>

        {/* Integrated Dashboard Metrics Bar (Only show if viewing own profile) */}
        {id === undefined && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DashboardStatCard title={lang === 'fr' ? 'Demandes Client' : 'Client Requests'} value={dashboardStats.clientRequestsCount} Icon={FileText} colorClass="text-emerald-400" />
            <DashboardStatCard title={lang === 'fr' ? 'Propositions Envoyées' : 'Proposals Sent'} value={dashboardStats.proposalsCount} Icon={Briefcase} colorClass="text-teal-400" />
            <DashboardStatCard title={lang === 'fr' ? 'Contrats Actifs' : 'Active Contracts'} value={dashboardStats.contractsCount} Icon={FileText} colorClass="text-emerald-400" />
            <DashboardStatCard title={lang === 'fr' ? 'Score de Réputation' : 'Reputation Score'} value={averageRating} Icon={Star} colorClass="text-amber-400" isRating />
          </div>
        )}

        {/* Details Grid: Contact & Expertise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Contact Information */}
          <div className="bg-[#111622]/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <User className="h-4 w-4" /> {lang === 'fr' ? 'Informations de Contact' : 'Contact Information'}
            </h3>
            
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <InfoCard label="Email" value={profileData.email} />
              <InfoCard label={lang === 'fr' ? 'Téléphone' : 'Phone'} value={profileData.phone} />
              <InfoCard label={lang === 'fr' ? 'Localisation' : 'Location'} value={profileData.location} />
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
                  {profileData.bio || (lang === 'fr' ? 'Aucune biographie saisie pour le moment.' : 'No biography provided yet.')}
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
            <TabTitle active Icon={Briefcase} title={lang === 'fr' ? 'Missions Réussies' : 'Completed Gigs'} count={completedJobs.length} />
            <TabTitle Icon={Star} title={lang === 'fr' ? 'Avis Clients' : 'Client Reviews'} count={reviews.length} />
            <TabTitle Icon={Award} title={lang === 'fr' ? 'Qualifications' : 'Qualifications'} count={qualifications.length} />
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
                          {job.category || 'Contract'}
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
              <EmptyState message={lang === 'fr' ? 'Aucune mission terminée pour le moment.' : 'No completed transactions recorded yet.'} Icon={FileText} />
            )}
          </div>

          {/* Qualifications Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'fr' ? 'Diplômes, Certifications et Qualifications saisis' : 'Qualifications & Certifications'}
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
               <EmptyState message={lang === 'fr' ? 'Aucune qualification saisie.' : 'No qualifications added yet.'} Icon={Award} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Helper Components for cleaner JSX
const InfoCard = ({ label, value }) => (
  <div className="flex items-center gap-3 bg-[#0A0D14] p-3 rounded-2xl border border-slate-800">
    <div className="overflow-hidden w-full">
      <span className="text-[10px] text-slate-400 block">{label}</span>
      <span className="font-medium text-white truncate block">{value || 'Not provided'}</span>
    </div>
  </div>
);

const DashboardStatCard = ({ title, value, Icon, colorClass, isRating }) => (
  <div className="bg-[#111622]/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
    <div>
      <p className="text-[10px] text-slate-400 uppercase font-bold">{title}</p>
      <h4 className={`text-2xl font-black ${isRating ? 'text-amber-400' : 'text-white'} mt-1 flex items-center gap-1`}>
        {value} {isRating && <Star className="h-4 w-4 fill-amber-400" />}
      </h4>
    </div>
    <div className={`p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl ${colorClass}`}>
      <Icon className="h-5 w-5" />
    </div>
  </div>
);

const TabTitle = ({ Icon, title, count, active }) => (
  <span className={`pb-3 text-sm font-bold ${active ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400'} flex items-center gap-2`}>
    <Icon className="h-4 w-4" /> {title} ({count})
  </span>
);

const EmptyState = ({ message, Icon }) => (
  <div className="bg-[#0A0D14] border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
    <Icon className="h-8 w-8 text-slate-600 mx-auto mb-2" />
    <p className="text-xs">{message}</p>
  </div>
);