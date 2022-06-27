import { Position } from './Position'

export class Boundary {
  static size: number = 48

  position: Position
  width: number
  height: number
  context: CanvasRenderingContext2D

  constructor({ position, context }: any) {
    this.position = position
    this.width = 48
    this.height = 48
    this.context = context
  }

  draw() {
    this.context.fillStyle = 'rgba(255, 0, 0, 0.2)'
    this.context.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }
}
