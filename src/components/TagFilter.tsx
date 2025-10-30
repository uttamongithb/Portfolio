import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { loadProjects } from '../shared/projects'
import { motion } from 'framer-motion'

export default function TagFilter() {
  const projects = loadProjects()
  const tags = React.useMemo(() => {
    const s = new Set<string>()
    projects.forEach(p => p.tags.forEach(t => s.add(t)))
    return Array.from(s).sort()
  }, [projects])

  const [params, setParams] = useSearchParams()
  const active = params.get('tag') || ''

  function setTag(tag: string) {
    if (!tag) {
      params.delete('tag')
      setParams(params, { replace: true })
    } else {
      params.set('tag', tag)
      setParams(params, { replace: true })
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Chip label="All" active={!active} onClick={() => setTag('')} />
      {tags.map((t) => (
        <Chip key={t} label={t} active={active === t} onClick={() => setTag(t)} />
      ))}
    </div>
  )
}

function Chip({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${active ? 'bg-accent text-neutral-900 border-accent shadow-soft' : 'bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border-neutral-300 dark:border-neutral-700'}`}
    >
      {label}
    </motion.button>
  )
}
