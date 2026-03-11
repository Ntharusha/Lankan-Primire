import React from 'react';
import { motion } from 'framer-motion';

const SeatMap = ({ seatGrid, selectedSeats, onSeatClick }) => {
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
                                        className="transition-colors duration-300"
                                        fillOpacity={isSelected ? 1 : 0.6}
                                        stroke={isSelected ? "#00D2FF" : "rgba(255,255,255,0.1)"}
                                        strokeWidth={isSelected ? "2" : "1"}
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
                                </motion.g>
                            );
                        })}
                    </g>
                ))}
            </svg>

            <div className="flex flex-wrap justify-center gap-6 mt-12 p-6 glass-card rounded-2xl">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#2D3748] opacity-60 border border-white/10"></div>
                    <span className="text-sm">ODC</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#00D2FF] opacity-60 border border-white/10"></div>
                    <span className="text-sm">Balcony</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#FFD700] opacity-60 border border-white/10"></div>
                    <span className="text-sm">Box</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#FF69B4] opacity-60 border border-white/10"></div>
                    <span className="text-sm">Couple</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#E53E3E] opacity-60 border border-white/10"></div>
                    <span className="text-sm">Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#4A5568] opacity-60 border border-white/10"></div>
                    <span className="text-sm">Locked</span>
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
