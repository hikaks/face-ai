"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <CardContent className="p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Menganalisis Kulit Anda?</h2>
          <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8 text-lg">
            Dapatkan analisis kesehatan kulit profesional dalam hitungan detik. Gratis dan tanpa registrasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-base" asChild>
              <Link href="#analyze">
                Mulai Analisis Sekarang
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="#features">
                Pelajari Lebih Lanjut
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}