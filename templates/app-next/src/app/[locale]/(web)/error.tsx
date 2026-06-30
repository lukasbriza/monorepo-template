'use client'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => (
  <main>
    <h1>Something went wrong</h1>
    <p>{error.message}</p>
    <button type="button" onClick={reset}>
      Try again
    </button>
  </main>
)

export default ErrorPage
