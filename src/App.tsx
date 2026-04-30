import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import Home from './routes/Home'

import Navbar from './components/Navbar'

// ─── App ─────────────────────────────────────────────────────────────────────
function AppInner() {
  return (
    <>
      <Helmet>
        <title>Uttam Bhartiya — Full Stack Developer</title>
        <meta name="description" content="Portfolio of Uttam Bhartiya — Full Stack Developer building fast, scalable, joyful digital experiences." />
      </Helmet>
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
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
