import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Heart, Droplets, Zap, Waves } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface BasicAnalysisResultsProps {
  analysisData: {
    analysisResults?: {
      skin?: {
        health?: number;
        stain?: number;
        acne?: number;
        dark_circle?: number;
        wrinkle?: number;
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
    // Add confidence scores from Face++ API
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
  };
}

export default function BasicAnalysisResults({ analysisData }: BasicAnalysisResultsProps) {
  const skinData = analysisData.analysisResults?.skin;
  const demographics = analysisData.analysisResults?.demographics;
  const emotion = analysisData.analysisResults?.emotion;
  const beauty = analysisData.analysisResults?.beauty;
  const skinConfidence = analysisData.skinConfidence;

  // Function to get skin type label
  const getSkinTypeLabel = (skinType: number) => {
    if (skinType >= 0 && skinType < 25) return { label: 'Kering', emoji: '🏜️', color: 'from-orange-50 to-amber-50', border: 'border-orange-200' };
    if (skinType >= 25 && skinType < 50) return { label: 'Normal', emoji: '✨', color: 'from-green-50 to-emerald-50', border: 'border-green-200' };
    if (skinType >= 50 && skinType < 75) return { label: 'Kombinasi', emoji: '🌗', color: 'from-blue-50 to-cyan-50', border: 'border-blue-200' };
    if (skinType >= 75) return { label: 'Berminyak', emoji: '💧', color: 'from-yellow-50 to-amber-50', border: 'border-yellow-200' };
    return { label: 'Tidak Diketahui', emoji: '❓', color: 'from-gray-50 to-slate-50', border: 'border-gray-200' };
  };

  // Calculate overall health score
  const healthScore = skinData ? Math.round(
    ((skinData.health || 0) + 
     (100 - (skinData.stain || 0)) + 
     (100 - (skinData.acne || 0)) + 
     (100 - (skinData.dark_circle || 0)) + 
     (100 - (skinData.wrinkle || 0))) / 5
  ) : 0;

  // Prepare radar chart data with enhanced information
  const radarData = [
    { 
      subject: 'Kesehatan', 
      value: skinData?.health || 0, 
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
              <h3 className="font-semibold">🔍 Noda</h3>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {skinData?.stain || 0}/100
            </div>
            {skinConfidence?.stain && (
              <div className="text-xs text-muted-foreground mt-1">
                Confidence: {Math.round((skinConfidence.stain || 0) * 100)}%
              </div>
            )}
          </div>
          
          <div className="p-4 border rounded-lg bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-red-600" />
              <h3 className="font-semibold">🔴 Jerawat</h3>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {skinData?.acne || 0}/100
            </div>
            {skinConfidence?.acne && (
              <div className="text-xs text-muted-foreground mt-1">
                Confidence: {Math.round((skinConfidence.acne || 0) * 100)}%
              </div>
            )}
          </div>
          
          <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold">👁️ Lingkaran Hitam</h3>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {skinData?.dark_circle || 0}/100
            </div>
            {skinConfidence?.dark_circle && (
              <div className="text-xs text-muted-foreground mt-1">
                Confidence: {Math.round((skinConfidence.dark_circle || 0) * 100)}%
              </div>
            )}
          </div>
          
          <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Waves className="h-4 w-4 text-green-600" />
              <h3 className="font-semibold">📏 Kerutan</h3>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {skinData?.wrinkle || 0}/100
            </div>
            {skinConfidence?.wrinkle && (
              <div className="text-xs text-muted-foreground mt-1">
                Confidence: {Math.round((skinConfidence.wrinkle || 0) * 100)}%
              </div>
            )}
          </div>
        </div>
      </div>

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
                    Skor: {Math.round(skinData?.skin_type || 0)}/100
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