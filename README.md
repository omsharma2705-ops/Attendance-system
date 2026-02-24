# Smart Attendance System - AI-Powered Face Recognition

A complete web-based attendance management system that uses real-time face recognition and liveness detection to eliminate proxy attendance.

## 🎯 Features

### Student Features
- ✅ User registration with email and credentials
- 📸 Face registration with multiple angles capture
- 👁️ Liveness detection (blink and head movement)
- 📊 Dashboard with attendance statistics
- 📅 Detailed attendance history with filters
- 📱 Responsive mobile-friendly interface

### Teacher/Admin Features
- 📹 Capture classroom photos/videos for attendance
- 🔍 Automatic face detection and recognition
- ✅ One-click attendance marking
- 📊 Comprehensive attendance reports
- 📈 Class-wise and date-wise attendance analytics
- ⬇️ CSV/Excel export functionality
- 👥 Student management dashboard

### System Features
- 🤖 AI-powered face detection using face-api.js
- 👤 Face embedding generation for accurate recognition
- 🔐 Secure authentication with JWT tokens
- 🗄️ MongoDB database for data persistence
- 🔗 RESTful API with Express.js backend
- 📊 Real-time liveness verification

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern, responsive design
- **JavaScript (Vanilla)** - No framework dependencies
- **face-api.js** - Face detection and recognition
- **TensorFlow.js** - Machine learning models

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **csv-stringify** - CSV export

## 📋 Project Structure

```
smart-attendance-system/
├── backend/
│   ├── models/
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── Attendance.js
│   │   └── Subject.js
│   ├── controllers/
│   │   ├── studentController.js
│   │   ├── teacherController.js
│   │   └── attendanceController.js
│   ├── routes/
│   │   ├── studentRoutes.js
│   │   ├── teacherRoutes.js
│   │   └── attendanceRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── config/
│   │   └── database.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── api.js
│   │   ├── face-recognition.js
│   │   ├── student-register.js
│   │   ├── student-login.js
│   │   ├── student-dashboard.js
│   │   ├── student-face-register.js
│   │   ├── student-attendance-history.js
│   │   ├── teacher-login.js
│   │   ├── teacher-dashboard.js
│   │   ├── teacher-mark-attendance.js
│   │   └── teacher-records.js
│   ├── student-register.html
│   ├── student-login.html
│   ├── student-dashboard.html
│   ├── student-face-register.html
│   ├── student-attendance.html
│   ├── teacher-login.html
│   ├── teacher-dashboard.html
│   ├── teacher-mark-attendance.html
│   └── teacher-records.html
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running locally
- Modern web browser with webcam access
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file from `.env.example`:**
   ```bash
   copy .env.example .env
   ```

4. **Update `.env` with your configuration:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/smart_attendance
   PORT=5000
   JWT_SECRET=your_secure_jwt_secret_key_here
   NODE_ENV=development
   ```

5. **Start MongoDB:**
   ```bash
   # Windows
   mongod
   ```

6. **Start the backend server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Start a local web server:**
   
   Option 1: Using Python (Python 3)
   ```bash
   python -m http.server 8000
   ```
   
   Option 2: Using Node.js (http-server)
   ```bash
   npx http-server . -p 8000
   ```
   
   Option 3: Using Visual Studio Code Live Server extension
   - Right-click on `index.html` → "Open with Live Server"

3. **Access the application:**
   Open your browser and navigate to `http://localhost:8000`

## 🔑 API Endpoints

### Student Endpoints
```
POST   /api/students/register        - Register new student
POST   /api/students/login           - Student login
GET    /api/students/profile/:id     - Get student profile
POST   /api/students/add-face-embedding - Add face embeddings
GET    /api/students/all             - Get all active students
GET    /api/students/department/:dept - Get students by department
```

### Teacher Endpoints
```
POST   /api/teachers/login           - Teacher login
GET    /api/teachers/profile/:id     - Get teacher profile
GET    /api/teachers/all             - Get all teachers
```

### Attendance Endpoints
```
POST   /api/attendance/mark          - Mark attendance
GET    /api/attendance/date-range    - Get attendance by date range
GET    /api/attendance/student/:id   - Get student attendance
GET    /api/attendance/class-report  - Get class attendance report
GET    /api/attendance/daily-summary - Get daily summary
GET    /api/attendance/export-csv    - Export as CSV
```

## 🗄️ Database Models

### Student Schema
```javascript
{
  name: String,
  email: String (unique),
  rollNumber: String (unique),
  enrollmentNumber: String,
  department: String,
  semester: Number,
  phoneNumber: String,
  password: String (hashed),
  faceEmbeddings: [Mixed],
  faceImage: String,
  registrationDate: Date,
  lastFaceCapture: Date,
  totalFaceCaptures: Number,
  isActive: Boolean
}
```

