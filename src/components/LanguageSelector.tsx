"use client";

import { useState, useRef, useEffect } from "react";
import { FaLanguage, FaChevronDown } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

const languages = [
  { code: 'EN', name: 'English', nativeName: 'English' },
  { code: 'HI', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'TA', name: 'Tamil', nativeName: 'தமிழ்' }
] as const;

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: 'EN' | 'HI' | 'TA') => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex items-center justify-center w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-bold text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <FaLanguage className="mr-2 text-primary-500 text-lg" />
        {language}
        <FaChevronDown className={`ml-2 text-xs text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-xl shadow-gray-200/50 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`flex w-full items-center px-4 py-3 text-sm transition-colors ${
                  language === lang.code 
                    ? 'bg-primary-50 text-primary-700 font-bold' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                }`}
                role="menuitem"
                onClick={() => handleSelect(lang.code)}
              >
                <div className="flex flex-col items-start">
                  <span>{lang.nativeName}</span>
                  <span className="text-xs text-gray-400 font-normal">{lang.name}</span>
                </div>
                {language === lang.code && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary-500"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
