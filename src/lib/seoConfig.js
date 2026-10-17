// Baharaz - Real SEO Config - Exclusive Only You
export const categorySEO = {
  'Women Fashion': {
    title: 'Women Fashion - Premium Saree, Three Piece | Baharaz Mall',
    description: 'Shop Real Premium Jamdani Saree, Aarong Three Piece, Party Wear. 100% Authentic, Free Delivery Over ৳1000. Koti User Special.',
    keywords: 'jamdani saree, three piece, women fashion bd, aarong dress, baharaz',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'
  },
  'Electronics': {
    title: 'Electronics - Earbuds, Smart Watch, Power Bank | Baharaz',
    description: 'Real Original Havit Earbuds, Xiaomi Smart Watch, Baseus Power Bank with Warranty. Best Price in BD, COD Available.',
    keywords: 'havit earbuds, xiaomi watch, electronics bd, power bank, baharaz mall',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'
  },
  'Beauty & Glamour': {
    title: 'Beauty & Glamour - CeraVe, Ordinary, Lakme Original | Baharaz',
    description: '100% Authentic USA Beauty Products - CeraVe Cleanser, The Ordinary Serum, Lakme Kajal. Original Guarantee.',
    keywords: 'cerave bangladesh, ordinary serum, beauty products bd, lakme',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'
  },
  'Home Living': {
    title: 'Home Living - Cookware, Bedsheet, LED | Baharaz Premium',
    description: 'Premium Home Living Products - Non-Stick Cookware, King Size Bedsheet, Philips LED. Premium Quality, Free Delivery.',
    keywords: 'cookware set, bedsheet bd, philips led, home living',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600'
  },
  'default': {
    title: 'Baharaz Mall - Premium Luxury Shopping in Bangladesh | Pro Max',
    description: 'Baharaz Premium Mall - 100% Real Products Only. Women Fashion, Electronics, Beauty, Home Living. Free Delivery Over ৳1000, 14 Days Return.',
    keywords: 'baharaz, online shopping bd, Baharaz alternative, premium shopping',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600'
  }
}

export function getSEOForCategory(category){
  return categorySEO[category] || categorySEO['default']
}

export function getSEOForProduct(product){
  const catSEO = getSEOForCategory(product.category)
  return {
    title: `${product.name} - ৳${product.price} | ${product.brand||'Baharaz'} | ${product.category}`,
    description: `Buy Real ${product.name} at ৳${product.price} (Original ৳${product.original_price||product.price+500}) - ${product.brand||'Premium'} Brand, ${product.rating}⭐ Rating, ${product.sold_count} Sold, Stock ${product.stock}. ${catSEO.description}`,
    keywords: `${product.name}, ${product.brand}, ${product.category}, buy ${product.category.toLowerCase()} bd, baharaz`,
    image: product.image
  }
}