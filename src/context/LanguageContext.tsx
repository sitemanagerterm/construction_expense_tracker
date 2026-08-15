"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'EN' | 'HI' | 'TA';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  EN: {
    'nav.home': 'Home',
    'nav.howItWorks': 'How it Works',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.login': 'Log in',
    'nav.startTrial': 'Start Free Trial',
    'hero.badge': 'The #1 Ledger for construction business',
    'hero.title1': 'Track Every Rupee.',
    'hero.title2.secure': 'Manage Every Worker.',
    'hero.title2.margins': 'Control Every Site.',
    'hero.subtitle': 'Expense tracking, labor attendance, receipt scanning, and project reporting built specifically for construction businesses.',
    'hero.btnTrial': 'Start Free Trial',
    'hero.btnWorks': 'Watch Demo',
    'hero.social': 'Trusted by 500+ Contractors across India',
  },
  HI: {
    'nav.home': 'होम',
    'nav.howItWorks': 'यह कैसे काम करता है',
    'nav.pricing': 'कीमत',
    'nav.contact': 'संपर्क करें',
    'nav.login': 'लॉग इन करें',
    'nav.startTrial': 'मुफ़्त ट्रायल शुरू करें',
    'hero.badge': 'भारतीय ठेकेदारों के लिए नंबर 1 लेजर',
    'hero.title1': 'हर रुपये का हिसाब रखें।',
    'hero.title2.secure': 'अपना मुनाफा',
    'hero.title2.margins': 'सुरक्षित करें।',
    'hero.subtitle': 'निर्माण स्थल के लिए बना पेशेवर लेजर। आपके कर्मचारी वॉयस या कैमरे से तुरंत खर्च दर्ज करते हैं। आप रियल-टाइम में मुनाफा देखते हैं।',
    'hero.btnTrial': 'अपना 3 महीने का ट्रायल शुरू करें',
    'hero.btnWorks': 'देखें यह कैसे काम करता है',
    'hero.social': 'पूरे भारत में 500+ ठेकेदारों का भरोसा',
  },
  TA: {
    'nav.home': 'முகப்பு',
    'nav.howItWorks': 'இது எப்படி வேலை செய்கிறது',
    'nav.pricing': 'விலை',
    'nav.contact': 'தொடர்பு கொள்ள',
    'nav.login': 'உள்நுழைய',
    'nav.startTrial': 'இலவச சோதனையைத் தொடங்கு',
    'hero.badge': 'இந்திய ஒப்பந்ததாரர்களுக்கான நம்பர் 1 லெட்ஜர்',
    'hero.title1': 'ஒவ்வொரு ரூபாயையும் கண்காணிக்கவும்.',
    'hero.title2.secure': 'உங்கள் லாபத்தை',
    'hero.title2.margins': 'பாதுகாக்கவும்.',
    'hero.subtitle': 'கட்டுமான தளத்திற்காக உருவாக்கப்பட்ட தொழில்முறை லெட்ஜர். உங்கள் பணியாளர்கள் குரல் அல்லது கேமரா மூலம் உடனடியாக செலவுகளைப் பதிவு செய்கிறார்கள். நீங்கள் லாபத்தை நேரலையில் பார்க்கிறீர்கள்.',
    'hero.btnTrial': 'உங்கள் 3 மாத சோதனையைத் தொடங்கவும்',
    'hero.btnWorks': 'எப்படி வேலை செய்கிறது என்று பாருங்கள்',
    'hero.social': 'இந்தியா முழுவதும் 500+ ஒப்பந்ததாரர்களால் நம்பப்படுகிறது',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN');

  useEffect(() => {
    const savedLang = localStorage.getItem('site_language') as Language;
    if (savedLang && ['EN', 'HI', 'TA'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('site_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['EN']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
