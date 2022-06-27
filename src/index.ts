import './style.css'
import mapImageURI from './img/pokemonCloneMap.png'
import foregroundLayerURI from './img/pokemonCloneMapForeground.png'
import playerFrontURI from './img/playerDown.png'

import { collisions } from './collisions'
import { Sprite } from './Sprite'
import { Boundary } from './Boundary'
import { predictCollision } from './CollisionHelper'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  INITIAL_X_OFFSET,
  INITIAL_Y_OFFSET,
  MAP_COLS,
  MAP_ROWS,
  MAP_SCALING,
  PLAYER_SPEED,
  SHOW_COLLIDERS,
} from './Settings'

const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!
canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT
ctx.imageSmoothingEnabled = false

const mapImage = new Image()
mapImage.src = mapImageURI

const foregroundImage = new Image()
foregroundImage.src = foregroundLayerURI

const playerImage = new Image()
playerImage.src = playerFrontURI

const collisionArrays = []
for (let y = 0; y < MAP_ROWS; y++) {
  collisionArrays.push(collisions.slice(y * MAP_COLS, y * MAP_COLS + MAP_COLS))
}

const boundaries: Boundary[] = []
collisionArrays.forEach((row, rowIndex) =>
  row.forEach((entry, colIndex) => {
    if (entry === 1025) {
      boundaries.push(
        new Boundary({
          position: {
            x: colIndex * Boundary.size + INITIAL_X_OFFSET,
            y: rowIndex * Boundary.size + INITIAL_Y_OFFSET,
          },
          context: ctx,
        })
      )
    }
  })
)

const background = new Sprite({
  position: { x: INITIAL_X_OFFSET, y: INITIAL_Y_OFFSET },
  image: mapImage,
  context: ctx,
  scale: MAP_SCALING,
})

const foreground = new Sprite({
  position: { x: INITIAL_X_OFFSET, y: INITIAL_Y_OFFSET },
  image: foregroundImage,
  context: ctx,
  scale: MAP_SCALING,
})

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImage,
  frames: { max: 4 },
  context: ctx,
})

let keys = {
  up: {
    isPressed: false,
  },
  down: {
    isPressed: false,
  },
  left: {
    isPressed: false,
  },
  right: {
    isPressed: false,
  },
}

const movables = [background, foreground, ...boundaries]

/*
  Animation Loop
*/

function animate() {
  window.requestAnimationFrame(animate)
  background.draw()

  if (SHOW_COLLIDERS) boundaries.forEach((boundary) => boundary.draw())

  player.draw()

  foreground.draw()

  // Movement
  if (
    keys.up.isPressed &&
    !boundaries.some((boundary) => predictCollision('up', player, boundary))
  ) {
    movables.forEach((movable) => {
      movable.position.y += PLAYER_SPEED
    })
  } else if (
    keys.left.isPressed &&
    !boundaries.some((boundary) => predictCollision('left', player, boundary))
  ) {
    movables.forEach((movable) => {
      movable.position.x += PLAYER_SPEED
    })
  } else if (
    keys.down.isPressed &&
    !boundaries.some((boundary) => predictCollision('down', player, boundary))
  ) {
    movables.forEach((movable) => {
      movable.position.y -= PLAYER_SPEED
    })
  } else if (
    keys.right.isPressed &&
    !boundaries.some((boundary) => predictCollision('right', player, boundary))
  ) {
    movables.forEach((movable) => {
      movable.position.x -= PLAYER_SPEED
    })
  }
}

/*
  Click Listener
*/

window.addEventListener('keydown', (e: KeyboardEvent) => {
  switch (e.key) {
    case 'w':
    case 'ArrowUp':
      keys.up.isPressed = true
      break
    case 's':
    case 'ArrowDown':
      keys.down.isPressed = true
      break
    case 'a':
    case 'ArrowLeft':
      keys.left.isPressed = true
      break
    case 'd':
    case 'ArrowRight':
      keys.right.isPressed = true
      break
  }
})

window.addEventListener('keyup', (e: KeyboardEvent) => {
  switch (e.key) {
    case 'w':
    case 'ArrowUp':
      keys.up.isPressed = false
      break
    case 's':
    case 'ArrowDown':
      keys.down.isPressed = false
      break
    case 'a':
    case 'ArrowLeft':
      keys.left.isPressed = false
      break
    case 'd':
    case 'ArrowRight':
      keys.right.isPressed = false
      break
  }
})

animate()
