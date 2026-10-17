import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  const body = await request.json();
  if (!body.name || !body.email || !body.channel || !body.audience) return Response.json({ error: "All fields are required." }, { status: 400 });
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { error } = await supabase.from("affiliate_applications").insert([{ name: body.name, email: body.email, channel: body.channel, audience: body.audience, status: "pending" }]);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true }, { status: 201 });
}
