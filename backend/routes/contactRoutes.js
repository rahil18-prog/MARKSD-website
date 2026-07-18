import { Router } from 'express'
import { body } from 'express-validator'
import { submitContact } from '../controllers/contactController.js'
import { validateRequest } from '../middleware/validateRequest.js'

const router = Router()

const phoneRegex = /^\+?[0-9()\-\s]{7,20}$/

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 120 }).withMessage('Name is too long.'),
    body('email').trim().notEmpty().withMessage('Email is required.').isEmail().withMessage('Valid email is required.').normalizeEmail(),
    body('phone').trim().notEmpty().withMessage('Phone is required.').matches(phoneRegex).withMessage('Valid phone number is required.'),
    body('company').optional({ values: 'falsy' }).trim().isLength({ max: 150 }).withMessage('Company name is too long.'),
    body('subject').trim().notEmpty().withMessage('Subject is required.').isLength({ max: 180 }).withMessage('Subject is too long.'),
    body('message').trim().notEmpty().withMessage('Message is required.').isLength({ max: 2000 }).withMessage('Message exceeds maximum length.'),
  ],
  validateRequest,
  submitContact
)

export default router
