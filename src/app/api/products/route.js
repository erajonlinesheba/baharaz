import { NextResponse } from 'next/server'
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cacheGet, cacheSet } from "@/lib/redis";

// Real Baharaz Style Mock Data - Fallback for Dev
const mockProducts = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: i % 2 === 0
    ? "Premium Cotton Saree For Women - Latest Design - Baharaz Choice"
    : "Havit H2232D Wired Headphone With Mic - Deep Bass",
  price: 399 + i * 45,
  oldPrice: 799 + i * 80,
  old: 799 + i * 80,
  discount: 20 + (i % 35),
  reviews: 50 + i * 7,
  rating: 4.5,
  img: `https://picsum.photos/seed/baharaz${i}/300/300`,
  image: `https://picsum.photos/seed/baharaz${i}/300/300`,
  stock: 100,
  is_published: true,
}))

function getSupabase() {
  try {
    const cookieStore = cookies();
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: () => {
            try { return cookieStore.getAll(); } catch { return []; }
          },
          setAll: () => {},
        },
      }
    );
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    // 1. Redis Cache Check - Super Fast for Crore Users
    const cached = await cacheGet("products:all");
    if (cached) {
      console.log("✅ Products from Redis Cache");
      return NextResponse.json(cached);
    }

    // 2. Try to get from Supabase Real Database
    const supabase = await getSupabase();
    
    if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // 3. Save to Redis for 1 Hour
        await cacheSet("products:all", data, 3600);
        return NextResponse.json(data);
      }
    }

    // 4. Fallback to Mock Data if DB empty or not configured
    console.log("⚠️ Using Mock Products");
    await cacheSet("products:all", mockProducts, 600); // Cache Mock for 10 mins
    return NextResponse.json(mockProducts);

  } catch (err) {
    console.error("Products GET Error:", err.message);
    return NextResponse.json(mockProducts);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const supabase = await getSupabase();

    if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { data, error } = await supabase
        .from("products")
        .insert({
          title: body.title,
          price: body.price,
          images: body.images || [body.image],
          stock: body.stock || 10,
          seller_id: body.seller_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Clear Cache when new product added
      const { cacheDelete } = await import("@/lib/redis");
      await cacheDelete("products:all");

      return NextResponse.json(data, { status: 201 });
    }

    // Mock Create
    const newProduct = {
      id: mockProducts.length + 1,
      ...body,
      created_at: new Date().toISOString(),
    };
    
    return NextResponse.json({ message: "Product Created - Mock", product: newProduct }, { status: 201 });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}