import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import morgan from 'morgan'
import connectDB from './config/db.js'
import contactRoutes from './routes/contactRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
  credentials: true,
}))
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
}))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(mongoSanitize())
app.use(morgan('combined'))

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Backend is running' })
})

app.use('/api/contact', contactRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
