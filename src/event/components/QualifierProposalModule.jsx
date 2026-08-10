import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Send, CheckCircle2, Coins, Sparkles, FileText, Upload, AlertCircle, Trash2, FileCheck } from 'lucide-react';
import { addUserSCoins } from '../lib/eventState';

export function QualifierProposalModule({ user, prompt, assignedTeam, onSubmitted }) {
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfFileName, setPdfFileName] = useState('');
    const [pdfFileSize, setPdfFileSize] = useState(0);
    const [pdfDataUrl, setPdfDataUrl] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [notes, setNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setErrorMsg(null);

        // Validate File Type (PDF Only)
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            setErrorMsg('Only PDF documents (.pdf) are accepted.');
            return;
        }

        // Validate File Size (Max 4 MB = 4 * 1024 * 1024 bytes)
        const MAX_SIZE = 4 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            setErrorMsg(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of 4.00 MB.`);
            return;
        }

        setPdfFile(file);
        setPdfFileName(file.name);
        setPdfFileSize(file.size);

        const reader = new FileReader();
        reader.onload = (evt) => {
            setPdfDataUrl(evt.target?.result || '');
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveFile = () => {
        setPdfFile(null);
        setPdfFileName('');
        setPdfFileSize(0);
        setPdfDataUrl('');
        setErrorMsg(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!pdfFile && !pdfDataUrl) {
            setErrorMsg('Please select a 1-page PDF Concept Sheet to upload.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            addUserSCoins(user?.id, 200);
            setSubmitted(true);
            setLoading(false);
            if (onSubmitted) onSubmitted({ pdfFileName, pdfFileSize, pdfDataUrl, notes });
        }, 800);
    };

    const assignedApp = (assignedTeam?.motto || '').replace('App: ', '').replace('Domain: ', '') || 'Assigned App';

    return (
        <div className="w-full max-w-xl mx-auto font-mono select-none">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-6 md:p-8 backdrop-blur-2xl relative overflow-hidden"
                style={{
                    background: 'linear-gradient(145deg, rgba(10, 20, 30, 0.95) 0%, rgba(20, 10, 40, 0.95) 100%)',
                    border: '1px solid rgba(0, 240, 255, 0.4)',
                    boxShadow: '0 0 50px rgba(0, 240, 255, 0.25)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Award size={18} className="text-yellow-400" />
                        <h3 className="text-base sm:text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            {prompt?.title || 'Round 2 · Product Innovation'}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs font-mono font-bold text-yellow-300">
                        <Coins size={12} className="text-yellow-400" />
                        +{prompt?.rewardSCoins || 500} S
                    </div>
                </div>

                {/* Challenge Details & Assigned App */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 mb-5 space-y-1.5">
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        Identify a major user pain point in your assigned app and propose an innovative AI feature or UI/UX improvement. Create a 1-page concept: Target User Problem, New Feature/Improvement, Feature Name, and a Wireframe sketch.
                    </p>
                    <div className="text-[11px] font-mono text-cyan-300 font-bold flex items-center justify-between">
                        <span>📱 Assigned App: <strong className="text-purple-300">{assignedApp}</strong></span>
                        <span>Max 4 MB PDF · 15 Mins</span>
                    </div>
                </div>

                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-3"
                    >
                        <FileCheck size={40} className="text-cyan-400 mx-auto" />
                        <div>
                            <h4 className="text-sm font-bold text-cyan-200 uppercase font-mono tracking-wider">
                                PDF Concept Sheet Locked In!
                            </h4>
                            <p className="text-[11px] font-mono text-zinc-400 mt-1">
                                Your PDF submission has been dispatched to stage judges for finale qualifier selection.
                            </p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/50 border border-cyan-500/30 text-xs font-mono text-cyan-300 truncate">
                            📄 {pdfFileName} ({(pdfFileSize / (1024 * 1024)).toFixed(2)} MB)
                        </div>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* PDF File Drag & Drop Upload Zone */}
                        <div>
                            <label className="block text-[10px] font-mono text-cyan-300/80 uppercase tracking-wider mb-1.5 font-bold">
                                Upload 1-Page Concept Sheet (PDF Only, Max 4 MB) *
                            </label>

                            {!pdfFile ? (
                                <label className="w-full h-36 rounded-2xl border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 bg-black/40 hover:bg-cyan-950/20 flex flex-col items-center justify-center p-4 cursor-pointer transition-all group">
                                    <input
                                        type="file"
                                        accept="application/pdf,.pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <Upload size={28} className="text-cyan-400 group-hover:scale-110 transition-transform mb-2" />
                                    <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                                        Click or Drag PDF Document Here
                                    </span>
                                    <span className="text-[10px] text-zinc-400 mt-1">
                                        Only .pdf files allowed • Maximum file size: 4 MB
                                    </span>
                                </label>
                            ) : (
                                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-2.5 rounded-xl bg-purple-900/60 border border-purple-400/40 text-purple-300">
                                            <FileText size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs font-bold text-white truncate">{pdfFileName}</div>
                                            <div className="text-[10px] text-cyan-300 font-mono">
                                                {(pdfFileSize / (1024 * 1024)).toFixed(2)} MB • Verified PDF
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 cursor-pointer"
                                        title="Remove file"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}

                            {errorMsg && (
                                <div className="mt-2 p-2.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2">
                                    <AlertCircle size={14} className="flex-shrink-0" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[10px] font-mono text-cyan-300/70 uppercase tracking-wider mb-1.5">
                                Text output (Optional)
                            </label>
                            <textarea
                                rows={2}
                                placeholder="Summary / notes..."
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-cyan-400/30 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !pdfFile}
                            className="w-full py-3.5 rounded-2xl font-mono text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40"
                            style={{
                                background: 'linear-gradient(135deg, #00F0FF 0%, #3B82F6 100%)',
                                color: '#000000',
                                boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)'
                            }}
                        >
                            <Send size={14} />
                            {loading ? 'Uploading & Submitting PDF...' : 'Submit Round 2 PDF Concept'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
