import type { Metadata } from "next";

import "./globals.css";
import { fontRajdhani, fontOutfit } from "@/lib/fonts";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    default: "Inicio Official — Call of Duty Mobile",
    template: "%s | Inicio Official"
  },
  description: "Home of Inicio Official — CoD Mobile guides, news, tier lists & community. 55K+ YouTube subscribers.",
  keywords: ["Call of Duty Mobile", "CoD Mobile", "gaming", "guides", "tier list", "patch notes", "Inicio Official"],
  authors: [{ name: "Inicio Official" }],
  creator: "Inicio Official",
  publisher: "Inicio Official",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://inicioofficial.com",
    siteName: "Inicio Official",
    title: "Inicio Official — Call of Duty Mobile",
    description: "Home of Inicio Official — CoD Mobile guides, news, tier lists & community. 55K+ YouTube subscribers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Inicio Official - CoD Mobile"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Inicio Official — Call of Duty Mobile",
    description: "Home of Inicio Official — CoD Mobile guides, news, tier lists & community. 55K+ YouTube subscribers.",
    images: ["/og-image.png"],
    creator: "@inicioofficial"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  manifest: "/site.webmanifest"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JFVGME840W"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-JFVGME840W');`}
        </Script>
        {/* TODO: Confirm exact publisher ID in Adsense dashboard → Account → Account information */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3182788597"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${fontRajdhani.variable} ${fontOutfit.variable} font-body antialiased bg-[#0a0a0a] text-white`}>
        <Header />
        {children}
        <Footer />
        <Toaster richColors position="top-center" duration={4000} />
      </body>
    </html>
  );
}
