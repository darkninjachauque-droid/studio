"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Instagram, Facebook, Youtube, Info, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TiktokIcon } from "@/components/icons";
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export type Platform = {
  id: "instagram" | "facebook" | "tiktok" | "youtube";
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColorClass: string;
  apiUrl: (url: string) => string;
};

const platforms: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    description: "Vídeos, Reels e Stories em alta qualidade",
    icon: Instagram,
    iconColorClass: "text-white bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500",
    apiUrl: (url) => `https://apisnodz.com.br/api/downloads/instagram/dl?url=${encodeURIComponent(url)}`
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Baixe vídeos de forma rápida e fácil",
    icon: Facebook,
    iconColorClass: "text-white bg-[#1877F2]",
    apiUrl: (url) => `https://apisnodz.com.br/api/downloads/facebook/dl?url=${encodeURIComponent(url)}`
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Vídeos sem marca d'água em alta definição",
    icon: TiktokIcon,
    iconColorClass: "text-white bg-black",
    apiUrl: (url) => `https://apisnodz.com.br/api/downloads/tiktok/dl?url=${encodeURIComponent(url)}`
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Vídeos em diversas resoluções disponíveis",
    icon: Youtube,
    iconColorClass: "text-white bg-[#FF0000]",
    apiUrl: (url) => `https://apisnodz.com.br/api/downloads/youtube/dl?url=${encodeURIComponent(url)}&type=video`
  },
];

interface HomeScreenProps {
  onPlatformSelect: (platform: Platform) => void;
}

const AppInstallBanner = ({ onDismiss }: { onDismiss: () => void }) => {
  const { toast } = useToast();

  const handleDownloadClick = () => {
    // Placeholder para a lógica de download real
    // Por enquanto, apenas exibimos uma notificação
    const link = document.createElement('a');
    link.href = '/#'; // Link para o seu arquivo .apk ou para a loja de apps
    link.download = 'baixa-videos.apk'; // Nome do arquivo
    document.body.appendChild(link);
    // link.click(); // Descomente quando tiver um link real
    document.body.removeChild(link);

    toast({
      title: "Download em breve!",
      description: "O aplicativo ainda não está disponível, mas agradecemos seu interesse!",
    });
  };
  
  return (
    <div className="relative p-4 mb-6 rounded-lg bg-gradient-to-tr from-primary/20 via-primary/10 to-accent/10 border-l-4 border-primary animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
      <Button variant="ghost" size="icon" className="absolute w-6 h-6 top-2 right-2 text-primary/70 hover:text-primary" onClick={onDismiss}>
        <X size={16} />
      </Button>
      <h3 className="mb-2 text-lg font-bold text-primary">Baixe nosso Aplicativo!</h3>
      <p className="mb-4 text-sm text-primary/80">
        Tenha a melhor experiência e baixe vídeos ilimitados diretamente no seu celular.
      </p>
      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleDownloadClick}>
        <Download className="mr-2" />
        Baixar o App
      </Button>
    </div>
  );
};

export default function HomeScreen({ onPlatformSelect }: HomeScreenProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const bannerDismissed = localStorage.getItem('appBannerDismissed');
    if (!bannerDismissed) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismissBanner = () => {
    localStorage.setItem('appBannerDismissed', 'true');
    setShowBanner(false);
  };

  return (
    <div className="p-6 animate-in fade-in duration-500">
      {showBanner && <AppInstallBanner onDismiss={handleDismissBanner} />}
      
      <h2 className="relative pb-3 mb-6 text-2xl font-bold text-center">
        Escolha a Plataforma
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
      </h2>
      <div className="grid gap-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <Card
              key={platform.id}
              onClick={() => onPlatformSelect(platform)}
              className="p-4 transition-all duration-300 border-l-4 cursor-pointer border-transparent hover:border-l-accent hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 hover:bg-secondary"
            >
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-16 h-16 rounded-lg ${platform.iconColorClass}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{platform.name}</CardTitle>
                  <CardDescription className="mt-1 text-sm text-muted-foreground">{platform.description}</CardDescription>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="flex items-center gap-3 p-4 mt-6 text-center rounded-lg bg-accent/10 text-accent border border-accent/20">
        <Info className="w-5 h-5" />
        <p className="text-sm">Selecione uma plataforma acima para começar</p>
      </div>
    </div>
  );
}
