import './style.css'
import arIcon from './ar-icon.js'
import ratGlb from './assets/rat.glb'
import human1Glb from './assets/human-wholebody.glb'
import human2Glb from './assets/human-halfbody.glb'

export const routes = [
  {
    name: 'Demo',
    url: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb'
  },
  {
    name: 'Rat',
    url: ratGlb
  },
  {
    name: 'Human 1',
    url: human1Glb
  },
  {
    name: 'Human 2',
    url: human2Glb
  },
]

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return ch;
    }
  });
}

function escapeAttribute(value) {
  // For now, use the same escaping as for HTML text content.
  return escapeHtml(value);
}

export function buildNavList(routeList) {
  if (!routeList || routeList.length === 0) return ''
  let html = ''
  routeList.forEach((route, index) => {
    const safeUrl = escapeAttribute(route && route.url)
    const safeName = escapeHtml(route && route.name)
    html += `
    <li>
      <button data-url="${safeUrl}" class="${index === 0 ? 'active' : ''}">
        ${safeName}
      </button>
    </li>
  `
  })
  return html
}

export function handleNavClick(e, navBtns) {
  if (!e) return

  // Prefer the element the listener is attached to; fall back to resolving from target.
  const baseTarget = e.currentTarget || e.target
  if (!(baseTarget instanceof HTMLElement)) return

  const button = typeof baseTarget.closest === 'function'
    ? baseTarget.closest('button')
    : baseTarget

  if (!button || !(button instanceof HTMLElement)) return

  const url = button.dataset ? button.dataset.url : undefined
  if (!url) return

  const modelViewerEl = document.querySelector('model-viewer')
  if (modelViewerEl) modelViewerEl.src = url

  navBtns.forEach((btn) => btn.classList.remove('active'))
  button.classList.add('active')
}

const NavList = buildNavList(routes)

window.onload = () => {
  const navBtns = document.querySelectorAll('nav li button')
  navBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      handleNavClick(e, navBtns)
    })
  })
}

const arButtonStyle = `
  position: absolute;
  top: 0.5rem;
  right: 0;
`

const appEl = document.querySelector('#app')
if (appEl) {
  appEl.innerHTML = `
  <div>
    <h1><img src="${import.meta.env.BASE_URL}logo.svg" alt="" aria-hidden="true" class="site-logo" />Model Viewer</h1>
    <p>Testing 3D models with AR on mobile device.</p>
    <nav>
      ${NavList}
    </nav>
    <div class="model-viewer-container">
      <!-- Use it like any other HTML element -->
      <model-viewer
        alt="Neil Armstrong's Spacesuit from the Smithsonian Digitization Programs Office and National Air and Space Museum"
        src="${routes[0].url}"
        ar
        environment-image="https://modelviewer.dev/shared-assets/environments/moon_1k.hdr"
        poster="https://modelviewer.dev/shared-assets/models/NeilArmstrong.webp"
        shadow-intensity="1"
        camera-controls
        touch-action="pan-y"
      >
        <button slot="ar-button" style="${arButtonStyle}">
          View in AR
          ${arIcon}
        </button>
      </model-viewer>
    </div>
  </div>
`
}

