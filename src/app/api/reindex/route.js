import { NextResponse } from 'next/server'
import { syncProductsToAlgolia } from '@/lib/algolia'

export async function POST() {
  try {
    // 24 mock products - Supabase লাগবে না
    const productsToSync = Array.from({ length: 24 }, (_, i) => ({
      id: i + 1,
      objectID: `product_${i + 1}`,
      name: `Baharaz ${['Panjabi','Shirt','T-Shirt','Pants'][i%4]} ${i+1}`,
      title: `Baharaz ${['Panjabi','Shirt','T-Shirt','Pants'][i%4]} ${i+1}`,
      description: `Premium quality ${['Panjabi','Shirt','T-Shirt','Pants'][i%4]} from Baharaz`,
      price: Math.floor(Math.random() * 5000) + 500,
      category: ['Panjabi', 'Shirt', 'T-Shirt', 'Pants'][i % 4],
      brand: 'Baharaz',
      image: '/placeholder.png',
      in_stock: true,
    }))

    const result = await syncProductsToAlgolia(productsToSync)

    return NextResponse.json({ 
      success: true, 
      message: `Synced ${productsToSync.length} products to Algolia!`, 
      count: productsToSync.length, 
      result 
    })
  } catch (err) {
    console.error('Reindex error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function GET() {
  return POST()
}
