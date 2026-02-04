
import React, { useState, useEffect, useMemo } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import {
    TrendingUp, AlertTriangle, DollarSign, Activity,
    ArrowUpRight, ArrowDownRight, Upload, Download,
    Share2, Info, LayoutDashboard, Database, Home,
    Filter, RefreshCw, X, Check, Search, ChevronDown, ChevronUp
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line, AreaChart, Area, Legend,
    PieChart, Pie, Cell, ScatterChart, Scatter
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useDropzone } from 'react-dropzone';

import API_BASE_URL from '../apiConfig';

const Dashboard = () => {
    const { language } = useLanguage();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard'); // home, dashboard, dataset
    const navigate = useNavigate();
    const currentLang = language;

    // Filter states
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [filters, setFilters] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

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
        const hasReset = sessionStorage.getItem('dash_reset');
        if (!hasReset) {
            fetchDashboardData();
        } else {
            setLoading(false);
            setData(null);
        }
    }, [currentLang]);

    const fetchDashboardData = async () => {
        setLoading(true);
        const companyId = localStorage.getItem('company_id');
        try {
            const response = await axios.get(`${API_BASE_URL}/financial/dashboard`, {
                params: { lang: currentLang, id: companyId }
            });

            if (response.data && response.data.has_data) {
                setData(response.data);
                if (response.data.financial_data?.generic_metadata?.column_info?.columns) {
                    setSelectedColumns(response.data.financial_data.generic_metadata.column_info.columns);
                }
            } else {
                setData(null);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setData(null);
        setFilters({});
        setSearchTerm('');
        sessionStorage.setItem('dash_reset', 'true');
    };

    const fileInputRef = React.useRef(null);

    const handleFileUpload = async (acceptedFiles) => {
        const file = acceptedFiles || fileInputRef.current?.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file instanceof File ? file : file); // Handle both drop and click
        const companyId = localStorage.getItem('company_id');

        try {
            setLoading(true);
            await axios.post(
                `${API_BASE_URL}/financial/upload?lang=${currentLang}&id=${companyId}`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            sessionStorage.removeItem('dash_reset');
            await fetchDashboardData();
        } catch (err) {
            console.error('Upload error:', err);
            alert('Failed to upload file');
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
        }
    };

    const onDrop = React.useCallback(acceptedFiles => {
        handleFileUpload(acceptedFiles);
    }, [currentLang]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.xls', '.xlsx'] },
        multiple: false,
        noClick: true
    });

    const filteredData = useMemo(() => {
        if (!data?.financial_data?.generic_metadata?.sample_data) return [];
        let result = data.financial_data.generic_metadata.sample_data;

        // Apply column selection
        result = result.map(row => {
            const newRow = {};
            selectedColumns.forEach(col => {
                newRow[col] = row[col];
            });
            return newRow;
        });

        // Apply filters
        Object.keys(filters).forEach(col => {
            const { min, max } = filters[col];
            if (min !== undefined && max !== undefined) {
                result = result.filter(row => row[col] >= min && row[col] <= max);
            }
        });

        // Apply search
        if (searchTerm) {
            result = result.filter(row =>
                Object.values(row).some(val =>
                    String(val).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        return result;
    }, [data, selectedColumns, filters, searchTerm]);

    const genericMetadata = data?.financial_data?.generic_metadata;
    const columnInfo = genericMetadata?.column_info;
    const stats = genericMetadata?.stats;
    const correlation = genericMetadata?.correlation;
    const finData = data?.financial_data;
    const aiAnalysis = data?.ai_analysis;

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

    const renderNoDataPrompt = () => (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
            <div className="max-w-md p-10 bg-slate-900/40 border border-slate-800 rounded-3xl backdrop-blur-xl">
                <div className="bg-slate-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload size={32} className="text-slate-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100 mb-3">{t.noData}</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">{t.noDataSub}</p>
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all ${isDragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 hover:border-emerald-500/50'}`}
                >
                    <p className="text-sm text-slate-300 font-medium">Click to <span className="text-emerald-400">upload</span> or drag & drop</p>
                </div>
            </div>
        </div>
    );

    const expenseChartData = (finData?.top_expenses || []).map(exp => ({ name: exp.category, value: exp.amount }));

    const renderDashboardContent = () => {
        if (!data) return renderNoDataPrompt();
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                {/* AI Summary */}
                <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 p-6 rounded-2xl border border-emerald-500/30">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-emerald-400">
                        <Activity size={20} />
                        {t.summary}
                    </h3>
                    <p className="text-slate-200 text-lg leading-relaxed">{aiAnalysis?.summary || t.noSummary}</p>
                    {aiAnalysis?.forecast_narrative && (
                        <div className="mt-4 p-3 bg-slate-900/40 rounded-lg flex items-center gap-3 border border-slate-800">
                            <TrendingUp className="text-blue-400" size={18} />
                            <p className="text-blue-300 text-sm font-medium">{aiAnalysis.forecast_narrative}</p>
                        </div>
                    )}
                </div>

                {/* Top KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{t.health}</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className={`text-3xl font-bold font-mono ${(aiAnalysis?.health_score || 0) >= 80 ? 'text-emerald-400' : (aiAnalysis?.health_score || 0) >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                                {aiAnalysis?.health_score || 0}
                            </span>
                            <span className="text-xs text-slate-500">/100</span>
                        </div>
                        <div className={`text-[10px] mt-2 font-bold px-2 py-0.5 rounded-full inline-block ${(aiAnalysis?.health_score || 0) >= 80 ? 'bg-emerald-500/20 text-emerald-400' : (aiAnalysis?.health_score || 0) >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {currentLang === 'hi' ? (
                                aiAnalysis?.status === 'Healthy' ? 'स्वस्थ' :
                                    aiAnalysis?.status === 'At Risk' ? 'जोखिम में' :
                                        aiAnalysis?.status === 'Critical' ? 'गंभीर' :
                                            aiAnalysis?.status
                            ) : aiAnalysis?.status || 'N/A'}
                        </div>
                    </div>

                    <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 relative group hover:border-cyan-500/50 transition-colors">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{currentLang === 'hi' ? 'क्रेडिट योग्यता' : 'Creditworthiness'}</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl font-bold text-cyan-400 font-mono">{aiAnalysis?.creditworthiness_score || 0}</span>
                            <span className="text-xs text-slate-500">/100</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 truncate">{aiAnalysis?.creditworthiness_rationale || (currentLang === 'hi' ? 'स्थिर' : 'Stable')}</p>
                    </div>

                    {[
                        { label: t.revenue, val: `$${((finData?.total_revenue || 0) / 1000).toFixed(1)}k`, color: 'text-white' },
                        { label: t.totalExpenses, val: `$${((finData?.total_expenses || 0) / 1000).toFixed(1)}k`, color: 'text-rose-400' },
                        { label: t.profit, val: `$${((finData?.net_profit || 0) / 1000).toFixed(1)}k`, color: (finData?.net_profit || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400' },
                    ].map((kpi, i) => (
                        <div key={i} className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{kpi.label}</p>
                            <div className={`mt-2 text-2xl font-bold font-mono ${kpi.color}`}>{kpi.val}</div>
                        </div>
                    ))}
                </div>

                {/* Working Capital Intelligence */}
                {aiAnalysis?.working_capital_analysis && (
                    <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center gap-4 ${aiAnalysis.working_capital_analysis.status === 'Critical' ? 'bg-rose-500/10 border-rose-500/30' : aiAnalysis.working_capital_analysis.status === 'Warning' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                        <div className={`p-3 rounded-full ${aiAnalysis.working_capital_analysis.status === 'Critical' ? 'bg-rose-500/20 text-rose-400' : aiAnalysis.working_capital_analysis.status === 'Warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">
                                {currentLang === 'hi' ? 'कार्यशील पूंजी खुफिया' : 'Working Capital Intelligence'}
                            </h4>
                            <p className="text-slate-100 text-lg mt-1 font-medium italic">
                                "{aiAnalysis.working_capital_analysis.message}"
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${aiAnalysis.working_capital_analysis.status === 'Critical' ? 'bg-rose-600 text-white' : aiAnalysis.working_capital_analysis.status === 'Warning' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'}`}>
                                {aiAnalysis.working_capital_analysis.status}
                            </span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cost Optimization */}
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                        <h3 className="text-lg font-semibold mb-4 text-emerald-400 flex items-center gap-2">
                            <TrendingUp size={18} />
                            {currentLang === 'hi' ? 'लागत अनुकूलन' : 'Cost Optimization'}
                        </h3>
                        <div className="space-y-4">
                            {(aiAnalysis?.cost_optimization || []).map((opt, i) => (
                                <div key={i} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                                    <p className="text-sm font-bold text-white">{opt.area}</p>
                                    <p className="text-xs text-slate-400 mt-1">{opt.suggestion}</p>
                                    <p className="text-[10px] text-emerald-500 font-bold mt-2 uppercase">{currentLang === 'hi' ? 'बचत' : 'Potential'}: {opt.savings_potential}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Financial Products */}
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                        <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2">
                            <DollarSign size={18} />
                            {currentLang === 'hi' ? 'वित्तीय उत्पाद' : 'Financial Products'}
                        </h3>
                        <div className="space-y-4">
                            {(aiAnalysis?.financial_products || []).map((prod, i) => (
                                <div key={i} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                                    <p className="text-sm font-bold text-white">{prod.product}</p>
                                    <p className="text-[10px] text-cyan-500 font-bold uppercase">{prod.provider_type}</p>
                                    <p className="text-xs text-slate-400 mt-1">{prod.rationale}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Risk Watch */}
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                            <AlertTriangle size={20} className="text-amber-400" />
                            {t.risks}
                        </h3>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {(aiAnalysis?.risks || []).map((risk, idx) => (
                                <div key={idx} className="p-4 bg-slate-900/50 rounded-lg border-l-4 border-amber-500">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-semibold text-white uppercase tracking-tight">
                                            {currentLang === 'hi' ? (risk.type === 'Financial' ? 'वित्तीय' : risk.type === 'Operational' ? 'परिचालन' : 'जोखिम') : (risk.type || 'Risk')}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${risk.severity === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                            {currentLang === 'hi' ? (risk.severity === 'High' ? 'उच्च' : risk.severity === 'Medium' ? 'मध्यम' : 'निम्न') : (risk.severity || 'Medium')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400">{risk.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-emerald-400" />
                            {t.topExpenses}
                        </h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={expenseChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                    <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                                    <YAxis stroke="#475569" fontSize={11} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                                    <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Share2 size={20} className="text-cyan-400" />
                                {t.benchmarks}
                            </h3>
                            <Info size={16} className="text-slate-500" />
                        </div>
                        <div className="space-y-8">
                            {[
                                { key: currentLang === 'hi' ? 'लाभ मार्जिन' : 'Profit Margin', user: finData?.profit_margin || 0, avg: 15.0, unit: '%' },
                                { key: currentLang === 'hi' ? 'व्यय अनुपात' : 'Expense Ratio', user: finData?.expense_ratio || 0, avg: 70.0, unit: '%' }
                            ].map((item) => (
                                <div key={item.key} className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-300 font-medium">{item.key}</span>
                                        <span className={`font-bold ${(item.user || 0) >= (item.avg || 0) ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {(item.user || 0) >= (item.avg || 0) ? t.outperforming : t.belowAvg}
                                        </span>
                                    </div>
                                    <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex p-1">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${((item.user || 0) / (Math.max(1, (item.user || 0) + (item.avg || 0)))) * 100}%` }}></div>
                                        <div className="h-full bg-slate-700/50 rounded-full ml-1" style={{ width: `${((item.avg || 0) / (Math.max(1, (item.user || 0) + (item.avg || 0)))) * 100}%` }}></div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">{t.you}</span>
                                            <span className="text-2xl font-bold text-white font-mono">{(item.user || 0).toFixed(1)}{item.unit}</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">{t.industryAvg}</span>
                                            <span className="text-base font-bold text-slate-400 font-mono">{(item.avg || 0).toFixed(1)}{item.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDatasetContent = () => {
        if (!data) return renderNoDataPrompt();
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                        <h4 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-widest">Dataset Columns</h4>
                        <div className="flex flex-wrap gap-2">
                            {columnInfo?.columns.map(col => (
                                <span key={col} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${selectedColumns.includes(col) ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                    {col}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                        <h4 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-widest">Column Info</h4>
                        <div className="space-y-3">
                            {[
                                { label: 'text columns found', count: columnInfo?.text_count, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
                                { label: 'numeric columns found', count: columnInfo?.numeric_count, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
                                { label: 'date/time columns found', count: columnInfo?.date_count, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
                            ].map((stat, i) => (
                                <div key={i} className={`p-3 rounded-2xl border flex items-center justify-between ${stat.color}`}>
                                    <span className="text-sm font-bold">{stat.count} {stat.label}</span>
                                    <Info size={14} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
                        <h3 className="text-xl font-bold">View Filtered Dataset</h3>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Showing {filteredData.length} records</div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-800/50">
                                    {selectedColumns.map(col => (
                                        <th key={col} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredData.slice(0, 50).map((row, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        {selectedColumns.map(col => (
                                            <td key={col} className="px-6 py-4 text-sm text-slate-300 font-medium">{String(row[col])}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-gradient-to-br from-indigo-600/20 to-teal-400/10 p-12 rounded-3xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
                            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                                FinSight AI
                            </h1>
                            <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                                FinSight AI provides small and medium enterprises with enterprise-grade financial intelligence. Automate your financial health checks, spot risks before they happen, and get tailored product recommendations.
                            </p>
                            <div className="mt-8 flex gap-4">
                                <button onClick={() => setActiveTab('dashboard')} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all">Go to Analysis</button>
                                <button onClick={() => setActiveTab('dataset')} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-slate-700 transition-all">Inspect Dataset</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'AI Health Score', desc: 'Real-time assessment of your business financial stability.', icon: Activity, color: 'text-emerald-400' },
                                { title: 'Risk Monitoring', desc: 'Automatic detection of cash flow gaps and expense spikes.', icon: AlertTriangle, color: 'text-rose-400' },
                                { title: 'Product Match', desc: 'Tailored financial products matched to your health profile.', icon: TrendingUp, color: 'text-cyan-400' }
                            ].map((feature, i) => (
                                <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                                    <feature.icon className={`${feature.color} mb-4`} size={32} />
                                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'dashboard':
                return renderDashboardContent();
            case 'dataset':
                return renderDatasetContent();
            default:
                return null;
        }
    };

    return (
        <BaseLayout>
            <div {...getRootProps()} className="flex h-[calc(100vh-64px)] overflow-hidden outline-none">
                {/* Hidden File Input for manual trigger */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                    accept=".csv,.xls,.xlsx"
                />
                <input {...getInputProps()} />

                {activeTab === 'dataset' && (
                    <div className="w-80 border-r border-slate-800 bg-slate-950/50 flex flex-col overflow-y-auto no-scrollbar animate-in slide-in-from-left duration-300">
                        <div className="p-6 space-y-8">
                            <div onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        <Filter size={14} />
                                        Dataset Filters
                                    </h4>
                                    <button onClick={handleReset} className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-tight">Reset All</button>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-3 block">Columns to Display</label>
                                        <select
                                            multiple
                                            value={selectedColumns}
                                            onChange={(e) => {
                                                const values = Array.from(e.target.selectedOptions, option => option.value);
                                                setSelectedColumns(values);
                                            }}
                                            className="w-full bg-slate-800 border-none rounded-xl px-2 py-2 text-xs text-white focus:outline-none min-h-[140px] scrollbar-hide"
                                        >
                                            {columnInfo?.columns.map(col => (
                                                <option key={col} value={col} className="p-2 rounded-lg mb-1 hover:bg-slate-700">{col}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {selectedColumns.filter(col => columnInfo?.numeric_columns.includes(col)).map(col => (
                                        <div key={col} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl animate-in slide-in-from-left duration-300">
                                            <div className="flex justify-between items-center mb-3">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">{col}</label>
                                                <div className="text-[10px] text-emerald-400 font-mono font-bold">
                                                    {filters[col]?.max || stats[col]?.max}
                                                </div>
                                            </div>
                                            <input
                                                type="range"
                                                min={stats[col]?.min}
                                                max={stats[col]?.max}
                                                step={(stats[col]?.max - stats[col]?.min) / 100}
                                                value={filters[col]?.max || stats[col]?.max}
                                                onChange={(e) => setFilters(prev => ({
                                                    ...prev,
                                                    [col]: { ...prev[col], min: stats[col]?.min, max: parseFloat(e.target.value) }
                                                }))}
                                                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-10">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-slate-900">
                            <div className="flex items-center gap-6">
                                <button onClick={() => setActiveTab('home')} className={`flex items-center gap-2 group transition-all`}>
                                    <div className={`p-1.5 rounded-lg transition-all ${activeTab === 'home' ? 'bg-rose-500 shadow-lg shadow-rose-500/30' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                                        <Home size={16} className={activeTab === 'home' ? 'text-white' : 'text-slate-400'} />
                                    </div>
                                    <span className={`text-sm font-bold ${activeTab === 'home' ? 'text-white underline decoration-rose-500 decoration-2 underline-offset-8' : 'text-slate-500'}`}>Home</span>
                                </button>
                                <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 group transition-all`}>
                                    <div className={`p-1.5 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                                        <LayoutDashboard size={16} className={activeTab === 'dashboard' ? 'text-white' : 'text-slate-400'} />
                                    </div>
                                    <span className={`text-sm font-bold ${activeTab === 'dashboard' ? 'text-white underline decoration-blue-500 decoration-2 underline-offset-8' : 'text-slate-500'}`}>Dashboard</span>
                                </button>
                                <button onClick={() => setActiveTab('dataset')} className={`flex items-center gap-2 group transition-all`}>
                                    <div className={`p-1.5 rounded-lg transition-all ${activeTab === 'dataset' ? 'bg-amber-500 shadow-lg shadow-amber-500/30' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                                        <Database size={16} className={activeTab === 'dataset' ? 'text-white' : 'text-slate-400'} />
                                    </div>
                                    <span className={`text-sm font-bold ${activeTab === 'dataset' ? 'text-white underline decoration-amber-500 decoration-2 underline-offset-8' : 'text-slate-500'}`}>Dataset</span>
                                </button>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                                {(data && (activeTab === 'dashboard' || activeTab === 'dataset')) && (
                                    <button
                                        onClick={() => {
                                            handleReset();
                                            setActiveTab('home');
                                        }}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 transition-all"
                                    >
                                        <RefreshCw size={14} />
                                        Reset Dashboard
                                    </button>
                                )}
                                <div className="flex-1 md:flex-none">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-emerald-600/20"
                                    >
                                        <Upload size={14} />
                                        Upload New
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!data?.report_id) {
                                            alert('No report available for download');
                                            return;
                                        }
                                        window.open(`${API_BASE_URL}/financial/reports/${data.report_id}/download`, '_blank');
                                    }}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
                                >
                                    <Download size={14} />
                                    {currentLang === 'hi' ? 'एक्सपोर्ट' : 'Export'}
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-4">
                                <div className="bg-emerald-500/20 p-2 rounded-2xl"><Activity className="text-emerald-500" size={32} /></div>
                                <span>FinSight AI - <span className="text-slate-500 font-medium">{t.title}</span></span>
                            </h2>
                            <p className="text-slate-500 mt-2 font-medium italic">{t.sub}</p>
                        </div>
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
};

export default Dashboard;
