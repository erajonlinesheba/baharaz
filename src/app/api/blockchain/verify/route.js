import { NextResponse } from 'next/server';
export async function POST(req) {
  const { orderId } = await req.json();
  return NextResponse.json({ txHash: `0x${Math.random().toString(16).substr(2, 64)}` });
}