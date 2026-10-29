'use client'

import { useState } from 'react'
import { CONTACT_EMAIL } from '@/lib/site'

export default function NewsletterForm({
  invert = false,
  id = 'newsletter-email',
}: {
  invert?: boolean
  id?: string
}) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <form
      className="flex w-full flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault()
        if (!email.trim()) return
        setSubmitted(true)
      }}
    >
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      {submitted ? (
        <p className={`text-sm ${invert ? 'text-white' : 'text-black'}`}>
          This signup is not connected to a mailing list yet. Email {CONTACT_EMAIL} if you want
          drop notices.
        </p>
      ) : (
        <>
          <input
            id={id}
            type="email"
            required
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={invert ? 'input-field-invert flex-1' : 'input-field flex-1'}
          />
          <button type="submit" className={invert ? 'btn-invert' : 'btn-primary'}>
            Submit
          </button>
        </>
      )}
    </form>
  )
}
