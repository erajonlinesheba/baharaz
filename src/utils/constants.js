export const APP_NAME = 'Baharaz';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://baharaz.com';
export const CURRENCY = '৳';
export const CURRENCY_CODE = 'BDT';

export const PRODUCT_PER_PAGE = 20;
export const MAX_CART_ITEMS = 10;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const PAYMENT_METHODS = {
  COD: 'cod',
  BKASH: 'bkash',
  NAGAD: 'nagad',
  CARD: 'card',
};

export const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
];