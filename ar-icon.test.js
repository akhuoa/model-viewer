import { describe, it, expect } from 'vitest'
import arIcon from './ar-icon.js'

describe('arIcon', () => {
  it('exports a non-empty string', () => {
    expect(typeof arIcon).toBe('string')
    expect(arIcon.length).toBeGreaterThan(0)
  })

  it('contains an SVG element', () => {
    expect(arIcon).toContain('<svg')
    expect(arIcon).toContain('</svg>')
  })

  it('contains a wrapping span element', () => {
    expect(arIcon).toContain('<span')
    expect(arIcon).toContain('</span>')
  })

  it('sets fill to currentColor on the SVG', () => {
    expect(arIcon).toContain('fill="currentColor"')
  })

  it('contains polyline and line geometry elements', () => {
    expect(arIcon).toContain('<polyline')
    expect(arIcon).toContain('<line')
  })

  it('has a valid viewBox attribute', () => {
    expect(arIcon).toContain('viewBox="0 0 512 512"')
  })

  it('is valid HTML (parseable by DOMParser)', () => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(arIcon, 'text/html')
    const svg = doc.querySelector('svg')
    expect(svg).not.toBeNull()
  })
})
