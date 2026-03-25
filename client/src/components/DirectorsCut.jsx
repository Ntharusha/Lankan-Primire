import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { getPosterUrl } from '../utils/movieUtils';
import { useAuth } from '../context/AuthContext';

const DirectorsCut = () => {
    const { user } = useAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchRecommendations = async () => {
            setLoading(true);
            try {
                const data = await apiClient.get('/movies/recommendations');
                setRecommendations(data);
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [user]);

    if (!user || recommendations.length === 0) return null;

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-[2px] bg-primary"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Personalized Curation</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                            The <span className="text-gradient">Director's</span> Cut
                        </h2>
                    </motion.div>

                    <div className="flex items-center gap-6 p-6 glass-card rounded-3xl border-primary/20 bg-primary/5">
                        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                        <div>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">AI Engine Active</p>
                            <p className="text-white font-black uppercase text-sm italic">Just for {user.name.split(' ')[0]}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recommendations.slice(0, 3).map((movie, index) => (
                        <motion.div
                            key={movie._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            <Link to={`/movie/${movie._id}`}>
                                <div className="glass-card rounded-[3rem] overflow-hidden border-white/5 relative aspect-[16/10] group-hover:border-primary/30 transition-all duration-700">
                                    <img 
                                        src={getPosterUrl(movie.backdrop_path)} 
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                        alt={movie.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                                    
                                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {movie.moodTags?.slice(0,2).map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-[8px] font-black uppercase tracking-widest text-primary">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-primary transition-colors">{movie.title}</h3>
                                        <div className="mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black">
                                                <Play size={14} fill="currentColor" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">View Premiere</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Ambience */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[120px] -z-10 rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-nebula-accent/10 blur-[120px] -z-10 rounded-full"></div>
        </section>
    );
};

export default DirectorsCut;
