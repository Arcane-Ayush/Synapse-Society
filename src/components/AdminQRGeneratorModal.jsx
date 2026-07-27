import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Shield, Download, Copy, Check, Sparkles, QrCode, Award, Zap, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { encryptPayload } from '../utils/cryptoUtils';

export function AdminQRGeneratorModal({ isOpen, onClose }) {
    const { isAdmin, user } = useAuth();
    const [title, setTitle] = useState('React 18 Masterclass Bonus XP');
    const [amount, setAmount] = useState(250);
    const [category, setCategory] = useState('XP Bounty'); // 'XP Bounty' | 'Card Unlock' | 'Event Checkin'
    const [cardTier, setCardTier] = useState('Level 2 Guardian');
    const [copied, setCopied] = useState(false);
    const qrCanvasRef = useRef(null);

    if (!isOpen || !isAdmin) return null;

    // Generate plain payload object
    const plainPayload = {
        protocol: 'SYNAPSE_QR_PROTOCOL_V1',
        id: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        title,
        amount: Number(amount) || 100,
        category,
        cardTier: category === 'Card Unlock' ? cardTier : null,
        created: new Date().toISOString(),
        issuer: user?.name || 'Admin',
        signature: `synapse_sig_${Math.random().toString(36).substr(2, 9)}`
    };

    // Encrypt payload into an opaque cipher text string
    const qrPayload = encryptPayload(plainPayload);


    const handleDownload = () => {
        const canvas = document.getElementById('synapse-qr-canvas');
        if (!canvas) return;

        // Create download link
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `synapse-qr-${title.toLowerCase().replace(/\s+/g, '-')}-${amount}xp.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopyPayload = () => {
        navigator.clipboard.writeText(qrPayload);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0"
                    style={{ background: 'rgba(5, 5, 12, 0.88)', backdropFilter: 'blur(16px)' }}
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative w-full max-w-2xl p-6 md:p-8 rounded-3xl overflow-hidden shadow-2xl z-10"
                    style={{
                        background: 'linear-gradient(135deg, rgba(18, 14, 36, 0.96), rgba(8, 6, 18, 0.98))',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        boxShadow: '0 0 60px rgba(245, 158, 11, 0.15)'
                    }}
                >
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px]"
                         style={{ background: 'linear-gradient(90deg, transparent, #F59E0B, #D946EF, transparent)' }} />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-2 rounded-xl text-amber-300 hover:text-white hover:bg-amber-900/30 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-500/10 border border-amber-500/30 text-amber-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                    Admin QR Code Generator
                                </h2>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                    ADMIN ONLY
                                </span>
                            </div>
                            <p className="text-xs text-amber-300/60 font-mono">
                                SYNAPSE QR PROTOCOL V1 • AUTHORIZED ISSUANCE SYSTEM
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Form Inputs */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-amber-300/80 mb-1">REWARD TITLE</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. React Workshop Attendance"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/30 border border-amber-500/20 text-white placeholder-amber-300/30 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-amber-300/80 mb-1">CUSTOM XP AMOUNT</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="10"
                                        max="5000"
                                        step="10"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/30 border border-amber-500/20 text-amber-400 font-bold placeholder-amber-300/30 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                    <span className="absolute right-3.5 top-2.5 text-xs font-mono text-amber-400/60 font-bold">XP</span>
                                </div>
                                <div className="flex gap-1.5 mt-2">
                                    {[50, 100, 250, 500, 1000].map((quickVal) => (
                                        <button
                                            key={quickVal}
                                            type="button"
                                            onClick={() => setAmount(quickVal)}
                                            className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${amount == quickVal ? 'bg-amber-500 text-black font-bold border-amber-400' : 'bg-purple-950/40 text-amber-300/70 border-amber-500/20 hover:border-amber-500/50'}`}
                                        >
                                            +{quickVal}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-amber-300/80 mb-1">REWARD CATEGORY</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/40 border border-amber-500/20 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                >
                                    <option value="XP Bounty">XP Bounty (Workshop/Task)</option>
                                    <option value="Card Unlock">Card Unlock + XP</option>
                                    <option value="Event Checkin">Event Check-in</option>
                                </select>
                            </div>

                            {category === 'Card Unlock' && (
                                <div>
                                    <label className="block text-xs font-mono text-amber-300/80 mb-1">TARGET CARD UNLOCK</label>
                                    <select
                                        value={cardTier}
                                        onChange={(e) => setCardTier(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/40 border border-amber-500/20 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                                    >
                                        <option value="Level 1 Awakened">Level 1 Awakened</option>
                                        <option value="Level 2 Guardian">Level 2 Guardian</option>
                                        <option value="Level 3 Champion">Level 3 Champion</option>
                                        <option value="Level 4 Celestial">Level 4 Celestial</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* QR Preview & Action Buttons */}
                        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/50 border border-amber-500/20 text-center">
                            <div className="p-4 rounded-2xl bg-white shadow-2xl shadow-amber-500/20 mb-4 inline-block">
                                <QRCodeCanvas
                                    id="synapse-qr-canvas"
                                    value={qrPayload}
                                    size={180}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>{title}</h4>
                                <div className="text-xs font-mono text-amber-400 font-bold mt-0.5">+{amount} XP REWARD</div>
                            </div>

                            {/* Action Buttons */}
                            <div className="w-full space-y-2">
                                <button
                                    onClick={handleDownload}
                                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                                    style={{ fontFamily: 'Space Grotesk' }}
                                >
                                    <Download className="w-4 h-4" />
                                    DOWNLOAD QR IMAGE (PNG)
                                </button>
                                <button
                                    onClick={handleCopyPayload}
                                    className="w-full py-2 px-4 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-amber-500/20 text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? 'Copied Payload!' : 'Copy Payload Data'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
