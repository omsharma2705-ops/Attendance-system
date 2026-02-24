// Face recognition wrapper for face-api.js with optimized matching
// Uses Euclidean distance for face embedding comparison

let faceRecognitionModel = null;
let detectionOptions = null;

// Initialize face detection models - loads pretrained models
async function initializeFaceRecognition() {
  try {
    const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model/';

    console.log('Loading face recognition models...');
    
    // Load all necessary models in parallel
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);

    // Default detection options - optimized for classroom scenarios
    detectionOptions = new faceapi.TinyFaceDetectorOptions({
      inputSize: 416,
      scoreThreshold: 0.4, // Lower threshold to catch more faces
    });

    console.log('✅ Face recognition models loaded successfully');
    return true;
  } catch (error) {
    console.error('❌ Error loading face recognition models:', error);
    return false;
  }
}

// Detect all faces in image/video
async function detectFaces(input) {
  if (!detectionOptions) {
    const success = await initializeFaceRecognition();
    if (!success) return [];
  }

  try {
    // WithFaceDescriptors generates 128-dim face embeddings
    const detections = await faceapi
      .detectAllFaces(input, detectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions();

    console.log(`Detected ${detections.length} faces`);
    return detections;
  } catch (error) {
    console.error('Error detecting faces:', error);
    return [];
  }
}

// Extract face embedding (128-dimensional vector)
function getFaceEmbedding(detection) {
  if (!detection || !detection.descriptor) {
    return null;
  }
  // Convert Float32Array to regular array for storage/comparison
  return Array.from(detection.descriptor);
}

// Calculate Euclidean distance between two embeddings
// Lower distance = more similar faces
// Typical threshold: ~0.6 matches, >0.6 non-matches
function calculateFaceSimilarity(embedding1, embedding2) {
  if (!embedding1 || !embedding2) return Infinity;
  
  // Ensure both are arrays
  const emb1 = Array.isArray(embedding1) ? embedding1 : Array.from(embedding1);
  const emb2 = Array.isArray(embedding2) ? embedding2 : Array.from(embedding2);

  // Check dimensions match
  if (emb1.length !== emb2.length) {
    console.warn('Embedding dimension mismatch:', emb1.length, 'vs', emb2.length);
    return Infinity;
  }

  // Calculate Euclidean distance
  let sumSquares = 0;
  for (let i = 0; i < emb1.length; i++) {
    const diff = emb1[i] - emb2[i];
    sumSquares += diff * diff;
  }

  const distance = Math.sqrt(sumSquares);
  return distance;
}

// Detect blink (eyes closing/opening cycle) for liveness check
function detectBlink(detection) {
  if (!detection.landmarks) return false;

  const landmarks = detection.landmarks.positions;
  if (!landmarks || landmarks.length < 47) return false;

  // Eye landmarks: 36-41 left eye, 42-47 right eye
  const leftEyeTop = landmarks[37];
  const leftEyeBottom = landmarks[41];
  const rightEyeTop = landmarks[44];
  const rightEyeBottom = landmarks[46];

  if (!leftEyeTop || !leftEyeBottom || !rightEyeTop || !rightEyeBottom) {
    return false;
  }

  // Calculate vertical eye distance
  const leftEyeDistance = Math.abs(leftEyeTop.y - leftEyeBottom.y);
  const rightEyeDistance = Math.abs(rightEyeTop.y - rightEyeBottom.y);

  // Very small distance indicates closed eyes or blink
  const isBlinking = (leftEyeDistance < 5 || rightEyeDistance < 5);

  return isBlinking;
}

// Detect head movement for liveness (multiple frame analysis)
async function detectHeadMovement(video, progressCallback) {
  const frameCount = 30; // Analyze 30 frames (~1 second at 30fps)
  let detections = [];
  let headMovementDetected = false;

  return new Promise((resolve) => {
    let frameNumber = 0;

    const analyzeFrame = async () => {
      try {
        const frameDetections = await detectFaces(video);
        
        if (frameDetections.length > 0) {
          detections.push(frameDetections[0]);

          // Check for head movement between frames
          if (detections.length > 2) {
            const current = detections[detections.length - 1];
            const previous = detections[detections.length - 2];

            // Calculate position shift
            const currentBox = current.detection.box;
            const previousBox = previous.detection.box;

            const xShift = Math.abs(currentBox.x - previousBox.x);
            const yShift = Math.abs(currentBox.y - previousBox.y);

            // Head movement detected if significant shift
            if (xShift > 10 || yShift > 10) {
              headMovementDetected = true;
            }
          }
        }

        frameNumber++;

        if (progressCallback) {
          progressCallback({
            frame: frameNumber,
            total: frameCount,
            detections: detections.length,
            movementDetected: headMovementDetected,
          });
        }

        if (frameNumber < frameCount) {
          requestAnimationFrame(analyzeFrame);
        } else {
          resolve(headMovementDetected || detections.length > 5);
        }
      } catch (error) {
        console.error('Error in frame analysis:', error);
        frameNumber = frameCount; // Exit loop
        resolve(false);
      }
    };

    analyzeFrame();
  });
}

// Full liveness verification (combined checks)
async function verifyLiveness(video, duration = 5000) {
  const startTime = Date.now();
  let blinks = 0;
  let previousEyesOpen = null;

  return new Promise(async (resolve) => {
    const checkFrame = async () => {
      if (Date.now() - startTime > duration) {
        resolve({
          isAlive: blinks >= 1, // Need at least 1 blink
          blinks: blinks,
          confidence: Math.min((blinks / 2) * 100, 100), // Max confidence at 2 blinks
        });
        return;
      }

      try {
        const detections = await detectFaces(video);

        if (detections.length > 0) {
          const detection = detections[0];
          const isBlinking = detectBlink(detection);

          // Track blink transitions (eyes open -> closed)
          if (previousEyesOpen !== null && !previousEyesOpen && isBlinking) {
            blinks++;
          }

          previousEyesOpen = !isBlinking;
        }
      } catch (error) {
        console.error('Liveness check error:', error);
      }

      requestAnimationFrame(checkFrame);
    };

    checkFrame();
  });
}

// Draw detection boxes on canvas with enhanced visualization
function drawFaceDetections(canvas, detections, studentNames = {}, confidenceScores = {}) {
  const ctx = canvas.getContext('2d');
  const displaySize = { width: canvas.width, height: canvas.height };

  // Match canvas dimensions to displayed size
  faceapi.matchDimensions(canvas, displaySize);
  const resizedDetections = faceapi.resizeResults(detections, displaySize);

  // Clear canvas
  ctx.clearRect(0, 0, displaySize.width, displaySize.height);

  // Draw each detection
  resizedDetections.forEach((detection, index) => {
    const box = detection.detection.box;
    const confidence = (detection.detection.score * 100).toFixed(1);

    // Determine color based on recognition status
    const studentName = studentNames[index];
    const isRecognized = studentName && studentName !== 'Unknown';
    const lineColor = isRecognized ? '#10b981' : '#ef4444'; // Green for recognized, red for unknown

    // Draw bounding box
    ctx.lineWidth = 3;
    ctx.strokeStyle = lineColor;
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.stroke();

    // Draw label background
    ctx.fillStyle = lineColor;
    ctx.fillRect(box.x, box.y - 30, 250, 30);

    // Draw label text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textBaseline = 'top';
    
    const labelText = isRecognized
      ? `✓ ${studentName} (${confidence}%)`
      : `? Unknown Person`;
    
    ctx.fillText(labelText, box.x + 5, box.y - 25);
  });
}

// Find best matching student from database
function findMatchingStudent(faceEmbedding, studentEmbeddings, threshold = 0.6) {
  let bestMatch = null;
  let bestDistance = Infinity;

  for (const studentData of studentEmbeddings) {
    if (!studentData.embeddings || studentData.embeddings.length === 0) {
      continue;
    }

    for (const storedEmbedding of studentData.embeddings) {
      const distance = calculateFaceSimilarity(faceEmbedding, storedEmbedding);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = studentData;
      }
    }
  }

  // Check if match quality meets threshold
  if (bestMatch && bestDistance < threshold) {
    return {
      student: bestMatch,
      distance: bestDistance,
      confidence: Math.max(0, (1 - bestDistance / threshold) * 100),
    };
  }

  return null;
}

