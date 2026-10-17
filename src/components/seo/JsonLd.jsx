export function ProductJsonLd({ product }){
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.image,...(product.images||[])],
    "description": product.description || `${product.name} - Premium product from Baharaz Mall`,
    "sku": product.id,
    "mpn": product.id.slice(0,8),
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Baharaz Premium"
    },
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": product.rating || 4.8,
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Baharaz Customer"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 4.8,
      "reviewCount": product.review_count || 100
    },
    "offers": {
      "@type": "Offer",
      "url": `https://baharaz.com/product/${product.id}`,
      "priceCurrency": "BDT",
      "price": product.price,
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Baharaz Mall"
      }
    }
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
}

export function BreadcrumbJsonLd({ product }){
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem","position": 1,"name": "Home","item": "https://baharaz.com"},
      {"@type": "ListItem","position": 2,"name": product.category,"item": `https://baharaz.com/category/${encodeURIComponent(product.category)}`},
      {"@type": "ListItem","position": 3,"name": product.name,"item": `https://baharaz.com/product/${product.id}`}
    ]
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
}

export function OrganizationJsonLd(){
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Baharaz Mall",
    "url": "https://baharaz.com",
    "logo": "https://baharaz.com/logo.png",
    "description": "Premium Luxury Shopping in Bangladesh - Real Products Only",
    "sameAs": ["https://facebook.com/baharaz","https://instagram.com/baharaz"]
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
}