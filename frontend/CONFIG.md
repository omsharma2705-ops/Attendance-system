# Frontend Configuration Guide

## Setup Instructions

### Option 1: Using Python
```bash
python -m http.server 8000
```

### Option 2: Using Node.js
```bash
npx http-server . -p 8000
```

### Option 3: Using VS Code Live Server
1. Install Live Server extension
2. Right-click on index.html
3. Select "Open with Live Server"

## Configuration

### Update API Base URL
If your backend runs on a different port/domain, update in `js/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';  // Change this
```

## Frontend Structure

```
frontend/
├── css/
│   └── styles.css              # All styling
├── js/
│   ├── api.js                  # API service & auth
│   ├── face-recognition.js     # Face detection logic
│   ├── student-*.js            # Student pages JS
│   └── teacher-*.js            # Teacher pages JS
└── *.html                       # HTML pages
```

## Key Pages

### Student Portal
- `student-register.html` - Registration form
- `student-login.html` - Login page
- `student-dashboard.html` - Dashboard with stats
- `student-face-register.html` - Face capture page
- `student-attendance.html` - Attendance history

### Teacher Portal
- `teacher-login.html` - Login page
- `teacher-dashboard.html` - Dashboard with stats
- `teacher-mark-attendance.html` - Attendance marking
- `teacher-records.html` - Records and export

## Browser Requirements

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Required Permissions
- Camera access (for face capture/detection)
- Microphone (optional, for future features)
- Local storage (for authentication tokens)

## Debugging

Enable console logging:
Open Developer Tools (F12) and check Console tab for:
- Face detection logs
- API calls
- Authentication status
- Face embedding data

## Security Considerations

1. **Token Storage** - Tokens stored in localStorage (consider sessionStorage)
2. **HTTPS** - Use HTTPS in production
3. **CORS** - Backend must allow frontend origin
4. **API Keys** - Don't store sensitive keys in frontend
5. **Validation** - Always validate input on backend

## Performance

1. Models load on initialization (~20-30 seconds first load)
2. Canvas operations are GPU-accelerated
3. Face detection runs at ~30fps
4. Database queries optimized with indexes

## Customization

### Change Logo Text
Edit in each HTML file:
```html
<div class="logo">📊 Smart Attendance System</div>
```

### Change Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
```

### Change Confidence Threshold
In `teacher-mark-attendance.html`:
```html
<input type="number" id="confidenceThreshold" value="60">
```

Default is 60% - increase for stricter matching, decrease for lenient.

## Troubleshooting

### Camera Not Working
- Check browser permissions
- Ensure HTTPS or localhost
- Refresh page and try again
- Check if another app is using camera

### Models Not Loading
- Check network tab in DevTools
- Verify CDN links are accessible
- Wait longer for first load
- Clear browser cache

### Face Not Detected
- Improve lighting
- Move closer to camera
- Ensure face is centered
- Remove glasses/sunglasses

### API Connection Error
- Verify backend is running
- Check CORS configuration
- Verify API_BASE_URL
- Check network tab for actual errors

## Local Development Tips

1. Keep backend and frontend in separate terminals
2. Use Chrome DevTools for debugging
3. Check console for API errors
4. Use Network tab to monitor API calls
5. Test with multiple browser tabs (different logins)

---

For API documentation, see `/backend/CONFIG.md`
