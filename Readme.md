# Backend Assignment

A robust RESTful backend for the **Chapter Performance Dashboard** as part of the MathonGo Backend Developer assignment.

<!-- --- -->

## 🚀 Features

- **Admin Authentication**: Secure login and JWT-protected endpoints
- **Chapter Upload**: Upload chapters via JSON file (admin only)
- **Filtering & Pagination**: Advanced filters and pagination for chapter queries
- **Redis Caching**: GET `/api/v1/chapters` responses are cached for 1 hour
- **Cache Invalidation**: Cache is cleared automatically on chapter upload
- **Rate Limiting**: 30 requests/minute per IP using Redis
- **Error Handling**: Clean, consistent error responses
- **Production Ready**: Deployed on Render with environment-based configuration

<!-- --- -->

## 🛠️ Tech Stack

- Node.js, Express.js
- MongoDB (Mongoose)
- Redis
- JWT for authentication
- Multer for file uploads
- Render (deployment)

<!-- --- -->
<!-- 
## 📦 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
MONGODB_URL=your-mongodb-atlas-url
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
PORT=3000
```

- For local development, ensure Redis is running on your machine
- For deployment (e.g., Render), set `REDIS_URL` to the internal Redis URL provided by Render Key Value

### 4. Start the server
```bash
npm start
```

The server will run on the port specified in `.env` (default: 3000).

--- -->

## 🌐 API Endpoints

### **Authentication**

- `POST /api/v1/admin/register`  
  Register a new admin (setup only)

- `POST /api/v1/admin/login`  
  Authenticate admin and receive JWT

### **Chapters**

- `POST /api/v1/chapters/upload`  
  Upload chapters via JSON file (admin only, JWT required)

- `GET /api/v1/chapters`  
  Get all chapters (supports filters & pagination)

- `GET /api/v1/chapters/:id`  
  Get a chapter by its MongoDB `_id`

- `GET /api/v1/chapters/search/:name`  
  Search chapters by name

<!-- --- -->

## 📄 Sample Data

**Sample `chapters.json` for upload:**
```json
[
  {
    "subject": "Mathematics",
    "chapter": "Functions",
    "class": "Class 11",
    "unit": "Algebra",
    "yearWiseQuestionCount": { "2020": 2, "2021": 3 },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": true
  },
  {
    "subject": "Physics",
    "chapter": "Kinematics",
    "class": "Class 11",
    "unit": "Mechanics 1",
    "yearWiseQuestionCount": { "2022": 1 },
    "questionSolved": 0,
    "status": "Not Started",
    "isWeakChapter": false
  }
]
```

<!-- --- -->

<!-- ## 📝 Environment Variables

| Variable      | Description                           |
|---------------|---------------------------------------|
| MONGODB_URL   | MongoDB Atlas connection string       |
| JWT_SECRET    | Secret key for JWT                    |
| REDIS_URL     | Redis connection URL                  |
| PORT          | Port to run the server (default: 3000)|

--- -->

## 🚦 Rate Limiting

- All routes are limited to **30 requests per minute per IP** using Redis
- Exceeding this limit returns a `429 Too Many Requests` error

<!-- --- -->

## ⚡ Caching

- `GET /api/v1/chapters` is cached in Redis for 1 hour
- Cache is invalidated automatically when chapters are uploaded

<!-- --- -->

## 🚀 Deployment

**Live API URL:** `https://eight41207-karan-backend.onrender.com`

The backend is deployed on Render with Redis caching and MongoDB Atlas integration. All endpoints are live and ready for testing.



## 📬 Postman Collection

A public, well-documented Postman collection with pre-populated data : 
[Collection](https://documenter.getpostman.com/view/38222479/2sB2x2KuZb) <!-- Replace with your actual public link -->

--- 



## 🙋‍♂️ Author

- [Your Name](https://github.com/KaranOps)

---

**Good luck and happy coding!**