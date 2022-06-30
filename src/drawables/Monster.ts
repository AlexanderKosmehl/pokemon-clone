import { Sprite, SpriteProps } from './Sprite'
import gsap from 'gsap'
import fireballURI from '../img/fireball.png'
import { Attack } from '../interfaces/Attack'
import { audio } from '../data/audio'

interface MonsterProps extends SpriteProps {
  name?: string
  isEnemy?: boolean
}

export class Monster extends Sprite {
  name?: string
  isEnemy?: boolean
  health: number = 100

  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    scale = 1,
    sprites,
    animate = false,
    rotation = 0,
    name,
    isEnemy,
  }: MonsterProps) {
    super({
      position,
      image,
      frames,
      scale,
      sprites,
      animate,
      rotation,
    })
    this.name = name
    this.isEnemy = isEnemy
  }

  attack(attack: Attack, recipient: Monster, renderedSprites: Sprite[]) {
    const dialogueBox = document.querySelector('.dialogue-box') as HTMLElement
    dialogueBox.style.display = 'block'
    dialogueBox.textContent = `${this.name} used ${attack.name}!`

    recipient.health =
      attack.damage > recipient.health ? 0 : recipient.health - attack.damage

    // Target health bar
    const healthBar = this.isEnemy
      ? '.player-health-bar-current'
      : '.enemy-health-bar-current'

    switch (attack.name) {
      case 'Tackle': {
        const movementDistance = this.isEnemy ? -20 : 20

        const tl = gsap.timeline()
        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              // Update health bar
              gsap.to(healthBar, {
                width: recipient.health + '%',
              })

              audio.tackleHit.play()

              // Shake recipient
              gsap.to(recipient.position, {
                x: recipient.position.x + movementDistance / 2,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              })
            },
          })
          .to(this.position, {
            x: this.position.x,
          })
        break
      }
      case 'Fireball': {
        const fireballImage = new Image()
        fireballImage.src = fireballURI
        const fireball = new Sprite({
          position: {
            x: this.position.x,
            y: this.position.y,
          },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation: this.isEnemy ? -2.2 : 1,
        })
        renderedSprites.push(fireball)
        audio.initFireball.play()

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            renderedSprites.pop()

            gsap.to(healthBar, {
              width: recipient.health + '%',
            })

            audio.fireballHit.play()

            gsap.to(recipient.position, {
              x: recipient.position.x + 20 / 2,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            })
          },
        })
      }
    }
  }

  faint() {
    const dialogueBox = document.querySelector('.dialogue-box') as HTMLElement
    dialogueBox.style.display = 'block'
    dialogueBox.textContent = `${this.name} fainted!`
    gsap.to(this.position, {
      y: this.position.y + 20,
    })
    gsap.to(this, {
      opacity: 0,
    })
  }
}
