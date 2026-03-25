import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChevronRight, Star } from 'lucide-react';
import { getPosterUrl, handleImageError } from '../utils/movieUtils';

const RecentlyViewedCarousel = () => {
    const [recentMovies, setRecentMovies] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('recentlyViewed');
        if (stored) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setRecentMovies(JSON.parse(stored));
            } catch {
                console.error("Failed to parse recently viewed movies");
            }
        }
    }, []);

    if (recentMovies.length === 0) return null;

    return (
        <div className="w-full py-20 px-6 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-primary">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
                                Refined <span className="text-primary italic">History</span>
                            </h2>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">Your recently viewed movies</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide no-scrollbar -mx-4 px-4">
                    {recentMovies.map((movie, index) => (
                        <motion.div
                            key={movie._id + index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="shrink-0 group"
                        >
                            <Link to={`/movies/${movie._id}`} className="block relative w-64 aspect-[2/3] rounded-[2.5rem] overflow-hidden glass-card border-white/5 hover:border-primary/40 transition-all duration-700">
                                <img
                                    src={getPosterUrl(movie.poster_path)}
                                    alt={movie.title}
                                    onError={handleImageError}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity"></div>
                                
                                <div className="absolute bottom-8 left-8 right-8">
                                    <h3 className="text-lg font-black text-white uppercase tracking-tight italic mb-2 line-clamp-1">{movie.title}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/5">
                                            <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                            <span className="text-[10px] font-black text-white">{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{movie.runtime}m</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentlyViewedCarousel;
