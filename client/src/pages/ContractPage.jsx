import React, { useState, useEffect } from 'react';
import { FileText, ShieldCheck, DollarSign, Calendar, CheckCircle2, Lock, ArrowRight, Download, FolderKanban, PlusCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function ContractPage() {
  const { lang } = useLanguage();
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);
  const [escrowPaid, setEscrowPaid] = useState(false);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('currentUser')) || {};
      const currentUserId = storedUser?._id || storedUser?.id || '';

      // Fetch real contracts from MongoDB / Backend API
      fetch('http://localhost:5000/api/contracts')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            // Find an active project involving this real user
            const found = data.find(c => 
              (c.clientId === currentUserId || c.professionalId === currentUserId) && 
              (c.status === 'active' || c.status === 'In Progress' || c.status === 'pending')
            );
            setActiveProject(found || null);
            if (found) {
              setSigned(found.signed || false);
              setEscrowPaid(found.escrowPaid || false);
            }
          } else {
            // Fallback to localStorage active project if any real agreement was created
            const localActive = JSON.parse(localStorage.getItem('activeContract'));
            setActiveProject(localActive || null);
            if (localActive) {
              setSigned(localActive.signed || false);
              setEscrowPaid(localActive.escrowPaid || false);
            }
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch active contract:", err);
          const localActive = JSON.parse(localStorage.getItem('activeContract'));
          setActiveProject(localActive || null);
          setLoading(false);
        });
    } catch (err) {
      console.error("Error loading contract:", err);
      setLoading(false);
    }
  }, []);

  const handleSignContract = () => {
    setSigned(true);
    if (activeProject) {
      const updated = { ...activeProject, signed: true };
      setActiveProject(updated);
      localStorage.setItem('activeContract', JSON.stringify(updated));
    }
    alert(
      lang === 'fr'
        ? 'Contrat numérique signé avec succès ! Veuillez approvisionner le compte séquestre pour démarrer le projet.'
        : 'Digital contract successfully signed! Please fund the escrow milestone to initiate project execution.'
    );
  };

  const handlePayEscrow = () => {
    setEscrowPaid(true);
    if (activeProject) {
      const updated = { ...activeProject, escrowPaid: true, status: 'In Progress' };
      setActiveProject(updated);
      localStorage.setItem('activeContract', JSON.stringify(updated));
    }
    alert(
      lang === 'fr'
        ? 'Fonds bloqués en toute sécurité dans l’espace séquestre (Escrow) de YuFon-ProLink. Le professionnel peut commencer.'
        : 'Funds securely locked in YuFon-ProLink escrow. The professional can now begin the project.'
    );
  };

  return (
    <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between relative min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-20">
        
        {/* Header */}
        <div className="bg-[#111622]/80 border border-slate-800 p-6 rounded-3xl shadow-2xl mb-8 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 
              {lang === 'fr' ? 'Contrat & Suivi de Projet en Cours' : 'Active Project Agreement & Milestone Tracking'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {lang === 'fr' ? 'Gestion des Projets Actifs' : 'Active Project Workspace'}
          </h1>
          <p className="text-slate-300 text-xs mt-1">
            {lang === 'fr'
              ? 'Suivez l’avancement et les jalons de vos collaborations réelles entre clients et professionnels.'
              : 'Track progress and deliverables for verified client and professional engagements on YuFon-ProLink.'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm bg-[#111622]/40 rounded-3xl border border-slate-800">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-3"></div>
            {lang === 'fr' ? 'Vérification de vos contrats en cours...' : 'Checking for active project contracts...'}
          </div>
        ) : activeProject ? (
          /* Active Contract & Project Progress Card */
          <div className="bg-[#111622]/60 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-800 gap-4">
              <div>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  {lang === 'fr' ? `Référence # ${activeProject._id || 'YFP-2026-PRO'}` : `Project Ref # ${activeProject._id || 'YFP-2026-PRO'}`}
                </span>
                <h2 className="text-xl font-black text-white mt-1">{activeProject.title || activeProject.projectTitle}</h2>
              </div>
              <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold">
                Status: {activeProject.status || 'In Progress'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#0A0D14] p-4 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block mb-1">{lang === 'fr' ? 'Budget du Contrat' : 'Contract Budget'}</span>
                <div className="text-emerald-400 font-black text-base flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-slate-400" /> {activeProject.budget || '150,000 XAF'}
                </div>
              </div>
              <div className="bg-[#0A0D14] p-4 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block mb-1">{lang === 'fr' ? 'Délai d’Exécution' : 'Timeline'}</span>
                <div className="text-white font-black text-base flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-slate-400" /> {activeProject.timeline || '3 Weeks'}
                </div>
              </div>
              <div className="bg-[#0A0D14] p-4 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block mb-1">{lang === 'fr' ? 'Protection Escrow' : 'Escrow Security'}</span>
                <div className="text-teal-400 font-black text-base flex items-center gap-1">
                  <Lock className="h-4 w-4" /> {escrowPaid ? '100% Secured' : 'Pending Funding'}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed bg-[#0A0D14] p-5 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-white text-sm">{lang === 'fr' ? 'Progression & Jalons du Projet :' : 'Project Progress & Milestones:'}</h3>
              <p>• {lang === 'fr' ? 'Étape 1 : Analyse des besoins et spécifications techniques.' : 'Milestone 1: Requirements analysis & technical specs.'}</p>
              <p>• {lang === 'fr' ? 'Étape 2 : Développement full-stack et intégration des bases de données.' : 'Milestone 2: Full-stack development & database integration.'}</p>
              <p>• {lang === 'fr' ? 'Étape 3 : Tests finaux, validation et déploiement de production.' : 'Milestone 3: Final testing, client review & deployment.'}</p>
            </div>

            {/* Workflow Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className={`h-5 w-5 ${signed ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className={signed ? 'text-emerald-300 font-bold' : 'text-slate-400'}>
                  {signed ? (lang === 'fr' ? 'Contrat Signé' : 'Contract Signed') : (lang === 'fr' ? 'En attente de signature' : 'Awaiting Signature')}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {!signed ? (
                  <button 
                    onClick={handleSignContract}
                    className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <FileText className="h-4 w-4" /> {lang === 'fr' ? 'Signer le Contrat' : 'Sign Contract'}
                  </button>
                ) : !escrowPaid ? (
                  <button 
                    onClick={handlePayEscrow}
                    className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Lock className="h-4 w-4" /> {lang === 'fr' ? 'Approvisionner l’Escrow' : 'Fund Escrow'}
                  </button>
                ) : (
                  <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-5 py-3 rounded-2xl flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> {lang === 'fr' ? 'Projet en cours & Fonds en Escrow' : 'Project In Progress & Escrow Active'}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Empty State when no actual project is ongoing */
          <div className="bg-[#111622]/60 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center justify-center text-emerald-400 mx-auto">
              <FolderKanban className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-black text-white">
              {lang === 'fr' ? 'Aucun projet en cours pour le moment' : 'No ongoing projects at the moment'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              {lang === 'fr'
                ? 'Vous n’avez actuellement aucun contrat ou projet actif en cours entre client et professionnel. Publiez une offre ou postulez à une mission pour démarrer une collaboration.'
                : 'You currently have no active contracts or projects running between a client and a professional. Post a job or apply for an open gig to initiate a verified collaboration.'}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                to="/post-request" 
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-3 rounded-2xl text-xs transition shadow-lg inline-flex items-center justify-center gap-2"
              >
                <PlusCircle className="h-4 w-4" /> {lang === 'fr' ? 'Publier une Offre (Client)' : 'Post a Job (Client)'}
              </Link>
              <Link 
                to="/find-jobs" 
                className="w-full sm:w-auto bg-[#0A0D14] hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-2xl text-xs transition border border-slate-700 inline-flex items-center justify-center gap-2"
              >
                {lang === 'fr' ? 'Explorer les Missions (Pro)' : 'Find Gigs (Professional)'}
              </Link>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}