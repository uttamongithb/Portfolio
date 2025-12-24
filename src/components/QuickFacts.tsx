import React from 'react'
import { Code, Server, Smartphone, Globe, Database } from 'lucide-react'

const facts = [
    { icon: Code, label: 'Frontend Dev', desc: 'React, Next.js, Tailwind' },
    { icon: Server, label: 'Backend Dev', desc: 'Node.js, Express, MongoDB' },
    { icon: Smartphone, label: 'Mobile App', desc: 'React Native, Expo' },
    { icon: Globe, label: 'Web Design', desc: 'Modern UI/UX' },
    { icon: Database, label: 'Database', desc: 'MongoDB, PostgreSQL' },
]

export default function QuickFacts() {
    return (
        <section className="py-20 border-b border-white/5">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {facts.map((fact, i) => (
                    <div
                        key={i}
                        className="group p-6 rounded-2xl bg-surface/30 border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow text-center flex flex-col items-center"
                    >
                        <div className="mb-4 p-3 rounded-full bg-white/5 text-primary group-hover:scale-110 transition-transform">
                            <fact.icon size={24} />
                        </div>
                        <h3 className="font-semibold text-white mb-1">{fact.label}</h3>
                        <p className="text-xs text-neutral-400">{fact.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
