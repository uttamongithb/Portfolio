import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
    {
        q: "What tech stack do you primarily use?",
        a: "My core stack is React, Next.js, TypeScript, and Node.js. For styling, I love Tailwind CSS, and for databases, I use MongoDB or PostgreSQL."
    },
    {
        q: "Are you available for freelance work?",
        a: "Yes, I am currently open to new freelance opportunities and contract work. Feel free to reach out!"
    },
    {
        q: "Do you also do UI/UX design?",
        a: "Absolutely. I believe design and development go hand in hand. I use Figma for prototyping and designing clean, user-centric interfaces."
    }
]

export default function FAQ() {
    return (
        <section className="py-16 border-b border-white/5 max-w-3xl mx-auto">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqs.map((item, i) => (
                    <FAQItem key={i} question={item.q} answer={item.a} />
                ))}
            </div>
        </section>
    )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border border-white/5 rounded-xl bg-surface/30 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-6 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-semibold text-white">{question}</span>
                <span className={`p-2 rounded-full ${isOpen ? 'bg-primary text-black' : 'bg-white/10 text-white'} transition-colors`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 pt-0 text-neutral-400 leading-relaxed border-t border-white/5 bg-black/20">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
