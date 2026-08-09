import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle2, XCircle, Coins, Zap, Trophy, ArrowRight, Loader2 } from 'lucide-react';
import { addUserSCoins } from '../lib/eventState';

export function RedemptionQuizModule({ user, questions = [], onFinished }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [earnedCoins, setEarnedCoins] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);

    if (!questions || questions.length === 0) {
        return (
            <div className="w-full max-w-xl mx-auto p-8 rounded-3xl bg-black/40 border border-pink-500/30 text-center">
                <Loader2 size={32} className="text-pink-400 animate-spin mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Loading Redemption Questions...
                </h4>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                    Connecting to live PostgreSQL question bank.
                </p>
            </div>
        );
    }

    const currentQ = questions[currentIndex] || questions[0];
    const correctIdx = currentQ?.correct_index ?? currentQ?.correctIndex ?? 0;
    const rewardAmt = currentQ?.reward_s_coins ?? currentQ?.rewardSCoins ?? 100;

    const handleSelect = (index) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);

        const isCorrect = index === correctIdx;
        if (isCorrect) {
            setScore(prev => prev + 1);
            setEarnedCoins(prev => prev + rewardAmt);
            if (user?.id) addUserSCoins(user.id, rewardAmt);
        }
    };

    const handleNext = () => {
        if (currentIndex + 1 < questions.length) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setQuizComplete(true);
            if (onFinished) onFinished({ score, earnedCoins });
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-6 md:p-8 backdrop-blur-2xl relative overflow-hidden"
                style={{
                    background: 'linear-gradient(145deg, rgba(20, 10, 30, 0.95) 0%, rgba(35, 10, 20, 0.95) 100%)',
                    border: '1px solid rgba(236, 72, 153, 0.4)',
                    boxShadow: '0 0 50px rgba(236, 72, 153, 0.25)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <Zap size={18} className="text-pink-400" />
                        <h3 className="text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            Round of Redemption • Cyber Quiz
                        </h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs font-mono font-bold text-yellow-300">
                        <Coins size={12} className="text-yellow-400" />
                        +{earnedCoins} S-Coins Earned
                    </div>
                </div>

                {quizComplete ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-8 text-center"
                    >
                        <Trophy size={48} className="text-yellow-400 mx-auto mb-3 animate-bounce" />
                        <h4 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>
                            Redemption Complete!
                        </h4>
                        <p className="text-xs font-mono text-zinc-300 mb-6">
                            You scored {score}/{questions.length} and reclaimed <strong className="text-yellow-400">+{earnedCoins} S-Coins</strong> back into your Agent ID ledger!
                        </p>
                        <div className="inline-block px-4 py-2 rounded-xl bg-pink-500/20 border border-pink-400/40 text-xs font-mono font-bold text-pink-200">
                            Status: Redeemed for Finale Points
                        </div>
                    </motion.div>
                ) : (
                    <div>
                        {/* Progress Bar */}
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-2">
                            <span>QUESTION {currentIndex + 1} OF {questions.length}</span>
                            <span>SCORE: {score}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-6">
                            <motion.div
                                className="h-full bg-gradient-to-r from-pink-500 to-yellow-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        {/* Question Title */}
                        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 mb-6">
                            <h4 className="text-sm font-bold text-white leading-relaxed" style={{ fontFamily: 'Space Grotesk' }}>
                                {currentQ?.question}
                            </h4>
                        </div>

                        {/* Options */}
                        <div className="space-y-2.5 mb-6">
                            {currentQ?.options?.map((option, idx) => {
                                const isChosen = selectedOption === idx;
                                const isCorrect = idx === correctIdx;
                                let border = '1px solid rgba(255, 255, 255, 0.1)';
                                let bg = 'rgba(255, 255, 255, 0.03)';
                                let text = 'text-zinc-200';

                                if (isAnswered) {
                                    if (isCorrect) {
                                        border = '1px solid #10B981';
                                        bg = 'rgba(16, 185, 129, 0.2)';
                                        text = 'text-emerald-300 font-bold';
                                    } else if (isChosen) {
                                        border = '1px solid #EF4444';
                                        bg = 'rgba(239, 68, 68, 0.2)';
                                        text = 'text-rose-300 font-bold';
                                    }
                                }

                                return (
                                    <button
                                        key={idx}
                                        disabled={isAnswered}
                                        onClick={() => handleSelect(idx)}
                                        className="w-full p-3.5 rounded-2xl flex items-center justify-between text-left text-xs font-mono transition-all cursor-pointer select-none"
                                        style={{ background: bg, border }}
                                    >
                                        <span className={text}>{option}</span>
                                        {isAnswered && isCorrect && <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />}
                                        {isAnswered && isChosen && !isCorrect && <XCircle size={16} className="text-rose-400 flex-shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>

                        {isAnswered && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleNext}
                                className="w-full py-3 rounded-2xl font-mono text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                            >
                                Next Question <ArrowRight size={14} />
                            </motion.button>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
