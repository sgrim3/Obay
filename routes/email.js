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

module.exports.sendEmail = function (req, res, next){

  // Setup e-mail data with unicode symbols.
  var mailOptions = {
    from: 'Olin Obay<noreply@obay.herokuapp.com>', // sender address
    to: req.emailTo ||'hdavidzhu@gmail.com', // list of receivers
    subject: req.emailSubject || 'Hello', // Subject line
    text: req.emailText || 'Hello world' // plaintext body
  };

  // Send mail with defined transport object.
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        res.error(error);
    }else{
        res.send('Message sent: ' + info.response);
    }
  });
}