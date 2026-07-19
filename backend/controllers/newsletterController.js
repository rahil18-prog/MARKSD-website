import Newsletter from '../models/Newsletter.js'

export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      })
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed.',
      })
    }

    const subscription = await Newsletter.create({ email: email.toLowerCase() })

    return res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter.',
    })
  } catch (error) {
    return next(error)
  }
}