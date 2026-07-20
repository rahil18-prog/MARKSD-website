import mongoose from 'mongoose'
import Contact from '../models/Contact.js'
import { sendContactNotification, sendAutoResponse } from '../utils/mailer.js'

export const submitContact = async (req, res, next) => {
  try {
    if (!mongoose.connection.readyState) {
      return res.status(503).json({ success: false, message: 'Service temporarily unavailable. Please try again later.' })
    }

    const payload = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      subject: req.body.subject,
      message: req.body.message,
    }

    const contact = await Contact.create(payload)
    
    await sendContactNotification(contact)
    await sendAutoResponse(contact)

    return res.status(201).json({
      success: true,
      message: 'Your enquiry has been submitted successfully.',
    })
  } catch (error) {
    return next(error)
  }
}
