require('dotenv').config();
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

// ─── Transporter ──────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,   // App Password (not your Gmail password)
    },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generate a QR code PNG Buffer that encodes the booking ID.
 * The cinema scanner reads this to validate entry.
 */
const generateQRCodeBuffer = async (bookingId) => {
    return QRCode.toBuffer(String(bookingId), {
        type: 'png',
        width: 400,
        margin: 2,
        color: { dark: '#1a1a2e', light: '#ffffff' },
    });
};

/**
 * Format a date into a human-readable showtime string.
 */
const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-LK', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Colombo',
    });
};

// ─── Booking Confirmation Email ───────────────────────────────────────────────

/**
 * Sends a booking confirmation email with an embedded QR code ticket.
 * Falls back to console logging if EMAIL_USER / EMAIL_PASS are not configured.
 */
const sendBookingConfirmation = async (booking) => {
    const email = booking?.user?.email;
    if (!email) {
        console.log('[NotificationService] No email address on booking — skipping confirmation.');
        return;
    }

    // Graceful degradation: if email credentials are absent, log and return
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('[NotificationService] EMAIL_USER / EMAIL_PASS not set — logging ticket instead.');
        console.log(`  Booking ${booking._id} for ${email}`);
        console.log(`  Seats: ${booking.bookedSeats?.join(', ')} | Amount: Rs. ${booking.amount}`);
        return;
    }

    try {
        // Generate QR code PNG as a Buffer
        const qrBuffer = await generateQRCodeBuffer(booking._id);

        const movieTitle  = booking?.show?.movie?.title  || 'Your Movie';
        const theater     = booking?.show?.theater        || 'Lanka Theater';
        const showTime    = formatDateTime(booking?.show?.showDateTime);
        const seats       = (booking?.bookedSeats || []).join(', ');
        const amount      = booking?.amount || 0;
        const bookingRef  = String(booking._id).slice(-8).toUpperCase();

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body        { font-family: 'Segoe UI', Arial, sans-serif; background:#0f0f1a; color:#e0e0e0; margin:0; padding:0; }
    .wrapper    { max-width:600px; margin:0 auto; background:#1a1a2e; border-radius:12px; overflow:hidden; }
    .header     { background:linear-gradient(135deg,#e50914,#b20710); padding:32px 24px; text-align:center; }
    .header h1  { margin:0; color:#fff; font-size:28px; letter-spacing:2px; }
    .header p   { margin:6px 0 0; color:rgba(255,255,255,0.8); font-size:14px; }
    .body       { padding:28px 32px; }
    .label      { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#888; margin-bottom:4px; }
    .value      { font-size:18px; font-weight:600; color:#fff; margin-bottom:20px; }
    .divider    { border:none; border-top:1px solid #2a2a3e; margin:20px 0; }
    .qr-section { text-align:center; padding:24px 0; }
    .qr-section img { border-radius:8px; border:4px solid #e50914; }
    .qr-label   { margin-top:12px; font-size:12px; color:#888; }
    .ref-badge  { display:inline-block; background:#e50914; color:#fff; font-size:13px;
                  font-weight:700; letter-spacing:2px; padding:6px 16px; border-radius:20px;
                  margin-top:8px; }
    .footer     { background:#0f0f1a; padding:16px 32px; text-align:center;
                  font-size:12px; color:#555; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>🎬 LANKAN PREMIERE</h1>
    <p>Your ticket has been confirmed</p>
  </div>
  <div class="body">
    <p>Hi <strong>${booking.user.name}</strong>, enjoy the show! 🍿</p>
    <hr class="divider"/>

    <div class="label">Movie</div>
    <div class="value">${movieTitle}</div>

    <div class="label">Theater</div>
    <div class="value">${theater}</div>

    <div class="label">Showtime</div>
    <div class="value">${showTime}</div>

    <div class="label">Seats</div>
    <div class="value">${seats}</div>

    <div class="label">Total Paid</div>
    <div class="value">Rs. ${amount.toLocaleString()}</div>

    <hr class="divider"/>
    <div class="qr-section">
      <p class="label" style="margin-bottom:12px;">Show this QR code at the entrance</p>
      <img src="cid:booking-qr" alt="Entry QR Code" width="220" height="220"/>
      <div class="qr-label">Booking Reference</div>
      <div class="ref-badge">#${bookingRef}</div>
    </div>
  </div>
  <div class="footer">
    Lankan Premiere · Colombo, Sri Lanka<br/>
    This is an automated ticket — please do not reply to this email.
  </div>
</div>
</body>
</html>`;

        await transporter.sendMail({
            from: `"Lankan Premiere 🎬" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `🎟️ Your ticket for ${movieTitle} — Ref #${bookingRef}`,
            html,
            attachments: [
                {
                    filename: `lankan-premiere-ticket-${bookingRef}.png`,
                    content:  qrBuffer,
                    cid:      'booking-qr',       // Referenced in HTML as <img src="cid:booking-qr">
                    contentType: 'image/png',
                },
            ],
        });

        console.log(`[NotificationService] ✅ Confirmation email sent to ${email} (Ref #${bookingRef})`);

    } catch (error) {
        // Never crash the booking flow due to email failure
        console.error('[NotificationService] ❌ Failed to send confirmation email:', error.message);
    }
};

// ─── Split Payment Invite Email ───────────────────────────────────────────────

/**
 * Sends a payment request email to a friend in a split booking.
 */
const sendSplitInvite = async (booking, friend) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[NotificationService] Split invite would be sent to: ${friend.name} <${friend.email}>`);
        return;
    }

    try {
        const movieTitle = booking?.show?.movie?.title || 'a movie';
        const shareAmount = friend.amount?.toLocaleString() || '0';
        const payLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/split/${booking._id}/pay?email=${encodeURIComponent(friend.email)}`;

        await transporter.sendMail({
            from: `"Lankan Premiere 🎬" <${process.env.EMAIL_USER}>`,
            to: friend.email,
            subject: `${booking.user.name} invited you to split a ticket for ${movieTitle}`,
            html: `
<div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;background:#1a1a2e;color:#e0e0e0;border-radius:10px;overflow:hidden;">
  <div style="background:#e50914;padding:24px;text-align:center;">
    <h2 style="margin:0;color:#fff;">Split Ticket Invite 🎬</h2>
  </div>
  <div style="padding:24px;">
    <p>Hi <strong>${friend.name}</strong>,</p>
    <p><strong>${booking.user.name}</strong> has reserved seats for <strong>${movieTitle}</strong> and invited you to split the cost.</p>
    <p style="font-size:22px;font-weight:bold;color:#e50914;text-align:center;">Your share: Rs. ${shareAmount}</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${payLink}" 
         style="background:#e50914;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
        Pay My Share
      </a>
    </div>
    <p style="font-size:12px;color:#888;text-align:center;">⏳ This link expires in 15 minutes.</p>
  </div>
</div>`,
        });

        console.log(`[NotificationService] ✅ Split invite sent to ${friend.email}`);

    } catch (error) {
        console.error(`[NotificationService] ❌ Failed to send split invite to ${friend.email}:`, error.message);
    }
};

module.exports = {
    sendBookingConfirmation,
    sendSplitInvite,
};
