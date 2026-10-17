export function formatPrice(price) {
  if (typeof price !== 'number') {
    price = Number(price) || 0;
  }

  // For Bangladesh - ৳ Format
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('BDT', '৳');
}

export function formatPriceWithDecimals(price) {
  if (typeof price !== 'number') {
    price = Number(price) || 0;
  }

  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price).replace('BDT', '৳');
}

export function calculateDiscount(originalPrice, salePrice) {
  if (!originalPrice || !salePrice) return 0;
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
}