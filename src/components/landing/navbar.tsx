"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import Link from "next/link";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span>SkinCare AI</span>
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}