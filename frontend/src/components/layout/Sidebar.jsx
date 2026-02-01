
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Upload, FileText, Settings, Building2, LogOut, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';

import API_BASE_URL from '../../apiConfig';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const { language } = useLanguage();

    const currentLang = language;

    const t = {
        en: { dashboard: 'Dashboard', upload: 'Upload Data', reports: 'Reports', settings: 'Settings', sub: 'SME Financial Intelligence' },
        hi: { dashboard: 'डैशबोर्ड', upload: 'डेटा अपलोड', reports: 'रिपोर्ट्स', settings: 'सेटिंग्स', sub: 'SME वित्तीय इंटेलिजेंस' }
    }[currentLang];

    const navItems = [
        { name: t.dashboard, path: '/dashboard', icon: LayoutDashboard },
        { name: t.upload, path: '/upload', icon: Upload },
        { name: t.reports, path: '/reports', icon: FileText },
        { name: t.settings, path: '/settings', icon: Settings },
    ];

    useEffect(() => {
        fetchCompanyInfo();
    }, []);

    const fetchCompanyInfo = async () => {
        try {
            const companyId = localStorage.getItem('company_id');
            const companyName = localStorage.getItem('company_name');

            if (!companyId) {
                // Ideally don't redirect from sidebar, let protected route handle it, but keeping logic for now
                return;
            }

            if (companyName) {
                setCompany({ name: companyName, industry: 'General' });
            }

            const params = { id: companyId };
            const response = await axios.get(`${API_BASE_URL}/company/`, { params });
            setCompany(response.data);
            localStorage.setItem('company_name', response.data.name);
        } catch (error) {
            console.error('Error fetching company info:', error);
        }
    };

    const handleLogout = () => {
        if (window.confirm(currentLang === 'hi' ? 'क्या आप लॉग आउट करना चाहते हैं?' : 'Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('company_id');
            localStorage.removeItem('company_name');
            navigate('/');
        }
    };

    const getInitials = (name) => {
        if (!name) return 'FS';
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden glass"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white border-r border-slate-700 flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:h-screen
            `}>
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            FinSight AI
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">{t.sub}</p>
                    </div>

                    {/* Close Button (Mobile Only) */}
                    <button
                        onClick={onClose}
                        className="md:hidden text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => onClose && onClose()} // Close sidebar on navigate (mobile)
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-slate-800 text-emerald-400 border-l-4 border-emerald-400'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {company && (
                    <div className="p-4 border-t border-slate-700">
                        {company.name ? (
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center space-x-3 text-sm text-slate-400">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                                        {getInitials(company.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate w-24">{company.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{company.industry || 'General'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/settings" onClick={() => onClose && onClose()} className="flex items-center space-x-3 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
                                    <Settings size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium text-xs">{currentLang === 'hi' ? 'सेटिंग्स पूरी करें' : 'Complete Settings'}</p>
                                    <p className="text-xs text-slate-500">{currentLang === 'hi' ? 'कंपनी जानकारी जोड़ें' : 'Add company info'}</p>
                                </div>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Sidebar;
