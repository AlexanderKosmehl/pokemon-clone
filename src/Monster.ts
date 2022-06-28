import { Sprite, SpriteProps } from './Sprite'
import gsap from 'gsap'
import fireballURI from './img/fireball.png'

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
    context,
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
      context,
      sprites,
      animate,
      rotation,
    })
    this.name = name
    this.isEnemy = isEnemy
  }

  attack(attack: any, recipient: Sprite, renderedSprites: Sprite[]) {
    const dialogueBox = document.querySelector('.dialogue-box') as HTMLElement
    dialogueBox.style.display = 'block'
    dialogueBox.textContent = `${this.name} used ${attack.name}!`

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
              this.health =
                attack.damage > this.health ? 0 : this.health - attack.damage

              gsap.to(healthBar, {
                width: this.health + '%',
              })

              gsap.to(recipient.position, {
                x: recipient.position.x + movementDistance / 2,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              })

              if (this.health === 0) {
                gsap.to(recipient, {
                  opacity: 0,
                })
              }
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
          context: this.context,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation: this.isEnemy ? -2.2 : 1,
        })
        renderedSprites.push(fireball)

        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            renderedSprites.pop()

            this.health =
              attack.damage > this.health ? 0 : this.health - attack.damage

            gsap.to(healthBar, {
              width: this.health + '%',
            })

            gsap.to(recipient.position, {
              x: recipient.position.x + 20 / 2,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            })

            console.log(this.health)
            if (this.health === 0) {
              gsap.to(recipient, {
                opacity: 0,
              })
            }
          },
        })
      }
    }
  }
}
