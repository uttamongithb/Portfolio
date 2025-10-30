# Resume Portfolio (React + Vite)

A modern, single-source resume app using React + TypeScript and Tailwind CSS. Web-first, no PDF generation.

## Features

- One source of truth: `data/resume.json` (validated with zod)
- Interactive web resume (`/`)
- ATS-friendly print layout (`/print`) for browser printing if you ever need it

## Scripts

- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
  
Optional: Use your browser's Print dialog on the `/print` route if you want a hard copy later.

## Customize

- Edit `data/resume.json`
- Tweak styles in `src/styles/globals.css` and `src/styles/print.css`
