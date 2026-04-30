const FONT = {
  sans: 'Inter, system-ui, -apple-system, sans-serif'
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#232B3614] bg-[#FAF9F6] py-4">
      <p
        className="text-center font-sans text-[0.72rem] font-medium uppercase tracking-[0.14em] text-[#8B95A6]"
        style={{ fontFamily: FONT.sans }}
      >
        © {year} Uttam Bhartiya. All rights reserved.
      </p>
    </footer>
  )
}