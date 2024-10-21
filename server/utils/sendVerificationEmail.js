const nodemailer = require('nodemailer');
// reference:
// https://medium.com/@y.mehnati_49486/how-to-send-an-email-from-your-gmail-account-with-nodemailer-837bf09a7628
const sendVerificationEmail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    // service: 'hotmail',
    service: 'gmail',
    auth: {
      user: 'marketplace.ubc@gmail.com',
      pass: 'ujookuppvcljxqqz',
      // pass: 'cpsc455@UBC',
    },
  });

  const mailOptions = {
    from: '	marketplace.ubc@gmail.com',
    to: user.email,
    subject: 'Email Verification - UBC MarketPlace',
    text: `Please verify your email by clicking the following link: 
    https://ubcmarketplace-backend.onrender.com/auth/verify-email?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
