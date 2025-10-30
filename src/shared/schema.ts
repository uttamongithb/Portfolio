import { z } from 'zod'

export const ResumeSchema = z.object({
  basics: z.object({
    name: z.string().optional(),
    label: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    url: z.string().optional(),
    location: z.string().optional(),
    summary: z.string().optional(),
    profiles: z.array(z.object({
      network: z.string(),
      url: z.string(),
      username: z.string().optional()
    })).optional()
  }).optional(),
  work: z.array(z.object({
    name: z.string().optional(),
    position: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional()
  })).optional(),
  projects: z.array(z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    techStack: z.string().optional(),
    liveLink: z.string().optional(),
    codeLink: z.string().optional(),
    // Allow optional bullet highlights for projects rendered in the Resume page
    highlights: z.array(z.string()).optional()
  })).optional(),
  education: z.array(z.object({
    institution: z.string().optional(),
    area: z.string().optional(),
    studyType: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })).optional(),
  skills: z.array(z.object({
    name: z.string().optional(),
    level: z.string().optional(),
    keywords: z.array(z.string()).optional()
  })).optional()
})

export type Resume = z.infer<typeof ResumeSchema>

// Project schema for portfolio
export const ProjectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  year: z.number().optional(),
  role: z.string().optional(),
  tools: z.array(z.string()).default([]),
  links: z.object({
    live: z.string().optional(),
    repo: z.string().optional(),
    caseStudy: z.string().optional()
  }).partial().optional(),
  cover: z.string().optional(),
  gallery: z.array(z.object({
    src: z.string(),
    alt: z.string().optional()
  })).default([]),
  // Case study fields
  problem: z.string().optional(),
  approach: z.array(z.string()).optional(),
  outcomes: z.array(z.string()).optional(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional()
})

export const ProjectsSchema = z.array(ProjectSchema)
export type Project = z.infer<typeof ProjectSchema>
