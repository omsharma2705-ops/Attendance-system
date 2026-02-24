// Teacher Records page
document.addEventListener('DOMContentLoaded', async () => {
  checkAuth('teacher');
  displayUserInfo();

  const token = authStorage.getToken();

  // Load initial records
  loadRecords();

  // Filter button
  document.getElementById('filterBtn').addEventListener('click', loadRecords);

  // Reset button
  document.getElementById('resetFilterBtn').addEventListener('click', () => {
    document.getElementById('filterSubject').value = '';
    document.getElementById('filterClass').value = '';
    document.getElementById('filterStartDate').value = '';
    document.getElementById('filterEndDate').value = '';
    loadRecords();
  });

  // Export button
  document.getElementById('exportBtn').addEventListener('click', exportCSV);

  async function loadRecords() {
    try {
      const params = {};

      if (document.getElementById('filterSubject').value) {
        params.subject = document.getElementById('filterSubject').value;
      }
      if (document.getElementById('filterClass').value) {
        params.class = document.getElementById('filterClass').value;
      }
      if (document.getElementById('filterStartDate').value) {
        params.startDate = document.getElementById('filterStartDate').value;
      }
      if (document.getElementById('filterEndDate').value) {
        params.endDate = document.getElementById('filterEndDate').value;
      }

      const records = await apiService.getAttendanceByDateRange(params, token);

      const tableBody = document.getElementById('recordsTableBody');
      tableBody.innerHTML = '';

      if (Array.isArray(records) && records.length > 0) {
        records.forEach(record => {
          const row = tableBody.insertRow();
          row.innerHTML = `
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>${record.student?.name || 'N/A'}</td>
            <td>${record.student?.rollNumber || 'N/A'}</td>
            <td>${record.subject}</td>
            <td>${record.class}</td>
            <td><span class="badge badge-${record.status === 'present' ? 'success' : record.status === 'absent' ? 'danger' : 'warning'}">
              ${record.status.charAt(0).toUpperCase() + record.status.slice(1)}
            </span></td>
            <td>${record.livenessVerified ? '✅ Yes' : '❌ No'}</td>
            <td>${record.faceConfidence ? (record.faceConfidence * 100).toFixed(1) + '%' : 'N/A'}</td>
          `;
        });
      } else {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #64748b;">No records found</td></tr>';
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  }

  async function exportCSV() {
    try {
      const params = {};

      if (document.getElementById('filterSubject').value) {
        params.subject = document.getElementById('filterSubject').value;
      }
      if (document.getElementById('filterClass').value) {
        params.class = document.getElementById('filterClass').value;
      }
      if (document.getElementById('filterStartDate').value) {
        params.startDate = document.getElementById('filterStartDate').value;
      }
      if (document.getElementById('filterEndDate').value) {
        params.endDate = document.getElementById('filterEndDate').value;
      }

      const csv = await apiService.exportAttendanceCSV(params, token);

      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `attendance_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showMessage('successMessage', 'CSV export started', 'success');
    } catch (error) {
      showMessage('errorMessage', 'Error exporting CSV', 'error');
      console.error(error);
    }
  }
});
