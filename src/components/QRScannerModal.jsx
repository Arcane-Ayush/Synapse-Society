import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import { X, QrCode, Camera, Upload, CheckCircle2, AlertCircle, Sparkles, Award, Trophy, Zap, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { decryptPayload } from '../utils/cryptoUtils';

export function QRScannerModal({ isOpen, onClose, onOpenLogin }) {
    const { claimQrReward, isAuthenticated, profile } = useAuth();
    const [scanMode, setScanMode] = useState('upload'); // 'upload' | 'camera'
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [isScanningCamera, setIsScanningCamera] = useState(false);
    const cameraRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            setError('');
            setResult(null);
            stopCamera();
        }
    }, [isOpen]);

    const stopCamera = async () => {
        if (cameraRef.current && cameraRef.current.isScanning) {
            try {
                await cameraRef.current.stop();
            } catch (err) {
                console.warn('Camera stop error:', err);
            }
        }
    };

    const processQrCodeData = (qrText) => {
        setError('');
        try {
            // Decrypt proprietary Synapse Cipher Payload
            const data = decryptPayload(qrText);
            
            // Validate Synapse Protocol
            if (!data || data.protocol !== 'SYNAPSE_QR_PROTOCOL_V1' || !data.amount) {
                setError('Invalid QR Protocol. Synapse Society QR codes can only be decrypted and executed on the Synapse platform.');
                return;
            }

            if (!isAuthenticated) {
                onClose();
                if (onOpenLogin) onOpenLogin();
                return;
            }

            // Claim Reward
            if (claimQrReward) {
                const claimResult = claimQrReward(data);
                if (!claimResult.success) {
                    setError(claimResult.error || 'Failed to claim QR reward.');
                    return;
                }

                setResult({
                    title: data.title || 'Synapse Reward',
                    xpGained: claimResult.xpGained,
                    newTotalXp: claimResult.newTotalXp,
                    levelUp: claimResult.levelUp,
                    newLevel: claimResult.newLevel,
                    cardTier: data.cardTier
                });
            } else {
                setResult({
                    title: data.title || 'Synapse Reward',
                    xpGained: Number(data.amount) || 100,
                    newTotalXp: (profile?.xp || 0) + (Number(data.amount) || 100),
                    levelUp: false,
                    newLevel: profile?.level || 1,
                    cardTier: data.cardTier
                });
            }

            stopCamera();
        } catch (err) {
            setError('Protected Encrypted QR. External or unencrypted QR codes cannot be processed on this platform.');
        }
    };


    // File Upload Handler
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        try {
            const html5QrCode = new Html5Qrcode("qr-file-reader-temp");
            const decodedText = await html5QrCode.scanFile(file, true);
            html5QrCode.clear();
            processQrCodeData(decodedText);
        } catch (err) {
            setError('Could not decode QR code from image file. Please upload a clear QR code image.');
        }
    };

    // Camera Scan Handler
    const startCameraScanner = async () => {
        setError('');
        setIsScanningCamera(true);
        try {
            const html5QrCode = new Html5Qrcode("qr-camera-reader");
            cameraRef.current = html5QrCode;

            await html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 220, height: 220 } },
                (decodedText) => {
                    processQrCodeData(decodedText);
                },
                () => {}
            );
        } catch (err) {
            setIsScanningCamera(false);
            setError('Camera access denied or unavailable. Please use the File Upload scanner option.');
        }
    };

    const handleClose = () => {
        stopCamera();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0"
                    style={{ background: 'rgba(5, 5, 12, 0.88)', backdropFilter: 'blur(16px)' }}
                />

                {/* Hidden Temp Container for File Reader */}
                <div id="qr-file-reader-temp" className="hidden" />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative w-full max-w-lg p-6 md:p-8 rounded-3xl overflow-hidden shadow-2xl z-10"
                    style={{
                        background: 'linear-gradient(135deg, rgba(16, 12, 34, 0.96), rgba(8, 6, 18, 0.98))',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        boxShadow: '0 0 60px rgba(124, 58, 237, 0.25)'
                    }}
                >
                    {/* Top Accent Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px]"
                         style={{ background: 'linear-gradient(90deg, transparent, #A855F7, #D946EF, transparent)' }} />

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-5 right-5 p-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/30 transition-colors cursor-pointer z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {!result ? (
                        <>
                            {/* Modal Header */}
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 bg-purple-500/10 border border-purple-500/30 text-purple-400">
                                    <QrCode className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                                    Synapse QR Scanner
                                </h2>
                                <p className="text-xs text-purple-300/60 mt-1 font-mono">
                                    SCAN OFFICIAL CLUB REWARD &amp; WORKSHOP QR CODES
                                </p>
                            </div>

                            {/* Mode Switch Tabs */}
                            <div className="flex p-1 rounded-xl mb-6 bg-purple-950/40 border border-purple-500/20">
                                <button
                                    onClick={() => { setScanMode('upload'); stopCamera(); setError(''); }}
                                    className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${scanMode === 'upload' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-purple-300/60 hover:text-white'}`}
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    Upload Image QR
                                </button>
                                <button
                                    onClick={() => { setScanMode('camera'); setError(''); startCameraScanner(); }}
                                    className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${scanMode === 'camera' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-purple-300/60 hover:text-white'}`}
                                >
                                    <Camera className="w-3.5 h-3.5" />
                                    Live Camera Scan
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs text-center flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Scan Viewports */}
                            {scanMode === 'upload' ? (
                                <div className="p-8 border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-2xl text-center bg-purple-950/20 transition-all cursor-pointer relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                    />
                                    <div className="w-14 h-14 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center mx-auto mb-3 text-purple-300 group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-sm font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                                        Upload QR Code Image
                                    </h4>
                                    <p className="text-xs text-purple-300/60 mb-2">
                                        Drag &amp; drop or click to select PNG / JPG QR code file
                                    </p>
                                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono text-purple-300 bg-purple-900/60 border border-purple-500/30">
                                        SELECT FILE
                                    </span>
                                </div>
                            ) : (
                                <div className="relative rounded-2xl overflow-hidden bg-black/80 border border-purple-500/30 min-h-[240px] flex items-center justify-center">
                                    <div id="qr-camera-reader" className="w-full h-full min-h-[240px]" />
                                    {!isScanningCamera && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                            <Camera className="w-8 h-8 text-purple-400 mb-2 animate-pulse" />
                                            <p className="text-xs font-mono text-purple-300">Initializing Camera Feed...</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <p className="text-[10px] font-mono text-purple-300/40 text-center mt-4">
                                SYNAPSE QR PROTOCOL V1 • AUTHORIZED SCANNING PLATFORM
                            </p>
                        </>
                    ) : (
                        /* REWARD CELEBRATION VIEW */
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-4 space-y-5"
                        >
                            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-gradient-to-tr from-amber-500 to-fuchsia-500 p-1 shadow-2xl shadow-fuchsia-500/30 animate-bounce">
                                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                                    <Trophy className="w-10 h-10 text-amber-400" />
                                </div>
                            </div>

                            <div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/30 mb-2">
                                    <Sparkles className="w-3 h-3 text-amber-400" />
                                    REWARD CLAIMED SUCCESSFULLY
                                </span>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-white" style={{ fontFamily: 'Space Grotesk' }}>
                                    {result.title}
                                </h3>
                                {result.cardTier && (
                                    <p className="text-xs font-mono text-fuchsia-400 font-bold mt-1">
                                        CARD UNLOCKED: {result.cardTier}
                                    </p>
                                )}
                            </div>

                            {/* XP Reward Chip */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-amber-950/40 to-purple-950/60 border border-amber-500/30 flex items-center justify-center gap-4">
                                <Zap className="w-8 h-8 text-amber-400" />
                                <div className="text-left">
                                    <span className="block text-[10px] font-mono text-amber-400/80">REWARD EARNED</span>
                                    <span className="text-3xl font-black text-amber-400" style={{ fontFamily: 'Space Grotesk' }}>
                                        +{result.xpGained} XP
                                    </span>
                                </div>
                            </div>

                            {result.levelUp && (
                                <div className="p-3 rounded-xl bg-fuchsia-950/60 border border-fuchsia-500/40 text-fuchsia-200 text-xs font-mono font-bold flex items-center justify-center gap-2 animate-pulse">
                                    <Award className="w-4 h-4 text-fuchsia-400" />
                                    LEVEL UP! YOU ARE NOW LEVEL {result.newLevel}!
                                </div>
                            )}

                            <button
                                onClick={handleClose}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                                style={{ fontFamily: 'Space Grotesk' }}
                            >
                                CONTINUE TO NEXUS
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
