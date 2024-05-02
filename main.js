import './style.css'
import ratGlb from './assets/rat.glb'
import human1Glb from './assets/human-wholebody.glb'
import human2Glb from './assets/human-halfbody.glb'

const routes = [
  {
    name: 'Quick start',
    url: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb'
  },
  {
    name: 'Rat',
    url: ratGlb
  },
  {
    name: 'Human whole',
    url: human1Glb
  },
  {
    name: 'Human half',
    url: human2Glb
  },
]

let NavList = ''
routes.forEach((route) => {
  NavList += `
    <li>
      <button data-url="${route.url}">
        ${route.name}
      </button>
    </li>
  `
})

window.onload = () => {
  const navBtns = document.querySelectorAll('nav li button')
  navBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const url = e.target.dataset.url

      const modelViewerEl = document.querySelector('model-viewer')
      if (modelViewerEl) modelViewerEl.src = url
    })
  })
}

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Model Viewer!</h1>
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
        camera-controls touch-action="pan-y"
      >
      </model-viewer>
    </div>
  </div>
`
