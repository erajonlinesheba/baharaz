import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const { product, budget } = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Create Facebook + TikTok ad campaign for ${product} with ${budget} BDT budget. Give: 3 Ad copies, Target audience, Interest, Daily budget, Expected result in Bangla.`;
  const result = await model.generateContent(prompt);

  return NextResponse.json({ result: result.response.text() });
}