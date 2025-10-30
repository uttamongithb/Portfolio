import resumeRaw from '../../data/resume.json'
import { ResumeSchema, type Resume } from './schema'

export function loadResume(): Resume {
  const parsed = ResumeSchema.safeParse(resumeRaw)
  if (!parsed.success) {
    // In production you could log or surface validation errors
    return {} as Resume
  }
  return parsed.data
}
