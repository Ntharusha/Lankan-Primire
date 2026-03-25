import React from 'react';
import { Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const LoyaltyBadge = ({ points }) => {
    // Determine level based on points
    const getLevel = (pts) => {
        if (pts >= 1000) return { name: 'Platinum', color: '#E5E4E2', icon: Award, bg: 'bg-slate-400/20' };
        if (pts >= 500) return { name: 'Gold', color: '#FFD700', icon: Award, bg: 'bg-yellow-500/20' };
        if (pts >= 100) return { name: 'Silver', color: '#C0C0C0', icon: Award, bg: 'bg-gray-400/20' };
        return { name: 'Bronze', color: '#CD7F32', icon: Zap, bg: 'bg-orange-700/20' };
    };

    const level = getLevel(points || 0);
    const Icon = level.icon;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-3 px-4 py-2 rounded-2xl border border-white/10 ${level.bg} backdrop-blur-md transition-all group hover:border-white/20`}
        >
            <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                <Icon size={16} fill={level.color} style={{ color: level.color }} />
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">
                    {level.name} Member
                </p>
                <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-white italic">{points || 0}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Pts</span>
                </div>
            </div>
        </motion.div>
    );
};

export default LoyaltyBadge;
