import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

const routes = [
  {
    name: 'Quick start',
    url: './quick-start.html'
  },
  {
    name: 'Rat',
    url: './rat.html'
  },
  {
    name: 'Human whole',
    url: './human-1.html'
  },
  {
    name: 'Human half',
    url: './human-2.html'
  },
  {
    name: 'Demo',
    url: './demo.html'
  },
  {
    name: 'Background',
    url: './background.html'
  }
]

let NavList = ''
routes.forEach((route) => {
  NavList += `
    <li>
      <a href="${route.url}">
        ${route.name}
      </a>
    </li>
  `
})

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Model Viewer!</h1>
    <nav>
      ${NavList}
    </nav>
  </div>
`

setupCounter(document.querySelector('#counter'))
