import './style.css'
import mapImageURI from './img/pokemonCloneMap.png'
import foregroundLayerURI from './img/pokemonCloneMapForeground.png'
import playerDownURI from './img/playerDown.png'
import playerUpURI from './img/playerUp.png'
import playerLeftURI from './img/playerLeft.png'
import playerRightURI from './img/playerRight.png'

import { collisions } from './collisions'
import { Sprite } from './Sprite'
import { Boundary } from './Boundary'
import { predictCollision, rectangularCollision } from './CollisionHelper'
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
import { battlePatches } from './battlePatches'
import { animateBattleActivation } from './AnimationHelper'
import { animateBattle, initBattle } from './battleScene'
import { audio } from './audio'

const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!
canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT
ctx.imageSmoothingEnabled = false

const mapImage = new Image()
mapImage.src = mapImageURI

const foregroundImage = new Image()
foregroundImage.src = foregroundLayerURI

const playerUpImage = new Image()
playerUpImage.src = playerUpURI
const playerDownImage = new Image()
playerDownImage.src = playerDownURI
const playerLeftImage = new Image()
playerLeftImage.src = playerLeftURI
const playerRightImage = new Image()
playerRightImage.src = playerRightURI

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

const battlePatchArrays = []
for (let y = 0; y < MAP_ROWS; y++) {
  battlePatchArrays.push(
    battlePatches.slice(y * MAP_COLS, y * MAP_COLS + MAP_COLS)
  )
}

const battleZones: Boundary[] = []
battlePatchArrays.forEach((row, rowIndex) =>
  row.forEach((entry, colIndex) => {
    if (entry === 1025) {
      battleZones.push(
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
  image: playerDownImage,
  frames: { max: 4, hold: 10 },
  context: ctx,
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage,
  },
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

const movables = [background, foreground, ...battleZones, ...boundaries]

export const battle = {
  initiated: false,
}

/*
  Animation Loop
*/

export function animate() {
  // Get animationId to cancel animation later
  const animationId = window.requestAnimationFrame(animate)

  background.draw()
  player.draw()
  foreground.draw()

  // Show debug colliders
  if (SHOW_COLLIDERS) {
    boundaries.forEach((boundary) => boundary.draw())
    battleZones.forEach((zone) => zone.draw())
  }

  // Check for battle activation

  if (battle.initiated) return

  if (
    player.animate &&
    battleZones.some((zone) => rectangularCollision(player, zone)) &&
    Math.random() < 0.01
  ) {
    window.cancelAnimationFrame(animationId)
    player.animate = false
    battle.initiated = true
    audio.map.stop()
    audio.initBattle.play()
    audio.battle.play()

    animateBattleActivation(initBattle)

    return
  }

  // Movement
  if (
    keys.up.isPressed &&
    !boundaries.some((boundary) => predictCollision('up', player, boundary))
  ) {
    player.animate = true
    player.image = player.sprites!.up
    movables.forEach((movable) => {
      movable.position.y += PLAYER_SPEED
    })
  } else if (
    keys.left.isPressed &&
    !boundaries.some((boundary) => predictCollision('left', player, boundary))
  ) {
    player.animate = true
    player.image = player.sprites!.left
    movables.forEach((movable) => {
      movable.position.x += PLAYER_SPEED
    })
  } else if (
    keys.down.isPressed &&
    !boundaries.some((boundary) => predictCollision('down', player, boundary))
  ) {
    player.animate = true
    player.image = player.sprites!.down
    movables.forEach((movable) => {
      movable.position.y -= PLAYER_SPEED
    })
  } else if (
    keys.right.isPressed &&
    !boundaries.some((boundary) => predictCollision('right', player, boundary))
  ) {
    player.image = player.sprites!.right
    player.animate = true
    movables.forEach((movable) => {
      movable.position.x -= PLAYER_SPEED
    })
  } else {
    player.animate = false
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


let clicked = false
window.addEventListener('click', () => {
  if (clicked) return

  audio.map.play()
  clicked = true
})

animate()
