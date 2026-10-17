import { NextResponse } from 'next/server';
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  const { message, history } = await req.json();
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "system", content: "You are Baharaz AI. Reply in Bangla." },...history, { role: "user", content: message }],
    model: "llama-3.1-70b-versatile",
  });
  return NextResponse.json({ reply: chatCompletion.choices[0]?.message?.content });
}