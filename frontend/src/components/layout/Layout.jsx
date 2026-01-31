import React from 'react';
import Sidebar from './Sidebar';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

const Layout = ({ children }) => {
    const { language, toggleLanguage, t } = useLanguage();

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <div className="ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{t('welcome')}, User</h2>
                        <p className="text-slate-500 text-sm">FinSight AI Platform</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-slate-200"
                        >
                            <Globe size={18} className="text-slate-600" />
                            <span className="font-medium text-slate-700">
                                {language === 'en' ? 'English' : 'हिंदी'}
                            </span>
                        </button>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500"></div>
                    </div>
                </header>
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
