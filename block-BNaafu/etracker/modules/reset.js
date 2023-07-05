var nodemailer = require('nodemailer');

var sendResetEmail = (email, uniqueString) => {
  // Create a nodemailer transporter with your email service configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rajv17270@gmail.com',
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Compose the email message
  let sender = 'Venkata Raju';
  const mailOptions = {
    from: sender,
    to: email,
    subject: 'Reset Password',
    html: `Reset your password by clicking <a
     href="http://localhost:3000/users/reset-password/${uniqueString}">here</a>.Thanks`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = { sendResetEmail };
