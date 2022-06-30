import '../style.css'
import { collisions } from '../collisions'
import { Sprite } from '../drawables/Sprite'
import { Boundary } from '../drawables/Boundary'
import { predictCollision, rectangularCollision } from '../CollisionHelper'
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
} from '../Settings'
import { battlePatches } from '../data/battlePatches'
import { animateBattleActivation } from '../AnimationHelper'
import { initBattle } from './battleScene'
import { audio } from '../data/audio'
import { sprites } from '../data/sprites'

const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!
canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT
ctx.imageSmoothingEnabled = false



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

const background = sprites.background
const foreground = sprites.foreground
const player = sprites.player

const movables = [background, foreground, ...battleZones, ...boundaries]

export const battle = {
  initiated: false,
}

function transitionToBattle(currentAnimationId: number) {
  window.cancelAnimationFrame(currentAnimationId)
  player.animate = false
  battle.initiated = true
  audio.map.stop()
  audio.initBattle.play()
  audio.battle.play()

  animateBattleActivation(initBattle)
}

/*
  Animation Loop
*/

export function animateMap() {
  // Get animationId to cancel animation later
  const animationId = window.requestAnimationFrame(animateMap)

  background.draw(ctx)
  player.draw(ctx)
  foreground.draw(ctx)

  // Show debug colliders
  if (SHOW_COLLIDERS) {
    boundaries.forEach((boundary) => boundary.draw())
    battleZones.forEach((zone) => zone.draw())
  }

  // Battle is running
  if (battle.initiated) return
  
  // Check for battle activation
  if (
    player.animate &&
    battleZones.some((zone) => rectangularCollision(player, zone)) &&
    Math.random() < 0.01
  ) {
    transitionToBattle(animationId)
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

function keyDownListener(e: KeyboardEvent) {
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
}

function keyUpListener(e: KeyboardEvent) {
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
}
window.addEventListener('keydown', keyDownListener)
window.addEventListener('keyup', keyUpListener)
