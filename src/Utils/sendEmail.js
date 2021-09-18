import nodemailer from 'nodemailer';
import { SMTP_FROM_EMAIL, SMTP_FROM_NAME, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER } from '../config';
const sendEmail  =async options =>{
    const transpoter = nodemailer.createTransport({
        host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD
  }
    })
    const message = {
        from :`${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>`,
        to:options.email,
        subject:options.subject,
        text:options.message,
    }
    await transpoter.sendMail(message)
}

export default sendEmail