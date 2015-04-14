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

var email = {
  sendEmail: function (res, mailOptions){

    // Send mail with defined transport object.
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        res.status(500).send('Email failed to send: ' + error);
      }else{
        res.status(200).send('Message sent: ' + info.response);
      }
    });
  },
  testEmail: function (req, res, next){
    // Setup e-mail data with unicode symbols.
    var mailOptions = {
      from: 'Olin Obay<noreply@obay.herokuapp.com>', // sender address
      to: req.body.emailTo ||'hdavidzhu@gmail.com', // list of receivers
      subject: req.body.emailSubject || 'Hello', // Subject line
      text: req.body.emailText || 'Hello world' // plaintext body
    };


    email.sendEmail(res, mailOptions);
  },
    cashEmail: function (req, res, next){
    // Setup e-mail data with unicode symbols.
    var mailOptions = {
      from: 'Olin Obay<noreply@obay.herokuapp.com>', // sender address
      to: req.body.emailTo ||'allisongpatterson@gmail.com', // list of receivers
      subject: req.body.emailSubject || 'Obay Reciept for ' + item_name, // Subject line
      text: req.body.emailText || 'This is an aknowledgement that ' + buyer + ' has successfully purchased ' + item_name + ' from ' + seller + '. By making this purchase, ' + buyer + ' has agreed to pay the amount of ' + item_price + ' dollars to ' + seller + '. Please save this message for your records until the IOU is resolved.' // plaintext body
    };


    email.sendEmail(res, mailOptions);
  }
};

module.exports = email;