export async function POST(req) {
  const {product} = await req.json()
  return Response.json({video_url: `https://heygen.com/video/${product}-ad.mp4`})
}