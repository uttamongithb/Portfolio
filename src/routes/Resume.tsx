import React from 'react'
import { loadResume } from '../shared/data'
import Page from '../components/Page'
import { Link } from 'react-router-dom'

export default function Resume() {
  const resume = loadResume()
  const hasSummary = Boolean(resume.basics?.summary)
  const hasSkills = Array.isArray(resume.skills) && resume.skills.length > 0
  const hasExperience = Array.isArray(resume.work) && resume.work.length > 0
  const hasProjects = Array.isArray(resume.projects) && resume.projects.length > 0
  const hasEducation = Array.isArray(resume.education) && resume.education.length > 0
  const skills = hasSkills ? (resume.skills as any[]) : []
  const work = hasExperience ? (resume.work as any[]) : []
  const projects = hasProjects ? (resume.projects as any[]) : []
  const education = hasEducation ? (resume.education as any[]) : []
  return (
    <Page>
      <div className="mx-auto max-w-[800px] px-8 py-8 pt-24 print-page">
        {/* Local print styles */}
        <style>{`
          @media print {
            @page { size: A4; margin: 8mm; }
            html, body { margin: 0 !important; background: #ffffff !important; }
            header.sticky, .no-print { display: none !important; }
            .aurora-bg { display: none !important; }
            .print-page {
              page-break-after: always;
            import React from 'react'
            import { Link } from 'react-router-dom'

            export default function ResumeRedirect() {
              React.useEffect(() => {
                // Redirect to the public PDF; this is a safe fallback if the route is visited.
                window.location.href = '/Resume.pdf'
              }, [])

              return (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <p className="mb-4">Redirecting to resume download...</p>
                    <p>If you are not redirected, <a href="/Resume.pdf" download className="text-accent underline">click here to download</a>.</p>
                    <p className="mt-4"><Link to="/" className="underline">Return home</Link></p>
                  </div>
                </div>
              )
            }
            <h2 className="resume-section-title">Skills</h2>
            <div className="space-y-1">
              {skills.map((s: any, i: number) => (
                <p key={i} className="text-sm"><span className="font-medium">{s.name}:</span> {(s.keywords || []).join(', ')}</p>
              ))}
            </div>
          </section>
        )}
        {/* Divider after Skills if more sections follow */}
        {hasSkills && (hasExperience || hasProjects || hasEducation) && (
          <hr className="my-3 border-neutral-300 dark:border-neutral-700" />
        )}

        {/* Experience before Projects for professional ATS order */}
        {hasExperience && (
          <section className="mb-3">
            <h2 className="resume-section-title">Experience</h2>
            <div className="space-y-2">
              {work.map((w: any, i: number) => (
                <div key={i}>
                  <div className="mb-1">
                    <p className="font-medium">{w.position} • {w.name}</p>
                  </div>
                  {w.summary && <p className="text-sm mt-1">{w.summary}</p>}
                  {Array.isArray(w.highlights) && w.highlights.length > 0 && (
                    <ul className="list-disc pl-5 text-sm">
                      {w.highlights.slice(0, 3).map((h: string, hi: number) => (
                        <li key={hi}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Divider after Experience if more sections follow */}
        {hasExperience && (hasProjects || hasEducation) && (
          <hr className="my-3 border-neutral-300 dark:border-neutral-700" />
        )}

        {/* Projects follow Experience; keep concise */}
        {hasProjects && (
          <section className="mb-3">
            <h2 className="resume-section-title">Projects</h2>
            <div className="space-y-2">
              {projects.slice(0, 4).map((p: any, i: number) => (
                <div key={i}>
                  <p className="font-medium">{p.name}</p>
                  {p.techStack && <p className="text-sm text-neutral-600">Tech Stack: {p.techStack}</p>}
                  {/* If highlights exist, skip description to save space */}
                  {p.description && (!Array.isArray(p.highlights) || p.highlights.length === 0) && (
                    <p className="text-sm mt-1">{p.description}</p>
                  )}
                  {Array.isArray(p.highlights) && p.highlights.length > 0 && (
                    <ul className="list-disc pl-5 text-sm mt-1">
                      {p.highlights.slice(0, 3).map((h: string, hi: number) => (
                        <li key={hi}>{h}</li>
                      ))}
                    </ul>
                  )}
                  <p className="text-sm mt-1">
                    {p.liveLink && <><span className="font-medium">Live:</span> {p.liveLink}</>}
                    {p.liveLink && p.codeLink && ' • '}
                    {p.codeLink && <><span className="font-medium">Code:</span> {p.codeLink}</>}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Divider after Projects if Education follows */}
        {hasProjects && hasEducation && (
          <hr className="my-3 border-neutral-300 dark:border-neutral-700" />
        )}

        {/* Education last for professional ATS order */}
        {hasEducation && (
          <section className="mb-3">
            <h2 className="resume-section-title">Education</h2>
            <div className="space-y-1">
              {education.map((e: any, i: number) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-medium">{e.studyType} • {e.institution}</p>
                    <p className="text-sm text-neutral-600 whitespace-nowrap">{e.startDate} - {e.endDate || 'Present'}</p>
                  </div>
                  {e.area && <p className="text-sm">{e.area}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Page>
  )
}
