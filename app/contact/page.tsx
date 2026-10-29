'use client'

import { useState } from 'react'
import SiteShell from '@/components/SiteShell'
import { CONTACT_EMAIL, OPERATOR_COUNTRY, OPERATOR_NAME } from '@/lib/site'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  return (
    <SiteShell>
      <div className="page-shell max-w-2xl py-12 sm:py-16">
        <p className="eyebrow">Support</p>
        <h1 className="display-title mt-3">Contact us</h1>
        <p className="mt-4 text-neutral-800">
          For orders, fit, shipping, or privacy requests, email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          . The form below currently confirms in the browser only.
        </p>

        {submitted ? (
          <div className="mt-8 border border-black bg-neutral-50 p-6" role="status">
            <p className="font-medium text-black">
              Thanks — this form is not connected to a mailbox yet. Please also email{' '}
              {CONTACT_EMAIL} so we receive your message.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block font-medium text-black">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block font-medium text-black">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block font-medium text-black">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="input-field min-h-[10rem]"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Send message
            </button>
          </form>
        )}

        <div className="mt-12 border-t border-black pt-8">
          <h2 className="text-2xl font-bold text-black">Other ways to reach us</h2>
          <div className="mt-4 space-y-2 text-black">
            <p>
              Email:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
            </p>
            <p>
              Operator: {OPERATOR_NAME}, {OPERATOR_COUNTRY}
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  )
}
