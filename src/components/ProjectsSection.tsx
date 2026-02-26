import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FONT = {
  serif: 'Cormorant Garamond, Georgia, serif',
  accentSerif: 'Playfair Display, Georgia, serif',
  sans: 'Inter, system-ui, -apple-system, sans-serif'
}

type Project = {
  type: string
  period: string
  title: string
  summary: string
  outcome: string
  impact: string
  accent: string
  tags: string[]
  image: string
  live: string
  repo?: string
}

const PROJECTS: Project[] = [
  {
    type: 'Web App',
    period: 'Q4 2025',
    title: 'ShopNow E-commerce (MERN)',
    summary: 'Full-stack e-commerce with secure payments, admin dashboard, and order tracking.',
    outcome: 'End-to-end purchase flow with secure checkout and clear admin control.',
    impact: 'Conversion-first shopping experience',
    accent: '#B89961',
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT'],
    image: '/shopnow.png',
    live: 'https://e-commerce-with-msg.vercel.app/',
    repo: 'https://github.com/uttamongithb/E-commerce-with-msg/'
  },
  {
    type: 'Web App',
    period: 'Q4 2025',
    title: 'Payroll Management System',
    summary: 'Role-based payroll platform with JWT auth, leave approvals, and analytics dashboards.',
    outcome: 'Operational workflows streamlined across Admin, Manager, and Employee roles.',
    impact: 'Faster approvals, better payroll visibility',
    accent: '#81A594',
    tags: ['React', 'TypeScript', 'Express', 'MongoDB', 'Recharts'],
    image: '/payroll-dashboard.png',
    live: 'https://payroll-dashboard-navy.vercel.app'
  },
  {
    type: 'Realtime App',
    period: 'Q4 2025',
    title: 'Realtime Chat Site',
    summary: 'Express + Socket.IO app with login/signup and one-to-one realtime messaging.',
    outcome: 'Low-latency direct messaging with lightweight architecture and simple UX.',
    impact: 'Instant communication feedback loop',
    accent: '#6D8ED8',
    tags: ['Node.js', 'Express', 'Socket.IO', 'WebSocket'],
    image: '/realtime-chat.png',
    live: 'https://chatting-site-qzm4.onrender.com/',
    repo: 'https://github.com/uttamongithb/Chatting-Site'
  },
  {
    type: 'Web App',
    period: 'Q4 2025',
    title: 'ShopHub E-commerce Store',
    summary: 'Production-ready MERN store with Stripe checkout, admin controls, and reviews.',
    outcome: 'Scalable e-commerce baseline with trust-building reviews and secure transactions.',
    impact: 'Production-ready retail foundation',
    accent: '#7E88C6',
    tags: ['React', 'Express', 'MongoDB', 'Stripe', 'JWT'],
    image: '/shophub-store.png',
    live: 'https://freelance-e-commerce-frontend.vercel.app/'
  },
  {
    type: 'Enterprise App',
    period: 'Q4 2025',
    title: 'Expense Management System',
    summary: 'Enterprise expense system with OCR receipts, approval flow, and RBAC.',
    outcome: 'Automated submission-to-approval cycle with policy-aware role access.',
    impact: 'Reduced manual overhead in finance ops',
    accent: '#4E93B5',
    tags: ['React', 'TypeScript', 'NestJS', 'Firebase', 'OCR'],
    image: '/expense-management.png',
    live: 'https://expense-management-freelacer-web.vercel.app/dashboard'
  },
  {
    type: 'Web Platform',
    period: 'Q4 2025',
    title: 'IdeaShare Platform',
    summary: 'MERN idea-sharing platform with GSAP motion and realtime updates.',
    outcome: 'Interactive publishing experience with realtime updates and expressive motion.',
    impact: 'Higher engagement through live interactions',
    accent: '#C27D5A',
    tags: ['React', 'Express', 'MongoDB', 'Socket.IO', 'GSAP'],
    image: '/ideashare-platform.png',
    live: 'https://ideashare-eta.vercel.app/',
    repo: 'https://github.com/uttamongithb/ideashare'
  }
]

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null!)
  const stickyRef = useRef<HTMLDivElement>(null!)
  const headingRef = useRef<HTMLDivElement>(null!)
  const imageViewportRef = useRef<HTMLDivElement>(null!)
  const imageTrackRef = useRef<HTMLDivElement>(null!)
  const detailRef = useRef<HTMLDivElement>(null!)
  const imageFloatTweenRef = useRef<gsap.core.Tween | null>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const currentStepRef = useRef(0)
  const trackTweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const headingLines = headingRef.current.querySelectorAll('[data-project-line]')
    const imageSlides = imageTrackRef.current.querySelectorAll('[data-image-slide]')
    const totalSteps = PROJECTS.length - 1

    const updateByProgress = (progress: number) => {
      if (!imageViewportRef.current || !imageTrackRef.current) return

      const viewportHeight = imageViewportRef.current.clientHeight
      const nextStep = Math.max(0, Math.min(totalSteps, Math.round(progress * totalSteps)))

      if (nextStep !== currentStepRef.current) {
        currentStepRef.current = nextStep
        trackTweenRef.current?.kill()

        if (reduceMotion) {
          gsap.set(imageTrackRef.current, { y: -nextStep * viewportHeight })
        } else {
          trackTweenRef.current = gsap.to(imageTrackRef.current, {
            y: -nextStep * viewportHeight,
            duration: 0.46,
            ease: 'power3.out',
            overwrite: 'auto'
          })
        }
      }

      setActiveIndex((prev) => (prev === nextStep ? prev : nextStep))
    }

    const headingTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        if (reduceMotion) return
        gsap.fromTo(
          headingLines,
          { opacity: 0, y: '120%' },
          { opacity: 1, y: '0%', duration: 0.64, stagger: 0.12, ease: 'power3.out' }
        )
      }
    })

    const slidesTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: stickyRef.current,
      pinSpacing: false,
      scrub: reduceMotion ? false : 0.9,
      anticipatePin: 1,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      snap: reduceMotion || totalSteps <= 0
        ? undefined
        : {
            snapTo: (value: number) => Math.round(value * totalSteps) / totalSteps,
            directional: true,
            duration: { min: 0.1, max: 0.2 },
            delay: 0,
            ease: 'power1.inOut'
          },
      onUpdate: (self) => {
        updateByProgress(self.progress)
      }
    })

    if (!reduceMotion) {
      gsap.fromTo(
        imageSlides,
        { opacity: 0, y: 26, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.62, stagger: 0.07, ease: 'power3.out' }
      )
    }

    slidesTrigger.refresh()
    updateByProgress(slidesTrigger.progress)

    const onResize = () => updateByProgress(slidesTrigger.progress)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      trackTweenRef.current?.kill()
      imageFloatTweenRef.current?.kill()
      headingTrigger.kill()
      slidesTrigger.kill()
    }
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const items = detailRef.current.querySelectorAll('[data-detail-item]')
    gsap.fromTo(
      items,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.045, ease: 'power3.out' }
    )
  }, [activeIndex])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const imageTrack = imageTrackRef.current
    if (!imageTrack) return

    const medias = imageTrack.querySelectorAll<HTMLElement>('[data-image-media]')
    const glows = imageTrack.querySelectorAll<HTMLElement>('[data-image-glow]')

    imageFloatTweenRef.current?.kill()

    if (reduceMotion) {
      medias.forEach((media) => {
        gsap.set(media, { scale: 1, y: 0, opacity: 1, filter: 'none' })
      })
      glows.forEach((glow) => {
        gsap.set(glow, { opacity: 1 })
      })
      return
    }

    medias.forEach((media, index) => {
      if (index !== activeIndex) {
        gsap.set(media, { scale: 1, y: 0, opacity: 0.92, filter: 'saturate(0.96) contrast(0.98)' })
      }
    })

    const activeMedia = medias[activeIndex]
    const activeGlow = glows[activeIndex]

    if (activeMedia) {
      gsap.fromTo(
        activeMedia,
        { scale: 1.05, y: 20, opacity: 0.7, filter: 'saturate(0.9) contrast(0.94)' },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          filter: 'saturate(1) contrast(1)',
          duration: 0.72,
          ease: 'power3.out',
          overwrite: 'auto'
        }
      )

      imageFloatTweenRef.current = gsap.to(activeMedia, {
        y: -5,
        scale: 1.012,
        duration: 3.2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })
    }

    if (activeGlow) {
      gsap.fromTo(
        activeGlow,
        { opacity: 0.35 },
        { opacity: 0.6, duration: 0.64, ease: 'power2.out', overwrite: 'auto' }
      )
    }

    return () => {
      imageFloatTweenRef.current?.kill()
    }
  }, [activeIndex])

  const active = PROJECTS[activeIndex]
  const progressPct = ((activeIndex + 1) / PROJECTS.length) * 100

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-[#FAF9F6]"
      style={{ height: `${PROJECTS.length * 100}vh` }}
    >
      <div ref={stickyRef} className="h-screen overflow-hidden">
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#B89961]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#8B95A6]/10 blur-3xl" />

        <div className="mx-auto flex h-full max-w-7xl flex-col px-6 pb-8 pt-16 md:px-10 md:pt-16 lg:px-16">
          <div ref={headingRef} className="mb-7">
            <p
              className="mb-3 font-sans text-[0.65rem] font-medium uppercase tracking-[0.32em] text-[#8B95A6]"
              style={{ fontFamily: FONT.sans }}
            >
              Case Studies
            </p>

            <div className="overflow-hidden text-left">
              <h2
                data-project-line
                className="font-serif text-4xl font-bold leading-none tracking-tight text-[#232B36] md:text-6xl"
                style={{ fontFamily: FONT.serif }}
              >
                Curated
                <span className="ml-3 font-light italic text-[#B89961]" style={{ fontFamily: FONT.accentSerif }}>
                  work
                </span>
              </h2>
            </div>

            <div className="mt-2 overflow-hidden text-left">
              <p
                data-project-line
                className="max-w-2xl font-sans text-[0.95rem] font-light leading-relaxed tracking-wide text-[#8B95A6]"
                style={{ fontFamily: FONT.sans }}
              >
                Image progression is scroll-driven. Description remains fixed and updates for each case study.
              </p>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            <div
              ref={imageViewportRef}
              className="relative h-full min-h-105 overflow-hidden rounded-3xl border border-[#232B3614] bg-white/70 shadow-[0_10px_30px_rgba(35,43,54,0.06)]"
            >
              <div ref={imageTrackRef} className="h-full will-change-transform">
                {PROJECTS.map((project, index) => (
                  <article
                    key={project.title}
                    data-image-slide
                    className="relative h-full w-full overflow-hidden p-3 md:p-4"
                    aria-hidden={activeIndex !== index}
                  >
                    <div className="relative h-full overflow-hidden rounded-3xl border border-[#232B3618] bg-[#EEF1F5]">
                      <div data-image-media className="h-full w-full will-change-transform">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div
                        data-image-glow
                        className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#232B36]/26 via-[#232B36]/4 to-transparent"
                      />

                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 md:p-6">
                        <div>
                          <p
                            className="mb-1 font-sans text-[0.62rem] font-medium uppercase tracking-[0.2em] text-white/80"
                            style={{ fontFamily: FONT.sans }}
                          >
                            {String(index + 1).padStart(2, '0')} · {project.type}
                          </p>
                          <p
                            className="font-serif text-3xl font-bold leading-none text-white md:text-4xl"
                            style={{ fontFamily: FONT.serif }}
                          >
                            {project.title}
                          </p>
                        </div>
                        <span
                          className={`rounded-full border px-3 py-1 font-sans text-[0.58rem] font-medium uppercase tracking-[0.14em] backdrop-blur-sm ${
                            activeIndex === index
                              ? 'border-[#B89961] bg-[#B89961]/20 text-white'
                              : 'border-white/35 bg-white/10 text-white/85'
                          }`}
                          style={{ fontFamily: FONT.sans }}
                        >
                          {activeIndex === index ? 'Active' : project.period}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="h-full min-h-105 overflow-hidden">
              <div
                ref={detailRef}
                className="h-full rounded-3xl border border-[#232B3614] bg-white/80 p-6 shadow-[0_14px_36px_rgba(35,43,54,0.09)] backdrop-blur-sm md:p-7"
              >
                <div data-detail-item className="mb-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p
                      className="font-sans text-[0.6rem] font-medium uppercase tracking-[0.22em] text-[#8B95A6]"
                      style={{ fontFamily: FONT.sans }}
                    >
                      Case Progress
                    </p>
                    <p
                      className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[#8B95A6]"
                      style={{ fontFamily: FONT.sans }}
                    >
                      {String(activeIndex + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
                    </p>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#232B360D]">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%`, backgroundColor: active.accent }}
                    />
                  </div>
                </div>

                <p
                  data-detail-item
                  className="mb-3 font-sans text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[#8B95A6]"
                  style={{ fontFamily: FONT.sans }}
                >
                  {String(activeIndex + 1).padStart(2, '0')} · {active.type} · {active.period}
                </p>

                <h3
                  data-detail-item
                  className="font-serif text-4xl font-bold leading-none text-[#232B36] md:text-5xl"
                  style={{ fontFamily: FONT.serif }}
                >
                  {active.title}
                </h3>

                <p
                  data-detail-item
                  className="mt-3 inline-flex rounded-full border border-[#232B3618] bg-white/75 px-3 py-1 font-sans text-[0.62rem] font-medium uppercase tracking-[0.12em]"
                  style={{ fontFamily: FONT.sans, color: active.accent }}
                >
                  {active.impact}
                </p>

                <p
                  data-detail-item
                  className="mt-5 max-w-xl font-sans text-[0.95rem] font-light leading-relaxed tracking-wide text-[#6D7688]"
                  style={{ fontFamily: FONT.sans }}
                >
                  {active.summary}
                </p>

                <p
                  data-detail-item
                  className="mt-4 max-w-xl border-l-2 border-[#232B361A] pl-3 font-sans text-[0.86rem] font-light leading-relaxed tracking-wide text-[#7C8596]"
                  style={{ fontFamily: FONT.sans, borderLeftColor: `${active.accent}66` }}
                >
                  {active.outcome}
                </p>

                <div data-detail-item className="mt-5 flex flex-wrap gap-2">
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#232B3618] bg-white/75 px-3 py-1 font-sans text-[0.6rem] font-medium uppercase tracking-[0.14em] text-[#8B95A6]"
                      style={{ fontFamily: FONT.sans }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div data-detail-item className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href={active.live}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center rounded-full border px-5 py-2.5 font-sans text-[0.62rem] font-medium uppercase tracking-[0.16em] transition-colors hover:text-white"
                    style={{ fontFamily: FONT.sans, borderColor: active.accent, color: active.accent }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.backgroundColor = active.accent
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    View Details
                  </a>

                  {active.repo ? (
                    <a
                      href={active.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center rounded-full border border-[#232B3624] px-5 py-2.5 font-sans text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#6D7688] transition-colors hover:border-[#8B95A6] hover:text-[#232B36]"
                      style={{ fontFamily: FONT.sans }}
                    >
                      Source
                    </a>
                  ) : null}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
