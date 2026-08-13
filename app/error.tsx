"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="fatal-state"><h1>Unable to load nursing data</h1><p>Please try again in a moment.</p><button onClick={reset}>Try again</button></main>;
}
