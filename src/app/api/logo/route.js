import { NextResponse } from 'next/server';
export async function POST(req) {
  const { brandName } = await req.json();
  const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
    method: "POST",
    headers: { "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
    body: JSON.stringify({ inputs: `logo for ${brandName}` }),
  });
  const blob = await response.blob();
  const base64 = Buffer.from(await blob.arrayBuffer()).toString('base64');
  return NextResponse.json({ logo: `data:image/png;base64,${base64}` });
}