// Batch process multiple students against a single face embedding
// Returns all matches above threshold
function findAllMatches(faceEmbedding, studentDatabase, threshold = 0.6) {
  const matches = [];

  for (const student of studentDatabase) {
    if (!student.faceEmbeddings || student.faceEmbeddings.length === 0) {
      continue;
    }

    let bestDistance = Infinity;

    for (const storedEmbedding of student.faceEmbeddings) {
      const distance = calculateFaceSimilarity(faceEmbedding, storedEmbedding);
      if (distance < bestDistance) {
        bestDistance = distance;
      }
    }

    if (bestDistance < threshold) {
      matches.push({
        student: student,
        distance: bestDistance,
        confidence: Math.max(0, (1 - bestDistance / threshold) * 100),
      });
    }
  }

  // Sort by confidence (best matches first)
  return matches.sort((a, b) => a.distance - b.distance);
}

// Validate embedding quality
function validateEmbedding(embedding) {
  if (!embedding) return false;
  if (!Array.isArray(embedding) && !(embedding instanceof Float32Array)) return false;
  if (embedding.length !== 128) return false; // Face-api produces 128-dim vectors
  
  // Check for valid numbers
  for (let i = 0; i < embedding.length; i++) {
    if (!isFinite(embedding[i])) return false;
  }
  
  return true;
}

// Calculate average embedding from multiple captures for robustness
function getAverageEmbedding(embeddings) {
  if (!embeddings || embeddings.length === 0) return null;

  const averaged = new Array(128).fill(0);

  for (const embedding of embeddings) {
    const emb = Array.isArray(embedding) ? embedding : Array.from(embedding);
    for (let i = 0; i < emb.length; i++) {
      averaged[i] += emb[i];
    }
  }

  // Divide by count
  for (let i = 0; i < averaged.length; i++) {
    averaged[i] /= embeddings.length;
  }

  return averaged;
}

