import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { Download, Share2, MapPin, Calendar, Clock, Ticket as TicketIcon, Utensils, ChevronRight, ChevronLeft } from 'lucide-react';
import { getPosterUrl, getBackdropUrl } from '../utils/movieUtils';

const TicketWallet = ({ booking, onClose }) => {
    const [ticketQrUrl, setTicketQrUrl] = useState('');
    const [canteenQrUrl, setCanteenQrUrl] = useState('');
    const [activeSlide, setActiveSlide] = useState(0); // 0: Ticket, 1: Canteen

    const handleImageError = (e) => {
        e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
    };

    const hasCanteenOrder = booking.canteenOrder && booking.canteenOrder.length > 0;

    useEffect(() => {
        if (booking) {
            // Ticket QR
            QRCode.toDataURL(JSON.stringify({
                id: booking._id,
                type: 'ENTRY_PASS',
                seats: booking.bookedSeats
            }), {
                margin: 2,
                color: { dark: '#F84565', light: '#0B0E14' }
            }).then(url => setTicketQrUrl(url));

            // Canteen QR
            if (hasCanteenOrder) {
                QRCode.toDataURL(JSON.stringify({
                    id: booking._id,
                    type: 'CANTEEN_ORDER',
                    items: booking.canteenOrder
                }), {
                    margin: 2,
                    color: { dark: '#00FF88', light: '#0B0E14' }
                }).then(url => setCanteenQrUrl(url));
            }
        }
    }, [booking, hasCanteenOrder]);

    if (!booking) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-nebula-deep/90 backdrop-blur-2xl"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-card w-full max-w-lg rounded-[3rem] overflow-hidden border-primary/20 relative"
                onClick={e => e.stopPropagation()}
            >
                <AnimatePresence mode="wait">
                    {activeSlide === 0 ? (
                        <motion.div
                            key="entry"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="relative"
                        >
                            <div className="h-48 overflow-hidden">
                                <img src={getBackdropUrl(booking.show.movie.backdrop_path)} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-nebula-deep to-transparent opacity-80"></div>
                            </div>

                            <div className="absolute -bottom-10 left-8 p-1 glass-card rounded-2xl border-primary/20">
                                <img src={getPosterUrl(booking.show.movie.poster_path)} alt="" onError={handleImageError} className="w-24 h-36 object-cover rounded-xl" />
                            </div>

                            <div className="p-8 pt-12">
                                <div className="mb-8">
                                    <h2 className="text-3xl font-black text-gradient uppercase italic tracking-tighter mb-2">{booking.show.movie.title}</h2>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Official Entry Pass</p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Date</p>
                                                <p className="text-sm font-black uppercase text-white">{new Date(booking.show.showDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Time</p>
                                                <p className="text-sm font-black uppercase text-white">{new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Theater</p>
                                                <p className="text-sm font-black uppercase text-white truncate max-w-[120px]">{booking.show.theater.split(' ')[0]}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <TicketIcon className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Seats</p>
                                                <p className="text-sm font-black uppercase text-white">{booking.bookedSeats.join(', ')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center py-8 border-y border-white/5 relative mb-8">
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-nebula-deep"></div>
                                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-nebula-deep"></div>
                                    <img src={ticketQrUrl} alt="Entry QR" className="w-48 h-48 mb-4 mix-blend-screen" />
                                    <p className="text-[10px] font-black text-gray-700 tracking-[0.5em] uppercase">Scan for Theater entry</p>
                                </div>

                                {hasCanteenOrder && (
                                    <button
                                        onClick={() => setActiveSlide(1)}
                                        className="w-full glass-card py-4 rounded-2xl flex items-center justify-between px-6 border-primary/20 hover:bg-primary/5 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <Utensils className="w-5 h-5 text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white">View Canteen Pass</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="canteen"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-8"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <button onClick={() => setActiveSlide(0)} className="p-2 glass-card rounded-xl hover:text-primary transition-colors border-none">
                                    <ChevronLeft size={20} />
                                </button>
                                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Canteen <span className="text-primary">Order</span></h2>
                            </div>

                            <div className="space-y-4 mb-10 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {booking.canteenOrder.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 glass-card rounded-2xl border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary font-black">{item.quantity}x</div>
                                            <span className="text-sm font-bold text-white uppercase tracking-tight">{item.name}</span>
                                        </div>
                                        <span className="text-xs font-black text-gray-500 italic">Pre-paid</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col items-center py-8 border-y border-white/5 relative mb-8">
                                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-nebula-deep"></div>
                                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-nebula-deep"></div>
                                <img src={canteenQrUrl} alt="Canteen QR" className="w-48 h-48 mb-4 mix-blend-screen grayscale hue-rotate-90 brightness-200" style={{ filter: 'drop-shadow(0 0 10px #00FF8844)' }} />
                                <p className="text-[10px] font-black text-green-500/50 tracking-[0.5em] uppercase">Present at Canteen Counter</p>
                            </div>

                            <div className="p-6 bg-green-500/5 rounded-2xl border border-green-500/10">
                                <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed text-center">
                                    Skip the queue! Your order is prioritized. Go to the <span className="text-green-500">Fast-Track</span> lane.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="p-8 pt-0 flex gap-4">
                    <button className="flex-1 btn-primary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" /> Export Bundle
                    </button>
                    <button className="w-16 glass-card py-4 rounded-2xl flex items-center justify-center hover:text-primary transition-colors border-none">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TicketWallet;
