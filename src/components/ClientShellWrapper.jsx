'use client'
import dynamic from 'next/dynamic'

const ClientShell = dynamic(() => import('@/components/ClientShell'), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-[#f5f5f5]" />,
})

export default function ClientShellWrapper({ children }) {
  return (
    <>
      {/* ✅ HEADER আর BANNER এর মাঝের সাদা 112px গ্যাপ বন্ধ */}
      <style>{`
        .hidden.md\\:block.w-full.shrink-0.bg-\\[\\#F5F5F5\\],
        .hidden.md\\:block.w-full.shrink-0.bg-\\[\\#f5f3f0\\],
        div[class*="shrink-0"][class*="bg-[#F5F5F5]"] {
          display: none !important;
          height: 0 !important;
          min-height: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: hidden !important;
        }
        main {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
      `}</style>
      <ClientShell>{children}</ClientShell>
    </>
  )
}