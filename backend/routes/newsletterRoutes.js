import { Router } from 'express'
import { body } from 'express-validator'
import { subscribeNewsletter } from '../controllers/newsletterController.js'
import { validateRequest } from '../middleware/validateRequest.js'

const router = Router()

router.post(
  '/subscribe',
  [
    body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Valid email is required.').normalizeEmail(),
  ],
  validateRequest,
  subscribeNewsletter
)

export default router