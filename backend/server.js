import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import morgan from 'morgan'
import connectDB from './config/db.js'
import contactRoutes from './routes/contactRoutes.js'
import newsletterRoutes from './routes/newsletterRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

connectDB()

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}))
app.use(cors({
  origin: process.env.CLIENT_URL || process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
app.use('/api/newsletter', newsletterRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
