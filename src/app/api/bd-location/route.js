// src/app/api/bd-location/route.js - Real 64 District BD
import { isBangladeshLocation, parseBDAddress, getDeliveryCharge } from '@/lib/bdLocation'

export async function POST(req) {
  try {
    const { lat, lng, sellerDivision } = await req.json()
    if (!lat || !lng) return Response.json({ error: 'no coords' }, { status: 400 })
    
    let data = null
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { 'User-Agent': 'Baharaz-BD-Shop/1.0' }
      })
      data = await res.json()
    } catch {}

    // যদি বাংলাদেশ না হয় (Vietnam Server) - তখনো বাংলাদেশের Real Address দেখাবে, Rajshahi Force করবে না!
    if (!data || !data.address || !isBangladeshLocation(data.address, data.display_name)) {
      // Outside BD হলে - Dhaka Default (Business Safe + BD Only)
      return Response.json({
        road: '', upazila: 'Savar', district: 'Dhaka', division: 'Dhaka',
        city: 'Dhaka', postcode: '1212', charge: 60, lat, lng,
        text: `Dhaka, Dhaka - Real BD Only`, isReal: false, source: 'bd_only_default'
      })
    }

    // ভিতরে Bangladesh হলে - 100% Real District
    const parsed = parseBDAddress(data.address)
    const charge = getDeliveryCharge(parsed.division, parsed.district, sellerDivision || 'Dhaka')

    return Response.json({
      ...parsed, charge, lat, lng,
      text: `${parsed.road ? parsed.road + ', ' : ''}${parsed.upazila}, ${parsed.district}, ${parsed.division} ${parsed.postcode}`,
      isReal: true, source: 'real_bd_64_district', display_name: data.display_name
    })
  } catch (e) {
    return Response.json({
      road: '', upazila: 'Sadar', district: 'Dhaka', division: 'Dhaka', city: 'Dhaka', postcode: '1000',
      charge: 60, text: 'Dhaka, Bangladesh', isReal: false
    })
  }
}
export async function GET(){ return Response.json({ status: 'Real BD 64 District API Running' }) }