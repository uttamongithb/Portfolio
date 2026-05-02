/**
 * Hero.tsx — 3-layout scroll hero container (v2)
 *
 * - 300vh outer section, sticky 100vh inner
 * - Manages mouseRef (set on window) and progressRef (set by ScrollTrigger)
 * - Passes both refs to HeroScene for zero-re-render Three.js animation
 * - Three HTML panels crossfade via GSAP scrubbed timeline
 * - Side floating nav dots + bottom-right progress indicator
 */
import { lazy, Suspense, useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const HeroScene = lazy(() => import('./HeroScene'))

const noMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ─── Tokens ────────────────────────────────────────────────────────────────────
const OFF_WHITE = '#FAF7F2'
const TERRACOTTA = '#E07A5F'
const SAGE = '#81A594'
const GOLD = '#C9A87C'


// ─── Hero ───────────────────────────────────────────────────────────────────────
export default function Hero() {

    // Refs
    const sectionRef = useRef<HTMLElement>(null!)
    const stickyRef = useRef<HTMLDivElement>(null!)
    const progressRef = useRef(0)
    const mouseRef = useRef({ x: 0, y: 0 })

    // Overlay panel refs
    const panel1Ref = useRef<HTMLDivElement>(null!)
    const panel2Ref = useRef<HTMLDivElement>(null!)
    const panel3Ref = useRef<HTMLDivElement>(null!)
    const activeLayoutRef = useRef<1 | 2 | 3>(1)

    // Nav dots
    const dot1Ref = useRef<HTMLButtonElement>(null!)
    const dot2Ref = useRef<HTMLButtonElement>(null!)
    const dot3Ref = useRef<HTMLButtonElement>(null!)

    useLayoutEffect(() => {
        // Mouse tracking
        const onMouse = (e: MouseEvent) => {
            mouseRef.current = {
                x: (e.clientX / window.innerWidth - 0.5) * 2,
                y: -(e.clientY / window.innerHeight - 0.5) * 2,
            }
        }
        window.addEventListener('mousemove', onMouse, { passive: true })

        const reduceMotion = noMotion()

        const panels = [panel1Ref.current, panel2Ref.current, panel3Ref.current]
        const dots = [dot1Ref, dot2Ref, dot3Ref]

        const prepareWordReveals = () => {
            panels.forEach((panel) => {
                panel.querySelectorAll<HTMLElement>('[data-reveal-words]').forEach((el) => {
                    if (el.dataset.wordsReady === 'true') return

                    const mode = el.dataset.revealWords ?? 'alt-lr'
                    const text = (el.textContent ?? '').trim()
                    if (!text) return

                    const words = text.split(/\s+/)
                    el.textContent = ''

                    words.forEach((word, index) => {
                        const wordEl = document.createElement('span')
                        wordEl.textContent = word
                        wordEl.style.display = 'inline-block'
                        wordEl.style.whiteSpace = 'pre'
                        wordEl.dataset.revealWord = 'true'

                        const isEven = index % 2 === 0
                        if (mode === 'left') {
                            wordEl.dataset.wordDir = 'left'
                        } else if (mode === 'right') {
                            wordEl.dataset.wordDir = 'right'
                        } else if (mode === 'alt-rl') {
                            wordEl.dataset.wordDir = isEven ? 'right' : 'left'
                        } else {
                            wordEl.dataset.wordDir = isEven ? 'left' : 'right'
                        }

                        el.appendChild(wordEl)
                        if (index < words.length - 1) {
                            el.appendChild(document.createTextNode(' '))
                        }
                    })

                    el.dataset.wordsReady = 'true'
                })
            })
        }

        const syncWordStepsByLine = (panel: HTMLDivElement) => {
            const words = Array.from(panel.querySelectorAll<HTMLElement>('[data-reveal-word="true"]'))
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
                    word.dataset.wordStep = String(indexInLine)
                })
            })
        }

        const syncDots = (activeIdx: number) => {
            dots.forEach((d, i) => {
                if (d.current) {
                    d.current.style.width = i === activeIdx ? '9px' : '5px'
                    d.current.style.height = i === activeIdx ? '9px' : '5px'
                    d.current.style.opacity = i === activeIdx ? '1' : '0.45'
                }
            })
        }

        const setActiveLayout = (layout: 1 | 2 | 3, animate = false) => {
            panels.forEach((panel, index) => {
                const isActive = index === layout - 1
                gsap.set(panel, {
                    opacity: isActive ? 1 : 0,
                    y: 0,
                    pointerEvents: isActive ? 'auto' : 'none'
                })
            })

            syncDots(layout - 1)

            if (animate && !reduceMotion) {
                gsap.fromTo(
                    panels[layout - 1],
                    { y: 22 },
                    { y: 0, duration: 0.28, ease: 'power2.out' }
                )

                const activePanel = panels[layout - 1]
                const up = activePanel.querySelectorAll('[data-reveal="up"]')
                const left = activePanel.querySelectorAll('[data-reveal="left"]')
                const right = activePanel.querySelectorAll('[data-reveal="right"]')
                const wordSpans = activePanel.querySelectorAll<HTMLElement>('[data-reveal-word="true"]')

                syncWordStepsByLine(activePanel)

                gsap.killTweensOf([...up, ...left, ...right, ...wordSpans])

                gsap.fromTo(
                    up,
                    { y: '120%', opacity: 0 },
                    { y: '0%', opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08 }
                )

                gsap.fromTo(
                    left,
                    { x: -80, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.08 }
                )

                gsap.fromTo(
                    right,
                    { x: 80, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.08 }
                )

                gsap.fromTo(
                    wordSpans,
                    {
                        x: (_i, target) =>
                            (target as HTMLElement).dataset.wordDir === 'left' ? -48 : 48,
                        opacity: 0,
                    },
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.52,
                        ease: 'power3.out',
                        stagger: (_i, target) => Number((target as HTMLElement).dataset.wordStep ?? 0) * 0.06,
                    }
                )
            }
        }

        const getLayoutFromProgress = (progress: number): 1 | 2 | 3 =>
            progress < 0.38 ? 1 : progress < 0.72 ? 2 : 3

        const detectInitialLayout = (): 1 | 2 | 3 => {
            const section = sectionRef.current
            const sectionTop = section.offsetTop
            const sectionHeight = section.offsetHeight
            const scrollable = Math.max(sectionHeight - window.innerHeight, 1)
            const progress = Math.min(Math.max((window.scrollY - sectionTop) / scrollable, 0), 1)

            progressRef.current = progress
            return getLayoutFromProgress(progress)
        }

        prepareWordReveals()

        // Initial state: strict single-panel visibility based on current scroll (supports refresh mid-section)
        const initialLayout = detectInitialLayout()
        activeLayoutRef.current = initialLayout
        setActiveLayout(initialLayout, false)

        if (!reduceMotion && initialLayout === 1) {
            setTimeout(() => {
                setActiveLayout(1, true)
            }, 40)
        }

        // Single ScrollTrigger controls both progress and active layout
        const st = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            pin: stickyRef.current,
            pinSpacing: false,
            scrub: reduceMotion ? false : 1.1,
            anticipatePin: 1,
            fastScrollEnd: true,
            onUpdate: (self) => {
                progressRef.current = self.progress
                const nextLayout = getLayoutFromProgress(self.progress)

                if (nextLayout !== activeLayoutRef.current) {
                    activeLayoutRef.current = nextLayout
                    setActiveLayout(nextLayout, true)
                }
            },
        })

        st.refresh()
        st.update()

        return () => {
            window.removeEventListener('mousemove', onMouse)
            st.kill()
        }
    }, [])

    // Nav dot scroll helpers
    const scrollToLayout = (layout: 1 | 2 | 3) => {
        const section = sectionRef.current
        if (!section) return
        const progress = layout === 1 ? 0 : layout === 2 ? 0.50 : 0.83
        const top = section.getBoundingClientRect().top + window.scrollY
        const height = section.getBoundingClientRect().height
        window.scrollTo({ top: top + progress * height, behavior: 'smooth' })
    }

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,700;1,700&family=Inter:wght@300;400;500&display=swap"
                rel="stylesheet"
            />

            {/* ── 300vh scroll section ── */}
            <section
                ref={sectionRef}
                id="home"
                aria-label="Hero"
                style={{ height: '300vh' }}
            >
                {/* ── Sticky 100vh container ── */}
                <div
                    ref={stickyRef}
                    style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}
                >
                    {/* ── Three.js canvas ── */}
                    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                        <Suspense fallback={null}>
                            <HeroScene progressRef={progressRef} mouseRef={mouseRef} />
                        </Suspense>
                    </div>

                    {/* ════════════════════════════════════════════════════════
                        PANEL 1 — Minimalist Center Alignment (Reference Image Theme)
                    ════════════════════════════════════════════════════════ */}
                    <div
                        ref={panel1Ref}
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center pointer-events-auto opacity-100"
                    >
                        {/* Decorative Line & Role */}
                        <div className="mb-5 overflow-hidden md:mb-6">
                            <div data-reveal="up" className="flex items-center gap-4">
                                <span className="h-px w-8 bg-[#D4C4A8] md:w-12"></span>
                                <span data-reveal-words="right" className="font-sans text-[0.65rem] md:text-xs tracking-[0.3em] uppercase text-[#8B95A6]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Full-Stack Developer
                                </span>
                                <span className="h-px w-8 bg-[#D4C4A8] md:w-12"></span>
                            </div>
                        </div>

                        {/* Name: Creative Typography mix */}
                        <div className="overflow-hidden">
                            <h1 data-reveal="up" className="font-serif text-6xl md:text-[5.5rem] lg:text-[6.5rem] tracking-tight text-[#232B36] mb-6 md:mb-8 leading-none">
                                <span className="italic font-light text-[#B89961] mr-3 md:mr-6 text-5xl md:text-[4.5rem]" style={{ fontFamily: "'Playfair Display', serif" }}>I'm</span>
                                <span className="font-bold relative inline-block" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                    Uttam
                                    <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-linear-to-r from-transparent via-[#B89961] to-transparent opacity-70 md:-bottom-4 md:h-0.75"></span>
                                </span>
                            </h1>
                        </div>

                        {/* Extended Description */}
                        <div className="overflow-hidden">
                            <p data-reveal-words="right" className="font-sans font-light text-[0.85rem] md:text-base tracking-wide text-[#70798C] mb-12 max-w-lg md:max-w-xl leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Building digital experiences with intention. A passionate developer focused on creating elegant, high-performance web applications that merge stunning design with seamless functionality.
                            </p>
                        </div>

                        <div className="overflow-hidden">
                            <div data-reveal="up" className="pointer-events-auto flex flex-col sm:flex-row gap-6 md:gap-8 items-center justify-center">
                                {/* Primary Button */}
                                <a href="#projects" className="font-sans font-medium text-[0.65rem] md:text-xs tracking-[0.15em] uppercase border border-[#B89961] bg-transparent text-[#B89961] px-8 py-3.5 rounded-full hover:bg-[#B89961] hover:text-[#FFFFFF] transition-colors shadow-[0_4px_14px_rgba(184,153,97,0.15)] hover:shadow-none" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    View Projects
                                </a>
                                {/* Secondary Link */}
                                <a href="#about" className="font-sans font-medium text-[0.65rem] md:text-xs tracking-[0.15em] uppercase text-[#8B95A6] hover:text-[#B89961] transition-colors relative group py-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Read My Story
                                    <span className="absolute bottom-0 left-0 right-0 h-px bg-[#B89961] scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ════════════════════════════════════════════════════════
                        PANEL 2 — Tech Stack
                    ════════════════════════════════════════════════════════ */}
                    <div
                        ref={panel2Ref}
                        style={{
                            position: 'absolute', inset: 0, zIndex: 10,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', padding: '7vh 24px 0',
                            textAlign: 'center', pointerEvents: 'none', opacity: 0,
                        }}
                    >
                        <div className="overflow-hidden">
                            <span data-reveal-words="right" style={{
                                fontFamily: "'Inter', sans-serif", fontSize: '0.64rem',
                                fontWeight: 500, letterSpacing: '0.34em', color: SAGE,
                                textTransform: 'uppercase', marginBottom: 16,
                                textShadow: `0 0 20px ${SAGE}88`,
                            }}>
                                My Arsenal
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <h2 data-reveal="up" style={{
                                fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontStyle: 'italic',
                                fontSize: 'clamp(2.6rem, 6.5vw, 5rem)', lineHeight: 0.95,
                                color: OFF_WHITE, marginBottom: 14,
                                textShadow: '0 2px 30px rgba(0,0,0,0.60)',
                            }}>
                                Technologies<br />I Master
                            </h2>
                        </div>
                        <div className="overflow-hidden">
                            <p data-reveal-words="right" style={{
                                fontFamily: "'Inter', sans-serif", fontWeight: 300,
                                fontSize: 'clamp(0.78rem, 1.8vw, 0.95rem)',
                                color: `${OFF_WHITE}80`, letterSpacing: '0.06em',
                                maxWidth: 400,
                            }}>
                                Full-stack expertise across modern ecosystems
                            </p>
                        </div>
                    </div>

                    {/* ════════════════════════════════════════════════════════
                        PANEL 3 — Featured Work
                    ════════════════════════════════════════════════════════ */}
                    <div
                        ref={panel3Ref}
                        style={{
                            position: 'absolute', inset: 0, zIndex: 10,
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', padding: '7vh 24px 0',
                            textAlign: 'center', pointerEvents: 'none', opacity: 0,
                        }}
                    >
                        <div className="overflow-hidden">
                            <span data-reveal-words="right" style={{
                                fontFamily: "'Inter', sans-serif", fontSize: '0.64rem',
                                fontWeight: 500, letterSpacing: '0.34em', color: TERRACOTTA,
                                textTransform: 'uppercase', marginBottom: 16,
                                textShadow: `0 0 20px ${TERRACOTTA}88`,
                            }}>
                                Portfolio
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <h2 data-reveal="up" style={{
                                fontFamily: '"Cormorant Garamond", serif', fontWeight: 700, fontStyle: 'italic',
                                fontSize: 'clamp(2.6rem, 6.5vw, 5rem)', lineHeight: 0.95,
                                color: OFF_WHITE, marginBottom: 14,
                                textShadow: '0 2px 30px rgba(0,0,0,0.60)',
                            }}>
                                Featured<br />Work
                            </h2>
                        </div>
                        <div className="overflow-hidden">
                            <p data-reveal-words="right" style={{
                                fontFamily: "'Inter', sans-serif", fontWeight: 300,
                                fontSize: 'clamp(0.78rem, 1.8vw, 0.95rem)',
                                color: `${OFF_WHITE}80`, letterSpacing: '0.06em',
                                marginBottom: 28, maxWidth: 360,
                            }}>
                                Crafted with care, built to last
                            </p>
                        </div>
                        <div className="overflow-hidden">
                            <a
                                data-reveal="up"
                                href="#projects"
                                style={{
                                    pointerEvents: 'auto',
                                    position: 'absolute',
                                    left: '50%',
                                    bottom: '9vh',
                                    transform: 'translateX(-50%)',
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '0.70rem', fontWeight: 500,
                                    letterSpacing: '0.20em', textTransform: 'uppercase',
                                    color: OFF_WHITE, background: TERRACOTTA,
                                    border: `1.5px solid ${TERRACOTTA}`,
                                    borderRadius: 999, padding: '12px 30px',
                                    textDecoration: 'none',
                                    boxShadow: `0 4px 24px ${TERRACOTTA}55`,
                                    transition: 'transform 0.25s ease',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(-50%) scale(1)')}
                            >
                                View Projects <ArrowRight size={12} />
                            </a>
                        </div>
                    </div>


                    {/* ── Side nav dots ── */}
                    <div style={{
                        position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
                        zIndex: 12, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center',
                    }}>
                        {[
                            { ref: dot1Ref, label: 'Architectural', color: TERRACOTTA, layout: 1 as const },
                            { ref: dot2Ref, label: 'Tech Stack', color: SAGE, layout: 2 as const },
                            { ref: dot3Ref, label: 'Portfolio', color: GOLD, layout: 3 as const },
                        ].map(({ ref: dRef, label, color, layout }) => (
                            <button
                                key={layout}
                                ref={dRef as React.RefObject<HTMLButtonElement>}
                                title={label}
                                onClick={() => scrollToLayout(layout)}
                                style={{
                                    width: layout === 1 ? 9 : 5, height: layout === 1 ? 9 : 5,
                                    borderRadius: '50%', border: 'none', display: 'block',
                                    background: layout === 1 ? color : `${color}66`,
                                    cursor: 'pointer', padding: 0,
                                    opacity: layout === 1 ? 1 : 0.45,
                                    transition: 'all 0.35s ease',
                                }}
                            />
                        ))}
                    </div>

                    {/* ── Fade to next section ── */}
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0, height: 64,
                            zIndex: 3,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)',
                            pointerEvents: 'none',
                        }}
                    />
                </div>
            </section>

            <style>{`
                @keyframes heroChev {
                    0%, 100% { transform: translateY(0);  opacity: 0.65;}
                    50%      { transform: translateY(6px); opacity: 0.30;}
                }
            `}</style>
        </>
    )
}
