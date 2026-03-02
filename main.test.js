import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { buildNavList, handleNavClick } from './main.js'

describe('buildNavList', () => {
  // Happy path
  it('returns a non-empty string for a valid routes array', () => {
    const routes = [{ name: 'Demo', url: 'https://example.com/model.glb' }]
    const result = buildNavList(routes)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('renders a list item and button for each route', () => {
    const routes = [
      { name: 'Demo', url: 'https://example.com/demo.glb' },
      { name: 'Rat', url: '/assets/rat.glb' },
    ]
    const result = buildNavList(routes)
    const parser = new DOMParser()
    const doc = parser.parseFromString(`<ul>${result}</ul>`, 'text/html')
    const items = doc.querySelectorAll('li')
    expect(items).toHaveLength(2)
  })

  it('sets data-url on each button', () => {
    const routes = [
      { name: 'Model A', url: '/model-a.glb' },
      { name: 'Model B', url: '/model-b.glb' },
    ]
    const result = buildNavList(routes)
    expect(result).toContain('data-url="/model-a.glb"')
    expect(result).toContain('data-url="/model-b.glb"')
  })

  it('marks only the first button as active', () => {
    const routes = [
      { name: 'First', url: '/first.glb' },
      { name: 'Second', url: '/second.glb' },
      { name: 'Third', url: '/third.glb' },
    ]
    const result = buildNavList(routes)
    const parser = new DOMParser()
    const doc = parser.parseFromString(`<ul>${result}</ul>`, 'text/html')
    const buttons = doc.querySelectorAll('button')
    expect(buttons[0].className).toContain('active')
    expect(buttons[1].className).not.toContain('active')
    expect(buttons[2].className).not.toContain('active')
  })

  it('renders route names as button text', () => {
    const routes = [{ name: 'Neil Armstrong', url: '/neil.glb' }]
    const result = buildNavList(routes)
    expect(result).toContain('Neil Armstrong')
  })

  it('handles a single route', () => {
    const routes = [{ name: 'Only', url: '/only.glb' }]
    const result = buildNavList(routes)
    expect(result).toContain('Only')
    expect(result).toContain('active')
  })

  it('handles a large number of routes', () => {
    const routes = Array.from({ length: 100 }, (_, i) => ({
      name: `Model ${i}`,
      url: `/model-${i}.glb`,
    }))
    const result = buildNavList(routes)
    const parser = new DOMParser()
    const doc = parser.parseFromString(`<ul>${result}</ul>`, 'text/html')
    expect(doc.querySelectorAll('li')).toHaveLength(100)
  })

  // Null / boundary inputs
  it('returns empty string for null input', () => {
    expect(buildNavList(null)).toBe('')
  })

  it('returns empty string for undefined input', () => {
    expect(buildNavList(undefined)).toBe('')
  })

  it('returns empty string for an empty array', () => {
    expect(buildNavList([])).toBe('')
  })

  it('handles routes with empty name and url', () => {
    const routes = [{ name: '', url: '' }]
    const result = buildNavList(routes)
    expect(result).toContain('data-url=""')
  })

  it('handles routes with special characters in name', () => {
    const routes = [{ name: '<script>alert(1)</script>', url: '/safe.glb' }]
    const result = buildNavList(routes)
    expect(result).toContain('<script>alert(1)</script>')
  })
})

describe('handleNavClick', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    container.innerHTML = `
      <nav>
        <ul>
          <li><button class="active" data-url="/first.glb">First</button></li>
          <li><button data-url="/second.glb">Second</button></li>
          <li><button data-url="/third.glb">Third</button></li>
        </ul>
      </nav>
    `
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
    const mv = document.querySelector('model-viewer')
    if (mv) mv.parentNode.removeChild(mv)
  })

  it('adds active class to the clicked button', () => {
    const buttons = container.querySelectorAll('button')
    const event = { target: buttons[1] }
    handleNavClick(event, buttons)
    expect(buttons[1].classList.contains('active')).toBe(true)
  })

  it('removes active class from all other buttons', () => {
    const buttons = container.querySelectorAll('button')
    const event = { target: buttons[2] }
    handleNavClick(event, buttons)
    expect(buttons[0].classList.contains('active')).toBe(false)
    expect(buttons[1].classList.contains('active')).toBe(false)
    expect(buttons[2].classList.contains('active')).toBe(true)
  })

  it('updates model-viewer src when present', () => {
    const modelViewer = document.createElement('model-viewer')
    document.body.appendChild(modelViewer)

    const buttons = container.querySelectorAll('button')
    const event = { target: buttons[1] }
    handleNavClick(event, buttons)

    expect(modelViewer.src).toBe('/second.glb')
  })

  it('does not throw when model-viewer element is absent', () => {
    const buttons = container.querySelectorAll('button')
    const event = { target: buttons[0] }
    expect(() => handleNavClick(event, buttons)).not.toThrow()
  })

  // Null / boundary inputs
  it('does nothing when event is null', () => {
    const buttons = container.querySelectorAll('button')
    expect(() => handleNavClick(null, buttons)).not.toThrow()
  })

  it('does nothing when event is undefined', () => {
    const buttons = container.querySelectorAll('button')
    expect(() => handleNavClick(undefined, buttons)).not.toThrow()
  })

  it('does nothing when event.target is null', () => {
    const buttons = container.querySelectorAll('button')
    expect(() => handleNavClick({ target: null }, buttons)).not.toThrow()
  })

  it('handles an empty navBtns list without errors', () => {
    const buttons = container.querySelectorAll('button')
    const event = { target: buttons[0] }
    expect(() => handleNavClick(event, [])).not.toThrow()
  })
})
