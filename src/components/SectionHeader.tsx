import React from 'react'
import Reveal from './Reveal'

export default function SectionHeader({ title, subtitle, className = '' }: { title: string; subtitle?: string; className?: string }) {
  return (
    <Reveal>
      <div className={`mb-6 ${className}`}>
        <h2 className="text-2xl font-bold tracking-tight text-white relative inline-block">
          {title}
          <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-accent rounded-full"></span>
        </h2>
        {subtitle && (
          <p className="text-sm text-neutral-400 mt-2 font-mono">{subtitle}</p>
        )}
      </div>
    </Reveal>
  )
}
