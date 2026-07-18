import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.warn('MONGODB_URI is not configured. Contact submissions will not be persisted.')
    return
  }

  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB
