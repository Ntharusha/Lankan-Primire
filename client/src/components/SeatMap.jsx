import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const SeatMap = ({ seatGrid, selectedSeats, onSeatClick, heatmap, friendsSeats = [] }) => {
    const isFriendSeat = (seatNumber) => friendsSeats.some(f => f.seatNumber === seatNumber);
    const getFriendName = (seatNumber) => friendsSeats.find(f => f.seatNumber === seatNumber)?.friendName || 'Friend';
    const getSeatColor = (seat) => {
        if (seat.isLocked) return '#4A5568'; // Locked/Gray
        if (!seat.isAvailable) return '#E53E3E'; // Occupied/Red
        if (selectedSeats.includes(seat.seatNumber)) return '#F84565'; // Selected/Pink

        // Category colors
        switch (seat.category) {
            case 'Balcony': return '#00D2FF';
            case 'Box': return '#FFD700';
            case 'Couple': return '#FF69B4';
            default: return '#2D3748'; // ODC/Default
        }
    };

    const getHeatmapStyle = (seatNumber) => {
        if (!heatmap || !heatmap.seatPopularity) return null;
        const count = heatmap.seatPopularity[seatNumber] || 0;
        if (count === 0) return null;

        const ratio = count / heatmap.maxCount;
        let color = '#00D2FF'; // Cold
        if (ratio > 0.7) color = '#F84565'; // Hot
        else if (ratio > 0.4) color = '#FFD700'; // Warm

        return {
            stroke: color,
            strokeWidth: 3,
            filter: `drop-shadow(0 0 8px ${color})`,
            strokeOpacity: 0.8
        };
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-2xl mb-12">
                <div className="h-2 w-full bg-gradient-to-r from-transparent via-nebula-accent to-transparent rounded-full shadow-[0_0_15px_rgba(0,210,255,0.5)]"></div>
                <p className="text-center text-xs text-nebula-accent mt-2 tracking-widest uppercase">Screen</p>
            </div>

            <svg width="100%" height="auto" viewBox="0 0 800 500" className="max-w-3xl overflow-visible">
                {seatGrid && seatGrid.map((row, rowIndex) => (
                    <g key={rowIndex}>
                        {row.map((seat, seatIndex) => {
                            const x = 50 + seatIndex * 60;
                            const y = 50 + rowIndex * 60;
                            const isSelected = selectedSeats.includes(seat.seatNumber);
                            const hStyle = getHeatmapStyle(seat.seatNumber);
                            const sitsFriend = isFriendSeat(seat.seatNumber);

                            return (
                                <motion.g
                                    key={seat.seatNumber}
                                    whileHover={seat.isAvailable && !seat.isLocked ? { scale: 1.2 } : {}}
                                    className="cursor-pointer"
                                    onClick={() => seat.isAvailable && !seat.isLocked && onSeatClick(seat.seatNumber)}
                                >
                                    <rect
                                        x={x}
                                        y={y}
                                        width="40"
                                        height="40"
                                        rx="8"
                                        fill={getSeatColor(seat)}
                                        className="transition-all duration-500"
                                        fillOpacity={isSelected ? 1 : 0.6}
                                        stroke={isSelected ? "#00D2FF" : (hStyle?.stroke || "rgba(255,255,255,0.1)")}
                                        strokeWidth={isSelected ? "2" : (hStyle?.strokeWidth || "1")}
                                        style={!isSelected ? hStyle : {}}
                                    />
                                    <text
                                        x={x + 20}
                                        y={y + 25}
                                        textAnchor="middle"
                                        className="text-[10px] fill-white pointer-events-none font-bold select-none"
                                    >
                                        {seat.seatNumber}
                                    </text>

                                    {seat.isLocked && (
                                        <circle cx={x + 35} cy={y + 5} r="5" fill="#FBD38D" />
                                    )}

                                    {sitsFriend && !isSelected && (
                                        <g>
                                            <circle cx={x + 20} cy={y-8} r="10" fill="#00FF88" className="animate-pulse" />
                                            <Users size={12} x={x + 14} y={y - 14} className="text-black" />
                                            <text x={x+20} y={y-22} textAnchor="middle" className="text-[8px] fill-[#00FF88] font-black uppercase tracking-widest">{getFriendName(seat.seatNumber)}</text>
                                        </g>
                                    )}
                                </motion.g>
                            );
                        })}
                    </g>
                ))}
            </svg>

            <div className="flex flex-col items-center gap-6 mt-12 w-full">
                <div className="flex flex-wrap justify-center gap-6 p-6 glass-card rounded-2xl w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#2D3748] opacity-60 border border-white/10"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">ODC</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#00D2FF] opacity-60 border border-white/10"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Balcony</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#FFD700] opacity-60 border border-white/10"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Box</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#FF69B4] opacity-60 border border-white/10"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Couple</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#E53E3E] opacity-60 border border-white/10"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Occupied</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#4A5568] opacity-60 border border-white/10"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Locked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#00FF88] shadow-[0_0_10px_#00FF88]"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#00FF88]">Friend</span>
                    </div>
                </div>

                {heatmap && (
                    <div className="flex items-center gap-8 px-8 py-4 glass-card rounded-2xl border-primary/20 animate-in fade-in zoom-in duration-500">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#F84565] shadow-[0_0_8px_#F84565]"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Top Pick</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Popular</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Steady</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SeatMap;
