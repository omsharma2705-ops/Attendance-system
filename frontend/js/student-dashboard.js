// Student Dashboard page
document.addEventListener('DOMContentLoaded', async () => {
  checkAuth('student');
  displayUserInfo();

  const user = authStorage.getUser();
  const token = authStorage.getToken();

  try {
    // Fetch student attendance
    const response = await apiService.getStudentAttendance(user._id, {}, token);

    if (response.attendance) {
      // Update statistics
      document.getElementById('totalClasses').textContent = response.summary.totalClasses;
      document.getElementById('presentCount').textContent = response.summary.present;
      document.getElementById('absentCount').textContent = response.summary.absent;
      document.getElementById('attendancePercentage').textContent = response.summary.attendancePercentage + '%';

      // Populate table
      const tableBody = document.getElementById('attendanceTableBody');
      tableBody.innerHTML = '';

      if (response.attendance.length > 0) {
        response.attendance.slice(0, 10).forEach(record => {
          const row = tableBody.insertRow();
          row.innerHTML = `
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>${record.subject}</td>
            <td>${record.class}</td>
            <td><span class="badge badge-${record.status === 'present' ? 'success' : record.status === 'absent' ? 'danger' : 'warning'}">
              ${record.status.charAt(0).toUpperCase() + record.status.slice(1)}
            </span></td>
            <td>${record.attendanceTime || 'N/A'}</td>
            <td>${record.livenessVerified ? '✅ Yes' : '❌ No'}</td>
          `;
        });
      }
    }
  } catch (error) {
    console.error('Error fetching attendance:', error);
  }
});
