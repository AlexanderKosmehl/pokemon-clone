import { Sprite } from '../drawables/Sprite'
import { Attack } from '../interfaces/Attack'
import { Monster } from '../drawables/Monster'
import { ENEMY_X, PLAYER_X } from '../Settings'
import { audio } from './audio'
import { sprites } from './sprites'
import fireballURI from '../img/fireball.png'
import gsap from 'gsap'

export const attacks: Record<string, Attack> = {
  Tackle: {
    name: 'Tackle',
    damage: 10,
    type: 'Normal',
    animation: (user: Monster, target: Monster, targetHealthBar: string) => {
      const movementDistance = user.isEnemy ? -20 : 20

      const tl = gsap
        .timeline()
        .to(user.sprite.position, {
          x: user.sprite.position.x - movementDistance,
        })
        .to(user.sprite.position, {
          x: user.sprite.position.x + movementDistance * 2,
          duration: 0.1,
          onComplete: () => {
            // Update Health bar
            gsap.to(targetHealthBar, {
              width: target.health + '%',
            })

            audio.tackleHit.play()

            // Shake target
            gsap.to(target.sprite.position, {
              x: target.sprite.position.x + movementDistance / 2,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            })
          },
        })
        .to(user.sprite.position, {
          // Ensure correct position after attack
          x: user.isEnemy ? ENEMY_X : PLAYER_X,
        })
      return tl
    },
  },
  Fireball: {
    name: 'Fireball',
    damage: 25,
    type: 'Fire',
    animation: (
      user: Monster,
      target: Monster,
      targetHealthBar: string,
      effectSprites: Sprite[]
    ) => {
      const fireball = new Sprite({
        position: { ...user.sprite.position },
        imageSrc: fireballURI,
        animate: true,
        frames: {
          max: 4,
          hold: 10,
        },
        rotation: user.isEnemy ? -2.2 : 1,
      })

      effectSprites.push(fireball)
      audio.initFireball.play()

      return gsap.timeline().to(fireball.position, {
        x: target.sprite.position.x,
        y: target.sprite.position.y,
        onComplete: () => {
          effectSprites.pop()

          gsap.to(targetHealthBar, {
            width: target.health + '%',
          })

          audio.fireballHit.play()

          gsap.to(target.sprite.position, {
            x: target.sprite.position.x + 20 / 2,
            yoyo: true,
            repeat: 5,
            duration: 0.08,
          })
        },
      })
    },
  },
}
