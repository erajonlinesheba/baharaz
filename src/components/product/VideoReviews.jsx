'use client'
export default function VideoReviews({ product }) {
  const videos = product?.video_reviews || [
    { id: 1, url: 'https://www.w3schools.com/html/mov_bbb.mp4', user: 'Rafi', rating: 5 },
    { id: 2, url: 'https://www.w3schools.com/html/movie.mp4', user: 'Sakib', rating: 4 }
  ]

  return (
    <div className="bg-white p-3 mt-3 rounded">
      <h2 className="font-bold text-[14px] mb-3">🎥 Short Video Reviews - Reels er moto</h2>
      <div className="flex gap-3 overflow-x-auto">
        {videos.map(v => (
          <div key={v.id} className="min-w-[160px] bg-black rounded overflow-hidden">
            <video src={v.url} controls className="w-[160px] h-[280px] object-cover" />
            <div className="p-1 text-white text-[11px]">{v.user} ⭐{v.rating}</div>
          </div>
        ))}
      </div>
    </div>
  )
}