import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Droplets, 
  Sun, 
  Eye, 
  Smile, 
  Gauge 
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Heart,
      title: "Kesehatan Kulit",
      description: "Analisis tingkat kesehatan kulit secara keseluruhan dengan skor yang akurat."
    },
    {
      icon: Droplets,
      title: "Deteksi Jerawat",
      description: "Identifikasi area dengan jerawat dan rekomendasi perawatan yang tepat."
    },
    {
      icon: Sun,
      title: "Noda & Pigmentasi",
      description: "Deteksi noda dan pigmentasi yang tidak merata pada wajah Anda."
    },
    {
      icon: Eye,
      title: "Lingkaran Hitam",
      description: "Analisis area sekitar mata untuk mendeteksi lingkaran hitam."
    },
    {
      icon: Smile,
      title: "Kerutan & Fine Lines",
      description: "Deteksi kerutan dan garis halus pada area wajah yang ekspresif."
    },
    {
      icon: Gauge,
      title: "Rekomendasi Personal",
      description: "Dapatkan saran perawatan kulit yang disesuaikan dengan kondisi Anda."
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">Fitur Analisis Kulit</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Teknologi canggih untuk menganalisis berbagai aspek kesehatan kulit Anda secara akurat
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </section>
  );
}