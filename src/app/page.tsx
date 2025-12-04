"use client";

import { useState } from "react";
import type { Platform } from "@/components/home-screen";
import HomeScreen from "@/components/home-screen";
import PlatformScreen from "@/components/platform-screen";
import { CloudDownload, Code, Heart, Phone } from "lucide-react";

export default function Home() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
  };

  const handleGoBack = () => {
    setSelectedPlatform(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden border border-border">
        {/* Header */}
        <header className="relative p-6 text-center border-b border-border bg-card">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
          <h1 className="flex items-center justify-center gap-3 text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            <CloudDownload className="text-primary" size={36} />
            BAIXA VÍDEOS
          </h1>
          <p className="mt-2 text-muted-foreground">
            Baixe vídeos de forma rápida e simples
          </p>
          <div className="inline-block px-4 py-2 mt-4 text-sm border rounded-lg bg-primary/10 border-primary/20 text-primary">
            <Heart className="inline w-4 h-4 mr-2" />
            Baixe seus vídeos favoritos em alta qualidade
          </div>
        </header>

        <main>
          {!selectedPlatform ? (
            <HomeScreen onPlatformSelect={handlePlatformSelect} />
          ) : (
            <PlatformScreen platform={selectedPlatform} onGoBack={handleGoBack} />
          )}
        </main>
        
        {/* Footer */}
        <footer className="p-6 text-sm text-center border-t text-muted-foreground border-border">
            <div className="flex items-center justify-center gap-2 mb-2 text-base font-bold text-accent">
                <Code size={20} /> DESENVOLVIDO PELO HÉLIO TECH
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
                <Phone size={16} /> Contacto: 845383993
            </div>
            <div className="pt-4 mt-4 text-xs border-t border-border/50">
                <Heart className="inline-block w-4 h-4 mr-1 text-primary" />
                Baixe seus vídeos favoritos com qualidade e facilidade
            </div>
        </footer>
      </div>
    </div>
  );
}
