import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Smile, Zap, Heart, Users, Ghost } from 'lucide-react';

const moods = [
    { name: 'Thrilled', icon: Zap, color: '#00D2FF', tag: 'Thrilled' },
    { name: 'Romantic', icon: Heart, color: '#F84565', tag: 'Romantic' },
    { name: 'Family', icon: Users, color: '#FFD700', tag: 'Family-time' },
    { name: 'Comedy', icon: Smile, color: '#00FF88', tag: 'Comedy' },
    { name: 'Horror', icon: Ghost, color: '#A020F0', tag: 'Horror' },
];

const MoodFilter = ({ onMoodSelect }) => {
    const [activeMood, setActiveMood] = useState(null);

    const handleMoodClick = (mood) => {
        const newVal = activeMood === mood.name ? null : mood.name;
        setActiveMood(newVal);
        onMoodSelect(newVal ? mood.tag : null);
    };

    return (
        <div className="w-full py-12">
            <div className="flex flex-col items-center mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="text-primary w-5 h-5 animate-pulse" />
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">How are you feeling?</h2>
                </div>
                <p className="text-gray-500 font-medium">Let our AI suggest the perfect movie for your mood.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
                {moods.map((mood) => {
                    const Icon = mood.icon;
                    const isActive = activeMood === mood.name;

                    return (
                        <motion.button
                            key={mood.name}
                            whileHover={{ y: -5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleMoodClick(mood)}
                            className={`relative px-8 py-5 rounded-[2rem] flex items-center gap-4 transition-all duration-500 ${isActive
                                ? 'btn-primary text-white'
                                : 'glass-card text-gray-400 hover:text-white border-white/5'
                                }`}
                        >
                            <div
                                className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/20' : 'bg-white/5'
                                    }`}
                                style={{ color: isActive ? '#fff' : mood.color }}
                            >
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="font-black uppercase tracking-widest text-sm">{mood.name}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="glow"
                                    className="absolute inset-0 rounded-[2rem] blur-xl -z-10"
                                    style={{ backgroundColor: mood.color, opacity: 0.3 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default MoodFilter;
