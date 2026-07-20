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
  const receiver = process.env.CONTACT_RECEIVER || 'info@marksd.co'

  if (!transporter || !receiver) {
    console.warn('Email notification skipped: transporter or CONTACT_RECEIVER not configured.')
    return
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #C8A54B, #D9BE72); padding: 20px; text-align: center;">
        <h2 style="color: #050505; margin: 0; font-size: 24px;">New Business Enquiry</h2>
        <p style="color: #050505; margin: 10px 0 0 0; font-size: 14px;">MARKSD Group of Companies</p>
      </div>
      <div style="padding: 30px; background: #ffffff;">
        <p style="font-size: 16px; color: #333333; margin-bottom: 20px;">You have received a new business enquiry:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Name:</td><td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #333333;">${contact.name}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Email:</td><td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #333333;">${contact.email}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Phone:</td><td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #333333;">${contact.phone}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Company:</td><td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #333333;">${contact.company || 'N/A'}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Subject:</td><td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #333333;">${contact.subject}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Message:</td><td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #333333;">${contact.message}</td></tr>
          <tr><td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; font-weight: bold; color: #555555;">Date & Time:</td><td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #333333;">${new Date(contact.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
        </table>
      </div>
      <div style="padding: 20px; text-align: center; background: #f5f5f5; font-size: 12px; color: #888888;">
        <p style="margin: 0;">This enquiry was submitted through the MARKSD Group website.</p>
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"MARKSD Group" <${process.env.EMAIL_USER}>`,
    to: receiver,
    subject: `New Business Enquiry - ${contact.subject}`,
    html: htmlContent,
  })
}

export const sendAutoResponse = async (contact) => {
  const transporter = createTransporter()

  if (!transporter) {
    console.warn('Auto-response email skipped: transporter not configured.')
    return
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #C8A54B, #D9BE72); padding: 24px; text-align: center;">
        <h2 style="color: #050505; margin: 0; font-size: 26px;">Thank You for Contacting MARKSD Group</h2>
      </div>
      <div style="padding: 32px; background: #ffffff;">
        <p style="font-size: 16px; color: #333333; margin-bottom: 16px;">Dear ${contact.name},</p>
        <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 20px;">
          Thank you for your interest in MARKSD Group of Companies. We have received your enquiry regarding <strong style="color: #C8A54B;">${contact.subject}</strong> and our team will review it carefully.
        </p>
        <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 24px;">
          One of our representatives will get in touch with you within 24-48 hours during business hours (Monday – Saturday, 9:00 AM – 6:00 PM IST).
        </p>
        <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #C8A54B; margin-bottom: 24px;">
          <p style="font-size: 14px; color: #666666; margin: 0;"><strong>Your Enquiry Summary:</strong></p>
          <p style="font-size: 14px; color: #333333; margin: 8px 0 0 0;">${contact.message}</p>
        </div>
        <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 20px;">
          For urgent matters, please feel free to reach us at <a href="mailto:info@marksd.co" style="color: #C8A54B; text-decoration: none;">info@marksd.co</a>
        </p>
        <p style="font-size: 15px; color: #333333; margin-bottom: 8px;">Best regards,</p>
        <p style="font-size: 16px; color: #050505; font-weight: bold; margin: 0;">MARKSD Group Team</p>
      </div>
      <div style="padding: 20px; text-align: center; background: #050505; font-size: 12px; color: #888888;">
        <p style="margin: 0 0 8px 0; color: #C8A54B;">MARKSD Group of Companies</p>
        <p style="margin: 0;">Chittoor, Andhra Pradesh, India | <a href="https://marksd.co" style="color: #C8A54B; text-decoration: none;">marksd.co</a></p>
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"MARKSD Group" <${process.env.EMAIL_USER}>`,
    to: contact.email,
    subject: 'Thank you for contacting MARKSD Group',
    html: htmlContent,
  })
}
