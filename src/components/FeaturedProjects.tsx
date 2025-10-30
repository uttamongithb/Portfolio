import React from 'react'
import Container from './Container'
import ProjectCard from './ProjectCard'
import { loadProjects } from '../shared/projects'
import Reveal from './Reveal'
import { Link } from 'react-router-dom'

export default function FeaturedProjects() {
  const projects = loadProjects().slice(0, 3)
  if (!projects.length) return null
  return (
    <Container className="py-10">
      <Reveal>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured Projects</h2>
          <Link to="/projects" className="text-sm text-accent">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </Reveal>
    </Container>
  )
}
