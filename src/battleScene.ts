import { attacks } from './attacks'
import battleBackgroundURI from './img/battleBackground.png'
import { Monster } from './Monster'
import { monsters } from './monsters'
import { Sprite } from './Sprite'

const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!

const battleBackgroundImage = new Image()
battleBackgroundImage.src = battleBackgroundURI

const draggle = new Monster({
  position: {
    x: 800,
    y: 100,
  },
  ...monsters.Draggle.sprite,
  context: ctx,
  isEnemy: true,
  name: monsters.Draggle.name,
})

const emby = new Monster({
  position: {
    x: 280,
    y: 325,
  },
  ...monsters.Emby.sprite,
  context: ctx,
  name: monsters.Emby.name,
})

const battleBackground = new Sprite({
  position: { x: 0, y: 0 },
  image: battleBackgroundImage,
  context: ctx,
})

const renderedSprites: Sprite[] = []

function handleAttack(attack: any) {
  emby.attack(attack, draggle, renderedSprites)

  queue.push(() => {
    draggle.attack(
      monsters.Draggle.attacks[
        Math.floor(Math.random() * monsters.Draggle.attacks.length)
      ],
      emby,
      renderedSprites
    )
  })
}

export function animateBattle() {
  window.requestAnimationFrame(animateBattle)
  battleBackground.draw()
  draggle.draw()
  renderedSprites.forEach((sprite) => sprite.draw())
  emby.draw()
}

const queue: (() => void)[] = []

const attackContainer = document.querySelector('.attack-container')!
monsters.Emby.attacks.forEach((attack) => {
  const button = document.createElement('button')
  button.textContent = attack.name
  button.onclick = () => handleAttack(attack)
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
