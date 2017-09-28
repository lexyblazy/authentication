const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');
const path = require('path');
require('dotenv').config({path:path.join(__dirname,'/../variables.env')});

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.send = async (options)=>{
    const mailOptions = {
      from :"noreply@Authentication.com",
      to : options.user.email,
      subject:options.subject,
      text:"This will be filled in later",
      html:"This will be filled in later"
    }
    const sendMail = promisify(transport.sendMail,transport);
    return sendMail(mailOptions);
  }
