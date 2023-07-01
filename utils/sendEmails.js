
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (options)=> {


  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',//process.env.SMTP_HOST,
    port: 587,//process.env.SMTP_PORT,
    service:'gmail',
    auth: {
      user: 'pramod.itprofessional@gmail.com',//,process.env.USERNAME, // generated ethereal user
      pass: 'smart@321' //process.env.PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const message ={
    from: `${process.env.FROM_EMAIL} < ${process.env.FROM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

};

module.exports = sendEmail;

