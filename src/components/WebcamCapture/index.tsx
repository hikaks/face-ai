"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Square, Loader2 } from "lucide-react"; // Add Loader2 import
import { testWebcamAPI, listCameras, checkCameraPermission } from "@/lib/webcam-test";

interface WebcamCaptureProps {
  onCapture: (blob: Blob) => void;
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state
  const videoRef = useRef<HTMLVideoElement>(null);

  const getAvailableDevices = useCallback(async () => {
    try {
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.warn("enumerateDevices not supported");
        return;
      }
      
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error getting devices:', error);
      // Don't show error to user for device enumeration, just log it
    }
  }, [selectedDeviceId]);

  useEffect(() => {
    performDiagnostics();
    getAvailableDevices();
  }, [getAvailableDevices]);

  const performDiagnostics = async () => {
    console.log("=== WebcamCapture Diagnostics ===");
    
    const apiTest = testWebcamAPI();
    console.log("API Test:", apiTest);
    
    const permission = await checkCameraPermission();
    console.log("Permission:", permission);
    
    const cameras = await listCameras();
    console.log("Cameras:", cameras);
    
    const info = {
      apiTest,
      permission,
      cameras,
      userAgent: navigator.userAgent,
      isSecureContext: window.isSecureContext,
      protocol: window.location.protocol,
      mediaDevicesSupported: !!navigator.mediaDevices,
      getUserMediaSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    };
    
    console.log("Complete Debug Info:", info);
    
    // Show user-friendly diagnostic results
    if (!info.mediaDevicesSupported) {
      setError("Browser Anda tidak mendukung akses media devices. Silakan gunakan browser modern.");
    } else if (!info.getUserMediaSupported) {
      setError("Browser Anda tidak mendukung getUserMedia API. Silakan perbarui browser Anda.");
    } else if (!info.isSecureContext && info.protocol !== "http:") {
      setError("Akses kamera memerlukan koneksi yang aman (HTTPS) kecuali di localhost.");
    }
  };

  const startCamera = async () => {
    try {
      setIsLoading(true); // Set loading state
      setError(null);
      console.log("Testing camera access...");
      
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser Anda tidak mendukung akses kamera. Silakan gunakan browser modern seperti Chrome, Firefox, atau Edge.");
      }

      // Check if we're in a secure context (HTTPS or localhost)
      if (typeof window !== 'undefined' && !window.isSecureContext) {
        throw new Error("Akses kamera memerlukan koneksi yang aman (HTTPS) atau pengembangan di localhost.");
      }

      // Optimized constraints for skin analysis - higher resolution for better detail
      const constraints = {
        video: selectedDeviceId ? {
          deviceId: { exact: selectedDeviceId },
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 }
        } : {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 15 },
          facingMode: "user"
        },
        audio: false
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log("Stream obtained:", mediaStream);
      console.log("Video tracks:", mediaStream.getVideoTracks());
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        console.log("SrcObject set to video element");
        
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          console.log("Video dimensions:", videoRef.current?.videoWidth, "x", videoRef.current?.videoHeight);
          videoRef.current?.play().then(() => {
            console.log("Video playing successfully");
          }).catch(err => {
            console.error("Error playing video:", err);
            setError("Gagal memutar video dari kamera. Silakan coba lagi.");
          });
        };
        
        // Handle video play errors
        videoRef.current.onerror = (err) => {
          console.error("Video error:", err);
          setError("Terjadi kesalahan saat memutar video dari kamera.");
        };
      }
      
      setStream(mediaStream);
    } catch (err: unknown) {
      console.error("Camera test failed:", err);
      
      // Provide more specific error messages
      let errorMessage = "Gagal mengakses kamera. ";
      
      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          errorMessage += "Izin akses kamera ditolak. Silakan izinkan akses kamera untuk situs ini di pengaturan browser Anda.";
        } else if (err.name === "NotFoundError" || err.name === "OverconstrainedError") {
          errorMessage += "Kamera tidak ditemukan atau tidak sesuai. Silakan periksa koneksi kamera Anda.";
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          errorMessage += "Kamera sedang digunakan oleh aplikasi lain. Silakan tutup aplikasi lain yang menggunakan kamera.";
        } else if (err.name === "AbortError" || err.name === "TimeoutError") {
          errorMessage += "Permintaan akses kamera timeout. Silakan coba lagi.";
        } else {
          errorMessage += err.message;
        }
      } else {
        errorMessage += "Silakan periksa koneksi kamera Anda dan pengaturan browser.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setCapturedImage(null);
  };

  const captureImage = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        // Higher quality JPEG for better skin analysis accuracy
        canvas.toBlob((blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob);
            setCapturedImage(imageUrl);
            onCapture(blob);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="camera-select" className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Kamera:
          </label>
          <select
            id="camera-select"
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!!stream}
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Kamera ${devices.indexOf(device) + 1}`}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={startCamera} disabled={!!stream || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Mengakses Kamera...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Aktifkan Kamera
              </>
            )}
          </Button>
          
          {stream && (
            <>
              <Button onClick={stopCamera} variant="outline">
                <Square className="w-4 h-4 mr-2" />
                Matikan Kamera
              </Button>
              
              <Button onClick={captureImage}>
                <Camera className="w-4 h-4 mr-2" />
                Ambil Foto
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Card className="border-2 border-dashed">
        <CardContent className="p-4">
          {capturedImage ? (
            <div className="relative">
              <img 
                src={capturedImage} 
                alt="Captured" 
                className="w-full h-64 object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 bg-black rounded"
                style={{ objectFit: 'cover' }}
              />

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}