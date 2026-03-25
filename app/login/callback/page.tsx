'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function LoginCallbackPage() {
  const router = useRouter()
  const [safeReturnUrl, setSafeReturnUrl] = useState('/checkout')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const rawReturnUrl = params.get('returnUrl') ?? '/checkout'
    setSafeReturnUrl(rawReturnUrl.startsWith('/') ? rawReturnUrl : '/checkout')
  }, [])

  useEffect(() => {
    async function finish() {
      const supabase = createClient()
      if (!supabase) {
        router.replace('/login')
        return
      }

      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        router.replace(safeReturnUrl)
      } else {
        router.replace(`/login?returnUrl=${encodeURIComponent(safeReturnUrl)}`)
      }
    }

    finish()
  }, [router, safeReturnUrl])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <p className="text-black">Logging you in...</p>
    </div>
  )
}

