
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Globe, Bell } from 'lucide-react';
import axios from 'axios';

import API_BASE_URL from '../../apiConfig';

const BaseLayout = ({ children }) => {
    // Default to 'en' on refresh as requested
    const [lang, setLang] = useState('en');

    useEffect(() => {
        // Enforce English on mount/refresh
        localStorage.setItem('finsight_lang', 'en');
        window.dispatchEvent(new Event('storage'));
    }, []);

    const handleLangChange = (newLang) => {
        setLang(newLang);
        localStorage.setItem('finsight_lang', newLang);
        // Notify other windows/components that language has changed
        window.dispatchEvent(new Event('storage'));
    };

    const t = {
        en: { title: 'FinSight AI Platform' },
        hi: { title: 'FinSight AI प्लेटफार्म' }
    }[lang];

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between px-8 z-10 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <h2 className="text-slate-400 text-sm font-medium">{t.title}</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Language Toggle */}
                        <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
                            <button
                                onClick={() => handleLangChange('en')}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${lang === 'en' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                ENG
                            </button>
                            <button
                                onClick={() => handleLangChange('hi')}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${lang === 'hi' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                HIN
                            </button>
                        </div>

                        <div className="flex items-center gap-4 text-slate-400">
                            <div className="flex items-center gap-2">
                                <Globe size={18} />
                                <span className="text-xs uppercase font-bold text-slate-300">{lang}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default BaseLayout;
