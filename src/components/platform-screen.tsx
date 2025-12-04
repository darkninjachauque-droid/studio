
"use client";

import { useState } from "react";
import type { Platform } from "./home-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, School, Link as LinkIcon, Search, Loader2, PlayCircle, Download, Music, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlatformScreenProps {
  platform: Platform;
  onGoBack: () => void;
}

type VideoData = {
    previewUrl: string;
    downloads: {
        url: string;
        label: string;
        filename: string;
        type: 'video' | 'music';
    }[];
}

export default function PlatformScreen({ platform, onGoBack }: PlatformScreenProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const { toast } = useToast();

  const platformInstructions = {
    tiktok: [
      "Abra o TikTok e encontre o vídeo desejado",
      "Clique em 'Compartilhar' e copie o link",
      "Cole o link abaixo e clique em 'Buscar'",
      "Assista o preview e clique em 'Baixar Vídeo'",
    ],
    instagram: [
      "Abra o Instagram e encontre o vídeo ou Reels",
      "Clique nos três pontos e copie o link",
      "Cole o link abaixo e clique em 'Buscar'",
      "Assista o preview e baixe o vídeo",
    ],
    facebook: [
      "Abra o Facebook e encontre o vídeo",
      "Clique nos três pontos e copie o link",
      "Cole o link abaixo e clique em 'Buscar'",
      "Assista o preview e baixe o vídeo",
    ],
    youtube: [
      "Abra o YouTube e encontre o vídeo",
      "Copie o link da barra de endereços",
      "Cole o link abaixo e clique em 'Buscar'",
      "Assista o preview e baixe o vídeo",
    ]
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError("Por favor, insira a URL do vídeo!");
      return;
    }

    setLoading(true);
    setError(null);
    setVideoData(null);

    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(platform.apiUrl(url))}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();

      if (!response.ok || data.error || (Array.isArray(data) && data.length === 0 && platform.id !== 'youtube') || (platform.id === 'youtube' && !data.url && !(Array.isArray(data) && data.length > 0)) ) {
        throw new Error(data.error || data.msg || 'Não foi possível encontrar o vídeo. Verifique a URL e tente novamente.');
      }
      
      let newVideoData: VideoData | null = null;
      const timestamp = Date.now();

      if (platform.id === 'tiktok') {
        const videoUrl = data.data?.play;
        const musicUrl = data.data?.music;
        if (videoUrl) {
            newVideoData = {
                previewUrl: videoUrl,
                downloads: [{ url: videoUrl, label: "Baixar Vídeo Sem Marca d'Água", filename: `tiktok_video_${timestamp}.mp4`, type: 'video' }]
            };
            if(musicUrl){
                newVideoData.downloads.push({ url: musicUrl, label: "Baixar Som do Vídeo", filename: `tiktok_music_${timestamp}.mp3`, type: 'music' });
            }
        }
      } else if (platform.id === 'youtube') {
        let videoUrl = '';
        if (Array.isArray(data) && data.length > 0) {
            const sortedData = data.sort((a,b) => parseInt(b.quality) - parseInt(a.quality));
            videoUrl = sortedData[0]?.url || sortedData[0]?.link;
        } else if (data.url) {
            videoUrl = data.url;
        }
        if (videoUrl) {
             newVideoData = {
                previewUrl: videoUrl,
                downloads: [{ url: videoUrl, label: "Baixar Vídeo do YouTube", filename: `youtube_video_${timestamp}.mp4`, type: 'video' }]
            };
        }
      } else { // Instagram & Facebook
        let videoUrl = '';
        if (Array.isArray(data) && data.length > 0) {
            videoUrl = data[0]?.url;
        } else if (data.data && data.data.url) {
            videoUrl = data.data.url;
        }
        if (videoUrl) {
             newVideoData = {
                previewUrl: videoUrl,
                downloads: [{ url: videoUrl, label: `Baixar Vídeo do ${platform.name}`, filename: `${platform.id}_video_${timestamp}.mp4`, type: 'video' }]
            };
        }
      }

      if (newVideoData) {
        setVideoData(newVideoData);
      } else {
        throw new Error('Não foi possível processar os dados do vídeo. O formato da resposta pode ter mudado.');
      }

    } catch (err: any) {
      setError(err.message || "Ocorreu um erro. Verifique sua conexão e a URL do vídeo.");
    } finally {
      setLoading(false);
    }
  };

  const Icon = platform.icon;

  const handleDownload = async (downloadUrl: string, filename: string) => {
    toast({
      title: "Download Iniciando...",
      description: "Seu download começará em uma nova aba.",
    });
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="p-6 animate-in fade-in duration-500">
      <header className="flex items-center pb-4 mb-6 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onGoBack} className="mr-3 rounded-full hover:bg-secondary">
          <ArrowLeft />
        </Button>
        <h2 className="flex items-center gap-3 text-2xl font-bold">
          <span className={`flex items-center justify-center w-8 h-8 rounded-md ${platform.iconColorClass}`}>
            <Icon className="w-5 h-5" />
          </span>
          Download {platform.name}
        </h2>
      </header>

      <div className="p-5 mb-6 rounded-lg bg-secondary border-l-4 border-primary">
          <h3 className="flex items-center gap-3 mb-3 font-semibold text-lg">
            <School className="text-accent" />
            Como Baixar
          </h3>
          <ol className="text-sm list-decimal list-inside space-y-2 text-muted-foreground">
            {platformInstructions[platform.id].map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
      </div>

      <div className="p-6 mb-6 rounded-lg bg-secondary">
        <h3 className="mb-4 text-xl font-bold">Cole o Link do {platform.name}</h3>
        <form onSubmit={handleSearch}>
            <div className="relative mb-4">
                <LinkIcon className="absolute w-5 h-5 left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={`https://www.${platform.id}.com/...`}
                    className="pl-10 h-12 text-base focus-visible:ring-primary"
                    disabled={loading}
                />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-pink-500 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                Buscar Vídeo
            </Button>
        </form>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-6 text-center rounded-lg bg-secondary">
          <Loader2 className="w-10 h-10 mb-4 animate-spin text-accent" />
          <p className="font-semibold text-lg">Processando vídeo...</p>
          <p className="text-sm text-muted-foreground">Aguarde enquanto preparamos seu download.</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="animate-in fade-in duration-300">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {videoData && !loading && (
        <div className="p-6 rounded-lg bg-secondary animate-in slide-in-from-bottom-5 duration-500">
            <Alert className="mb-6 border-green-500 bg-green-500/10 text-green-300">
                <CheckCircle2 className="h-4 w-4 !text-green-400" />
                <AlertTitle className="!text-green-400 font-bold">Vídeo encontrado!</AlertTitle>
                <AlertDescription>
                    Seu vídeo está pronto para ser baixado.
                </AlertDescription>
            </Alert>
            
            <div className="p-4 mb-6 rounded-lg bg-black/20 border border-border">
                <h4 className="flex items-center gap-2 mb-3 font-semibold text-primary">
                    <PlayCircle />
                    Preview do Vídeo
                </h4>
                <div className="overflow-hidden rounded-lg shadow-lg shadow-primary/10">
                    <video
                        key={videoData.previewUrl}
                        className="w-full aspect-video bg-black"
                        controls
                        playsInline
                    >
                        <source src={videoData.previewUrl} type="video/mp4" />
                        Seu navegador não suporta o elemento de vídeo.
                    </video>
                </div>
            </div>

            <div className="flex flex-col gap-4">
              {videoData.downloads.map((download, index) => (
                <Button 
                    key={index}
                    onClick={() => handleDownload(download.url, download.filename)}
                    className={`w-full h-12 text-base font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                      ${download.type === 'video' ? 'bg-gradient-to-r from-accent to-blue-400 hover:shadow-accent/40' : 'bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:shadow-purple-500/40'}`
                    }
                >
                    {download.type === 'video' ? <Download className="mr-2" /> : <Music className="mr-2" />}
                    {download.label}
                </Button>
              ))}
            </div>
        </div>
      )}

      {!videoData && !loading && !error && (
        <Alert className="border-accent/50 bg-accent/10 text-accent/90">
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>Pronto para começar!</AlertTitle>
          <AlertDescription>
            Cole um link acima para encontrar seu vídeo.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
