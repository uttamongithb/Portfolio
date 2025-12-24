import React from 'react'
import { Route, Routes, Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AnimatePresence } from 'framer-motion'
import { loadResume } from './shared/data'
import Home from './routes/Home'
import Projects from './routes/Projects'
import ProjectDetail from './routes/ProjectDetail'
import Contact from './routes/Contact'
import Resume from './routes/Resume'
import Aurora from './components/Aurora'

function Header() {
  const location = useLocation()
  const resume = loadResume()
  const [firstName, ...rest] = (resume.basics?.name || 'Uttam').split(' ')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-white/5 print:hidden">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-xl font-bold tracking-tight text-white hover:text-primary transition-colors group">
          <img src="/images/profile.png" alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white/10 group-hover:border-primary/50 transition-colors" />
          <span>{firstName}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors relative group py-2"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <Link
            to="/resume"
            className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white transition-all hover:border-primary/50"
          >
            Resume
          </Link>
        </nav>

        {/* Mobile Toggle & Actions */}
        <div className="flex items-center gap-4 md:hidden">
          <Link
            to="/resume"
            className="px-3 py-1.5 rounded bg-primary text-background text-xs font-bold"
          >
            Resume
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <>
      <Helmet>
        <title>Resume | Portfolio</title>
        <meta name="description" content="Modern resume and portfolio" />
      </Helmet>
      {/* <Aurora /> Removed to fix background mismatch */}
      <Header />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resume" element={<Resume />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  )
}
