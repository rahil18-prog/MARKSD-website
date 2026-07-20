# MARKSD Group Website - Deployment Guide

## Project Structure

```
MARKSD-website/
├── frontend/          # React + Vite + TypeScript (Vercel)
├── backend/           # Node.js + Express + MongoDB (Render)
└── AGENTS.md         # Development guidelines
```

## Frontend Deployment (Vercel)

### Environment Variables in Vercel

Set these in your Vercel project settings:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://your-backend-url.onrender.com` |

### Deployment Steps

1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables
6. Deploy

### Build Command
```bash
cd frontend
npm install
npm run build
```

## Backend Deployment (Render)

### Environment Variables in Render

Set these in your Render web service dashboard:

| Variable | Value |
|----------|-------|
| `PORT` | `5001` (or use Render's automatic PORT) |
| `MONGODB_URI` | Your MongoDB connection string (e.g., MongoDB Atlas) |
| `CLIENT_URL` | `https://your-frontend-url.vercel.app` |
| `CORS_ORIGIN` | `https://your-frontend-url.vercel.app` |
| `EMAIL_HOST` | (Optional) SMTP host for email notifications |
| `EMAIL_PORT` | (Optional) SMTP port |
| `EMAIL_USER` | (Optional) SMTP username |
| `EMAIL_PASS` | (Optional) SMTP password |
| `CONTACT_RECEIVER` | (Optional) Email to receive contact form submissions |

### Deployment Steps

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables
7. Deploy

### MongoDB Setup

1. Create a free MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user with read/write permissions
3. Get the connection string (SRV format recommended)
4. Add to Render environment variables as `MONGODB_URI`

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/marksd?retryWrites=true&w=majority
```

## API Endpoints

### Health Check
```
GET /api/health
Response: { "success": true, "message": "Backend is running" }
```

### Contact Form
```
POST /api/contact
Body: {
  "name": string,
  "email": string,
  "phone": string,
  "company": string (optional),
  "subject": string,
  "message": string
}
Response: { "success": true, "message": "Your enquiry has been submitted successfully." }
```

### Newsletter Subscription
```
POST /api/newsletter/subscribe
Body: { "email": string }
Response: { "success": true, "message": "Successfully subscribed to newsletter." }
```

## CORS Configuration

The backend is configured to accept CORS from:
- Local development: `http://localhost:8443`
- Production: Set `CLIENT_URL` or `CORS_ORIGIN` environment variable

## Testing Locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Access at: http://localhost:8443

### Backend
```bash
cd backend
npm install
npm start
```
Access at: http://localhost:5001

## Production URLs

After deployment, update:

1. **Frontend `.env`** (or Vercel env vars):
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

2. **Backend environment** (Render):
   ```
   CLIENT_URL=https://your-frontend-url.vercel.app
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```

## Troubleshooting

### Contact Form Not Working
1. Check backend logs on Render
2. Verify MongoDB connection string
3. Ensure CORS origin matches frontend URL
4. Check network tab for API errors

### Build Fails
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Check Node.js version (v18+ recommended)
3. Verify all dependencies are installed

### Images Not Loading
1. Check image paths in components
2. Verify images are in `frontend/src/assets`
3. Rebuild frontend after adding new images

## Security Notes

- Never commit `.env` files to Git
- Use strong passwords for MongoDB
- Enable rate limiting (already configured)
- Use HTTPS in production
- Keep dependencies updated

## Support

For issues, check:
- Backend logs: Render Dashboard → Logs
- Frontend errors: Browser console
- MongoDB: Atlas Dashboard → Metrics