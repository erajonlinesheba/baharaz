import nextDynamic from "next/dynamic";
import { Suspense } from "react";

// ✅ ZERO SECOND FAST - Lazy + Prefetch - iOS 26 Glass
const HomeClient = nextDynamic(() => import("@/components/home/HomeClient"), {
  ssr: true,
  loading: () => <HomeSkeleton />,
});

// ✅ MOBILE ONLY LOGIN BAR - Daraz Style - FIXED (ssr:false removed)
const MobileLoginBar = nextDynamic(() => import("@/components/home/MobileLoginBar"), {
  loading: () => null,
});

export const revalidate = 3600;
export const dynamic = 'force-static';
export const fetchCache = 'force-cache';

// ✅ BEST SEO - #1 EVERYWHERE - Google Facebook YouTube - Daraz Formula
export const metadata = {
  title: {
    default: "Baharaz - Bangladesh's Most Loved Online Shopping Mall",
    template: "%s | Baharaz",
  },
  description: "Baharaz - Shop 12M+ Products, Free Delivery over ৳499, 7 Days Return, bKash, Nagad, COD. 64 Districts, 490+ Upazila - Fastest Online Shopping in Bangladesh - Zero Second Fast.",
  keywords: ["baharaz", "baharaz.com", "online shopping bangladesh", "daraz alternative", "ecommerce bangladesh", "rajshahi online shopping", "bangladesh shopping mall", "flash sale", "fastest shopping"],
  authors: [{ name: "Baharaz", url: "https://baharaz.com" }],
  creator: "Baharaz",
  publisher: "Baharaz",
  metadataBase: new URL("https://baharaz.com"),
  alternates: {
    canonical: "https://baharaz.com",
  },
  openGraph: {
    title: "Baharaz - Bangladesh's Most Loved Online Shopping Mall",
    description: "12M+ Products, Free Delivery over ৳499 - Zero Second Fast - Shop Now!",
    url: "https://baharaz.com",
    siteName: "Baharaz",
    type: "website",
    locale: "bn_BD",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Baharaz - Fastest Online Shopping in Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baharaz - Bangladesh's Most Loved Online Shopping Mall",
    description: "12M+ Products, Free Delivery, Best Price in Bangladesh",
    images: ["/og-image.jpg"],
    creator: "@baharaz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F85606",
};

function HomeSkeleton() {
  return (
    <div className="w-full max-w-[1188px] mx-auto min-h-screen bg-[#f5f3f0] md:bg-[#f5f5f7] animate-pulse relative overflow-hidden px-0 md:px-3">
      <div className="w-full py-0 md:py-3 space-y-3 md:space-y-4 relative">
        <div className="h-[180px] md:h-[320px] rounded-none md:rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] relative overflow-hidden bg-white border border-[#eee]">
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-[20px] h-[6px] bg-[#F85606]/30 rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-black/10 rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-black/10 rounded-full"></div>
          </div>
        </div>

        <div className="rounded-none md:rounded-[8px] p-3 md:p-4 relative overflow-hidden bg-white border border-[#e5e5e5]">
          <div className="h-4 w-32 bg-black/10 rounded-full mb-3"></div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-[56px] w-[56px] md:h-[64px] md:w-[64px] rounded-[12px] bg-black/5 border border-[#eee]"></div>
                <div className="h-3 w-12 bg-black/10 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-none md:rounded-[8px] p-3 md:p-4 relative overflow-hidden bg-white border border-[#e5e5e5]">
          <div className="flex justify-between items-center mb-3">
            <div className="h-5 w-32 bg-black/10 rounded-full"></div>
            <div className="h-6 w-20 bg-black/10 rounded-full"></div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[8px] p-2 space-y-2 bg-white border border-[#eee]">
                <div className="h-[100px] bg-black/5 rounded-[6px]" />
                <div className="h-3 bg-black/5 rounded-full w-3/4" />
                <div className="h-4 bg-black/10 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-none md:rounded-[8px] p-3 md:p-4 relative overflow-hidden bg-white border border-[#e5e5e5]">
          <div className="h-5 w-40 bg-black/10 rounded-full mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-[8px] p-2 space-y-2 bg-white border border-[#eee]">
                <div className="h-[120px] bg-black/5 rounded-[6px]" />
                <div className="h-3 bg-black/5 rounded-full" />
                <div className="h-3 bg-black/5 rounded-full w-2/3" />
                <div className="h-4 bg-black/10 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="w-full max-w-[100vw] min-h-screen bg-[#f5f3f0] md:bg-[#f5f5f7] relative overflow-x-hidden">
      <div className="w-full max-w-[1188px] mx-auto px-0 md:px-3 relative">
        <Suspense fallback={<HomeSkeleton />}>
          <HomeClient />
        </Suspense>
      </div>

      {/* ✅ MOBILE ONLY - Beautiful Login Bar - Daraz Style */}
      <div className="md:hidden">
        <Suspense fallback={null}>
          <MobileLoginBar />
        </Suspense>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Baharaz",
            alternateName: "Baharaz Shopping Mall",
            url: "https://baharaz.com",
            description: "Bangladesh's Most Loved Online Shopping Mall - 12M+ Products, Zero Second Fast",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://baharaz.com/search?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
            publisher: {
              "@type": "Organization",
              name: "Baharaz",
              logo: {
                "@type": "ImageObject",
                url: "https://baharaz.com/logo.png",
              },
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Baharaz",
            url: "https://baharaz.com",
            logo: "https://baharaz.com/logo.png",
            sameAs: [
              "https://facebook.com/baharaz",
              "https://instagram.com/baharaz",
              "https://facebook.com/baharaz",
              "https://instagram.com/baharaz",
              "https://youtube.com/baharaz",
              "https://twitter.com/baharaz",
            ],
          }),
        }}
      />
      <style>{`html,body{max-width:100vw; overflow-x:hidden;} @media(max-width:768px){main{padding:0!important;}}`}</style>
    </main>
  );
}