"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone } from "lucide-react";

export default function InstallPwaButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
      console.log("PWA was installed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
    setDeferredPrompt(null);
  };

  if (isAppInstalled) {
    return (
        <div className="text-center p-3 mt-6 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
            <p className="text-sm">O aplicativo já está instalado no seu dispositivo!</p>
        </div>
    );
  }
  
  if (!deferredPrompt) {
    return null; // Don't show anything if PWA is not installable
  }

  return (
    <div 
      onClick={handleInstallClick}
      className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center gap-3 cursor-pointer hover:bg-primary/20 transition-all"
    >
      <Smartphone className="w-5 h-5" />
      <div>
        <h4 className="font-bold">Baixe Nosso Aplicativo</h4>
        <p className="text-xs text-primary/80">Tenha acesso rápido diretamente da sua tela inicial.</p>
      </div>
    </div>
  );
}
