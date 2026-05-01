import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import Home from './routes/Home'
import AdminDashboard from './components/AdminDashboard'

import Navbar from './components/Navbar'

function formatOtpTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

type VisitorFormData = {
  firstName: string
  mobile: string
  email: string
}

type LoadingScreenProps = {
  progress: number
  done?: boolean
  showVisitorForm: boolean
  onProgressUpdate?: (progress: number) => void
  onRequestOtp: (data: VisitorFormData) => Promise<{ ok: boolean; message?: string; cooldownMs?: number; expiryMs?: number; maxAttempts?: number }>
  onVerifyOtp: (otp: string) => Promise<{ ok: boolean; message?: string; attemptsRemaining?: number }>
  onResetSession: () => Promise<{ ok: boolean }>
}

// ─── App ─────────────────────────────────────────────────────────────────────
function LoadingScreen({ progress, done, showVisitorForm, onProgressUpdate, onRequestOtp, onVerifyOtp, onResetSession }: LoadingScreenProps) {
  const [formData, setFormData] = useState<VisitorFormData>({ firstName: '', mobile: '', email: '' })
  const [otp, setOtp] = useState('')
  const [otpRequested, setOtpRequested] = useState(false)
  const [requestingOtp, setRequestingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [attemptsRemaining, setAttemptsRemaining] = useState(5)
  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null)
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setErrorMessage('')
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Trigger progress increments based on form field completion
    if (name === 'firstName' && value.trim().length > 0) {
      onProgressUpdate?.(58)
    } else if (name === 'mobile' && value.trim().length >= 10) {
      onProgressUpdate?.(69)
    } else if (name === 'email' && /\S+@\S+\.\S+/.test(value)) {
      onProgressUpdate?.(75)
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyDigits = e.target.value.replace(/\D/g, '').slice(0, 6)
    setErrorMessage('')
    setOtp(onlyDigits)
  }

  const requestOtp = async () => {
    if (done || progress < 50 || requestingOtp) {
      return
    }

    setRequestingOtp(true)
    setErrorMessage('')
    setStatusMessage(otpRequested ? 'Resending OTP to your email...' : 'Sending OTP to your email...')

    const result = await onRequestOtp(formData)
    if (result.ok) {
      setOtpRequested(true)
      setOtp('')
      setAttemptsRemaining(result.maxAttempts || 5)
      setResendCountdown(Math.max(0, Math.ceil((result.cooldownMs || 30000) / 1000)))
      setOtpExpiresAt(Date.now() + (result.expiryMs || 5 * 60 * 1000))
      setStatusMessage('OTP sent. Enter the 6-digit code from your email to continue.')
    } else {
      if (result.cooldownMs) {
        setResendCountdown(Math.max(0, Math.ceil(result.cooldownMs / 1000)))
        setOtpExpiresAt(Date.now() + result.cooldownMs)
      }
      setStatusMessage('')
      setErrorMessage(result.message || 'Failed to send OTP. Please try again.')
    }

    setRequestingOtp(false)
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpRequested) {
      return
    }
    await requestOtp()
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (done || !otpRequested || verifyingOtp) {
      return
    }

    if (otp.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit OTP.')
      return
    }

    setVerifyingOtp(true)
    setErrorMessage('')
    setStatusMessage('Verifying OTP...')

    // Start slow increment during OTP verification
    let currentProgress = 75
    const incrementTimer = window.setInterval(() => {
      if (currentProgress < 95) {
        currentProgress += 3
        onProgressUpdate?.(currentProgress)
      }
    }, 200)

    const result = await onVerifyOtp(otp)
    window.clearInterval(incrementTimer)
    
    if (!result.ok) {
      setStatusMessage('')
      setAttemptsRemaining(typeof result.attemptsRemaining === 'number' ? result.attemptsRemaining : attemptsRemaining)
      setErrorMessage(
        result.message ||
          (typeof result.attemptsRemaining === 'number'
            ? `Invalid OTP. ${result.attemptsRemaining} attempt(s) left.`
            : 'Invalid OTP. Please try again.')
      )
    }

    setVerifyingOtp(false)
  }

  const canRequestOtp =
    progress >= 50 &&
    !done &&
    !requestingOtp &&
    !otpRequested &&
    formData.firstName.trim().length > 0 &&
    formData.mobile.trim().length >= 10 &&
    /\S+@\S+\.\S+/.test(formData.email)

  const canVerifyOtp = otpRequested && otp.length === 6 && !verifyingOtp && !done
  const canResendOtp = otpRequested && resendCountdown === 0 && !requestingOtp && !done

  useEffect(() => {
    if (!otpExpiresAt || !otpRequested || done) {
      return () => {}
    }

    const timer = window.setInterval(() => {
      const secondsLeft = Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000))
      setOtpSecondsLeft(secondsLeft)

      if (secondsLeft <= 0) {
        window.clearInterval(timer)
        setErrorMessage('OTP expired. Please resend a new code.')
        setStatusMessage('')
      }
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [otpExpiresAt, otpRequested, done])

  useEffect(() => {
    if (!otpRequested || resendCountdown <= 0) {
      return () => {}
    }

    const timer = window.setInterval(() => {
      setResendCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [otpRequested, resendCountdown])

  return (
    <div className={`site-loader ${done ? 'site-loader--done' : ''}`} aria-hidden={progress >= 100}>
      <div className="site-loader__orb" />
      <div className="site-loader__content">
        <p className="site-loader__eyebrow">
          <span className="site-loader__typed">Hey, welcome...</span>
        </p>
        {showVisitorForm && progress >= 50 && progress < 100 && (
          <p className="site-loader__message">
            {otpRequested
              ? 'Enter OTP sent to your email to continue'
              : 'Please fill in your details to get OTP'}
          </p>
        )}
        <div className="site-loader__progress-wrap" aria-label={`Loading ${progress}%`}>
          <span className="site-loader__progress">{progress}%</span>
          <div className="site-loader__bar">
            <div className="site-loader__bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {showVisitorForm && (
          <>
            <form className="site-loader__form" onSubmit={handleRequestOtp} autoComplete="off">
          <div className="site-loader__form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleFormChange}
              className="site-loader__input"
              autoComplete="off"
              spellCheck={false}
              disabled={progress < 50 || progress === 100 || done || otpRequested}
            />
          </div>
          <div className="site-loader__form-group">
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleFormChange}
              className="site-loader__input"
              autoComplete="off"
              spellCheck={false}
              disabled={progress < 50 || progress === 100 || done || otpRequested}
            />
          </div>
          <div className="site-loader__form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormChange}
              className="site-loader__input"
              autoComplete="off"
              spellCheck={false}
              disabled={progress < 50 || progress === 100 || done || otpRequested}
            />
          </div>
          <button
            type="submit"
            className="site-loader__submit"
            disabled={!canRequestOtp}
          >
            {requestingOtp ? 'Sending OTP...' : otpRequested ? 'OTP Sent' : 'Send OTP'}
          </button>
        </form>

        {otpRequested && !done && (
          <form className="site-loader__form site-loader__form--otp" onSubmit={handleVerifyOtp} autoComplete="off">
            <div className="site-loader__form-group">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                className="site-loader__input"
                autoComplete="one-time-code"
                spellCheck={false}
                disabled={verifyingOtp}
              />
            </div>
            <button type="submit" className="site-loader__submit" disabled={!canVerifyOtp}>
              {verifyingOtp ? 'Verifying...' : 'Verify OTP & Continue'}
            </button>
            <button
              type="button"
              className="site-loader__submit site-loader__submit--ghost"
              onClick={requestOtp}
              disabled={!canResendOtp}
            >
              {requestingOtp
                ? 'Resending...'
                : resendCountdown > 0
                  ? `Resend in ${resendCountdown}s`
                  : 'Resend OTP'}
            </button>
            <button
              type="button"
              className="site-loader__submit site-loader__submit--ghost"
              onClick={async () => {
                const result = await onResetSession()
                if (result.ok) {
                  setFormData({ firstName: '', mobile: '', email: '' })
                  setOtp('')
                  setOtpRequested(false)
                  setRequestingOtp(false)
                  setVerifyingOtp(false)
                  setResendCountdown(0)
                  setAttemptsRemaining(5)
                  setOtpExpiresAt(null)
                  setOtpSecondsLeft(0)
                  setStatusMessage('')
                  setErrorMessage('')
                }
              }}
            >
              Change Details
            </button>
          </form>
        )}

        {otpRequested && !done && (
          <p className="site-loader__status">Attempts left: {attemptsRemaining}</p>
        )}
        {otpRequested && !done && otpExpiresAt && otpSecondsLeft > 0 && (
          <p className="site-loader__status">OTP expires in {formatOtpTime(otpSecondsLeft)}</p>
        )}
        {statusMessage && <p className="site-loader__status">{statusMessage}</p>}
            {errorMessage && <p className="site-loader__error">{errorMessage}</p>}
          </>
        )}
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
  const [otpToken, setOtpToken] = useState<string | null>(null)
  const [verificationChecked, setVerificationChecked] = useState(false)
  const [isUserVerified, setIsUserVerified] = useState(false)

  const backendBaseUrl =
    import.meta.env.VITE_BACKEND_URL?.trim() ||
    import.meta.env.VITE_API_URL?.trim() ||
    'http://localhost:4000'

  const completeLoading = () => {
    // Jump directly to 100% on successful verification
    setProgress(100)
    setDone(true)
    window.setTimeout(() => setShowLoader(false), 900)
  }

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
    // Skip verification check for admin route
    if (isAdminRoute) {
      setVerificationChecked(true)
      return
    }

    const checkVerifiedVisitor = async () => {
      try {
        const response = await fetch(`${backendBaseUrl}/api/verification-status`, {
          credentials: 'include',
        })

        const data = await response.json()
        if (data?.verified) {
          // For verified users: keep loader visible, let progress animate to 100%
          // Don't show form, but show loading animation from 0 to 100%
          setProgress(0) // Start from 0 for smooth animation
          setIsUserVerified(true)
        }
      } catch {
        // If the backend is unavailable, keep the loader visible so the user can try again.
      } finally {
        setVerificationChecked(true)
      }
    }

    checkVerifiedVisitor()
  }, [backendBaseUrl, isAdminRoute])

  const handleRequestOtp = async (formData: VisitorFormData) => {
    try {
      const response = await fetch(`${backendBaseUrl}/api/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      })

      const data = await response.json()
      if (!response.ok) {
        return {
          ok: false,
          message: data?.error || 'Failed to request OTP.',
          cooldownMs: data?.retryAfterMs || 30000,
          expiryMs: data?.expiryMs,
          maxAttempts: data?.maxAttempts || 5,
        }
      }

      if (!data?.token) {
        return { ok: false, message: 'OTP token missing from server response.' }
      }

      setOtpToken(data.token)
      return {
        ok: true,
        message: data?.message,
        cooldownMs: data?.cooldownMs || 30000,
        expiryMs: data?.expiryMs || 5 * 60 * 1000,
        maxAttempts: data?.maxAttempts || 5,
      }
    } catch {
      return { ok: false, message: 'Backend not reachable. Please start backend on port 4000.' }
    }
  }

  const handleVerifyOtp = async (otp: string) => {
    if (!otpToken) {
      return { ok: false, message: 'Please request OTP first.' }
    }

    try {
      const response = await fetch(`${backendBaseUrl}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: otpToken, otp }),
        credentials: 'include',
      })

      const data = await response.json()
      if (!response.ok) {
        return {
          ok: false,
          message: data?.error || 'OTP verification failed.',
          attemptsRemaining: data?.attemptsRemaining,
        }
      }

      setOtpToken(null)
      completeLoading()
      return { ok: true, message: 'OTP verified.' }
    } catch {
      return { ok: false, message: 'Backend not reachable. Please start backend on port 4000.' }
    }
  }

  const handleResetSession = async () => {
    try {
      const response = await fetch(`${backendBaseUrl}/api/reset-session`, {
        method: 'POST',
        credentials: 'include',
      })

      return { ok: response.ok }
    } catch {
      return { ok: false }
    }
  }

  useEffect(() => {
    if (!verificationChecked || !showLoader || isAdminRoute) {
      return () => {}
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let progressValue = 0
    const targetProgress = isUserVerified ? 100 : 50

    if (reducedMotion) {
      setProgress(targetProgress)
      if (isUserVerified) {
        setDone(true)
        window.setTimeout(() => setShowLoader(false), 900)
      }
      return () => {}
    }

    const timer = window.setInterval(() => {
      // For verified users: animate to 100%, for new users: animate to 50%
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
        
        // For verified users, mark as done and hide loader after reaching 100%
        if (isUserVerified && progressValue === 100) {
          setDone(true)
          window.setTimeout(() => setShowLoader(false), 900)
        }
        return
      }

      setProgress(progressValue)
    }, 50)

    return () => {
      window.clearInterval(timer)
    }
  }, [showLoader, verificationChecked, isAdminRoute, isUserVerified])

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
          showVisitorForm={verificationChecked && !isUserVerified}
          onProgressUpdate={setProgress}
          onRequestOtp={handleRequestOtp}
          onVerifyOtp={handleVerifyOtp}
          onResetSession={handleResetSession}
        />
      )}
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? '' : 'pt-16'}>
        <Routes>
          <Route path="/" element={<Home />} />
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
