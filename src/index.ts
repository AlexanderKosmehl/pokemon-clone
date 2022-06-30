import { initMap } from './scenes/mapScene'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  INITIAL_X_OFFSET,
  INITIAL_Y_OFFSET,
  MAP_SCALING,
} from './Settings'

// Configure canvas for game
const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!
canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT
ctx.imageSmoothingEnabled = false

// Initialize game
function startGame() {
  initMap()
  window.removeEventListener('click', startGame)
}

window.addEventListener('click', startGame)

// Render placeholder background until game is started
import backgroundPlaceholderURI from './img/pokemonCloneMap.png'
const placeholderImage = new Image()
placeholderImage.onload = () => {
  ctx.drawImage(
    placeholderImage,
    INITIAL_X_OFFSET,
    INITIAL_Y_OFFSET,
    placeholderImage.width * MAP_SCALING,
    placeholderImage.height * MAP_SCALING
  )
  ctx.textAlign = 'center'
  ctx.font = '30pt "Press Start 2P"'
  ctx.fillText('Click to start', canvas.width / 2, canvas.height / 2 + 15)
}
placeholderImage.src = backgroundPlaceholderURI
