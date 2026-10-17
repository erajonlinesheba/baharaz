export const divisions = ["Dhaka","Rajshahi","Rangpur"];
export function getDistricts(){return []}
export function getUpazilas(){return []}
export function isBangladeshLocation(){return true}
export function parseBDAddress(a){return {address:a}}
export function getDeliveryCharge(){return 60}
export default {divisions, getDistricts, getUpazilas, isBangladeshLocation, parseBDAddress, getDeliveryCharge}