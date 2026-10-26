'use client'
import dynamic from 'next/dynamic'

const ClientShell = dynamic(() => import('@/components/ClientShell'), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-[#f5f5f5]" />,
})

export default function ClientShellWrapper({ children }) {
  return <ClientShell>{children}</ClientShell>
}