import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SKILLS = [
    { name: 'React', icon: '⚛️', level: 90 },
    { name: 'Node.js', icon: '🟢', level: 85 },
    { name: 'TypeScript', icon: '🔷', level: 80 },
    { name: 'MongoDB', icon: '🍃', level: 82 },
    { name: 'Express.js', icon: '🚂', level: 84 },
    { name: 'Tailwind CSS', icon: '🎨', level: 92 },
    { name: 'Next.js', icon: '▲', level: 72 },
    { name: 'Git & GitHub', icon: '🐙', level: 88 },
    { name: 'REST APIs', icon: '🔌', level: 87 },
    { name: 'Stripe', icon: '💳', level: 75 },
    { name: 'Socket.IO', icon: '⚡', level: 73 },
    { name: 'Vercel/Render', icon: '☁️', level: 85 },
]

function SkillChip({ skill, delay }: { skill: typeof SKILLS[0]; delay: number }) {
    const ref = useRef<HTMLDivElement>(null!)

    useEffect(() => {
        // Entrance
        gsap.fromTo(ref.current,
            { opacity: 0, scale: 0.75, y: 24 },
            {
                opacity: 1, scale: 1, y: 0, duration: 0.7, delay, ease: 'back.out(1.8)',
                scrollTrigger: { trigger: ref.current, start: 'top 90%' }
            })

        // Floating loop
        gsap.to(ref.current, {
            y: -(4 + Math.random() * 5),
            duration: 1.8 + Math.random() * 0.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: Math.random() * 1.5,
        })
    }, [delay])

    return (
        <div ref={ref}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl cursor-default
                 transition-all duration-300 hover:scale-[1.06] hover:shadow-lg"
            style={{
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,122,89,0.16)',
                backdropFilter: 'blur(10px)',
            }}
        >
            <span className="text-xl">{skill.icon}</span>
            <div>
                <div className="text-sm font-bold text-[#1F2937]">{skill.name}</div>
                {/* Skill bar */}
                <div className="w-16 h-1 rounded-full mt-1 overflow-hidden" style={{ background: 'rgba(255,122,89,0.15)' }}>
                    <div className="h-full rounded-full" style={{ width: `${skill.level}%`, background: '#FF7A59' }} />
                </div>
            </div>
        </div>
    )
}

export default function Skills() {
    const sectionRef = useRef<HTMLElement>(null!)
    const labelRef = useRef<HTMLParagraphElement>(null!)
    const headingRef = useRef<HTMLHeadingElement>(null!)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(labelRef.current,
                { opacity: 0, y: 20 }, {
                    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' }
            })

            gsap.fromTo(headingRef.current,
                { opacity: 0, x: -50 }, {
                    opacity: 1, x: 0, duration: 1.1, ease: 'power3.out',
                scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} id="skills"
            className="py-32 px-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #ffffff 0%, #FFF8F0 100%)' }}
        >
            {/* Decorative orb */}
            <div className="pointer-events-none absolute -right-20 bottom-0 w-80 h-80 rounded-full blur-3xl opacity-20"
                style={{ background: '#FF7A59' }} />

            <div className="max-w-6xl mx-auto">
                <div className="mb-16 space-y-4">
                    <p ref={labelRef} className="text-sm font-bold tracking-[0.25em] uppercase opacity-0"
                        style={{ color: '#FF7A59' }}>
                        03 — Skills
                    </p>
                    <h2 ref={headingRef}
                        className="text-4xl sm:text-5xl font-extrabold text-[#1F2937] max-w-xl opacity-0"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        Technologies I{' '}
                        <span className="text-transparent bg-clip-text"
                            style={{ backgroundImage: 'linear-gradient(135deg,#FF7A59,#ffaa82)' }}>
                            work with
                        </span>
                    </h2>
                </div>

                {/* Stagger skill chips */}
                <div className="flex flex-wrap gap-4">
                    {SKILLS.map((skill, i) => (
                        <SkillChip key={skill.name} skill={skill} delay={i * 0.06} />
                    ))}
                </div>
            </div>
        </section>
    )
}
