import React from 'react';
import { ShieldCheck, Star, MapPin, Briefcase, Calendar, CheckCircle2, Award, ExternalLink, MessageSquare, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';

export default function ProfileDetailPage() {
  const { lang } = useLanguage();

  const professional = {
    name: "Kifon Precious Yufonyuy",
    title: "Full-Stack Web Developer & IT Engineer",
    location: "Buea, Cameroon",
    rating: 4.9,
    reviewsCount: 48,
    completedProjects: 35,
    hourlyRate: "15,000 XAF / hr",
    bio: lang === 'fr' 
      ? "Ingénieur en Informatique et développeur Full-Stack spécialisé dans la création d'applications web modernes (MERN stack, PHP) et de tableaux de bord interactifs. Expérience avérée dans la conception de solutions sur mesure." 
      : "Computer Engineering student and Full-Stack Web Developer specializing in modern web apps (MERN stack, PHP) and interactive dashboards. Proven expertise in building customized digital marketplaces and secure platforms.",
    skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB", "PHP", "Tailwind CSS", "MATLAB"],
    portfolioItems: [
      {
        title: "Online Banking System",
        category: "Fintech Web App",
        description: lang === 'fr' ? "Système bancaire en ligne sécurisé avec gestion des comptes et transferts." : "Secure online banking system with account management and transaction tracking."
      },
      {
        title: "Food Delivery Platform",
        category: "E-Commerce App",
        description: lang === 'fr' ? "Application web de commande et livraison de repas en temps réel." : "Real-time food ordering and delivery web application with live status updates."
      },
      {
        title: "Service Exchange Marketplace",
        category: "Digital Platform",
        description: lang === 'fr' ? "Place de marché numérique connectant clients et professionnels qualifiés." : "Digital marketplace connecting clients with verified local professionals."
      }
    ],
    certifications: [
      { name: "Full-Stack Web Development Certification", issuer: "ZENVA TECH", year: "2026" },
      { name: "Advanced DIPET I Information Technology", issuer: "HTTTC Kumba, University of Buea", year: "2026" }
    ]
  };

  return (
    <div className="flex flex-col flex-grow bg-[#0A0D14] text-slate-100 justify-between min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 z-20">
        
        {/* Profile Header Card */}
        <div className="bg-[#111622]/80 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 backdrop-blur-md">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 font-black text-2xl shadow-lg">
              KY
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-white">{professional.name}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" /> {lang === 'fr' ? 'Vérifié' : 'Verified'}
                </span>
              </div>
              <p className="text-emerald-400 text-xs font-semibold mb-2">{professional.title}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-500" /> {professional.location}</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold"><Star className="h-3.5 w-3.5 fill-emerald-400" /> {professional.rating} ({professional.reviewsCount} {lang === 'fr' ? 'avis' : 'reviews'})</span>
                <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5 text-slate-500" /> {professional.completedProjects} {lang === 'fr' ? 'projets terminés' : 'projects completed'}</span>
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
          
          {/* Left Column: Bio & Skills */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-[#111622]/60 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
              <h2 className="text-base font-black text-white mb-3">{lang === 'fr' ? 'À propos de moi' : 'About Me'}</h2>
              <p className="text-slate-300 text-xs leading-relaxed">{professional.bio}</p>
            </div>

            {/* Portfolio Showcase */}
            <div className="bg-[#111622]/60 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
              <h2 className="text-base font-black text-white mb-4">{lang === 'fr' ? 'Projets Récents & Portfolio' : 'Portfolio Showcase'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {professional.portfolioItems.map((item, idx) => (
                  <div key={idx} className="bg-[#0A0D14] border border-slate-800 p-4 rounded-2xl flex flex-col justify-between hover:border-emerald-500/50 transition">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{item.category}</span>
                      <h3 className="text-white font-bold text-sm mt-1 mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-300 font-semibold cursor-pointer">
                      <span>{lang === 'fr' ? 'Voir le projet' : 'View Project'}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-[#111622]/60 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
              <h2 className="text-base font-black text-white mb-4">{lang === 'fr' ? 'Certifications & Diplômes' : 'Certifications & Credentials'}</h2>
              <div className="space-y-3">
                {professional.certifications.map((cert, idx) => (
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
          </div>

          {/* Right Column: Rate, Skills & Quick Info */}
          <div className="space-y-6">
            <div className="bg-[#111622]/60 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-md">
              <div className="text-center pb-6 border-b border-slate-800">
                <span className="text-slate-400 text-xs block mb-1">{lang === 'fr' ? 'Tarif Horaire' : 'Hourly Rate'}</span>
                <span className="text-2xl font-black text-emerald-400">{professional.hourlyRate}</span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">{lang === 'fr' ? 'Compétences & Technologies' : 'Skills & Stack'}</h3>
                <div className="flex flex-wrap gap-2">
                  {professional.skills.map((skill, idx) => (
                    <span key={idx} className="bg-[#0A0D14] text-emerald-300 border border-slate-800 text-[11px] font-medium px-3 py-1.5 rounded-xl">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{lang === 'fr' ? 'Temps de réponse' : 'Response time'}</span>
                  <span className="text-emerald-400 font-bold">&lt; 1 hour</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{lang === 'fr' ? 'Taux de succès' : 'Job Success'}</span>
                  <span className="text-emerald-400 font-bold">100%</span>
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