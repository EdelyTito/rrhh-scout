// utils/email.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html, attachments = []) => {
  return transporter.sendMail({
    from: `"Sistema Scout RRAA" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  });
};
