import mongoose from 'mongoose'

const newsletterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true, maxlength: 150 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export default mongoose.model('Newsletter', newsletterSchema)