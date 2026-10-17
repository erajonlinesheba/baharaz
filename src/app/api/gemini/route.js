import { NextResponse } from "next/server"

export async function POST(req){
  try{
    const body = await req.json()
    const keyword = body.prompt || body.keyword
    if(!keyword) return NextResponse.json({ error: "Keyword missing" }, { status: 400 })

    const apiKey = process.env.GROQ_API_KEY
    let aiText = null

    const promptText = `
Product: "${keyword}"
You are Baharaz AI.
Write product description in TWO paragraphs.
First paragraph: Bangla (4 lines, attractive selling text about ${keyword})
Second paragraph: English (4 lines, same meaning as Bangla)
Separate two paragraphs with double new line \\n\\n
DO NOT write "Bangla:" or "English:" labels. Just give 2 paragraphs.
Return ONLY valid JSON:
{
  "title": "Attractive title for ${keyword} (max 70 chars)",
  "description": "First paragraph Bangla...\\n\\nSecond paragraph English..."
}
`

    if(apiKey){
      try{
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{
          method: "POST",
          headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [
              { role: "system", content: "You are Baharaz AI. Return ONLY valid JSON. First paragraph Bangla, second English, no labels." },
              { role: "user", content: promptText }
            ],
            temperature: 0.8,
            max_tokens: 1500,
            response_format: { type: "json_object" }
          })
        })
        const data = await res.json()
        if(res.ok && data.choices?.[0]?.message?.content) aiText = data.choices[0].message.content
      }catch{}
    }

    if(!aiText){
      try{
        const url = `https://text.pollinations.ai/${encodeURIComponent(promptText)}?model=openai&json=true`
        const res = await fetch(url, { cache: "no-store" })
        const txt = await res.text()
        const m = txt.match(/\{[\s\S]*\}/)
        if(m){
          const j = JSON.parse(m[0])
          if(j.title && j.description) aiText = JSON.stringify(j)
        }
      }catch{}
    }

    if(!aiText) return NextResponse.json({ error: "AI failed" }, { status: 500 })
    return NextResponse.json({ text: aiText })

  }catch(e){
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}