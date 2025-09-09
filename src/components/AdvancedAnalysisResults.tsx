import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Microscope, Droplets, Zap, Waves } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface AdvancedAnalysisResultsProps {
  analysisData: {
    result?: {
      [key: string]: number | { value: number; confidence: number } | undefined;
    };
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
      eyelids?: {
        left_eyelids?: { value: number; confidence: number };
        right_eyelids?: { value: number; confidence: number };
      };
      eyeArea?: {
        eye_pouch?: { value: number; confidence: number };
        dark_circle?: { value: number; confidence: number };
      };
      wrinkles?: {
        forehead_wrinkle?: { value: number; confidence: number };
        crows_feet?: { value: number; confidence: number };
        eye_finelines?: { value: number; confidence: number };
        glabella_wrinkle?: { value: number; confidence: number };
        nasolabial_fold?: { value: number; confidence: number };
      };
      pores?: {
        pores_forehead?: { value: number; confidence: number };
        pores_left_cheek?: { value: number; confidence: number };
        pores_right_cheek?: { value: number; confidence: number };
        pores_jaw?: { value: number; confidence: number };
      };
      skinIssues?: {
        blackhead?: { value: number; confidence: number };
        acne?: { value: number; confidence: number };
        mole?: { value: number; confidence: number };
        skin_spot?: { value: number; confidence: number };
      };
      skinType?: { value: number; confidence: number };
    };
    warning?: string[];
    quality_tips?: string[];
  };
}

