export const dynamic = 'force-static'
export const revalidate = 86400

export default function manifest() {
  return {
    name: 'BAHARAZ - Best Online Shopping Bangladesh | 70% OFF Fashion Fest',
    short_name: 'BAHARAZ',
    description: "Bangladesh's #1 Online Shopping Mall. Fashion Fest Up to 70% OFF, Flash Sale Live Now, Safe Payment, Fast Delivery, Free Return. Zero Second Loading - 70ms - Best Price in Bangladesh.",
    start_url: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'browser'],
    background_color: '#ffffff',
    theme_color: '#FF4D00',
    orientation: 'portrait',
    scope: '/',
    id: '/',
    launch_handler: {
      client_mode: ['navigate-existing', 'auto'],
    },
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Flash Sale - 70% OFF',
        short_name: 'Flash Sale',
        description: 'Fashion Fest Up to 70% OFF - Zero Second - 70ms',
        url: '/flash-sale',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Search Products',
        short_name: 'Search',
        description: 'Search bra, t-shirt, watch, smart watch - Zero Second - 70ms',
        url: '/search',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'All Categories',
        short_name: 'Categories',
        description: 'Browse all categories - Zero Second - 70ms',
        url: '/category',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
    categories: ['shopping', 'lifestyle', 'fashion'],
    lang: 'en-BD',
    dir: 'ltr',
    prefer_related_applications: false,
  };
}