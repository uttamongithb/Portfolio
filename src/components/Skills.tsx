import React from 'react'
import { loadResume } from '../shared/data'

export default function Skills() {
    const resume = loadResume()
    const categories = resume.skills || []
    return (
        <section id="skills" className="py-16">
            <h2 className="section-title">Technical Skills</h2>

            <div className="max-w-4xl mx-auto px-6 space-y-10">
                {categories.map((category, idx) => {
                    const skills = category.keywords || []
                    const visible = skills.slice(0, 8)
                    const remaining = skills.length - visible.length

                    return (
                        <div key={idx} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl font-semibold text-neutral-200">{category.name}</h3>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {visible.map((skill, i) => (
                                    <div
                                        key={i}
                                        className="px-4 py-2 rounded-full bg-white/3 border border-white/6 text-sm text-neutral-200"
                                        aria-label={`${skill} skill`}
                                    >
                                        {skill}
                                    </div>
                                ))}

                                {remaining > 0 && (
                                    <div className="px-3 py-1.5 rounded-full bg-white/2 border border-white/6 text-xs text-neutral-300 flex items-center">
                                        +{remaining} more
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
