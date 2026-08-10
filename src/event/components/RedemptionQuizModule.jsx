import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle2, Coins, Zap, Trophy, ArrowRight, Loader2, Lock, Clock } from 'lucide-react';
import { addUserSCoins, recordMemberQuizSubmission } from '../lib/eventState';

export function RedemptionQuizModule({ user, assignedTeam, questions = [], eventState, onFinished }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [earnedCoins, setEarnedCoins] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);

    // Lock reference to guarantee no double advancement / question skipping
    const isAdvancingRef = useRef(false);

    // Ensure we always have the full 21 question set even if DB table has fewer rows
    const questionsList = (Array.isArray(questions) && questions.length >= 21) ? questions : (user?.quizFallbackQuestions || questions);
    const currentQ = questionsList[currentIndex] || questionsList[0];
    const questionTimerSec = Number(currentQ?.timer_sec || currentQ?.timerSec) || 10;
    const [timeLeft, setTimeLeft] = useState(questionTimerSec);

    const optionsList = Array.isArray(currentQ?.options)
        ? currentQ.options
        : (typeof currentQ?.options === 'string' ? JSON.parse(currentQ.options) : []);

    // Reset per-question state when moving to a new question
    useEffect(() => {
        setTimeLeft(Number(currentQ?.timer_sec || currentQ?.timerSec) || 10);
        setSelectedOption(null);
        isAdvancingRef.current = false;
    }, [currentIndex]);

    // Single robust countdown timer per question
    useEffect(() => {
        if (quizComplete || !eventState?.quizLiveStarted || !currentQ || isAdvancingRef.current) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    advanceToNextQuestion(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentIndex, quizComplete, eventState?.quizLiveStarted]);

    const advanceToNextQuestion = (chosenIdx) => {
        if (isAdvancingRef.current) return; // Prevent double execution
        isAdvancingRef.current = true;

        const correctIdx = currentQ?.correct_index ?? currentQ?.correctIndex ?? 0;
        const rewardAmt = currentQ?.reward_s_coins ?? currentQ?.rewardSCoins ?? 30;

        let updatedScore = score;
        let updatedCoins = earnedCoins;

        if (chosenIdx !== null && chosenIdx === correctIdx) {
            updatedScore = score + 1;
            updatedCoins = earnedCoins + rewardAmt;
            setScore(updatedScore);
            setEarnedCoins(updatedCoins);
            if (user?.id) addUserSCoins(user.id, rewardAmt);
        }

        if (currentIndex + 1 < questionsList.length) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setQuizComplete(true);
            if (assignedTeam?.id) {
                recordMemberQuizSubmission(assignedTeam.id, user?.id, updatedScore, updatedCoins);
            }
            if (onFinished) onFinished({ score: updatedScore, earnedCoins: updatedCoins });
        }
    };

    const handleSelectOption = (idx) => {
        if (selectedOption !== null || isAdvancingRef.current) return;
        setSelectedOption(idx);
        setTimeout(() => {
            advanceToNextQuestion(idx);
        }, 300);
    };

    // 1. Locked Screen if Admin hasn't started quiz live yet
    if (!eventState?.quizLiveStarted && !quizComplete) {
        return (
            <div className="w-full max-w-xl mx-auto font-mono select-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-3xl backdrop-blur-2xl bg-black/60 border border-pink-500/30 text-center space-y-4 shadow-[0_0_40px_rgba(236,72,153,0.15)]"
                >
                    <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto text-pink-400">
                        <Lock size={28} className="animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-wider" style={{ fontFamily: 'Space Grotesk' }}>
                            Redemption Quiz Locked
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
                            Ground Crew will trigger the live redemption quiz simultaneously on stage. Standby!
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/15 border border-pink-500/30 text-xs font-bold text-pink-300">
                        <Clock size={14} className="animate-spin" /> Live Stage Sync Active
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="w-full max-w-xl mx-auto p-8 rounded-3xl bg-black/40 border border-pink-500/30 text-center">
                <Loader2 size={32} className="text-pink-400 animate-spin mx-auto mb-3" />
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Loading Redemption Questions...
                </h4>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto font-mono select-none">
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
                        <h3 className="text-base sm:text-lg font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>
                            Redemption Quiz
                        </h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-xs font-mono font-bold text-yellow-300">
                        <Coins size={12} className="text-yellow-400" />
                        +{earnedCoins} S
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
                            You completed the quiz and reclaimed <strong className="text-yellow-400">+{earnedCoins} S-Coins</strong>!
                        </p>
                        <div className="inline-block px-4 py-2 rounded-xl bg-pink-500/20 border border-pink-400/40 text-xs font-mono font-bold text-pink-200">
                            Status: Score Submitted to Stage Leaderboard
                        </div>
                    </motion.div>
                ) : (
                    <div>
                        {/* Progress Bar & Question Timer */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300 mb-2 font-bold">
                            <span>QUESTION {currentIndex + 1} OF {questions.length}</span>
                            <span className="flex items-center gap-1 text-pink-400 font-black">
                                <Clock size={13} /> {timeLeft}s
                            </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-6">
                            <motion.div
                                className="h-full bg-gradient-to-r from-pink-500 to-cyan-400"
                                initial={{ width: '100%' }}
                                animate={{ width: `${(timeLeft / questionTimerSec) * 100}%` }}
                                transition={{ duration: 1, ease: 'linear' }}
                            />
                        </div>

                        {/* Question Title */}
                        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 mb-6">
                            <h4 className="text-sm font-bold text-white leading-relaxed" style={{ fontFamily: 'Space Grotesk' }}>
                                {currentQ?.question}
                            </h4>
                        </div>

                        {/* Options - Silent selection (No answer reveal) */}
                        <div className="space-y-2.5 mb-2">
                            {optionsList.map((option, idx) => {
                                const isChosen = selectedOption === idx;
                                let border = '1px solid rgba(255, 255, 255, 0.1)';
                                let bg = 'rgba(255, 255, 255, 0.03)';
                                let text = 'text-zinc-200';

                                if (isChosen) {
                                    border = '1px solid #00F0FF';
                                    bg = 'rgba(0, 240, 255, 0.2)';
                                    text = 'text-cyan-300 font-bold';
                                }

                                return (
                                    <button
                                        key={idx}
                                        disabled={selectedOption !== null}
                                        onClick={() => handleSelectOption(idx)}
                                        className="w-full p-3.5 rounded-2xl flex items-center justify-between text-left text-xs font-mono transition-all cursor-pointer select-none"
                                        style={{ background: bg, border }}
                                    >
                                        <span className={text}>{option}</span>
                                        {isChosen && (
                                            <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
