import React, { useState, useEffect } from 'react';
import { 
  Briefcase, FileText, DollarSign, Calendar, CheckCircle, 
  Clock, ShieldCheck, PlusCircle, Layers, Send, ArrowRight, MessageSquare, 
  TrendingUp, Award, Sparkles, FolderKanban, Search
} from 'lucide-react';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { lang } = useLanguage();
  const [user, setUser] = useState({ name: 'User', role: 'Dual-Role Professional', id: '' });
  const [clientRequests, setClientRequests] = useState([]);
  const [proProposals, setProProposals] = useState([]);
  const [activeContracts, setActiveContracts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load logged-in user profile from localStorage
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setUser(storedUser);
    }
    const currentUserId = storedUser?._id || storedUser?.id || '';

    // Fetch requests, proposals, contracts, and reviews concurrently
    Promise.all([
      fetch('http://localhost:5000/api/requests').then(res => res.json()).catch(() => []),
      fetch('http://localhost:5000/api/proposals').then(res => res.json()).catch(() => []),
      fetch('http://localhost:5000/api/contracts').then(res => res.json()).catch(() => []),
      currentUserId 
        ? fetch(`http://localhost:5000/api/reviews/${currentUserId}`).then(res => res.json()).catch(() => [])
        : Promise.resolve([])
    ]).then(([requestsData, proposalsData, contractsData, reviewsData]) => {
      // Also check localStorage for locally posted requests
      const localRequests = JSON.parse(localStorage.getItem('clientRequests')) || [];
      const combinedRequests = [...localRequests, ...(Array.isArray(requestsData) ? requestsData : [])];
      
      setClientRequests(combinedRequests);
      
      setProProposals(Array.isArray(proposalsData) ? proposalsData : [
        { _id: '1', projectTitle: 'Modern Web App Development', clientName: 'Enterprise Ltd', budget: '150,000 XAF', timeline: '3 Weeks', status: 'In Negotiation' }
      ]);

      // Filter contracts belonging to this professional that are explicitly active
      const userContracts = Array.isArray(contractsData) 
        ? contractsData.filter(c => (c.professionalId === currentUserId || c.professional === currentUserId) && (c.status === 'active' || c.status === 'Active'))
        : [];
      setActiveContracts(userContracts);

      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setLoading(false);
    });
  }, []);

  // Calculate dynamic average rating from reviews array
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + (Number(rev.rating) || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-20 space-y-8">
        
        {/* Top Welcome Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/70 via-emerald-950/40 to-slate-900/90 border border-emerald-700/40 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> {lang === 'fr' ? 'Compte Professionnel Vérifié' : 'Verified Dual-Role Hub'}
                </span>
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[11px] font-bold px-3.5 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-teal-400" /> Live & Synchronized
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {lang === 'fr' ? `Bon retour, ${user.name || 'Professionnel'} !` : `Welcome back, ${user.name || 'Professional'}!`}
              </h1>
              <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
                {lang === 'fr' 
                  ? 'Pilotez simultanément vos missions de client et vos prestations professionnelles depuis ce tableau de bord unifié.' 
                  : 'Seamlessly monitor your client hiring requests, active project milestones, and professional service proposals in real time.'}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link 
                to="/post-request" 
                className="flex-1 md:flex-initial bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
              >
                <PlusCircle className="h-4 w-4" /> {lang === 'fr' ? 'Publier un Emploi' : 'Post New Job'}
              </Link>
              <Link 
                to="/find-jobs" 
                className="flex-1 md:flex-initial bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition transform hover:-translate-y-0.5 border border-slate-700"
              >
                <Search className="h-4 w-4 text-emerald-400" /> {lang === 'fr' ? 'Trouver des Missions' : 'Explore Gigs'}
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Analytics Executive Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#111622] border border-slate-800/80 hover:border-emerald-600/50 transition p-6 rounded-3xl shadow-xl flex items-center justify-between group">
            <div>
              <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">{lang === 'fr' ? 'Requêtes Client Actives' : 'Active Client Requests'}</p>
              <h3 className="text-3xl font-black text-emerald-400 mt-2 group-hover:scale-105 transition transform origin-left">{clientRequests.length}</h3>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3 text-emerald-400" /> Hiring pipeline active</p>
            </div>
            <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 text-emerald-300">
              <FileText className="h-7 w-7" />
            </div>
          </div>

          <div className="bg-[#111622] border border-slate-800/80 hover:border-emerald-600/50 transition p-6 rounded-3xl shadow-xl flex items-center justify-between group">
            <div>
              <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">{lang === 'fr' ? 'Devis Pro Soumis' : 'Pro Quotations Sent'}</p>
              <h3 className="text-3xl font-black text-teal-400 mt-2 group-hover:scale-105 transition transform origin-left">{proProposals.length}</h3>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1"><Send className="h-3 w-3 text-teal-400" /> Pending review</p>
            </div>
            <div className="bg-teal-500/10 p-4 rounded-2xl border border-teal-500/20 text-teal-300">
              <Send className="h-7 w-7" />
            </div>
          </div>

          <div className="bg-[#111622] border border-slate-800/80 hover:border-emerald-600/50 transition p-6 rounded-3xl shadow-xl flex items-center justify-between group">
            <div>
              <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">{lang === 'fr' ? 'Contrats Actifs' : 'Active Contracts'}</p>
              <h3 className="text-3xl font-black text-emerald-400 mt-2 group-hover:scale-105 transition transform origin-left">{activeContracts.length}</h3>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1"><FolderKanban className="h-3 w-3 text-emerald-400" /> In execution phase</p>
            </div>
            <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 text-emerald-300">
              <Layers className="h-7 w-7" />
            </div>
          </div>

          <div className="bg-[#111622] border border-slate-800/80 hover:border-emerald-600/50 transition p-6 rounded-3xl shadow-xl flex items-center justify-between group">
            <div>
              <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">{lang === 'fr' ? 'Indice de Réputation' : 'Reputation Score'}</p>
              <h3 className="text-3xl font-black text-amber-300 mt-2 group-hover:scale-105 transition transform origin-left">
                {averageRating ? `${averageRating}` : '5.0'} <span className="text-lg text-amber-400">⭐</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1"><Award className="h-3 w-3 text-amber-400" /> {reviews.length} client reviews</p>
            </div>
            <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 text-amber-400">
              <CheckCircle className="h-7 w-7" />
            </div>
          </div>
        </div>

        {/* Main Content Dual Panels Grid */}
        {loading ? (
          <div className="text-center py-24 text-slate-400 text-sm bg-[#111622]/40 rounded-3xl border border-slate-800">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400 mx-auto mb-3"></div>
            {lang === 'fr' ? 'Chargement de votre tableau de bord...' : 'Synchronizing your unified dashboard metrics...'}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* PANEL 1: Client Hiring Requests */}
            <div className="bg-[#111622]/70 border border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-400" /> {lang === 'fr' ? 'Vos Demandes de Services (Client)' : 'Your Posted Service Requests'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">{lang === 'fr' ? 'Suivi de vos projets confiés à des professionnels.' : 'Manage open hiring briefs and hired professionals.'}</p>
                  </div>
                  <Link to="/my-jobs" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
                    View All <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {clientRequests.length > 0 ? (
                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                    {clientRequests.slice(0, 3).map((req) => (
                      <div key={req._id || req.id} className="bg-[#0A0D14]/80 border border-slate-800 hover:border-slate-700 transition p-5 rounded-2xl shadow-md">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              {req.category || 'General Pool'}
                            </span>
                            <h3 className="text-base font-bold text-white mt-1.5">{req.title || req.projectTitle}</h3>
                          </div>
                          <span className="bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {req.status || 'Active'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">{req.description}</p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-xs">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-slate-400" /> {req.budget}
                          </span>
                          <Link to="/messages" className="text-teal-400 font-semibold hover:underline flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" /> Chat Professional
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-[#0A0D14]/50 border border-slate-800/80 rounded-2xl p-6">
                    <FileText className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-300">{lang === 'fr' ? 'Aucune demande active' : 'No active client requests found'}</p>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Post your first job brief to hire verified experts.</p>
                    <Link to="/post-request" className="inline-flex items-center gap-1.5 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-400 transition">
                      <PlusCircle className="h-3.5 w-3.5" /> Post Job Now
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                <Link to="/post-request" className="text-xs font-bold text-slate-400 hover:text-white transition">
                  + Create a new service requirement posting
                </Link>
              </div>
            </div>

            {/* PANEL 2: Professional Gigs & Proposals */}
            <div className="bg-[#111622]/70 border border-slate-800/80 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-teal-400" /> {lang === 'fr' ? 'Vos Missions & Propositions (Pro)' : 'Your Professional Gigs & Proposals'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">{lang === 'fr' ? 'Suivi de vos devis et contrats en cours.' : 'Track submitted quotations and contract executions.'}</p>
                  </div>
                  <Link to="/proposals" className="text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1">
                    View All <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {proProposals.length > 0 ? (
                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                    {proProposals.slice(0, 3).map((prop, idx) => (
                      <div key={idx} className="bg-[#0A0D14]/80 border border-slate-800 hover:border-slate-700 transition p-5 rounded-2xl shadow-md">
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className="bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                              Client: {prop.clientName || 'Private Client'}
                            </span>
                            <h3 className="text-base font-bold text-white mt-1.5">{prop.projectTitle}</h3>
                          </div>
                          <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                            {prop.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                          {lang === 'fr' ? 'Proposition soumise avec succès. En attente de validation.' : 'Proposal submitted successfully. Awaiting contract sign-off.'}
                        </p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-xs">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-slate-400" /> {prop.budget}
                          </span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" /> {prop.timeline}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-[#0A0D14]/50 border border-slate-800/80 rounded-2xl p-6">
                    <Briefcase className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-300">No active professional proposals</p>
                    <p className="text-xs text-slate-500 mt-1 mb-4">Browse open job listings and submit competitive quotes.</p>
                    <Link to="/find-jobs" className="inline-flex items-center gap-1.5 bg-teal-600 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-teal-500 transition">
                      Find Jobs <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                <Link to="/find-jobs" className="text-xs font-bold text-teal-400 hover:text-teal-300 transition">
                  Browse open client job board &rarr;
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}