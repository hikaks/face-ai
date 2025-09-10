import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Microscope, Droplets, Zap, Waves } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { AdvancedAnalysisResultsProps } from '@/types/analysis';

// Interface untuk skin_type data structure
interface SkinTypeDetails {
  [key: string]: {
    confidence: number;
    value: number;
  };
}

interface SkinTypeData {
  skin_type: number;
  details: SkinTypeDetails;
}

export default function AdvancedAnalysisResultsFixed({ analysisData }: AdvancedAnalysisResultsProps) {
  const skinAnalysis = analysisData.skinAnalysis;
  const result = analysisData.result;
  
  // Debug: Log the data structure
  console.log('AdvancedAnalysisResultsFixed - analysisData:', analysisData);
  console.log('AdvancedAnalysisResultsFixed - skinAnalysis:', skinAnalysis);
  console.log('AdvancedAnalysisResultsFixed - result:', result);

  // Helper function to get numeric value from API response
  const getNumericValue = (obj: unknown) => {
    if (typeof obj === 'object' && obj !== null && 'value' in obj) {
      const value = (obj as { value: string | number }).value;
      // Handle both string and number values from API
      return typeof value === 'string' ? parseInt(value) || 0 : value || 0;
    }
    return typeof obj === 'number' ? obj : 0;
  };

  // Calculate overall health score based on advanced analysis
  const calculateHealthScore = () => {
    if (!result) return 0;
    
    const issues = [
      getNumericValue(result.acne),
      getNumericValue(result.skin_spot),
      getNumericValue(result.blackhead),
      getNumericValue(result.mole),
      getNumericValue(result.eye_pouch),
      getNumericValue(result.dark_circle),
      getNumericValue(result.forehead_wrinkle),
      getNumericValue(result.crows_feet),
      getNumericValue(result.eye_finelines),
      getNumericValue(result.glabella_wrinkle),
      getNumericValue(result.nasolabial_fold),
      getNumericValue(result.pores_forehead),
      getNumericValue(result.pores_left_cheek),
      getNumericValue(result.pores_right_cheek),
      getNumericValue(result.pores_jaw)
    ];
    
    const totalIssues = issues.reduce((sum, issue) => sum + (issue || 0), 0);
    const maxPossibleIssues = issues.length;
    
    return Math.max(0, Math.min(100, Math.round(
      100 - (totalIssues / maxPossibleIssues) * 100
    )));
  };

  const healthScore = calculateHealthScore();

  // Get skin type description - FIXED according to documentation
  const getSkinTypeDescription = (value: number) => {
    // According to documentation: 0=oily, 1=dry, 2=normal, 3=mixed
    const types = ['Oily', 'Dry', 'Normal', 'Combination'];
    return types[value] || 'Unknown';
  };

  // Prepare radar chart data for advanced analysis - FIXED CALCULATIONS
  // API returns binary values (0 or 1), so we calculate percentage of issues
  const radarData = [
    { 
      subject: '👁️ Area Mata', 
      value: 100 - ((getNumericValue(result?.eye_pouch) + getNumericValue(result?.dark_circle)) / 2) * 100, 
      fullMark: 100 
    },
    { 
      subject: '📏 Kerutan', 
      value: 100 - ((getNumericValue(result?.forehead_wrinkle) + getNumericValue(result?.crows_feet) + getNumericValue(result?.eye_finelines)) / 3) * 100, 
      fullMark: 100 
    },
    { 
      subject: '🕳️ Pori-pori', 
      value: 100 - ((getNumericValue(result?.pores_forehead) + getNumericValue(result?.pores_left_cheek) + getNumericValue(result?.pores_right_cheek) + getNumericValue(result?.pores_jaw)) / 4) * 100, 
      fullMark: 100 
    },
    { 
      subject: '🔴 Masalah Kulit', 
      value: 100 - ((getNumericValue(result?.acne) + getNumericValue(result?.blackhead) + getNumericValue(result?.skin_spot) + getNumericValue(result?.mole)) / 4) * 100, 
      fullMark: 100 
    },
    { 
      subject: '👀 Kelopak Mata', 
      value: 100, // Kelopak mata bukan masalah, tapi jenis kelopak mata
      fullMark: 100 
    },
  ];

  // Prepare bar chart data for detailed analysis - FIXED TO SHOW VALUES CORRECTLY
  const barData = [
    { 
      name: 'Jerawat', 
      value: getNumericValue(result?.acne) * 100, 
      confidence: typeof result?.acne === 'object' ? result?.acne?.confidence || 0 : 0 
    },
    { 
      name: 'Komedo', 
      value: getNumericValue(result?.blackhead) * 100, 
      confidence: typeof result?.blackhead === 'object' ? result?.blackhead?.confidence || 0 : 0 
    },
    { 
      name: 'Noda', 
      value: getNumericValue(result?.skin_spot) * 100, 
      confidence: typeof result?.skin_spot === 'object' ? result?.skin_spot?.confidence || 0 : 0 
    },
    { 
      name: 'Tahi Lalat', 
      value: getNumericValue(result?.mole) * 100, 
      confidence: typeof result?.mole === 'object' ? result?.mole?.confidence || 0 : 0 
    },
    { 
      name: 'Kantung Mata', 
      value: getNumericValue(result?.eye_pouch) * 100, 
      confidence: typeof result?.eye_pouch === 'object' ? result?.eye_pouch?.confidence || 0 : 0 
    },
    { 
      name: 'Lingkar Hitam', 
      value: getNumericValue(result?.dark_circle) * 100, 
      confidence: typeof result?.dark_circle === 'object' ? result?.dark_circle?.confidence || 0 : 0 
    }
  ];

  // Generate advanced recommendations based on analysis
  const generateAdvancedRecommendations = () => {
    const recommendations = [];
    
    if (getNumericValue(result?.acne) > 0) {
      recommendations.push({
        category: 'Jerawat',
        severity: getNumericValue(result?.acne),
        confidence: typeof result?.acne === 'object' ? result?.acne?.confidence || 0 : 0,
        tips: [
          'Gunakan pembersih wajah yang mengandung salicylic acid',
          'Hindari menyentuh wajah dengan tangan kotor',
          'Gunakan produk non-comedogenic',
          'Konsultasi dengan dermatologis jika parah'
        ]
      });
    }
    
    if (getNumericValue(result?.mole) > 0) {
      recommendations.push({
        category: 'Tahi Lalat',
        severity: getNumericValue(result?.mole),
        confidence: typeof result?.mole === 'object' ? result?.mole?.confidence || 0 : 0,
        tips: [
          'Monitor perubahan ukuran dan warna tahi lalat',
          'Gunakan sunscreen SPF 30+ untuk melindungi dari UV',
          'Konsultasi dengan dermatologis jika ada perubahan',
          'Hindari paparan sinar matahari berlebihan'
        ]
      });
    }
    
    if (getNumericValue(result?.left_eyelids) > 0 || getNumericValue(result?.right_eyelids) > 0) {
      recommendations.push({
        category: 'Kelopak Mata',
        severity: Math.max(
          getNumericValue(result?.left_eyelids),
          getNumericValue(result?.right_eyelids)
        ),
        confidence: Math.max(
          typeof result?.left_eyelids === 'object' ? result?.left_eyelids?.confidence || 0 : 0,
          typeof result?.right_eyelids === 'object' ? result?.right_eyelids?.confidence || 0 : 0
        ),
        tips: [
          'Gunakan eye cream dengan retinol untuk mengencangkan',
          'Pijat lembut area mata untuk meningkatkan sirkulasi',
          'Hindari menggosok mata secara berlebihan',
          'Konsultasi dengan dokter mata jika ada masalah'
        ]
      });
    }
    
    if (getNumericValue(result?.dark_circle) > 0) {
      recommendations.push({
        category: 'Lingkar Hitam',
        severity: getNumericValue(result?.dark_circle),
        confidence: typeof result?.dark_circle === 'object' ? result?.dark_circle?.confidence || 0 : 0,
        tips: [
          'Tidur cukup 7-8 jam per hari',
          'Gunakan eye cream dengan kafein atau retinol',
          'Hindari menggosok mata',
          'Konsumsi makanan kaya antioksidan'
        ]
      });
    }
    
    if (getNumericValue(result?.forehead_wrinkle) > 0 || getNumericValue(result?.crows_feet) > 0) {
      recommendations.push({
        category: 'Kerutan',
        severity: Math.max(
          getNumericValue(result?.forehead_wrinkle), 
          getNumericValue(result?.crows_feet)
        ),
        confidence: Math.max(
          typeof result?.forehead_wrinkle === 'object' ? result?.forehead_wrinkle?.confidence || 0 : 0, 
          typeof result?.crows_feet === 'object' ? result?.crows_feet?.confidence || 0 : 0
        ),
        tips: [
          'Gunakan sunscreen SPF 30+ setiap hari',
          'Aplikasikan retinol di malam hari',
          'Hidrasi kulit dengan moisturizer',
          'Hindari merokok dan alkohol berlebihan'
        ]
      });
    }
    
    if (getNumericValue(result?.pores_forehead) > 0 || getNumericValue(result?.pores_left_cheek) > 0 || getNumericValue(result?.pores_right_cheek) > 0) {
      recommendations.push({
        category: 'Pori-pori',
        severity: Math.max(
          getNumericValue(result?.pores_forehead),
          getNumericValue(result?.pores_left_cheek),
          getNumericValue(result?.pores_right_cheek)
        ),
        confidence: Math.max(
          typeof result?.pores_forehead === 'object' ? result?.pores_forehead?.confidence || 0 : 0,
          typeof result?.pores_left_cheek === 'object' ? result?.pores_left_cheek?.confidence || 0 : 0,
          typeof result?.pores_right_cheek === 'object' ? result?.pores_right_cheek?.confidence || 0 : 0
        ),
        tips: [
          'Gunakan toner dengan niacinamide',
          'Exfoliasi 2-3 kali seminggu',
          'Gunakan clay mask untuk mengecilkan pori',
          'Hindari produk yang terlalu berat'
        ]
      });
    }
    
    return recommendations;
  };

  const recommendations = generateAdvancedRecommendations();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Microscope className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
            <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              Hasil Analisis Kulit Advanced
            </h2>
          </div>
          <p className="text-purple-700 dark:text-purple-300">
            Analisis mendalam menggunakan Face++ Skin Analyze API dengan deteksi presisi tinggi dan teknologi AI terdepan
          </p>
        </CardContent>
      </Card>

      {/* Overall Score Card */}
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm text-muted-foreground">
              Berdasarkan analisis mendalam dari 14+ parameter kulit
            </span>
          </div>
          <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            {healthScore}/100
          </div>
          <Progress value={healthScore} className="w-full mb-4" />
          <p className="text-sm text-muted-foreground">
            Skor keseluruhan berdasarkan deteksi masalah kulit spesifik
          </p>
        </CardContent>
      </Card>

      {/* Advanced Analysis Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Microscope className="h-5 w-5" />
            📊 Kondisi Kulit Anda
          </CardTitle>
          <CardDescription>
            Grafik ini menunjukkan kondisi kesehatan kulit Anda dari berbagai aspek. Semakin tinggi nilainya, semakin baik kondisi kulit Anda.
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
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend dengan penjelasan mudah dipahami */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
              <div className="text-2xl mb-2">👁️</div>
              <h4 className="font-semibold text-sm">Area Mata</h4>
              <p className="text-xs text-muted-foreground">Kantung mata & lingkaran hitam</p>
              <div className="text-lg font-bold text-blue-600">
                {100 - (getNumericValue(result?.eye_pouch) + getNumericValue(result?.dark_circle)) * 50}/100
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
              <div className="text-2xl mb-2">📏</div>
              <h4 className="font-semibold text-sm">Kerutan</h4>
              <p className="text-xs text-muted-foreground">Garis halus & kerutan</p>
              <div className="text-lg font-bold text-green-600">
                {100 - (getNumericValue(result?.forehead_wrinkle) + getNumericValue(result?.crows_feet) + getNumericValue(result?.eye_finelines)) * 33}/100
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
              <div className="text-2xl mb-2">🕳️</div>
              <h4 className="font-semibold text-sm">Pori-pori</h4>
              <p className="text-xs text-muted-foreground">Ukuran pori-pori kulit</p>
              <div className="text-lg font-bold text-purple-600">
                {100 - (getNumericValue(result?.pores_forehead) + getNumericValue(result?.pores_left_cheek) + getNumericValue(result?.pores_right_cheek) + getNumericValue(result?.pores_jaw)) * 25}/100
              </div>
            </div>
            
            <div className="text-center p-3 bg-red-50 dark:bg-red-950/50 rounded-lg">
              <div className="text-2xl mb-2">🔴</div>
              <h4 className="font-semibold text-sm">Masalah Kulit</h4>
              <p className="text-xs text-muted-foreground">Jerawat, komedo, noda</p>
              <div className="text-lg font-bold text-red-600">
                {100 - (getNumericValue(result?.acne) + getNumericValue(result?.blackhead) + getNumericValue(result?.skin_spot) + getNumericValue(result?.mole)) * 25}/100
              </div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/50 rounded-lg">
              <div className="text-2xl mb-2">👀</div>
              <h4 className="font-semibold text-sm">Kelopak Mata</h4>
              <p className="text-xs text-muted-foreground">Jenis kelopak mata</p>
              <div className="text-lg font-bold text-orange-600">
                {(() => {
                  const leftType = getNumericValue(result?.left_eyelids);
                  const rightType = getNumericValue(result?.right_eyelids);
                  const types = ['Single-fold', 'Parallel', 'Fanshaped'];
                  return types[leftType] || types[rightType] || 'Unknown';
                })()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skin Problem Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            🔍 Masalah Kulit yang Terdeteksi
          </CardTitle>
          <CardDescription>
            Grafik ini menunjukkan tingkat keparahan masalah kulit yang ditemukan. Semakin tinggi persentasenya, semakin parah masalahnya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value}%`, 
                    name === 'value' ? 'Tingkat Keparahan' : 'Tingkat Kepercayaan'
                  ]}
                />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Penjelasan mudah dipahami */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">📝 Cara Membaca Grafik:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>• <strong>0%</strong> = Tidak ada masalah</div>
              <div>• <strong>50%</strong> = Masalah ringan</div>
              <div>• <strong>100%</strong> = Masalah parah</div>
              <div>• <strong>200%</strong> = Masalah sangat parah</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Skin Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Masalah Kulit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Jerawat:</span>
                <Badge variant={getNumericValue(result?.acne) > 0 ? "destructive" : "secondary"}>
                  {getNumericValue(result?.acne)} ({Math.round((typeof result?.acne === 'object' ? result?.acne?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Komedo:</span>
                <Badge variant={getNumericValue(result?.blackhead) > 0 ? "destructive" : "secondary"}>
                  {getNumericValue(result?.blackhead)} ({Math.round((typeof result?.blackhead === 'object' ? result?.blackhead?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Noda:</span>
                <Badge variant={getNumericValue(result?.skin_spot) > 0 ? "destructive" : "secondary"}>
                  {getNumericValue(result?.skin_spot)} ({Math.round((typeof result?.skin_spot === 'object' ? result?.skin_spot?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Tahi Lalat:</span>
                <Badge variant={getNumericValue(result?.mole) > 0 ? "destructive" : "secondary"}>
                  {getNumericValue(result?.mole)} ({Math.round((typeof result?.mole === 'object' ? result?.mole?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eye Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Area Mata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Kantung Mata:</span>
                <Badge variant={getNumericValue(result?.eye_pouch) > 0 ? "destructive" : "secondary"}>
                  {getNumericValue(result?.eye_pouch)} ({Math.round((typeof result?.eye_pouch === 'object' ? result?.eye_pouch?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Lingkar Hitam:</span>
                <Badge variant={getNumericValue(result?.dark_circle) > 0 ? "destructive" : "secondary"}>
                  {getNumericValue(result?.dark_circle)} ({Math.round((typeof result?.dark_circle === 'object' ? result?.dark_circle?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eyelids */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Kelopak Mata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Kelopak Kiri:</span>
                <Badge variant="outline">
                  {(() => {
                    const leftType = getNumericValue(result?.left_eyelids);
                    const types = ['Single-fold', 'Parallel', 'Fanshaped'];
                    return types[leftType] || 'Unknown';
                  })()} ({Math.round((typeof result?.left_eyelids === 'object' ? result?.left_eyelids?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Kelopak Kanan:</span>
                <Badge variant="outline">
                  {(() => {
                    const rightType = getNumericValue(result?.right_eyelids);
                    const types = ['Single-fold', 'Parallel', 'Fanshaped'];
                    return types[rightType] || 'Unknown';
                  })()} ({Math.round((typeof result?.right_eyelids === 'object' ? result?.right_eyelids?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wrinkles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5" />
              Kerutan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Forehead:</span>
                <Badge variant={getNumericValue(result?.forehead_wrinkle) > 0 ? "destructive" : "secondary"}>
                  {getNumericValue(result?.forehead_wrinkle)} ({Math.round((typeof result?.forehead_wrinkle === 'object' ? result?.forehead_wrinkle?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Crows Feet:</span>
                <Badge variant={getNumericValue(result?.crows_feet) > 0 ? "destructive" : "secondary"}>
                  {getNumericValue(result?.crows_feet)} ({Math.round((typeof result?.crows_feet === 'object' ? result?.crows_feet?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Eye Finelines:</span>
                <Badge variant={getNumericValue(result?.eye_finelines) > 0 ? "destructive" : "secondary"}>
                  {getNumericValue(result?.eye_finelines)} ({Math.round((typeof result?.eye_finelines === 'object' ? result?.eye_finelines?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Pori-pori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Forehead:</span>
                <Badge variant={getNumericValue(result?.pores_forehead) > 0 ? "destructive" : "secondary"}>
                  {getNumericValue(result?.pores_forehead)} ({Math.round((typeof result?.pores_forehead === 'object' ? result?.pores_forehead?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Left Cheek:</span>
                <Badge variant={getNumericValue(result?.pores_left_cheek) > 0 ? "destructive" : "secondary"}>
                  {getNumericValue(result?.pores_left_cheek)} ({Math.round((typeof result?.pores_left_cheek === 'object' ? result?.pores_left_cheek?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Right Cheek:</span>
                <Badge variant={getNumericValue(result?.pores_right_cheek) > 0 ? "destructive" : "secondary"}>
                  {getNumericValue(result?.pores_right_cheek)} ({Math.round((typeof result?.pores_right_cheek === 'object' ? result?.pores_right_cheek?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Jaw:</span>
                <Badge variant={getNumericValue(result?.pores_jaw) > 0 ? "destructive" : "secondary"}>
                  {getNumericValue(result?.pores_jaw)} ({Math.round((typeof result?.pores_jaw === 'object' ? result?.pores_jaw?.confidence || 0 : 0) * 100)}%)
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skin Type Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            🧴 Jenis Kulit Anda
          </CardTitle>
          <CardDescription>
            AI telah menganalisis dan mengidentifikasi jenis kulit Anda berdasarkan karakteristik yang terdeteksi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <h4 className="font-semibold mb-4 text-lg">Jenis Kulit Terdeteksi</h4>
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full mb-4">
                <span className="text-4xl">
                  {getSkinTypeDescription((result?.skin_type as unknown as SkinTypeData)?.skin_type || 0) === 'Normal' && '✨'}
                  {getSkinTypeDescription((result?.skin_type as unknown as SkinTypeData)?.skin_type || 0) === 'Dry' && '🏜️'}
                  {getSkinTypeDescription((result?.skin_type as unknown as SkinTypeData)?.skin_type || 0) === 'Oily' && '💧'}
                  {getSkinTypeDescription((result?.skin_type as unknown as SkinTypeData)?.skin_type || 0) === 'Combination' && '🌗'}
                </span>
              </div>
              <Badge variant="outline" className="text-xl px-6 py-3 mb-2">
                {getSkinTypeDescription((result?.skin_type as unknown as SkinTypeData)?.skin_type || 0)}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Tingkat Kepercayaan: {Math.round(((result?.skin_type as unknown as SkinTypeData)?.details?.[(result?.skin_type as unknown as SkinTypeData)?.skin_type?.toString() || '0']?.confidence || 0) * 100)}%
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Analisis Detail</h4>
              <div className="space-y-3">
                {(result?.skin_type as unknown as SkinTypeData)?.details ? (
                  Object.entries((result?.skin_type as unknown as SkinTypeData).details).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getSkinTypeDescription(parseInt(key)) === 'Normal' && '✨'}
                          {getSkinTypeDescription(parseInt(key)) === 'Dry' && '🏜️'}
                          {getSkinTypeDescription(parseInt(key)) === 'Oily' && '💧'}
                          {getSkinTypeDescription(parseInt(key)) === 'Combination' && '🌗'}
                        </span>
                        <span className="font-medium">{getSkinTypeDescription(parseInt(key))}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${Math.round(value.confidence * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold w-12 text-right">
                          {Math.round(value.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Data detail tidak tersedia
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Penjelasan jenis kulit */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Penjelasan Jenis Kulit:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div><strong>Normal:</strong> Kulit seimbang, tidak terlalu kering atau berminyak</div>
              <div><strong>Kering:</strong> Kulit membutuhkan hidrasi ekstra</div>
              <div><strong>Berminyak:</strong> Kulit memproduksi minyak berlebih</div>
              <div><strong>Kombinasi:</strong> Kulit memiliki area kering dan berminyak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-5 w-5" />
              Rekomendasi Advanced
            </CardTitle>
            <CardDescription>
              Saran perawatan berdasarkan analisis mendalam kondisi kulit Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{rec.category}</h4>
                    <div className="flex gap-2">
                      <Badge variant="destructive">
                        Severity: {rec.severity}
                      </Badge>
                      <Badge variant="secondary">
                        Confidence: {Math.round(rec.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {rec.tips.map((tip, tipIndex) => (
                      <li key={tipIndex}>{tip}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Raw Data Debug */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
            {JSON.stringify({ skinAnalysis, result }, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}