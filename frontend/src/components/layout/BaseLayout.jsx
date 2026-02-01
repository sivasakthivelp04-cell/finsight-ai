import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Globe, Menu } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const BaseLayout = ({ children }) => {
    const { language, toggleLanguage } = useLanguage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const t = {
        en: { title: 'FinSight AI Platform' },
        hi: { title: 'FinSight AI प्लेटफार्म' }
    }[language];

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between px-4 md:px-8 z-10 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-slate-400 text-sm font-medium truncate">{t.title}</h2>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {/* Language Toggle */}
                        <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
                            <button
                                onClick={toggleLanguage}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${language === 'en' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                ENG
                            </button>
                            <button
                                onClick={toggleLanguage}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${language === 'hi' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                HIN
                            </button>
                        </div>

                        <div className="hidden md:flex items-center gap-4 text-slate-400">
                            <div className="flex items-center gap-2">
                                <Globe size={18} />
                                <span className="text-xs uppercase font-bold text-slate-300">{language}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default BaseLayout;
