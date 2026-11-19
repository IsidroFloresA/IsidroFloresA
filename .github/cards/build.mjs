// Generates the SVG cards shown in README.md.
// Edit the data below, then run:  node .github/cards/build.mjs
// Output: .github/assets/*.svg (English and Spanish versions).

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets')
mkdirSync(OUT, { recursive: true })

const W = 1000
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"

const C = {
  bg: '#0f141b',
  panel: '#161c25',
  line: '#2a3240',
  text: '#f2f4f7',
  muted: '#a3acb9',
  faint: '#6b7585',
  yellow: '#f5b700',
}

const STATUS = {
  pilot: { color: '#f5b700', en: 'PILOT', es: 'EN PILOTO' },
  live: { color: '#2ecc71', en: 'LIVE', es: 'EN LÍNEA' },
  dev: { color: '#4c9aff', en: 'IN DEVELOPMENT', es: 'EN DESARROLLO' },
}

// Brand-ish colors for stack chips.
const TECH = {
  'Java': '#e76f00',
  'Spring Boot': '#6db33f',
  'React': '#149eca',
  'PostgreSQL': '#4169e1',
  'MySQL': '#00758f',
  'Twilio': '#f22f46',
  'Supabase': '#3ecf8e',
  'Row-Level Security': '#7c5cff',
  'Vite': '#8b5cf6',
  'Netlify Functions': '#00ad9f',
  'Google Calendar API': '#4285f4',
  'Flyway': '#cc0200',
}

const projects = [
  {
    file: 'card-el-colorin',
    id: 'IF-2026-001',
    accent: '#f5b700',
    status: 'pilot',
    tag: { en: 'MAIN PROJECT · CLIENT', es: 'PROYECTO PRINCIPAL · CLIENTE' },
    title: { en: 'El Colorín Admin System', es: 'Sistema administrativo El Colorín' },
    desc: {
      en: 'Management system for a construction materials business: sales, inventory, production, machinery, deliveries, cash register and payroll in one place, with permissions enforced in the API.',
      es: 'Sistema de gestión para un negocio de materiales para construcción: ventas, inventario, producción, maquinaria, entregas, caja y nómina en un solo lugar, con permisos validados en la API.',
    },
    role: { en: 'Solo full-stack developer', es: 'Desarrollador full-stack, proyecto individual' },
    stack: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Flyway'],
  },
  {
    file: 'card-procpatrol',
    id: 'IF-2026-002',
    accent: '#2ecc71',
    status: 'live',
    tag: { en: 'TEAM PROJECT', es: 'PROYECTO EN EQUIPO' },
    title: { en: 'ProcPatrol', es: 'ProcPatrol' },
    desc: {
      en: 'Heartbeat-based uptime monitoring. Services check in on a schedule, and owners get an email, SMS, Discord or Slack alert when one goes silent.',
      es: 'Monitoreo de disponibilidad basado en heartbeats. Los servicios se reportan periódicamente y sus responsables reciben una alerta por correo, SMS, Discord o Slack cuando uno deja de hacerlo.',
    },
    role: {
      en: 'Backend developer: heartbeat model design, MySQL persistence, Twilio SMS alerts',
      es: 'Desarrollador backend: diseño del modelo de heartbeats, persistencia con MySQL, alertas por SMS con Twilio',
    },
    stack: ['Java', 'Spring Boot', 'MySQL', 'Twilio'],
  },
  {
    file: 'card-likehome',
    id: 'IF-2026-003',
    accent: '#7c5cff',
    status: 'dev',
    tag: { en: 'TEAM PROJECT', es: 'PROYECTO EN EQUIPO' },
    title: { en: 'LikeHome', es: 'LikeHome' },
    desc: {
      en: 'Hotel booking web app. The booking rules live in the database: search, double-booking prevention, reward points and cancellations.',
      es: 'Aplicación web de reservas de hotel. Las reglas viven en la base de datos: búsqueda, prevención de reservas encimadas, puntos de recompensa y cancelaciones.',
    },
    role: {
      en: 'Database developer: SQL functions, triggers, constraints and row-level security',
      es: 'Desarrollador de base de datos: funciones SQL, triggers, restricciones y seguridad a nivel de fila',
    },
    stack: ['PostgreSQL', 'Supabase', 'Row-Level Security'],
  },
  {
    file: 'card-soles',
    id: 'IF-2026-004',
    accent: '#ff7a45',
    status: 'live',
    tag: { en: 'VOLUNTEER', es: 'VOLUNTARIADO' },
    title: { en: 'SOLES Website', es: 'Sitio web de SOLES' },
    desc: {
      en: 'Website for the Society of Latino Engineers and Scientists at San José State University, a 180+ member organization. Events load straight from its Google Calendar.',
      es: 'Sitio web de la Society of Latino Engineers and Scientists de San José State University, una asociación de más de 180 miembros. Los eventos se cargan directamente de su Google Calendar.',
    },
    role: { en: 'Lead web developer', es: 'Desarrollador web principal' },
    stack: ['React', 'Vite', 'Netlify Functions', 'Google Calendar API'],
  },
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Rough text width for system sans-serif fonts.
const textWidth = (s, size, bold = false) => s.length * size * (bold ? 0.6 : 0.49)
// Monospace / letter-spaced labels: fixed advance plus tracking.
const labelWidth = (s, size, spacing = 1) => s.length * (size * 0.62 + spacing)

function wrap(text, size, maxWidth) {
  const lines = []
  let line = ''
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (textWidth(next, size) > maxWidth && line) {
      lines.push(line)
      line = word
    } else line = next
  }
  if (line) lines.push(line)
  return lines
}

