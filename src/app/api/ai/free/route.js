import { NextResponse } from 'next/server';
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  const { prompt, type } = await req.json();
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-70b-versatile",
  });
  return NextResponse.json({ result: chatCompletion.choices[0]?.message?.content });
}