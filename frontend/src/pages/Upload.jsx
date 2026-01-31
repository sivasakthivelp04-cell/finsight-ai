
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import BaseLayout from '../components/layout/BaseLayout';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = `http://${window.location.hostname}:8000/api/v1`;

const UploadPage = () => {
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState('');
    const navigate = useNavigate();
    const currentLang = localStorage.getItem('finsight_lang') || 'hi';

    const t = {
        en: {
            title: "Upload Financial Data",
            sub: "Upload your Bank Statements, P&L, or Balance Sheet (CSV/XLSX)",
            drag: "Drag & Drop or",
            browse: "Browse",
            format: "Supports CSV, Excel (Max 50MB)",
            success: "Analysis Complete!",
            successSub: "has been analyzed and saved.",
            viewBtn: "View Dashboard Insights",
            fail: "Upload Failed",
            tryAgain: "Try Again",
            uploading: "Uploading and analyzing file...",
            processing: "AI processing in progress...",
            bank: "Bank Statements",
            bankSub: "CSV format recommended",
            pl: "P&L Statements",
            plSub: "Excel/CSV Supported",
            ledger: "Accounting Ledger",
            ledgerSub: "Tally/Quickbooks Export",
            expectedTitle: "Expected Data Format",
            expectedSub: "Your CSV/Excel should have columns like:",
            expectedAuto: "The system will auto-detect column names. Flexible with variations.",
            processingStep: "Processing data and running AI analysis..."
        },
        hi: {
            title: "वित्तीय डेटा अपलोड करें",
            sub: "अपने बैंक स्टेटमेंट, पी एंड एल, या बैलेंस शीट अपलोड करें (CSV/XLSX)",
            drag: "ड्रैग एंड ड्रॉप करें या",
            browse: "ब्राउज़ करें",
            format: "CSV, Excel का समर्थन करता है (अधिकतम 50MB)",
            success: "विश्लेषण पूरा हुआ!",
            successSub: "का विश्लेषण और संचय कर लिया गया है।",
            viewBtn: "डैशबोर्ड अंतर्दृष्टि देखें",
            fail: "अपलोड विफल रहा",
            tryAgain: "फिर से प्रयास करें",
            uploading: "फ़ाइल अपलोड और विश्लेषण किया जा रहा है...",
            processing: "एआई प्रोसेसिंग जारी है...",
            bank: "बैंक स्टेटमेंट",
            bankSub: "CSV प्रारूप की सिफारिश की गई",
            pl: "पी एंड एल विवरण",
            plSub: "एक्सेल/CSV समर्थित",
            ledger: "लेखा बही (Ledger)",
            ledgerSub: "टैली/क्विकबुक्स एक्सपोर्ट",
            expectedTitle: "अपेक्षित डेटा प्रारूप",
            expectedSub: "आपके CSV/Excel में इस तरह के कॉलम होने चाहिए:",
            expectedAuto: "सिस्टम स्वचालित रूप से कॉलम नामों का पता लगाएगा। विविधताओं के साथ लचीला।",
            processingStep: "डेटा प्रोसेसिंग और एआई विश्लेषण जारी है..."
        }
    }[currentLang];

    const onDrop = useCallback(acceptedFiles => {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        setError(null);
        processFile(uploadedFile);
    }, []);

    const processFile = async (file) => {
        setStatus('uploading');
        setProgress(t.uploading);

        const formData = new FormData();
        formData.append('file', file);

        const lang = currentLang;
        const industry = localStorage.getItem('finsight_industry') || 'General';
        const companyId = localStorage.getItem('company_id');

        try {
            // Upload, process, analyze, and store in database - all in one call
            await axios.post(
                `${API_BASE_URL}/financial/upload?lang=${lang}&industry=${industry}&id=${companyId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setStatus('success');
            setProgress('Analysis complete and saved to database!');

        } catch (err) {
            console.error('Upload error:', err);
            setStatus('error');
            setError(err.response?.data?.detail || err.message || 'Failed to process file');
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        maxSize: 50 * 1024 * 1024, // 50MB
        multiple: false
    });

    return (
        <BaseLayout>
            <div className="max-w-4xl mx-auto text-slate-100">
                <h2 className="text-3xl font-bold mb-2">{t.title}</h2>
                <p className="text-slate-400 mb-8">{t.sub}</p>

                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-emerald-500 bg-emerald-500/10' :
                        status === 'error' ? 'border-rose-500/50 bg-rose-500/5' :
                            'border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800'
                        }`}
                >
                    <input {...getInputProps()} />

                    {status === 'idle' && (
                        <>
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <UploadCloud size={40} className="text-emerald-400" />
                            </div>
                            <p className="text-xl font-medium mb-2">{t.drag} <span className="text-emerald-400">{t.browse}</span></p>
                            <p className="text-slate-500 text-sm">{t.format}</p>
                        </>
                    )}

                    {status === 'uploading' && (
                        <div className="text-center">
                            <Loader className="animate-spin h-12 w-12 text-emerald-500 mx-auto mb-4" />
                            <p className="text-lg font-medium">{progress}</p>
                            <p className="text-sm text-slate-500 mt-2">
                                {t.processingStep}
                            </p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center">
                            <CheckCircle size={64} className="text-emerald-500 mx-auto mb-4" />
                            <p className="text-xl font-bold text-white">{t.success}</p>
                            <p className="text-slate-400 mt-2 mb-6">{file?.name} {t.successSub}</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/dashboard');
                                }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium"
                            >
                                {t.viewBtn}
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center p-4 w-full">
                            <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
                            <p className="text-xl font-bold text-white">{t.fail}</p>
                            <div className="mt-2 mb-6 max-w-lg mx-auto bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
                                <p className="text-rose-400 text-sm overflow-hidden text-ellipsis line-clamp-4 hover:line-clamp-none transition-all cursor-help" title={error}>
                                    {error}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setStatus('idle');
                                    setError(null);
                                    setFile(null);
                                }}
                                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-medium"
                            >
                                {t.tryAgain}
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800/50 p-4 rounded-lg flex items-start gap-4 border border-slate-700">
                        <div className="p-2 bg-slate-700/50 rounded-lg"><FileText size={20} className="text-blue-400" /></div>
                        <div>
                            <h4 className="font-semibold text-sm">{t.bank}</h4>
                            <p className="text-xs text-slate-400 mt-1">{t.bankSub}</p>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg flex items-start gap-4 border border-slate-700">
                        <div className="p-2 bg-slate-700/50 rounded-lg"><FileText size={20} className="text-purple-400" /></div>
                        <div>
                            <h4 className="font-semibold text-sm">{t.pl}</h4>
                            <p className="text-xs text-slate-400 mt-1">{t.plSub}</p>
                        </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg flex items-start gap-4 border border-slate-700">
                        <div className="p-2 bg-slate-700/50 rounded-lg"><FileText size={20} className="text-amber-400" /></div>
                        <div>
                            <h4 className="font-semibold text-sm">{t.ledger}</h4>
                            <p className="text-xs text-slate-400 mt-1">{t.ledgerSub}</p>
                        </div>
                    </div>
                </div>

                {/* Sample Data Format */}
                <div className="mt-8 bg-slate-800/30 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-lg font-semibold mb-3">{t.expectedTitle}</h3>
                    <p className="text-sm text-slate-400 mb-3">{t.expectedSub}</p>
                    <div className="bg-slate-900 p-4 rounded font-mono text-xs text-slate-300 overflow-x-auto">
                        <div className="mb-2">Date, Description, Category, Amount, Type</div>
                        <div className="text-slate-500">2024-01-15, Client Payment, Sales, 5000, Income</div>
                        <div className="text-slate-500">2024-01-16, Office Rent, Rent, -2000, Expense</div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                        * {t.expectedAuto}
                    </p>
                </div>
            </div>
        </BaseLayout>
    );
};

export default UploadPage;
