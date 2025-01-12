const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const APIError = require("./errors");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (mailOptions) => {
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new APIError("Mail Gönderilemedi !");
    }
    return true;
  });
};

const getEmailTemplate = (templateName, variables) => {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
  let template = fs.readFileSync(templatePath, 'utf8');

  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, variables[key]);
  });

  return template;
};

module.exports = { sendEmail, getEmailTemplate };