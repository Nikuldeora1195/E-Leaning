# LearnMax Backend

Backend API for the LearnMax e-learning platform.

## Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- Multer for local media upload

## Local Setup

```bash
cd backend
npm install
```

Create `.env` from `.env.example` and set:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
FRONTEND_URL=http://localhost:5173
```

Start server:

```bash
npm start
```

## Local URLs

- API: `http://localhost:5000/api`
- Uploads: `http://localhost:5000/uploads`

## Render Deployment

Deploy this `backend` folder as a **Web Service** on Render.

### Render settings

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

### Required environment variables

```env
PORT=5000
MONGO_URI=your_render_mongodb_connection_string
JWT_SECRET=your_long_random_secret
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

## Important Note

This backend currently stores uploaded files locally in `uploads/`.

That works locally and may work during simple testing, but for long-term production use on cloud hosting, a persistent storage solution like Cloudinary or similar is recommended.
