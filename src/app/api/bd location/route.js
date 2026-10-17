// src/app/api/location/route.js - Real BD Location API - Exclusive
import { isBangladeshLocation, parseBDAddress, getDeliveryCharge } from '@/lib/bdLocation'

export async function POST(req) {
  try {
    const { lat, lng, sellerDivision } = await req.json()
    if (!lat ||!lng) return Response.json({ error: 'no coords' }, { status: 400 })

    // 2 ta provider try - OpenStreetMap + BigDataCloud
    let data = null
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { 'User-Agent': 'Baharaz-BD-Shop' }
      })
      data = await res.json()
    } catch {}

    // Check if BD or Vietnam
    if (!data ||!isBangladeshLocation(data.address, data.display_name)) {
      // Vietnam / outside BD = Force Rajshahi - Real location - Business loss protected
      return Response.json({
        road: 'Natore Road',
        upazila: 'Puthia',
        district: 'Rajshahi',
        division: 'Rajshahi',
        city: 'Rajshahi',
        postcode: '6203',
        charge: 60,
        lat, lng,
        text: `Puthia, Rajshahi, Rajshahi 6203`,
        isReal: false,
        source: 'forced_bd_default'
      })
    }

    const parsed = parseBDAddress(data.address)
    const charge = getDeliveryCharge(parsed.division, parsed.district, sellerDivision)

    return Response.json({
     ...parsed,
      charge,
      lat, lng,
      text: `${parsed.road? parsed.road+', ':''}${parsed.upazila? parsed.upazila+', ':''}${parsed.district}, ${parsed.division} ${parsed.postcode}`,
      isReal: true,
      source: 'nominatim_bd'
    })
  } catch (e) {
    return Response.json({
      road: '', upazila: 'Puthia', district: 'Rajshahi', division: 'Rajshahi', city: 'Rajshahi', postcode: '6203',
      charge: 60, text: 'Puthia, Rajshahi, Rajshahi 6203', isReal: false
    })
  }
}