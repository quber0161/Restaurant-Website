import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (to, subject, text, html = '') => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or smtp.ethereal.email or your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Shandiz Restaurant" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
  }
};

//sendEmail("gunalandilushan@gmail.com", "Test Email", "This is a test", "<p>Test HTML</p>");


export default sendEmail;