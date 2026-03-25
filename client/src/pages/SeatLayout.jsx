import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Monitor, Check, Clock, Utensils, X, Loader2, Flame } from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import SeatMap from '../components/SeatMap';
import CanteenMenu from '../components/CanteenMenu';
import MockCheckoutForm from '../components/MockCheckoutForm';
import socket from '../services/socket';
import { getShowById } from '../services/showService';
import apiClient from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';


const SeatLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBooking } = useBookings();
  const { user } = useAuth();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  // Ref to always have fresh selectedSeats in timer callback (avoids stale closures)
  const selectedSeatsRef = useRef([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  // Keep ref in sync with selectedSeats state
  useEffect(() => { selectedSeatsRef.current = selectedSeats; }, [selectedSeats]);
  const [lockedSeats, setLockedSeats] = useState([]); // Seats locked by OTHERS
  const [seatGrid, setSeatGrid] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600);
  const [canteenCart, setCanteenCart] = useState({});
  const [isCanteenOpen, setIsCanteenOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const [clientSecret, setClientSecret] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [preparingPayment, setPreparingPayment] = useState(false);
  
  // Heatmap State
  const [heatmap, setHeatmap] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Initialize User/Guest ID
  useEffect(() => {
    if (user) {
      setUserId(user._id);
    } else {
      let guestId = localStorage.getItem('guestSessionId');
      if (!guestId) {
        guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('guestSessionId', guestId);
      }
      setUserId(guestId);
    }
  }, [user]);

  // Fetch Show Data & Initialize Socket
  useEffect(() => {
    const fetchShow = async () => {
      try {
        console.log('🎬 Fetching show with ID:', id);
        const data = await getShowById(id);
        console.log('✅ Show data loaded:', data);

        if (!data) {
          toast.error("Show not found");
          setLoading(false);
          return;
        }

        setShow(data);
        setSeatGrid(data.seatGrid);

        // Populate initially locked seats from DB
        const initialLocked = [];
        data.seatGrid.forEach(row => {
          row.forEach(seat => {
            if (seat.isLocked && seat.lockedBy !== userId) {
              // If it's locked by someone else, add to lockedSeats
              initialLocked.push(seat.seatNumber);
            }
          });
        });
        setLockedSeats(initialLocked);
      } catch (error) {
        console.error("❌ Failed to fetch show:", error);
        toast.error("Failed to load show details");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchShow();
    }
  }, [id, userId]);

  // Socket Listeners
  useEffect(() => {
    if (!userId) return;

    socket.emit('join_show', id);

    const handleSeatLocked = (data) => {
      if (data.showId === id) {
        if (data.userId !== userId) {
          setLockedSeats(prev => [...prev, data.seatNumber]);
          setSelectedSeats(prev => prev.filter(s => s !== data.seatNumber));
          toast(`${data.seatNumber} was locked by another user`, { icon: '🔒' });
        }
      }
    };

    const handleSeatUnlocked = (data) => {
      if (data.showId === id) {
        setLockedSeats(prev => prev.filter(s => s !== data.seatNumber));
      }
    };

    const handleSocketError = (data) => {
      toast.error(data.message);
      if (data.seatNumber) {
        setSelectedSeats(prev => prev.filter(s => s !== data.seatNumber));
      }
    };

    socket.on('seat_locked', handleSeatLocked);
    socket.on('seat_unlocked', handleSeatUnlocked);
    socket.on('error', handleSocketError);

    return () => {
      socket.off('seat_locked', handleSeatLocked);
      socket.off('seat_unlocked', handleSeatUnlocked);
      socket.off('error', handleSocketError);
    };
  }, [id, userId]);

  // Timer for selection expiration
  useEffect(() => {
    if (selectedSeats.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Use ref to get current selectedSeats without stale closure
          const currentSeats = selectedSeatsRef.current;
          currentSeats.forEach(seatId => {
            socket.emit('unlock_seat', { showId: id, seatNumber: seatId, userId });
          });
          setSelectedSeats([]);
          toast.error('Session expired. Seats released.');
          return 600;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedSeats.length, id, userId]);

  const toggleSeat = (seatId) => {
    if (!user) {
      toast.error("Please login to secure a seat");
      navigate('/login');
      return;
    }

    if (lockedSeats.includes(seatId)) {
      toast.error("Seat is already locked by another user");
      return;
    }

    // Find seat in grid to check availability (from static data) if needed, 
    // but we rely on lockedSeats and selectedSeats mostly.

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
      socket.emit('unlock_seat', { showId: id, seatNumber: seatId, userId });
    } else {
      if (selectedSeats.length >= 10) {
        toast.error('Maximum 10 seats per booking');
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
      socket.emit('lock_seat', { showId: id, seatNumber: seatId, userId });
      setTimeLeft(600);
    }
  };

  const canteenTotal = Object.values(canteenCart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // User dynamic price if available, else basePrice.
  // Ideally show.currentPrice handles DDP.
  const ticketPrice = show?.currentPrice || show?.basePrice || 0;
  const totalAmount = (selectedSeats.length * ticketPrice) + canteenTotal;

  const initiatePayment = async () => {
    setPreparingPayment(true);
    try {
      const response = await apiClient.post('/payments/create-payment-intent', {
        amount: totalAmount,
        bookingId: null // We create the booking AFTER payment or associate it later
      });
      setClientSecret(response.clientSecret);
      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setPreparingPayment(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    setIsPaymentModalOpen(false);

    // Create final booking
    const bookingData = {
      user: {
        name: user?.name || 'Guest',
        email: user?.email || 'guest@example.com',
        phone: paymentIntent.whatsappNumber || '' // WhatsApp number from form
      },
      show: {
        movie: show.movie,
        showDateTime: show.dateTime,
        showPrice: ticketPrice,
        theater: show.theater?.name || show.theater || 'Unknown Theater',
        showId: show._id
      },
      amount: totalAmount,
      bookedSeats: selectedSeats,
      canteenOrder: Object.values(canteenCart),
      isPaid: true,
      paymentIntentId: paymentIntent.id,
      paymentStatus: 'paid'
    };

    addBooking(bookingData);
    toast.success('Payment Successful! Booking Confirmed.', { duration: 5000 });
    navigate('/my-bookings');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleHeatmap = async () => {
    if (!showHeatmap && !heatmap) {
        try {
            const data = await apiClient.get(`/shows/${id}/heatmap`);
            setHeatmap(data);
        } catch (error) {
            console.error("Heatmap fetch failed:", error);
            toast.error("Failed to load popularity data");
            return;
        }
    }
    setShowHeatmap(!showHeatmap);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  if (!show) return <div className="p-24 text-center text-white">Show not found</div>;

  const movieDate = new Date(show.dateTime).toLocaleDateString();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 glass-card rounded-xl hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-gradient uppercase tracking-tighter italic">{show.movie?.title || 'Loading...'}</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{show.theater?.name || ''} • {movieDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {selectedSeats.length > 0 && (
              <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-4 border-primary/20 bg-primary/5">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Reserved for</p>
                  <p className="text-xl font-black text-primary tabular-nums italic">{formatTime(timeLeft)}</p>
                </div>
              </div>
            )}
            <button
              onClick={toggleHeatmap}
              className={`glass-card px-6 py-3 rounded-2xl flex items-center gap-4 transition-all border-none relative group ${showHeatmap ? 'bg-orange-500/20 ring-2 ring-orange-500/50' : ''}`}
            >
              <div className={`p-2 rounded-xl transition-colors ${showHeatmap ? 'bg-orange-500 text-white animate-pulse' : 'bg-white/5 text-orange-500 group-hover:bg-white/10'}`}>
                <Flame size={20} fill={showHeatmap ? "currentColor" : "none"} />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-500 font-bold uppercase">View Seat</p>
                <p className={`text-sm font-black uppercase italic ${showHeatmap ? 'text-orange-500' : 'text-white'}`}>Popularity</p>
              </div>
            </button>
            <button
              onClick={() => setIsCanteenOpen(true)}
              className="glass-card px-6 py-3 rounded-2xl flex items-center gap-4 hover:border-primary/30 transition-all border-none relative group"
            >
              <div className="p-2 bg-primary rounded-xl text-white group-hover:rotate-12 transition-transform">
                <Utensils size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-500 font-bold uppercase">Pre-order</p>
                <p className="text-sm font-black text-white uppercase italic">Snacks</p>
              </div>
              {Object.keys(canteenCart).length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] font-black text-white animate-bounce">
                  {Object.values(canteenCart).reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <div className="glass-card p-12 rounded-[3rem] overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
              {/* Pass the updated seat grid combining static layout + lock status */}
              <SeatMap
                seatGrid={seatGrid.map(row => row.map(seat => ({
                  ...seat,
                  isLocked: lockedSeats.includes(seat.seatNumber) || (seat.isLocked && seat.lockedBy !== userId)
                })))}
                selectedSeats={selectedSeats}
                onSeatClick={toggleSeat}
                heatmap={showHeatmap ? heatmap : null}
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="glass-card p-8 rounded-[3rem] sticky top-24 border-white/5 border-t-primary/20 border-t-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic">Your <span className="text-primary">Selection</span></h3>

              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Seats</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.length > 0 ? selectedSeats.map(s => (
                        <span key={s} className="px-3 py-1.5 glass-card rounded-xl text-xs font-black text-white border-primary/20 uppercase">{s}</span>
                      )) : <p className="text-gray-600 font-bold italic text-xs">No seats selected</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Tickets</p>
                    <p className="font-black text-xl text-white italic">Rs. {selectedSeats.length * ticketPrice}</p>
                  </div>
                </div>

                {Object.keys(canteenCart).length > 0 && (
                  <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 mt-6">
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-4">Canteen Pre-order</p>
                    <div className="space-y-3">
                      {Object.values(canteenCart).map(item => (
                        <div key={item.id} className="flex justify-between text-xs">
                          <span className="text-gray-300 font-medium">{item.name} <span className="text-primary font-black ml-1">x{item.quantity}</span></span>
                          <span className="text-white font-black">Rs. {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/5 pt-8 mb-10">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-500 text-xs font-black uppercase tracking-widest">Grand Total</span>
                  <span className="text-4xl font-black text-gradient italic">Rs. {totalAmount}</span>
                </div>
                <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Inclusive of all taxes & DDP</p>
              </div>

              <button
                onClick={initiatePayment}
                disabled={selectedSeats.length === 0 || preparingPayment}
                className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center ${selectedSeats.length > 0
                  ? 'btn-primary text-white shadow-2xl shadow-primary/40'
                  : 'bg-white/5 text-gray-700 cursor-not-allowed border border-white/5'
                  }`}
              >
                {preparingPayment ? <Loader2 className="animate-spin w-5 h-5" /> : 'Proceed to Payment'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isCanteenOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-nebula-deep/90 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card w-full max-w-4xl rounded-[3rem] p-10 relative overflow-hidden"
            >
              <button
                onClick={() => setIsCanteenOpen(false)}
                className="absolute top-8 right-8 p-3 glass-card rounded-2xl hover:text-primary transition-colors border-none"
              >
                <X size={20} />
              </button>
              <CanteenMenu cart={canteenCart} onUpdateCart={setCanteenCart} />
              <div className="mt-10 flex justify-end">
                <button
                  onClick={() => setIsCanteenOpen(false)}
                  className="btn-primary px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
                >
                  Confirm Snacks
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPaymentModalOpen && clientSecret && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-nebula-deep/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md"
            >
              <div className="glass-card p-8 rounded-[2rem] relative">
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="absolute top-4 right-4 z-50 p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-white"
                >
                  <X size={20} />
                </button>

                <MockCheckoutForm
                  onSuccess={handlePaymentSuccess}
                  amount={totalAmount}
                  clientSecret={clientSecret}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeatLayout;
