"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { testWebcamAPI, listCameras, checkCameraPermission } from "@/lib/webcam-test";

export default function CameraDebugPage() {
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown> | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    performDiagnostics();
  }, []);

  const performDiagnostics = async () => {
    console.log("=== Camera Debug Diagnostics ===");
    
    const apiTest = testWebcamAPI();
    console.log("API Test:", apiTest);
    
    const permission = await checkCameraPermission();
    console.log("Permission:", permission);
    
    const cameras = await listCameras();
    console.log("Cameras:", cameras);
    
    const info: Record<string, unknown> = {
      apiTest,
      permission,
      cameras,
      userAgent: navigator.userAgent,
      isSecureContext: window.isSecureContext,
      protocol: window.location.protocol,
      mediaDevicesSupported: !!navigator.mediaDevices,
      getUserMediaSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    };
    
    setDebugInfo(info);
    console.log("Complete Debug Info:", info);
  };

  const testCamera = async () => {
    try {
      setError(null);
      console.log("Testing camera access...");
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        },
        audio: false
      });
      
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
          }).catch(console.error);
        };
      }
      
      setStream(mediaStream);
    } catch (err: unknown) {
      console.error("Camera test failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
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
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Camera Debug Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={performDiagnostics}>Run Diagnostics</Button>
            <Button onClick={testCamera}>Test Camera</Button>
            <Button onClick={stopCamera} variant="outline">Stop Camera</Button>
          </div>
          
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Video Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 bg-black rounded"
                  style={{ objectFit: 'cover' }}
                />
                <div className="mt-2 text-sm text-gray-600">
                  <p>Stream Active: {stream ? 'Yes' : 'No'}</p>
                  <p>Video Ready State: {videoRef.current?.readyState || 'N/A'}</p>
                  <p>Video Paused: {videoRef.current?.paused ? 'Yes' : 'No'}</p>
                  <p>Video Size: {videoRef.current?.videoWidth || 0}x{videoRef.current?.videoHeight || 0}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Debug Information</CardTitle>
              </CardHeader>
              <CardContent>
                {debugInfo ? (
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-64">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                ) : (
                  <p>Click &quot;Run Diagnostics&quot; to see debug info</p>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}