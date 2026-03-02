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

export function buildNavList(routeList) {
  if (!routeList || routeList.length === 0) return ''
  let html = ''
  routeList.forEach((route, index) => {
    html += `
    <li>
      <button data-url="${route.url}" class="${index === 0 ? 'active' : ''}">
        ${route.name}
      </button>
    </li>
  `
  })
  return html
}

export function handleNavClick(e, navBtns) {
  if (!e || !e.target) return
  const url = e.target.dataset.url

  const modelViewerEl = document.querySelector('model-viewer')
  if (modelViewerEl) modelViewerEl.src = url

  navBtns.forEach((btn) => btn.classList.remove('active'))
  e.target.classList.add('active')
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
    <h1>Model Viewer</h1>
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

