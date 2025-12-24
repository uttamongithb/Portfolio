import React from 'react'
import { motion } from 'framer-motion'
// import { cn } from '../shared/utils'

export default function BentoCard({
    children,
    className,
    title,
    subtitle,
    delay = 0
}: {
    children: React.ReactNode
    className?: string
    title?: string
    subtitle?: string
    delay?: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay }}
            className={`glass-card p-6 flex flex-col relative overflow-hidden group ${className || ''}`}
        >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex-1 flex flex-col">
                {children}
            </div>

            {(title || subtitle) && (
                <div className="relative z-10 mt-4 pt-4 border-t border-white/5">
                    {title && <h3 className="font-bold text-lg text-white group-hover:text-accent transition-colors">{title}</h3>}
                    {subtitle && <p className="text-sm text-neutral-400">{subtitle}</p>}
                </div>
            )}
        </motion.div>
    )
}
