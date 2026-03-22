require('dotenv').config();
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendWhatsAppConfirmation = async (booking) => {
    try {
        const phone = booking.user.phone;
        if (!phone) {
            console.log('No phone number for WhatsApp notification');
            return;
        }

        // Generate QR Code URL (using a free public API for easy sharing in WhatsApp text)
        // We could also send as attachment if using Twilio/Real API
        const qrContent = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${booking._id}`;

        const message = `
🍿 *LANKAN PREMIERE - BOOKING CONFIRMED* 🍿

Hi *${booking.user.name}*,

Your tickets have been secured! 🎟️

🎬 *Movie:* ${booking.show.movie.title}
🎭 *Theater:* ${booking.show.theater}
📅 *Showtime:* ${new Date(booking.show.showDateTime).toLocaleString()}
💺 *Seats:* ${booking.bookedSeats.join(', ')}
💰 *Amount:* Rs. ${booking.amount}

📲 *YOUR ENTRY PASS (QR CODE):*
${qrContent}

⚠️ *PLEASE SHOW THIS MESSAGE AT THE ENTRANCE.*

Enjoy your movie! 🥤✨
        `.trim();

        // SIMULATION ONLY: Log to console what would be sent
        console.log('\n--- SIMULATED WHATSAPP MESSAGE ---');
        console.log(`TO: ${phone}`);
        console.log('MESSAGE:', message);
        console.log('----------------------------------\n');

        /* 
        REAL INTEGRATION (TWILIO EXAMPLE):
        const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        await twilio.messages.create({
            body: message,
            from: 'whatsapp:+14155238886', // Twilio Sandbox Number
            to: `whatsapp:${phone}`
        });
        */
    } catch (error) {
        console.error('Error simulating WhatsApp notification:', error);
    }
};

const sendBookingConfirmation = async (booking) => {
    // Call WhatsApp instead of Email
    await sendWhatsAppConfirmation(booking);
};

const sendSplitInvite = async (booking, friend) => {
    // Similarly update for WhatsApp if needed, or leave for later
    console.log(`WhatsApp split invite would be sent to: ${friend.name}`);
};

module.exports = {
    sendBookingConfirmation,
    sendSplitInvite,
};