export default function AdvancedAnalysisResults({ analysisData }: AdvancedAnalysisResultsProps) {
  const skinAnalysis = analysisData.skinAnalysis;
  const result = analysisData.result;

  // Calculate overall health score based on advanced analysis
  const calculateHealthScore = () => {
    if (!result) return 0;
    
    const issues = [
      typeof result.acne === 'object' ? result.acne?.value : result.acne || 0,
      typeof result.skin_spot === 'object' ? result.skin_spot?.value : result.skin_spot || 0,
      typeof result.blackhead === 'object' ? result.blackhead?.value : result.blackhead || 0,
      typeof result.eye_pouch === 'object' ? result.eye_pouch?.value : result.eye_pouch || 0,
      typeof result.dark_circle === 'object' ? result.dark_circle?.value : result.dark_circle || 0,
      typeof result.forehead_wrinkle === 'object' ? result.forehead_wrinkle?.value : result.forehead_wrinkle || 0,
      typeof result.crows_feet === 'object' ? result.crows_feet?.value : result.crows_feet || 0,
      typeof result.eye_finelines === 'object' ? result.eye_finelines?.value : result.eye_finelines || 0,
      typeof result.glabella_wrinkle === 'object' ? result.glabella_wrinkle?.value : result.glabella_wrinkle || 0,
      typeof result.nasolabial_fold === 'object' ? result.nasolabial_fold?.value : result.nasolabial_fold || 0,
      typeof result.pores_forehead === 'object' ? result.pores_forehead?.value : result.pores_forehead || 0,
      typeof result.pores_left_cheek === 'object' ? result.pores_left_cheek?.value : result.pores_left_cheek || 0,
      typeof result.pores_right_cheek === 'object' ? result.pores_right_cheek?.value : result.pores_right_cheek || 0,
      typeof result.pores_jaw === 'object' ? result.pores_jaw?.value : result.pores_jaw || 0
    ];
    
    const totalIssues = issues.reduce((sum, issue) => sum + (issue || 0), 0);
    const maxPossibleIssues = issues.length;
    
    return Math.max(0, Math.min(100, Math.round(
      100 - (totalIssues / maxPossibleIssues) * 100
    )));
  };

  const healthScore = calculateHealthScore();

  // Get skin type description
  const getSkinTypeDescription = (value: number) => {
    switch (value) {
      case 0: return { type: 'Berminyak', emoji: '💧', color: 'text-blue-600' };
      case 1: return { type: 'Kering', emoji: '🏜️', color: 'text-yellow-600' };
      case 2: return { type: 'Normal', emoji: '✨', color: 'text-green-600' };
      case 3: return { type: 'Kombinasi', emoji: '🌓', color: 'text-purple-600' };
      default: return { type: 'Tidak Diketahui', emoji: '❓', color: 'text-gray-600' };
    }
  };

  // Prepare radar chart data for advanced analysis
  const radarData = [
    { 
      subject: '👁️ Area Mata', 
      value: 100 - ((typeof result?.eye_pouch === 'object' ? result?.eye_pouch?.value : result?.eye_pouch || 0) + (typeof result?.dark_circle === 'object' ? result?.dark_circle?.value : result?.dark_circle || 0)) * 50, 
      fullMark: 100 
    },
    { 
      subject: '📏 Kerutan', 
      value: 100 - ((typeof result?.forehead_wrinkle === 'object' ? result?.forehead_wrinkle?.value : result?.forehead_wrinkle || 0) + (typeof result?.crows_feet === 'object' ? result?.crows_feet?.value : result?.crows_feet || 0) + (typeof result?.eye_finelines === 'object' ? result?.eye_finelines?.value : result?.eye_finelines || 0)) * 33, 
      fullMark: 100 
    },
    { 
      subject: '🕳️ Pori-pori', 
      value: 100 - ((typeof result?.pores_forehead === 'object' ? result?.pores_forehead?.value : result?.pores_forehead || 0) + (typeof result?.pores_left_cheek === 'object' ? result?.pores_left_cheek?.value : result?.pores_left_cheek || 0) + (typeof result?.pores_right_cheek === 'object' ? result?.pores_right_cheek?.value : result?.pores_right_cheek || 0) + (typeof result?.pores_jaw === 'object' ? result?.pores_jaw?.value : result?.pores_jaw || 0)) * 25, 
      fullMark: 100 
    },
    { 
      subject: '🔴 Masalah Kulit', 
      value: 100 - ((typeof result?.acne === 'object' ? result?.acne?.value : result?.acne || 0) + (typeof result?.blackhead === 'object' ? result?.blackhead?.value : result?.blackhead || 0) + (typeof result?.skin_spot === 'object' ? result?.skin_spot?.value : result?.skin_spot || 0) + (typeof result?.mole === 'object' ? result?.mole?.value : result?.mole || 0)) * 25, 
      fullMark: 100 
    },
    { 
      subject: '👀 Kelopak Mata', 
      value: 100 - ((typeof result?.left_eyelids === 'object' ? result?.left_eyelids?.value : result?.left_eyelids || 0) + (typeof result?.right_eyelids === 'object' ? result?.right_eyelids?.value : result?.right_eyelids || 0)) * 50, 
      fullMark: 100 
    },
  ];

  // Prepare bar chart data for detailed analysis
  const barData = [
    { 
      name: 'Jerawat', 
      value: (typeof result?.acne === 'object' ? result?.acne?.value : result?.acne || 0) * 100, 
      confidence: typeof result?.acne === 'object' ? result?.acne?.confidence : 0 
    },
    { 
      name: 'Komedo', 
      value: (typeof result?.blackhead === 'object' ? result?.blackhead?.value : result?.blackhead || 0) * 100, 
      confidence: typeof result?.blackhead === 'object' ? result?.blackhead?.confidence : 0 
    },
    { 
      name: 'Noda', 
      value: (typeof result?.skin_spot === 'object' ? result?.skin_spot?.value : result?.skin_spot || 0) * 100, 
      confidence: typeof result?.skin_spot === 'object' ? result?.skin_spot?.confidence : 0 
    },
    { 
      name: 'Tahi Lalat', 
      value: (typeof result?.mole === 'object' ? result?.mole?.value : result?.mole || 0) * 100, 
      confidence: typeof result?.mole === 'object' ? result?.mole?.confidence : 0 
    },
    { 
      name: 'Kantung Mata', 
      value: (typeof result?.eye_pouch === 'object' ? result?.eye_pouch?.value : result?.eye_pouch || 0) * 100, 
      confidence: typeof result?.eye_pouch === 'object' ? result?.eye_pouch?.confidence : 0 
    },
  ];

  // Generate advanced recommendations
  const generateAdvancedRecommendations = () => {
    const recommendations = [];
    
    const acneValue = typeof result?.acne === 'object' ? result?.acne?.value : result?.acne;
    const blackheadValue = typeof result?.blackhead === 'object' ? result?.blackhead?.value : result?.blackhead;
    const skinSpotValue = typeof result?.skin_spot === 'object' ? result?.skin_spot?.value : result?.skin_spot;
    const eyePouchValue = typeof result?.eye_pouch === 'object' ? result?.eye_pouch?.value : result?.eye_pouch;
    const foreheadWrinkleValue = typeof result?.forehead_wrinkle === 'object' ? result?.forehead_wrinkle?.value : result?.forehead_wrinkle;
    const crowsFeetValue = typeof result?.crows_feet === 'object' ? result?.crows_feet?.value : result?.crows_feet;
    const poresForeheadValue = typeof result?.pores_forehead === 'object' ? result?.pores_forehead?.value : result?.pores_forehead;
    const poresLeftCheekValue = typeof result?.pores_left_cheek === 'object' ? result?.pores_left_cheek?.value : result?.pores_left_cheek;
    const poresRightCheekValue = typeof result?.pores_right_cheek === 'object' ? result?.pores_right_cheek?.value : result?.pores_right_cheek;
    const poresJawValue = typeof result?.pores_jaw === 'object' ? result?.pores_jaw?.value : result?.pores_jaw;
    const skinTypeValue = typeof result?.skin_type === 'object' ? result?.skin_type?.value : result?.skin_type;
    
    if (acneValue === 1) {
      recommendations.push({
        title: "Perawatan Jerawat Intensif",
        description: "Gunakan cleanser dengan salicylic acid 2%, serum niacinamide, dan spot treatment benzoyl peroxide. Konsultasi dengan dermatologis untuk perawatan lebih lanjut.",
        priority: "high" as const,
        confidence: typeof result?.acne === 'object' ? result?.acne?.confidence : 0
      });
    }
    
    if (blackheadValue === 1) {
      recommendations.push({
        title: "Atasi Komedo",
        description: "Gunakan BHA (beta hydroxy acid) 1-2 kali seminggu, clay mask mingguan, dan double cleansing untuk membersihkan pori-pori secara mendalam.",
        priority: "high" as const,
        confidence: typeof result?.blackhead === 'object' ? result?.blackhead?.confidence : 0
      });
    }
    
    if (skinSpotValue === 1) {
      recommendations.push({
        title: "Perawatan Noda Hiperpigmentasi",
        description: "Gunakan serum vitamin C di pagi hari, retinol di malam hari, dan sunscreen SPF 30+ setiap hari. Pertimbangkan chemical peeling.",
        priority: "high" as const,
        confidence: typeof result?.skin_spot === 'object' ? result?.skin_spot?.confidence : 0
      });
    }
    
    if (eyePouchValue === 1) {
      recommendations.push({
        title: "Perawatan Kantung Mata",
        description: "Gunakan eye cream dengan kafein dan peptide, kompres dingin di pagi hari, dan pastikan tidur dengan kepala sedikit terangkat.",
        priority: "medium" as const,
        confidence: typeof result?.eye_pouch === 'object' ? result?.eye_pouch?.confidence : 0
      });
    }
    
    if (foreheadWrinkleValue === 1 || crowsFeetValue === 1) {
      recommendations.push({
        title: "Anti-Aging Intensif",
        description: "Gunakan retinol atau retinoid, serum peptide, dan moisturizer dengan hyaluronic acid. Pertimbangkan treatment botox untuk hasil optimal.",
        priority: "medium" as const,
        confidence: Math.max(
          typeof result?.forehead_wrinkle === 'object' ? result?.forehead_wrinkle?.confidence : 0, 
          typeof result?.crows_feet === 'object' ? result?.crows_feet?.confidence : 0
        )
      });
    }
    
    if ((poresForeheadValue || 0) + (poresLeftCheekValue || 0) + (poresRightCheekValue || 0) + (poresJawValue || 0) >= 2) {
      recommendations.push({
        title: "Perawatan Pori-pori Besar",
        description: "Gunakan niacinamide serum, AHA/BHA exfoliant 2-3x seminggu, dan clay mask mingguan untuk mengecilkan tampilan pori-pori.",
        priority: "medium" as const,
        confidence: 0.8
      });
    }
    
    // Skin type specific recommendations
    if (skinTypeValue !== undefined) {
      const skinType = getSkinTypeDescription(skinTypeValue);
      let description = "";
      
      switch (skinTypeValue) {
        case 0: // Oily
          description = "Gunakan gel cleanser, toner dengan niacinamide, serum salicylic acid, dan moisturizer oil-free. Hindari over-cleansing.";
          break;
        case 1: // Dry
          description = "Gunakan cream cleanser, essence hydrating, serum hyaluronic acid, dan moisturizer kaya ceramide. Gunakan face oil di malam hari.";
          break;
        case 2: // Normal
          description = "Pertahankan rutinitas seimbang dengan gentle cleanser, vitamin C serum, dan moisturizer ringan. Fokus pada perlindungan UV.";
          break;
        case 3: // Combination
          description = "Gunakan produk berbeda untuk T-zone (oil control) dan area kering (hydrating). Multi-masking bisa membantu.";
          break;
      }
      
      recommendations.push({
        title: `Perawatan Kulit ${skinType.type}`,
        description,
        priority: "low" as const,
        confidence: typeof result?.skin_type === 'object' ? result?.skin_type?.confidence : 0
      });
    }
    
    return recommendations;
  };

  const recommendations = generateAdvancedRecommendations();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-100">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <span className="text-2xl">🔬</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Hasil Analisis Kulit Advanced
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Analisis mendalam menggunakan Face++ Skin Analyze API dengan deteksi presisi tinggi dan teknologi AI terdepan
        </p>
      </div>

      {/* Quality Tips */}
      {analysisData.quality_tips && analysisData.quality_tips.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Zap className="h-5 w-5" />
              💡 Tips Kualitas Analisis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysisData.quality_tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-yellow-700">
                  <span className="text-yellow-500">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Overall Health Score */}
      <div className="bg-white rounded-lg border p-6">
        <div className="text-center mb-6">
          <h2 className="flex items-center justify-center gap-2 text-xl font-semibold mb-2">
            <Microscope className="h-6 w-6 text-primary" />
            🏥 Skor Kesehatan Kulit Advanced
          </h2>
          <p className="text-muted-foreground">
            Berdasarkan analisis mendalam dari 14+ parameter kulit
          </p>
        </div>
        <div className="text-center">
          <div className="text-6xl font-bold text-primary mb-4">
            {healthScore}/100
          </div>
          <Progress value={healthScore} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-muted-foreground mt-2">
            Skor dihitung berdasarkan deteksi masalah kulit spesifik
          </p>
        </div>
      </div>

      {/* Radar Chart Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            📊 Visualisasi Analisis Advanced
          </CardTitle>
          <CardDescription>
            Perbandingan kondisi berbagai kategori kulit secara detail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Kondisi Kulit"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart for Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            📈 Deteksi Masalah Kulit
          </CardTitle>
          <CardDescription>
            Tingkat deteksi masalah kulit dengan confidence score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Skin Type Analysis */}
      {result?.skin_type && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              🧴 Analisis Jenis Kulit
            </CardTitle>
            <CardDescription>
              Klasifikasi jenis kulit berdasarkan AI analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <div className="text-4xl mb-4">
                {getSkinTypeDescription(typeof result.skin_type === 'object' ? result.skin_type.value : result.skin_type).emoji}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${getSkinTypeDescription(typeof result.skin_type === 'object' ? result.skin_type.value : result.skin_type).color}`}>
                Kulit {getSkinTypeDescription(typeof result.skin_type === 'object' ? result.skin_type.value : result.skin_type).type}
              </h3>
              <div className="text-sm text-muted-foreground">
                Confidence: {Math.round((typeof result.skin_type === 'object' ? result.skin_type.confidence : 0) * 100)}%
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Analysis Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eyelids Analysis */}
        {skinAnalysis?.eyelids && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                👀 Analisis Kelopak Mata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skinAnalysis.eyelids.left_eyelids && (
                <div className="p-3 border rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
                  <h4 className="font-semibold mb-1">👁️ Kelopak Mata Kiri</h4>
                  <p className="text-sm">
                    {skinAnalysis.eyelids.left_eyelids.value === 0 ? 'Single-fold' : 'Double-fold'}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Confidence: {Math.round((skinAnalysis.eyelids.left_eyelids.confidence || 0) * 100)}%
                  </div>
                </div>
              )}
              
              {skinAnalysis.eyelids.right_eyelids && (
                <div className="p-3 border rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
                  <h4 className="font-semibold mb-1">👁️ Kelopak Mata Kanan</h4>
                  <p className="text-sm">
                    {skinAnalysis.eyelids.right_eyelids.value === 0 ? 'Single-fold' : 'Double-fold'}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Confidence: {Math.round((skinAnalysis.eyelids.right_eyelids.confidence || 0) * 100)}%
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Wrinkles Analysis */}
        {skinAnalysis?.wrinkles && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5 text-primary" />
                📏 Analisis Kerutan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(skinAnalysis.wrinkles).map(([key, value]) => {
                if (!value) return null;
                const wrinkleNames: { [key: string]: string } = {
                  forehead_wrinkle: '🤔 Kerutan Dahi',
                  crows_feet: '👁️ Kerutan Mata',
                  eye_finelines: '👀 Garis Halus Mata',
                  glabella_wrinkle: '😤 Kerutan Alis',
                  nasolabial_fold: '😊 Garis Senyum'
                };
                
                return (
                  <div key={key} className={`p-3 border rounded-lg ${
                    value.value === 1 
                      ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200' 
                      : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                  }`}>
                    <h4 className="font-semibold mb-1">{wrinkleNames[key]}</h4>
                    <p className="text-sm">
                      {value.value === 1 ? '❌ Terdeteksi' : '✅ Tidak Terdeteksi'}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Confidence: {Math.round((value.confidence || 0) * 100)}%
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Pores Analysis */}
        {skinAnalysis?.pores && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                🕳️ Analisis Pori-pori
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(skinAnalysis.pores).map(([key, value]) => {
                if (!value) return null;
                const poreNames: { [key: string]: string } = {
                  pores_forehead: '🤔 Pori Dahi',
                  pores_left_cheek: '😊 Pori Pipi Kiri',
                  pores_right_cheek: '😊 Pori Pipi Kanan',
                  pores_jaw: '😮 Pori Rahang'
                };
                
                return (
                  <div key={key} className={`p-3 border rounded-lg ${
                    value.value === 1 
                      ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' 
                      : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                  }`}>
                    <h4 className="font-semibold mb-1">{poreNames[key]}</h4>
                    <p className="text-sm">
                      {value.value === 1 ? '🔍 Pori Besar Terdeteksi' : '✨ Pori Normal'}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Confidence: {Math.round((value.confidence || 0) * 100)}%
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Skin Issues Analysis */}
        {skinAnalysis?.skinIssues && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                🔴 Masalah Kulit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(skinAnalysis.skinIssues).map(([key, value]) => {
                if (!value) return null;
                const issueNames: { [key: string]: string } = {
                  blackhead: '⚫ Komedo',
                  acne: '🔴 Jerawat',
                  mole: '🟤 Tahi Lalat',
                  skin_spot: '🟡 Noda Kulit'
                };
                
                return (
                  <div key={key} className={`p-3 border rounded-lg ${
                    value.value === 1 
                      ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200' 
                      : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                  }`}>
                    <h4 className="font-semibold mb-1">{issueNames[key]}</h4>
                    <p className="text-sm">
                      {value.value === 1 ? '❌ Terdeteksi' : '✅ Tidak Terdeteksi'}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Confidence: {Math.round((value.confidence || 0) * 100)}%
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Advanced Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Microscope className="h-5 w-5 text-primary" />
            🔬 Rekomendasi Perawatan Advanced
          </CardTitle>
          <CardDescription>
            Saran perawatan spesifik berdasarkan analisis mendalam
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => {
              const priorityConfig = {
                high: { emoji: "🔴", color: "from-red-50 to-rose-50", border: "border-red-200", badge: "destructive" },
                medium: { emoji: "🟡", color: "from-yellow-50 to-amber-50", border: "border-yellow-200", badge: "default" },
                low: { emoji: "🟢", color: "from-green-50 to-emerald-50", border: "border-green-200", badge: "secondary" }
              };
              const config = priorityConfig[rec.priority as keyof typeof priorityConfig] || priorityConfig.low;
              
              return (
                <div key={index} className={`border rounded-lg p-4 bg-gradient-to-r ${config.color} ${config.border}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold flex items-center gap-2">
                      {config.emoji} {rec.title}
                    </h3>
                    <div className="flex gap-2">
                      <Badge variant={config.badge as "default" | "secondary" | "destructive" | "outline"}>
                        {rec.priority === "high" ? "🔥 Prioritas Tinggi" : rec.priority === "medium" ? "⚡ Prioritas Sedang" : "✅ Prioritas Rendah"}
                      </Badge>
                      {rec.confidence && (
                        <Badge variant="outline">
                          🎯 {Math.round(rec.confidence * 100)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{rec.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}