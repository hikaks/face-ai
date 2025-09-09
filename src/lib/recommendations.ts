/**
 * Recommendation engine for skin analysis
 * 
 * This module generates personalized skincare recommendations based on skin analysis data.
 * It's compatible with data processed from Face++ Skin Analyze API and converted to 0-100 scale.
 * 
 * The recommendation engine analyzes five key skin attributes:
 * 1. Health - Overall skin health score
 * 2. Stain - Presence of skin spots or discoloration
 * 3. Acne - Acne and blemish severity
 * 4. Dark Circle - Under-eye circle severity
 * 5. Wrinkle - Wrinkle and fine line severity
 * 
 * For each attribute, it provides recommendations with priority levels:
 * - High: Critical issues requiring immediate attention
 * - Medium: Moderate concerns for prevention
 * - Low: General maintenance tips
 */

interface SkinAnalysisData {
  /** Overall skin health score (0-100) */
  health: number;
  /** Skin stain/discoloration level (0-100) */
  stain: number;
  /** Acne severity (0-100) */
  acne: number;
  /** Dark circle severity (0-100) */
  dark_circle: number;
  /** Wrinkle severity (0-100) */
  wrinkle: number;
}

interface Recommendation {
  /** Title of the recommendation */
  title: string;
  /** Detailed description of the recommendation */
  description: string;
  /** Priority level: high, medium, or low */
  priority: "high" | "medium" | "low";
}

/**
 * Generate personalized skincare recommendations based on skin analysis data
 * 
 * @param skinData - Processed skin analysis data with values in 0-100 scale
 * @returns Array of personalized recommendations with priority levels
 */
export function generateRecommendations(skinData: SkinAnalysisData): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Health-based recommendations
  if (skinData.health < 50) {
    recommendations.push({
      title: "Perbaiki Kesehatan Kulit",
      description: "Kesehatan kulit Anda rendah. Gunakan pelembap harian dan konsumsi makanan bergizi seimbang.",
      priority: "high"
    });
  } else if (skinData.health < 70) {
    recommendations.push({
      title: "Pertahankan Kesehatan Kulit",
      description: "Kesehatan kulit Anda cukup baik. Teruskan perawatan harian dengan sunscreen dan pelembap.",
      priority: "medium"
    });
  } else {
    recommendations.push({
      title: "Pertahankan Kulit Sehat",
      description: "Kesehatan kulit Anda sangat baik! Jaga rutinitas perawatan harian Anda.",
      priority: "low"
    });
  }

  // Stain-based recommendations
  if (skinData.stain > 50) {
    recommendations.push({
      title: "Atasi Noda di Wajah",
      description: "Gunakan produk dengan vitamin C atau asam glikolat untuk mencerahkan dan mengurangi noda.",
      priority: "high"
    });
  } else if (skinData.stain > 30) {
    recommendations.push({
      title: "Pencegahan Noda",
      description: "Gunakan sunscreen SPF 30+ setiap hari untuk mencegah munculnya noda baru.",
      priority: "medium"
    });
  }

  // Acne-based recommendations
  if (skinData.acne > 50) {
    recommendations.push({
      title: "Atasi Jerawat",
      description: "Gunakan produk dengan salisilat atau benzoyl peroxide. Hindari menyentuh wajah secara berlebihan.",
      priority: "high"
    });
  } else if (skinData.acne > 30) {
    recommendations.push({
      title: "Pencegahan Jerawat",
      description: "Bersihkan wajah dua kali sehari dan gunakan produk non-comedogenic.",
      priority: "medium"
    });
  }

  // Dark circle-based recommendations
  if (skinData.dark_circle > 50) {
    recommendations.push({
      title: "Kurangi Lingkaran Hitam",
      description: "Gunakan eye cream dengan kafein atau retinol. Pastikan tidur cukup (7-8 jam per malam).",
      priority: "high"
    });
  } else if (skinData.dark_circle > 30) {
    recommendations.push({
      title: "Pencegahan Lingkaran Hitam",
      description: "Gunakan eye serum dan pastikan hidrasi tubuh yang cukup.",
      priority: "medium"
    });
  }

  // Wrinkle-based recommendations
  if (skinData.wrinkle > 50) {
    recommendations.push({
      title: "Atasi Kerutan",
      description: "Gunakan produk dengan retinol atau peptide. Lindungi wajah dari sinar UV.",
      priority: "high"
    });
  } else if (skinData.wrinkle > 30) {
    recommendations.push({
      title: "Pencegahan Kerutan",
      description: "Gunakan moisturizer dengan SPF dan hindari ekspresi wajah berlebihan.",
      priority: "medium"
    });
  }

  // General recommendations
  recommendations.push({
    title: "Rutinitas Perawatan",
    description: "Bersihkan wajah dua kali sehari, gunakan sunscreen setiap pagi, dan pelembap setiap malam.",
    priority: "low"
  });

  recommendations.push({
    title: "Hidrasi dari Dalam",
    description: "Minum minimal 8 gelas air putih sehari untuk menjaga kelembapan kulit.",
    priority: "low"
  });

  return recommendations;
}