import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { brandName = "Baharaz", category = "Electronics" } = body;
    let code = "";
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Build HTML for ${brandName} ${category} store`;
      const res = await model.generateContent(prompt);
      code = res.response.text();
    } catch (e) {
      code = `<!DOCTYPE html><html><body><h1>${brandName} - ${category}</h1><p>Delivery 55TK Fixed</p></body></html>`;
    }
    return NextResponse.json({ code, result: code, success: true });
  } catch (err) {
    return NextResponse.json({ code: "<h1>Baharaz</h1>", result: "Demo", success: true }, { status: 200 });
  }
}