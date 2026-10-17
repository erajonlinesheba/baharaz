import "./globals.css";
import ClientShell from "@/components/ClientShell";

export const metadata = {
  metadataBase: new URL("https://baharaz.com"),
  title: "Baharaz - Best Online Shopping in BD | Fastest Delivery",
  description: "Baharaz - Bangladesh's fastest online shopping platform like Daraz, Amazon - Mobiles, Fashion, Electronics - Free Delivery, Cash on Delivery",
  keywords: "online shopping bd, daraz, baharaz, amazon bd, shopping, best shopping bd",
  openGraph: {
    title: "Baharaz - Best Online Shopping in BD",
    description: "Fastest Online Shopping in BD",
    url: "https://baharaz.com",
    siteName: "Baharaz",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_BD",
    type: "website",
  },
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#F85606",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#f5f5f5] antialiased min-h-screen flex flex-col overflow-x-hidden" suppressHydrationWarning>
        {/* ClientShell এর ভিতরে TopBar 1188x26 + Header 1188x75 + Categories আছে */}
        <ClientShell>
          {/* Main Content - Flash Sale আর কাটবে না, z-0 দিয়ে Header থেকে আলাদা */}
          <main className="flex-1 w-full flex justify-center relative z-0">
            <div className="w-full">
              {children}
            </div>
          </main>
        </ClientShell>

        {/* Bottom Padding for Mobile Navbar - যাতে Flash Sale এর শেষ Product কাটা না যায় */}
        <div className="h-[60px] lg:hidden shrink-0" />
      </body>
    </html>
  );
}