import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronRight, Check, RefreshCcw, Smile, Zap, Heart, Users, Ghost } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPosterUrl } from '../utils/movieUtils';

const questions = [
    {
        id: 1,
        question: "Your ideal snack for today?",
        options: [
            { label: "Classic Buttery Popcorn", value: "popcorn", icon: "🍿" },
            { label: "Spicy Volcano Ramen", value: "spicy", icon: "🍜" },
            { label: "Wine & Gourmet Cheese", value: "wine", icon: "🍷" },
            { label: "Cotton Candy & Sweets", value: "sweets", icon: "🍭" },
            { label: "Whatever is in the fridge", value: "any", icon: "🍕" }
        ]
    },
    {
        id: 2,
        question: "How's the energy level?",
        options: [
            { label: "I need an adrenaline hit!", value: "high", icon: "⚡" },
            { label: "Just want to feel cozy and safe.", value: "low", icon: "🏡" },
            { label: "Searching for deep emotions.", value: "medium", icon: "🎭" },
            { label: "I need to laugh until it hurts.", value: "fun", icon: "😂" },
            { label: "Something dark and mysterious.", value: "dark", icon: "🌑" }
        ]
    },
    {
        id: 3,
        question: "Who are you with?",
        options: [
            { label: "Flying solo tonight.", value: "solo", icon: "👤" },
            { label: "Date night with my favorite person.", value: "date", icon: "💑" },
            { label: "The whole family! Kid-friendly please.", value: "family", icon: "👨‍👩‍👧‍👦" },
            { label: "A group of chaotic friends.", value: "friends", icon: "🍟" },
            { label: "My cat/dog (they don't judge).", value: "pet", icon: "🐾" }
        ]
    }
];

const VibeQuiz = ({ movies, onClose }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const handleOption = (val) => {
        const newAnswers = { ...answers, [questions[step].id]: val };
        setAnswers(newAnswers);
        
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (finalAnswers) => {
        // Simple logic mapping
        let targetMood = 'Thrilled';
        
        if (finalAnswers[2] === 'dark') targetMood = 'Horror';
        else if (finalAnswers[3] === 'family' || finalAnswers[2] === 'low') targetMood = 'Family-time';
        else if (finalAnswers[2] === 'fun') targetMood = 'Comedy';
        else if (finalAnswers[2] === 'medium' || finalAnswers[3] === 'date') targetMood = 'Romantic';
        else if (finalAnswers[2] === 'high') targetMood = 'Thrilled';

        const matches = movies.filter(m => m.moodTags?.includes(targetMood));
        if (matches.length > 0) {
            // eslint-disable-next-line react-hooks/purity
            setResult(matches[Math.floor(Math.random() * matches.length)]);
        } else if (movies.length > 0) {
            // eslint-disable-next-line react-hooks/purity
            setResult(movies[Math.floor(Math.random() * movies.length)]);
        }
        setStep(questions.length);
    };

    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-[#050608]/95 backdrop-blur-2xl">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="w-full max-w-2xl glass-card rounded-[3.5rem] border-white/5 relative overflow-hidden p-10 md:p-16"
            >
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-8 right-8 p-3 glass-card rounded-2xl hover:text-primary transition-colors border-none group">
                    <X size={20} className="group-hover:rotate-90 transition-transform" />
                </button>

                <AnimatePresence mode="wait">
                    {step < questions.length ? (
                        <motion.div 
                            key={step}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            className="space-y-12"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Sparkles className="text-primary w-4 h-4 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Step {step + 1} of 3</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-white leading-none">
                                    {questions[step].question}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {questions[step].options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleOption(opt.value)}
                                        className="w-full p-6 glass-card rounded-[2rem] border-white/5 hover:border-primary/40 hover:bg-primary/5 text-left flex items-center gap-6 group transition-all"
                                    >
                                        <div className="text-3xl grayscale group-hover:grayscale-0 group-hover:scale-125 transition-all bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center">
                                            {opt.icon}
                                        </div>
                                        <span className="text-lg font-bold text-gray-300 group-hover:text-white transition-colors">{opt.label}</span>
                                        <ChevronRight className="ml-auto w-5 h-5 text-gray-700 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-8"
                        >
                            <div className="mb-12">
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/20 rounded-full border border-primary/30 mb-6">
                                    <Check className="text-primary w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Match Found!</span>
                                </div>
                                <h2 className="text-5xl font-black uppercase tracking-tighter italic text-white mb-2">Your Movie Soulmate</h2>
                                <p className="text-gray-500 font-medium">Based on your current vibe, we found the perfect premiere.</p>
                            </div>

                            {result && (
                                <Link to={`/movies/${result._id}`} onClick={onClose} className="group block mb-12">
                                    <div className="relative max-w-sm mx-auto aspect-[2/3] rounded-[3rem] overflow-hidden border border-white/5 group-hover:border-primary/50 transition-all duration-700 shadow-2xl shadow-black">
                                        <img 
                                            src={getPosterUrl(result.poster_path)} 
                                            alt={result.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                        <div className="absolute bottom-10 left-10 right-10 text-left">
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tight italic mb-2 line-clamp-1">{result.title}</h3>
                                            <div className="flex items-center gap-3">
                                               <span className="text-xs font-black text-primary uppercase tracking-widest">Available Now</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                                {result && (
                                    <Link 
                                        to={`/movies/${result._id}`} 
                                        onClick={onClose}
                                        className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-transform italic"
                                    >
                                        Unlock Premiere
                                    </Link>
                                )}
                                <button 
                                    onClick={() => { setStep(0); setAnswers({}); setResult(null); }}
                                    className="w-full sm:w-auto px-10 py-5 glass-card rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-white/5 transition-all italic border-white/5"
                                >
                                    <RefreshCcw size={14} className="text-primary" /> Try Again
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default VibeQuiz;
