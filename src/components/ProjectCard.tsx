import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Project } from '../shared/schema'

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = React.useRef<HTMLAnchorElement | null>(null)
  const [style, setStyle] = React.useState<React.CSSProperties>({})

  function onMove(e: React.MouseEvent) {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    const rx = (+py * 6).toFixed(2)
    const ry = (+px * -6).toFixed(2)
    setStyle({ transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)` })
  }

  function resetTilt() {
    setStyle({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)' })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
  className="group rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
    >
      <Link to={`/projects/${project.slug}`} className="block" ref={cardRef} onMouseMove={onMove} onMouseLeave={resetTilt} style={style as any}>
        <div className="relative aspect-[16/9] overflow-hidden">
          {project.cover ? (
            <img
              src={project.cover}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-accent/20 to-transparent" />
          )}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
            background: 'radial-gradient(400px 120px at 50% 0%, rgba(168,85,247,0.18), transparent 60%)'
          }} />
        </div>
        <div className="p-4">
          <h3 className="font-semibold tracking-tight">{project.title}</h3>
          {project.summary && (
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{project.summary}</p>
          )}
          {project.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.slice(0, 5).map((tag, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </Link>
    </motion.article>
  )
}
