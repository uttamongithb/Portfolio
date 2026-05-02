import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu, X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navRef = useRef<HTMLDivElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const linksRef = useRef<(HTMLAnchorElement | null)[]>([])
    const btnRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        // Entrance animation
        const tl = gsap.timeline({ delay: 0.5 })

        tl.fromTo(navRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        )
            .fromTo(linksRef.current,
                { y: -10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" },
                "-=0.3"
            )
            .fromTo(btnRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
                "-=0.2"
            )

        // Scroll hiding/showing logic
        const updateNavbarOnScroll = (self: ScrollTrigger) => {
            // Only hide if we've scrolled down a bit, to prevent hiding at the very top
            if (self.scroll() > 100) {
                gsap.to(navRef.current, {
                    y: self.direction === 1 ? -100 : 0, // direction 1 = down
                    duration: 0.3,
                    ease: "power2.inOut",
                })

                // Optional: Make it slightly more opaque when scrolling past hero
                gsap.to(navRef.current, {
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    duration: 0.3
                })
            } else {
                gsap.to(navRef.current, {
                    y: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    duration: 0.3
                })
            }
        }

        const st = ScrollTrigger.create({
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            onUpdate: updateNavbarOnScroll
        })

        return () => {
            st.kill()
            tl.kill()
        }
    }, [])

    useEffect(() => {
        // Mobile menu slide animation
        if (isMobileMenuOpen) {
            gsap.to(menuRef.current, {
                x: 0,
                duration: 0.4,
                ease: "power3.out"
            })
            document.body.style.overflow = 'hidden' // Prevent scrolling when menu open
        } else {
            gsap.to(menuRef.current, {
                x: '100%',
                duration: 0.3,
                ease: "power2.in"
            })
            document.body.style.overflow = ''
        }

        return () => { document.body.style.overflow = '' }
    }, [isMobileMenuOpen])

    return (
        <>
            {/* ─── Desktop & Mobile Navbar ──────────────────────────────────────── */}
            <nav
                ref={navRef}
                className="fixed top-4 left-1/2 transform -translate-x-1/2 w-11/12 md:w-auto bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg px-6 py-3 flex items-center justify-between z-50 transition-colors duration-300"
                aria-label="Main navigation"
            >
                {/* Left Section – Brand Identity */}
                <a href="#" className="flex items-center gap-3 group cursor-pointer" aria-label="Home">
                    <span className="font-['Cormorant_Garamond'] font-medium text-2xl text-[#81A594] transition-transform duration-300 group-hover:scale-105 group-hover:text-[#E07A5F] inline-block">
                        U
                    </span>
                    <span className="hidden md:inline font-sans text-base text-[#2D2D2D] opacity-70 group-hover:opacity-100 transition-opacity">
                        Uttam
                    </span>
                </a>

                {/* Center Section – Primary Navigation (desktop) */}
                <div className="hidden md:flex items-center space-x-8 mx-12">
                    {NAV_LINKS.map((link, i) => (
                        <a
                            key={link.label}
                            href={link.href}
                            ref={el => linksRef.current[i] = el}
                            className="relative text-[#2D2D2D]/70 hover:text-[#E07A5F] text-sm font-normal tracking-wide transition-colors cursor-pointer group py-1"
                        >
                            {link.label}
                            {/* Animated underline */}
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#E07A5F] transition-all duration-300 ease-out group-hover:w-full" />
                        </a>
                    ))}
                </div>

                {/* Right Section – CTA & Extras */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin"
                        className="hidden md:inline-block border border-[#1A1F3A]/15 text-[#1A1F3A] px-5 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all duration-300 hover:bg-[#1A1F3A] hover:text-white hover:border-[#1A1F3A]"
                    >
                        Admin
                    </Link>
                    <a
                        ref={btnRef}
                        href="#contact"
                        className="hidden md:inline-block border border-[#E07A5F]/50 text-[#E07A5F] px-5 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all duration-300 hover:bg-[#E07A5F] hover:text-white hover:border-[#E07A5F]"
                    >
                        Contact
                    </a>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-[#2D2D2D] p-2 hover:text-[#E07A5F] transition-colors"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* ─── Mobile Menu Overlay ──────────────────────────────────────────── */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-51 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-out Panel */}
            <div
                ref={menuRef}
                className="fixed top-0 right-0 h-screen w-64 bg-white/95 backdrop-blur-xl shadow-2xl p-8 z-52 flex flex-col transform translate-x-full md:hidden border-l border-white/20"
            >
                <div className="flex justify-end mb-12">
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[#2D2D2D]/70 hover:text-[#E07A5F] transition-colors p-2 -mr-2"
                        aria-label="Close menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex grow flex-col space-y-8">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-2xl font-['Cormorant_Garamond'] text-[#2D2D2D] hover:text-[#E07A5F] transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="mb-8 border-t border-[#E5E5E5] pt-8">
                    <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-center mb-3 border border-[#1A1F3A]/10 text-[#1A1F3A] px-6 py-3 rounded-full text-sm uppercase tracking-wider font-medium hover:bg-[#1A1F3A] hover:text-white transition-colors"
                    >
                        Admin
                    </Link>
                    <a
                        href="#contact"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-center bg-[#E07A5F] text-white px-6 py-3 rounded-full text-sm uppercase tracking-wider font-medium hover:bg-[#D06A4F] transition-colors"
                    >
                        Contact
                    </a>
                </div>
            </div>
        </>
    )
}
