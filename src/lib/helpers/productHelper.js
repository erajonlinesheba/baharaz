import { supabase } from './supabase'

export const getFlashSaleProducts = async () => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('is_flash_sale', true).limit(8)
    if (error) {
      const { data: all } = await supabase.from('products').select('*').limit(8)
      return all || []
    }
    return data || []
  } catch {
    return []
  }
}

export const getJustForYouProducts = async (limit = 18) => {
  try {
    const { data, error } = await supabase.from('products').select('*').order('rating', { ascending: false }).limit(limit)
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

export const getAllProducts = async () => {
  const { data } = await supabase.from('products').select('*').limit(50)
  return data || []
}