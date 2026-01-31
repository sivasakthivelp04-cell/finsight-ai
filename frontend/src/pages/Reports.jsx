
import React, { useState, useEffect } from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import { Download, FileText, Calendar, TrendingUp, Trash2 } from 'lucide-react';
import axios from 'axios';

import API_BASE_URL from '../apiConfig';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const currentLang = localStorage.getItem('finsight_lang') || 'en';

    const t = {
        en: {
            title: "Financial Reports",
            back: "Back to Reports",
            health: "Health Score",
            revenue: "Total Revenue",
            profit: "Net Profit",
            margin: "Profit Margin",
            summary: "Executive Summary",
            risks: "Identified Risks",
            recommendations: "Recommendations",
            viewReport: "View Report",
            loading: "Loading reports...",
            generatedOn: "Generated on",
            confirmDelete: "Are you sure you want to delete this report? This action cannot be undone."
        },
        hi: {
            title: "वित्तीय रिपोर्ट",
            back: "रिपोर्ट पर वापस जाएं",
            health: "स्वास्थ्य स्कोर",
            revenue: "कुल राजस्व",
            profit: "शुद्ध लाभ",
            margin: "लाभ मार्जिन",
            summary: "कार्यकारी सारांश",
            risks: "चिन्हित जोखिम",
            recommendations: "सिफारिशें",
            viewReport: "रिपोर्ट देखें",
            loading: "रिपोर्ट लोड हो रही है...",
            generatedOn: "जेनरेट किया गया:",
            confirmDelete: "क्या आप वाकई इस रिपोर्ट को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।"
        }
    }[currentLang];

    useEffect(() => {
        fetchReports();
    }, [currentLang]);

    const fetchReports = async () => {
        try {
            const companyId = localStorage.getItem('company_id');
            const response = await axios.get(`${API_BASE_URL}/financial/reports`, {
                params: { lang: currentLang, id: companyId }
            });
            setReports(response.data.reports);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setLoading(false);
        }
    };

    const handleRemoveReport = async (reportId) => {
        if (window.confirm(t.confirmDelete)) {
            try {
                await axios.delete(`${API_BASE_URL}/financial/reports/${reportId}`);
                setReports(reports.filter(r => r.id !== reportId));
            } catch (error) {
                console.error('Error deleting report:', error);
                alert('Failed to delete report from database.');
            }
        }
    };

    const viewReportDetail = async (reportId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/financial/reports/${reportId}?lang=${currentLang}`);
            setSelectedReport(response.data);
        } catch (error) {
            console.error('Error fetching report detail:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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

    if (selectedReport) {
        const { content } = selectedReport;
        const aiAnalysis = content?.ai_analysis || {};
        const financialData = content?.financial_data || {};

        return (
            <BaseLayout>
                <div className="text-slate-100">
                    <button
                        onClick={() => setSelectedReport(null)}
                        className="text-emerald-400 hover:text-emerald-300 mb-6 flex items-center gap-2"
                    >
                        ← {t.back}
                    </button>

                    <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedReport.title}</h2>
                                <p className="text-slate-400 mt-1">{t.generatedOn} {formatDate(selectedReport.generated_at)}</p>
                            </div>
                            <button
                                onClick={() => window.open(`${API_BASE_URL}/financial/reports/${selectedReport.id}/download`, '_blank')}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                            >
                                <Download size={16} />
                                {currentLang === 'hi' ? 'डाउनलोड PDF' : 'Download PDF'}
                            </button>
                        </div>

                        {/* Financial Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-slate-900/50 p-4 rounded-lg">
                                <p className="text-slate-400 text-sm">{t.health}</p>
                                <p className="text-2xl font-bold text-emerald-400">{aiAnalysis.health_score || 0}</p>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-lg">
                                <p className="text-slate-400 text-sm">{t.revenue}</p>
                                <p className="text-2xl font-bold">${((financialData.total_revenue || 0) / 1000).toFixed(1)}k</p>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-lg">
                                <p className="text-slate-400 text-sm">{t.profit}</p>
                                <p className="text-2xl font-bold text-emerald-400">${((financialData.net_profit || 0) / 1000).toFixed(1)}k</p>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-lg">
                                <p className="text-slate-400 text-sm">{t.margin}</p>
                                <p className="text-2xl font-bold">{(financialData.profit_margin || 0).toFixed(1)}%</p>
                            </div>
                        </div>

                        {/* AI Summary */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">{t.summary}</h3>
                            <p className="text-slate-300 bg-slate-900/30 p-4 rounded-lg">{aiAnalysis.summary}</p>
                        </div>

                        {/* Risks */}
                        {aiAnalysis.risks && aiAnalysis.risks.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">{t.risks}</h3>
                                <div className="space-y-2">
                                    {aiAnalysis.risks.map((risk, idx) => (
                                        <div key={idx} className="bg-slate-900/30 p-4 rounded-lg border-l-4 border-amber-500">
                                            <div className="flex justify-between items-start">
                                                <span className="font-semibold">{risk.type}</span>
                                                <span className={`text-xs px-2 py-1 rounded ${risk.severity === 'High' ? 'bg-rose-500/20 text-rose-400' :
                                                    risk.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                    }`}>{currentLang === 'hi' ? (
                                                        risk.severity === 'High' ? 'उच्च' :
                                                            risk.severity === 'Medium' ? 'मध्यम' :
                                                                risk.severity === 'Low' ? 'निम्न' :
                                                                    risk.severity
                                                    ) : risk.severity}</span>
                                            </div>
                                            <p className="text-slate-400 text-sm mt-1">{risk.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recommendations */}
                        {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3">{t.recommendations}</h3>
                                <div className="space-y-2">
                                    {aiAnalysis.recommendations.map((rec, idx) => (
                                        <div key={idx} className="bg-emerald-900/10 p-4 rounded-lg border-l-4 border-emerald-500">
                                            <p className="font-semibold">{rec.action}</p>
                                            <p className="text-emerald-400 text-sm mt-1">{rec.impact}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </BaseLayout>
        );
    }

    return (
        <BaseLayout>
            <div className="text-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold">{t.title}</h2>
                        <p className="text-slate-400 mt-1">{t.sub}</p>
                    </div>
                </div>

                {reports.length === 0 ? (
                    <div className="text-center py-16">
                        <FileText size={64} className="text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">{t.noData}</h3>
                        <p className="text-slate-400">{t.noDataSub}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex justify-between items-center transition hover:border-emerald-500/50 cursor-pointer"
                                onClick={() => viewReportDetail(report.id)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-700 rounded-lg">
                                        <FileText size={24} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold">{report.title}</h4>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {formatDate(report.generated_at)}
                                            </span>
                                            <span className="px-2 py-1 bg-slate-700 rounded text-xs">
                                                {report.report_type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(`${API_BASE_URL}/financial/reports/${report.id}/download`, '_blank');
                                        }}
                                        className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                                        title="Download PDF"
                                    >
                                        <Download size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveReport(report.id);
                                        }}
                                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                                        title="Delete Report"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            viewReportDetail(report.id);
                                        }}
                                        className="text-emerald-400 hover:text-emerald-300 font-medium text-sm flex items-center gap-2"
                                    >
                                        {t.viewReport} <TrendingUp size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </BaseLayout>
    );
};

export default Reports;
