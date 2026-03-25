'use client'

import { useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawReturnUrl = searchParams.get('returnUrl') ?? '/checkout'

  const safeReturnUrl = useMemo(() => {
    return rawReturnUrl.startsWith('/') ? rawReturnUrl : '/checkout'
  }, [rawReturnUrl])

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

