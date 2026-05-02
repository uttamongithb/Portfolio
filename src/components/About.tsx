import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FONT = {
  serif: 'Cormorant Garamond, Georgia, serif',
  accentSerif: 'Playfair Display, Georgia, serif',
  sans: 'Inter, system-ui, -apple-system, sans-serif'
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null!)
  const stickyRef = useRef<HTMLDivElement>(null!)
  const bgTone1Ref = useRef<HTMLDivElement>(null!)
  const bgTone2Ref = useRef<HTMLDivElement>(null!)
  const bgTone3Ref = useRef<HTMLDivElement>(null!)
  const panel1Ref = useRef<HTMLDivElement>(null!)
  const panel2Ref = useRef<HTMLDivElement>(null!)
  const panel3Ref = useRef<HTMLDivElement>(null!)
  const dot1Ref = useRef<HTMLDivElement>(null!)
  const dot2Ref = useRef<HTMLDivElement>(null!)
  const dot3Ref = useRef<HTMLDivElement>(null!)
  const motifCoreRef = useRef<HTMLDivElement>(null!)
  const motifRingARef = useRef<HTMLDivElement>(null!)
  const motifRingBRef = useRef<HTMLDivElement>(null!)
  const motifRingCRef = useRef<HTMLDivElement>(null!)
  const activePanelRef = useRef(0)

  useEffect(() => {
    const panels = [panel1Ref.current, panel2Ref.current, panel3Ref.current]
    const tones = [bgTone1Ref.current, bgTone2Ref.current, bgTone3Ref.current]
    const motifRings = [motifRingARef.current, motifRingBRef.current, motifRingCRef.current]
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cleanupFns: Array<() => void> = []

    const prepareWordReveals = () => {
      panels.forEach((panel) => {
        panel.querySelectorAll<HTMLElement>('[data-about-words]').forEach((el) => {
          if (el.dataset.aboutWordsReady === 'true') return

          const mode = el.dataset.aboutWords ?? 'alt-lr'
          const text = (el.textContent ?? '').trim()
          if (!text) return

          const words = text.split(/\s+/)
          el.textContent = ''

          words.forEach((word, index) => {
            const wordEl = document.createElement('span')
            wordEl.textContent = word
            wordEl.style.display = 'inline-block'
            wordEl.style.whiteSpace = 'pre'
            wordEl.dataset.aboutWord = 'true'

            const isEven = index % 2 === 0
            if (mode === 'left') {
              wordEl.dataset.aboutWordDir = 'left'
            } else if (mode === 'right') {
              wordEl.dataset.aboutWordDir = 'right'
            } else if (mode === 'alt-rl') {
              wordEl.dataset.aboutWordDir = isEven ? 'right' : 'left'
            } else {
              wordEl.dataset.aboutWordDir = isEven ? 'left' : 'right'
            }

            el.appendChild(wordEl)
            if (index < words.length - 1) {
              el.appendChild(document.createTextNode(' '))
            }
          })

          el.dataset.aboutWordsReady = 'true'
        })
      })
    }

    const syncWordStepsByLine = (panel: HTMLDivElement) => {
      const words = Array.from(panel.querySelectorAll<HTMLElement>('[data-about-word="true"]'))
      if (!words.length) return

      const lines: HTMLElement[][] = []
      const tolerance = 3

      words.forEach((word) => {
        const top = word.offsetTop
        const existingLine = lines.find((line) => Math.abs(line[0].offsetTop - top) <= tolerance)
        if (existingLine) {
          existingLine.push(word)
        } else {
          lines.push([word])
        }
      })

      lines.forEach((line) => {
        line.forEach((word, indexInLine) => {
          word.dataset.aboutWordStep = String(indexInLine)
        })
      })
    }

    const setActivePanel = (index: 0 | 1 | 2, animate = false) => {
      panels.forEach((panel, panelIndex) => {
        gsap.set(panel, {
          autoAlpha: panelIndex === index ? 1 : 0,
          y: 0,
          pointerEvents: panelIndex === index ? 'auto' : 'none'
        })
      })

      tones.forEach((tone, toneIndex) => {
        gsap.to(tone, {
          autoAlpha: toneIndex === index ? 1 : 0,
          duration: animate ? 0.35 : 0,
          ease: 'power2.out'
        })
      })

      gsap.to(motifCoreRef.current, {
        scale: index === 0 ? 1 : index === 1 ? 1.08 : 1.15,
        backgroundColor: index === 2 ? '#232B36' : '#B89961',
        duration: animate ? 0.35 : 0,
        ease: 'power2.out'
      })

      motifRings.forEach((ring, ringIndex) => {
        const active = ringIndex === index
        gsap.to(ring, {
          opacity: active ? 1 : 0.45,
          borderColor: active ? '#B89961' : '#8B95A6',
          scale: active ? 1.04 : 1,
          duration: animate ? 0.35 : 0,
          ease: 'power2.out'
        })
      })

      if (animate && !reduceMotion) {
        const activePanel = panels[index]
        const upLines = activePanel.querySelectorAll('[data-about-reveal="up-line"]')
        const up = activePanel.querySelectorAll('[data-about-reveal="up"]')
        const left = activePanel.querySelectorAll('[data-about-reveal="left"]')
        const right = activePanel.querySelectorAll('[data-about-reveal="right"]')
        const words = activePanel.querySelectorAll<HTMLElement>('[data-about-word="true"]')

        syncWordStepsByLine(activePanel)

        gsap.killTweensOf([...upLines, ...up, ...left, ...right, ...words])

        gsap.fromTo(
          activePanel,
          { y: 18 },
          { y: 0, duration: 0.3, ease: 'power2.out' }
        )

        gsap.fromTo(
          upLines,
          { opacity: 0, y: '120%' },
          { opacity: 1, y: '0%', stagger: 0.14, duration: 0.52, ease: 'power3.out' }
        )

        gsap.fromTo(
          up,
          { opacity: 0, y: '120%' },
          { opacity: 1, y: '0%', stagger: 0.08, duration: 0.45, ease: 'power3.out' }
        )

        gsap.fromTo(
          left,
          { opacity: 0, x: -70 },
          { opacity: 1, x: 0, stagger: 0.06, duration: 0.45, ease: 'power3.out' }
        )

        gsap.fromTo(
          right,
          { opacity: 0, x: 70 },
          { opacity: 1, x: 0, stagger: 0.06, duration: 0.45, ease: 'power3.out' }
        )

        gsap.fromTo(
          words,
          {
            x: (_i, target) => ((target as HTMLElement).dataset.aboutWordDir === 'left' ? -40 : 40),
            opacity: 0
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.48,
            ease: 'power3.out',
            stagger: (_i, target) => Number((target as HTMLElement).dataset.aboutWordStep ?? 0) * 0.055
          }
        )
      }
    }

    prepareWordReveals()

    setActivePanel(0, true)

    const syncDots = (index: 0 | 1 | 2) => {
      const dots = [dot1Ref.current, dot2Ref.current, dot3Ref.current]
      dots.forEach((dot, i) => {
        gsap.to(dot, {
          scale: i === index ? 1.7 : 1,
          opacity: i === index ? 1 : 0.4,
          backgroundColor: i === index ? '#B89961' : '#8B95A6',
          boxShadow: i === index ? '0 0 0 2px rgba(184,153,97,0.25)' : '0 0 0 0px rgba(184,153,97,0)',
          duration: 0.24,
          ease: 'power2.out'
        })
      })
    }

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: stickyRef.current,
      pinSpacing: false,
      scrub: reduceMotion ? false : 1,
      anticipatePin: 1,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      snap: reduceMotion
        ? undefined
        : {
            snapTo: [0, 0.5, 1],
            duration: { min: 0.18, max: 0.45 },
            delay: 0.06,
            ease: 'power1.inOut'
          },
      onUpdate: (self) => {
        const nextActive: 0 | 1 | 2 = self.progress < 0.333 ? 0 : self.progress < 0.666 ? 1 : 2

        if (activePanelRef.current !== nextActive) {
          activePanelRef.current = nextActive
          setActivePanel(nextActive, true)
        }

        syncDots(nextActive)
      }
    })

    if (!reduceMotion) {
      const ringTweens = [
        gsap.to(motifRingARef.current, { rotate: 360, duration: 26, repeat: -1, ease: 'none' }),
        gsap.to(motifRingBRef.current, { rotate: -360, duration: 34, repeat: -1, ease: 'none' }),
        gsap.to(motifRingCRef.current, { rotate: 360, duration: 42, repeat: -1, ease: 'none' }),
        gsap.to(motifCoreRef.current, {
          scale: 1.06,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      ]

      cleanupFns.push(() => ringTweens.forEach((tween) => tween.kill()))

      const magneticTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'))
      magneticTargets.forEach((target) => {
        const onMove = (event: MouseEvent) => {
          const box = target.getBoundingClientRect()
          const dx = event.clientX - (box.left + box.width / 2)
          const dy = event.clientY - (box.top + box.height / 2)
          gsap.to(target, {
            x: dx * 0.08,
            y: dy * 0.08,
            duration: 0.25,
            ease: 'power2.out'
          })
        }
        const onLeave = () => {
          gsap.to(target, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' })
        }
        target.addEventListener('mousemove', onMove)
        target.addEventListener('mouseleave', onLeave)
        cleanupFns.push(() => {
          target.removeEventListener('mousemove', onMove)
          target.removeEventListener('mouseleave', onLeave)
        })
      })

      const tiltCards = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'))
      tiltCards.forEach((card) => {
        const onMove = (event: MouseEvent) => {
          const box = card.getBoundingClientRect()
          const rx = ((event.clientY - box.top) / box.height - 0.5) * -4
          const ry = ((event.clientX - box.left) / box.width - 0.5) * 5
          gsap.to(card, {
            rotateX: rx,
            rotateY: ry,
            y: -2,
            transformPerspective: 600,
            transformOrigin: 'center',
            duration: 0.25,
            ease: 'power2.out'
          })
        }
        const onLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          })
        }
        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
        cleanupFns.push(() => {
          card.removeEventListener('mousemove', onMove)
          card.removeEventListener('mouseleave', onLeave)
        })
      })
    }

    return () => {
      trigger.kill()
      cleanupFns.forEach((fn) => fn())
    }
  }, [])

  return (
    <section ref={sectionRef} id="about" style={{ height: '260vh' }}>
      <div ref={stickyRef} className="relative h-screen overflow-hidden bg-[#FAF9F6]">
        <div ref={bgTone1Ref} className="pointer-events-none absolute inset-0 z-0 bg-linear-to-b from-transparent via-[#B89961]/5 to-transparent opacity-100" />
        <div ref={bgTone2Ref} className="pointer-events-none absolute inset-0 z-0 bg-linear-to-br from-[#8B95A6]/8 via-transparent to-[#B89961]/3 opacity-0" />
        <div ref={bgTone3Ref} className="pointer-events-none absolute inset-0 z-0 bg-linear-to-tr from-[#232B36]/5 via-transparent to-[#B89961]/6 opacity-0" />
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#B89961]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-12 h-80 w-80 rounded-full bg-[#8B95A6]/10 blur-3xl" />

        <div className="pointer-events-none absolute inset-y-0 right-[8%] z-10 hidden items-center lg:flex">
          <div className="relative h-56 w-56">
            <div ref={motifRingARef} className="absolute inset-0 rounded-full border border-[#B89961]" />
            <div ref={motifRingBRef} className="absolute inset-4 rounded-full border border-[#8B95A6]" />
            <div ref={motifRingCRef} className="absolute inset-9 rounded-full border border-[#8B95A6]" />
            <div
              ref={motifCoreRef}
              className="absolute inset-0 m-auto h-4 w-4 rounded-full bg-[#B89961]"
            />
          </div>
        </div>

        <div className="absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 items-center gap-3 md:flex md:flex-col">
          <div ref={dot1Ref} className="h-2 w-2 rounded-full bg-[#B89961] opacity-100 will-change-transform" />
          <div ref={dot2Ref} className="h-2 w-2 rounded-full bg-[#8B95A6] opacity-40 will-change-transform" />
          <div ref={dot3Ref} className="h-2 w-2 rounded-full bg-[#8B95A6] opacity-40 will-change-transform" />
        </div>

        <div
          ref={panel1Ref}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
        >
          <p
            data-about-p1-line
            data-about-words="right"
            className="mb-6 font-sans text-[0.65rem] font-medium uppercase tracking-[0.32em] text-[#8B95A6]"
            style={{ fontFamily: FONT.sans }}
          >
            About Section
          </p>
          <h2
            data-about-p1-line
            className="max-w-5xl font-serif text-4xl font-bold leading-none tracking-tight text-[#232B36] md:text-6xl lg:text-7xl"
            style={{ fontFamily: FONT.serif }}
          >
            <span className="block overflow-hidden">
              <span data-about-reveal="up-line" className="inline-block">
                <span className="mr-3 font-light italic text-[#B89961] md:mr-5" style={{ fontFamily: FONT.accentSerif }}>
                  I build
                </span>
                high-end web experiences
              </span>
            </span>
            <span className="mt-1 block overflow-hidden md:mt-2">
              <span data-about-reveal="up-line" className="inline-block">
                that balance visual clarity and engineering depth.
              </span>
            </span>
          </h2>
          <p
            data-about-p1-line
            data-about-words="right"
            className="mt-8 max-w-2xl font-sans text-[0.95rem] font-light leading-relaxed tracking-wide text-[#8B95A6] md:text-base"
            style={{ fontFamily: FONT.sans }}
          >
            Scroll to explore how Uttam Kumar Bhartiya (Uttam Bhartiya), a full stack developer, thinks, builds, and delivers products with calm precision.
          </p>
        </div>

        <div
          ref={panel2Ref}
          className="absolute inset-0 z-20 flex items-center px-6 md:px-12 lg:px-20"
        >
          <div className="mx-auto grid w-full max-w-7xl gap-10 rounded-4xl border border-[#232B360F] bg-white/55 p-6 backdrop-blur-sm md:p-8 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <p
                data-about-p2-line
                data-about-words="right"
                className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.3em] text-[#8B95A6]"
                style={{ fontFamily: FONT.sans }}
              >
                Capability Layout
              </p>
              <h3
                data-about-p2-line
                className="font-serif text-4xl font-bold leading-none text-[#232B36] md:text-6xl"
                style={{ fontFamily: FONT.serif }}
              >
                <span className="block overflow-hidden">
                  <span data-about-reveal="up-line" className="inline-block">Strategy-led design</span>
                </span>
                <span className="mt-1 block overflow-hidden md:mt-2">
                  <span data-about-reveal="up-line" className="inline-block">with production focus.</span>
                </span>
              </h3>
              <p
                data-about-p2-line
                data-about-words="right"
                className="max-w-xl font-sans text-[0.95rem] font-light leading-relaxed tracking-wide text-[#8B95A6]"
                style={{ fontFamily: FONT.sans }}
              >
                I turn messy requirements into structured systems, then craft interfaces that feel premium without
                sacrificing speed, accessibility, or maintainability.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['Frontend', 'React • Tailwind • Motion'],
                ['Backend', 'Node • Express • MongoDB'],
                ['Quality', 'TypeScript • Testing • Linting'],
                ['Delivery', 'Vercel • Render • CI workflow']
              ].map(([title, value]) => (
                <div key={title} data-about-p2-line data-tilt className="rounded-2xl border border-[#232B3612] bg-white/80 p-5 backdrop-blur-sm">
                  <p
                    data-about-reveal="left"
                    className="text-2xl font-bold leading-none text-[#232B36]"
                    style={{ fontFamily: FONT.serif }}
                  >
                    {title}
                  </p>
                  <p
                    data-about-words="right"
                    className="mt-3 font-sans text-[0.78rem] font-medium uppercase tracking-[0.14em] text-[#8B95A6]"
                    style={{ fontFamily: FONT.sans }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={panel3Ref}
          className="absolute inset-0 z-20 flex items-center px-6 md:px-12 lg:px-20"
        >
          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.2fr_0.9fr] lg:gap-16">
            <div className="space-y-6">
              <p
                data-about-p3-line
                data-about-words="right"
                className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.3em] text-[#8B95A6]"
                style={{ fontFamily: FONT.sans }}
              >
                Journey Layout
              </p>
              <h3
                data-about-p3-line
                className="font-serif text-4xl font-bold leading-none text-[#232B36] md:text-6xl"
                style={{ fontFamily: FONT.serif }}
              >
                <span className="block overflow-hidden">
                  <span data-about-reveal="up-line" className="inline-block">From concept</span>
                </span>
                <span className="mt-1 block overflow-hidden md:mt-2">
                  <span data-about-reveal="up-line" className="inline-block">
                    <span className="italic font-light text-[#B89961]" style={{ fontFamily: FONT.accentSerif }}>
                      to launch
                    </span>
                  </span>
                </span>
              </h3>
              <p
                data-about-p3-line
                data-about-words="right"
                className="max-w-xl font-sans text-[0.95rem] font-light leading-relaxed tracking-wide text-[#8B95A6]"
                style={{ fontFamily: FONT.sans }}
              >
                I collaborate closely, communicate clearly, and ship iteratively so every milestone feels controlled,
                measurable, and genuinely valuable for the business.
              </p>

              <div data-about-p3-line className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#home"
                  data-magnetic
                  className="inline-flex min-h-12 items-center rounded-full border border-[#B89961] bg-transparent px-8 py-3.5 font-sans text-[0.65rem] font-medium uppercase tracking-[0.15em] text-[#B89961] transition-colors hover:bg-[#B89961] hover:text-white"
                  style={{ fontFamily: FONT.sans }}
                >
                  Back To Hero
                </a>
                <a
                  href="#about"
                  data-magnetic
                  className="relative inline-flex min-h-12 items-center whitespace-nowrap py-2 font-sans text-[0.65rem] font-medium uppercase tracking-[0.15em] text-[#8B95A6] transition-colors hover:text-[#B89961]"
                  style={{ fontFamily: FONT.sans }}
                >
                  Build With Me
                  <span className="absolute bottom-0 left-0 right-0 h-px origin-left scale-x-0 bg-[#B89961] transition-transform hover:scale-x-100" />
                </a>
              </div>

              <div data-about-p3-line className="flex flex-wrap gap-2 pt-1">
                {['On-time Delivery', 'Readable Architecture', 'Production Ready'].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#232B361A] bg-white/70 px-3 py-1 font-sans text-[0.62rem] font-medium uppercase tracking-[0.12em] text-[#8B95A6]"
                    style={{ fontFamily: FONT.sans }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div data-about-p3-line className="rounded-3xl border border-[#232B3614] bg-[#232B36] p-8 md:p-9">
              <p
                data-about-words="right"
                className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.3em] text-[#B89961]"
                style={{ fontFamily: FONT.sans }}
              >
                Snapshot
              </p>
              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-4xl font-bold leading-none text-white" style={{ fontFamily: FONT.serif }}>
                    20+
                  </p>
                  <p className="mt-2 font-sans text-[0.78rem] font-medium uppercase tracking-[0.14em] text-white/70" style={{ fontFamily: FONT.sans }}>
                    Project Builds
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-bold leading-none text-white" style={{ fontFamily: FONT.serif }}>
                    3+
                  </p>
                  <p className="mt-2 font-sans text-[0.78rem] font-medium uppercase tracking-[0.14em] text-white/70" style={{ fontFamily: FONT.sans }}>
                    Years Experience
                  </p>
                </div>
                <p data-about-words="right" className="font-sans text-[0.9rem] font-light leading-relaxed tracking-wide text-white/82" style={{ fontFamily: FONT.sans }}>
                  BCA (2022–2025), plus hands-on full-stack delivery in e-commerce, payroll, and realtime products.
                </p>

                <div className="space-y-2 border-t border-white/15 pt-4">
                  {[
                    ['Discovery to Wireframe', '1 week'],
                    ['Development Iterations', '2-4 weeks'],
                    ['QA + Deployment', '2-4 days']
                  ].map(([stage, timeline]) => (
                    <div key={stage} className="flex items-center justify-between gap-3">
                      <p className="font-sans text-[0.72rem] uppercase tracking-[0.14em] text-white/60" style={{ fontFamily: FONT.sans }}>
                        {stage}
                      </p>
                      <p className="font-sans text-[0.72rem] uppercase tracking-[0.14em] text-[#B89961]" style={{ fontFamily: FONT.sans }}>
                        {timeline}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
