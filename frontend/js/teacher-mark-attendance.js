// Teacher Mark Attendance - Optimized for Single Photo Capture
let videoStream = null;
let allStudents = [];
let recognizedStudents = [];
let capturedImage = null;
let isProcessing = false;

document.addEventListener('DOMContentLoaded', async () => {
  checkAuth('teacher');
  displayUserInfo();

  // Initialize face recognition models
  showMessage('infoMessage', '🔄 Loading AI models... This may take 15-30 seconds on first load', 'info');
  
  const initialized = await initializeFaceRecognition();
  if (!initialized) {
    showMessage('errorMessage', 'Failed to initialize face recognition models. Please refresh the page.', 'error');
    return;
  }

  showMessage('infoMessage', '✅ AI models loaded successfully!', 'info');

  const token = authStorage.getToken();

  // Fetch all students with embeddings
  try {
    const response = await apiService.getAllStudents(token);
    allStudents = Array.isArray(response) ? response : [];
    console.log(`Loaded ${allStudents.length} students from database`);
  } catch (error) {
    console.error('Error fetching students:', error);
    showMessage('errorMessage', 'Failed to load student database', 'error');
  }

  const video = document.getElementById('videoElement');
  const canvas = document.getElementById('canvasElement');
  const captureBtn = document.getElementById('captureBtn');
  const resetBtn = document.getElementById('resetBtn');
  const submitBtn = document.getElementById('submitBtn');
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');

  // Initialize camera with optimal settings
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 },
        aspectRatio: 16 / 9
      },
      audio: false
    });
    video.srcObject = videoStream;
    video.onloadedmetadata = () => {
      video.play();
    };
  } catch (error) {
    showMessage('errorMessage', 'Unable to access camera. Please check permissions and try again.', 'error');
    console.error('Camera error:', error);
  }

  // Capture photo and process
  captureBtn.addEventListener('click', async () => {
    const subject = document.getElementById('subject').value.trim();
    const className = document.getElementById('class').value.trim();
    const confidenceThreshold = parseInt(document.getElementById('confidenceThreshold').value);

    if (!subject || !className) {
      showMessage('errorMessage', '⚠️ Please enter Subject and Class name', 'error');
      return;
    }

    if (isProcessing) {
      showMessage('errorMessage', 'Processing in progress, please wait...', 'error');
      return;
    }

    try {
      isProcessing = true;
      captureBtn.disabled = true;
      document.getElementById('loadingIndicator').style.display = 'block';
      showMessage('infoMessage', '📸 Capturing and analyzing classroom photo...', 'info');

      // Set canvas dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      // Store captured image
      capturedImage = canvas.toDataURL('image/jpeg', 0.9);

      // Detect all faces in the image
      const detections = await detectFaces(canvas);

      console.log(`Detected ${detections.length} faces in the image`);

      if (detections.length === 0) {
        showMessage('errorMessage', '❌ No faces detected in the image. Please try again with better lighting or positioning.', 'error');
        document.getElementById('loadingIndicator').style.display = 'none';
        isProcessing = false;
        captureBtn.disabled = false;
        return;
      }

      // Process each detected face
      recognizedStudents = [];
      const unknownFaceCount = detections.length;
      let recognizedCount = 0;

      for (let i = 0; i < detections.length; i++) {
        const detection = detections[i];
        const faceEmbedding = getFaceEmbedding(detection);

        // Get face box for drawing
        const box = detection.detection.box;
        const faceConfidence = Math.round(detection.detection.score * 100);

        // Match against student database
        let bestMatch = null;
        let bestDistance = Infinity;

        for (const student of allStudents) {
          // Skip students without embeddings
          if (!student.faceEmbeddings || student.faceEmbeddings.length === 0) {
            continue;
          }

          // Try to match with any of the student's embeddings
          for (const storedEmbedding of student.faceEmbeddings) {
            const distance = calculateFaceSimilarity(faceEmbedding, storedEmbedding);

            if (distance < bestDistance) {
              bestDistance = distance;
              bestMatch = {
                student: student,
                distance: distance,
              };
            }
          }
        }

        // Determine if match meets confidence threshold
        // Lower distance = better match. Distance ~0.6 is typical threshold
        const matchConfidence = Math.max(0, 1 - bestDistance / 0.6) * 100;
        const matchConfidenceThreshold = confidenceThreshold;

        if (bestMatch && matchConfidence >= matchConfidenceThreshold) {
          // Check for duplicates
          const isDuplicate = recognizedStudents.some(
            rs => rs.studentId === bestMatch.student._id
          );

          if (!isDuplicate) {
            recognizedStudents.push({
              studentId: bestMatch.student._id,
              name: bestMatch.student.name,
              rollNumber: bestMatch.student.rollNumber,
              email: bestMatch.student.email,
              department: bestMatch.student.department,
              confidence: matchConfidence.toFixed(1),
              distance: bestDistance.toFixed(4),
              faceIndex: i,
              box: box,
              selected: true, // Auto-select recognized students
            });
            recognizedCount++;
          }
        }
      }

      // Draw detections on canvas
      drawDetectionsWithLabels(canvas, detections, recognizedStudents);

      // Update UI
      document.getElementById('statsContainer').style.display = 'grid';
      document.getElementById('facesDetected').textContent = detections.length;
      document.getElementById('studentsRecognized').textContent = recognizedCount;
      document.getElementById('unknownFaces').textContent = detections.length - recognizedCount;

      // Populate table
      populateStudentTable(recognizedStudents);

      if (recognizedCount === 0) {
        showMessage('warningMessage', `⚠️ No registered students recognized in ${detections.length} detected faces. Try adjusting the confidence threshold.`, 'warning');
      } else {
        showMessage('successMessage', `✅ Successfully recognized ${recognizedCount} students!`, 'success');
      }

      // Show action section and buttons
      document.getElementById('actionSection').style.display = 'block';
      resetBtn.style.display = 'inline-block';
      selectAllCheckbox.checked = true;

    } catch (error) {
      console.error('Error processing image:', error);
      showMessage('errorMessage', '❌ Error processing image. Please try again.', 'error');
    } finally {
      document.getElementById('loadingIndicator').style.display = 'none';
      isProcessing = false;
      captureBtn.disabled = false;
    }
  });

  // Select all checkbox
  selectAllCheckbox.addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll('.student-checkbox');
    checkboxes.forEach(cb => {
      cb.checked = e.target.checked;
    });
    updateMarkedCount();
  });

  // Reset button
  resetBtn.addEventListener('click', () => {
    recognizedStudents = [];
    capturedImage = null;
    document.getElementById('detectedStudentsTable').innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: #64748b;">
          📸 Capture a photo to recognize students
        </td>
      </tr>
    `;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('statsContainer').style.display = 'none';
    document.getElementById('actionSection').style.display = 'none';
    resetBtn.style.display = 'none';
    selectAllCheckbox.checked = false;
    showMessage('infoMessage', '🔄 Ready to capture a new photo', 'info');
  });

  // Submit attendance
  submitBtn.addEventListener('click', async () => {
    const checkboxes = document.querySelectorAll('.student-checkbox:checked');

    if (checkboxes.length === 0) {
      showMessage('errorMessage', '⚠️ Please select at least one student to mark present', 'error');
      return;
    }

    const studentIds = [];
    checkboxes.forEach(checkbox => {
      const studentId = checkbox.value;
      studentIds.push(studentId);
    });

    if (studentIds.length === 0) {
      showMessage('errorMessage', 'No students selected', 'error');
      return;
    }

    try {
      submitBtn.disabled = true;
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '⏳ Marking attendance...';

      const teacher = authStorage.getUser();
      const subject = document.getElementById('subject').value.trim();
      const className = document.getElementById('class').value.trim();

      const response = await apiService.markAttendance(
        {
          studentIds: studentIds,
          subject: subject,
          class: className,
          teacherId: teacher._id,
          livenessVerified: true,
        },
        token
      );

      if (response.message) {
        showMessage('successMessage', `✅ ${response.count} students marked present successfully!`, 'success');

        // Reset form
        setTimeout(() => {
          document.getElementById('subject').value = '';
          document.getElementById('class').value = '';
          recognizedStudents = [];
          document.getElementById('detectedStudentsTable').innerHTML = `
            <tr>
              <td colspan="6" style="text-align: center; padding: 2rem; color: #64748b;">
                📸 Capture a photo to recognize students
              </td>
            </tr>
          `;
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
          document.getElementById('statsContainer').style.display = 'none';
          document.getElementById('actionSection').style.display = 'none';
          resetBtn.style.display = 'none';
          selectAllCheckbox.checked = false;

          // Redirect after 2 seconds
          setTimeout(() => {
            window.location.href = 'teacher-dashboard.html';
          }, 2000);
        }, 1500);
      }
    } catch (error) {
      showMessage('errorMessage', '❌ Error marking attendance. Please try again.', 'error');
      console.error(error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
});

// Populate student table with recognized students
function populateStudentTable(students) {
  const tableBody = document.getElementById('detectedStudentsTable');
  tableBody.innerHTML = '';

  if (students.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 2rem; color: #f59e0b;">
          ⚠️ No students recognized. Adjust confidence threshold or try different image.
        </td>
      </tr>
    `;
    return;
  }

  students.forEach((student, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="text-align: center; padding: 0.75rem;">
        <input type="checkbox" class="student-checkbox" value="${student.studentId}" ${student.selected ? 'checked' : ''}>
      </td>
      <td style="font-weight: 600;">${student.name}</td>
      <td>${student.rollNumber}</td>
      <td>${student.department}</td>
      <td>
        <span class="badge" style="background: ${student.confidence >= 75 ? '#d1fae5' : '#fef3c7'}; color: ${student.confidence >= 75 ? '#065f46' : '#92400e'};">
          ${student.confidence}%
        </span>
      </td>
      <td><span class="badge badge-success">✅ Recognized</span></td>
    `;
    tableBody.appendChild(row);
  });

  // Add event listeners to checkboxes
  document.querySelectorAll('.student-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', updateMarkedCount);
  });
}

// Update marked count display
function updateMarkedCount() {
  const checkedCount = document.querySelectorAll('.student-checkbox:checked').length;
  document.getElementById('markedCount').textContent = checkedCount;
}

// Enhanced drawing function with student names
function drawDetectionsWithLabels(canvas, detections, recognizedStudents) {
  const ctx = canvas.getContext('2d');
  const displaySize = { width: canvas.width, height: canvas.height };

  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Prepare recognized student map by face index
  const recognizedByFace = {};
  recognizedStudents.forEach(rs => {
    recognizedByFace[rs.faceIndex] = rs;
  });

  // Draw each detection
  detections.forEach((detection, index) => {
    const box = detection.detection.box;
    const confidence = Math.round(detection.detection.score * 100);

    // Check if this face was recognized
    const recognizedStudent = recognizedByFace[index];

    if (recognizedStudent) {
      // Green box for recognized students
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#10b981'; // Green
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
    } else {
      // Red box for unknown faces
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ef4444'; // Red
      ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
    }

    // Draw face box
    ctx.fillRect(box.x, box.y, box.width, box.height);
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // Draw label background
    ctx.fillStyle = recognizedStudent ? '#10b981' : '#ef4444';
    ctx.fillRect(box.x, box.y - 35, 300, 35);

    // Draw label text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 13px Arial';
    ctx.textBaseline = 'middle';

    let labelText;
    if (recognizedStudent) {
      labelText = `✓ ${recognizedStudent.name} (${recognizedStudent.confidence}%)`;
    } else {
      labelText = `? Unknown Person (${confidence}%)`;
    }

    ctx.fillText(labelText, box.x + 5, box.y - 17);
  });
}

