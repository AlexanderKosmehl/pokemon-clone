import { Sprite } from '../drawables/Sprite'
import { Attack } from './Attack'

export interface MonsterData {
  name: string
  health: number
  speed: number
  sprite: Sprite
  attacks: Attack[]
}