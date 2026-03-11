const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendBookingConfirmation = async (booking) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.user.email,
        subject: `Lankan Premiere - Booking Confirmed: ${booking.show.movie.title}`,
        html: `
      <h1>Booking Confirmed!</h1>
      <p>Dear ${booking.user.name},</p>
      <p>Your seats ${booking.bookedSeats.join(', ')} for <b>${booking.show.movie.title}</b> have been secured.</p>
      <p>Showtime: ${new Date(booking.show.showDateTime).toLocaleString()}</p>
      <p>Theater: ${booking.show.theater}</p>
      <p>Total Paid: Rs. ${booking.amount}</p>
      <br/>
      <p>Enjoy your movie!</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${booking.user.email}`);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};

const sendSplitInvite = async (booking, friend) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: friend.email,
        subject: `Lankan Premiere - You're invited to a movie!`,
        html: `
      <h1>Movie Invitation</h1>
      <p>Hi ${friend.name},</p>
      <p>${booking.user.name} has invited you to watch <b>${booking.show.movie.title}</b>.</p>
      <p>Your share for the ticket is <b>Rs. ${friend.amount}</b>.</p>
      <p>Please pay within 15 minutes to secure the group booking.</p>
      <a href="${process.env.FRONTEND_URL}/pay-split/${booking._id}?email=${friend.email}">Pay Now</a>
      <br/>
      <p>Lankan Premiere</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Split invite sent to ${friend.email}`);
    } catch (error) {
        console.error('Error sending split invite:', error);
    }
};

module.exports = {
    sendBookingConfirmation,
    sendSplitInvite,
};
