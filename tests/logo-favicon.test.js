import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// ─── helpers ────────────────────────────────────────────────────────────────

function readFile(relPath) {
  return readFileSync(resolve(root, relPath), 'utf8')
}

// ─── logo.svg ───────────────────────────────────────────────────────────────

describe('public/logo.svg', () => {
  let svgContent
  let svgDom
  let svgEl

  beforeAll(() => {
    svgContent = readFile('public/logo.svg')
    svgDom = new JSDOM(svgContent, { contentType: 'image/svg+xml' })
    svgEl = svgDom.window.document.querySelector('svg')
  })

  it('file exists at public/logo.svg', () => {
    expect(existsSync(resolve(root, 'public/logo.svg'))).toBe(true)
  })

  it('is a valid SVG with xmlns attribute', () => {
    expect(svgEl).not.toBeNull()
    expect(svgEl.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg')
  })

  it('has a square viewBox (equal width and height)', () => {
    const viewBox = svgEl.getAttribute('viewBox')
    expect(viewBox).toBeTruthy()
    const [, , w, h] = viewBox.split(' ').map(Number)
    expect(w).toBe(h)
  })

  it('viewBox is 0 0 100 100', () => {
    expect(svgEl.getAttribute('viewBox')).toBe('0 0 100 100')
  })

  it('has explicit width and height set to 100', () => {
    expect(svgEl.getAttribute('width')).toBe('100')
    expect(svgEl.getAttribute('height')).toBe('100')
  })

  it('contains a background circle element', () => {
    const circle = svgDom.window.document.querySelector('circle')
    expect(circle).not.toBeNull()
  })

  it('background circle is centered at (50, 50)', () => {
    const circle = svgDom.window.document.querySelector('circle')
    expect(Number(circle.getAttribute('cx'))).toBe(50)
    expect(Number(circle.getAttribute('cy'))).toBe(50)
  })

  it('contains polygon elements for the 3D cube faces', () => {
    const polygons = svgDom.window.document.querySelectorAll('polygon')
    expect(polygons.length).toBeGreaterThanOrEqual(3)
  })

  it('contains polyline elements for AR corner brackets', () => {
    const polylines = svgDom.window.document.querySelectorAll('polyline')
    expect(polylines.length).toBe(4)
  })

  it('AR brackets group has a transform attribute', () => {
    const g = svgDom.window.document.querySelector('g[transform]')
    expect(g).not.toBeNull()
  })

  it('SVG does not reference the old vite.svg', () => {
    expect(svgContent).not.toContain('vite')
  })

  // edge cases

  it('file is non-empty (more than 100 bytes)', () => {
    expect(svgContent.length).toBeGreaterThan(100)
  })

  it('does not contain any script elements (XSS safety)', () => {
    const scripts = svgDom.window.document.querySelectorAll('script')
    expect(scripts.length).toBe(0)
  })

  it('does not contain any external resource references (xlink:href or href to http)', () => {
    expect(svgContent).not.toMatch(/xlink:href\s*=\s*["']https?:\/\//)
    expect(svgContent).not.toMatch(/<image[^>]+href\s*=\s*["']https?:\/\//)
  })
})

// ─── index.html (favicon) ───────────────────────────────────────────────────

describe('index.html favicon', () => {
  let dom
  let favicon

  beforeAll(() => {
    const html = readFile('index.html')
    dom = new JSDOM(html)
    favicon = dom.window.document.querySelector('link[rel="icon"]')
  })

  it('has a favicon link element', () => {
    expect(favicon).not.toBeNull()
  })

  it('favicon href points to /logo.svg', () => {
    expect(favicon.getAttribute('href')).toBe('/logo.svg')
  })

  it('favicon href does NOT point to the old vite.svg', () => {
    expect(favicon.getAttribute('href')).not.toContain('vite')
  })

  it('favicon MIME type is image/svg+xml', () => {
    expect(favicon.getAttribute('type')).toBe('image/svg+xml')
  })

  it('page title is "Model Viewer"', () => {
    const title = dom.window.document.querySelector('title')
    expect(title.textContent).toBe('Model Viewer')
  })

  // edge cases

  it('favicon href is not empty', () => {
    expect(favicon.getAttribute('href')).toBeTruthy()
  })

  it('only one favicon link is declared', () => {
    const allFavicons = dom.window.document.querySelectorAll('link[rel="icon"]')
    expect(allFavicons.length).toBe(1)
  })
})

// ─── main.js (logo in template) ─────────────────────────────────────────────

describe('main.js logo in HTML template', () => {
  let mainContent

  beforeAll(() => {
    mainContent = readFile('main.js')
  })

  it('contains an <img> tag for the logo', () => {
    expect(mainContent).toContain('<img')
  })

  it('logo img src points to /logo.svg', () => {
    expect(mainContent).toContain('src="/logo.svg"')
  })

  it('logo img has an alt attribute', () => {
    expect(mainContent).toMatch(/alt\s*=\s*["'][^"']+["']/)
  })

  it('logo img alt text is descriptive (not empty)', () => {
    const match = mainContent.match(/alt\s*=\s*["']([^"']*)["']/)
    expect(match).not.toBeNull()
    expect(match[1].trim().length).toBeGreaterThan(0)
  })

  it('logo img has class="site-logo"', () => {
    expect(mainContent).toContain('class="site-logo"')
  })

  it('logo img is placed inside the <h1> heading', () => {
    // Extract the h1 element content (spans multiple lines)
    const h1Match = mainContent.match(/<h1>([\s\S]*?)<\/h1>/)
    expect(h1Match).not.toBeNull()
    expect(h1Match[1]).toContain('<img')
  })

  it('heading text "Model Viewer" is present after the logo', () => {
    const h1Match = mainContent.match(/<h1>([\s\S]*?)<\/h1>/)
    expect(h1Match).not.toBeNull()
    expect(h1Match[1]).toContain('Model Viewer')
  })

  // edge cases

  it('does not still reference the old vite.svg in the template', () => {
    expect(mainContent).not.toContain('vite.svg')
  })

  it('logo img src path starts with a leading slash (absolute path)', () => {
    const match = mainContent.match(/src\s*=\s*["']([^"']*)["']/)
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/^\//)
  })
})

// ─── style.css (.site-logo) ─────────────────────────────────────────────────

describe('style.css .site-logo class', () => {
  let cssContent

  beforeAll(() => {
    cssContent = readFile('style.css')
  })

  it('defines the .site-logo class', () => {
    expect(cssContent).toContain('.site-logo')
  })

  it('.site-logo has a height property', () => {
    const block = cssContent.match(/\.site-logo\s*\{([^}]*)\}/s)
    expect(block).not.toBeNull()
    expect(block[1]).toContain('height')
  })

  it('.site-logo has a width property', () => {
    const block = cssContent.match(/\.site-logo\s*\{([^}]*)\}/s)
    expect(block).not.toBeNull()
    expect(block[1]).toContain('width')
  })

  it('.site-logo height and width are equal (square)', () => {
    const block = cssContent.match(/\.site-logo\s*\{([^}]*)\}/s)
    expect(block).not.toBeNull()
    const props = block[1]
    const heightMatch = props.match(/height\s*:\s*([^;]+);/)
    const widthMatch = props.match(/width\s*:\s*([^;]+);/)
    expect(heightMatch).not.toBeNull()
    expect(widthMatch).not.toBeNull()
    expect(heightMatch[1].trim()).toBe(widthMatch[1].trim())
  })

  it('h1 uses display: flex for logo alignment', () => {
    const h1Block = cssContent.match(/^h1\s*\{([^}]*)\}/ms)
    expect(h1Block).not.toBeNull()
    expect(h1Block[1]).toContain('display')
    expect(h1Block[1]).toContain('flex')
  })

  it('h1 has align-items: center for vertical logo alignment', () => {
    const h1Block = cssContent.match(/^h1\s*\{([^}]*)\}/ms)
    expect(h1Block[1]).toContain('align-items')
    expect(h1Block[1]).toContain('center')
  })

  it('h1 has a gap property for spacing between logo and text', () => {
    const h1Block = cssContent.match(/^h1\s*\{([^}]*)\}/ms)
    expect(h1Block[1]).toContain('gap')
  })

  // edge cases

  it('.site-logo does not set vertical-align (redundant in flex)', () => {
    const block = cssContent.match(/\.site-logo\s*\{([^}]*)\}/s)
    expect(block[1]).not.toContain('vertical-align')
  })
})
