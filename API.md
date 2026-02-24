# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.yourdomain.com/api
```

## Authentication

All endpoints (except `/register` and `/login`) require JWT token in header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "data": {...},
  "message": "Success message",
  "status": "success"
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": "error",
  "code": 400
}
```

---

## Student Endpoints

### Register Student
**POST** `/students/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "rollNumber": "CS2024001",
  "enrollmentNumber": "EN2024001",
  "department": "Computer Science",
  "semester": 1,
  "phoneNumber": "+91 9876543210",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "message": "Student registered successfully",
  "student": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "rollNumber": "CS2024001"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Status Code:** 201

---

### Login Student
**POST** `/students/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "student": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "rollNumber": "CS2024001"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Status Code:** 200

---

### Add Face Embedding
**POST** `/students/add-face-embedding`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "studentId": "507f1f77bcf86cd799439011",
  "embedding": [
    [0.123, 0.456, ...128 values...],
    [0.789, 0.012, ...128 values...]
  ],
  "imageBase64": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "message": "Face embedding added successfully",
  "totalCaptures": 3
}
```

**Status Code:** 200

---

### Get Student Profile
**GET** `/students/profile/:studentId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "rollNumber": "CS2024001",
  "department": "Computer Science",
  "semester": 1,
  "phoneNumber": "+91 9876543210",
  "registrationDate": "2024-02-01T10:00:00Z",
  "totalFaceCaptures": 5,
  "isActive": true
}
```

**Status Code:** 200

---

### Get All Students
**GET** `/students/all`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- None

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "rollNumber": "CS2024001",
    "department": "Computer Science",
    "semester": 1
  },
  ...
]
```

**Status Code:** 200

---

### Get Students by Department
**GET** `/students/department/:department`

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `department` - Department name (e.g., "Computer Science")

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Computer Science"
  },
  ...
]
```

**Status Code:** 200

---

## Teacher Endpoints

### Login Teacher
**POST** `/teachers/login`

**Body:**
```json
{
  "email": "teacher@example.com",
  "password": "teacher_password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "teacher": {
    "_id": "607f1f77bcf86cd799439012",
    "name": "Prof. Smith",
    "email": "teacher@example.com",
    "employeeId": "EMP001"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Status Code:** 200

---

### Get Teacher Profile
**GET** `/teachers/profile/:teacherId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "607f1f77bcf86cd799439012",
  "name": "Prof. Smith",
  "email": "teacher@example.com",
  "employeeId": "EMP001",
  "department": "Computer Science",
  "subjects": ["Data Structures", "Algorithms"],
  "classes": ["CS-A", "CS-B"]
}
```

**Status Code:** 200

---

## Attendance Endpoints

### Mark Attendance
**POST** `/attendance/mark`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "studentIds": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012"
  ],
  "subject": "Data Structures",
  "class": "CS-A",
  "teacherId": "607f1f77bcf86cd799439012",
  "livenessVerified": true
}
```

**Response:**
```json
{
  "message": "Attendance marked for 2 students",
  "count": 2
}
```

**Status Code:** 201

---

### Get Attendance by Date Range
**GET** `/attendance/date-range`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `student` - Student ID (optional)
- `subject` - Subject name (optional)
- `teacher` - Teacher ID (optional)

**Example:**
```
/attendance/date-range?startDate=2024-02-01&endDate=2024-02-28
```

**Response:**
```json
[
  {
    "_id": "707f1f77bcf86cd799439013",
    "student": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "rollNumber": "CS2024001"
    },
    "date": "2024-02-15T10:00:00Z",
    "subject": "Data Structures",
    "class": "CS-A",
    "status": "present",
    "livenessVerified": true,
    "attendanceTime": "10:15 AM"
  },
  ...
]
```

**Status Code:** 200

---

### Get Student Attendance
**GET** `/attendance/student/:studentId`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` - Start date (optional)
- `endDate` - End date (optional)

**Response:**
```json
{
  "attendance": [
    {
      "_id": "707f1f77bcf86cd799439013",
      "date": "2024-02-15T10:00:00Z",
      "subject": "Data Structures",
      "status": "present",
      "livenessVerified": true
    },
    ...
  ],
  "summary": {
    "totalClasses": 20,
    "present": 18,
    "absent": 2,
    "attendancePercentage": "90.00"
  }
}
```

**Status Code:** 200

---

### Get Class Attendance Report
**GET** `/attendance/class-report`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `class` - Class name (required)
- `subject` - Subject name (optional)
- `date` - Date (YYYY-MM-DD, optional)

**Response:**
```json
[
  {
    "student": {
      "name": "John Doe",
      "rollNumber": "CS2024001"
    },
    "date": "2024-02-15T10:00:00Z",
    "status": "present",
    "livenessVerified": true
  },
  ...
]
```

**Status Code:** 200

---

### Get Daily Attendance Summary
**GET** `/attendance/daily-summary`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `date` - Date (YYYY-MM-DD)
- `subject` - Subject name (optional)
- `class` - Class name (optional)

**Response:**
```json
{
  "totalRecords": 45,
  "present": 43,
  "absent": 2,
  "late": 0,
  "livenessVerified": 43,
  "records": [...]
}
```

**Status Code:** 200

---

### Export Attendance as CSV
**GET** `/attendance/export-csv`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` - Start date (optional)
- `endDate` - End date (optional)
- `subject` - Subject name (optional)
- `class` - Class name (optional)

**Response:** CSV file download

**Status Code:** 200

---

## Health Check

### Server Health
**GET** `/health`

**Response:**
```json
{
  "message": "Server is running",
  "status": "OK"
}
```

**Status Code:** 200

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate email/rollNumber |
| 500 | Internal Server Error |

---

## Rate Limiting

- 100 requests per minute per IP (planned)
- 1000 requests per hour per authenticated user

---

## Pagination (Future)

```
GET /attendance/date-range?page=1&limit=50
```

Response includes:
- `page` - Current page
- `limit` - Records per page
- `total` - Total records
- `pages` - Total pages

---

## Sorting (Future)

```
GET /attendance/date-range?sort=-date&order=desc
```

---

For examples and SDK implementations, see:
- `/frontend/js/api.js` - JavaScript/fetch implementation
- `/test/api.test.js` - Jest/Supertest examples

