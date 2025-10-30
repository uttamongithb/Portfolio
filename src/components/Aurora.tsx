import React from 'react'

export default function Aurora() {
  return (
    <div className="aurora-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-24 -left-16 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-400/35 to-violet-400/35 blur-3xl animate-blob" />
      <div className="absolute -bottom-24 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-violet-400/30 to-fuchsia-400/30 blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/4 -right-16 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400/30 to-fuchsia-400/30 blur-3xl animate-blob animation-delay-4000" />
    </div>
  )
}
