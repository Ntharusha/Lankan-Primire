import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Minus, ShoppingCart, Info, Sparkles } from 'lucide-react';

const snacks = [
    { id: 1, name: 'Premium Salted Popcorn', price: 450, category: 'Snacks', image: 'https://images.unsplash.com/photo-1572177191856-3cde618dee1f?w=400&q=80' },
    { id: 2, name: 'Cheese Burst Popcorn', price: 550, category: 'Snacks', image: 'https://images.unsplash.com/photo-1541311632060-6379963283f5?w=400&q=80' },
    { id: 3, name: 'Large Coca-Cola', price: 300, category: 'Cold Drinks', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80' },
    { id: 4, name: 'Sri Lankan Fish Rolls (2pcs)', price: 350, category: 'Savory', image: 'https://images.unsplash.com/photo-1589113110390-348274d89851?w=400&q=80' },
    { id: 5, name: 'Nachos with Salsa', price: 650, category: 'Snacks', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80' },
];

const CanteenMenu = ({ cart, onUpdateCart }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = ['All', 'Snacks', 'Cold Drinks', 'Savory'];

    const filteredSnacks = selectedCategory === 'All'
        ? snacks
        : snacks.filter(s => s.category === selectedCategory);

    const updateQuantity = (snack, delta) => {
        const currentQty = cart[snack.id]?.quantity || 0;
        const newQty = Math.max(0, currentQty + delta);

        if (newQty === 0) {
            const newCart = { ...cart };
            delete newCart[snack.id];
            onUpdateCart(newCart);
        } else {
            onUpdateCart({
                ...cart,
                [snack.id]: { ...snack, quantity: newQty }
            });
        }
    };

    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Fast Intermission</span>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Smart <span className="text-primary italic">Canteen</span></h2>
                </div>

                <div className="flex gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-primary text-white' : 'glass-card border-none text-gray-500'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredSnacks.map((snack) => (
                    <div key={snack.id} className="glass-card rounded-[2rem] p-4 flex gap-4 hover:border-white/10 transition-all group">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                            <img src={snack.image} alt={snack.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>

                        <div className="flex-1 py-1">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{snack.category}</p>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4">{snack.name}</h4>

                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-nebula-accent italic">Rs. {snack.price}</span>

                                <div className="flex items-center gap-4 glass-card border-none px-3 py-1.5 rounded-xl">
                                    <button
                                        onClick={() => updateQuantity(snack, -1)}
                                        className="text-gray-500 hover:text-white transition-colors"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="text-xs font-black text-white w-4 text-center">
                                        {cart[snack.id]?.quantity || 0}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(snack, 1)}
                                        className="text-primary hover:scale-110 transition-transform"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-8 p-6 glass-card rounded-[2rem] border-primary/20 bg-primary/5 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                                <ShoppingCart size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-white uppercase tracking-widest">{totalItems} Items Selected</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Pre-order discount applied</p>
                            </div>
                        </div>
                        <p className="text-xl font-black text-primary italic">Rs. {Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0)}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CanteenMenu;
