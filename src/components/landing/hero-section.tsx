"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, Shield, Zap } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col items-center text-center gap-8 md:gap-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Analisis Kesehatan<span className="text-primary"> Kulit</span> Instan
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Dapatkan analisis kesehatan kulit profesional dalam hitungan detik. Tanpa penyimpanan data permanen dan sepenuhnya gratis.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="text-base" asChild>
            <Link href="/analysis">
              <Camera className="mr-2 h-5 w-5" />
              Mulai Analisis
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl w-full">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Privasi Terjaga</CardTitle>
              <CardDescription>
                Tidak ada penyimpanan data permanen. Semua analisis bersifat sementara.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Hasil Instan</CardTitle>
              <CardDescription>
                Dapatkan hasil analisis kesehatan kulit dalam hitungan detik.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <Upload className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Mudah Digunakan</CardTitle>
              <CardDescription>
                Cukup upload foto atau gunakan webcam untuk langsung menganalisis.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}