'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en-ZA">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#ffffff',
          color: '#111111',
          fontFamily: 'Helvetica, Arial, sans-serif',
        }}
      >
        <main
          style={{
            maxWidth: '36rem',
            margin: '0 auto',
            padding: '5rem 1rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            Error
          </p>
          <h1
            style={{
              fontSize: '2rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.03em',
            }}
          >
            Gummy Fever could not load
          </h1>
          <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#2a2a2a' }}>
            A site-wide error stopped this page. Try again. If it continues, email
            info@gummyfever.com
            {error.digest ? ` and mention code ${error.digest}` : ''}.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              minHeight: 44,
              marginTop: 24,
              padding: '12px 24px',
              background: '#111111',
              color: '#ffffff',
              border: 0,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
