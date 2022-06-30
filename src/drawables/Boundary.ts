import { Position } from '../interfaces/Position'

export class Boundary {
  static size: number = 48

  position: Position
  width: number
  height: number

  constructor({ position }: any) {
    this.position = position
    this.width = 48
    this.height = 48
  }

  draw(context: CanvasRenderingContext2D) {
    context.fillStyle = 'rgba(255, 0, 0, 0.2)'
    context.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }
}
