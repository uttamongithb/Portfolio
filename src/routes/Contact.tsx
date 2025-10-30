import React from 'react'
import Page from '../components/Page'
import Container from '../components/Container'
import Reveal from '../components/Reveal'
import SectionHeader from '../components/SectionHeader'
import { loadResume } from '../shared/data'

export default function Contact() {
  const resume = loadResume()
  const email = resume.basics?.email
  const phone = resume.basics?.phone
  const profiles = resume.basics?.profiles || []

  return (
    <Page>
      <Container className="py-10">
        <Reveal>
          <section className="mb-10">
            <SectionHeader title="Contact" subtitle="Get in touch" />
            <div className="grid gap-4 sm:grid-cols-2">
              {email && (
                <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
                  <p className="font-medium">Email</p>
                  <a className="text-accent break-all" href={`mailto:${email}`}>{email}</a>
                </div>
              )}
              {phone && (
                <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
                  <p className="font-medium">Phone</p>
                  <a className="text-accent" href={`tel:${phone.replace(/\s+/g,'')}`}>{phone}</a>
                </div>
              )}
              {profiles.map((p: any, i: number) => (
                <div key={i} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
                  <p className="font-medium">{p.network}</p>
                  <a className="text-accent break-all" href={p.url} target="_blank" rel="noreferrer">{p.url}</a>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      </Container>
    </Page>
  )
}
