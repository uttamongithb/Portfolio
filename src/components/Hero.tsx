import React from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Twitter, Instagram } from 'lucide-react'
import { Link } from 'react-router-dom'
import { loadResume } from '../shared/data'

export default function Hero() {
    const resume = loadResume()

    return (
        <section id="about" className="min-h-[70vh] flex items-center pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">

                {/* Left Column: Text */}
                <div className="space-y-8 animate-fade-up">
                    <div className="space-y-4">
                        <h2 className="text-primary font-medium tracking-wide">Hi, I'm {resume.basics?.name} 👋</h2>
                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                            Building <span className="text-primary">digital</span> <br />
                            experiences.
                        </h1>
                        <p className="text-lg text-neutral-400 max-w-xl leading-relaxed">
                            {resume.basics?.summary}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <a
                            href="#projects"
                            className="px-8 py-4 rounded bg-primary hover:bg-accent-dark text-background font-bold transition-transform hover:scale-105"
                        >
                            Check out my work
                        </a>
                        <a
                            href="/Resume.pdf"
                            download
                            className="px-8 py-4 rounded border border-white/20 hover:border-primary text-white font-medium transition-all hover:bg-white/5"
                        >
                            Download Resume
                        </a>
                    </div>

                    <div className="flex items-center gap-6 pt-4 text-neutral-400">
                        {resume.basics?.profiles?.map((p: any, i: number) => {
                            const network = p.network.toLowerCase()
                            return (
                                <a
                                    key={i}
                                    href={p.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:text-primary transition-colors hover:scale-110"
                                >
                                    {network.includes('github') ? <Github size={24} /> :
                                        network.includes('linkedin') ? <Linkedin size={24} /> :
                                            (network.includes('twitter') || network === 'x') ? <Twitter size={24} /> :
                                                network.includes('instagram') ? <Instagram size={24} /> :
                                                    <Mail size={24} />}
                                </a>
                            )
                        })}
                    </div>
                </div>

                {/* Right Column: Profile Image */}
                <div className="flex justify-center md:justify-end relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-30 animate-pulse" />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 w-80 h-80 md:w-[500px] md:h-[500px] rounded-full overflow-hidden border-4 border-white/5 shadow-2xl skew-y-0 hover:skew-y-1 transition-all duration-500"
                    >
                        <img
                            src="/images/profile.png"
                            alt="Profile"
                            className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
                        />
                    </motion.div>
                </div>

            </div>
        </section>
    )
}
