
import React, { useState, useEffect } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import { Building2, Mail, Phone, MapPin, FileText, Save, CheckCircle } from 'lucide-react';
import axios from 'axios';

import API_BASE_URL from '../apiConfig';

const Settings = () => {
    const [company, setCompany] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        industry: '',
        tax_id: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const currentLang = localStorage.getItem('finsight_lang') || 'hi';

    const t = {
        en: {
            title: "Company Settings",
            sub: "Manage your company information and preferences",
            heading: "Company Information",
            name: "Company Name *",
            email: "Email Address *",
            phone: "Phone Number",
            industry: "Industry",
            tax: "Tax ID / GST Number",
            address: "Business Address",
            save: "Save Changes",
            saving: "Saving...",
            success: "Settings saved successfully!",
            note: "Note: Your company information will be used in generated reports and analysis.",
            loading: "Loading settings...",
            placeholderName: "Enter company name",
            placeholderEmail: "company@example.com",
            placeholderPhone: "+1 (555) 000-0000",
            placeholderTax: "Enter Tax ID or GST Number",
            placeholderAddress: "Enter complete business address",
            selectIndustry: "Select Industry",
            industries: {
                Manufacturing: "Manufacturing",
                Retail: "Retail",
                Services: "Services",
                Technology: "Technology",
                Healthcare: "Healthcare",
                Finance: "Finance",
                Education: "Education",
                Agriculture: "Agriculture",
                Logistics: "Logistics",
                "E-commerce": "E-commerce",
                Other: "Other"
            }
        },
        hi: {
            title: "कंपनी सेटिंग्स",
            sub: "अपनी कंपनी की जानकारी और प्राथमिकताओं को प्रबंधित करें",
            heading: "कंपनी की जानकारी",
            name: "कंपनी का नाम *",
            email: "ईमेल पता *",
            phone: "फोन नंबर",
            industry: "उद्योग",
            tax: "टैक्स आईडी / जीएसटी नंबर",
            address: "व्यावसायिक पता",
            save: "परिवर्तन सहेजें",
            saving: "सहेज रहा है...",
            success: "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
            note: "नोट: आपकी कंपनी की जानकारी का उपयोग जेनरेट की गई रिपोर्ट और विश्लेषण में किया जाएगा।",
            loading: "सेटिंग्स लोड हो रही हैं...",
            placeholderName: "कंपनी का नाम दर्ज करें",
            placeholderEmail: "company@example.com",
            placeholderPhone: "+91 (000) 000-0000",
            placeholderTax: "टैक्स आईडी या जीएसटी नंबर दर्ज करें",
            placeholderAddress: "पूरा व्यावसायिक पता दर्ज करें",
            selectIndustry: "उद्योग चुनें",
            industries: {
                Manufacturing: "विनिर्माण",
                Retail: "खुदरा",
                Services: "सेवाएं",
                Technology: "प्रौद्योगिकी",
                Healthcare: "स्वास्थ्य सेवा",
                Finance: "वित्त",
                Education: "शिक्षा",
                Agriculture: "कृषि",
                Logistics: "रसद",
                "E-commerce": "ई-कॉमर्स",
                Other: "अन्य"
            }
        }
    }[currentLang];

    useEffect(() => {
        fetchCompanySettings();
    }, []);

    const fetchCompanySettings = async () => {
        try {
            const companyId = localStorage.getItem('company_id');
            const response = await axios.get(`${API_BASE_URL}/company/`, {
                params: { id: companyId }
            });
            setCompany(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching company settings:', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompany(prev => ({
            ...prev,
            [name]: value
        }));
        setSaved(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const companyId = localStorage.getItem('company_id');
            await axios.put(`${API_BASE_URL}/company/`, company, {
                params: { id: companyId }
            });
            localStorage.setItem('finsight_industry', company.industry || 'General');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Error saving company settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <BaseLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="text-slate-400">{t.loading}</div>
                </div>
            </BaseLayout>
        );
    }

    return (
        <BaseLayout>
            <div className="max-w-4xl mx-auto text-slate-100">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold">{t.title}</h2>
                    <p className="text-slate-400 mt-1">{t.sub}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Information Card */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Building2 size={24} className="text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-semibold">{t.heading}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Company Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    {t.name}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={company.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    placeholder={t.placeholderName}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                    <Mail size={16} /> {t.email}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={company.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    placeholder={t.placeholderEmail}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                    <Phone size={16} /> {t.phone}
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={company.phone || ''}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    placeholder={t.placeholderPhone}
                                />
                            </div>

                            {/* Industry */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    {t.industry}
                                </label>
                                <select
                                    name="industry"
                                    value={company.industry || ''}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                >
                                    <option value="">{t.selectIndustry}</option>
                                    <option value="Manufacturing">{t.industries.Manufacturing}</option>
                                    <option value="Retail">{t.industries.Retail}</option>
                                    <option value="Services">{t.industries.Services}</option>
                                    <option value="Technology">{t.industries.Technology}</option>
                                    <option value="Healthcare">{t.industries.Healthcare}</option>
                                    <option value="Finance">{t.industries.Finance}</option>
                                    <option value="Education">{t.industries.Education}</option>
                                    <option value="Agriculture">{t.industries.Agriculture}</option>
                                    <option value="Logistics">{t.industries.Logistics}</option>
                                    <option value="E-commerce">{t.industries["E-commerce"]}</option>
                                    <option value="Other">{t.industries.Other}</option>
                                </select>
                            </div>

                            {/* Tax ID */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                    <FileText size={16} /> {t.tax}
                                </label>
                                <input
                                    type="text"
                                    name="tax_id"
                                    value={company.tax_id || ''}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    placeholder={t.placeholderTax}
                                />
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                    <MapPin size={16} /> {t.address}
                                </label>
                                <textarea
                                    name="address"
                                    value={company.address || ''}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                                    placeholder={t.placeholderAddress}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end gap-4">
                        {saved && (
                            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-lg">
                                <CheckCircle size={20} />
                                <span>{t.success}</span>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    {t.saving}
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    {t.save}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Info Box */}
                <div className="mt-6 bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                    <p className="text-sm text-blue-300">
                        {t.note}
                    </p>
                </div>
            </div>
        </BaseLayout>
    );
};

export default Settings;
