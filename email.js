var nodemailer = require('nodemailer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// For sending emails.
// Create reusable transporter object using SMTP transport.
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.OBAY_GMAIL_USER || '',
    pass: process.env.OBAY_GMAIL_PASS || ''
  }
});

var email = {};

email.sendEmail = function (req, res, next){

  // Setup e-mail data with unicode symbols.
  var mailOptions = {
    from: 'Olin Obay<noreply@obay.herokuapp.com>', // sender address
    to: req.body.emailTo ||'hdavidzhu@gmail.com', // list of receivers
    subject: req.body.emailSubject || 'Hello', // Subject line
    text: req.body.emailText || 'Hello world' // plaintext body
  };

  // Send mail with defined transport object.
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      res.status(500).send('Email failed to send: ' + error);
    }else{
      res.status(200).send('Message sent: ' + info.response);
    }
  });
}

module.exports = email;