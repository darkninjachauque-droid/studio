
"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Platform } from "./home-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, School, Link as LinkIcon, Search, Loader2, PlayCircle, Download, Music, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { SubscriptionContext } from "@/context/SubscriptionContext";

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

type DownloadProgress = {
  id: string;
  progress: number;
  filename: string;
} | null;


export default function PlatformScreen({ platform, onGoBack }: PlatformScreenProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>(null);
  const { toast } = useToast();
  const router = useRouter();
  const subscriptionContext = useContext(SubscriptionContext);

  if (!subscriptionContext) {
    throw new Error("SubscriptionContext must be used within a SubscriptionProvider");
  }

  const { isSubscribed } = subscriptionContext;

  useEffect(() => {
    if (!isSubscribed) {
      router.push('/pricing');
    }
  }, [isSubscribed, router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSubscribed) {
      toast({
        variant: "destructive",
        title: "Acesso Negado",
        description: "Você precisa de um plano para baixar vídeos.",
      });
      router.push('/pricing');
      return;
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const extractedUrls = url.match(urlRegex);
    const cleanUrl = extractedUrls ? extractedUrls[0] : null;

    if (!cleanUrl) {
      setError("Por favor, insira uma URL de vídeo válida!");
      return;
    }

    setLoading(true);
    setError(null);
    setVideoData(null);
    setDownloadProgress(null);

    try {
      const apiUrl = platform.apiUrl(cleanUrl);
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(apiUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        let errorMsg = `Não foi possível encontrar o vídeo. Verifique a URL e tente novamente. (Status: ${response.status})`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorData.msg || errorMsg;
        } catch (e) {
            // A resposta pode não ser JSON, usamos a mensagem padrão
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (!data || Object.keys(data).length === 0 || data.error || (data.status && data.status !== 'success' && data.status !== 200 && !data.data && !data.url)) {
        throw new Error(data.error || data.msg || 'A API retornou um erro ou uma resposta vazia. Verifique a URL e tente novamente.');
      }
      
      let newVideoData: VideoData | null = null;
      let videoUrl: string | undefined = '';
      
      // Lógica robusta por plataforma
      if (platform.id === 'instagram') {
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            videoUrl = data.data[0].url;
        } else if (data.url) {
            videoUrl = data.url;
        } else if (Array.isArray(data) && data.length > 0 && data[0].url) {
            videoUrl = data[0].url;
        }
        if (videoUrl) {
            newVideoData = {
                previewUrl: videoUrl,
                downloads: [{ url: videoUrl, label: "Baixar Vídeo", filename: `instagram_video.mp4`, type: 'video' }]
            };
        }
      } else if (platform.id === 'youtube') {
        let videoTitle = "video";
        if (data.meta?.title) {
          videoTitle = data.meta.title.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, '_');
        }

        if (Array.isArray(data.data?.url) && data.data.url.length > 0) {
            const sortedVideos = data.data.url
                .filter((v: any) => v.quality && !v.noAudio)
                .sort((a: any, b: any) => parseInt(b.quality) - parseInt(a.quality));
            videoUrl = sortedVideos.length > 0 ? sortedVideos[0].url : undefined;
        } else if(data.url) {
             videoUrl = data.url;
        }
        
        if (videoUrl) {
             newVideoData = {
                previewUrl: videoUrl,
                downloads: [{ url: videoUrl, label: "Baixar Vídeo", filename: `${videoTitle}.mp4`, type: 'video' }]
            };
        }
      } else if (platform.id === 'facebook') {
        if (data.data?.links) {
            videoUrl = data.data.links['HD video'] || data.data.links['Normal video'];
        } else if (data.links) {
            videoUrl = data.links['HD'] || data.links['SD'];
        } else if (data.url) {
            videoUrl = data.url;
        } else if (Array.isArray(data) && data.length > 0 && data[0].url) {
            videoUrl = data[0].url;
        }

        if (videoUrl) {
            newVideoData = {
                previewUrl: videoUrl,
                downloads: [{ url: videoUrl, label: "Baixar Vídeo", filename: `facebook_video.mp4`, type: 'video' }]
            };
        }
      } else if (platform.id === 'tiktok' && data.data?.play) {
        videoUrl = data.data.play;
        const musicUrl = data.data.music;
        newVideoData = {
            previewUrl: videoUrl,
            downloads: [{ url: videoUrl, label: "Baixar Vídeo", filename: `tiktok_video.mp4`, type: 'video' }]
        };
        if(musicUrl){
            newVideoData.downloads.push({ url: musicUrl, label: "Baixar Áudio", filename: `tiktok_audio.mp3`, type: 'music' });
        }
      }

      if (newVideoData && videoUrl) {
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

  const handleDownload = async (downloadUrl: string, originalFilename: string) => {
    if (downloadProgress) {
      toast({
        variant: "destructive",
        title: "Aguarde!",
        description: "Outro download já está em progresso.",
      });
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileExtension = originalFilename.split('.').pop() || 'mp4';
    const baseFilename = "video_baixado";
    const finalFilename = `${baseFilename}_${timestamp}.${fileExtension}`;

    setDownloadProgress({ id: finalFilename, progress: 0, filename: finalFilename });

    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(downloadUrl)}&download=true&filename=${encodeURIComponent(finalFilename)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `O servidor respondeu com o status ${response.status}` }));
        throw new Error(errorData.error || `O servidor respondeu com o status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("O corpo da resposta está vazio.");
      }

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;
      
      const reader = response.body.getReader();
      const stream = new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              loaded += value.length;
              if (total > 0) {
                  const progress = Math.round((loaded / total) * 100);
                  setDownloadProgress(prev => prev ? { ...prev, progress } : null);
              }
              controller.enqueue(value);
              push();
            }).catch(error => {
                console.error(error);
                controller.error(error);
            });
          }
          push();
        },
      });

      const blob = await new Response(stream).blob();
      
      setDownloadProgress(prev => prev ? { ...prev, progress: 100 } : null);

      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = finalFilename;
      document.body.appendChild(a);
      a.click();

      toast({
        title: "Download Concluído!",
        description: `Seu vídeo foi salvo com sucesso.`,
        className: "bg-green-500/10 border-green-500 text-white"
      });

      window.URL.revokeObjectURL(blobUrl);
      a.remove();

      setTimeout(() => {
        setDownloadProgress(null);
      }, 1500);

    } catch (err: any) {
      setError("Falha no download: " + err.message);
      toast({
        variant: "destructive",
        title: "Erro no Download",
        description: "Não foi possível baixar o arquivo.",
      });
      setDownloadProgress(null);
    }
  };

  if (!isSubscribed) {
    return (
        <div className="p-6 animate-in fade-in duration-500">
            <header className="flex w-full mb-6 items-center">
                <Button variant="ghost" onClick={onGoBack} className="px-2 hover:bg-secondary -ml-2">
                    <ArrowLeft />
                    <span className="ml-2">Voltar</span>
                </Button>
            </header>
            <div className="flex flex-col items-center justify-center p-6 text-center rounded-lg bg-secondary">
                <AlertTriangle className="w-10 h-10 mb-4 text-destructive" />
                <h2 className="font-semibold text-lg mb-2">Acesso Restrito</h2>
                <p className="text-sm text-muted-foreground mb-4">Você precisa de um plano de assinatura para baixar vídeos.</p>
                <Button onClick={() => router.push('/pricing')} className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-pink-500 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                    Ver Planos
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="p-6 animate-in fade-in duration-500">
      <header className="flex w-full mb-6 items-center">
        <Button variant="ghost" onClick={onGoBack} className="px-2 hover:bg-secondary -ml-2">
          <ArrowLeft />
          <span className="ml-2">Voltar</span>
        </Button>
      </header>
      
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
            <span className={`flex items-center justify-center w-10 h-10 rounded-lg ${platform.iconColorClass} flex-shrink-0`}>
                <Icon className="w-6 h-6" />
            </span>
            <h2 className="text-xl font-bold">Download {platform.name}</h2>
        </div>
      </div>

        <form onSubmit={handleSearch}>
            <div className="flex items-center gap-4 mb-4">
              <Input 
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={`Cole o link do vídeo do ${platform.name}`}
                  className="h-12 text-base focus-visible:ring-primary"
                  disabled={loading || !!downloadProgress}
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-pink-500 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300" disabled={loading || !!downloadProgress}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                Buscar Vídeo
            </Button>
        </form>
      

      {loading && (
        <div className="flex flex-col items-center justify-center p-6 text-center rounded-lg bg-secondary mt-6">
          <Loader2 className="w-10 h-10 mb-4 animate-spin text-accent" />
          <p className="font-semibold text-lg">Processando vídeo...</p>
          <p className="text-sm text-muted-foreground">Aguarde enquanto preparamos seu download.</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="animate-in fade-in duration-300 mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {videoData && !loading && (
        <div className="p-4 rounded-lg bg-secondary animate-in slide-in-from-bottom-5 duration-500 mt-6">
            <Alert className="mb-4 border-green-500 bg-green-500/10 text-green-300">
                <CheckCircle2 className="h-4 w-4 !text-green-400" />
                <AlertTitle className="!text-green-400 font-bold">Vídeo encontrado!</AlertTitle>
                <AlertDescription>
                    Seu vídeo está pronto para ser baixado.
                </AlertDescription>
            </Alert>
            
            <div className="relative mb-4 overflow-hidden rounded-lg bg-black/20 border border-border">
                <h4 className="flex items-center gap-2 p-3 font-semibold text-primary">
                    <PlayCircle />
                    Preview do Vídeo
                </h4>
                <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-b-lg">
                    <video
                        key={videoData.previewUrl}
                        className="w-full h-full object-cover bg-black"
                        controls
                        playsInline
                    >
                        <source src={videoData.previewUrl} type="video/mp4" />
                        Seu navegador não suporta o elemento de vídeo.
                    </video>
                </div>
            </div>
            
            {downloadProgress && (
              <div className="p-4 my-4 border rounded-lg border-accent/30 bg-accent/10">
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="font-semibold text-accent-foreground truncate pr-2">Baixando: {downloadProgress.filename}</span>
                  <span className="font-mono text-accent">{downloadProgress.progress}%</span>
                </div>
                <Progress value={downloadProgress.progress} className="h-2 [&>div]:bg-accent" />
              </div>
            )}

            <div className="flex flex-col gap-4">
              {videoData.downloads.map((download, index) => (
                <Button 
                    key={index}
                    onClick={() => handleDownload(download.url, download.filename)}
                    disabled={!!downloadProgress}
                    className="w-full h-12 text-base font-bold text-white bg-black transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {download.type === 'video' ? <Download className="mr-2" /> : <Music className="mr-2" />}
                    {download.label}
                </Button>
              ))}
            </div>
        </div>
      )}

      {!videoData && !loading && !error && (
        <Alert className="border-accent/50 bg-accent/10 text-accent/90 mt-6">
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
