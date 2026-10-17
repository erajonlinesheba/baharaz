import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function getSupabase(request) {
  const cookieStore = await cookies();
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
      global: token? { headers: { Authorization: `Bearer ${token}` } } : undefined,
    }
  );
}

export async function GET(request) {
  const supabase = await getSupabase(request);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Authentication required." }, { status: 401 });

  // FIXED: customer_id -> user_id (তোমার Table এ user_id আছে)
  const { data, error } = await supabase
  .from("orders")
  .select("*, order_items(*)")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data || []);
}

export async function POST(request) {
  const supabase = await getSupabase(request);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Please sign in before placing an order." }, { status: 401 });

  const body = await request.json();
  const items = Array.isArray(body.items)? body.items : [];
  if (!items.length) return Response.json({ error: "Cart is empty." }, { status: 400 });
  if (!body.customer_name ||!body.customer_phone ||!body.shipping_address) {
    return Response.json({ error: "Name, phone and shipping address are required." }, { status: 400 });
  }

  const ids = items.map((item) => item.product_id).filter(Boolean);
  const { data: products, error: productError } = await supabase
  .from("products")
  .select("id,name,price,stock,seller_id,status,is_published")
  .in("id", ids);

  if (productError) return Response.json({ error: productError.message }, { status: 500 });

  const productMap = new Map((products || []).map((product) => [String(product.id), product]));
  const orderItems = [];

  for (const item of items) {
    const product = productMap.get(String(item.product_id));
    const quantity = Number(item.quantity);
    if (!product || (product.status && product.status!== "approved") || product.is_published === false) {
      return Response.json({ error: "One or more products are unavailable." }, { status: 409 });
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) {
      return Response.json({ error: `${product.name} does not have enough stock.` }, { status: 409 });
    }
    orderItems.push({ product_id: product.id, quantity, unit_price: Number(product.price) });
  }

  const total = orderItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const sellerIds = [...new Set((products || []).map((product) => product.seller_id).filter(Boolean))];

  // FIXED: customer_id -> user_id
  const { data: order, error: orderError } = await supabase
  .from("orders")
  .insert({
      user_id: user.id,
      seller_id: sellerIds.length === 1? sellerIds[0] : null,
      customer_name: String(body.customer_name).trim(),
      customer_phone: String(body.customer_phone).trim(),
      shipping_address: body.shipping_address,
      total,
      payment_method: body.payment_method || "cod",
      payment_status: "pending",
      status: "pending",
    })
  .select()
  .single();

  if (orderError) return Response.json({ error: orderError.message }, { status: 500 });

  const { error: itemError } = await supabase
  .from("order_items")
  .insert(orderItems.map((item) => ({...item, order_id: order.id })));

  if (itemError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return Response.json({ error: itemError.message }, { status: 500 });
  }

  return Response.json({ order: {...order, order_items: orderItems } }, { status: 201 });
}