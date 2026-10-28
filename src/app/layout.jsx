import "./globals.css";
import ClientShellWrapper from "@/components/ClientShellWrapper";

export const metadata = {
  metadataBase: new URL("https://baharaz.com"),
  title: "Baharaz - Best Online Shopping in BD | Fastest Delivery",
  description: "Baharaz - Bangladesh's fastest online shopping platform like Daraz, Amazon - Mobiles, Fashion, Electronics - Free Delivery, Cash on Delivery",
  keywords: "online shopping bd, daraz, baharaz, amazon bd, shopping, best shopping bd",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192.png', sizes: '192x192' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: "Baharaz - Best Online Shopping in BD",
    description: "Fastest Online Shopping in BD - Fashion Fest 70% OFF",
    url: "https://baharaz.com",
    siteName: "Baharaz",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Baharaz - Best Online Shopping BD" }],
    locale: "en_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baharaz - Best Online Shopping in BD",
    description: "Fastest Online Shopping in BD",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: 'https://baharaz.com' },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#F85606",
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "name": "Baharaz",
    "url": "https://baharaz.com",
    "logo": "https://baharaz.com/logo.png",
    "image": "https://baharaz.com/og-image.jpg",
    "description": "Bangladesh's fastest online shopping platform",
    "sameAs": [
      "https://www.facebook.com/baharazbd",
      "https://www.instagram.com/baharazbd",
      "https://www.youtube.com/@baharazbd",
      "https://twitter.com/baharazbd",
      "https://www.tiktok.com/@baharazbd"
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://baharaz.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <link rel="preconnect" href="https://baharaz.com" />
        <link rel="dns-prefetch" href="https://baharaz.com" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="bg-[#f5f5f5] antialiased overflow-x-hidden min-h-screen w-full max-w-full m-0 p-0 mt-0 pt-0" suppressHydrationWarning>
        <ClientShellWrapper>
          <div className="w-full min-h-screen bg-[#f5f5f5] relative z-0 overflow-x-hidden m-0 p-0 mt-0 pt-0">
            <div className="w-full max-w-full mx-auto px-0 m-0 mt-0 pt-0">
              {children}
            </div>
          </div>
        </ClientShellWrapper>
        <style>{`
          html,body{max-width:100%; overflow-x:hidden; margin:0 !important; padding:0 !important; background:#f5f5f5;}
          *{box-sizing:border-box;}
          /* HEADER আর BANNER এর মাঝের সাদা 112px গ্যাপ বন্ধ */
          div.hidden.md\\:block.w-full.shrink-0.bg-\\[\\#F5F5F5\\] {
            display: none !important;
            height: 0 !important;
          }
          main { padding-top: 0 !important; margin-top: 0 !important; }
        `}</style>
      </body>
    </html>
  );
}