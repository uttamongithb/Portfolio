const { spawn } = require('child_process')
const { chromium } = require('playwright')

async function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'pipe', shell: process.platform === 'win32', ...opts })
    let out = ''
    let err = ''
    child.stdout.on('data', d => { out += d.toString(); if (opts.onStdout) opts.onStdout(d.toString(), child) })
    child.stderr.on('data', d => { err += d.toString(); if (opts.onStderr) opts.onStderr(d.toString(), child) })
    child.on('close', code => code === 0 ? resolve({ code, out, err }) : reject(new Error(err || `Command failed: ${cmd}`)))
    child.on('error', reject)
    if (opts.returnChild) resolve(child)
  })
}

async function main() {
  // Build
  console.log('Building app...')
  await run('npm', ['run', 'build'])

  console.log('Starting preview server...')
  // Start preview on a random free port (0) and capture the Local URL
  const server = spawn('npm', ['run', 'preview', '--', '--port', '0'], { shell: process.platform === 'win32' })
  let previewUrl = ''

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview server did not start in time')), 45000)
    const tryParse = (chunk) => {
      const s = chunk.toString()
      process.stdout.write(s)
      // Strip ANSI color codes
      const clean = s.replace(/\x1b\[[0-9;]*m/g, '')
      // Grab the first http URL
      const urlMatch = clean.match(/https?:\/\/[^\s]+/)
      if (urlMatch) {
        previewUrl = urlMatch[0].replace(/\/$/, '')
        clearTimeout(timeout)
        resolve(undefined)
      }
    }
    server.stdout.on('data', tryParse)
    server.stderr.on('data', d => process.stderr.write(d.toString()))
    server.on('error', reject)
  })

  if (!previewUrl) throw new Error('Could not determine preview URL')

  console.log('Exporting PDF via Playwright from', previewUrl + '/print')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(previewUrl + '/print', { waitUntil: 'networkidle' })
  await page.emulateMedia({ media: 'print' })
  await page.pdf({
    path: 'resume.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
  })
  await browser.close()

  console.log('Shutting down preview server...')
  server.kill('SIGTERM')
  console.log('PDF exported to resume.pdf')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
