# MARKSD Group of Companies Website

A modern, responsive corporate website built with React, Vite, and Tailwind CSS. Features a black and gold theme with glassmorphism effects.

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Framer Motion** - Animations
- **HLS.js** - Video streaming

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB + Mongoose** - Database
- **Nodemailer** - Email notifications
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting
- **morgan** - HTTP request logger
- **express-mongo-sanitize** - MongoDB injection prevention
- **express-validator** - Input validation

## Project Structure

```
MARKSD website/
├── src/
│   ├── App.tsx              # Main application with routes
│   ├── main.tsx             # React entry point
│   ├── index.css            # Global styles and Tailwind
│   └── imports/             # Static assets (images, etc.)
├── backend/
│   ├── server.js            # Express server entry point
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── controllers/
│   │   └── contactController.js  # Contact form handler
│   ├── models/
│   │   └── Contact.js       # Contact schema
│   ├── routes/
│   │   └── contactRoutes.js # Contact API routes
│   ├── middleware/
│   │   ├── errorHandler.js  # Error handling middleware
│   │   └── validateRequest.js # Validation middleware
│   └── utils/
│       └── mailer.js        # Email utility
├── .env.example             # Environment variables template
├── backend/.env.example     # Backend environment template
└── package.json             # Frontend dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (for production)
- Gmail account with App Password (for email notifications)

### Frontend Setup

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 (or the port shown in the terminal)

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and configure:
   - `MONGODB_URI` - MongoDB Atlas connection string
   - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` - Email credentials
   - `CONTACT_RECEIVER` - Email address to receive enquiries

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the server:
   ```bash
   npm start
   ```

The backend will run on http://localhost:5000

## Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (backend/.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marksd
CORS_ORIGIN=http://localhost:5173,http://localhost:8443
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_RECEIVER=info@marksdgroup.com
```

## Features

### Frontend
- **Responsive Design** - Optimized for all screen sizes (320px to 1920px+)
- **Glassmorphism UI** - Modern frosted glass effects
- **Black & Gold Theme** - Premium corporate aesthetic
- **Smooth Animations** - Fade-up, float, and reveal effects
- **Video Background** - HLS streaming for hero section
- **Company Detail Pages** - Individual pages for each company
- **Contact Form** - With validation and real-time feedback
- **Mobile Navigation** - Fullscreen hamburger menu

### Backend
- **RESTful API** - Clean endpoint structure
- **MongoDB Integration** - Persistent data storage
- **Email Notifications** - Automatic notifications for new enquiries
- **Input Validation** - Server-side validation with express-validator
- **Security** - Helmet, CORS, rate limiting, MongoDB sanitization
- **Error Handling** - Centralized error middleware

## API Endpoints

### POST /api/contact
Submit a contact enquiry.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 1234567890",
  "company": "Company Name",
  "subject": "Partnership Enquiry",
  "message": "Your message here..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Your enquiry has been submitted successfully."
}
```

### GET /api/health
Health check endpoint.

## Build Commands

### Frontend
```bash
npm run build    # Production build
npm run preview  # Preview production build
```

### Backend
```bash
npm start        # Start production server
```

## Deployment

### Frontend
Deploy to any static hosting (Vercel, Netlify, Cloudflare Pages):
1. Run `npm run build`
2. Upload the `dist` folder

### Backend
Deploy to any Node.js hosting (Render, Railway, Heroku):
1. Upload the `backend` folder
2. Set environment variables
3. Start with `npm start`

## License

© 2026 MARKSD Group of Companies. All rights reserved.