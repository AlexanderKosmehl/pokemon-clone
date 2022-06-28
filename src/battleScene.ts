import { animate, battle } from '.'
import { Attack } from './Attack'
import battleBackgroundURI from './img/battleBackground.png'
import { Monster } from './Monster'
import { monsters } from './monsters'
import { Sprite } from './Sprite'

import gsap from 'gsap'

const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!

const battleBackgroundImage = new Image()
battleBackgroundImage.src = battleBackgroundURI

let draggle: Monster
let emby: Monster

const battleBackground = new Sprite({
  position: { x: 0, y: 0 },
  image: battleBackgroundImage,
  context: ctx,
})

const renderedSprites: Sprite[] = []

const queue: (() => void)[] = []

const attackTypeElement = document.querySelector('.attack-type')!
const attackPowerElement = document.querySelector('.attack-power')!

function showAttackHint(attack: Attack) {
  attackTypeElement.textContent = attack.type
  attackTypeElement.className = attack.type.toLowerCase()
  attackPowerElement.textContent = String(attack.damage)
}

let battleAnimationId: number

export function initBattle() {
  const battleInterface = document.querySelector(
    '.battle-interface'
  ) as HTMLElement
  battleInterface.style.display = 'block'
  const playerHealthbar = document.querySelector(
    '.player-health-bar-current'
  ) as HTMLElement
  const enemyHealthbar = document.querySelector(
    '.enemy-health-bar-current'
  ) as HTMLElement
  playerHealthbar.style.width = '100%'
  enemyHealthbar.style.width = '100%'
  const attackContainer = document.querySelector('.attack-container')!
  attackContainer.replaceChildren()

  draggle = new Monster({
    position: {
      x: 800,
      y: 100,
    },
    ...monsters.Draggle.sprite,
    context: ctx,
    isEnemy: true,
    name: monsters.Draggle.name,
  })

  emby = new Monster({
    position: {
      x: 280,
      y: 325,
    },
    ...monsters.Emby.sprite,
    context: ctx,
    name: monsters.Emby.name,
  })

  monsters.Emby.attacks.forEach((attack) => {
    const button = document.createElement('button')
    button.textContent = attack.name
    button.onclick = () => {
      console.log('Before:', draggle.health)
      emby.attack(attack, draggle, renderedSprites)
      console.log('After:', draggle.health)

      if (draggle.health === 0) {
        queue.push(() => draggle.faint())
        queue.push(() => {
          gsap.to('.battle-overlay', {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId)
              animate()

              const battleInterface = document.querySelector(
                '.battle-interface'
              ) as HTMLElement
              battleInterface.style.display = 'none'

              gsap.to('.battle-overlay', {
                opacity: 0,
              })

              battle.initiated = false
            },
          })
        })

        return
      } else {
        // Queue next attack
        queue.push(() => {
          draggle.attack(
            monsters.Draggle.attacks[
              Math.floor(Math.random() * monsters.Draggle.attacks.length)
            ],
            emby,
            renderedSprites
          )

          if (emby.health === 0) {
            queue.push(() => emby.faint())
            queue.push(() => {
              gsap.to('.battle-overlay', {
                opacity: 1,
                onComplete: () => {
                  cancelAnimationFrame(battleAnimationId)
                  animate()

                  const battleInterface = document.querySelector(
                    '.battle-interface'
                  ) as HTMLElement
                  battleInterface.style.display = 'none'

                  gsap.to('.battle-overlay', {
                    opacity: 0,
                  })

                  battle.initiated = false
                },
              })
            })
          }
        })
      }
    }
    button.addEventListener('mouseover', () => showAttackHint(attack))
    attackContainer.appendChild(button)
  })

  const dialogueBox = document.querySelector('.dialogue-box') as HTMLElement
  dialogueBox.addEventListener('click', () => {
    if (queue.length > 0) {
      queue[0]()
      queue.shift()
    } else {
      dialogueBox.style.display = 'none'
    }
  })

  animateBattle()
}

export function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  battleBackground.draw()
  draggle.draw()
  renderedSprites.forEach((sprite) => sprite.draw())
  emby.draw()
}
