import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 150 },
    phone: { type: String, required: true, trim: true, maxlength: 25 },
    company: { type: String, trim: true, maxlength: 150 },
    subject: { type: String, required: true, trim: true, maxlength: 180 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export default mongoose.model('Contact', contactSchema)
