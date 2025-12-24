import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './styles/globals.css'
// Print stylesheet removed

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = React.useState<string>('dark')

  React.useEffect(() => {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme: () => { } }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const ThemeContext = React.createContext<{ theme: string; setTheme: (t: string) => void }>({ theme: 'dark', setTheme: () => { } })

const rootEl = document.getElementById('root')!
createRoot(rootEl).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
