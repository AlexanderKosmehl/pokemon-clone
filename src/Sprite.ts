import { Position } from './Position'

export class Sprite {
  position: Position
  image: HTMLImageElement
  frames: {
    max: number
    val: number
    elapsed: number
  }
  scale: number
  context: CanvasRenderingContext2D
  height: number = 0
  width: number = 0
  moving: boolean = false
  sprites: {
    up: HTMLImageElement,
    down: HTMLImageElement,
    left: HTMLImageElement,
    right: HTMLImageElement
  }

  constructor({
    position,
    image,
    frames = { max: 1 },
    scale = 1,
    context,
    sprites
  }: any) {
    this.position = position
    this.image = image
    this.frames = { ...frames, val: 0, elapsed: 0 }
    this.scale = scale
    this.context = context
    this.sprites = sprites

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
  }

  draw() {
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

    if (!this.moving) {
      this.frames.elapsed = 0
      this.frames.val = 0
      return
    }

    this.frames.elapsed = (this.frames.elapsed + 1) % 10

    this.frames.val =
      this.frames.elapsed === 0
        ? (this.frames.val + 1) % this.frames.max
        : this.frames.val
  }
}
