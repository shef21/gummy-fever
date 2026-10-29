'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SiteShell from '@/components/SiteShell'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [safeReturnUrl, setSafeReturnUrl] = useState('/checkout')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const rawReturnUrl = params.get('returnUrl') ?? '/checkout'
    setSafeReturnUrl(rawReturnUrl.startsWith('/') ? rawReturnUrl : '/checkout')
  }, [])

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baseAuthRedirectUrl = () => {
    const origin = window.location.origin
    return `${origin}/login/callback?returnUrl=${encodeURIComponent(safeReturnUrl)}`
  }

  const redirectIfSignedIn = async () => {
    const supabase = createClient()
    if (!supabase) return
    const { data } = await supabase.auth.getUser()
    if (data?.user) {
      router.replace(safeReturnUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    setSent(false)

    try {
      const supabase = createClient()
      if (!supabase) {
        setError('Supabase is not configured.')
        return
      }

      if (!email || !password) {
        setError('Please enter your email and password.')
        return
      }

      if (mode === 'signup') {
        if (password.length < 8) {
          setError('Password must be at least 8 characters.')
          return
        }
        if (password !== passwordConfirm) {
          setError('Passwords do not match.')
          return
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: baseAuthRedirectUrl(),
          },
        })

        if (signUpError) {
          setError(signUpError.message)
          return
        }

        setSent(true)
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      await redirectIfSignedIn()
    } catch (err) {
      console.error('Login error', err)
      setError('Unexpected error processing authentication.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SiteShell>
      <div className="page-shell max-w-md py-12 sm:py-16">
        <p className="eyebrow">Account</p>
        <h1 className="display-title mt-3">Account</h1>
        <p className="mt-4 text-sm text-neutral-800">
          Sign in to continue to checkout. You must be 18 or older to create an account.
        </p>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setSent(false)
              setError(null)
            }}
            className={`flex-1 ${mode === 'signin' ? 'btn-primary' : 'btn-secondary'}`}
            aria-pressed={mode === 'signin'}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setSent(false)
              setError(null)
            }}
            className={`flex-1 ${mode === 'signup' ? 'btn-primary' : 'btn-secondary'}`}
            aria-pressed={mode === 'signup'}
          >
            Sign up
          </button>
        </div>

        {sent ? (
          <div className="mt-8 border border-black bg-neutral-50 p-6">
            <p className="font-medium text-black">
              Verification email sent. Please check your inbox to verify your account.
            </p>
            <button
              type="button"
              onClick={() => router.push(safeReturnUrl)}
              className="btn-primary mt-6 w-full"
            >
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block font-medium text-black" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-black" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>

            {mode === 'signup' ? (
              <div>
                <label className="mb-2 block font-medium text-black" htmlFor="passwordConfirm">
                  Confirm password
                </label>
                <input
                  id="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="input-field"
                />
              </div>
            ) : null}

            {error ? (
              <p className="text-sm font-medium text-red-800" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting || !email}
              className="btn-primary w-full"
            >
              {submitting ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>

            <p className="text-sm text-neutral-800">
              {mode === 'signup'
                ? 'A verification email will be sent to your inbox.'
                : 'Sign in to continue to checkout.'}
            </p>
          </form>
        )}
      </div>
    </SiteShell>
  )
}
