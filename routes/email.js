/*
Routes relating to sending emails from within the app
Used for IOU emails and emails to carpe
*/

var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var path = require('path');
var templatesDir = path.resolve(__dirname, '..', 'email_templates');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// For sending emails.
// Create reusable transporter object using SMTP transport.
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.OBAY_GMAIL_USER || '',
    pass: process.env.OBAY_GMAIL_PASS || '',
  }
});
var OBAY_RECIEVER = process.env.OBAY_RECIEVER || ''; // Who gets the emails.

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
      from: 'Olin Obay<noreply@obay.herokuapp.com>', // Sender address.
      to: req.body.emailTo ||'hdavidzhu@gmail.com', // List of receivers.
      subject: req.body.emailSubject || 'Hello', // Subject line.
      text: req.body.emailText || 'Hello world' // Plaintext body.
    };

    email.sendEmail(res, mailOptions);
  },

  sendCarpeEmail: function(listing){
    emailTemplates(templatesDir, function(err, template){
      if (err) {
        console.log(err);
      } else {
        listing.listing_url = 'www.obay.herokuapps.com/#listing/'+listing._id;
        template('carpeEmail', listing, function(err, html, text){
          if (err) {
            console.log(err);
          } else {
            var subject_line = 'Selling ' + listing.listing_name + ' for $' 
              + listing.listing_price;

            var mailOptions = {
              from: 'Olin Obay<noreply@obay.herokuapp.com>', // Sender address.
              // to: OBAY_RECIEVER, // List of receivers.
              to: 'carpediem@lists.olin.edu', // List of receivers.
              subject: subject_line, // Subject line.
              text: text, // Plaintext body.
              html: html,
            };

            transporter.sendMail(mailOptions, function(error, info){
              if(error){
                console.log(error);
              }
            });
          }
        });
      }
    });
  },

  sendCashEmail: function(listing){
    console.log("Sending Cash Email.");
    emailTemplates(templatesDir, function(err, template){
      if (err) {
        console.log(err);
      } else {
        template('cashEmail', listing, function(err, html, text){
          if (err) {
            console.log(err);
          } else {
            var subject_line = listing.listing_name + ' has been purchased!';
            var recievers = [listing.listing_creator+"@students.olin.edu", listing.listing_buyer+"@students.olin.edu"];
            var mailOptions = {
              from: 'Olin Obay<noreply@obay.herokuapp.com>', // Sender address.
              to: recievers, // List of receivers.
              subject: subject_line, // Subject line.
              text: text, // Plaintext body.
              html: html,
            };
            transporter.sendMail(mailOptions, function(error, info){
              if(error){
                console.log(error);
              }
            });
          }
        });
      }
    });
  },

};

module.exports = email;
