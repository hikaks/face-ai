// Test file to check if webcam API is available
export function testWebcamAPI() {
  // Check if mediaDevices API is available
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return {
      supported: false,
      message: "Browser Anda tidak mendukung API akses kamera. Silakan gunakan browser modern seperti Chrome, Firefox, atau Edge."
    };
  }

  // Check if we're in a secure context (HTTPS or localhost)
  if (typeof window !== 'undefined' && !window.isSecureContext) {
    return {
      supported: false,
      message: "Akses kamera memerlukan koneksi yang aman (HTTPS) atau pengembangan di localhost."
    };
  }

  return {
    supported: true,
    message: "API kamera didukung di browser Anda."
  };
}

// Test function to list available cameras
export async function listCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    return videoDevices;
  } catch (error) {
    console.error("Error listing cameras:", error);
    return [];
  }
}

// Test function to check camera permission status
export async function checkCameraPermission() {
  try {
    // Note: This is not supported in all browsers
    if ('permissions' in navigator) {
      const permission = await navigator.permissions.query({ name: 'camera' });
      return permission.state; // 'granted', 'denied', or 'prompt'
    }
    return 'unknown';
  } catch (error) {
    console.error("Error checking camera permission:", error);
    return 'unknown';
  }
}