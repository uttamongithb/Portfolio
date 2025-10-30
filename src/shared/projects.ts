import projectsRaw from '../../data/projects.json'
import { ProjectsSchema, type Project } from './schema'

export function loadProjects(): Project[] {
  const parsed = ProjectsSchema.safeParse(projectsRaw)
  if (!parsed.success) return []
  return parsed.data
}

export function findProject(slug: string): Project | undefined {
  return loadProjects().find(p => p.slug === slug)
}
