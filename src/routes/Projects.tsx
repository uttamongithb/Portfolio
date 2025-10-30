import React from 'react'
import Container from '../components/Container'
import ProjectCard from '../components/ProjectCard'
import { loadProjects } from '../shared/projects'
import Page from '../components/Page'
import TagFilter from '../components/TagFilter'
import { useSearchParams } from 'react-router-dom'

export default function Projects() {
  const projects = loadProjects()
  const [query, setQuery] = React.useState('')
  const [params] = useSearchParams()
  const tag = params.get('tag') || ''
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = projects
    if (tag) list = list.filter(p => p.tags.includes(tag))
    if (!q) return list
    return list.filter(p => p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)))
  }, [projects, query, tag])

  return (
    <Page>
    <Container className="py-10">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Filter by title or tag"
          className="w-full max-w-xs text-sm px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
        />
      </div>

      <div className="mb-6">
        <TagFilter />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </Container>
    </Page>
  )
}
