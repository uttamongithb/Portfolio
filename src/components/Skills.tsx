import React from 'react'
import { loadResume } from '../shared/data'

export default function Skills() {
    const resume = loadResume()
    const categories = resume.skills || []

    return (
        <section id="skills" className="py-24 border-b border-white/5">
            <h2 className="section-title">Technical Skills</h2>
            <div className="space-y-12 max-w-5xl mx-auto px-6">
                {categories.map((category, idx) => (
                    <div key={idx} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
                                {category.name}
                            </h3>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {(category.keywords || []).map((skill, i) => (
                                <div
                                    key={i}
                                    className="group flex items-center justify-center p-4 rounded-xl bg-surface/30 border border-white/5 hover:border-primary/50 hover:bg-surface/80 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <span className="font-medium text-neutral-300 group-hover:text-white transition-colors text-center text-sm">{skill}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
