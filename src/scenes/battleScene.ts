import gsap from 'gsap'
import { faintAnimation } from '../CombatAnimationHelper'
import { audio } from '../data/audio'
import { monsterData } from '../data/monsters'
import { sprites } from '../data/sprites'
import { Sprite } from '../drawables/Sprite'
import { Attack } from '../interfaces/Attack'
import { Monster } from '../drawables/Monster'
import { initMap } from './mapScene'

// Get canvas handle
const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!

// Get interface elements
const battleInterface = document.querySelector(
  '.battle-interface'
) as HTMLElement
const playerHealthbar = document.querySelector(
  '.player-health-bar-current'
) as HTMLElement
const enemyHealthbar = document.querySelector(
  '.enemy-health-bar-current'
) as HTMLElement
const attackContainer = document.querySelector('.attack-container')!
const attackTypeElement = document.querySelector('.attack-type')!
const attackPowerElement = document.querySelector('.attack-power')!

function showAttackHint(attack: Attack) {
  attackTypeElement.textContent = attack.type
  attackTypeElement.className = attack.type.toLowerCase()
  attackPowerElement.textContent = String(attack.damage)
}

let player: Monster
let enemy: Monster

let effectSprites: Sprite[] = []

let attackQueue: { monster: Monster; attack: Attack; target: Monster }[] = []

function handleAttackSelection(attack: Attack) {
  // Prepare enemy move
  const enemyAttack = {
    monster: enemy,
    attack: enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)],
    target: player,
  }

  // Push player attack
  attackQueue.push({ monster: player, attack, target: enemy })

  // Insert enemy attack before or after player attack depending on their speed
  if (enemy.speed > player.speed) {
    attackQueue.unshift(enemyAttack)
  } else {
    attackQueue.push(enemyAttack)
  }

  // Execute Combat
  executeTurn()
}

const dialogueBox = document.querySelector('.dialogue-box') as HTMLElement
let animationIsRunning = false

async function executeTurn() {
  const currentMove = attackQueue[0]
  attackQueue.shift()

  // Display Dialogue
  dialogueBox.textContent = `${currentMove.monster.name} used ${currentMove.attack.name}!`
  dialogueBox.style.display = 'block'

  console.log('Player: ', player.health, )

  // Execute attacks
  currentMove.target.health =
    currentMove.attack.damage > currentMove.target.health
      ? 0
      : currentMove.target.health - currentMove.attack.damage

  const targetHealthBar = currentMove.monster.isEnemy
    ? '.player-health-bar-current'
    : '.enemy-health-bar-current'

  animationIsRunning = true
  await currentMove.attack.animation(
    currentMove.monster,
    currentMove.target,
    targetHealthBar,
    effectSprites
  )

  if (currentMove.target.health === 0) {
    await faintAnimation(currentMove.target)
    dialogueBox.textContent = `${currentMove.target.name} has fainted!`
    dialogueBox.style.display = 'block'

    endBattle()
  }

  animationIsRunning = false
}

dialogueBox.addEventListener('click', () => {
  if (animationIsRunning) return

  if (attackQueue.length > 0) {
    executeTurn()
  } else {
    dialogueBox.style.display = 'none'
  }
})

let battleAnimationId: number

function animateBattle() {
  // Get animationId to cancel animation later
  battleAnimationId = window.requestAnimationFrame(animateBattle)

  // Draw battle from back to front
  sprites.battleBackground.draw(ctx)
  enemy.sprite.draw(ctx)
  effectSprites.forEach((sprite) => sprite.draw(ctx))
  player.sprite.draw(ctx)
}

export function initBattle() {
  audio.battle.play()

  // Prepare Interface
  battleInterface.style.display = 'block'
  playerHealthbar.style.width = '100%'
  enemyHealthbar.style.width = '100%'

  // Initialize monsters
  player = new Monster({ ...monsterData.Emby }, false)
  enemy = new Monster({ ...monsterData.Draggle }, true)

  // Prepare player attacks
  attackContainer.replaceChildren()
  player.attacks.forEach((attack) => {
    const button = document.createElement('button')
    button.textContent = attack.name
    button.addEventListener('click', () => handleAttackSelection(attack))
    button.addEventListener('mouseover', () => showAttackHint(attack))
    attackContainer.appendChild(button)
  })

  // Start animation loop
  animateBattle()
}

async function endBattle() {
  // Cleanup
  attackQueue = []

  // Show transition animation
  await gsap.to('.battle-overlay', {
    opacity: 1,
    onComplete: () => {
      cancelAnimationFrame(battleAnimationId)

      const battleInterface = document.querySelector(
        '.battle-interface'
      ) as HTMLElement
      battleInterface.style.display = 'none'

      gsap.to('.battle-overlay', {
        opacity: 0,
      })

      dialogueBox.style.display = 'none'
    },
  })

  audio.battle.stop()

  initMap()
}
