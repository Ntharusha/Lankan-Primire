/* eslint-env node */
import { io } from "socket.io-client";
import axios from "axios";

// 1. Connect to the local backend Socket.IO server
const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("🟢 Connected to WebSocket as Admin Dashboard would.");
  
  // 2. Wait 2 seconds to ensure connection, then trigger a booking
  setTimeout(async () => {
    console.log("🛒 Simulating a booking purchase...");
    try {
      const response = await axios.post("http://localhost:5000/api/bookings", {
        user: {
          name: "Test User",
          email: "test@example.com",
        },
        show: {
          movie: { title: "Test Movie" },
          theater: "Test Theater",
          showDateTime: new Date().toISOString(),
          price: 1500,
        },
        bookedSeats: ["A1", "A2"],
        amount: 3000,
        paymentIntentId: `pi_mock_${Date.now()}`,
        isPaid: true,
        status: "confirmed"
      });
      console.log("✅ API responded with success:", response.status);
    } catch (err) {
      console.error("❌ API Error:", err.message);
    }
  }, 2000);
});

// 3. Listen for the event that the Admin Dashboard uses
socket.on("booking_completed", (data) => {
  console.log("🔥 REAL-TIME EVENT RECEIVED: booking_completed");
  console.log("Ticket Details:", {
    id: data._id,
    amount: data.amount,
    seats: data.bookedSeats
  });
  console.log("🎉 Test passed! Admin Dashboard Live Updates are working.");
  process.exit(0);
});

// Timeout after 10 seconds if no event received
setTimeout(() => {
  console.log("❌ Test failed: No WebSocket event received within 10 seconds.");
  process.exit(1);
}, 10000);
