export const addToCart = (product) => {
  if (typeof window === 'undefined') return
  const cart = JSON.parse(localStorage.getItem('baharaz_cart') || '[]')
  const exist = cart.find((p) => p.id === product.id)
  if (exist) {
    exist.qty = (exist.qty || 1) + 1
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0],
      qty: 1
    })
  }
  localStorage.setItem('baharaz_cart', JSON.stringify(cart))
  window.dispatchEvent(new Event('cart_update'))
}

export const getCart = () => {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem('baharaz_cart') || '[]')
}