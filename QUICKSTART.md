# QUICK START GUIDE

## 🚀 5-Minute Setup

### Prerequisites
- Node.js installed
- MongoDB running (`mongod`)
- Modern web browser

### Step 1: Backend Setup (Terminal 1)
```bash
cd backend
npm install
npm start
```
✅ Server runs on `http://localhost:5000`

### Step 2: Frontend Setup (Terminal 2)
```bash
cd frontend
npx http-server . -p 8000
```
✅ Frontend runs on `http://localhost:8000`

### Step 3: Access Application
Open browser and go to:
```
http://localhost:8000
```

---

## 📌 Default Test Accounts

### Student
- **Email:** student@test.com
- **Password:** test123
- **Roll No:** STU001

### Teacher
- **Email:** teacher@test.com  
- **Password:** test123
- **Employee ID:** TCH001

---

## 🎯 First-Time User Flow

### For Students
1. Click "Student Registration" on home page
2. Fill in all details
3. Click "Create Account"
4. Automatically redirected to face registration
5. Allow camera access
6. Capture 5 different face angles
7. Click "Complete Registration"
8. You're on the dashboard!

### For Teachers
1. Click "Login as Teacher"
2. Enter credentials
3. On dashboard, click "Mark Attendance"
4. Enter Subject and Class
5. Capture classroom photo
6. Select recognized students
7. Click "Mark Present"
8. Done! Check records section

---

## 🔍 Key Features to Try

### 1. Face Registration
- Test liveness detection (blink your eyes)
- Capture different angles
- Watch confidence scores

### 2. Attendance Marking
- Check automatic face detection
- See confidence percentages
- Export as CSV

### 3. Reports
- Filter by date range
- View attendance statistics
- Export data

---

## ⚠️ Troubleshooting

### Camera Not Working?
```
Solution: 
1. Check browser permissions
2. Refresh page
3. Try different browser
4. Check if another app is using camera
```

### Face Not Detected?
```
Solution:
1. Improve lighting
2. Move closer to camera (30-60cm)
3. Look directly at camera
4. Remove sunglasses/masks
5. Wait 5 seconds for detection
```

### Backend Connection Error?
```
Solution:
1. Verify backend is running (npm start)
2. Check if port 5000 is in use
3. Check browser console (F12)
4. Verify API_BASE_URL in js/api.js
```

### MongoDB Error?
```
Solution:
1. Ensure MongoDB is running
2. Windows: mongod
3. Mac: brew services start mongodb-community
4. Check .env MONGODB_URI
```

---

## 📁 Project Structure Summary

```
smart-attendance/
├── backend/              # Node.js + Express
│   ├── models/          # Student, Teacher, Attendance, Subject
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── server.js        # Main server file
│   └── .env             # Configuration
│
├── frontend/            # HTML + CSS + JavaScript
│   ├── index.html       # Home page
│   ├── css/styles.css   # All styling
│   ├── js/              # JavaScript logic
│   └── *.html           # All application pages
│
├── README.md            # Full documentation
├── API.md               # API reference
├── DEPLOYMENT.md        # Deployment guide
├── TESTING.md           # Testing guide
└── this file            # Quick start
```

---

## 📊 Architecture Overview

```
Browser (Frontend HTML/CSS/JS)
         ↓
  Face API.js (Client-side face detection)
         ↓
  Express API (Backend)
         ↓
  Node.js Server
         ↓
  MongoDB Database
```

---

## 🎓 Learning Path

1. **Understand the System**
   - Read README.md
   - Review project structure

2. **Try Basic Flow**
   - Student registration
   - Student login
   - View dashboard

3. **Explore Features**
   - Face capture and registration
   - Attendance marking
   - Report generation

4. **Customize**
   - Change colors in CSS
   - Adjust confidence thresholds
   - Add more departments

5. **Deploy**
   - Follow DEPLOYMENT.md
   - Set up production database
   - Configure domains

---

## 🔧 Configuration Guide

### Change Confidence Threshold
In `teacher-mark-attendance.html`:
```html
<input type="number" id="confidenceThreshold" value="60">
<!-- Change 60 to 70, 80, etc. -->
```

### Change API URL
In `frontend/js/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';  // Change this
```

### Change Database
In `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/smart_attendance
<!-- Connect to different MongoDB instance -->
```

---

## 📞 Support Resources

### Documentation
- **[README.md](README.md)** - Full documentation
- **[API.md](API.md)** - API reference
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide
- **[TESTING.md](TESTING.md)** - Testing guide
- **[frontend/CONFIG.md](frontend/CONFIG.md)** - Frontend setup
- **[backend/CONFIG.md](backend/CONFIG.md)** - Backend setup

### Common Issues
1. Check browser console (F12 → Console tab)
2. Check terminal output for backend errors
3. Verify all services running
4. Check file paths and URLs

### Next Steps
- Explore the codebase
- Try different scenarios
- Customize for your institution
- Test with real cameras
- Deploy to cloud

---

## 🎉 Congratulations!

You now have a fully functional AI-powered Smart Attendance System!

**Features Enabled:**
✅ Face Recognition
✅ Liveness Detection  
✅ Real-time Attendance
✅ Analytics & Reports
✅ CSV Export
✅ Responsive Design
✅ Secure Authentication
✅ Multiple Users

**Ready to:**
- 🎓 Deploy in your institution
- 📱 Scale to more users
- 🔧 Customize for your needs
- 📊 Analyze attendance data

---

**For detailed setup instructions, see [README.md](README.md)**

**Last Updated:** February 2026
