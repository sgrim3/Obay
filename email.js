var nodemailer = require('nodemailer');

// For sending emails.
// Create reusable transporter object using SMTP transport.
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.OBAY_GMAIL_USER,
    pass: process.env.OBAY_GMAIL_PASS
  }
});

// Setup e-mail data with unicode symbols.
var mailOptions = {
  from: 'Olin Obay<noreply@obay.herokuapp.com>', // sender address
  to: 'hdavidzhu@gmail.com', // list of receivers
  subject: 'Hello', // Subject line
  text: 'Hello world', // plaintext body
  html: '<b>Hello world</b>' // html body
};

export sendEmail = function (req, res){
  // Send mail with defined transport object.
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        res.error(error);
    }else{
        res.send('Message sent: ' + info.response);
    }
  });
}