import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, Zap, FileCheck } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Camera,
      title: "Pilih Metode",
      description: "Gunakan webcam untuk mengambil foto langsung atau upload foto dari galeri Anda."
    },
    {
      icon: Upload,
      title: "Upload Foto",
      description: "Kirim foto wajah Anda ke sistem analisis kami dengan aman."
    },
    {
      icon: Zap,
      title: "Analisis Instan",
      description: "Teknologi AI kami menganalisis berbagai aspek kesehatan kulit Anda."
    },
    {
      icon: FileCheck,
      title: "Dapatkan Hasil",
      description: "Lihat hasil analisis lengkap dengan rekomendasi perawatan personal."
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">Cara Kerja</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Proses analisis kesehatan kulit yang sederhana dan cepat dalam 4 langkah mudah
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="relative">
              <Card className="border-0 shadow-lg h-full">
                <CardHeader>
                  <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}