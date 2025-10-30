import React from 'react'
import { motion, useInView } from 'framer-motion'

type Props = {
  children: React.ReactNode
  delay?: number
  y?: number
  once?: boolean
  className?: string
}

export default function Reveal({ children, delay = 0, y = 12, once = true, className = '' }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { margin: '-20% 0px -10% 0px', once })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.35, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
