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
              padding-top: 2mm !important;
              padding-bottom: 4mm !important;
              min-height: calc(297mm - 16mm);
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            /* Slightly tighten font sizes for print to improve single-page fit */
            .print-page .text-sm, .print-page p, .print-page li { font-size: 10.5pt !important; line-height: 1.35 !important; }
            .print-page h1 { font-size: 18pt !important; }
            .print-page .resume-section-title { font-size: 12pt !important; }
            /* Ensure section dividers are visible in print */
            .print-page hr { border: 0; border-top: 1px solid #000 !important; opacity: 1 !important; margin: 8px 0 !important; }
            * { color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}</style>
        <div className="no-print mb-4 flex items-center gap-2">
          <Link to="/" className="px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700">Back</Link>
          <button onClick={() => window.print()} className="px-3 py-1.5 rounded-md bg-accent text-white">Download PDF</button>
        </div>
        <header className="mb-4">
          <h1 className="text-3xl font-bold leading-tight">{resume.basics?.name || 'Your Name'}</h1>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">{resume.basics?.label || 'Your Title'}</p>
          {/* Location on its own line just below role */}
          {resume.basics?.location && (
            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{resume.basics.location}</p>
          )}
          {/* Contact block (two lines) wrapped by horizontal rules; labels added */}
          {(() => {
            const itemsLine1: string[] = [] // phone | email
            const itemsLine2: string[] = [] // LinkedIn/GitHub/Website
            if (resume.basics?.phone) itemsLine1.push(`Phone: ${resume.basics.phone}`)
            if (resume.basics?.email) itemsLine1.push(`Email: ${resume.basics.email}`)
            const site = resume.basics?.url
            if (site) {
              if (/linkedin\.com/i.test(site)) itemsLine2.push(`LinkedIn: ${site}`)
              else itemsLine2.push(`Website: ${site}`)
            }
            const ghUrl = Array.isArray(resume.basics?.profiles)
              ? (resume.basics!.profiles!.find((p: any) => p.network?.toLowerCase() === 'github')?.url as string | undefined)
              : undefined
            if (ghUrl) itemsLine2.push(`GitHub: ${ghUrl}`)
            const showAny = itemsLine1.length > 0 || itemsLine2.length > 0
            if (!showAny) return null
            return (
              <>
                <hr className="my-3 border-neutral-300 dark:border-neutral-700" />
                {itemsLine1.length > 0 && (
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">{itemsLine1.join(' | ')}</p>
                )}
                {itemsLine2.length > 0 && (
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">{itemsLine2.join(' | ')}</p>
                )}
                <hr className="my-3 border-neutral-300 dark:border-neutral-700" />
              </>
            )
          })()}
        </header>

        {hasSummary && (
          <section className="mb-3">
            <h2 className="resume-section-title">Summary</h2>
            <p className="text-sm">{resume.basics?.summary}</p>
          </section>
        )}
        {/* Divider after Summary if more sections follow */}
        {hasSummary && (hasSkills || hasExperience || hasProjects || hasEducation) && (
          <hr className="my-3 border-neutral-300 dark:border-neutral-700" />
        )}

        {/* ATS-friendly: Skills early for keyword scanning */}
        {hasSkills && (
          <section className="mb-3">
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
