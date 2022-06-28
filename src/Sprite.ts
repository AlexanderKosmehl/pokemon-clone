import { Position } from './Position'
import gsap from 'gsap'
import fireballURI from './img/fireball.png'

interface Props {
  position: Position
  image: HTMLImageElement
  frames?: { max: number; hold: number }
  scale?: number
  context: CanvasRenderingContext2D
  sprites?: {
    up: HTMLImageElement
    down: HTMLImageElement
    left: HTMLImageElement
    right: HTMLImageElement
  }
  animate?: boolean
  isEnemy?: boolean
  rotation?: number
}

export class Sprite {
  position: Position
  image: HTMLImageElement
  frames: {
    max: number
    val: number
    elapsed: number
    hold: number
  }
  scale: number
  context: CanvasRenderingContext2D
  height: number = 0
  width: number = 0
  animate: boolean
  sprites?: {
    up: HTMLImageElement
    down: HTMLImageElement
    left: HTMLImageElement
    right: HTMLImageElement
  }
  opacity: number = 1
  health: number = 100
  isEnemy?: boolean
  rotation: number

  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    scale = 1,
    context,
    sprites,
    animate = false,
    isEnemy = false,
    rotation = 0,
  }: Props) {
    this.position = position
    this.image = image
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.scale = scale
    this.context = context
    this.sprites = sprites
    this.animate = animate
    this.isEnemy = isEnemy
    this.rotation = rotation

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
  }

  draw() {
    this.context.save()
    this.context.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    )
    this.context.rotate(this.rotation)
    this.context.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    )
    this.context.globalAlpha = this.opacity
    this.context.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      this.width * this.scale,
      this.height * this.scale
    )
    this.context.restore()

    if (!this.animate) {
      this.frames.elapsed = 0
      this.frames.val = 0
      return
    }

    this.frames.elapsed = (this.frames.elapsed + 1) % this.frames.hold

    this.frames.val =
      this.frames.elapsed === 0
        ? (this.frames.val + 1) % this.frames.max
        : this.frames.val
  }

  attack(attack: any, recipient: Sprite, renderedSprites: Sprite[]) {
    const healthBar = this.isEnemy
      ? '.enemy-health-bar-current'
      : '.player-health-bar-current'

    switch (attack.name) {
      case 'Tackle': {
        const movementDistance = this.isEnemy ? 20 : -20

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

              gsap.to('.enemy-health-bar-current', {
                width: this.health + '%',
              })

              gsap.to(recipient.position, {
                x: recipient.position.x + movementDistance / 2,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              })

              gsap.to(recipient, {
                opacity: 0,
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

            gsap.to('.enemy-health-bar-current', {
              width: this.health + '%',
            })

            gsap.to(recipient.position, {
              x: recipient.position.x + 20 / 2,
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
      }
    }
  }
}
