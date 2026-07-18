import nodemailer from 'nodemailer'

const createTransporter = () => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    return null
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  })
}

export const sendContactNotification = async (contact) => {
  const transporter = createTransporter()
  const receiver = process.env.CONTACT_RECEIVER

  if (!transporter || !receiver) {
    console.warn('Email notification skipped: transporter or CONTACT_RECEIVER not configured.')
    return
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: receiver,
    subject: `New Contact Enquiry - ${contact.subject}`,
    text: [
      'New Contact Enquiry',
      `Name: ${contact.name}`,
      `Email: ${contact.email}`,
      `Phone: ${contact.phone}`,
      `Company: ${contact.company || 'N/A'}`,
      `Subject: ${contact.subject}`,
      `Message: ${contact.message}`,
      `Date & Time: ${new Date(contact.createdAt).toISOString()}`,
    ].join('\n'),
  })
}
