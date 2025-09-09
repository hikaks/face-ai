# Dokumentasi Perhitungan Skor Kesehatan Kulit

## Overview
Dokumen ini menjelaskan bagaimana skor kesehatan kulit dihitung dalam aplikasi analisis kulit, baik untuk analisis basic maupun advanced.

## Masalah yang Diperbaiki
Sebelumnya, skor kesehatan kulit selalu menunjukkan **100/100** karena:
1. Formula perhitungan yang salah untuk advanced analysis
2. Penggunaan default value yang tidak sesuai dengan struktur data Face++ API
3. Tidak mempertimbangkan semua parameter skin issues dari Face++ Skin Analyze API

## Formula Perhitungan Skor

### Advanced Analysis (Face++ Skin Analyze API)

#### Health Score Calculation
```javascript
// Daftar semua skin issues yang dianalisis
const skinIssues = [
  result.acne?.value || 0,           // Jerawat
  result.skin_spot?.value || 0,      // Noda kulit
  result.blackhead?.value || 0,      // Komedo
  result.eye_pouch?.value || 0,      // Kantung mata
  result.dark_circle?.value || 0,    // Lingkaran hitam
  result.forehead_wrinkle?.value || 0,   // Kerutan dahi
  result.crows_feet?.value || 0,         // Kerutan kaki gagak
  result.eye_finelines?.value || 0,      // Garis halus mata
  result.glabella_wrinkle?.value || 0,   // Kerutan glabella
  result.nasolabial_fold?.value || 0,    // Lipatan nasolabial
  result.pores_forehead?.value || 0,     // Pori-pori dahi
  result.pores_left_cheek?.value || 0,   // Pori-pori pipi kiri
  result.pores_right_cheek?.value || 0,  // Pori-pori pipi kanan
  result.pores_jaw?.value || 0           // Pori-pori rahang
];

// Hitung total issues dan persentase
const totalIssues = skinIssues.reduce((sum, issue) => sum + (issue || 0), 0);
const maxPossibleIssues = skinIssues.length; // 14 parameter

// Formula: 100 - (persentase issues * 100)
healthScore = Math.max(0, Math.min(100, Math.round(
  100 - (totalIssues / maxPossibleIssues) * 100
)));
```

#### Individual Score Calculation
```javascript
recommendationData = {
  health: healthScore,
  stain: Math.round((result.skin_spot?.value || 0) * 100),
  acne: Math.round((result.acne?.value || 0) * 100),
  dark_circle: Math.round((result.dark_circle?.value || 0) * 100),
  wrinkle: Math.round((
    (result.forehead_wrinkle?.value || 0) + 
    (result.crows_feet?.value || 0) + 
    (result.eye_finelines?.value || 0) + 
    (result.glabella_wrinkle?.value || 0) + 
    (result.nasolabial_fold?.value || 0)
  ) / 5 * 100)
};
```

#### Overall Score Calculation
```javascript
const overallScore = Math.round(
  (recommendationData.health + 
   (100 - recommendationData.stain) + 
   (100 - recommendationData.acne) + 
   (100 - recommendationData.dark_circle) + 
   (100 - recommendationData.wrinkle)) / 5
);
```

### Basic Analysis (Face++ Detect API)

```javascript
healthScore = Math.max(0, Math.min(100, Math.round(100 - (
  (skinData.acne || 0) * 25 +
  (skinData.stain || 0) * 20 +
  (skinData.dark_circle || 0) * 15 +
  (skinData.health || 0) * 10
))));
```

## Struktur Data Face++ API

### Skin Analyze API Response
Face++ Skin Analyze API mengembalikan nilai binary (0 atau 1) untuk sebagian besar parameter:
- **0**: Tidak ada masalah/issue
- **1**: Ada masalah/issue

Contoh:
```json
{
  "result": {
    "acne": { "value": 1, "confidence": 0.98785 },
    "skin_spot": { "value": 0, "confidence": 0.045335323 },
    "blackhead": { "value": 0, "confidence": 0.000021956253 },
    "pores_forehead": { "value": 0, "confidence": 0.99933124 }
  }
}
```

## Interpretasi Skor

### Health Score Range
- **90-100**: Kulit sangat sehat, minimal issues
- **70-89**: Kulit sehat dengan beberapa minor issues
- **50-69**: Kulit cukup sehat dengan moderate issues
- **30-49**: Kulit memerlukan perhatian, banyak issues
- **0-29**: Kulit memerlukan perawatan intensif

### Overall Score Calculation Logic
Overall score dihitung dengan:
1. Mengambil health score langsung
2. Menginversi skor negative attributes (stain, acne, dark_circle, wrinkle)
3. Menghitung rata-rata dari semua komponen

## Confidence Score
Setiap parameter juga memiliki confidence score yang menunjukkan tingkat kepercayaan AI terhadap hasil analisis:
- **> 0.9**: Sangat yakin
- **0.7-0.9**: Cukup yakin
- **0.5-0.7**: Kurang yakin
- **< 0.5**: Tidak yakin

## Testing & Validation
Untuk memastikan akurasi perhitungan:
1. Test dengan berbagai kondisi kulit
2. Verifikasi bahwa skor tidak selalu 100/100
3. Pastikan skor berubah sesuai dengan kondisi kulit yang dianalisis
4. Validasi confidence score ditampilkan dengan benar

---
*Dokumentasi ini dibuat untuk membantu development dan maintenance aplikasi analisis kulit.*