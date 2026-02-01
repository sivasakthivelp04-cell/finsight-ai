import React from 'react';
import Sidebar from './Sidebar';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, Menu } from 'lucide-react';

const Layout = ({ children }) => {
    const { language, toggleLanguage, t } = useLanguage();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                <div className="p-4 md:p-8">
                    <header className="flex justify-between items-center mb-6 md:mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                <Menu size={24} />
                            </button>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-slate-800">{t('welcome')}, User</h2>
                                <p className="text-slate-500 text-xs md:text-sm">FinSight AI Platform</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-slate-200"
                            >
                                <Globe size={16} className="text-slate-600 md:w-[18px] md:h-[18px]" />
                                <span className="font-medium text-slate-700 text-sm md:text-base">
                                    {language === 'en' ? 'English' : 'हिंदी'}
                                </span>
                            </button>
                            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-500"></div>
                        </div>
                    </header>
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;
