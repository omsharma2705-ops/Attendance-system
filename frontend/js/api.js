const API_BASE_URL = 'http://localhost:5000/api';

// API Service
const apiService = {
  // Student APIs
  registerStudent: async (data) => {
    const response = await fetch(`${API_BASE_URL}/students/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  loginStudent: async (data) => {
    const response = await fetch(`${API_BASE_URL}/students/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  addFaceEmbedding: async (data, token) => {
    const response = await fetch(`${API_BASE_URL}/students/add-face-embedding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getStudentProfile: async (studentId, token) => {
    const response = await fetch(`${API_BASE_URL}/students/profile/${studentId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  getAllStudents: async (token) => {
    const response = await fetch(`${API_BASE_URL}/students/all`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  // Teacher APIs
  loginTeacher: async (data) => {
    const response = await fetch(`${API_BASE_URL}/teachers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Attendance APIs
  markAttendance: async (data, token) => {
    const response = await fetch(`${API_BASE_URL}/attendance/mark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getAttendanceByDateRange: async (params, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/attendance/date-range?${queryString}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  getStudentAttendance: async (studentId, params, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/attendance/student/${studentId}?${queryString}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  getClassAttendanceReport: async (params, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/attendance/class-report?${queryString}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  getDailyAttendanceSummary: async (params, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/attendance/daily-summary?${queryString}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  exportAttendanceCSV: async (params, token) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/attendance/export-csv?${queryString}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.text();
  },
};

// Storage helpers
const authStorage = {
  setToken: (token, userType) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
  },

  getToken: () => localStorage.getItem('token'),
  getUserType: () => localStorage.getItem('userType'),

  setUser: (user, userType) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userType', userType);
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  },
};

// Logout function
function logout() {
  authStorage.clear();
  window.location.href = 'student-login.html';
}

// Check authentication
function checkAuth(requiredRole = null) {
  const token = authStorage.getToken();
  const user = authStorage.getUser();

  if (!token || !user) {
    window.location.href = 'student-login.html';
    return false;
  }

  if (requiredRole && authStorage.getUserType() !== requiredRole) {
    window.location.href = 'student-login.html';
    return false;
  }

  return true;
}

// Display user info
function displayUserInfo() {
  const user = authStorage.getUser();
  if (user) {
    const userInfoEl = document.getElementById('userInfo');
    if (userInfoEl) {
      userInfoEl.textContent = `👤 ${user.name}`;
    }
  }
}

// Show message
function showMessage(elementId, message, type = 'success') {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }
}
