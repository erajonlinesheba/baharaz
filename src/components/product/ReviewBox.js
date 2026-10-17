"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ReviewBox({ productId }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [user, setUser] = useState(null)
  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    // Login করা User Check
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    
    // Auth Change শুনবে
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user?? null)
    })

    fetchReviews()

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [productId])

  const fetchReviews = async () => {
    const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })
    
    if (data) {
      setReviews(data)
      if(data.length > 0){
        const total = data.reduce((sum, r) => sum + r.rating, 0)
        setAvgRating((total / data.length).toFixed(1))
      } else {
        setAvgRating(0)
      }
    }
  }

  // Image Upload Function
  const uploadImage = async () => {
    if (!image) return null
    setUploading(true)
    const fileExt = image.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
    
    const { data, error } = await supabase.storage
    .from('review-images')
    .upload(fileName, image)

    if(error) {
      setUploading(false)
      alert(error.message)
      return null
    }
    
    const { data: urlData } = supabase.storage.from('review-images').getPublicUrl(fileName)
    setUploading(false)
    return urlData.publicUrl
  }

  const handleSubmit = async () => {
    if(!user) return alert("Review দিতে Login করুন")
    if(rating === 0 || comment === "") return alert("Rating এবং Comment দেন")
    
    const imageUrl = await uploadImage()

    const { error } = await supabase.from('reviews').insert([{ 
        product_id: productId, 
        user_name: user.user_metadata.full_name || user.email,
        user_avatar: user.user_metadata.avatar_url,
        rating: rating, 
        comment: comment,
        image_url: imageUrl
      }])

    if(error) return alert(error.message)

    alert("Review Submitted!")
    setRating(0)
    setComment("")
    setImage(null)
    fetchReviews()
  }

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="mt-10 border-t pt-6">
      {/* Header with Avg Rating */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-lg">
              <span className="text-2xl font-bold text-orange-600">{avgRating}</span>
              <span>⭐</span>
              <span className="text-sm text-gray-600">({reviews.length} Reviews)</span>
            </div>
          )}
        </div>
        {user? 
          <button onClick={handleLogout} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Logout</button> :
          <button onClick={handleLogin} className="text-sm bg-blue-500 text-white px-3 py-1 rounded">Login with Google</button>
        }
      </div>
      
      {/* Reviews List */}
      <div className="space-y-4 mb-6">
        {reviews.length === 0? <p>এখনো কোনো Review নাই</p> : reviews.map((r, i) => (
          <div key={i} className="border-b pb-3 flex gap-3">
            <img src={r.user_avatar || `https://ui-avatars.com/api/?name=${r.user_name}`} className="w-10 h-10 rounded-full"/>
            <div className="flex-1">
              <p className="font-semibold">{r.user_name} - <span className="text-orange-500">{"⭐".repeat(r.rating)}</span></p>
              <p className="text-gray-600 mt-1">{r.comment}</p>
              {r.image_url && <img src={r.image_url} className="w-32 h-32 rounded mt-2 object-cover border"/>}
            </div>
          </div>
        ))}
      </div>

      {/* Review Form */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Write a Review</h3>
        
        {!user? (
          <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">Review দিতে Login করুন</button>
        ) : (
          <>
            <div className="flex gap-2 mb-3">
              {[1,2,3,4,5].map((i) => (
                <button key={i} type="button" onClick={() => setRating(i)} className="text-3xl">
                  {i <= rating? "⭐" : "☆"}
                </button>
              ))}
            </div>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="আপনার অভিজ্ঞতা লিখুন..."
              className="w-full border rounded p-2 mb-3"
              rows={3}
            />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="mb-3 block"/>
            <button 
              onClick={handleSubmit}
              disabled={uploading}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
            >
              {uploading? "Uploading..." : "Submit Review"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}