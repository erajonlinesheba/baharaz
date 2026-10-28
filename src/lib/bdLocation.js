// src/lib/bdLocation.js - Full 64 District Real BD
export const BD_DIVISIONS = ["Dhaka","Chattogram","Rajshahi","Khulna","Barishal","Sylhet","Rangpur","Mymensingh"];

export const ALL_64_DISTRICTS = [
  "Dhaka","Faridpur","Gazipur","Gopalganj","Kishoreganj","Madaripur","Manikganj","Munshiganj","Narayanganj","Narsingdi","Rajbari","Shariatpur","Tangail",
  "Bogra","Joypurhat","Naogaon","Natore","Chapainawabganj","Pabna","Rajshahi","Sirajganj",
  "Bagerhat","Chuadanga","Jessore","Jhenaidah","Khulna","Kushtia","Magura","Meherpur","Narail","Satkhira",
  "Barguna","Barishal","Bhola","Jhalokati","Patuakhali","Pirojpur",
  "Bandarban","Brahmanbaria","Chandpur","Chattogram","Comilla","Cox's Bazar","Feni","Khagrachhari","Lakshmipur","Noakhali","Rangamati",
  "Habiganj","Moulvibazar","Sunamganj","Sylhet",
  "Dinajpur","Gaibandha","Kurigram","Lalmonirhat","Nilphamari","Panchagarh","Rangpur","Thakurgaon",
  "Jamalpur","Mymensingh","Netrokona","Sherpur"
];

export function isBangladeshLocation(address = {}, display_name = "") {
  if (!address) return false;
  const country = (address.country || "").toLowerCase();
  const code = (address.country_code || "").toLowerCase();
  const dn = (display_name || "").toLowerCase();
  if (code === "bd") return true;
  if (country.includes("bangladesh")) return true;
  if (dn.includes("bangladesh")) return true;
  return false;
}

export function parseBDAddress(addr = {}) {
  const road = addr.road || addr.street || addr.neighbourhood || addr.suburb || addr.village || "";
  const upazila = addr.suburb || addr.town || addr.city_district || addr.municipality || addr.village || addr.county || "Sadar";
  // District - Real BD
  let district = addr.state_district || addr.county || addr.district || addr.city || "";
  // Division - Real BD
  let division = addr.state || "Dhaka";

  // Clean Division
  if (division.toLowerCase().includes("chittagong")) division = "Chattogram";
  if (division.toLowerCase().includes("barisal")) division = "Barishal";
  if (division.toLowerCase().includes("bogura")) division = "Bogra";

  // If district empty, try to find from address
  if (!district) district = division;

  return {
    road: road,
    upazila: upazila,
    district: district,
    division: division,
    city: addr.city || addr.town || district,
    postcode: addr.postcode || "",
  };
}

export function getDeliveryCharge(userDivision, userDistrict, sellerDivision = "Dhaka") {
  const uDiv = (userDivision || "").toLowerCase();
  const uDis = (userDistrict || "").toLowerCase();
  const sDiv = (sellerDivision || "").toLowerCase();

  if (uDiv === sDiv) {
    // Same Division = 60-80
    if (uDis.includes(sDiv) || uDis === sDiv) return 60;
    return 80;
  }
  if (uDiv.includes("dhaka")) return 100;
  if (uDiv.includes("chattogram") || uDiv.includes("sylhet")) return 130;
  return 120;
}