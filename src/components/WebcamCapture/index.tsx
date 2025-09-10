"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Square, Loader2 } from "lucide-react"; // Add Loader2 import
import { testWebcamAPI, listCameras, checkCameraPermission } from "@/lib/webcam-test";
import Image from "next/image";

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

      // Check if we're on mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Mobile-optimized constraints - simpler for better compatibility
      const constraints = isMobile ? {
        video: selectedDeviceId ? {
          deviceId: { exact: selectedDeviceId },
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          frameRate: { ideal: 15, min: 10 }
        } : {
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          frameRate: { ideal: 15, min: 10 },
          facingMode: "user"
        },
        audio: false
      } : {
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
      
      console.log("Requesting camera access with constraints:", constraints);
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
      
      // Check if we're on mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Provide more specific error messages
      let errorMessage = "Gagal mengakses kamera. ";
      
      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          if (isMobile) {
            errorMessage += "Izin akses kamera ditolak. Silakan:\n1. Ketuk ikon kamera di address bar\n2. Pilih 'Allow' atau 'Izinkan'\n3. Refresh halaman dan coba lagi\n\nAtau gunakan opsi 'Upload Gambar' sebagai alternatif.";
          } else {
            errorMessage += "Izin akses kamera ditolak. Silakan izinkan akses kamera untuk situs ini di pengaturan browser Anda.";
          }
        } else if (err.name === "NotFoundError" || err.name === "OverconstrainedError") {
          errorMessage += "Kamera tidak ditemukan atau tidak sesuai. Silakan periksa koneksi kamera Anda.";
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          errorMessage += "Kamera sedang digunakan oleh aplikasi lain. Silakan tutup aplikasi lain yang menggunakan kamera.";
        } else if (err.name === "AbortError" || err.name === "TimeoutError") {
          errorMessage += "Permintaan akses kamera timeout. Silakan coba lagi.";
        } else if (err.message.includes("this site can't ask for you permission")) {
          errorMessage += "Browser memblokir permintaan akses kamera. Silakan:\n1. Pastikan tidak ada popup blocker yang aktif\n2. Tutup semua tab lain yang menggunakan kamera\n3. Refresh halaman dan coba lagi\n4. Gunakan opsi 'Upload Gambar' sebagai alternatif";
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
      {/* Status Indicator */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${stream ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {stream ? 'Kamera Aktif' : 'Kamera Tidak Aktif'}
          </span>
        </div>
        {stream && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {devices.find(d => d.deviceId === selectedDeviceId)?.label || 'Kamera Default'}
          </div>
        )}
      </div>
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-300">
          <strong>Error:</strong> 
          <pre className="whitespace-pre-wrap mt-2 text-sm">{error}</pre>
          
          {/* Mobile Fallback */}
          {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded">
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                <strong>Alternatif untuk Mobile:</strong>
              </p>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onCapture(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                />
              </label>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Gunakan tombol di atas untuk mengambil foto langsung dari kamera
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Main Controls Container */}
      <div className="space-y-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Mobile Instructions */}
        {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
              📱 Tips untuk Mobile:
            </p>
            <ul className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 space-y-1">
              <li>• Pastikan browser memiliki izin akses kamera</li>
              <li>• Ketuk ikon kamera di address bar jika muncul</li>
              <li>• Tutup aplikasi lain yang menggunakan kamera</li>
              <li>• Gunakan opsi &quot;Upload Gambar&quot; jika kamera tidak berfungsi</li>
            </ul>
          </div>
        )}
        
        {/* Camera Selection - Mobile Responsive */}
        <div className="space-y-2">
          <label htmlFor="camera-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            📷 Pilih Kamera:
          </label>
          <select
            id="camera-select"
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="w-full px-3 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400"
            disabled={!!stream}
          >
            {devices.length > 0 ? (
              devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  {device.label || `Kamera ${devices.indexOf(device) + 1}`}
                </option>
              ))
            ) : (
              <option value="" disabled className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                Tidak ada kamera yang terdeteksi
              </option>
            )}
          </select>
          {devices.length === 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pastikan kamera terhubung dan browser memiliki izin akses
            </p>
          )}
        </div>
        
        {/* Mobile-Responsive Button Layout */}
        <div className="space-y-3">
          {/* Aktifkan Kamera Button */}
          <Button 
            onClick={startCamera} 
            disabled={!!stream || isLoading}
            className="w-full sm:w-auto"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 sm:mr-2 animate-spin" />
                <span className="hidden sm:inline">Mengakses Kamera...</span>
                <span className="sm:hidden">Loading...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Aktifkan Kamera</span>
                <span className="sm:hidden">Aktifkan</span>
              </>
            )}
          </Button>
          
          {/* Camera Control Buttons - Responsive Grid */}
          {stream && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                onClick={stopCamera} 
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Square className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Matikan Kamera</span>
                <span className="sm:hidden">Matikan</span>
              </Button>
              
              <Button 
                onClick={captureImage}
                className="w-full"
                size="lg"
              >
                <Camera className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Ambil Foto</span>
                <span className="sm:hidden">Ambil Foto</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Video/Image Display - Mobile Responsive */}
      <Card className="border-2 border-dashed">
        <CardContent className="p-2 sm:p-4">
          {capturedImage ? (
            <div className="relative">
              <Image 
                src={capturedImage} 
                alt="Captured" 
                width={640}
                height={480}
                className="w-full h-48 sm:h-64 object-contain rounded-lg mx-auto"
                unoptimized
              />
              <div className="absolute top-2 right-2">
                <Button
                  onClick={() => setCapturedImage(null)}
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <Square className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-48 sm:h-64 bg-black rounded mx-auto"
                style={{ objectFit: 'cover' }}
              />
              {stream && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black/50 text-white px-3 py-1 rounded-full text-xs">
                    📹 Kamera Aktif
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}