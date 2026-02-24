// Student Face Registration page
let videoStream = null;
let capturedFrames = [];
let livenessCheckActive = false;

document.addEventListener('DOMContentLoaded', async () => {
  checkAuth('student');
  displayUserInfo();

  // Initialize face recognition
  const initialized = await initializeFaceRecognition();
  if (!initialized) {
    showMessage('errorMessage', 'Failed to initialize face recognition models', 'error');
    return;
  }

  const video = document.getElementById('videoElement');
  const canvas = document.getElementById('canvasElement');
  const captureBtn = document.getElementById('captureBtn');
  const resetBtn = document.getElementById('resetBtn');
  const submitBtn = document.getElementById('submitBtn');

  // Request camera access
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
    });
    video.srcObject = videoStream;

    document.getElementById('cameraStatus').innerHTML = `
      <span class="liveness-indicator">
        <span class="liveness-dot success"></span>
        Camera ready
      </span>
    `;

    // Auto-detect faces and show liveness indicator
    startLiveDetection(video, canvas);
  } catch (error) {
    showMessage('errorMessage', 'Unable to access camera. Please check permissions.', 'error');
    console.error(error);
  }

  // Capture button
  captureBtn.addEventListener('click', async () => {
    if (capturedFrames.length >= 5) {
      showMessage('errorMessage', 'Maximum 5 angles captured', 'error');
      return;
    }

    // Check for liveness first
    const livenessResult = await verifyLiveness(video, 2000);

    if (livenessResult.isAlive && livenessResult.blinks >= 1) {
      // Capture face
      const detections = await detectFaces(video);

      if (detections.length === 0) {
        showMessage('errorMessage', 'No face detected. Please position yourself properly.', 'error');
        return;
      }

      const embedding = getFaceEmbedding(detections[0]);
      capturedFrames.push({
        embedding: Array.from(embedding),
        index: capturedFrames.length + 1,
      });

      // Create thumbnail
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const thumbnail = canvas.toDataURL('image/jpeg');

      // Add to grid
      const gridItem = document.createElement('div');
      gridItem.style.cssText = 'position: relative; overflow: hidden; border-radius: 0.5rem; aspect-ratio: 1;';
      const img = document.createElement('img');
      img.src = thumbnail;
      img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
      const badge = document.createElement('div');
      badge.style.cssText = `position: absolute; top: 0; right: 0; background: #10b981; color: white; 
                            padding: 0.5rem; font-weight: 600; border-radius: 0.5rem;`;
      badge.textContent = capturedFrames.length;

      gridItem.appendChild(img);
      gridItem.appendChild(badge);
      document.getElementById('captureGrid').appendChild(gridItem);

      document.getElementById('captureCount').textContent = capturedFrames.length;

      if (capturedFrames.length >= 5) {
        submitBtn.parentElement.style.display = 'block';
        showMessage('infoMessage', 'All angles captured! Click "Complete Registration" to finish.', 'info');
      } else {
        showMessage('successMessage', `Face angle ${capturedFrames.length}/5 captured`, 'success');
      }
    } else {
      showMessage('errorMessage', 'Liveness check failed. Please blink or move your head slightly.', 'error');
    }
  });

  // Reset button
  resetBtn.addEventListener('click', () => {
    capturedFrames = [];
    document.getElementById('captureGrid').innerHTML = '';
    document.getElementById('captureCount').textContent = '0';
    submitBtn.parentElement.style.display = 'none';
  });

  // Submit button
  submitBtn.addEventListener('click', async () => {
    if (capturedFrames.length < 3) {
      showMessage('errorMessage', 'Please capture at least 3 face angles', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      const user = authStorage.getUser();
      const token = authStorage.getToken();

      const response = await apiService.addFaceEmbedding(
        {
          studentId: user._id,
          embedding: capturedFrames.map(f => f.embedding),
        },
        token
      );

      if (response.message) {
        showMessage('successMessage', 'Face registration completed! Redirecting to dashboard...', 'success');

        setTimeout(() => {
          window.location.href = 'student-dashboard.html';
        }, 2000);
      }
    } catch (error) {
      showMessage('errorMessage', 'Error saving face embeddings', 'error');
      console.error(error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '✅ Complete Registration';
    }
  });
});

// Live detection for liveness indicator
async function startLiveDetection(video, canvas) {
  const livenessStatus = document.getElementById('livenessStatus');

  const detect = async () => {
    try {
      const detections = await detectFaces(video);

      if (detections.length > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        drawFaceDetections(canvas, detections);

        livenessStatus.style.display = 'block';

        const detection = detections[0];
        const isBlinking = detectBlink(detection);

        if (isBlinking) {
          document.getElementById('livenessIndicator').innerHTML = `
            <span class="liveness-dot success"></span>
            Blink detected - Ready to capture
          `;
        } else {
          document.getElementById('livenessIndicator').innerHTML = `
            <span class="liveness-dot checking"></span>
            Look at camera...
          `;
        }
      } else {
        livenessStatus.style.display = 'none';
      }
    } catch (error) {
      console.error('Detection error:', error);
    }

    requestAnimationFrame(detect);
  };

  detect();
}
