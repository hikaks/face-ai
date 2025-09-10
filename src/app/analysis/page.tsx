"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, Zap, Microscope, Camera, Upload, Sparkles, Shield, Clock, CheckCircle, Info } from "lucide-react";
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
              // Map skin analysis data using actual values from Skin Analyze API
              health: 0, // Will be calculated later
              acne: typeof data.result?.acne === 'object' ? data.result.acne.value : data.result?.acne || 0,
              stain: typeof data.result?.skin_spot === 'object' ? data.result.skin_spot.value : data.result?.skin_spot || 0,
              dark_circle: typeof data.result?.dark_circle === 'object' ? (data.result.dark_circle.value === "1" ? 1 : 0) : (data.result?.dark_circle === "1" ? 1 : 0),
              wrinkle: 0, // Will be calculated later
              eye_pouch: typeof data.result?.eye_pouch === 'object' ? (data.result.eye_pouch.value === "1" ? 1 : 0) : (data.result?.eye_pouch === "1" ? 1 : 0),
              forehead_wrinkle: typeof data.result?.forehead_wrinkle === 'object' ? (data.result.forehead_wrinkle.value === "1" ? 1 : 0) : (data.result?.forehead_wrinkle === "1" ? 1 : 0),
              crows_feet: typeof data.result?.crows_feet === 'object' ? (data.result.crows_feet.value === "1" ? 1 : 0) : (data.result?.crows_feet === "1" ? 1 : 0),
              eye_finelines: typeof data.result?.eye_finelines === 'object' ? (data.result.eye_finelines.value === "1" ? 1 : 0) : (data.result?.eye_finelines === "1" ? 1 : 0),
              glabella_wrinkle: typeof data.result?.glabella_wrinkle === 'object' ? (data.result.glabella_wrinkle.value === "1" ? 1 : 0) : (data.result?.glabella_wrinkle === "1" ? 1 : 0),
              nasolabial_fold: typeof data.result?.nasolabial_fold === 'object' ? (data.result.nasolabial_fold.value === "1" ? 1 : 0) : (data.result?.nasolabial_fold === "1" ? 1 : 0),
              pores_forehead: typeof data.result?.pores_forehead === 'object' ? (data.result.pores_forehead.value === "1" ? 1 : 0) : (data.result?.pores_forehead === "1" ? 1 : 0),
              pores_left_cheek: typeof data.result?.pores_left_cheek === 'object' ? (data.result.pores_left_cheek.value === "1" ? 1 : 0) : (data.result?.pores_left_cheek === "1" ? 1 : 0),
              pores_right_cheek: typeof data.result?.pores_right_cheek === 'object' ? (data.result.pores_right_cheek.value === "1" ? 1 : 0) : (data.result?.pores_right_cheek === "1" ? 1 : 0),
              pores_jaw: typeof data.result?.pores_jaw === 'object' ? (data.result.pores_jaw.value === "1" ? 1 : 0) : (data.result?.pores_jaw === "1" ? 1 : 0),
              blackhead: typeof data.result?.blackhead === 'object' ? (data.result.blackhead.value === "1" ? 1 : 0) : (data.result?.blackhead === "1" ? 1 : 0),
              mole: typeof data.result?.mole === 'object' ? data.result.mole.value : data.result?.mole || 0,
              skin_spot: typeof data.result?.skin_spot === 'object' ? data.result.skin_spot.value : data.result?.skin_spot || 0,
              skin_type: typeof data.result?.skin_type === 'object' ? (data.result.skin_type.value * 25) : (data.result?.skin_type !== undefined ? data.result.skin_type * 25 : undefined),
              left_eyelids: data.result?.left_eyelids,
              right_eyelids: data.result?.right_eyelids
            },
            // Advanced analysis includes organized skin categories
            skinAnalysis: data.skinAnalysis,
            demographics: {},
            emotion: {},
            beauty: {}
          },
          // Store raw result data for advanced analysis
          result: data.result,
          skinConfidence: {
            health: 0.95, // Default high confidence for calculated health score
            acne: typeof data.result?.acne === 'object' ? data.result.acne.confidence : 0,
            stain: typeof data.result?.skin_spot === 'object' ? data.result.skin_spot.confidence : 0,
            dark_circle: typeof data.result?.dark_circle === 'object' ? data.result.dark_circle.confidence : 0,
            wrinkle: 0 // Will be calculated later
          }
        };
      } else {
        // Basic analysis using Detect API
        sessionStorageData = {
          timestamp: new Date().toISOString(),
          analysisType: "basic",
          analysisResults: {
            skin: {
              // Map skin analysis data using actual values from Detect API
              health: typeof data.result?.health === 'object' ? data.result.health.value : data.result?.health || 0,
              acne: typeof data.result?.acne === 'object' ? data.result.acne.value : data.result?.acne || 0,
              stain: typeof data.result?.stain === 'object' ? data.result.stain.value : data.result?.stain || 0,
              dark_circle: typeof data.result?.dark_circle === 'object' ? data.result.dark_circle.value : data.result?.dark_circle || 0,
              wrinkle: typeof data.result?.wrinkle === 'object' ? data.result.wrinkle.value : data.result?.wrinkle || 0,
              eye_pouch: typeof data.result?.eye_pouch === 'object' ? data.result.eye_pouch.value : data.result?.eye_pouch || 0,
              forehead_wrinkle: typeof data.result?.forehead_wrinkle === 'object' ? data.result.forehead_wrinkle.value : data.result?.forehead_wrinkle || 0,
              crows_feet: typeof data.result?.crows_feet === 'object' ? data.result.crows_feet.value : data.result?.crows_feet || 0,
              eye_finelines: typeof data.result?.eye_finelines === 'object' ? data.result.eye_finelines.value : data.result?.eye_finelines || 0,
              glabella_wrinkle: typeof data.result?.glabella_wrinkle === 'object' ? data.result.glabella_wrinkle.value : data.result?.glabella_wrinkle || 0,
              nasolabial_fold: typeof data.result?.nasolabial_fold === 'object' ? data.result.nasolabial_fold.value : data.result?.nasolabial_fold || 0,
              pores_forehead: typeof data.result?.pores_forehead === 'object' ? data.result.pores_forehead.value : data.result?.pores_forehead || 0,
              pores_left_cheek: typeof data.result?.pores_left_cheek === 'object' ? data.result.pores_left_cheek.value : data.result?.pores_left_cheek || 0,
              pores_right_cheek: typeof data.result?.pores_right_cheek === 'object' ? data.result.pores_right_cheek.value : data.result?.pores_right_cheek || 0,
              pores_jaw: typeof data.result?.pores_jaw === 'object' ? data.result.pores_jaw.value : data.result?.pores_jaw || 0,
              blackhead: typeof data.result?.blackhead === 'object' ? data.result.blackhead.value : data.result?.blackhead || 0,
              mole: typeof data.result?.mole === 'object' ? data.result.mole.value : data.result?.mole || 0,
              skin_spot: typeof data.result?.skin_spot === 'object' ? data.result.skin_spot.value : data.result?.skin_spot || 0,
              skin_type: typeof data.result?.skin_type === 'object' ? (data.result.skin_type.value * 25) : (data.result?.skin_type !== undefined ? data.result.skin_type * 25 : undefined)
            },
            demographics: data.demographics || {},
            emotion: data.emotion || {},
            beauty: data.beauty || {}
          },
          // Add confidence scores for basic analysis
          skinConfidence: data.skinConfidence || {
            health: 0.95, // Default high confidence for calculated health score
            acne: typeof data.result?.acne === 'object' ? data.result.acne.confidence : 0,
            stain: typeof data.result?.stain === 'object' ? data.result.stain.confidence : 0,
            dark_circle: typeof data.result?.dark_circle === 'object' ? data.result.dark_circle.confidence : 0,
            wrinkle: typeof data.result?.wrinkle === 'object' ? data.result.wrinkle.confidence : 0
          },
          emotionConfidence: data.emotionConfidence || {},
          // Add additional data from backend
          smile: data.smile,
          blur: data.blur,
          eyestatus: data.eyestatus,
          facequality: data.facequality,
          mouthstatus: data.mouthstatus,
          eyegaze: data.eyegaze,
          headpose: data.headpose
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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 p-8 rounded-xl border border-blue-100 dark:border-blue-800">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Analisis Kesehatan Kulit AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dapatkan analisis mendalam kondisi kulit Anda menggunakan teknologi AI Face++ terdepan. 
            Analisis instan tanpa penyimpanan data permanen.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500 dark:text-green-400" />
              <span>100% Privat & Aman</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span>Analisis Instan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              <span>Hasil Akurat</span>
            </div>
          </div>
        </div>

        {/* Analysis Type Selection */}
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Microscope className="h-6 w-6 text-primary" />
              Pilih Jenis Analisis
            </CardTitle>
            <CardDescription className="text-base">
              Pilih tingkat detail analisis kulit yang sesuai dengan kebutuhan Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Analysis */}
              <div 
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  analysisType === "basic" 
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 shadow-lg" 
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md"
                }`}
                onClick={() => setAnalysisType("basic")}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${analysisType === "basic" ? "bg-blue-500 text-white" : "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"}`}>
                    <Zap className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Analisis Basic</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analisis cepat kondisi kulit dasar dengan informasi demografis dan emosi
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                    <span>Kesehatan kulit keseluruhan</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                    <span>Deteksi jerawat & noda</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                    <span>Analisis emosi & demografi</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                    <span>Skor kecantikan</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                    <Clock className="h-4 w-4" />
                    <span>Waktu: ~3-5 detik</span>
                  </div>
                </div>
              </div>
              
              {/* Advanced Analysis */}
              <div 
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  analysisType === "advanced" 
                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 shadow-lg" 
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md"
                }`}
                onClick={() => setAnalysisType("advanced")}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${analysisType === "advanced" ? "bg-purple-500 text-white" : "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"}`}>
                    <Microscope className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Analisis Advanced</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analisis mendalam khusus kulit dengan 15+ parameter detail
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                    <span>Analisis kelopak mata</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                    <span>Deteksi kerutan detail</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                    <span>Analisis pori-pori</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                    <span>Klasifikasi jenis kulit</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-300">
                    <Clock className="h-4 w-4" />
                    <span>Waktu: ~5-8 detik</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Method Selection */}
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Camera className="h-6 w-6 text-primary" />
              Pilih Metode Input
            </CardTitle>
            <CardDescription className="text-base">
              Pilih cara Anda ingin menganalisis kulit - upload gambar atau gunakan webcam
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4 justify-center">
              <Button
                variant={activeTab === "upload" ? "default" : "outline"}
                onClick={() => setActiveTab("upload")}
                className="flex items-center gap-2 px-6 py-3 text-base"
                size="lg"
              >
                <Upload className="h-5 w-5" />
                Upload Gambar
              </Button>
              <Button
                variant={activeTab === "webcam" ? "default" : "outline"}
                onClick={() => setActiveTab("webcam")}
                className="flex items-center gap-2 px-6 py-3 text-base"
                size="lg"
              >
                <Camera className="h-5 w-5" />
                Gunakan Webcam
              </Button>
            </div>

            {activeTab === "upload" ? (
              <ImageUpload onImageSelect={handleImageSelect} />
            ) : (
              <WebcamCapture onCapture={handleCapture} />
            )}

            {/* Analysis Progress */}
            {isAnalyzing && (
              <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Menganalisis Gambar...
                  </h3>
                  <p className="text-blue-600 dark:text-blue-300">
                    Menggunakan teknologi AI Face++ untuk analisis mendalam
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-blue-700 dark:text-blue-300">
                    <span>Progress</span>
                    <span>{analysisProgress}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-2xl mb-1">🔍</div>
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Deteksi Wajah</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Menganalisis struktur wajah</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-2xl mb-1">🧠</div>
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200">AI Processing</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Menggunakan algoritma AI</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-2xl mb-1">📊</div>
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Generating Results</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">Menyiapkan hasil analisis</div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">Terjadi Kesalahan</h4>
                    <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <div className="text-center">
              <Button 
                onClick={handleAnalyze} 
                className="w-full max-w-md mx-auto py-4 text-lg font-semibold"
                disabled={(activeTab === "upload" && !selectedImage) || (activeTab === "webcam" && !capturedImage) || isAnalyzing}
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-5 w-5" />
                    Mulai Analisis {analysisType === "advanced" ? "Advanced" : "Basic"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Privacy Card */}
          <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/50">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">100% Privat</h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Data Anda tidak disimpan permanen. Semua analisis bersifat sementara.
              </p>
            </CardContent>
          </Card>

          {/* Technology Card */}
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mb-4">
                <Microscope className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">AI Terdepan</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Menggunakan teknologi Face++ AI untuk analisis yang akurat dan mendalam.
              </p>
            </CardContent>
          </Card>

          {/* Speed Card */}
          <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/50">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Hasil Instan</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Dapatkan hasil analisis dalam hitungan detik dengan akurasi tinggi.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Requirements Info */}
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Persyaratan Gambar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-700 dark:text-amber-300">
                  <div>
                    <h4 className="font-medium mb-1">Format File:</h4>
                    <ul className="space-y-1">
                      <li>• Basic: JPEG, PNG</li>
                      <li>• Advanced: JPEG only</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Ukuran:</h4>
                    <ul className="space-y-1">
                      <li>• Maksimal 2MB</li>
                      <li>• Minimal 200x200px</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}