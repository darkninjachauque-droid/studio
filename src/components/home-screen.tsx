"use client";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Instagram, Facebook, Youtube, Info } from "lucide-react";
import { TiktokIcon } from "@/components/icons";
import InstallPwaButton from "./install-pwa-button";

export interface Platform {
  id: "instagram" | "facebook" | "tiktok" | "youtube";
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColorClass: string;
  apiUrl: (url: string) => string;
}

const platformsData: Platform[] = [
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

export default function HomeScreen({ onPlatformSelect }: HomeScreenProps) {

  return (
    <div className="p-6 animate-in fade-in duration-500">
      
      <h2 className="relative pb-3 mb-6 text-2xl font-bold text-center">
        Escolha a Plataforma
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full animate-gradient" />
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {platformsData.map((platform) => {
          const Icon = platform.icon;
          return (
            <Card
              key={platform.id}
              onClick={() => onPlatformSelect(platform)}
              className="p-3 transition-all duration-300 border-l-4 cursor-pointer flex items-center gap-4 border-transparent hover:border-l-accent hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20 hover:bg-secondary"
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${platform.iconColorClass} flex-shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <CardTitle className="text-lg">{platform.name}</CardTitle>
                <CardDescription className="text-xs">{platform.description}</CardDescription>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="flex items-center gap-3 p-4 mt-6 text-center rounded-lg bg-accent/10 text-accent border border-accent/20">
        <Info className="w-5 h-5" />
        <p className="text-sm">Selecione uma plataforma acima para começar</p>
      </div>

      <div className="mt-6">
        <InstallPwaButton />
      </div>
    </div>
  );
}
