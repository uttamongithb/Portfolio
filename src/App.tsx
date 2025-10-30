import React from 'react'
import { Route, Routes, Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Sun, Moon } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import Home from './routes/Home'
import Projects from './routes/Projects'
import ProjectDetail from './routes/ProjectDetail'
import Contact from './routes/Contact'
import Resume from './routes/Resume'
import { ThemeContext } from './main'
import Aurora from './components/Aurora'

function Header() {
  const { theme, setTheme } = React.useContext(ThemeContext)
  const location = useLocation()
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/60 dark:bg-neutral-950/60 border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">
          <span className="text-accent">U</span>ttam • Resume
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/projects" className="text-sm px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            Projects
          </Link>
          <Link to="/resume" className="text-sm px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            Resume
          </Link>
          <Link to="/contact" className="text-sm px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
            Contact
          </Link>
          {/* Print view removed */}
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </nav>
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
  <Aurora />
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
