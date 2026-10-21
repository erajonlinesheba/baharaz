import nextDynamic from "next/dynamic";
import { Suspense } from "react";

// ✅ ZERO SECOND FAST - Lazy Load + Prefetch - নাম Change করলাম nextDynamic - iOS 26 Glass
const HomeClient = nextDynamic(() => import("@/components/home/HomeClient"), {
  ssr: true,
  loading: () => <HomeSkeleton />,
});

// ✅ SEO - Google #1 - Unlimited Product
export const metadata = {
  title: "Baharaz - Bangladesh's Most Loved Online Shopping Mall | 12M+ Products",
  description: "Shop on Baharaz - 64 Districts, 490+ Upazila, 12M+ Products, Free Delivery over ৳499, 7 Days Return, bKash, Nagad, COD. Best Price in Bangladesh - Zero Second Fast.",
  keywords: ["baharaz", "online shopping", "bangladesh", "daraz", "ecommerce", "flash sale", "fastest shopping", "unlimited products"],
  authors: [{ name: "Baharaz" }],
  creator: "Baharaz",
  publisher: "Baharaz",
  metadataBase: new URL("https://baharaz.com"),
  alternates: {
    canonical: "https://baharaz.com",
  },
  openGraph: {
    title: "Baharaz - Bangladesh's Most Loved Online Shopping Mall",
    description: "12M+ Products, Free Delivery, Best Price - Zero Second Fast Loading",
    url: "https://baharaz.com",
    siteName: "Baharaz",
    type: "website",
    locale: "en_BD",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Baharaz - Fastest Online Shopping",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baharaz - Bangladesh's Most Loved Online Shopping Mall",
    description: "12M+ Products, Free Delivery, Best Price",
    images: ["/og-image.jpg"],
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

// ✅ Premium Skeleton - iOS 26 Liquid Glass - তোমার MobileHeader এর মতো - Zero Second UX
function HomeSkeleton() {
  return (
    <div className="w-full min-h-screen bg-[#f5f3f0] md:bg-[#f5f5f7] animate-pulse relative overflow-hidden">
      {/* iOS 26 Background Glow - Mobile Only - তোমার MobileHeader এর মতো */}
      <div className="absolute top-0 left-0 w-full h-[400px] pointer-events-none overflow-hidden md:hidden">
        <div className="absolute -top-[60px] -left-[60px] w-[280px] h-[280px] bg-gradient-to-br from-[#F85606]/12 via-[#FF9500]/8 to-transparent rounded-full blur-[35px]"></div>
        <div className="absolute -top-[40px] -right-[60px] w-[260px] h-[260px] bg-gradient-to-bl from-[#AF52DE]/10 via-[#5856D6]/6 to-transparent rounded-full blur-[35px]"></div>
      </div>

      <div className="max-w-[1188px] mx-auto px-0 md:px-4 py-0 md:py-4 space-y-3 md:space-y-4 relative">
        {/* Banner Skeleton - iOS 26 Glass */}
        <div className="h-[180px] md:h-[320px] rounded-none md:rounded-[20px] shadow-sm relative overflow-hidden"
             style={{
               background: 'rgba(255,255,255,0.75)',
               backdropFilter: 'blur(20px) saturate(180%)',
               WebkitBackdropFilter: 'blur(20px) saturate(180%)',
               border: '0.5px solid rgba(255,255,255,0.8)',
               boxShadow: '0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)'
             }}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/[0.04] via-white/20 to-black/[0.04] animate-[shimmer_1.5s_infinite]"></div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-[20px] h-[6px] bg-[#F85606]/30 rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-black/10 rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-black/10 rounded-full"></div>
          </div>
        </div>

        {/* Categories Skeleton - iOS 26 Glass */}
        <div className="rounded-none md:rounded-[20px] p-3 md:p-4 relative overflow-hidden"
             style={{
               background: 'rgba(255,255,255,0.75)',
               backdropFilter: 'blur(20px) saturate(180%)',
               WebkitBackdropFilter: 'blur(20px) saturate(180%)',
               border: '0.5px solid rgba(255,255,255,0.8)',
               boxShadow: '0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)'
             }}>
          <div className="absolute top-0 inset-x-0 h-[0.5px] bg-gradient-to-r from-transparent via-black/[0.04] to-transparent"></div>
          <div className="h-4 w-32 bg-black/10 rounded-full mb-3"></div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-[56px] w-[56px] md:h-[64px] md:w-[64px] rounded-[20px] relative overflow-hidden"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,243,240,0.8))',
                       border: '0.5px solid rgba(255,255,255,0.8)',
                       boxShadow: '0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)'
                     }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-[20px]"></div>
                </div>
                <div className="h-3 w-12 bg-black/10 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Flash Sale Skeleton - iOS 26 Glass */}
        <div className="rounded-none md:rounded-[20px] p-3 md:p-4 relative overflow-hidden"
             style={{
               background: 'rgba(255,255,255,0.75)',
               backdropFilter: 'blur(20px) saturate(180%)',
               WebkitBackdropFilter: 'blur(20px) saturate(180%)',
               border: '0.5px solid rgba(255,255,255,0.8)',
               boxShadow: '0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)'
             }}>
          <div className="absolute top-0 inset-x-0 h-[0.5px] bg-gradient-to-r from-transparent via-[#F85606]/20 to-transparent"></div>
          <div className="flex justify-between items-center mb-3">
            <div className="h-5 w-32 bg-black/10 rounded-full"></div>
            <div className="h-6 w-20 bg-black/10 rounded-full"></div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[16px] p-2 space-y-2 relative overflow-hidden"
                   style={{
                     background: 'rgba(255,255,255,0.9)',
                     border: '0.5px solid rgba(0,0,0,0.04)',
                     boxShadow: '0 8px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)'
                   }}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent rounded-[16px]"></div>
                <div className="h-[100px] bg-black/5 rounded-[12px] relative" />
                <div className="h-3 bg-black/5 rounded-full w-3/4" />
                <div className="h-4 bg-black/10 rounded-full w-1/2" />
                <div className="absolute bottom-2 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#F85606]/10 to-transparent"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Just For You Skeleton - iOS 26 Glass */}
        <div className="rounded-none md:rounded-[20px] p-3 md:p-4 relative overflow-hidden"
             style={{
               background: 'rgba(255,255,255,0.75)',
               backdropFilter: 'blur(20px) saturate(180%)',
               WebkitBackdropFilter: 'blur(20px) saturate(180%)',
               border: '0.5px solid rgba(255,255,255,0.8)',
               boxShadow: '0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)'
             }}>
          <div className="absolute top-0 inset-x-0 h-[0.5px] bg-gradient-to-r from-transparent via-black/[0.04] to-transparent"></div>
          <div className="h-5 w-40 bg-black/10 rounded-full mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-[20px] p-2 space-y-2 relative overflow-hidden"
                   style={{
                     background: 'rgba(255,255,255,0.9)',
                     border: '0.5px solid rgba(0,0,0,0.04)',
                     boxShadow: '0 8px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)'
                   }}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent rounded-[20px]"></div>
                <div className="h-[120px] bg-black/5 rounded-[16px] relative" />
                <div className="h-3 bg-black/5 rounded-full" />
                <div className="h-3 bg-black/5 rounded-full w-2/3" />
                <div className="h-4 bg-black/10 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}

export default function Page() {
  return (
    <main className="w-full min-h-screen bg-[#f5f3f0] md:bg-[#f5f5f7] relative">
      {/* iOS 26 Background Glow - Mobile Only - তোমার MobileHeader এর মতো */}
      <div className="absolute top-0 left-0 w-full h-[500px] pointer-events-none overflow-hidden md:hidden">
        <div className="absolute -top-[60px] -left-[60px] w-[280px] h-[280px] bg-gradient-to-br from-[#F85606]/12 via-[#FF9500]/8 to-transparent rounded-full blur-[35px]"></div>
        <div className="absolute -top-[40px] -right-[60px] w-[260px] h-[260px] bg-gradient-to-bl from-[#AF52DE]/10 via-[#5856D6]/6 to-transparent rounded-full blur-[35px]"></div>
      </div>

      <Suspense fallback={<HomeSkeleton />}>
        <HomeClient />
      </Suspense>

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
              "https://youtube.com/baharaz",
              "https://twitter.com/baharaz",
            ],
          }),
        }}
      />
    </main>
  );
}

// ✅ For Google - ISR - Zero Second Fast + Fresh
export const revalidate = 60;

// ✅ Force Static for Maximum Speed - Amazon Style - এখন Error হবে না
export const dynamic = "force-static";
export const fetchCache = "force-cache";