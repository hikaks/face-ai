"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, Zap, Microscope } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { WebcamCapture } from "@/components/WebcamCapture";
// import { SkinAnalyzeResult } from "@/lib/types";

/**
 * Analysis Page Component
 * 
 * This is the main analysis page where users can upload an image or use their webcam
 * to capture a photo for skin analysis. It provides:
 * - Tab-based interface for choosing input method
 * - Image upload with validation
 * - Webcam capture with device selection
 * - Progress indication during analysis
 * - Error handling
 * - Navigation to results page
 * 
 * This component uses the Face++ Skin Analyze API v1 endpoint for skin-specific analysis,
 * which is specifically designed for analyzing skin conditions like acne, dark circles, 
 * wrinkles, and skin type.
 * 
 * Features:
 * - Dual input methods (upload or webcam)
 * - File validation (JPEG, PNG, max 2MB)
 * - Real-time progress feedback
 * - Session storage for temporary result storage
 * - Responsive design
 * - Comprehensive error handling
 * 
 * Workflow:
 * 1. User selects input method (upload or webcam)
 * 2. User provides image (file upload or webcam capture)
 * 3. Image is sent to Face++ Skin Analyze API v1 for detailed skin condition analysis
 * 4. Results are stored in sessionStorage
 * 5. User is redirected to results page
 */
