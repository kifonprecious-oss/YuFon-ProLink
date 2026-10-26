import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import { Briefcase, FileText, DollarSign, Clock, ArrowRight, Search, PlusCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyJobsPage() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('posted'); // 'posted' or 'applied'
  const [postedJobs, setPostedJobs] = useState([]);
  const [appliedGigs, setAppliedGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const currentUserId = currentUser._id || currentUser.id || '';

    // Fetch real posted client jobs and submitted professional proposals from the backend
    Promise.all([
      fetch('http://localhost:5000/api/client-requests').then(res => res.json()).catch(() => []),
      fetch('http://localhost:5000/api/proposals').then(res => res.json()).catch(() => [])
    ]).then(([requestsData, proposalsData]) => {
      // Filter posted jobs (requests created by or associated with this user, or all if none filtered)
      const realPosted = Array.isArray(requestsData) ? requestsData : [];
      
      // Filter applied proposals (only proposals actually submitted by this professional)
      const realApplied = Array.isArray(proposalsData) 
        ? proposalsData.filter(p => p.professionalId === currentUserId)
        : [];

      setPostedJobs(realPosted);
      setAppliedGigs(realApplied);
      setLoading(false);
    }).catch(err => {
      console.error('Error loading job records:', err);
      setPostedJobs([]);
      setAppliedGigs([]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-20 space-y-8">
        
        {/* Header Title & Description */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-emerald-950/60 via-emerald-950/30 to-slate-900/80 border border-emerald-700/30 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'fr' ? 'Mes Emplois & Missions' : 'My Jobs & Postings'}
            </h1>
            <p className="text-slate-300 text-xs mt-1.5 max-w-xl leading-relaxed">
              {lang === 'fr' 
                ? 'Suivez vos publications d\'emplois en tant que client et vos propositions soumises en tant que professionnel.' 
                : 'Track all jobs you have posted as a client and all professional proposals you have submitted.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/post-request" 
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition"
            >
              <PlusCircle className="h-4 w-4" /> {lang === 'fr' ? 'Publier un Emploi' : 'Post New Job'}
            </Link>
            <Link 
              to="/find-jobs" 
              className="bg-[#111622] hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 border border-slate-700 transition"
            >
              <Search className="h-4 w-4 text-emerald-400" /> {lang === 'fr' ? 'Trouver des Missions' : 'Explore Gigs'}
            </Link>
          </div>
        </div>

        {/* Tab Navigation Switches */}
        <div className="flex border-b border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('posted')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'posted'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            {lang === 'fr' ? 'Emplois Publiés (Client)' : 'Jobs Posted as Client'} 
            <span className="bg-[#111622] border border-slate-700 text-xs px-2 py-0.5 rounded-full text-emerald-300 ml-1">
              {postedJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('applied')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'applied'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            {lang === 'fr' ? 'Missions Postulées (Pro)' : 'Gigs Applied as Professional'} 
            <span className="bg-[#111622] border border-slate-700 text-xs px-2 py-0.5 rounded-full text-teal-300 ml-1">
              {appliedGigs.length}
            </span>
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm bg-[#111622]/40 rounded-3xl border border-slate-800">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-3"></div>
            {lang === 'fr' ? 'Chargement de vos emplois...' : 'Loading your job listings...'}
          </div>
        ) : (
          <div>
            {/* TAB 1: POSTED JOBS (CLIENT VIEW) */}
            {activeTab === 'posted' && (
              <div>
                {postedJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {postedJobs.map((job, idx) => (
                      <div key={job._id || idx} className="bg-[#111622]/70 border border-slate-800 hover:border-emerald-600/50 transition p-6 rounded-3xl shadow-xl flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-3 mb-3">
                            <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-3 py-1 rounded-full">
                              {job.category || 'General'}
                            </span>
                            <span className="bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {job.status || 'Active'}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white">{job.title || job.projectTitle}</h3>
                          <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">{job.description}</p>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-slate-400" /> {job.budget}
                          </span>
                          <Link to="/messages" className="text-teal-400 hover:underline font-bold flex items-center gap-1">
                            View Applicants <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#111622]/50 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
                    <FileText className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">No jobs posted yet</h3>
                    <p className="text-xs text-slate-400 mt-1 mb-6">Post your service requirements to start receiving quotes from verified professionals.</p>
                    <Link to="/post-request" className="bg-emerald-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-emerald-400 transition inline-flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" /> Post Your First Job
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: APPLIED GIGS (PROFESSIONAL VIEW) */}
            {activeTab === 'applied' && (
              <div>
                {appliedGigs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {appliedGigs.map((gig, idx) => (
                      <div key={gig._id || idx} className="bg-[#111622]/70 border border-slate-800 hover:border-teal-600/50 transition p-6 rounded-3xl shadow-xl flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-3 mb-3">
                            <span className="bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[11px] font-bold px-3 py-1 rounded-full">
                              Client: {gig.clientName || 'Client'}
                            </span>
                            <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold px-3 py-1 rounded-full">
                              {gig.status || 'Submitted'}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white">{gig.projectTitle}</h3>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                            {lang === 'fr' ? 'Votre proposition de service a été transmise au client.' : 'Your professional quote and timeline have been submitted for review.'}
                          </p>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-slate-400" /> {gig.budget || gig.bidAmount}
                          </span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" /> Timeline: {gig.timeline || gig.deliveryTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#111622]/50 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
                    <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">No professional applications yet</h3>
                    <p className="text-xs text-slate-400 mt-1 mb-6">Explore available client jobs on the board and submit your proposals.</p>
                    <Link to="/find-jobs" className="bg-teal-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-teal-500 transition inline-flex items-center gap-2">
                      <Search className="h-4 w-4" /> Find Jobs to Apply
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}