import { Boundary } from './drawables/Boundary'
import { Position } from './interfaces/Position'
import {
  INITIAL_X_OFFSET,
  INITIAL_Y_OFFSET,
  MAP_COLS,
  MAP_ROWS,
  PLAYER_SPEED,
} from './Settings'

interface Collidable {
  position: Position
  width: number
  height: number
}

export function rectangularCollision(
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

export function getCollisionData(collisionMap: number[]): Boundary[] {
  const collisionArrays: number[][] = []
  const collisionDataArray: Boundary[] = []
  for (let y = 0; y < MAP_ROWS; y++) {
    collisionArrays.push(
      collisionMap.slice(y * MAP_COLS, y * MAP_COLS + MAP_COLS)
    )
  }
  collisionArrays.forEach((row, rowIndex) =>
    row.forEach((entry, colIndex) => {
      if (entry === 1025) {
        collisionDataArray.push(
          new Boundary({
            position: {
              x: colIndex * Boundary.size + INITIAL_X_OFFSET,
              y: rowIndex * Boundary.size + INITIAL_Y_OFFSET,
            },
          })
        )
      }
    })
  )

  return collisionDataArray
}
