
import React, { useState, useEffect } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import {
    TrendingUp, AlertTriangle, DollarSign, Activity,
    ArrowUpRight, ArrowDownRight, Upload, Download,
    Share2, Info
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import API_BASE_URL from '../apiConfig';

const Dashboard = () => {
    // SME Financial Intelligence Dashboard
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentLang, setCurrentLang] = useState(localStorage.getItem('finsight_lang') || 'hi');

    useEffect(() => {
        const handleStorageChange = () => {
            setCurrentLang(localStorage.getItem('finsight_lang') || 'hi');
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const t = {
        en: {
            title: "Financial Health Dashboard",
            sub: "AI-powered analysis of your business performance",
            upload: "Upload New Data",
            summary: "Executive Intelligence Summary",
            forecast: "Forecast",
            health: "Health Score",
            revenue: "Total Revenue",
            profit: "Net Profit",
            totalExpenses: "Total Expenses",
            expenseRatio: "Expense Ratio",
            ar: "Accounts Receivable",
            ap: "Accounts Payable",
            inventory: "Inventory Value",
            debt: "Total Debt",
            benchmarks: "Industry Benchmarks",
            risks: "AI Risk Watch",
            loading: "Loading Dashboard...",
            noData: "No Financial Data Yet",
            noDataSub: "Upload your financial documents to see AI-powered insights and analysis",
            revenueVsExpenses: "Revenue vs Expenses",
            expenseBreakdown: "Expense Breakdown",
            rev: "Revenue",
            exp: "Expenses",
            outperforming: "Outperforming",
            belowAvg: "Below Avg",
            you: "You",
            industryAvg: "Industry Avg",
            topExpenses: "Top Expense Categories",
            generating: "Generating...",
            noSummary: "Summary not available."
        },
        hi: {
            title: "वित्तीय स्वास्थ्य डैशबोर्ड",
            sub: "आपके व्यावसायिक प्रदर्शन का एआई-संचालित विश्लेषण",
            upload: "नया डेटा अपलोड करें",
            export: "पीडीएफ एक्सपोर्ट",
            summary: "कार्यकारी खुफिया सारांश",
            forecast: "पूर्वानुमान",
            health: "स्वास्थ्य स्कोर",
            revenue: "कुल राजस्व",
            profit: "शुद्ध लाभ",
            totalExpenses: "कुल व्यय",
            expenseRatio: "व्यय अनुपात",
            ar: "प्राप्य खाते (AR)",
            ap: "देय खाते (AP)",
            inventory: "इन्वेंटरी मूल्य",
            debt: "कुल ऋण",
            benchmarks: "उद्योग बेंचमार्क",
            risks: "एआई जोखिम निगरानी",
            loading: "डैशबोर्ड लोड हो रहा है...",
            noData: "अभी तक कोई वित्तीय डेटा नहीं है",
            noDataSub: "एआई-संचालित अंतर्दृष्टि और विश्लेषण देखने के लिए अपने वित्तीय दस्तावेज़ अपलोड करें",
            revenueVsExpenses: "राजस्व बनाम व्यय",
            expenseBreakdown: "व्यय विवरण",
            rev: "राजस्व",
            exp: "व्यय",
            outperforming: "बेहतर प्रदर्शन",
            belowAvg: "औसत से नीचे",
            you: "आप",
            industryAvg: "उद्योग औसत",
            topExpenses: "शीर्ष व्यय श्रेणियां",
            generating: "जेनरेट हो रहा है...",
            noSummary: "सारांश उपलब्ध नहीं है।"
        }
    }[currentLang];

    useEffect(() => {
        let isMounted = true;

        const fetchDashboardData = async () => {
            const companyId = localStorage.getItem('company_id');
            // Check if this is the first entry/refresh of this session
            const needsClear = sessionStorage.getItem('needs_dashboard_clear') === 'true';

            try {
                if (needsClear) {
                    console.log("REFRESH ACTION: Clearing dashboard once as requested.");
                    // Mark as done so navigation later doesn't trigger it again
                    sessionStorage.setItem('needs_dashboard_clear', 'false');

                    await axios.post(`${API_BASE_URL}/financial/dashboard/clear`, null, {
                        params: { id: companyId }
                    });
                }

                const response = await axios.get(`${API_BASE_URL}/financial/dashboard`, {
                    params: { lang: currentLang, id: companyId }
                });
                if (!isMounted) return;

                if (!response.data || !response.data.has_data) {
                    setData(null);
                    setLoading(false);
                    return;
                }

                const { financial_data = {}, ai_analysis = {} } = response.data;

                setData({
                    reportId: response.data.report_id,
                    score: ai_analysis.health_score ?? 0,
                    status: ai_analysis.status ?? 'Unknown',
                    revenue: financial_data.total_revenue || 0,
                    expenses: financial_data.total_expenses || 0,
                    profit: financial_data.net_profit || 0,
                    margin: financial_data.profit_margin || 0,
                    expenseRatio: financial_data.expense_ratio || 0,
                    risks: ai_analysis.risks || [],
                    recommendations: ai_analysis.recommendations || [],
                    summary: ai_analysis.summary || 'No summary available',
                    forecast: ai_analysis.forecast_narrative || '',
                    forecastData: ai_analysis.forecast_data || [],
                    benchmarks: ai_analysis.industry_benchmarks || {},
                    categories: financial_data.categories || {},
                    topExpenses: financial_data.top_expenses || [],
                    monthlyBreakdown: financial_data.monthly_breakdown || [],
                    accountsReceivable: financial_data.accounts_receivable || 0,
                    accountsPayable: financial_data.accounts_payable || 0,
                    totalDebt: financial_data.total_debt || 0,
                    inventoryValue: financial_data.inventory_value || 0,
                    ai_analysis: ai_analysis // Store full analysis for secondary sections
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                if (isMounted) {
                    setData(null);
                    setLoading(false);
                }
            }
        };

        fetchDashboardData();
        return () => { isMounted = false; };
    }, []); // Only fetch on mount

    useEffect(() => {
        if (data) {
            setLoading(true);
            const companyId = localStorage.getItem('company_id');
            axios.get(`${API_BASE_URL}/financial/dashboard`, {
                params: { lang: currentLang, id: companyId }
            }).then(response => {
                if (response.data && response.data.has_data) {
                    const { financial_data = {}, ai_analysis = {} } = response.data;
                    setData(prev => ({
                        ...prev,
                        reportId: response.data.report_id,
                        summary: ai_analysis.summary,
                        status: ai_analysis.status,
                        risks: ai_analysis.risks,
                        recommendations: ai_analysis.recommendations,
                        forecast: ai_analysis.forecast_narrative,
                        ai_analysis: ai_analysis
                    }));
                }
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [currentLang]);





    if (loading) return (
        <BaseLayout>
            <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p>{t.loading}</p>
                </div>
            </div>
        </BaseLayout>
    );

    if (!data) return (
        <BaseLayout>
            <div className="flex items-center justify-center h-full text-center">
                <div className="max-w-md">
                    <Upload size={64} className="text-slate-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-100 mb-2">{t.noData}</h2>
                    <p className="text-slate-400 mb-6">{t.noDataSub}</p>
                    <button onClick={() => navigate('/upload')} className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-lg text-white font-semibold">{t.upload}</button>
                </div>
            </div>
        </BaseLayout>
    );

    const expenseChartData = (data.topExpenses || []).map(exp => ({ name: exp.category, value: exp.amount }));

    return (
        <BaseLayout>
            <div className="space-y-6 text-slate-100 pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-bold">{t.title}</h2>
                        <p className="text-slate-400 mt-1">{t.sub}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={async () => {
                                if (!data.reportId) {
                                    alert('No report available for download');
                                    return;
                                }
                                window.open(`${API_BASE_URL}/financial/reports/${data.reportId}/download`, '_blank');
                            }}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                            <Download size={16} />
                            {currentLang === 'hi' ? 'एक्सपोर्ट' : 'Export'}
                        </button>
                        <button onClick={() => navigate('/upload')} className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">{t.upload}</button>
                    </div>
                </div>

                {/* AI Summary */}
                <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 p-6 rounded-xl border border-emerald-500/30">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-emerald-400">
                        <Activity size={20} />
                        {t.summary}
                    </h3>
                    <p className="text-slate-200 text-lg leading-relaxed">{data.summary || t.noSummary}</p>
                    {data.forecast && (
                        <div className="mt-4 p-3 bg-slate-900/40 rounded-lg flex items-center gap-3 border border-slate-800">
                            <TrendingUp className="text-blue-400" size={18} />
                            <p className="text-blue-300 text-sm font-medium">{data.forecast}</p>
                        </div>
                    )}
                </div>

                {/* Top KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{t.health || 'Health Score'}</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className={`text-3xl font-bold ${(data.score || 0) >= 80 ? 'text-emerald-400' : (data.score || 0) >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                                {data.score || 0}
                            </span>
                            <span className="text-xs text-slate-500">/100</span>
                        </div>
                        <div className={`text-[10px] mt-2 font-bold px-2 py-0.5 rounded-full inline-block ${(data.score || 0) >= 80 ? 'bg-emerald-500/20 text-emerald-400' : (data.score || 0) >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {currentLang === 'hi' ? (
                                data.status === 'Healthy' ? 'स्वस्थ' :
                                    data.status === 'At Risk' ? 'जोखिम में' :
                                        data.status === 'Critical' ? 'गंभीर' :
                                            data.status
                            ) : data.status || 'N/A'}
                        </div>
                    </div>

                    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 relative group hover:border-cyan-500/50 transition-colors">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{currentLang === 'hi' ? 'क्रेडिट योग्यता' : 'Creditworthiness'}</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-bold text-cyan-400">{data.ai_analysis?.creditworthiness_score || 0}</span>
                            <span className="text-xs text-slate-500">/100</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 truncate">{data.ai_analysis?.creditworthiness_rationale || (currentLang === 'hi' ? 'स्थिर' : 'Stable')}</p>
                    </div>

                    {[
                        { label: t.revenue, val: `$${((data.revenue || 0) / 1000).toFixed(1)}k`, color: 'text-white' },
                        { label: t.totalExpenses, val: `$${((data.expenses || 0) / 1000).toFixed(1)}k`, color: 'text-rose-400' },
                        { label: t.profit, val: `$${((data.profit || 0) / 1000).toFixed(1)}k`, color: (data.profit || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400' },
                    ].map((kpi, i) => (
                        <div key={i} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{kpi.label}</p>
                            <div className={`mt-2 text-2xl font-bold ${kpi.color}`}>{kpi.val}</div>
                        </div>
                    ))}
                </div>

                {/* Secondary KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: t.inventory, val: `$${((data.inventoryValue || 0) / 1000).toFixed(1)}k`, sub: currentLang === 'hi' ? 'स्टॉक' : 'Stock' },
                        { label: t.debt, val: `$${((data.totalDebt || 0) / 1000).toFixed(1)}k`, sub: currentLang === 'hi' ? 'ऋण' : 'Debt' }
                    ].map((kpi, i) => (
                        <div key={i} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                            <div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{kpi.label}</p>
                                <p className="text-xl font-bold text-slate-200 mt-1">{kpi.val}</p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-800 px-2 py-1 rounded uppercase">{kpi.sub}</span>
                        </div>
                    ))}
                </div>

                {/* Working Capital Intelligence */}
                {data.ai_analysis?.working_capital_analysis && (
                    <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center gap-4 ${data.ai_analysis.working_capital_analysis.status === 'Critical' ? 'bg-rose-500/10 border-rose-500/30' : data.ai_analysis.working_capital_analysis.status === 'Warning' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                        <div className={`p-3 rounded-full ${data.ai_analysis.working_capital_analysis.status === 'Critical' ? 'bg-rose-500/20 text-rose-400' : data.ai_analysis.working_capital_analysis.status === 'Warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">
                                {currentLang === 'hi' ? 'कार्यशील पूंजी खुफिया' : 'Working Capital Intelligence'}
                            </h4>
                            <p className="text-slate-100 text-lg mt-1 font-medium">
                                "{data.ai_analysis.working_capital_analysis.message}"
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${data.ai_analysis.working_capital_analysis.status === 'Critical' ? 'bg-rose-600 text-white' : data.ai_analysis.working_capital_analysis.status === 'Warning' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'}`}>
                                {data.ai_analysis.working_capital_analysis.status}
                            </span>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cost Optimization */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-lg font-semibold mb-4 text-emerald-400 flex items-center gap-2">
                            <TrendingUp size={18} />
                            {currentLang === 'hi' ? 'लागत अनुकूलन' : 'Cost Optimization'}
                        </h3>
                        <div className="space-y-4">
                            {(data.ai_analysis?.cost_optimization || []).map((opt, i) => (
                                <div key={i} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                                    <p className="text-sm font-bold text-white">{opt.area}</p>
                                    <p className="text-xs text-slate-400 mt-1">{opt.suggestion}</p>
                                    <p className="text-[10px] text-emerald-500 font-bold mt-2 uppercase">{currentLang === 'hi' ? 'बचत' : 'Potential'}: {opt.savings_potential}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Financial Products */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2">
                            <DollarSign size={18} />
                            {currentLang === 'hi' ? 'वित्तीय उत्पाद' : 'Financial Products'}
                        </h3>
                        <div className="space-y-4">
                            {(data.ai_analysis?.financial_products || []).map((prod, i) => (
                                <div key={i} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                                    <p className="text-sm font-bold text-white">{prod.product}</p>
                                    <p className="text-[10px] text-cyan-500 font-bold uppercase">{prod.provider_type}</p>
                                    <p className="text-xs text-slate-400 mt-1">{prod.rationale}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tax & Bookkeeping */}
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-lg font-semibold mb-4 text-amber-400 flex items-center gap-2">
                            <Info size={18} />
                            {currentLang === 'hi' ? 'टैक्स और बुककीपिंग' : 'Tax & Bookkeeping'}
                        </h3>
                        {data.ai_analysis?.bookkeeping_tax_compliance && (
                            <div className="space-y-3">
                                <div className="p-3 bg-slate-900/50 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase font-bold">{currentLang === 'hi' ? 'बुककीपिंग स्थिति' : 'Bookkeeping Status'}</p>
                                    <p className="text-sm text-slate-200">{data.ai_analysis.bookkeeping_tax_compliance.bookkeeping_status}</p>
                                </div>
                                <div className="p-3 bg-slate-900/50 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase font-bold">{currentLang === 'hi' ? 'टैक्स अंतर्दृष्टि' : 'Tax Insights'}</p>
                                    <p className="text-sm text-slate-200">{data.ai_analysis.bookkeeping_tax_compliance.tax_insights}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(data.ai_analysis.bookkeeping_tax_compliance.compliance_watch || []).map((tag, i) => (
                                        <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-300 text-[10px] rounded-full border border-slate-600">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Benchmarks & Analysis */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Share2 size={20} className="text-cyan-400" />
                                {t.benchmarks}
                            </h3>
                            <Info size={16} className="text-slate-500" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { key: currentLang === 'hi' ? 'लाभ मार्जिन' : 'Profit Margin', user: data.margin || 0, avg: data.benchmarks?.profit_margin_avg || 0, unit: '%' },
                                { key: currentLang === 'hi' ? 'व्यय अनुपात' : 'Expense Ratio', user: data.expenseRatio || 0, avg: data.benchmarks?.expense_ratio_avg || 0, unit: '%' },
                                { key: currentLang === 'hi' ? 'राजस्व वृद्धि' : 'Revenue Growth', user: 15, avg: data.benchmarks?.revenue_growth_avg || 0, unit: '%' }
                            ].map((item) => (
                                <div key={item.key} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-300">{item.key}</span>
                                        <span className={`font-bold ${(item.user || 0) >= (item.avg || 0) ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {(item.user || 0) >= (item.avg || 0) ? t.outperforming : t.belowAvg}
                                        </span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-emerald-500" style={{ width: `${((item.user || 0) / (Math.max(1, (item.user || 0) + (item.avg || 0)))) * 100}%` }}></div>
                                        <div className="h-full bg-slate-600" style={{ width: `${((item.avg || 0) / (Math.max(1, (item.user || 0) + (item.avg || 0)))) * 100}%` }}></div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">{t.you}</span>
                                            <span className="text-2xl font-bold text-white">{(item.user || 0).toFixed(1)}{item.unit}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">{t.industryAvg}</span>
                                            <span className="text-base font-bold text-slate-400">{(item.avg || 0).toFixed(1)}{item.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Grid: Charts & Risks */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
                        <h3 className="text-lg font-semibold mb-6">{t.topExpenses}</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={expenseChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                    <YAxis stroke="#94a3b8" fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 overflow-y-auto">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <AlertTriangle size={20} className="text-amber-400" />
                            {t.risks}
                        </h3>
                        <div className="space-y-4">
                            {(data.risks || []).map((risk, idx) => (
                                <div key={idx} className="p-4 bg-slate-900/50 rounded-lg border-l-4 border-amber-500">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-semibold text-white uppercase tracking-tight">
                                            {currentLang === 'hi' ? (risk.type === 'Financial' ? 'वित्तीय' : risk.type === 'Operational' ? 'परिचालन' : 'जोखिम') : (risk.type || 'Risk')}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${risk.severity === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            {currentLang === 'hi' ? (risk.severity === 'High' ? 'उच्च' : risk.severity === 'Medium' ? 'मध्यम' : 'निम्न') : (risk.severity || 'Medium')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400">{risk.message || (currentLang === 'hi' ? 'विवरण उपलब्ध नहीं है।' : 'Details not available.')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
};

export default Dashboard;
