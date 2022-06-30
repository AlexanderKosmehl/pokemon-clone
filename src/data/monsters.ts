import { MonsterData } from '../interfaces/MonsterData'
import { attacks } from './attacks'
import { sprites } from './sprites'

export const monsterData: Record<string, MonsterData> = {
  Emby: {
    name: 'Emby',
    health: 100,
    speed: 100,
    sprite: sprites.emby,
    attacks: [attacks.Tackle, attacks.Fireball],
  },
  Draggle: {
    name: 'Draggle',
    health: 80,
    speed: 80,
    sprite: sprites.draggle,
    attacks: [attacks.Tackle, attacks.Fireball],
  },
}
