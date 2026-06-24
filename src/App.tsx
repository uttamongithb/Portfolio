import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import Home from './routes/Home'
import AdminDashboard from './components/AdminDashboard'
import Blog from './components/Blog'
import BlogDetail from './components/BlogDetail'

import Navbar from './components/Navbar'

type LoadingScreenProps = {
  progress: number
  done?: boolean
}

// ─── App ─────────────────────────────────────────────────────────────────────
function LoadingScreen({ progress, done }: LoadingScreenProps) {
  return (
    <div className={`site-loader ${done ? 'site-loader--done' : ''}`} aria-hidden={progress >= 100}>
      <div className="site-loader__orb" />
      <div className="site-loader__content">
        <p className="site-loader__eyebrow">
          <span className="site-loader__typed">Hey, welcome...</span>
        </p>
        <div className="site-loader__progress-wrap" aria-label={`Loading ${progress}%`}>
          <span className="site-loader__progress">{progress}%</span>
          <div className="site-loader__bar">
            <div className="site-loader__bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function AppInner() {
  const location = useLocation()
  const isAdminRoute = location.pathname === '/admin' || location.pathname === '/admin/'
  
  const [progress, setProgress] = useState(0)
  const [showLoader, setShowLoader] = useState(!isAdminRoute)
  const [done, setDone] = useState(false)

  // Preload main website components in background while loader is visible
  useEffect(() => {
    if (showLoader && !isAdminRoute) {
      const preloadTimer = setTimeout(() => {
        // Preload images on page
        const imageLinks = document.querySelectorAll('img[src]')
        imageLinks.forEach((img) => {
          if (img instanceof HTMLImageElement) {
            const preloadImg = new Image()
            preloadImg.src = img.src
          }
        })
        // Preload Home component
        import('./routes/Home').catch(() => {})
      }, 300)
      return () => clearTimeout(preloadTimer)
    }
  }, [showLoader, isAdminRoute])

  useEffect(() => {
    if (isAdminRoute) {
      setShowLoader(false)
      return () => {}
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let progressValue = 0
    const targetProgress = 100

    if (reducedMotion) {
      setProgress(100)
      setDone(true)
      const timeout = window.setTimeout(() => setShowLoader(false), 900)
      return () => clearTimeout(timeout)
    }

    const timer = window.setInterval(() => {
      if (progressValue < targetProgress) {
        const remaining = targetProgress - progressValue
        if (remaining > 30) {
          progressValue += progressValue < 20 ? 3 : progressValue < 40 ? 2 : 1
        } else {
          progressValue += 1
        }
      }

      if (progressValue >= targetProgress) {
        progressValue = targetProgress
        setProgress(progressValue)
        window.clearInterval(timer)
        
        setDone(true)
        window.setTimeout(() => setShowLoader(false), 900)
        return
      }

      setProgress(progressValue)
    }, 50)

    return () => {
      window.clearInterval(timer)
    }
  }, [isAdminRoute])

  useEffect(() => {
    document.body.style.overflow = showLoader ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [showLoader])

  return (
    <>
      <Helmet>
        <title>Uttam Bhartiya — Full Stack Developer</title>
        <meta name="description" content="Portfolio of Uttam Bhartiya — Full Stack Developer building fast, scalable, joyful digital experiences." />
      </Helmet>
      {showLoader && (
        <LoadingScreen
          progress={progress}
          done={done}
        />
      )}
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? '' : 'pt-16'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </HelmetProvider>
  )
}
