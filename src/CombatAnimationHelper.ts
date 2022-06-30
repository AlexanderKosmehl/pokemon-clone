import { Monster } from './drawables/Monster'
import gsap from 'gsap'

export async function faintAnimation(monster: Monster) {
  return Promise.all([
    gsap.to(monster.sprite.position, {
      y: monster.sprite.position.y + 20,
    }),
    gsap.to(monster.sprite, {
      opacity: 0,
    }),
  ])
}
