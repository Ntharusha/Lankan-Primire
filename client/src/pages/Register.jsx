import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Sparkles, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(name, email, password);
            toast.success('Welcome to the elite circle of Lankan Premiere!');
            navigate('/');
        } catch (err) {
            toast.error(err?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center bg-nebula-deep relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-nebula-accent/20 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-md relative z-10">
                <div className="glass-card p-10 rounded-[3rem] border-white/5 shadow-2xl">
                    <div className="flex flex-col items-center mb-10">
                        <div className="p-4 bg-nebula-accent/10 rounded-2xl mb-4 border border-nebula-accent/20">
                            <UserPlus className="w-8 h-8 text-nebula-accent" />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic">Join <span className="text-gradient">Elite</span></h1>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Become a patron of cinema</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-nebula-accent transition-colors" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm focus:border-nebula-accent/50 focus:bg-white/10 outline-none transition-all placeholder:text-gray-700"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-nebula-accent transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm focus:border-nebula-accent/50 focus:bg-white/10 outline-none transition-all placeholder:text-gray-700"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Choose Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-nebula-accent transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm focus:border-nebula-accent/50 focus:bg-white/10 outline-none transition-all placeholder:text-gray-700"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 rounded-2xl bg-nebula-accent text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-nebula-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    Confirm Membership <ChevronRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                            Already a patron?{' '}
                            <Link to="/login" className="text-nebula-accent hover:text-nebula-accent/80 transition-colors">Access account</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 opacity-30">
                    <Sparkles className="w-4 h-4 text-nebula-accent" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Secure Registration Flow</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
