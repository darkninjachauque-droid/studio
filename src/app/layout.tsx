import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'BAIXA VÍDEOS',
  description: 'Baixe vídeos de forma rápida e simples',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="dark">
      <head>
        <link rel="icon" href="https://i.ibb.co/4R99MLDz/unnamed.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4540418582142311"
          crossOrigin="anonymous"
        ></script>

        {/* Inicialização automática opcional */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (adsbygoogle = window.adsbygoogle || []).push({});
            `,
          }}
        />
      </head>

      <body className="font-body antialiased">
        {children}
        <Toaster />

        {/* Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('ServiceWorker registrado:', registration.scope);
                  }).catch(err => {
                    console.log('Falha no ServiceWorker:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
