import { NextResponse } from 'next/server';
export async function POST(req) {
  const { prompt } = await req.json();
  return NextResponse.json({ videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" });
}