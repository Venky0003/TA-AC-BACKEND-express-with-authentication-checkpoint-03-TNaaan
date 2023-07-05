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
