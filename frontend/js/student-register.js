// Student Registration page
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      showMessage('errorMessage', 'Passwords do not match', 'error');
      return;
    }

    const data = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      rollNumber: document.getElementById('rollNumber').value,
      enrollmentNumber: document.getElementById('enrollmentNumber').value,
      department: document.getElementById('department').value,
      semester: parseInt(document.getElementById('semester').value),
      phoneNumber: document.getElementById('phoneNumber').value,
      password,
    };

    try {
      const response = await apiService.registerStudent(data);

      if (response.token) {
        authStorage.setUser(response.student, 'student');
        authStorage.setToken(response.token, 'student');

        showMessage('successMessage', 'Registration successful! Redirecting to face registration...', 'success');

        setTimeout(() => {
          window.location.href = 'student-face-register.html';
        }, 2000);
      } else {
        showMessage('errorMessage', response.message || 'Registration failed', 'error');
      }
    } catch (error) {
      showMessage('errorMessage', 'Error registering student', 'error');
      console.error(error);
    }
  });
});
