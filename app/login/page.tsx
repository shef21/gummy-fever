'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'
export const revalidate = false

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

        // Email verification required: show "check email" state.
        setSent(true)
        return
      }

      // Sign in with email + password
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
    <div className="min-h-screen flex flex-col">
      {/* Reuse header/cart UI */}
      {/* Header is already present globally on many pages; keep login simple. */}

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 uppercase text-black">Account</h1>

          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin')
                setSent(false)
                setError(null)
              }}
              className={`flex-1 py-2 border border-black font-bold uppercase tracking-wide transition-colors ${
                mode === 'signin' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setSent(false)
                setError(null)
              }}
              className={`flex-1 py-2 border border-black font-bold uppercase tracking-wide transition-colors ${
                mode === 'signup' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              Sign Up
            </button>
          </div>

          {sent ? (
            <div className="bg-gray-50 border border-black p-6">
              <p className="text-black font-medium">
                Verification email sent. Please check your inbox to verify your account.
              </p>
              <button
                type="button"
                onClick={() => router.push(safeReturnUrl)}
                className="mt-6 w-full bg-black text-white py-3 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                Continue
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-black font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block mb-2 text-black font-medium" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {mode === 'signup' && (
                <div>
                  <label
                    className="block mb-2 text-black font-medium"
                    htmlFor="passwordConfirm"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="passwordConfirm"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="w-full border border-black px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              )}

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting || !email}
                className="w-full bg-black text-white py-4 font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
              </button>

              <p className="text-sm text-gray-700">
                {mode === 'signup'
                  ? 'A verification email will be sent to your inbox.'
                  : 'Sign in to continue to checkout.'}
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

