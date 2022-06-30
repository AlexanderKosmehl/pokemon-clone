import { Sprite } from './Sprite'
import { Attack } from '../interfaces/Attack'
import { MonsterData } from '../interfaces/MonsterData'
import { ENEMY_X, ENEMY_Y, PLAYER_X, PLAYER_Y } from '../Settings'

export class Monster {
  name: string
  health: number
  speed: number
  attacks: Attack[]
  sprite: Sprite
  isEnemy: boolean

  constructor(monsterData: MonsterData, isEnemy: boolean) {
    this.name = monsterData.name
    this.health = monsterData.health
    this.speed = monsterData.speed
    this.attacks = monsterData.attacks
    // Clone Sprite Object
    this.sprite = Object.assign(Object.create(monsterData.sprite), monsterData.sprite)
    this.isEnemy = isEnemy

    // Place monster sprite at battle location
    this.sprite.position.x = this.isEnemy ? ENEMY_X : PLAYER_X
    this.sprite.position.y = this.isEnemy ? ENEMY_Y : PLAYER_Y
  }
}