export default function AnalysisPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "webcam">("upload");
  const [analysisType, setAnalysisType] = useState<"basic" | "advanced">("basic");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Add pagehide event listener to automatically clear session storage
  useEffect(() => {
    const handlePageHide = () => {
      // Clear session storage when page is hidden (tab closed, browser closed, etc.)
      sessionStorage.removeItem("skinAnalysisResults");
    };

    // Add event listener for pagehide (more reliable than beforeunload for cleanup)
    window.addEventListener("pagehide", handlePageHide);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  /**
   * Handle image selection from file upload
   * @param file - The selected image file
   */
  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setError(null);
  };

  /**
   * Handle image capture from webcam
   * @param blob - The captured image as a Blob
   */
  const handleCapture = (blob: Blob) => {
    setCapturedImage(blob);
    setError(null);
  };

  /**
   * Handle analysis request
   * Sends image to backend API for Face++ Skin Analyze processing
   */
  const handleAnalyze = async () => {
    let imageToAnalyze: File | null = null;

    if (activeTab === "upload" && selectedImage) {
      imageToAnalyze = selectedImage;
    } else if (activeTab === "webcam" && capturedImage) {
      // Convert blob to file
      imageToAnalyze = new File([capturedImage], "webcam-image.jpg", { type: "image/jpeg" });
    }

    if (!imageToAnalyze) {
      setError("Silakan pilih atau ambil foto terlebih dahulu");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      setAnalysisProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      // Create FormData
      const formData = new FormData();
      formData.append("image", imageToAnalyze);

      // Send to appropriate API route based on analysis type
      const apiEndpoint = analysisType === "advanced" ? "/api/skin-analyze" : "/api/analyze";
      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      if (!response.ok) {
        // Handle different types of errors
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          // Clone the response to avoid "body stream already read" error
          const errorData = await response.clone().json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await response.clone().text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            console.error("Failed to parse error response:", textError);
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Check if data contains error message
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Transform data based on analysis type
      let sessionStorageData;
      
      if (analysisType === "advanced") {
        // Advanced analysis using Skin Analyze API
        sessionStorageData = {
          timestamp: new Date().toISOString(),
          analysisType: "advanced",
          analysisResults: {
            skin: {
              // Map skin analysis data using confidence values from Skin Analyze API
              health: 0, // Will be calculated later
              acne: data.result?.acne?.confidence || data.result?.acne?.value || 0,
              stain: data.result?.skin_spot?.confidence || data.result?.skin_spot?.value || 0,
              dark_circle: data.result?.dark_circle?.confidence || (data.result?.dark_circle?.value === "1" ? 1 : 0),
              wrinkle: 0, // Will be calculated later
              eye_pouch: data.result?.eye_pouch?.confidence || (data.result?.eye_pouch?.value === "1" ? 1 : 0),
              forehead_wrinkle: data.result?.forehead_wrinkle?.confidence || (data.result?.forehead_wrinkle?.value === "1" ? 1 : 0),
              crows_feet: data.result?.crows_feet?.confidence || (data.result?.crows_feet?.value === "1" ? 1 : 0),
              eye_finelines: data.result?.eye_finelines?.confidence || (data.result?.eye_finelines?.value === "1" ? 1 : 0),
              glabella_wrinkle: data.result?.glabella_wrinkle?.confidence || (data.result?.glabella_wrinkle?.value === "1" ? 1 : 0),
              nasolabial_fold: data.result?.nasolabial_fold?.confidence || (data.result?.nasolabial_fold?.value === "1" ? 1 : 0),
              pores_forehead: data.result?.pores_forehead?.confidence || (data.result?.pores_forehead?.value === "1" ? 1 : 0),
              pores_left_cheek: data.result?.pores_left_cheek?.confidence || (data.result?.pores_left_cheek?.value === "1" ? 1 : 0),
              pores_right_cheek: data.result?.pores_right_cheek?.confidence || (data.result?.pores_right_cheek?.value === "1" ? 1 : 0),
              pores_jaw: data.result?.pores_jaw?.confidence || (data.result?.pores_jaw?.value === "1" ? 1 : 0),
              blackhead: data.result?.blackhead?.confidence || (data.result?.blackhead?.value === "1" ? 1 : 0),
              mole: data.result?.mole?.confidence || data.result?.mole?.value || 0,
              skin_spot: data.result?.skin_spot?.confidence || data.result?.skin_spot?.value || 0,
              skin_type: data.result?.skin_type,
              left_eyelids: data.result?.left_eyelids,
              right_eyelids: data.result?.right_eyelids
            },
            // Advanced analysis includes organized skin categories
            skinAnalysis: data.skinAnalysis,
            demographics: {},
            emotion: {},
            beauty: {}
          }
        };
      } else {
        // Basic analysis using Detect API
        sessionStorageData = {
          timestamp: new Date().toISOString(),
          analysisType: "basic",
          analysisResults: {
            skin: {
              // Map skin analysis data using confidence values from Detect API
              health: 0, // Will be calculated later
              acne: data.result?.acne?.confidence || data.result?.acne?.value || 0,
              stain: data.result?.skin_spot?.confidence || data.result?.skin_spot?.value || 0,
              dark_circle: data.result?.dark_circle?.confidence || (data.result?.dark_circle?.value === "1" ? 1 : 0),
              wrinkle: 0, // Will be calculated later
              eye_pouch: data.result?.eye_pouch?.confidence || (data.result?.eye_pouch?.value === "1" ? 1 : 0),
              forehead_wrinkle: data.result?.forehead_wrinkle?.confidence || (data.result?.forehead_wrinkle?.value === "1" ? 1 : 0),
              crows_feet: data.result?.crows_feet?.confidence || (data.result?.crows_feet?.value === "1" ? 1 : 0),
              eye_finelines: data.result?.eye_finelines?.confidence || (data.result?.eye_finelines?.value === "1" ? 1 : 0),
              glabella_wrinkle: data.result?.glabella_wrinkle?.confidence || (data.result?.glabella_wrinkle?.value === "1" ? 1 : 0),
              nasolabial_fold: data.result?.nasolabial_fold?.confidence || (data.result?.nasolabial_fold?.value === "1" ? 1 : 0),
              pores_forehead: data.result?.pores_forehead?.confidence || (data.result?.pores_forehead?.value === "1" ? 1 : 0),
              pores_left_cheek: data.result?.pores_left_cheek?.confidence || (data.result?.pores_left_cheek?.value === "1" ? 1 : 0),
              pores_right_cheek: data.result?.pores_right_cheek?.confidence || (data.result?.pores_right_cheek?.value === "1" ? 1 : 0),
              pores_jaw: data.result?.pores_jaw?.confidence || (data.result?.pores_jaw?.value === "1" ? 1 : 0),
              blackhead: data.result?.blackhead?.confidence || (data.result?.blackhead?.value === "1" ? 1 : 0),
              mole: data.result?.mole?.confidence || data.result?.mole?.value || 0,
              skin_spot: data.result?.skin_spot?.confidence || data.result?.skin_spot?.value || 0,
              skin_type: data.result?.skin_type
            },
            demographics: data.demographics || {},
            emotion: data.emotion || {},
            beauty: data.beauty || {}
          },
          // Add confidence scores for basic analysis
          skinConfidence: {
            health: 0.95, // Default high confidence for calculated health score
            acne: data.result?.acne?.confidence || 0,
            stain: data.result?.skin_spot?.confidence || 0,
            dark_circle: data.result?.dark_circle?.confidence || 0,
            wrinkle: (
              (data.result?.forehead_wrinkle?.confidence || 0) +
              (data.result?.crows_feet?.confidence || 0) +
              (data.result?.eye_finelines?.confidence || 0) +
              (data.result?.glabella_wrinkle?.confidence || 0) +
              (data.result?.nasolabial_fold?.confidence || 0)
            ) / 5
          },
          emotionConfidence: data.emotionConfidence || {}
        };
      }
      
      // Store results in sessionStorage with proper structure
      sessionStorage.setItem("skinAnalysisResults", JSON.stringify(sessionStorageData));
      
      // Navigate to results page
      router.push("/results");
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menganalisis gambar");
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Analisis Kesehatan Kulit</h1>
          <p className="text-muted-foreground">
            Dapatkan analisis instan kondisi kulit Anda tanpa penyimpanan data permanen
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pilih Jenis Analisis</CardTitle>
            <CardDescription>
              Pilih tingkat detail analisis kulit yang Anda inginkan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  analysisType === "basic" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setAnalysisType("basic")}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Analisis Basic</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Analisis cepat kondisi kulit dasar dengan informasi demografis dan emosi
                </p>
              </div>
              
              <div 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  analysisType === "advanced" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setAnalysisType("advanced")}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Microscope className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Analisis Advanced</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Analisis mendalam khusus kulit: kelopak mata, kerutan, pori-pori, jenis kulit
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pilih Metode Input</CardTitle>
            <CardDescription>
              Pilih cara Anda ingin menganalisis kulit - upload gambar atau gunakan webcam
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Button
                variant={activeTab === "upload" ? "default" : "outline"}
                onClick={() => setActiveTab("upload")}
              >
                Upload Gambar
              </Button>
              <Button
                variant={activeTab === "webcam" ? "default" : "outline"}
                onClick={() => setActiveTab("webcam")}
              >
                Gunakan Webcam
              </Button>
            </div>

            {activeTab === "upload" ? (
              <ImageUpload onImageSelect={handleImageSelect} />
            ) : (
              <WebcamCapture onCapture={handleCapture} />
            )}

            {isAnalyzing && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menganalisis gambar...</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Proses analisis sedang berlangsung, mohon tunggu...
                </p>
              </div>
            )}

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleAnalyze} 
              className="w-full"
              disabled={(activeTab === "upload" && !selectedImage) || (activeTab === "webcam" && !capturedImage) || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                `Mulai Analisis ${analysisType === "advanced" ? "Advanced" : "Basic"}`
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Aplikasi ini tidak menyimpan data Anda. Semua hasil analisis akan hilang setelah halaman direfresh.
          </p>
        </div>
      </div>
    </main>
  );
}