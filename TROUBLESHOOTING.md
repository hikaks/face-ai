# Troubleshooting Webcam Issues

## Common Problems and Solutions

### 1. **"Tidak dapat mengakses kamera" Error**
This is the most common error. Here are solutions:

#### Browser Permissions
- **Chrome/Firefox/Edge**: Click the camera icon in the address bar and allow camera access
- **Safari**: Go to Preferences > Websites > Camera and allow access for localhost

#### HTTPS Requirement
- Camera access requires HTTPS in production
- For localhost development, HTTPS is not required
- If deploying to production, ensure you're using HTTPS

### 2. **Camera Not Found**
- Check if your camera is properly connected
- Ensure no other applications are using the camera
- Try refreshing the page
- Test with a different browser

### 3. **Camera Shows Black Screen**
- Wait a few seconds for the camera to initialize
- Check camera privacy settings in your OS
- Try closing other applications that might use the camera

## Browser-Specific Solutions

### Chrome
1. Go to `chrome://settings/content/camera`
2. Ensure "Sites can use your camera" is enabled
3. Remove any blocked sites

### Firefox
1. Go to `about:preferences#privacy`
2. Scroll to Permissions section
3. Click "Settings" next to Camera
4. Remove any blocked sites

### Edge
1. Go to `edge://settings/content/camera`
2. Ensure "Sites can use your camera" is enabled
3. Remove any blocked sites

### Safari
1. Go to Safari > Preferences > Websites
2. Select "Camera" from the left panel
3. Allow camera access for your site

## Development Environment Tips

### Localhost Development
- Camera access works on localhost without HTTPS
- Use `npm run dev` to start the development server
- Access via `http://localhost:3000`

### Production Deployment
- Must use HTTPS for camera access
- Deploy to platforms that support HTTPS (Vercel, Netlify, etc.)

## OS-Level Permissions

### Windows
1. Go to Settings > Privacy > Camera
2. Ensure "Allow apps to access your camera" is enabled
3. Check that your browser is allowed

### macOS
1. Go to System Preferences > Security & Privacy > Privacy
2. Select "Camera" from the left panel
3. Ensure your browser is checked

### Linux
1. Check camera permissions with `ls -l /dev/video*`
2. Add your user to the appropriate group if needed

## Testing Camera Access

You can test camera access in your browser console:

```javascript
// Check if mediaDevices is available
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log("Camera API is supported");
} else {
  console.log("Camera API is not supported");
}

// List available cameras
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    console.log('Available cameras:', videoDevices);
  });
```

## Code-Level Debugging

In your WebcamCapture component, add these debug logs:

```javascript
const startCamera = async () => {
  console.log("Attempting to access camera...");
  
  try {
    // Check browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Browser does not support camera access");
    }
    
    console.log("Requesting camera permission...");
    
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 }
      } 
    });
    
    console.log("Camera access granted, stream:", stream);
    
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      setStreaming(true);
    }
  } catch (err) {
    console.error("Camera error:", err);
    // Handle specific error types
  }
};
```

## Fallback Solutions

If camera access continues to fail:

1. **Use File Upload**: Always provide an alternative file upload option
2. **Mobile Camera Access**: On mobile, use `<input type="file" accept="image/*" capture="user">`
3. **External Camera**: Try using an external USB camera

## Security Considerations

- Camera access requires user permission
- Never auto-start camera without user interaction
- Always provide clear instructions
- Handle errors gracefully with helpful messages