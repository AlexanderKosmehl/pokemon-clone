import { Position } from '../interfaces/Position'

export interface SpriteProps {
  position: Position
  image: { src: string }
  frames?: { max: number; hold: number }
  scale?: number
  sprites?: {
    up: HTMLImageElement
    down: HTMLImageElement
    left: HTMLImageElement
    right: HTMLImageElement
  }
  animate?: boolean
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
  rotation: number

  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    scale = 1,
    sprites,
    animate = false,
    rotation = 0,
  }: SpriteProps) {
    this.position = position
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.scale = scale
    this.sprites = sprites
    this.animate = animate
    this.rotation = rotation

    this.image = new Image()
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.image.src = image.src
  }

  draw(context: CanvasRenderingContext2D) {
    context.save()
    context.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    )
    context.rotate(this.rotation)
    context.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    )
    context.globalAlpha = this.opacity
    context.drawImage(
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
    context.restore()

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
}
