let nodemailer = require('nodemailer');

const sendMail = (email, uniqueString) =>{
    var Transport = nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user:"rajv17270@gmail.com",
            pass:process.env.EMAIL_PASSWORD,
        }
    });

    var mailOptions;
    let sender = "Venkata Raju";
    mailOptions ={
        from: sender,
        to: email,
        subject: "Email confirmation/Verification",
        html:`Press <a href="http://localhost:3000/users/verify/${uniqueString}"> here </a> to verify your email. Thanks`
    };

    Transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.messageId)
        }
    });
}

module.exports = {sendMail}

// const nodemailer = require('nodemailer');

// async function sendTestEmail() {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'your-email@gmail.com',
//         pass: 'your-password'
//       }
//     });

//     const mailOptions = {
//       from: 'rajv17270@gmail.com',
//       to: email,
//       subject: "Eamil confirmation/Verification",
//       html: `Press <a href=http://localhost:3000/verify/${uniqueString}> here </a> to verify your email. Thanks`
//     }
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent:', info.messageId);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// }

// sendTestEmail();

// module.exports = {sendMail}