function card(p, lang) {
  const pad = 40
  const inner = W - pad * 2
  const st = STATUS[p.status]
  const parts = []
  let y = 0

  // Header strip: type tag on the left, build ID + status light on the right.
  const tag = p.tag[lang]
  const tagW = labelWidth(tag, 12) + 28
  parts.push(`<rect x="${pad}" y="30" width="${tagW}" height="26" rx="13" fill="${p.accent}" fill-opacity="0.16" stroke="${p.accent}" stroke-opacity="0.55"/>`)
  parts.push(`<text x="${pad + tagW / 2}" y="47.5" text-anchor="middle" font-family="${FONT}" font-size="12" font-weight="700" letter-spacing="1" fill="${p.accent}">${esc(tag)}</text>`)

  const statusText = st[lang]
  parts.push(`<text x="${W - pad}" y="48" text-anchor="end" font-family="${MONO}" font-size="13" font-weight="600" letter-spacing="1" fill="${st.color}">${statusText}</text>`)
  const dotX = W - pad - labelWidth(statusText, 13) - 16
  parts.push(`<circle cx="${dotX}" cy="43" r="9" fill="${st.color}" fill-opacity="0.18"/>`)
  parts.push(`<circle cx="${dotX}" cy="43" r="4.5" fill="${st.color}"/>`)
  parts.push(`<text x="${dotX - 22}" y="48" text-anchor="end" font-family="${MONO}" font-size="13" fill="${C.faint}">${p.id}</text>`)

  // Title
  y = 102
  parts.push(`<text x="${pad}" y="${y}" font-family="${FONT}" font-size="32" font-weight="700" fill="${C.text}">${esc(p.title[lang])}</text>`)

  // Description
  y += 18
  for (const l of wrap(p.desc[lang], 18, inner)) {
    y += 28
    parts.push(`<text x="${pad}" y="${y}" font-family="${FONT}" font-size="18" fill="${C.muted}">${esc(l)}</text>`)
  }

  // Role
  y += 22
  const roleLabel = lang === 'es' ? 'MI ROL' : 'MY ROLE'
  const roleLines = wrap(p.role[lang], 18.5, inner - 90)
  roleLines.forEach((l, i) => {
    y += i === 0 ? 24 : 26
    if (i === 0) parts.push(`<text x="${pad}" y="${y}" font-family="${MONO}" font-size="12" font-weight="700" letter-spacing="1" fill="${p.accent}">${roleLabel}</text>`)
    parts.push(`<text x="${pad + 90}" y="${y}" font-family="${FONT}" font-size="17" font-weight="600" fill="${C.text}">${esc(l)}</text>`)
  })

  // Stack chips
  y += 26
  let x = pad
  for (const t of p.stack) {
    const color = TECH[t] || C.muted
    const w = textWidth(t, 14, true) + 26
    parts.push(`<rect x="${x}" y="${y}" width="${w}" height="30" rx="7" fill="${color}"/>`)
    parts.push(`<text x="${x + w / 2}" y="${y + 20}" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="600" fill="#ffffff">${esc(t)}</text>`)
    x += w + 10
  }
  y += 30

  const H = y + 36
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(p.title[lang])}">
  <defs><clipPath id="r"><rect width="${W}" height="${H}" rx="14"/></clipPath></defs>
  <g clip-path="url(#r)">
    <rect width="${W}" height="${H}" fill="${C.bg}"/>
    <rect width="${W}" height="6" fill="${p.accent}"/>
  </g>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" stroke="${C.line}"/>
  ${parts.join('\n  ')}
</svg>
`
}

function banner() {
  const H = 230
  const grid = []
  for (let gx = 0; gx <= W; gx += 40) grid.push(`<line x1="${gx}" y1="0" x2="${gx}" y2="${H}"/>`)
  for (let gy = 0; gy <= H; gy += 40) grid.push(`<line x1="0" y1="${gy}" x2="${W}" y2="${gy}"/>`)
  const stripes = ['#f5b700', '#2ecc71', '#7c5cff', '#ff7a45', '#149eca']
  const sw = W / stripes.length
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Isidro Flores, Software Engineer">
  <defs><clipPath id="r"><rect width="${W}" height="${H}" rx="14"/></clipPath></defs>
  <g clip-path="url(#r)">
    <rect width="${W}" height="${H}" fill="${C.bg}"/>
    <g stroke="#f5b700" stroke-opacity="0.07">${grid.join('')}</g>
    ${stripes.map((c, i) => `<rect x="${i * sw}" y="${H - 8}" width="${sw}" height="8" fill="${c}"/>`).join('\n    ')}
  </g>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" stroke="${C.line}"/>
  <text x="48" y="62" font-family="${MONO}" font-size="14" font-weight="600" letter-spacing="2" fill="${C.yellow}">SOFTWARE ENGINEER</text>
  <text x="46" y="122" font-family="${FONT}" font-size="54" font-weight="800" fill="${C.text}">Isidro Flores</text>
  <text x="48" y="164" font-family="${FONT}" font-size="20" fill="${C.muted}">Full-stack · Backend systems · Databases</text>
  <text x="48" y="196" font-family="${FONT}" font-size="16" fill="${C.faint}">B.S. Software Engineering, San José State University · December 2026</text>
</svg>
`
}

writeFileSync(join(OUT, 'banner.svg'), banner())
for (const p of projects) {
  for (const lang of ['en', 'es']) {
    writeFileSync(join(OUT, `${p.file}${lang === 'es' ? '-es' : ''}.svg`), card(p, lang))
  }
}
console.log('Cards written to', OUT)
