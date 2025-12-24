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
      whileHover={{ y: -6 }}
      className="group glass-card overflow-hidden hover:shadow-accent/20 hover:border-accent/40 transition-all duration-300 h-full"
    >
      <Link to={`/projects/${project.slug}`} className="block h-full flex flex-col" ref={cardRef} onMouseMove={onMove} onMouseLeave={resetTilt} style={style as any}>
        <div className="relative aspect-[16/9] overflow-hidden">
          {project.cover ? (
            <img
              src={project.cover}
              alt={project.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-surface border-b border-white/5 flex items-center justify-center">
              <span className="text-neutral-600 font-mono text-xs">No Cover</span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-background/90 to-transparent" />
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold tracking-tight text-white group-hover:text-accent transition-colors">{project.title}</h3>
          {project.summary && (
            <p className="mt-2 text-sm text-neutral-400 line-clamp-2 flex-1">{project.summary}</p>
          )}
          {project.tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded bg-background/50 border border-white/10 text-neutral-400">
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
