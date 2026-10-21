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
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#F85606",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#f5f5f5] antialiased overflow-x-hidden overflow-y-auto" suppressHydrationWarning>
        <ClientShell>
          {/* MOBILE - Scroll Fix */}
          <div className="block md:hidden w-full bg-[#f5f5f5]">
            <main className="w-full overflow-visible">
              {children}
            </main>
          </div>
          {/* WEB */}
          <div className="hidden md:block w-full bg-[#f5f5f5]">
            <main className="w-full max-w-[1200px] mx-auto relative z-0 overflow-visible">
              {children}
            </main>
          </div>
        </ClientShell>
      </body>
    </html>
  );
}