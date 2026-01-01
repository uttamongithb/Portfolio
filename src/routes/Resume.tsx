import React from 'react'
import { Link } from 'react-router-dom'

export default function ResumeRedirect() {
  React.useEffect(() => {
    // Redirect to the public PDF; this is a safe fallback if the route is visited.
    window.location.href = '/Resume.pdf'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="mb-4">Redirecting to resume download...</p>
        <p>If you are not redirected, <a href="/Resume.pdf" download className="text-accent underline">click here to download</a>.</p>
        <p className="mt-4"><Link to="/" className="underline">Return home</Link></p>
      </div>
    </div>
  )
}
