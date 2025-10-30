import React from 'react'
import Reveal from './Reveal'

export default function SectionHeader({ title, subtitle, className = '' }: { title: string; subtitle?: string; className?: string }) {
  return (
    <Reveal>
      <div className={`mb-4 ${className}`}>
        <h2 className="text-xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
            {title}
          </span>
        </h2>
        {subtitle && (
          <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
        )}
  <div className="mt-2 h-[2px] w-16 bg-gradient-to-r from-fuchsia-500/70 to-transparent rounded-full" />
      </div>
    </Reveal>
  )}
