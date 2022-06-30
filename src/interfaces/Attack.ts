import { Sprite } from '../drawables/Sprite'
import { Monster } from '../drawables/Monster'

export interface Attack {
  name: string
  damage: number
  animation: (
    user: Monster,
    target: Monster,
    targetHealthBar: string,
    effectSprites: Sprite[]
  ) => any
  type: string
}
