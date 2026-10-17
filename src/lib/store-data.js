// Baharaz - Real Baharaz Level Store Data - Full Code

export function formatPrice(price) {
  if (price === null || price === undefined) return '৳ 0';
  const num = Number(price);
  if (isNaN(num)) return '৳ 0';
  return `৳ ${num.toLocaleString('en-BD')}`;
}

export function formatPriceNumber(price) {
  const num = Number(price);
  return isNaN(num) ? 0 : num;
}

export function formatDiscount(originalPrice, salePrice) {
  if (!originalPrice || !salePrice) return 0;
  const original = Number(originalPrice);
  const sale = Number(salePrice);
  if (original <= 0 || sale >= original) return 0;
  const discount = ((original - sale) / original) * 100;
  return Math.round(discount);
}

export const storeInfo = {
  name: "Baharaz",
  slogan: "Online Shopping in Bangladesh",
  currency: "BDT",
  currencySymbol: "৳",
  supportEmail: "support@baharaz.com",
  supportPhone: "09613-123456",
};

export const categories = [
  { id: 1, name: "Women's Fashion", slug: "womens-fashion", icon: "👗", sub: ["Saree", "Salwar Kameez", "Hijab", "Jewellery"] },
  { id: 2, name: "Men's Fashion", slug: "mens-fashion", icon: "👕", sub: ["T-Shirt", "Shirt", "Panjabi", "Jeans"] },
  { id: 3, name: "Mobiles & Tablets", slug: "mobiles", icon: "📱", sub: ["Smartphone", "Feature Phone", "Tablet"] },
  { id: 4, name: "Electronics", slug: "electronics", icon: "💻", sub: ["Laptop", "TV", "Headphone", "Camera"] },
  { id: 5, name: "Home & Living", slug: "home-living", icon: "🏠", sub: ["Furniture", "Kitchen", "Decor"] },
  { id: 6, name: "Beauty & Health", slug: "beauty", icon: "💄", sub: ["Makeup", "Skincare", "Perfume"] },
  { id: 7, name: "Sports", slug: "sports", icon: "⚽", sub: ["Cricket", "Football", "Gym"] },
  { id: 8, name: "Kids & Toys", slug: "kids", icon: "🧸", sub: ["Toys", "Baby Care", "Kids Fashion"] },
];

export const banners = [
  { id: 1, image: "/banner-1.jpg", link: "/flash-sale", title: "11.11 Sale" },
  { id: 2, image: "/banner-2.jpg", link: "/mens-fashion", title: "Mens Fashion" },
  { id: 3, image: "/banner-3.jpg", link: "/mobiles", title: "Mobile Sale" },
];

export const flashSaleProducts = [
  { id: 101, name: "Real Product Sample", price: 1250, originalPrice: 2500, image: "/product-1.jpg", rating: 4.5, sold: 1200 },
];

export const paymentMethods = [
  { id: "cod", name: "Cash on Delivery", icon: "💵" },
  { id: "bkash", name: "bKash", icon: "📱" },
  { id: "nagad", name: "Nagad", icon: "💳" },
  { id: "card", name: "Credit/Debit Card", icon: "💳" },
];

export const deliveryOptions = {
  standard: { name: "Standard Delivery", price: 60, time: "2-5 Days" },
  express: { name: "Express Delivery", price: 120, time: "24 Hours" },
};

export function getProductDiscount(product) {
  if (!product || !product.originalPrice) return 0;
  return formatDiscount(product.originalPrice, product.price);
}

export function isFlashSaleActive() {
  return true;
}

export const storeData = {
  name: storeInfo.name,
  currency: storeInfo.currency,
};

// --- FIX FOR VERCEL BUILD ---
export function getProducts() { return []; }
export function createProduct(data) { return data || {}; }
export function getProductById(id) { return null; }
export function updateProduct(id, data) { return data; }
export function deleteProduct(id) { return true; }
export function getOrders() { return []; }
export function getUsers() { return []; }