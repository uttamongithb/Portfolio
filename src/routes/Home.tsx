import React from 'react'
import { motion } from 'framer-motion'
import { loadResume } from '../shared/data'
import Page from '../components/Page'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import { Link } from 'react-router-dom'
import FeaturedProjects from '../components/FeaturedProjects'
import SectionHeader from '../components/SectionHeader'

export default function Home() {
  const resume = loadResume()
  return (
    <Page>
    <Container className="py-10">
      <Reveal>
      <section className="mb-10">
        <div className="mb-2">
          <p className="text-sm uppercase tracking-wider text-accent">Available</p>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-violet-500">
          {resume.basics?.name || 'Your Name'}
        </h1>
        {/* Floating gradient orbs for subtle parallax */}
        <div className="relative h-0">
          <div className="pointer-events-none absolute -top-8 -left-6 h-24 w-24 rounded-full bg-gradient-to-br from-fuchsia-400/40 to-violet-400/40 blur-xl animate-float-slow" />
          <div className="pointer-events-none absolute -top-10 left-28 h-16 w-16 rounded-full bg-gradient-to-br from-violet-400/40 to-fuchsia-400/40 blur-lg animate-float-slow animation-delay-2000" />
        </div>
        <p className="mt-1 text-neutral-600 dark:text-neutral-300">
          {resume.basics?.label || 'Frontend Developer'}
        </p>
        <p className="mt-3 max-w-3xl text-neutral-700 dark:text-neutral-300">
          {resume.basics?.summary || 'Frontend developer with a focus on modern React ecosystems, performance, and UX.'}
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/projects" className="px-4 py-2 rounded-md bg-accent text-white hover:brightness-110">View Projects</Link>
          <Link to="/contact" className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">Contact</Link>
          <Link to="/resume" className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">Resume</Link>
          {/* Print view removed */}
        </div>
      </section>
      </Reveal>

      {resume.work?.length ? (
        <Reveal>
        <section className="mb-10">
          <SectionHeader title="Experience" subtitle="Selected roles and contributions" />
          <div className="space-y-5">
            {resume.work.map((w: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {w.position} • <span className="text-accent">{w.name}</span>
                    </p>
                    {w.location && (
                      <p className="text-sm text-neutral-500">{w.location}</p>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">
                    {w.startDate} – {w.endDate || 'Present'}
                  </p>
                </div>
                {w.summary && (
                  <p className="mt-2 text-neutral-700 dark:text-neutral-300">{w.summary}</p>
                )}
                {w.highlights?.length ? (
                  <ul className="mt-2 list-disc pl-5 text-neutral-700 dark:text-neutral-300">
                    {w.highlights.map((h: string, hi: number) => (
                      <li key={hi}>{h}</li>
                    ))}
                  </ul>
                ) : null}
              </motion.div>
            ))}
          </div>
            </section>
            </Reveal>
      ) : null}

      {/* Contact modal removed in favor of dedicated Contact page */}

      {/* Featured Projects */}
      <FeaturedProjects />

      {resume.skills?.length ? (
        <Reveal>
        <section className="mb-10">
          <SectionHeader title="Skills" />
          <div className="flex flex-wrap gap-2">
            {resume.skills.flatMap((s: any) => s.keywords || []).map((k: string, i: number) => (
              <motion.span key={i} whileHover={{ scale: 1.05 }} className="text-sm px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                {k}
              </motion.span>
            ))}
          </div>
        </section>
        </Reveal>
      ) : null}

      {resume.education?.length ? (
        <Reveal>
        <section className="mb-10">
          <SectionHeader title="Education" />
          <div className="space-y-4">
            {resume.education.map((e: any, i: number) => (
              <div key={i} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
                <p className="font-medium">
                  {e.studyType} • <span className="text-accent">{e.institution}</span>
                </p>
                <p className="text-sm text-neutral-500">{e.startDate} – {e.endDate || 'Present'}</p>
              </div>
            ))}
          </div>
        </section>
        </Reveal>
      ) : null}
    </Container>
    </Page>
  )
}
