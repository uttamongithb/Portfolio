import React from 'react'
import { loadResume } from '../shared/data'
import Page from '../components/Page'
import { useSearchParams, Link } from 'react-router-dom'

export default function Print() {
  const resume = loadResume()
  const [params] = useSearchParams()
  const auto = params.get('auto') === '1'

  React.useEffect(() => {
    if (auto) {
      // Give the page a moment to render, then trigger print
      const t = setTimeout(() => window.print(), 400)
      return () => clearTimeout(t)
    }
  }, [auto])
  return (
    <Page>
    <div className="print-page">
      <style>{`
        @media print {
          a { color: #000 !important; text-decoration: underline !important; -webkit-text-decoration-color: #000 !important; -webkit-print-color-adjust: exact; }
          a[href]:after { content: '' !important; }
        }
      `}</style>
      <div className="mx-auto max-w-[800px] px-8 py-8">
        {/* Controls shown only on screen, hidden in print */}
        <div className="no-print mb-4 flex items-center gap-2">
          <a href="/Resume.pdf" download className="px-3 py-1.5 rounded-md bg-accent text-white">Download PDF</a>
          <Link to="/" className="px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700">Back</Link>
        </div>
        <header className="mb-4">
          <h1 className="text-3xl font-bold leading-tight">{resume.basics?.name || 'Your Name'}</h1>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">{resume.basics?.label || 'Your Title'}</p>
          {resume.basics?.email || resume.basics?.phone || resume.basics?.url ? (
            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
              {resume.basics?.phone && <span>{resume.basics.phone}</span>}
              {resume.basics?.phone && resume.basics?.email && <span> • </span>}
              {resume.basics?.email && <span>{resume.basics.email}</span>}
              {(resume.basics?.phone || resume.basics?.email) && resume.basics?.url && <span> • </span>}
              {resume.basics?.url && <span>{resume.basics.url}</span>}
            </p>
          ) : null}
        </header>

        {resume.basics?.summary && (
          <section className="mb-3">
            <h2 className="section-title">Summary</h2>
            <p className="text-sm">{resume.basics.summary}</p>
          </section>
        )}

        {resume.work?.length ? (
          <section className="mb-3">
            <h2 className="section-title">Experience</h2>
            <div className="space-y-2">
              {resume.work.map((w: any, i: number) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between">
                    <p className="font-medium">
                      {w.position} • {w.name}
                    </p>
                    <p className="text-sm text-neutral-600">
                      {w.startDate} – {w.endDate || 'Present'}
                    </p>
                  </div>
                  {w.summary && (
                    <p className="text-sm mt-1">{w.summary}</p>
                  )}
                  {w.highlights?.length ? (
                    <ul className="list-disc pl-5 text-sm">
                      {w.highlights.map((h: string, hi: number) => (
                        <li key={hi}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {resume.projects?.length ? (
          <section className="mb-3">
            <h2 className="section-title">Projects</h2>
            <div className="space-y-2">
              {resume.projects.map((p: any, i: number) => (
                <div key={i}>
                  <p className="font-medium">{p.name}</p>
                  {p.techStack && (
                    <p className="text-sm text-neutral-600">Tech Stack: {p.techStack}</p>
                  )}
                  {p.description && (
                    <p className="text-sm mt-1 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2 as any, WebkitBoxOrient: 'vertical' as any }}>{p.description}</p>
                  )}
                  {Array.isArray(p.highlights) && p.highlights.length > 0 && (
                    <ul className="list-disc pl-5 text-sm mt-1">
                      {p.highlights.map((h: string, hi: number) => (
                        <li key={hi}>{h}</li>
                      ))}
                    </ul>
                  )}
                  <p className="text-sm mt-1">
                    {p.liveLink && (
                      <>
                        <span className="font-medium">Live:</span>{' '}
                        <a href={p.liveLink} target="_blank" rel="noopener noreferrer" className="text-accent underline">{p.liveLink}</a>
                      </>
                    )}
                    {p.liveLink && p.codeLink && ' • '}
                    {p.codeLink && (
                      <>
                        <span className="font-medium">Code:</span>{' '}
                        <a href={p.codeLink} target="_blank" rel="noopener noreferrer" className="text-accent underline">{p.codeLink}</a>
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

          {/* Skills removed from print output per request */}

        {resume.education?.length ? (
          <section className="mb-3">
            <h2 className="section-title">Education</h2>
            <div className="space-y-1">
              {resume.education.map((e: any, i: number) => (
                <div key={i}>
                  <p className="font-medium">{e.studyType} • {e.institution}</p>
                  <p className="text-sm text-neutral-600">{e.startDate} – {e.endDate || 'Present'}</p>
                  {e.area && <p className="text-sm">{e.area}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
    </Page>
  )
}
