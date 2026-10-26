import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  const t = {
    en: {
      // Navbar & General
      navBrand: 'YuFon-ProLink',
      navHome: 'Home',
      navServices: 'Find Professionals',
      navLogin: 'Sign In',
      navRegister: 'Register',
      heroTag: 'Cameroon #1 Digital Service Exchange Platform',
      heroTitle: 'Connect with Trusted Local Professionals & Experts',
      heroSubtitle: 'From software engineers and builders to graphic designers and artisans. Hire verified talent or offer your professional services across Cameroon.',
      exploreBtn: 'Explore Professionals',
      registerProBtn: 'Register as Professional',

      // Services Page
      servicesTitle: 'Explore Verified Professionals',
      servicesSubtitle: 'Browse top-tier talent across Cameroon. View portfolios, verified reviews, and connect directly.',
      searchPlaceholder: 'Search by name, skill, or city (e.g., Buea, Douala)...',
      allCategories: 'All Categories',
      hourlyRateLabel: 'Pricing',
      contactBtn: 'Request Quote / Chat',
      reviewsLabel: 'Reviews',

      // Login Page
      loginBadge: 'Secure Sign In',
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Access your dashboard, manage requests, and grow your business.',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      signInBtn: 'Sign In',
      noAccount: "Don't have an account?",
      registerLink: 'Register here',

      // Register Page
      secureBadge: 'Secure Authentication & Registration',
      titlePro: 'Register as a Professional',
      titleClient: 'Register as a Client',
      regSubtitle: 'Create an account with a secure password to get started.',
      tabPro: 'I am a Professional',
      tabClient: 'I am a Client',
      nameLabel: 'Full Name / Business Name',
      locationLabel: 'Location / City',
      phoneLabel: 'Phone Number',
      categoryLabel: 'Primary Specialty / Category',
      submitBtn: 'Complete Registration',
      hasAccount: 'Already have an account?',

      // Dashboard Page
      dashBadge: 'Client Dashboard',
      dashTitle: 'My Project Requests',
      dashSubtitle: 'Track your submitted quotation requests and communication with professionals.',
      dashLoading: 'Loading your project requests...',
      dashFor: 'For',
      dashTimeline: 'Timeline',
      dashSubmitted: 'Submitted',
      dashAwaiting: 'Awaiting Response',
      dashNoRequests: 'No Project Requests Found',
      dashNoRequestsDesc: 'You have not sent any quote requests to professionals yet. Explore our directory and connect with verified experts.',

      // Footer
      footerConnectBuild: 'Connect And Build',
      forClients: 'For Clients',
      forClientsDesc: 'Find trusted professionals fast.',
      forProfessionals: 'For Professionals',
      forProfessionalsDesc: 'Get jobs & grow your business.',
      footerTagline: 'From your need to real work!',

      // AddReviewModal
      reviewSubtitle: 'Share your experience to help build trust and reputation.',
      yourNameLabel: 'Your Name',
      ratingLabel: 'Rating (1 to 5 Stars)',
      reviewCommentLabel: 'Review Comment',
      postReviewBtn: 'Post Review',

      // RequestQuoteModal
      requestQuotationBadge: 'Request Quotation',
      projectTitleLabel: 'Project Title',
      projectDescLabel: 'Project Description & Scope',
      estimatedBudgetLabel: 'Estimated Budget (XAF)',
      expectedTimelineLabel: 'Expected Timeline',
      cancelBtn: 'Cancel',
      sendRequestBtn: 'Send Request',
    },
    fr: {
      // Navbar & General
      navBrand: 'YuFon-ProLink',
      navHome: 'Accueil',
      navServices: 'Trouver des Professionnels',
      navLogin: 'Connexion',
      navRegister: "S'inscrire",
      heroTag: 'Plateforme N°1 d’Échange de Services Numériques au Cameroun',
      heroTitle: 'Connectez-vous avec des Professionnels et Experts Locaux de Confiance',
      heroSubtitle: 'Ingénieurs logiciels, bâtisseurs, graphistes ou artisans. Embauchez des talents vérifiés ou proposez vos services partout au Cameroun.',
      exploreBtn: 'Explorer les Professionnels',
      registerProBtn: 'S’inscrire en tant que Pro',

      // Services Page
      servicesTitle: 'Découvrez des Professionnels Vérifiés',
      servicesSubtitle: 'Parcourez les meilleurs talents au Cameroun. Consultez les portfolios, avis vérifiés et contactez-les directement.',
      searchPlaceholder: 'Rechercher par nom, compétence ou ville (ex: Buea, Douala)...',
      allCategories: 'Toutes les Catégories',
      hourlyRateLabel: 'Tarifs',
      contactBtn: 'Demander un Devis / Discuter',
      reviewsLabel: 'Avis',

      // Login Page
      loginBadge: 'Connexion Sécurisée',
      loginTitle: 'Bon Retour',
      loginSubtitle: 'Accédez à votre tableau de bord, gérez vos requêtes et développez votre activité.',
      emailLabel: 'Adresse E-mail',
      passwordLabel: 'Mot de passe',
      signInBtn: 'Se Connecter',
      noAccount: "Vous n'avez pas de compte ?",
      registerLink: 'Inscrivez-vous ici',

      // Register Page
      secureBadge: 'Authentification & Inscription Sécurisées',
      titlePro: "S'inscrire en tant que Professionnel",
      titleClient: "S'inscrire en tant que Client",
      regSubtitle: 'Créez un compte avec un mot de passe sécurisé pour commencer.',
      tabPro: 'Je suis un Professionnel',
      tabClient: 'Je suis un Client',
      nameLabel: 'Nom Complet / Nom de l’Entreprise',
      locationLabel: 'Localisation / Ville',
      phoneLabel: 'Numéro de Téléphone',
      categoryLabel: 'Spécialité Principale / Catégorie',
      submitBtn: "Terminer l'Inscription",
      hasAccount: 'Vous avez déjà un compte ?',

      // Dashboard Page
      dashBadge: 'Tableau de bord Client',
      dashTitle: 'Mes Demandes de Projet',
      dashSubtitle: 'Suivez vos demandes de devis soumises et vos échanges avec les professionnels.',
      dashLoading: 'Chargement de vos demandes de projet...',
      dashFor: 'Pour',
      dashTimeline: 'Délai',
      dashSubmitted: 'Soumis',
      dashAwaiting: 'En attente de réponse',
      dashNoRequests: 'Aucune Demande de Projet Trouvée',
      dashNoRequestsDesc: "Vous n'avez pas encore envoyé de demande de devis aux professionnels. Explorez notre annuaire et contactez des experts vérifiés.",

      // Footer
      footerConnectBuild: 'Connecter et Construire',
      forClients: 'Pour les Clients',
      forClientsDesc: 'Trouvez des professionnels de confiance rapidement.',
      forProfessionals: 'Pour les Professionnels',
      forProfessionalsDesc: 'Trouvez des missions et développez votre activité.',
      footerTagline: 'De votre besoin au travail réel !',

      // AddReviewModal
      reviewSubtitle: 'Partagez votre expérience pour renforcer la confiance et la réputation.',
      yourNameLabel: 'Votre Nom',
      ratingLabel: 'Évaluation (1 à 5 Étoiles)',
      reviewCommentLabel: "Commentaire de l'avis",
      postReviewBtn: "Publier l'avis",

      // RequestQuoteModal
      requestQuotationBadge: 'Demande de devis',
      projectTitleLabel: 'Titre du projet',
      projectDescLabel: 'Description et portée du projet',
      estimatedBudgetLabel: 'Budget estimé (XAF)',
      expectedTimelineLabel: 'Délai estimé',
      cancelBtn: 'Annuler',
      sendRequestBtn: 'Envoyer la demande',
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: t[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);