# LearnMax Frontend

Frontend app for **LearnMax**, an e-learning platform by **Nikul Kumar**.

## Stack

- React
- Vite
- Tailwind CSS
- React Router
- Axios

## Local Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend uses:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

If `VITE_API_BASE_URL` is not set, it falls back to local backend automatically.

## Vercel Deployment

Deploy this `frontend` folder as a Vite app on Vercel.

### Vercel settings

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

### Required environment variable

```env
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api
```

## Important Note

After changing Vercel environment variables, redeploy the frontend so the new values are included in the build.
