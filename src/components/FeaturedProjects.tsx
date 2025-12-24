import React from 'react'
import { loadProjects } from '../shared/projects'
import BentoCard from './BentoCard'
import { Link } from 'react-router-dom'
import type { Project } from '../shared/schema'

export default function FeaturedProjects() {
    const projects = loadProjects().slice(0, 3)

    return (
        <>
            {projects.map((project: Project, index: number) => (
                <div key={index} className="col-span-1 md:col-span-2 row-span-2">
                    <BentoCard delay={index * 0.1} className="h-full">
                        <Link to={`/projects/${project.slug}`} className="flex flex-col h-full group">
                            <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                                {project.cover ? (
                                    <img src={project.cover} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-surface" />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white text-sm">View Project</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                                <p className="text-neutral-400 line-clamp-2">{project.summary}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {project.tags?.slice(0, 3).map((t: string) => (
                                        <span key={t} className="text-xs px-2 py-1 rounded bg-white/5 text-neutral-300">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    </BentoCard>
                </div>
            ))}
        </>
    )
}
