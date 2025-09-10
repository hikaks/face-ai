"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Download } from "lucide-react";
import BasicAnalysisResults from "@/components/BasicAnalysisResults";
import AdvancedAnalysisResultsFixed from "@/components/AdvancedAnalysisResultsFixed";
import { SkinAnalysisData } from "@/types/analysis";
import { 
  loadAnalysisResults, 
  getAnalysisType, 
  clearAnalysisData, 
  detectAnalysisType 
} from "@/utils/sessionStorage";

/**
 * Results Page Component
 * 
 * This component displays the skin analysis results and automatically
 * determines whether to show basic or advanced analysis results based
 * on the data structure.
 */
export default function ResultsPage() {
  const [analysisData, setAnalysisData] = useState<SkinAnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<'basic' | 'advanced'>('basic');
  const router = useRouter();

  useEffect(() => {
    // Load data using utility functions
    const data = loadAnalysisResults();
    
    if (data) {
      setAnalysisData(data);
      
      // Determine analysis type
      const storedType = getAnalysisType();
      if (storedType) {
        setAnalysisType(storedType);
      } else {
        setAnalysisType(detectAnalysisType(data));
      }
    } else {
      setError("Tidak ada data hasil analisis. Silakan lakukan analisis terlebih dahulu.");
    }
  }, []);

  // Combined cleanup and warning effects
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Cancel the event and show a warning message
      e.preventDefault();
      e.returnValue = "Hasil analisis akan hilang jika Anda meninggalkan halaman ini. Apakah Anda yakin?";
      return e.returnValue;
    };

    const handlePageHide = () => {
      // Clear session storage when page is hidden (tab closed, browser closed, etc.)
      clearAnalysisData();
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  const handleNewAnalysis = () => {
    // Show confirmation dialog before starting new analysis
    const confirmNew = window.confirm(
      "Hasil analisis saat ini akan hilang. Apakah Anda yakin ingin memulai analisis baru?"
    );
    
    if (confirmNew) {
      clearAnalysisData();
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
      clearAnalysisData();
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
          <AdvancedAnalysisResultsFixed analysisData={analysisData} />
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