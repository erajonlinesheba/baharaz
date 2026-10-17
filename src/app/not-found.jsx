import Link from "next/link";
export default function NotFound(){
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
      <h1 className="text-[80px] font-bold text-[#f85606]">404</h1>
      <p className="text-[16px] text-[#757575]">This page could not be found - Baharaz</p>
      <Link href="/" className="mt-6 bg-[#f85606] text-white px-8 py-3 rounded">Go Home - Baharaz #1</Link>
    </div>
  )
}