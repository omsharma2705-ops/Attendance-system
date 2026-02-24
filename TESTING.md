# Testing Guide

## Unit Testing Setup

### Install Testing Dependencies
```bash
npm install --save-dev jest supertest
```

### Backend API Tests

Create `backend/tests/api.test.js`:

```javascript
const request = require('supertest');
const app = require('../server');

describe('Student API', () => {
  it('should register a new student', async () => {
    const response = await request(app)
      .post('/api/students/register')
      .send({
        name: 'Test Student',
        email: 'test@example.com',
        rollNumber: 'TEST001',
        department: 'Computer Science',
        semester: 1,
        password: 'test123'
      });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
  });

  it('should login student with correct credentials', async () => {
    const response = await request(app)
      .post('/api/students/login')
      .send({
        email: 'test@example.com',
        password: 'test123'
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
```

### Run Tests
```bash
npm test
```

## Frontend Testing

### Load Test (Chrome DevTools)
1. Open DevTools (F12)
2. Go to Network tab
3. Record page load
4. Check for:
   - Model loading time
   - Total page load time
   - Failed requests

### Face Detection Testing

1. **Good Conditions:**
   - Well-lit environment
   - Clear face visibility
   - Distance 30-60cm from camera

2. **Poor Conditions:**
   - Low light
   - Partial face occlusion
   - Extreme angles

3. **Expected Results:**
   - ~90% accuracy in ideal conditions
   - ~70% in poor lighting
   - ~60% with glasses/masks

## Manual Testing Checklist

### Student Registration
- [ ] Valid registration with all fields
- [ ] Email validation
- [ ] Password confirmation
- [ ] Department selection
- [ ] Error messages for duplicates

### Face Registration
- [ ] Camera permission request
- [ ] Liveness detection works
- [ ] Blink detection triggers
- [ ] 5 angles captured successfully
- [ ] Face embeddings stored

### Student Dashboard
- [ ] Attendance stats display correctly
- [ ] Attendance records show
- [ ] Status badges display
- [ ] Filter functionality works

### Teacher Mark Attendance
- [ ] Subject/Class input
- [ ] Photo capture works
- [ ] Face detection shows boxes
- [ ] Confidence scores display
- [ ] Student checkboxes work
- [ ] Attendance marks successfully

### Attendance Export
- [ ] CSV downloads
- [ ] All data included
- [ ] Proper formatting
- [ ] Special characters handled

## Performance Testing

### Load Testing (Apache Bench)
```bash
ab -n 1000 -c 10 http://localhost:5000/api/health
```

### Memory Profiling
```bash
# Node.js
node --inspect server.js
# Then open chrome://inspect
```

### Face Detection Performance
```javascript
// Add timing to face-recognition.js
console.time('Detection');
const detections = await detectFaces(video);
console.timeEnd('Detection');
```

Target: < 100ms per detection

## Browser Compatibility

Test on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Test Procedure
1. Test registration flow
2. Test face capture
3. Test attendance marking
4. Check console for errors

## Security Testing

### SQL Injection
```javascript
// Test with input: '; DROP TABLE students; --
// Should be sanitized
```

### XSS Testing
```javascript
// Test with input: <script>alert('xss')</script>
// Should be escaped
```

### JWT Validation
```javascript
// Test with modified token - should fail
// Test with expired token - should fail
```

## Integration Testing

### Full User Flow
1. Register new student
2. Capture face
3. View dashboard
4. Teacher captures class photo
5. Check if attendance marked
6. View attendance history
7. Export CSV

All steps should complete successfully.

## Accessibility Testing

- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast
- [ ] Font sizes readable
- [ ] Mobile viewport

## Regression Testing

After each update:
- [ ] All previous tests still pass
- [ ] New features don't break old ones
- [ ] Performance maintained
- [ ] No new bugs introduced

## Performance Benchmarks

| Operation | Current | Target |
|-----------|---------|--------|
| Face Detection | 150ms | < 100ms |
| Face Matching | 50ms | < 50ms |
| API Response | 200ms | < 300ms |
| Page Load | 3s | < 2s |
| Memory Usage | 150MB | < 200MB |

## CI/CD Testing

### Pre-commit Hooks
```bash
# Install husky
npm install husky --save-dev
npx husky install

# Add hook
echo "npm test" > .husky/pre-commit
```

### Automated Testing
Run tests on every commit and pull request.

## Bug Reporting Template

```markdown
### Bug Description
Brief description

### Steps to Reproduce
1. 
2.
3.

### Expected Behavior
What should happen

### Actual Behavior
What actually happened

### Screenshots/Logs
Attachments

### Environment
- Browser: 
- OS:
- Version:
```

---

For detailed testing of specific features, refer to inline code comments.
