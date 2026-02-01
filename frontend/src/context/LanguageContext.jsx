import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('finsight_lang') || 'en';
    });

    const toggleLanguage = () => {
        setLanguage((prev) => {
            const newLang = prev === 'en' ? 'hi' : 'en';
            localStorage.setItem('finsight_lang', newLang);
            return newLang;
        });
    };

    const t = (key) => {
        // Very simple dictionary for the demo
        const dictionary = {
            'dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
            'upload_data': { en: 'Upload Data', hi: 'डेटा अपलोड करें' },
            'reports': { en: 'Reports', hi: 'रिपोर्ट' },
            'financial_health': { en: 'Financial Health Score', hi: 'वित्तीय स्वास्थ्य स्कोर' },
            'risk_analysis': { en: 'Risk Analysis', hi: 'जोखिम विश्लेषण' },
            'net_profit': { en: 'Net Profit', hi: 'शुद्ध लाभ' },
            'revenue': { en: 'Revenue', hi: 'आय' },
            'expenses': { en: 'Expenses', hi: 'खर्च' },
            'welcome': { en: 'Welcome back', hi: 'वापसी पर स्वागत है' },
            'upload_desc': { en: 'Upload your financial documents (CSV, PDF) to get AI insights.', hi: 'एआई अंतर्दृष्टि प्राप्त करने के लिए अपने वित्तीय दस्तावेज (सीएसवी, पीडीएफ) अपलोड करें।' },
            'analyze_btn': { en: 'Analyze Now', hi: 'अभी विश्लेषण करें' },
        };

        return dictionary[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
