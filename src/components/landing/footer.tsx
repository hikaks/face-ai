import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-semibold">Analisis Kesehatan Kulit</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SkinCare AI. Semua hak dilindungi.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Privasi Terjaga • Data Tidak Disimpan
          </p>
        </div>
      </div>
    </footer>
  );
}