import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { title } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `tmi ekjon product expert. Product er nam: "${title}". Sudhu JSON diba. Key gula: description, category, brand, price, compare_at_price, stock. Price BDT te. Description Bangla te 2 line likhba.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const json = JSON.parse(text.replace(/```json/g, '').replace(/```/g, ''));
    return NextResponse.json({ product: json });
  } catch (e) {
    return NextResponse.json({ error: "AI kaj kortese na: " + e.message }, { status: 500 })
  }
}