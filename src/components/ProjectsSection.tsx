import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FONT = {
  serif: 'Cormorant Garamond, Georgia, serif',
  accentSerif: 'Playfair Display, Georgia, serif',
  sans: 'Inter, system-ui, -apple-system, sans-serif',
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
    repo: 'https://github.com/uttamongithb/E-commerce-with-msg/',
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
    live: 'https://payroll-dashboard-navy.vercel.app',
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
    repo: 'https://github.com/uttamongithb/Chatting-Site',
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
    live: 'https://freelance-e-commerce-frontend.vercel.app/',
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
    live: 'https://expense-management-freelacer-web.vercel.app/dashboard',
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
    repo: 'https://github.com/uttamongithb/ideashare',
  },
]

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null!)
  const stickyRef = useRef<HTMLDivElement>(null!)
  const headingRef = useRef<HTMLDivElement>(null!)
  const imageViewportRef = useRef<HTMLDivElement>(null!)
  const imageTrackRef = useRef<HTMLDivElement>(null!)
  const detailRef = useRef<HTMLDivElement>(null!)

  const [activeIndex, setActiveIndex] = useState(0)
  const currentStepRef = useRef(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const headingLines = headingRef.current.querySelectorAll('[data-project-line]')
    const imageSlides = imageTrackRef.current.querySelectorAll<HTMLElement>('[data-image-slide]')
    const totalSteps = PROJECTS.length - 1

    const updateByProgress = (progress: number) => {
      if (!imageTrackRef.current) return

      const rawStep = totalSteps <= 0 ? 0 : progress * totalSteps
      const nextStep = Math.max(0, Math.min(totalSteps, Math.round(progress * totalSteps)))

      imageSlides.forEach((slide, index) => {
        if (reduceMotion) {
          gsap.set(slide, {
            yPercent: index === nextStep ? 0 : 100,
            scale: 1,
            autoAlpha: index === nextStep ? 1 : 0,
            zIndex: index + 1,
          })
          return
        }

        const incomingOffset = Math.max(0, index - rawStep)
        gsap.set(slide, {
          yPercent: incomingOffset * 100,
          scale: 1,
          autoAlpha: index <= Math.ceil(rawStep) + 1 ? 1 : 0,
          zIndex: index + 1,
          transformOrigin: 'center top',
        })
      })

      if (nextStep !== currentStepRef.current) {
        currentStepRef.current = nextStep
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
      },
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
      snap:
        reduceMotion || totalSteps <= 0
          ? undefined
          : {
              snapTo: (value: number) => Math.round(value * totalSteps) / totalSteps,
              directional: true,
              duration: { min: 0.1, max: 0.2 },
              delay: 0,
              ease: 'power1.inOut',
            },
      onUpdate: (self) => {
        updateByProgress(self.progress)
      },
    })

    slidesTrigger.refresh()
    updateByProgress(slidesTrigger.progress)

    const onResize = () => updateByProgress(slidesTrigger.progress)
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
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

  const active = PROJECTS[activeIndex]
  const progressPct = ((activeIndex + 1) / PROJECTS.length) * 100

  const scrollToProject = (index: number) => {
    const section = sectionRef.current
    if (!section) return

    const maxScroll = section.offsetHeight - window.innerHeight
    const targetY = section.offsetTop + maxScroll * (index / (PROJECTS.length - 1))
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-[#F7F3D6]"
      style={{ height: `${PROJECTS.length * 100}vh` }}
    >
      <div ref={stickyRef} className="relative h-screen overflow-hidden bg-[#F7F3D6]">
        <div className="relative h-full w-full px-6 py-10 md:px-10 lg:px-12">
          <div
            ref={headingRef}
            className="absolute left-6 top-1/2 z-30 hidden -translate-y-1/2 text-black md:block lg:left-8"
          >
            <div className="relative flex flex-col gap-3">
              {PROJECTS.map((_, index) => (
                <div key={index} className="flex h-3 items-center">
                  <button
                    type="button"
                    onClick={() => scrollToProject(index)}
                    className={`w-3 text-left font-serif text-xs italic leading-none transition-opacity ${
                      index === activeIndex ? 'opacity-100' : 'opacity-30'
                    }`}
                    style={{ fontFamily: FONT.accentSerif }}
                    aria-label={`Go to project ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                </div>
              ))}
              <div
                data-project-line
                className="absolute left-6 top-1/2 h-3 -translate-y-1/2 transition-transform duration-500 ease-out"
                style={{ transform: `translateY(${activeIndex * 24}px)` }}
              >
                <span className="h-px w-6 bg-black" />
              </div>
            </div>
          </div>

          <div
            ref={imageViewportRef}
            className="absolute left-1/2 top-1/2 z-10 h-[62vh] w-[88vw] min-w-[18rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-[0_18px_54px_rgba(17,17,17,0.22)] md:h-[76vh] md:w-[min(46vw,48rem)] md:min-w-[20rem]"
          >
            <div ref={imageTrackRef} className="relative h-full overflow-hidden">
              {PROJECTS.map((project, index) => (
                <article
                  key={project.title}
                  data-image-slide
                  className="absolute inset-0 h-full w-full overflow-hidden bg-[#EDE5DA] shadow-[0_-28px_80px_rgba(0,0,0,0.24)] will-change-transform"
                  aria-hidden={activeIndex !== index}
                >
                  <div data-image-media className="h-full w-full">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div ref={detailRef}>
            <h2
              data-detail-item
              className="absolute left-6 top-[16%] z-30 max-w-[calc(100vw-3rem)] font-sans text-[clamp(2.25rem,10.5vw,3.7rem)] font-black leading-[0.98] tracking-[-0.055em] text-black md:left-[8vw] md:top-1/2 md:max-w-[38vw] md:-translate-y-1/2 md:text-[clamp(2.65rem,4.7vw,5.7rem)]"
              style={{ fontFamily: FONT.sans }}
            >
              {active.title}
            </h2>

            <aside className="absolute right-[8vw] top-1/2 z-30 hidden w-[min(17vw,18rem)] -translate-y-1/2 md:block">
              <div
                data-detail-item
                className="font-sans text-[clamp(0.95rem,1.2vw,1.35rem)] font-black leading-[1.22] tracking-[-0.04em] text-black"
              >
                {active.tags.slice(0, 3).map((tag) => (
                  <p key={tag}>{tag.replace('Node.js', 'Node JS')}</p>
                ))}
              </div>

              <div data-detail-item className="mt-8 flex items-center gap-3">
                <a
                  href={active.live}
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans text-xs font-black uppercase tracking-[-0.02em] text-black underline decoration-black/40 underline-offset-4"
                  style={{ fontFamily: FONT.sans }}
                >
                  Live Link
                </a>
                {active.repo ? (
                  <a
                    href={active.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans text-xs font-black uppercase tracking-[-0.02em] text-black/60 underline decoration-black/25 underline-offset-4"
                    style={{ fontFamily: FONT.sans }}
                  >
                    Source
                  </a>
                ) : null}
              </div>
            </aside>

            <div className="absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 md:block lg:right-10">
              <div className="relative pl-10">
                <span
                  className="absolute left-0 top-3.5 h-px w-7 bg-black transition-transform duration-500 ease-out"
                  style={{ transform: `translateY(${activeIndex * 38}px)` }}
                />
                <div className="flex flex-col gap-2.5">
                {PROJECTS.map((project, index) => (
                  <button
                    key={project.title}
                    type="button"
                    onClick={() => scrollToProject(index)}
                    className="group block h-7 w-12 overflow-hidden bg-black/10"
                    aria-label={`Go to ${project.title}`}
                  >
                    <img
                      src={project.image}
                      alt=""
                      className={`h-full w-full object-cover transition-opacity duration-300 ${
                        index === activeIndex ? 'opacity-100' : 'opacity-55 group-hover:opacity-85'
                      }`}
                      loading="lazy"
                    />
                  </button>
                ))}
                </div>
              </div>
            </div>

            <div className="absolute inset-x-6 bottom-6 z-30 md:hidden">
              <div className="bg-[#F7F3D6]/90 p-4 shadow-[0_14px_42px_rgba(17,17,17,0.18)]">
                <p
                  data-detail-item
                  className="font-sans text-xs font-black uppercase tracking-[-0.02em] text-black"
                  style={{ fontFamily: FONT.sans }}
                >
                  {String(activeIndex + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')} - {active.type}
                </p>
                <p
                  data-detail-item
                  className="mt-2 font-sans text-sm font-semibold leading-snug text-black/70"
                  style={{ fontFamily: FONT.sans }}
                >
                  {active.summary}
                </p>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 z-30 hidden w-[min(46vw,48rem)] -translate-x-1/2 md:block">
              <div className="h-1 overflow-hidden bg-black/10">
                <div className="h-full bg-black transition-all duration-300" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
