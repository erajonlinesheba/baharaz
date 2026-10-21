// Google #1 Rank SEO Layout - Server Component
// File: src/app/product/[slug]/layout.jsx
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) return null
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  })
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug || ''
  const decodedSlug = decodeURIComponent(slug)
  let product = null

  try {
    const supabase = getSupabase()
    if (supabase && decodedSlug) {
      // Safe Query: slug first, then id
      const { data: bySlug } = await supabase
        .from('products')
        .select('id, title, name, slug, price, original_price, images, image, image_url, description, category, brand')
        .eq('slug', decodedSlug)
        .maybeSingle()
      
      if (bySlug) {
        product = bySlug
      } else {
        const isUUID = /^[0-9a-f-]{36}$/i.test(decodedSlug)
        if (isUUID) {
          const { data: byId } = await supabase
            .from('products')
            .select('id, title, name, slug, price, original_price, images, image, image_url, description, category, brand')
            .eq('id', decodedSlug)
            .maybeSingle()
          if (byId) product = byId
        }
      }
    }
  } catch (e) {
    console.log('SEO fetch error:', e?.message)
  }

  if (!product) {
    const cleanSlug = decodedSlug.replace(/-/g, ' ')
    return {
      title: `${cleanSlug} - Baharaz | Best Price in Bangladesh`,
      description: `Buy ${cleanSlug} at best price in Bangladesh. Cash on delivery all over Bangladesh. Baharaz.com`,
      alternates: { canonical: `https://baharaz.com/product/${encodeURIComponent(decodedSlug)}` },
    }
  }

  const title = product.title || product.name || decodedSlug
  const price = Number(product.price || product.original_price || 0)
  const finalSlug = product.slug || decodedSlug
  
  const image = (() => {
    try {
      if (Array.isArray(product.images) && product.images.length > 0) {
        const first = product.images[0]
        return typeof first === 'string' ? first : first?.url || product.image_url
      }
      if (typeof product.images === 'string') {
        const parsed = JSON.parse(product.images)
        if (Array.isArray(parsed) && parsed[0]) return parsed[0]
      }
      return product.image_url || product.image || 'https://baharaz.com/og-image.jpg'
    } catch { 
      return product.image_url || product.image || 'https://baharaz.com/og-image.jpg' 
    }
  })()

  const desc = product.description 
    ? product.description.replace(/<[^>]*>/g, '').trim().substring(0, 155)
    : `${title} - Buy now at ৳${price} with cash on delivery. Best deal at Baharaz.`

  return {
    title: `${title} - ৳${price} | Baharaz.com`,
    description: desc,
    keywords: `${title}, ${product.brand || ''}, ${product.category || ''}, baharaz, buy online bangladesh, best price in bangladesh`,
    openGraph: {
      title: `${title} | Baharaz - Best Price in Bangladesh`,
      description: desc,
      images: [{ url: image, width: 800, height: 800, alt: title }],
      type: 'website',
      url: `https://baharaz.com/product/${encodeURIComponent(finalSlug)}`,
      siteName: 'Baharaz',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: desc,
      images: [image],
    },
    alternates: {
      canonical: `https://baharaz.com/product/${encodeURIComponent(finalSlug)}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    },
  }
}

export default function ProductLayout({ children }) {
  return <>{children}</>
}