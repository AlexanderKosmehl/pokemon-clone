import '../style.css'
import { collisions } from '../collisions'
import { Boundary } from '../drawables/Boundary'
import { getCollisionData, predictCollision, rectangularCollision } from '../CollisionHelper'
import {
  PLAYER_SPEED,
  SHOW_COLLIDERS,
} from '../Settings'
import { battlePatches } from '../data/battlePatches'
import { audio } from '../data/audio'
import { sprites } from '../data/sprites'

// Get canvas handle
const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!

// Prepare collision boundaries
const boundaries: Boundary[] = getCollisionData(collisions)
const battleZones: Boundary[] = getCollisionData(battlePatches)

// Keyboard helper
const keys = {
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

// Prepare movable sprites
const background = sprites.background
const foreground = sprites.foreground
const player = sprites.player

const movables = [background, foreground, ...battleZones, ...boundaries]


// Battle transition logic
const battle = {
  initiated: false,
}

function transitionToBattle(currentAnimationId: number) {
  window.cancelAnimationFrame(currentAnimationId)
  player.animate = false
  battle.initiated = true
  audio.map.stop()
  audio.initBattle.play()

  // animateBattleActivation(initBattle)
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
    boundaries.forEach((boundary) => boundary.draw(ctx))
    battleZones.forEach((zone) => zone.draw(ctx))
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

export function initMap() {
  audio.map.play()
  animateMap()

  window.addEventListener('keydown', keyDownListener)
  window.addEventListener('keyup', keyUpListener)
  battle.initiated = false
}
