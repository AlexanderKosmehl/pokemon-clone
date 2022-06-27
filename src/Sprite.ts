import { Position } from './Position'

export class Sprite {
  position: Position
  image: HTMLImageElement
  frames: { max: number }
  scale: number
  context: CanvasRenderingContext2D
  height: number = 0
  width: number = 0

  constructor({
    position,
    image,
    frames = { max: 1 },
    scale = 1,
    context,
  }: any) {
    this.position = position
    this.image = image
    this.frames = frames
    this.scale = scale
    this.context = context

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
  }

  draw() {
    this.context.drawImage(
      this.image,
      0,
      0,
      this.width,
      this.height,
      this.position.x,
      this.position.y,
      this.width * this.scale,
      this.height * this.scale
    )
  }
}
