import React from 'react'
import { Link } from 'react-router-dom'
import { loadResume } from '../shared/data'

export default function Footer() {
    const resume = loadResume()
    const year = new Date().getFullYear()
    const [firstName] = (resume.basics?.name || 'Uttam').split(' ')

    return (
        <footer className="py-12 border-t border-white/5 bg-black/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto px-6">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">{firstName}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                        {resume.basics?.summary?.slice(0, 100)}...
                    </p>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Quick Links</h4>
                    <ul className="space-y-3 text-sm text-neutral-400">
                        <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                        <li><a href="#projects" className="hover:text-primary transition-colors">Projects</a></li>
                        {/* Skills section removed */}
                        <li><a href="/Resume.pdf" download className="hover:text-primary transition-colors">Download Resume</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Connect</h4>
                    <ul className="space-y-3 text-sm text-neutral-400">
                        {resume.basics?.profiles?.map((p: any, i: number) => (
                            <li key={i}>
                                <a href={p.url} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                                    {p.network}
                                </a>
                            </li>
                        ))}
                        <li>
                            <a href={`mailto:${resume.basics?.email}`} className="hover:text-primary transition-colors">
                                {resume.basics?.email}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-sm text-neutral-600 flex justify-between items-center">
                <p>© {year} {resume.basics?.name}. All rights reserved.</p>
                <p>Designed & Built with ❤️</p>
            </div>
        </footer>
    )
}
