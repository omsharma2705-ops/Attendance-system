// Teacher Dashboard page
document.addEventListener('DOMContentLoaded', async () => {
  checkAuth('teacher');
  displayUserInfo();

  const teacher = authStorage.getUser();
  const token = authStorage.getToken();

  try {
    // Fetch all students
    const studentsResponse = await apiService.getAllStudents(token);

    if (Array.isArray(studentsResponse)) {
      document.getElementById('totalStudents').textContent = studentsResponse.length;
    }

    // Fetch today's attendance summary
    const today = new Date().toISOString().split('T')[0];
    const summaryResponse = await apiService.getDailyAttendanceSummary(
      { date: today },
      token
    );

    if (summaryResponse) {
      document.getElementById('classesTaken').textContent = summaryResponse.totalRecords;
      document.getElementById('livenessVerified').textContent = summaryResponse.livenessVerified;

      if (summaryResponse.totalRecords > 0) {
        const presentPercentage = (summaryResponse.present / summaryResponse.totalRecords * 100).toFixed(1);
        document.getElementById('avgAttendance').textContent = presentPercentage + '%';
      }

      // Display today's classes
      const previousSessions = await apiService.getAttendanceByDateRange(
        { startDate: today, endDate: today },
        token
      );

      if (previousSessions.length > 0) {
        const classesHTML = previousSessions
          .map(session => `<div style="padding: 1rem; background: #f0f9ff; border-radius: 0.5rem; margin-bottom: 0.5rem;">
            <strong>${session.subject}</strong> | Class: ${session.class} | Present: ${session.status === 'present' ? '✅' : '❌'}
          </div>`)
          .join('');
        document.getElementById('todaysClasses').innerHTML = classesHTML;
      } else {
        document.getElementById('todaysClasses').innerHTML = '<p style="color: #64748b;">No classes marked today</p>';
      }

      // Recent sessions table
      if (previousSessions.length > 0) {
        const tableBody = document.getElementById('sessionsTableBody');
        tableBody.innerHTML = '';

        previousSessions.slice(0, 10).forEach(session => {
          const row = tableBody.insertRow();
          row.innerHTML = `
            <td>${new Date(session.date).toLocaleDateString()}</td>
            <td>${session.subject}</td>
            <td>${session.class}</td>
            <td>1</td>
            <td>${session.livenessVerified ? '✅' : '❌'}</td>
            <td><a href="teacher-records.html" style="color: #2563eb; cursor: pointer;">View</a></td>
          `;
        });
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
});
