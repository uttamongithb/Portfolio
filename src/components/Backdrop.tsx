import React from 'react'

export default function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-60 dark:opacity-40"
      style={{
        background:
          'radial-gradient(600px 300px at 20% 0%, rgba(14,165,233,0.15), transparent 60%), radial-gradient(600px 300px at 80% 0%, rgba(14,165,233,0.1), transparent 60%)'
      }}
    />
  )
}
