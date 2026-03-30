# LearnMax Backend

Backend API for the LearnMax e-learning platform.

## Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- Multer for local media upload

## Run Locally

```bash
cd backend
npm install
```

Create `.env` from `.env.example` and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the server:

```bash
npm start
```

API base URL:

```text
http://localhost:5000/api
```

Uploads are served from:

```text
http://localhost:5000/uploads
```
