import { supabase } from './supabase'

const demoCategories = [
  { id: '1', name: "Women's Fashion", slug: 'womens-fashion', sub: [] },
  { id: '2', name: "Men's Fashion", slug: 'mens-fashion', sub: [] },
  { id: '3', name: 'Baby Products', slug: 'baby', sub: [] }
]

export const getCategoryTree = async () => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!url || url.includes('placeholder')) {
      return demoCategories
    }
    const { data, error } = await supabase.from('categories').select('*').limit(20)
    if (error ||!data || data.length === 0) {
      return demoCategories
    }
    return data
  } catch (e) {
    return demoCategories
  }
}

export const getDemoCategories = () => demoCategories