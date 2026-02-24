// Teacher Login page
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    };

    try {
      const response = await apiService.loginTeacher(data);

      if (response.token) {
        authStorage.setUser(response.teacher, 'teacher');
        authStorage.setToken(response.token, 'teacher');

        showMessage('successMessage', 'Login successful! Redirecting...', 'success');

        setTimeout(() => {
          window.location.href = 'teacher-dashboard.html';
        }, 1500);
      } else {
        showMessage('errorMessage', response.message || 'Login failed', 'error');
      }
    } catch (error) {
      showMessage('errorMessage', 'Error logging in', 'error');
      console.error(error);
    }
  });
});
