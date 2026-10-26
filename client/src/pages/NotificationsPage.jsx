import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';
import { Bell, CheckCircle2, Send, FileText, ShieldCheck } from 'lucide-react';

export default function NotificationsPage() {
  const { lang } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const currentUserId = currentUser._id || currentUser.id;

    // Fetch real proposals, contracts, and user approval status concurrently
    Promise.all([
      fetch('http://localhost:5000/api/proposals').then(res => res.json()).catch(() => []),
      fetch('http://localhost:5000/api/contracts').then(res => res.json()).catch(() => [])
    ]).then(([proposalsData, contractsData]) => {
      const generatedNotifs = [];

      // Generate notifications from real proposals received or submitted
      if (Array.isArray(proposalsData)) {
        proposalsData.forEach((prop, idx) => {
          generatedNotifs.push({
            id: `prop-${idx}`,
            type: 'proposal',
            title: lang === 'fr' ? 'Nouvelle Proposition Reçue' : 'New Professional Proposal Received',
            description: `${prop.professionalName || 'A professional'} submitted a quote of ${prop.bidAmount} for your project.`,
            date: prop.createdAt || 'Recent',
            icon: Send
          });
        });
      }

      // Generate notifications from active contracts
      if (Array.isArray(contractsData)) {
        contractsData.forEach((contract, idx) => {
          generatedNotifs.push({
            id: `contract-${idx}`,
            type: 'contract',
            title: lang === 'fr' ? 'Mise à jour du Contrat' : 'Contract Milestone Update',
            description: `Project "${contract.projectTitle}" is currently in status: ${contract.status}.`,
            date: contract.createdAt || 'Recent',
            icon: CheckCircle2
          });
        });
      }

      // Add account verification notification if approved
      if (currentUser.isApproved) {
        generatedNotifs.unshift({
          id: 'admin-approval',
          type: 'system',
          title: lang === 'fr' ? 'Compte Vérifié et Approuvé' : 'Account Verified & Approved',
          description: lang === 'fr' ? 'Votre compte a été approuvé par l’administrateur.' : 'Your account has been fully approved by the platform admin.',
          date: 'System',
          icon: ShieldCheck
        });
      }

      setNotifications(generatedNotifs);
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching notifications:', err);
      setLoading(false);
    });
  }, [lang]);

  return (
    <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between relative min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-20 space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-[#111622] to-slate-900/80 border border-emerald-700/30 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              <Bell className="h-3.5 w-3.5 text-emerald-400" /> {lang === 'fr' ? 'Centre d’activités' : 'Live Account Activity'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'fr' ? 'Notifications' : 'Notifications'}
            </h1>
            <p className="text-slate-300 text-xs mt-1">
              {lang === 'fr' ? 'Suivez les propositions de services et les mises à jour de contrats.' : 'Monitor proposal submissions, project contracts, and verification status.'}
            </p>
          </div>
        </div>

        {/* Notifications Feed */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-3"></div>
            {lang === 'fr' ? 'Chargement des notifications...' : 'Loading notifications...'}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notif) => {
              const IconComponent = notif.icon;
              return (
                <div key={notif.id} className="bg-[#111622]/80 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-3xl shadow-xl flex items-start gap-4 transition">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 shrink-0 mt-0.5">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-white">{notif.title}</h3>
                      <span className="text-[10px] text-slate-500 font-semibold">{notif.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{notif.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#111622]/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            <Bell className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">{lang === 'fr' ? 'Aucune notification pour le moment' : 'No new notifications'}</h3>
            <p className="text-xs text-slate-500 mt-1">{lang === 'fr' ? 'Vos alertes d’activité apparaîtront ici.' : 'Activity alerts regarding jobs, proposals, and contracts will show up here.'}</p>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}