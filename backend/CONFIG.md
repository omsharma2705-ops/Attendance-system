# Backend Configuration Guide

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/smart_attendance

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (change this to a secure random string)
JWT_SECRET=your_super_secure_random_jwt_secret_key_min_32_chars

# Optional: CORS Origin (for production)
CORS_ORIGIN=http://localhost:8000
```

## Installation Steps

### 1. Install Node.js Dependencies
```bash
npm install
```

### 2. MongoDB Setup

#### Windows:
Download from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

Start MongoDB service:
```bash
net start MongoDB
```

Or manually:
```bash
mongod --dbpath "C:\data\db"
```

#### Mac:
```bash
brew install mongodb-community
brew services start mongodb-community
```

#### Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 3. Start the Backend Server

Development mode (with hot reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Testing

Use Postman or curl to test endpoints:

### Register Student
```bash
curl -X POST http://localhost:5000/api/students/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "rollNumber": "CS001",
    "department": "Computer Science",
    "semester": 1,
    "password": "test123"
  }'
```

### Login Student
```bash
curl -X POST http://localhost:5000/api/students/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "test123"
  }'
```

## Database Initialization

Create initial admin/teacher account (MongoDB shell):

```javascript
db.teachers.insertOne({
  name: "Admin Teacher",
  email: "teacher@example.com",
  employeeId: "T001",
  department: "Administration",
  password: "$2a$10$...", // bcrypt hashed "test123"
  subjects: ["All"],
  classes: ["All"],
  isActive: true,
  createdAt: new Date()
})
```

## Troubleshooting

### Port Already in Use
Change PORT in .env or kill process on port 5000:
```bash
lsof -ti:5000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :5000   # Windows
```

### MongoDB Connection Error
Verify MongoDB is running:
```bash
mongosh  # or mongo
db.version()
```

### CORS Errors
Update CORS_ORIGIN in .env to match your frontend URL.

## Security Requirements

- Keep `.env` file out of version control
- Use strong JWT_SECRET (minimum 32 characters)
- Update dependencies regularly: `npm update`
- Disable debug mode in production
- Use HTTPS in production
- Implement rate limiting for production
- Add request validation on all endpoints

## Performance Tips

1. Add database indexes:
```javascript
db.students.createIndex({ email: 1, rollNumber: 1 })
db.attendance.createIndex({ student: 1, date: 1 })
```

2. Use connection pooling in production
3. Implement caching for frequently accessed data
4. Monitor API response times
5. Use CDN for static assets (backend serves from frontend folder)

## Monitoring

Check server health:
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "message": "Server is running",
  "status": "OK"
}
```
