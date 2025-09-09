"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Download } from "lucide-react";
import BasicAnalysisResults from "@/components/BasicAnalysisResults";
import AdvancedAnalysisResults from "@/components/AdvancedAnalysisResults";

/**
 * Interface for skin analysis results from Face++ API
 */
interface SkinAnalyzeResult {
  timestamp?: string;
  confidence?: number;
  analysisResults?: {
    skin?: {
      health?: number;
      stain?: number;
      acne?: number;
      dark_circle?: number;
      wrinkle?: number;
      eye_pouch?: number;
      forehead_wrinkle?: number;
      crows_feet?: number;
      eye_finelines?: number;
      glabella_wrinkle?: number;
      nasolabial_fold?: number;
      pores_forehead?: number;
      pores_left_cheek?: number;
      pores_right_cheek?: number;
      pores_jaw?: number;
      blackhead?: number;
      mole?: number;
      skin_spot?: number;
      skin_type?: number;
    };
    demographics?: {
      age?: number;
      gender?: string;
    };
    emotion?: {
      anger?: number;
      disgust?: number;
      fear?: number;
      happiness?: number;
      neutral?: number;
      sadness?: number;
      surprise?: number;
    };
    beauty?: {
      male_score?: number;
      female_score?: number;
    };
  };
  request_id?: string;
  time_used?: number;
  faces?: Array<{
    face_token?: string;
    face_rectangle?: {
      top: number;
      left: number;
      width: number;
      height: number;
    };
    attributes?: {
      gender?: {
        value: string;
      };
      age?: {
        value: number;
      };
      emotion?: {
        anger?: number;
        disgust?: number;
        fear?: number;
        happiness?: number;
        neutral?: number;
        sadness?: number;
        surprise?: number;
      };
      beauty?: {
        male_score?: number;
        female_score?: number;
      };
      skinstatus?: {
        health?: number;
        stain?: number;
        acne?: number;
        dark_circle?: number;
      };
    };
  }>;
  result?: {
    health?: number;
    stain?: number;
    acne?: number;
    dark_circle?: number;
    wrinkle?: number;
  };
  demographics?: {
    age?: number;
    gender?: string;
  };
  emotion?: {
    anger?: number;
    disgust?: number;
    fear?: number;
    happiness?: number;
    neutral?: number;
    sadness?: number;
    surprise?: number;
  };
  beauty?: {
    male_score?: number;
    female_score?: number;
  };
  warning?: string[];
  quality_tips?: string[];
  skinAnalysis?: {
    skin?: {
      [key: string]: number;
    };
    demographics?: {
      age?: number;
      gender?: string;
    };
    emotion?: {
      [key: string]: number;
    };
    beauty?: {
      male_score?: number;
      female_score?: number;
    };
  }; // For advanced analysis
  // Add confidence scores
  skinConfidence?: {
    health?: number;
    stain?: number;
    acne?: number;
    dark_circle?: number;
    wrinkle?: number;
  };
  emotionConfidence?: {
    [key: string]: number;
  };
}

/**
 * Results Page Component
 * 
 * This component displays the skin analysis results and automatically
 * determines whether to show basic or advanced analysis results based
 * on the data structure.
 */
export default function ResultsPage() {
  const [analysisData, setAnalysisData] = useState<SkinAnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<'basic' | 'advanced'>('basic');
  const router = useRouter();

  useEffect(() => {
    // Retrieve data from sessionStorage
    const storedData = sessionStorage.getItem("skinAnalysisResults");
    const storedType = sessionStorage.getItem("analysisType");
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setAnalysisData(parsedData);
        
        // Determine analysis type based on stored type or data structure
        if (storedType) {
          setAnalysisType(storedType as 'basic' | 'advanced');
        } else {
          // Auto-detect based on data structure
          // Advanced analysis has skinAnalysis property or detailed skin analysis data
          const isAdvanced = parsedData.skinAnalysis || 
                           (parsedData.result && typeof parsedData.result === 'object' && 
                            Object.keys(parsedData.result).length > 4) ||
                           (parsedData.analysisResults?.skin && 
                            Object.keys(parsedData.analysisResults.skin).length > 5);
          setAnalysisType(isAdvanced ? 'advanced' : 'basic');
        }
      } catch (err: unknown) {
        console.error("Error loading analysis data:", err);
        setError("Gagal memuat data hasil analisis");
      }
    } else {
      setError("Tidak ada data hasil analisis. Silakan lakukan analisis terlebih dahulu.");
    }
  }, []);

  // Add beforeunload event listener to warn users about data loss
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Cancel the event and show a warning message
      e.preventDefault();
      e.returnValue = "Hasil analisis akan hilang jika Anda meninggalkan halaman ini. Apakah Anda yakin?";
      return e.returnValue;
    };

    // Add event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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

  const handleNewAnalysis = () => {
    // Show confirmation dialog before starting new analysis
    const confirmNew = window.confirm(
      "Hasil analisis saat ini akan hilang. Apakah Anda yakin ingin memulai analisis baru?"
    );
    
    if (confirmNew) {
      sessionStorage.removeItem("skinAnalysisResults");
      sessionStorage.removeItem("analysisType");
      router.push("/analysis");
    }
  };

  // Function to export results as JSON file
  const exportResults = () => {
    if (!analysisData) return;
    
    // Create a copy of the data for export
    const exportData = {
      timestamp: analysisData.timestamp,
      analysisType: analysisType,
      analysisResults: analysisData.analysisResults,
      result: analysisData.result,
      demographics: analysisData.demographics,
      emotion: analysisData.emotion,
      beauty: analysisData.beauty,
      warning: analysisData.warning,
      quality_tips: analysisData.quality_tips,
      skinAnalysis: analysisData.skinAnalysis
    };
    
    // Convert to JSON string
    const dataStr = JSON.stringify(exportData, null, 2);
    
    // Create blob and download
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `skin-analysis-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    // Show confirmation dialog before going back
    const confirmBack = window.confirm(
      "Hasil analisis akan hilang jika Anda kembali. Apakah Anda yakin?"
    );
    
    if (confirmBack) {
      sessionStorage.removeItem("skinAnalysisResults");
      sessionStorage.removeItem("analysisType");
      router.push("/analysis");
    }
  };

  if (error) {
    return (
      <main className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error}</p>
              <div className="flex gap-4">
                <Button onClick={() => router.push("/analysis")} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Analisis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!analysisData) {
    return (
      <main className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <p>Memuat hasil analisis...</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            {analysisType === 'advanced' ? '🔬 Hasil Analisis Kulit Advanced' : '📊 Hasil Analisis Kulit Basic'}
          </h1>
          <p className="text-muted-foreground">
            {analysisType === 'advanced' 
              ? 'Analisis komprehensif kondisi kulit Anda dengan detail mendalam'
              : 'Analisis dasar kondisi kulit Anda dengan informasi utama'
            }
          </p>
        </div>

        {/* Render komponen berdasarkan jenis analisis */}
        {analysisType === 'advanced' ? (
          <AdvancedAnalysisResults analysisData={analysisData} />
        ) : (
          <BasicAnalysisResults analysisData={analysisData} />
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Button onClick={handleNewAnalysis}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Analisis Baru
          </Button>
          <Button onClick={exportResults} variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Ekspor Hasil
          </Button>
        </div>

        {/* Footer info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Hasil analisis ini bersifat sementara dan akan hilang saat halaman direfresh.
          </p>
        </div>
      </div>
    </main>
  );
}