### Attendance Schema
```javascript
{
  student: ObjectId,
  date: Date,
  subject: String,
  class: String,
  teacher: ObjectId,
  status: enum ['present', 'absent', 'late'],
  faceConfidence: Number,
  livenessVerified: Boolean,
  attendanceTime: String,
  remarks: String
}
```

## 🔐 Security Features

1. **Password Hashing** - bcryptjs with salt rounds of 10
2. **JWT Authentication** - Token-based secure API access
3. **CORS Protection** - Cross-origin resource sharing configured
4. **Input Validation** - express-validator for all inputs
5. **Face Liveness Detection** - Prevents spoofing with live face verification
6. **Secure Embedding Storage** - Face embeddings stored encrypted in database

## 🎮 Usage Guide

### For Students

1. **Register:**
   - Navigate to student registration page
   - Fill in personal details
   - Create a secure password

2. **Face Registration:**
   - After registration, capture your face from 5 different angles
   - System will verify liveness (detect blinks and head movement)
   - Your face embeddings are securely stored

3. **View Attendance:**
   - Log in to your dashboard
   - Check real-time attendance statistics
   - View detailed attendance history with filters
   - Monitor your attendance percentage

### For Teachers

1. **Mark Attendance:**
   - Log in to teacher dashboard
   - Open "Mark Attendance"
   - Capture a photo of the classroom
   - System automatically detects registered students
   - Select recognized students and mark present
   - Liveness verification is automatic

2. **View Reports:**
   - Access "Records" section
   - Filter by date, subject, or class
   - Export attendance to CSV for further analysis

## 🧪 Testing the System

### Test Student Account
```
Email: student@example.com
Password: test123
```

### Test Teacher Account
```
Email: teacher@example.com
Password: test123
```

## 📊 Face Recognition Details

### How It Works

1. **Registration Phase:**
   - Student captures 5 different face angles
   - System generates 128-dimensional face embeddings using TensorFlow.js
   - Embeddings are stored in MongoDB
   - Liveness check ensures real person (not photo)

2. **Recognition Phase:**
   - Teacher captures classroom photo
   - System detects all faces using TinyFaceDetector
   - Each face is converted to embeddings
   - Embeddings compared with student database
   - Matches above confidence threshold are identified

3. **Liveness Verification:**
   - Blink detection - eyes opening/closing cycles
   - Head movement detection - slight head rotations
   - Both required for successful verification
   - Prevents photo/video spoofing

### Accuracy Factors

- Better lighting improves detection accuracy
- Clear face visibility (no occlusions)
- Multiple face angles during registration
- Confidence threshold tuning (default: 60%)

## 🚨 Troubleshooting

### Camera Access Issues
- Check browser permissions for camera access
- Ensure HTTPS (or localhost) for camera access
- Different browsers may have different permission flows

### Face Detection Not Working
- Ensure good lighting conditions
- Position face directly facing camera
- Wait for models to load (may take 10-20 seconds)
- Check browser console for load errors

### MongoDB Connection Error
- Verify MongoDB is running locally
- Check connection string in `.env`
- Ensure database name matches

### API Request Errors
- Verify backend server is running
- Check API base URL in `js/api.js`
- Ensure CORS is properly configured

## 📈 Performance Optimization

1. **Model Loading** - Pre-loaded on page initialization
2. **Canvas Optimization** - Efficient canvas drawing
3. **Database Indexing** - Indexes on email, rollNumber
4. **Lazy Loading** - Load data only when needed
5. **Browser Caching** - Static assets cached

## 🔮 Future Enhancements

- Mobile app using React Native
- Real-time notifications
- Advanced analytics and ML predictions
- Multi-classroom sessions
- SMS/Email notifications
- 3D face recognition
- Iris recognition support
- Integration with student information system
- Biometric data encryption
- Compliance with GDPR/privacy regulations

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

- Development Team
- Face Recognition Integration
- Database Architecture
- UI/UX Design

## 📧 Support

For issues, questions, or feature requests, please create an issue in the repository.

## ⚠️ Important Notes

1. **Data Privacy** - Store facial data securely and comply with privacy regulations
2. **Consent** - Obtain explicit consent before capturing and storing biometric data
3. **Accuracy** - Don't rely solely on automated recognition; use as supplement to manual verification
4. **Backup** - Regularly backup attendance data
5. **Updates** - Keep TensorFlow.js and face-api.js models updated

---

**Last Updated:** February 2026

For comprehensive documentation and API reference, please refer to the inline code comments and API documentation files.
