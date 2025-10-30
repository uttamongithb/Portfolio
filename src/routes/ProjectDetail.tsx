import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Container from '../components/Container'
import { findProject } from '../shared/projects'
import Page from '../components/Page'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'

export default function ProjectDetail() {
  const { slug = '' } = useParams()
  const project = findProject(slug)

  if (!project) {
    return (
      <Page>
      <Container className="py-10">
        <p>Project not found.</p>
        <Link className="text-accent" to="/projects">Back to projects</Link>
      </Container>
      </Page>
    )
  }

  return (
    <Page>
    <div className="relative">
      {project.cover && (
        <div className="h-60 w-full overflow-hidden">
          <img src={project.cover} alt={project.title} className="h-full w-full object-cover" />
        </div>
      )}
      <Container className="py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="md:w-2/3">
            <Reveal>
              <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
              {project.summary && (
                <p className="mt-2 text-neutral-700 dark:text-neutral-300">{project.summary}</p>
              )}
              {project.description && (
                <p className="mt-4 leading-relaxed text-neutral-800 dark:text-neutral-200">{project.description}</p>
              )}
            </Reveal>

            {project.problem && (
              <section className="mt-8">
                <SectionHeader title="Problem" />
                <Reveal>
                  <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">{project.problem}</p>
                </Reveal>
              </section>
            )}

            {project.approach?.length ? (
              <section className="mt-8">
                <SectionHeader title="Process" subtitle="Key steps and decisions" />
                <Reveal>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-800 dark:text-neutral-200">
                    {project.approach.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </Reveal>
              </section>
            ) : null}

            {project.outcomes?.length ? (
              <section className="mt-8">
                <SectionHeader title="Outcomes" />
                <Reveal>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-800 dark:text-neutral-200">
                    {project.outcomes.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </Reveal>
              </section>
            ) : null}

            {project.metrics?.length ? (
              <section className="mt-8">
                <SectionHeader title="Metrics" />
                <Reveal>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.metrics.map((m, i) => (
                      <div key={i} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 text-center bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm">
                        <div className="text-2xl font-extrabold bg-gradient-to-r from-fuchsia-500 to-violet-500 bg-clip-text text-transparent">{m.value}</div>
                        <div className="text-xs mt-1 text-neutral-600 dark:text-neutral-400">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              </section>
            ) : null}

            {project.gallery?.length ? (
              <section className="mt-8">
                <SectionHeader title="Gallery" />
                <Reveal>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.gallery.map((g, i) => (
                      <img key={i} src={g.src} alt={g.alt || ''} loading="lazy" className="rounded-lg border border-neutral-200 dark:border-neutral-800" />
                    ))}
                  </div>
                </Reveal>
              </section>
            ) : null}
          </div>

          <aside className="md:w-1/3 md:pl-8">
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 sticky top-20">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">Overview</h2>
              <ul className="mt-2 space-y-1 text-sm">
                {project.year && <li><span className="text-neutral-500">Year:</span> {project.year}</li>}
                {project.role && <li><span className="text-neutral-500">Role:</span> {project.role}</li>}
                {!!project.tools?.length && <li><span className="text-neutral-500">Tools:</span> {project.tools.join(', ')}</li>}
              </ul>
              {project.links && (
                <div className="mt-3 flex gap-2">
                  {project.links.live && <a className="text-sm px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800" href={project.links.live} target="_blank">Live</a>}
                  {project.links.repo && <a className="text-sm px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800" href={project.links.repo} target="_blank">Code</a>}
                </div>
              )}
              <div className="mt-4">
                <Link to="/projects" className="text-sm text-accent">← Back to all projects</Link>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
    </Page>
  )
}
