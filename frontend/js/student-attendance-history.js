// Student Attendance History page
document.addEventListener('DOMContentLoaded', async () => {
  checkAuth('student');
  displayUserInfo();

  const user = authStorage.getUser();
  const token = authStorage.getToken();

  // Load initial attendance
  loadAttendance();

  // Filter button
  document.getElementById('filterBtn').addEventListener('click', loadAttendance);

  // Reset button
  document.getElementById('resetFilterBtn').addEventListener('click', () => {
    document.getElementById('filterSubject').value = '';
    document.getElementById('filterStartDate').value = '';
    document.getElementById('filterEndDate').value = '';
    loadAttendance();
  });

  async function loadAttendance() {
    try {
      const params = {};

      if (document.getElementById('filterSubject').value) {
        params.subject = document.getElementById('filterSubject').value;
      }
      if (document.getElementById('filterStartDate').value) {
        params.startDate = document.getElementById('filterStartDate').value;
      }
      if (document.getElementById('filterEndDate').value) {
        params.endDate = document.getElementById('filterEndDate').value;
      }

      const response = await apiService.getStudentAttendance(user._id, params, token);

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
          response.attendance.forEach(record => {
            const row = tableBody.insertRow();
            row.innerHTML = `
              <td>${new Date(record.date).toLocaleDateString()}</td>
              <td>${record.subject}</td>
              <td>${record.class}</td>
              <td>${record.teacher?.name || 'N/A'}</td>
              <td><span class="badge badge-${record.status === 'present' ? 'success' : record.status === 'absent' ? 'danger' : 'warning'}">
                ${record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </span></td>
              <td>${record.attendanceTime || 'N/A'}</td>
            `;
          });
        } else {
          const row = tableBody.insertRow();
          row.innerHTML = '<td colspan="6" style="text-align: center; color: #64748b;">No records found</td>';
        }
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  }
});
