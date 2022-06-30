import { Position } from '../interfaces/Position'

export interface SpriteProps {
  position: Position
  imageSrc: string
  frames?: { max: number; hold: number }
  scale?: number
  rotationSources?: {
    up: string
    down: string
    left: string
    right: string
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
    imageSrc,
    frames = { max: 1, hold: 10 },
    scale = 1,
    rotationSources,
    animate = false,
    rotation = 0,
  }: SpriteProps) {
    this.position = position
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.scale = scale

    if (rotationSources) {
      this.sprites = {
        up: new Image(),
        down: new Image(),
        left: new Image(),
        right: new Image(),
      }
      this.sprites.up.src = rotationSources.up
      this.sprites.down.src = rotationSources.down
      this.sprites.left.src = rotationSources.left
      this.sprites.right.src = rotationSources.right
    }

    this.animate = animate
    this.rotation = rotation

    this.image = new Image()
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.image.src = imageSrc
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
