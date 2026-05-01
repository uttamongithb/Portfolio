import { FormEvent, useState } from 'react'

const FONT = {
  serif: 'Cormorant Garamond, Georgia, serif',
  accentSerif: 'Playfair Display, Georgia, serif',
  sans: 'Inter, system-ui, -apple-system, sans-serif'
}

type FormState = {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactSection() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const backendBaseUrl =
    import.meta.env.VITE_BACKEND_URL?.trim() ||
    import.meta.env.VITE_API_URL?.trim() ||
    'http://localhost:4000'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus(null)

    try {
      setIsSubmitting(true)

      const response = await fetch(`${backendBaseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      if (!response.ok) throw new Error('Failed to send message')

      setStatus({ type: 'success', text: 'Message sent successfully. I will get back to you soon.' })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus({
        type: 'error',
        text: 'Could not send message. Please try again later.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="relative bg-[#FAF9F6] py-24 md:py-28">
      <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-[#B89961]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-2 h-80 w-80 rounded-full bg-[#8B95A6]/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 md:px-10 lg:px-16">
        <p
          className="mb-3 font-sans text-[0.65rem] font-medium uppercase tracking-[0.3em] text-[#8B95A6]"
          style={{ fontFamily: FONT.sans }}
        >
          Contact
        </p>

        <h2
          className="font-serif text-4xl font-bold leading-none tracking-tight text-[#232B36] md:text-6xl"
          style={{ fontFamily: FONT.serif }}
        >
          Let’s build
          <span className="ml-3 font-light italic text-[#B89961]" style={{ fontFamily: FONT.accentSerif }}>
            something meaningful
          </span>
        </h2>

        <p
          className="mt-4 max-w-2xl font-sans text-[0.95rem] font-light leading-relaxed tracking-wide text-[#6D7688]"
          style={{ fontFamily: FONT.sans }}
        >
          Open to full-stack roles, freelance work, and product collaborations. Reach out and I’ll get back to you soon.
        </p>

        <div className="mt-10 grid gap-7 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-[#232B3614] bg-white/85 p-6 shadow-[0_14px_36px_rgba(35,43,54,0.09)] md:p-7">
            <p
              className="mb-4 font-sans text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#8B95A6]"
              style={{ fontFamily: FONT.sans }}
            >
              Send a message
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span
                    className="mb-1.5 block font-sans text-[0.66rem] font-medium uppercase tracking-[0.14em] text-[#8B95A6]"
                    style={{ fontFamily: FONT.sans }}
                  >
                    Name
                  </span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full rounded-xl border border-[#232B361F] bg-white px-3.5 py-2.5 font-sans text-sm text-[#232B36] outline-none transition focus:border-[#B89961]"
                    style={{ fontFamily: FONT.sans }}
                    placeholder="Your name"
                  />
                </label>

                <label className="block">
                  <span
                    className="mb-1.5 block font-sans text-[0.66rem] font-medium uppercase tracking-[0.14em] text-[#8B95A6]"
                    style={{ fontFamily: FONT.sans }}
                  >
                    Email
                  </span>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full rounded-xl border border-[#232B361F] bg-white px-3.5 py-2.5 font-sans text-sm text-[#232B36] outline-none transition focus:border-[#B89961]"
                    style={{ fontFamily: FONT.sans }}
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="block">
                <span
                  className="mb-1.5 block font-sans text-[0.66rem] font-medium uppercase tracking-[0.14em] text-[#8B95A6]"
                  style={{ fontFamily: FONT.sans }}
                >
                  Subject
                </span>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
                  className="w-full rounded-xl border border-[#232B361F] bg-white px-3.5 py-2.5 font-sans text-sm text-[#232B36] outline-none transition focus:border-[#B89961]"
                  style={{ fontFamily: FONT.sans }}
                  placeholder="Project inquiry"
                />
              </label>

              <label className="block">
                <span
                  className="mb-1.5 block font-sans text-[0.66rem] font-medium uppercase tracking-[0.14em] text-[#8B95A6]"
                  style={{ fontFamily: FONT.sans }}
                >
                  Message
                </span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                  className="w-full resize-none rounded-xl border border-[#232B361F] bg-white px-3.5 py-2.5 font-sans text-sm text-[#232B36] outline-none transition focus:border-[#B89961]"
                  style={{ fontFamily: FONT.sans }}
                  placeholder="Tell me about your idea..."
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-11 items-center rounded-full border border-[#B89961] px-5 py-2.5 font-sans text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#B89961] transition-colors hover:bg-[#B89961] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
                style={{ fontFamily: FONT.sans }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {status ? (
                <p
                  className={`font-sans text-xs ${status.type === 'success' ? 'text-[#4F7D66]' : 'text-[#A45656]'}`}
                  style={{ fontFamily: FONT.sans }}
                >
                  {status.text}
                </p>
              ) : null}
            </form>
          </div>

          <div className="grid gap-5 md:grid-rows-5">
            <a
              href="mailto:uttam25@navgurukul.org"
              className="rounded-2xl border border-[#232B3614] bg-white/80 p-5 shadow-[0_12px_30px_rgba(35,43,54,0.07)] transition-transform duration-300 hover:-translate-y-1"
            >
              <p
                className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#8B95A6]"
                style={{ fontFamily: FONT.sans }}
              >
                Email
              </p>
              <p
                className="mt-2 break-all font-sans text-sm font-medium text-[#232B36]"
                style={{ fontFamily: FONT.sans }}
              >
                uttam25@navgurukul.org
              </p>
            </a>

            <a
              href="https://linkedin.com/in/uttam-kb"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-[#232B3614] bg-white/80 p-5 shadow-[0_12px_30px_rgba(35,43,54,0.07)] transition-transform duration-300 hover:-translate-y-1"
            >
              <p
                className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#8B95A6]"
                style={{ fontFamily: FONT.sans }}
              >
                LinkedIn
              </p>
              <p
                className="mt-2 font-sans text-sm font-medium text-[#232B36]"
                style={{ fontFamily: FONT.sans }}
              >
                linkedin.com/in/uttam-kb
              </p>
            </a>

            <a
              href="https://github.com/uttamongithb/"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-[#232B3614] bg-white/80 p-5 shadow-[0_12px_30px_rgba(35,43,54,0.07)] transition-transform duration-300 hover:-translate-y-1"
            >
              <p
                className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#8B95A6]"
                style={{ fontFamily: FONT.sans }}
              >
                GitHub
              </p>
              <p
                className="mt-2 font-sans text-sm font-medium text-[#232B36]"
                style={{ fontFamily: FONT.sans }}
              >
                github.com/uttamongithb
              </p>
            </a>

            <a
              href="https://x.com/uttamonx"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-[#232B3614] bg-white/80 p-5 shadow-[0_12px_30px_rgba(35,43,54,0.07)] transition-transform duration-300 hover:-translate-y-1"
            >
              <p
                className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#8B95A6]"
                style={{ fontFamily: FONT.sans }}
              >
                Twitter / X
              </p>
              <p
                className="mt-2 font-sans text-sm font-medium text-[#232B36]"
                style={{ fontFamily: FONT.sans }}
              >
                x.com/uttamonx
              </p>
            </a>

            <a
              href="https://www.instagram.com/uttamoninsta/"
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-[#232B3614] bg-white/80 p-5 shadow-[0_12px_30px_rgba(35,43,54,0.07)] transition-transform duration-300 hover:-translate-y-1"
            >
              <p
                className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#8B95A6]"
                style={{ fontFamily: FONT.sans }}
              >
                Instagram
              </p>
              <p
                className="mt-2 font-sans text-sm font-medium text-[#232B36]"
                style={{ fontFamily: FONT.sans }}
              >
                instagram.com/uttamoninsta
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}