import { Position } from './Position'
import { PLAYER_SPEED } from './Settings'

interface Collidable {
  position: Position
  width: number
  height: number
}

function rectangularCollision(
  rectangle1: Collidable,
  rectangle2: Collidable
): boolean {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
  )
}

export function predictCollision(
  direction: 'up' | 'down' | 'left' | 'right',
  rectangle1: Collidable,
  rectangle2: Collidable
): boolean {
  switch (direction) {
    case 'up': {
      return rectangularCollision(
        {
          ...rectangle1,
          position: {
            x: rectangle1.position.x,
            y: rectangle1.position.y - PLAYER_SPEED,
          },
        },
        rectangle2
      )
    }
    case 'down': {
      return rectangularCollision(
        {
          ...rectangle1,
          position: {
            x: rectangle1.position.x,
            y: rectangle1.position.y + PLAYER_SPEED,
          },
        },
        rectangle2
      )
    }
    case 'left': {
      return rectangularCollision(
        {
          ...rectangle1,
          position: {
            x: rectangle1.position.x - PLAYER_SPEED,
            y: rectangle1.position.y,
          },
        },
        rectangle2
      )
    }
    case 'right': {
      return rectangularCollision(
        {
          ...rectangle1,
          position: {
            x: rectangle1.position.x + PLAYER_SPEED,
            y: rectangle1.position.y,
          },
        },
        rectangle2
      )
    }
  }
}
