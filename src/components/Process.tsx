import React from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, PenTool, Rocket } from 'lucide-react'

const steps = [
    {
        icon: Lightbulb,
        title: 'Strategy & Vision',
        desc: 'I start by understanding the core problem and defining a clear roadmap. This ensures that every line of code serves a purpose.'
    },
    {
        icon: PenTool,
        title: 'Design & Prototyping',
        desc: 'I create interactive prototypes (Figma) to visualize the user journey, focusing on intuitive UX and pixel-perfect UI.'
    },
    {
        icon: Rocket,
        title: 'Development & Launch',
        desc: 'Using modern tech stacks (React, Node, etc.), I build scalable, performant applications and deploy them with CI/CD pipelines.'
    }
]

export default function Process() {
    return (
        <section id="process" className="py-16">
            <h2 className="section-title">My Approach</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="glass-card p-8 relative group hover:border-primary/50"
                    >
                        <div className="absolute -top-6 left-8 p-4 rounded-xl bg-surface border border-white/10 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(203,172,249,0.3)] transition-all duration-300">
                            <step.icon size={32} className="text-primary" />
                        </div>

                        <h3 className="text-xl font-bold text-white mt-8 mb-4">{step.title}</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            {step.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
