import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Heart, Droplets, Zap, Waves } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BasicAnalysisResultsProps } from '@/types/analysis';

export default function BasicAnalysisResults({ analysisData }: BasicAnalysisResultsProps) {
  // Use unified data structure - prioritize skinAnalysis if available, fallback to analysisResults
  const skinData = analysisData.skinAnalysis ? {
    // Basic skin data
    health: (analysisData.result as { health?: number })?.health || 0,
    stain: analysisData.skinAnalysis.skinIssues?.skin_spot?.value || 0,
    acne: analysisData.skinAnalysis.skinIssues?.acne?.value || 0,
    dark_circle: analysisData.skinAnalysis.eyeArea?.dark_circle?.value || 0,
    wrinkle: (analysisData.skinAnalysis.wrinkles?.forehead_wrinkle?.value || 0) + 
             (analysisData.skinAnalysis.wrinkles?.crows_feet?.value || 0) + 
             (analysisData.skinAnalysis.wrinkles?.eye_finelines?.value || 0),
    skin_type: analysisData.skinAnalysis.skinType?.skin_type || 0,
    
    // Additional detailed data from backend
    eye_pouch: analysisData.skinAnalysis.eyeArea?.eye_pouch?.value || 0,
    forehead_wrinkle: analysisData.skinAnalysis.wrinkles?.forehead_wrinkle?.value || 0,
    crows_feet: analysisData.skinAnalysis.wrinkles?.crows_feet?.value || 0,
    eye_finelines: analysisData.skinAnalysis.wrinkles?.eye_finelines?.value || 0,
    glabella_wrinkle: analysisData.skinAnalysis.wrinkles?.glabella_wrinkle?.value || 0,
    nasolabial_fold: analysisData.skinAnalysis.wrinkles?.nasolabial_fold?.value || 0,
    pores_forehead: analysisData.skinAnalysis.pores?.pores_forehead?.value || 0,
    pores_left_cheek: analysisData.skinAnalysis.pores?.pores_left_cheek?.value || 0,
    pores_right_cheek: analysisData.skinAnalysis.pores?.pores_right_cheek?.value || 0,
    pores_jaw: analysisData.skinAnalysis.pores?.pores_jaw?.value || 0,
    blackhead: analysisData.skinAnalysis.skinIssues?.blackhead?.value || 0,
    mole: analysisData.skinAnalysis.skinIssues?.mole?.value || 0,
    skin_spot: analysisData.skinAnalysis.skinIssues?.skin_spot?.value || 0
  } : analysisData.analysisResults?.skin;
  
  const demographics = analysisData.demographics || analysisData.analysisResults?.demographics;
  const emotion = analysisData.emotion || analysisData.analysisResults?.emotion;
  const beauty = analysisData.beauty || analysisData.analysisResults?.beauty;
  const skinConfidence = analysisData.skinConfidence;

  // Function to get skin type label - FIXED to match API documentation
  const getSkinTypeLabel = (skinType: number) => {
    // According to API documentation: 0=oily, 1=dry, 2=normal, 3=mixed
    const types = [
      { label: 'Berminyak', emoji: '💧', color: 'from-yellow-50 to-amber-50', border: 'border-yellow-200' },
      { label: 'Kering', emoji: '🏜️', color: 'from-orange-50 to-amber-50', border: 'border-orange-200' },
      { label: 'Normal', emoji: '✨', color: 'from-green-50 to-emerald-50', border: 'border-green-200' },
      { label: 'Kombinasi', emoji: '🌗', color: 'from-blue-50 to-cyan-50', border: 'border-blue-200' }
    ];
    
    return types[skinType] || { label: 'Tidak Diketahui', emoji: '❓', color: 'from-gray-50 to-slate-50', border: 'border-gray-200' };
  };

  // Use health score from backend or calculate if not available
  const healthScore = skinData?.health || (skinData ? Math.round(
    ((100 - (skinData.stain || 0)) + 
     (100 - (skinData.acne || 0)) + 
     (100 - (skinData.dark_circle || 0)) + 
     (100 - (skinData.wrinkle || 0))) / 4
  ) : 0);

  // Prepare radar chart data with enhanced information
  const radarData = [
    { 
      subject: 'Kesehatan', 
      value: healthScore, 
      fullMark: 100,
      emoji: '🫧',
      description: 'Kondisi kesehatan kulit secara keseluruhan'
    },
    { 
      subject: 'Bebas Noda', 
      value: 100 - (skinData?.stain || 0), 
      fullMark: 100,
      emoji: '✨',
      description: 'Tingkat kebersihan kulit dari noda'
    },
    { 
      subject: 'Bebas Jerawat', 
      value: 100 - (skinData?.acne || 0), 
      fullMark: 100,
      emoji: '🌟',
      description: 'Kondisi kulit bebas dari jerawat'
    },
    { 
      subject: 'Mata Cerah', 
      value: 100 - (skinData?.dark_circle || 0), 
      fullMark: 100,
      emoji: '👁️',
      description: 'Kondisi area mata tanpa lingkaran hitam'
    },
    { 
      subject: 'Anti Aging', 
      value: 100 - (skinData?.wrinkle || 0), 
      fullMark: 100,
      emoji: '⏰',
      description: 'Kondisi kulit bebas dari kerutan'
    },
  ];

  // Custom tooltip component for radar chart
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
      const data = radarData.find(item => item.subject === label);
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold flex items-center gap-2">
            <span>{data?.emoji}</span>
            {label}
          </p>
          <p className="text-sm text-gray-600 mb-1">{data?.description}</p>
          <p className="text-primary font-bold">
            Skor: {Math.round(payload[0].value)}/100
          </p>
        </div>
      );
    }
    return null;
  };

  // Generate recommendations based on basic analysis
  const generateRecommendations = () => {
    const recommendations = [];
    
    if (skinData?.health && skinData.health < 70) {
      recommendations.push({
        title: "Tingkatkan Kesehatan Kulit",
        description: "Gunakan serum vitamin C dan pelembap dengan SPF untuk melindungi dan memperbaiki kulit.",
        priority: "high" as const
      });
    }
    
    if (skinData?.acne && skinData.acne > 30) {
      recommendations.push({
        title: "Atasi Jerawat",
        description: "Gunakan produk dengan salisilat atau benzoyl peroxide. Hindari menyentuh wajah secara berlebihan.",
        priority: "high" as const
      });
    }
    
    if (skinData?.dark_circle && skinData.dark_circle > 30) {
      recommendations.push({
        title: "Kurangi Lingkaran Hitam",
        description: "Gunakan eye cream dengan kafein atau retinol. Pastikan tidur cukup (7-8 jam per malam).",
        priority: "high" as const
      });
    }
    
    if (skinData?.stain && skinData.stain > 20) {
      recommendations.push({
        title: "Atasi Noda Kulit",
        description: "Gunakan produk dengan niacinamide atau alpha arbutin untuk mencerahkan noda.",
        priority: "medium" as const
      });
    }
    
    if (skinData?.wrinkle && skinData.wrinkle > 25) {
      recommendations.push({
        title: "Cegah Kerutan",
        description: "Gunakan retinol atau peptide serum untuk merangsang produksi kolagen.",
        priority: "medium" as const
      });
    }
    
    // Always add basic skincare routine
    recommendations.push({
      title: "Rutinitas Perawatan",
      description: "Bersihkan wajah dua kali sehari, gunakan sunscreen setiap pagi, dan pelembap setiap malam.",
      priority: "low" as const
    });
    
    recommendations.push({
      title: "Hidrasi dari Dalam",
      description: "Minum minimal 8 gelas air putih sehari untuk menjaga kelembapan kulit.",
      priority: "low" as const
    });
    
    return recommendations;
  };

  const recommendations = generateRecommendations();

  // Get dominant emotion
  const getDominantEmotion = () => {
    if (!emotion) return null;
    
    const emotions = [
      { name: 'Bahagia', value: emotion.happiness || 0, emoji: '😊' },
      { name: 'Netral', value: emotion.neutral || 0, emoji: '😐' },
      { name: 'Sedih', value: emotion.sadness || 0, emoji: '😢' },
      { name: 'Marah', value: emotion.anger || 0, emoji: '😠' },
      { name: 'Takut', value: emotion.fear || 0, emoji: '😨' },
      { name: 'Terkejut', value: emotion.surprise || 0, emoji: '😲' },
      { name: 'Jijik', value: emotion.disgust || 0, emoji: '🤢' },
    ];
    
    return emotions.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current
    );
  };

  const dominantEmotion = getDominantEmotion();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <span className="text-2xl">📊</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Hasil Analisis Kulit Basic
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Analisis dasar kondisi kulit menggunakan Face++ Detect API dengan teknologi AI terdepan
        </p>
      </div>

      {/* Overall Health Score */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            🏥 Skor Kesehatan Kulit Keseluruhan
          </CardTitle>
          <CardDescription>
            Berdasarkan analisis dari berbagai aspek kulit
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-6xl font-bold text-primary mb-4">
            {healthScore}/100
          </div>
          <Progress value={healthScore} className="w-full max-w-md mx-auto" />
        </CardContent>
      </Card>

      {/* Radar Chart Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            📈 Visualisasi Analisis
          </CardTitle>
          <CardDescription>
            Perbandingan kondisi berbagai aspek kulit Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid 
                  stroke="#e2e8f0" 
                  strokeWidth={1}
                />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fontSize: 12, fontWeight: 'bold' }}
                  className="fill-gray-700"
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10 }}
                  tickCount={6}
                  className="fill-gray-500"
                />
                <Radar
                  name="Kondisi Kulit"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Chart Legend with Emojis */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            {radarData.map((item, index) => (
              <div key={index} className="flex items-center gap-1 p-2 bg-gray-50 rounded">
                <span className="text-sm">{item.emoji}</span>
                <span className="font-medium">{item.subject}</span>
                <span className="text-primary font-bold ml-auto">
                  {Math.round(item.value)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
            <Eye className="h-6 w-6 text-primary" />
            🔍 Detail Analisis Basic
          </h2>
          <p className="text-muted-foreground">
            Rincian hasil analisis setiap aspek kulit dengan skor detail
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold">🫧 Kesehatan Kulit</h3>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {skinData?.health || 0}/100
            </div>
            {skinConfidence?.health && (
              <div className="text-xs text-muted-foreground mt-1">
                Confidence: {Math.round((skinConfidence.health || 0) * 100)}%
              </div>
            )}
          </div>
          
          <div className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="h-4 w-4 text-yellow-600" />
              <h3 className="font-semibold">✨ Bebas Noda</h3>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {100 - (skinData?.stain || 0)}/100
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Tingkat kebersihan kulit dari noda
            </div>
            {skinConfidence?.stain && (
              <div className="text-xs text-muted-foreground">
                Confidence: {Math.round((skinConfidence.stain || 0) * 100)}%
              </div>
            )}
          </div>
          
          <div className="p-4 border rounded-lg bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-red-600" />
              <h3 className="font-semibold">🌟 Bebas Jerawat</h3>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {100 - (skinData?.acne || 0)}/100
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Kondisi kulit bebas dari jerawat
            </div>
            {skinConfidence?.acne && (
              <div className="text-xs text-muted-foreground">
                Confidence: {Math.round((skinConfidence.acne || 0) * 100)}%
              </div>
            )}
          </div>
          
          <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold">👁️ Mata Cerah</h3>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {100 - (skinData?.dark_circle || 0)}/100
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Kondisi area mata tanpa lingkaran hitam
            </div>
            {skinConfidence?.dark_circle && (
              <div className="text-xs text-muted-foreground">
                Confidence: {Math.round((skinConfidence.dark_circle || 0) * 100)}%
              </div>
            )}
          </div>
          
          <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Waves className="h-4 w-4 text-green-600" />
              <h3 className="font-semibold">⏰ Anti Aging</h3>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {100 - (skinData?.wrinkle || 0)}/100
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Kondisi kulit bebas dari kerutan
            </div>
            {skinConfidence?.wrinkle && (
              <div className="text-xs text-muted-foreground">
                Confidence: {Math.round((skinConfidence.wrinkle || 0) * 100)}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Detailed Analysis - New Data from Backend */}
      {skinData && (skinData.eye_pouch || skinData.forehead_wrinkle || skinData.crows_feet || 
                   skinData.eye_finelines || skinData.glabella_wrinkle || skinData.nasolabial_fold ||
                   skinData.pores_forehead || skinData.pores_left_cheek || skinData.pores_right_cheek || 
                   skinData.pores_jaw || skinData.blackhead || skinData.mole) && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
              <Eye className="h-6 w-6 text-primary" />
              🔬 Analisis Detail Tambahan
            </h2>
            <p className="text-muted-foreground">
              Data analisis mendalam yang tersedia dari backend
            </p>
          </div>
          
          {/* Wrinkles Detail */}
          {(skinData.forehead_wrinkle || skinData.crows_feet || skinData.eye_finelines || 
            skinData.glabella_wrinkle || skinData.nasolabial_fold) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Waves className="h-5 w-5 text-green-600" />
                📏 Detail Kerutan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(skinData.forehead_wrinkle || 0) > 0 && (
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <div className="text-sm font-medium text-green-800">Forehead Wrinkle</div>
                    <div className="text-xl font-bold text-green-600">{skinData.forehead_wrinkle || 0}/100</div>
                  </div>
                )}
                {(skinData.crows_feet || 0) > 0 && (
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <div className="text-sm font-medium text-green-800">Crows Feet</div>
                    <div className="text-xl font-bold text-green-600">{skinData.crows_feet || 0}/100</div>
                  </div>
                )}
                {(skinData.eye_finelines || 0) > 0 && (
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <div className="text-sm font-medium text-green-800">Eye Finelines</div>
                    <div className="text-xl font-bold text-green-600">{skinData.eye_finelines || 0}/100</div>
                  </div>
                )}
                {(skinData.glabella_wrinkle || 0) > 0 && (
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <div className="text-sm font-medium text-green-800">Glabella Wrinkle</div>
                    <div className="text-xl font-bold text-green-600">{skinData.glabella_wrinkle || 0}/100</div>
                  </div>
                )}
                {(skinData.nasolabial_fold || 0) > 0 && (
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <div className="text-sm font-medium text-green-800">Nasolabial Fold</div>
                    <div className="text-xl font-bold text-green-600">{skinData.nasolabial_fold || 0}/100</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pores Detail */}
          {(skinData.pores_forehead || skinData.pores_left_cheek || skinData.pores_right_cheek || skinData.pores_jaw) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-600" />
                🕳️ Detail Pori-pori
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(skinData.pores_forehead || 0) > 0 && (
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                    <div className="text-sm font-medium text-blue-800">Forehead</div>
                    <div className="text-xl font-bold text-blue-600">{skinData.pores_forehead || 0}/100</div>
                  </div>
                )}
                {(skinData.pores_left_cheek || 0) > 0 && (
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                    <div className="text-sm font-medium text-blue-800">Left Cheek</div>
                    <div className="text-xl font-bold text-blue-600">{skinData.pores_left_cheek || 0}/100</div>
                  </div>
                )}
                {(skinData.pores_right_cheek || 0) > 0 && (
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                    <div className="text-sm font-medium text-blue-800">Right Cheek</div>
                    <div className="text-xl font-bold text-blue-600">{skinData.pores_right_cheek || 0}/100</div>
                  </div>
                )}
                {(skinData.pores_jaw || 0) > 0 && (
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                    <div className="text-sm font-medium text-blue-800">Jaw</div>
                    <div className="text-xl font-bold text-blue-600">{skinData.pores_jaw || 0}/100</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skin Issues Detail */}
          {(skinData.blackhead || skinData.mole || skinData.skin_spot) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-red-600" />
                🔴 Detail Masalah Kulit
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(skinData.blackhead || 0) > 0 && (
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
                    <div className="text-sm font-medium text-red-800">Blackhead</div>
                    <div className="text-xl font-bold text-red-600">{skinData.blackhead || 0}/100</div>
                  </div>
                )}
                {(skinData.mole || 0) > 0 && (
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
                    <div className="text-sm font-medium text-red-800">Mole</div>
                    <div className="text-xl font-bold text-red-600">{skinData.mole || 0}/100</div>
                  </div>
                )}
                {(skinData.skin_spot || 0) > 0 && (
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
                    <div className="text-sm font-medium text-red-800">Skin Spot</div>
                    <div className="text-xl font-bold text-red-600">{skinData.skin_spot || 0}/100</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Eye Area Detail */}
          {(skinData.eye_pouch || 0) > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                👁️ Detail Area Mata
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
                  <div className="text-sm font-medium text-purple-800">Eye Pouch</div>
                  <div className="text-xl font-bold text-purple-600">{skinData.eye_pouch || 0}/100</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Demographics */}
      {(demographics?.age || demographics?.gender) && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
              <Eye className="h-6 w-6 text-primary" />
              👤 Informasi Demografi
            </h2>
            <p className="text-muted-foreground">
              Informasi usia dan jenis kelamin berdasarkan analisis AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {demographics?.age && (
              <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎂</span>
                  <h3 className="font-bold">Usia</h3>
                </div>
                <div className="text-xl font-semibold text-blue-600">
                  {demographics?.age} tahun
                </div>
              </div>
            )}
            
            {demographics?.gender && (
              <div className="p-4 border rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {demographics?.gender === 'Male' ? '👨' : '👩'}
                  </span>
                  <h3 className="font-bold">Jenis Kelamin</h3>
                </div>
                <div className="text-xl font-semibold text-pink-600">
                  {demographics?.gender === 'Male' ? 'Laki-laki' : 'Perempuan'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Emotion Analysis */}
      {dominantEmotion && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
              <Eye className="h-6 w-6 text-primary" />
              😊 Analisis Emosi
            </h2>
            <p className="text-muted-foreground">
              Ekspresi wajah yang terdeteksi dari analisis AI
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="text-center p-8 border rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 shadow-sm">
              <div className="text-8xl mb-6">{dominantEmotion?.emoji}</div>
              <h3 className="text-2xl font-bold mb-3 text-amber-800">{dominantEmotion?.name}</h3>
              <div className="text-lg text-muted-foreground">
                Tingkat kepercayaan: <span className="font-semibold text-amber-600">{Math.round(dominantEmotion?.value || 0)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Beauty Score */}
      {beauty && (beauty?.male_score || beauty?.female_score) && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
              <Eye className="h-6 w-6 text-primary" />
              ✨ Skor Kecantikan
            </h2>
            <p className="text-muted-foreground">
              Penilaian kecantikan berdasarkan standar Face++ AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {beauty?.male_score && (
              <div className="text-center p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <h3 className="font-semibold mb-2">👨 Penilaian Pria</h3>
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(beauty?.male_score || 0)}/100
                </div>
              </div>
            )}
            
            {beauty?.female_score && (
              <div className="text-center p-4 border rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
                <h3 className="font-semibold mb-2">👩 Penilaian Wanita</h3>
                <div className="text-3xl font-bold text-pink-600">
                  {Math.round(beauty?.female_score || 0)}/100
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skin Type Analysis */}
      {skinData?.skin_type !== undefined && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
              <Eye className="h-6 w-6 text-primary" />
              🧴 Jenis Kulit
            </h2>
            <p className="text-muted-foreground">
              Identifikasi jenis kulit berdasarkan analisis AI
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            {(() => {
              const skinTypeInfo = getSkinTypeLabel(skinData?.skin_type || 0);
              return (
                <div className={`p-6 border rounded-lg bg-gradient-to-r ${skinTypeInfo.color} ${skinTypeInfo.border} text-center`}>
                  <div className="text-4xl mb-3">{skinTypeInfo.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{skinTypeInfo.label}</h3>
                  <div className="text-sm text-gray-600 mb-3">
                    Tipe: {skinTypeInfo.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {skinTypeInfo.label === 'Kering' && 'Kulit membutuhkan hidrasi ekstra'}
                    {skinTypeInfo.label === 'Normal' && 'Kulit dalam kondisi seimbang'}
                    {skinTypeInfo.label === 'Kombinasi' && 'Kulit memiliki area kering dan berminyak'}
                    {skinTypeInfo.label === 'Berminyak' && 'Kulit memproduksi minyak berlebih'}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Additional Analysis Data */}
      {(analysisData.smile || analysisData.blur || analysisData.facequality || analysisData.headpose) && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
              <Eye className="h-6 w-6 text-primary" />
              🔍 Analisis Tambahan
            </h2>
            <p className="text-muted-foreground">
              Data analisis tambahan dari Face++ Detect API
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Smile Detection */}
            {analysisData.smile && (
              <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">😊</span>
                  <h3 className="font-semibold">Smile Detection</h3>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(analysisData.smile.value || 0)}/100
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Threshold: {Math.round(analysisData.smile.threshold || 0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {analysisData.smile.value && analysisData.smile.threshold && 
                   analysisData.smile.value > analysisData.smile.threshold ? '😊 Smiling' : '😐 Not Smiling'}
                </div>
              </div>
            )}

            {/* Blur Detection */}
            {analysisData.blur && (
              <div className="p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📷</span>
                  <h3 className="font-semibold">Image Quality</h3>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(analysisData.blur.blurness?.value || 0)}/100
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Threshold: {Math.round(analysisData.blur.blurness?.threshold || 0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {analysisData.blur.blurness?.value && analysisData.blur.blurness?.threshold && 
                   analysisData.blur.blurness.value < analysisData.blur.blurness.threshold ? '✅ Clear' : '⚠️ Blurry'}
                </div>
              </div>
            )}

            {/* Face Quality */}
            {analysisData.facequality && (
              <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⭐</span>
                  <h3 className="font-semibold">Face Quality</h3>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(analysisData.facequality.value || 0)}/100
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Threshold: {Math.round(analysisData.facequality.threshold || 0)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {analysisData.facequality.value && analysisData.facequality.threshold && 
                   analysisData.facequality.value > analysisData.facequality.threshold ? '✅ Good Quality' : '⚠️ Low Quality'}
                </div>
              </div>
            )}

            {/* Head Pose */}
            {analysisData.headpose && (
              <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👤</span>
                  <h3 className="font-semibold">Head Pose</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Pitch:</span>
                    <span className="font-semibold">{Math.round(analysisData.headpose.pitch_angle || 0)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Roll:</span>
                    <span className="font-semibold">{Math.round(analysisData.headpose.roll_angle || 0)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yaw:</span>
                    <span className="font-semibold">{Math.round(analysisData.headpose.yaw_angle || 0)}°</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {Math.abs(analysisData.headpose.pitch_angle || 0) > 45 || 
                   Math.abs(analysisData.headpose.roll_angle || 0) > 45 || 
                   Math.abs(analysisData.headpose.yaw_angle || 0) > 45 ? '⚠️ Angled' : '✅ Straight'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
            <Eye className="h-6 w-6 text-primary" />
            💡 Rekomendasi Perawatan Basic
          </h2>
          <p className="text-muted-foreground">
            Saran perawatan berdasarkan hasil analisis basic
          </p>
        </div>
        
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const priorityConfig = {
              high: { emoji: "🔴", color: "from-red-50 to-rose-50", border: "border-red-200", badge: "destructive" },
              medium: { emoji: "🟡", color: "from-yellow-50 to-amber-50", border: "border-yellow-200", badge: "default" },
              low: { emoji: "🟢", color: "from-green-50 to-emerald-50", border: "border-green-200", badge: "secondary" }
            };
            const config = priorityConfig[rec.priority as keyof typeof priorityConfig] || priorityConfig.low;
            
            return (
              <div key={index} className={`border rounded-lg p-6 bg-gradient-to-r ${config.color} ${config.border} shadow-sm`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold flex items-center gap-2 text-lg">
                    {config.emoji} {rec.title}
                  </h3>
                  <Badge variant={config.badge as "default" | "secondary" | "destructive" | "outline"}>
                    {rec.priority === "high" ? "🔥 Prioritas Tinggi" : rec.priority === "medium" ? "⚡ Prioritas Sedang" : "✅ Prioritas Rendah"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{rec.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Eye Status Analysis */}
      {analysisData.eyestatus && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
              <Eye className="h-6 w-6 text-primary" />
              👁️ Status Mata
            </h2>
            <p className="text-muted-foreground">
              Analisis detail status mata kiri dan kanan dengan deteksi kacamata dan kondisi mata
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Eye Status */}
            {analysisData.eyestatus.left_eye_status && (
              <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">👁️</span>
                  Mata Kiri
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Terhalang:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(analysisData.eyestatus.left_eye_status.occlusion || 0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-red-600">
                        {Math.round(analysisData.eyestatus.left_eye_status.occlusion || 0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Terbuka (Tanpa Kacamata):</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(analysisData.eyestatus.left_eye_status.no_glass_eye_open || 0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        {Math.round(analysisData.eyestatus.left_eye_status.no_glass_eye_open || 0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Kacamata Biasa (Tertutup):</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${(analysisData.eyestatus.left_eye_status.normal_glass_eye_close || 0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-yellow-600">
                        {Math.round(analysisData.eyestatus.left_eye_status.normal_glass_eye_close || 0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Kacamata Biasa (Terbuka):</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(analysisData.eyestatus.left_eye_status.normal_glass_eye_open || 0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        {Math.round(analysisData.eyestatus.left_eye_status.normal_glass_eye_open || 0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Kacamata Gelap:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-600 h-2 rounded-full" 
                          style={{ width: `${(analysisData.eyestatus.left_eye_status.dark_glasses || 0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-600">
                        {Math.round(analysisData.eyestatus.left_eye_status.dark_glasses || 0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Tertutup (Tanpa Kacamata):</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${(analysisData.eyestatus.left_eye_status.no_glass_eye_close || 0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-purple-600">
                        {Math.round(analysisData.eyestatus.left_eye_status.no_glass_eye_close || 0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Eye Status */}
            {analysisData.eyestatus.right_eye_status && (
              <div className="p-6 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">👁️</span>
                  Mata Kanan
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Terhalang:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(analysisData.eyestatus.right_eye_status.occlusion || 0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-red-600">
                        {Math.round(analysisData.eyestatus.right_eye_status.occlusion || 0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Terbuka (Tanpa Kacamata):</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(analysisData.eyestatus.right_eye_status.no_glass_eye_open || 0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        {Math.round(analysisData.eyestatus.right_eye_status.no_glass_eye_open || 0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Kacamata Biasa (Tertutup):</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${(analysisData.eyestatus.right_eye_status.normal_glass_eye_close || 0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-yellow-600">
                        {Math.round(analysisData.eyestatus.right_eye_status.normal_glass_eye_close || 0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Kacamata Biasa (Terbuka):</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(analysisData.eyestatus.right_eye_status.normal_glass_eye_open || 0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-blue-600">
                        {Math.round(analysisData.eyestatus.right_eye_status.normal_glass_eye_open || 0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Kacamata Gelap:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-600 h-2 rounded-full" 
                          style={{ width: `${(analysisData.eyestatus.right_eye_status.dark_glasses || 0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-600">
                        {Math.round(analysisData.eyestatus.right_eye_status.dark_glasses || 0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Tertutup (Tanpa Kacamata):</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${(analysisData.eyestatus.right_eye_status.no_glass_eye_close || 0)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-purple-600">
                        {Math.round(analysisData.eyestatus.right_eye_status.no_glass_eye_close || 0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mouth Status Analysis */}
      {analysisData.mouthstatus && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
              <Eye className="h-6 w-6 text-primary" />
              🗣️ Status Mulut
            </h2>
            <p className="text-muted-foreground">
              Analisis detail status mulut dengan deteksi masker dan kondisi mulut
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Surgical Mask or Respirator */}
            <div className="p-6 border rounded-lg bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">😷</span>
                Masker Medis
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {Math.round(analysisData.mouthstatus.surgical_mask_or_respirator || 0)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-red-500 h-3 rounded-full" 
                    style={{ width: `${(analysisData.mouthstatus.surgical_mask_or_respirator || 0)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {analysisData.mouthstatus.surgical_mask_or_respirator && analysisData.mouthstatus.surgical_mask_or_respirator > 50 
                    ? 'Terdeteksi masker medis' 
                    : 'Tidak terdeteksi masker medis'}
                </p>
              </div>
            </div>

            {/* Other Occlusion */}
            <div className="p-6 border rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">🚫</span>
                Terhalang Lain
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {Math.round(analysisData.mouthstatus.other_occlusion || 0)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-orange-500 h-3 rounded-full" 
                    style={{ width: `${(analysisData.mouthstatus.other_occlusion || 0)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {analysisData.mouthstatus.other_occlusion && analysisData.mouthstatus.other_occlusion > 50 
                    ? 'Mulut terhalang objek lain' 
                    : 'Mulut tidak terhalang'}
                </p>
              </div>
            </div>

            {/* Close */}
            <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">😐</span>
                Tertutup
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Math.round(analysisData.mouthstatus.close || 0)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-blue-500 h-3 rounded-full" 
                    style={{ width: `${(analysisData.mouthstatus.close || 0)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {analysisData.mouthstatus.close && analysisData.mouthstatus.close > 50 
                    ? 'Mulut dalam kondisi tertutup' 
                    : 'Mulut tidak tertutup'}
                </p>
              </div>
            </div>

            {/* Open */}
            <div className="p-6 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">😮</span>
                Terbuka
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round(analysisData.mouthstatus.open || 0)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-green-500 h-3 rounded-full" 
                    style={{ width: `${(analysisData.mouthstatus.open || 0)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  {analysisData.mouthstatus.open && analysisData.mouthstatus.open > 50 
                    ? 'Mulut dalam kondisi terbuka' 
                    : 'Mulut tidak terbuka'}
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">📊 Ringkasan Status Mulut:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Total Confidence:</span>
                <span className="font-semibold">
                  {Math.round(
                    (analysisData.mouthstatus.surgical_mask_or_respirator || 0) +
                    (analysisData.mouthstatus.other_occlusion || 0) +
                    (analysisData.mouthstatus.close || 0) +
                    (analysisData.mouthstatus.open || 0)
                  )}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status Dominan:</span>
                <span className="font-semibold">
                  {(() => {
                    const values = [
                      { key: 'Masker Medis', value: analysisData.mouthstatus.surgical_mask_or_respirator || 0 },
                      { key: 'Terhalang Lain', value: analysisData.mouthstatus.other_occlusion || 0 },
                      { key: 'Tertutup', value: analysisData.mouthstatus.close || 0 },
                      { key: 'Terbuka', value: analysisData.mouthstatus.open || 0 }
                    ];
                    const dominant = values.reduce((prev, current) => 
                      (prev.value > current.value) ? prev : current
                    );
                    return dominant.value > 50 ? dominant.key : 'Tidak Jelas';
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
            <Eye className="h-6 w-6 text-primary" />
            💡 Rekomendasi Perawatan Basic
          </h2>
          <p className="text-muted-foreground">
            Saran perawatan berdasarkan hasil analisis basic
          </p>
        </div>
        
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const priorityConfig = {
              high: { emoji: "🔴", color: "from-red-50 to-rose-50", border: "border-red-200", badge: "destructive" },
              medium: { emoji: "🟡", color: "from-yellow-50 to-amber-50", border: "border-yellow-200", badge: "default" },
              low: { emoji: "🟢", color: "from-green-50 to-emerald-50", border: "border-green-200", badge: "secondary" }
            };
            const config = priorityConfig[rec.priority as keyof typeof priorityConfig] || priorityConfig.low;
            
            return (
              <div key={index} className={`border rounded-lg p-6 bg-gradient-to-r ${config.color} ${config.border} shadow-sm`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold flex items-center gap-2 text-lg">
                    {config.emoji} {rec.title}
                  </h3>
                  <Badge variant={config.badge as "default" | "secondary" | "destructive" | "outline"}>
                    {rec.priority === "high" ? "🔥 Prioritas Tinggi" : rec.priority === "medium" ? "⚡ Prioritas Sedang" : "✅ Prioritas Rendah"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{rec.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}