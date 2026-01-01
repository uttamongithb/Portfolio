import React from 'react'
import { loadProjects } from '../shared/projects'
import { Link } from 'react-router-dom'
import { Calendar, Eye, ArrowUpRight } from 'lucide-react'
import type { Project } from '../shared/schema'

export default function FeaturedProjectsReplica() {
    const projects = loadProjects()

    return (
        <section id="projects" className="py-16 border-b border-white/5">
            <h2 className="section-title">Featured Projects</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project: Project, index: number) => (
                    <Link
                        key={index}
                        to={`/projects/${project.slug}`}
                        className="group block bg-surface rounded-2xl border border-white/5 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-glow"
                    >
                        {/* Image Section */}
                        <div className="aspect-video relative overflow-hidden">
                            {project.cover ? (
                                <img
                                    src={project.cover}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-900" />
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-black font-bold">
                                    <ArrowUpRight size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tags?.slice(0, 3).map((t: string) => (
                                    <span key={t} className="px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary border border-primary/20">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                            <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
                                {project.summary}
                            </p>

                            <div className="flex items-center gap-4 text-xs text-neutral-500 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} /> <span>2025</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
