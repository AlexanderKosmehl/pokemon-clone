import gsap from 'gsap'

export function animateBattleActivation(next: () => void) {
  gsap.to('.battle-overlay', {
    opacity: 1,
    repeat: 5,
    yoyo: true,
    duration: 0.1,
    onComplete: () => {
      gsap.to('.battle-overlay', {
        opacity: 0,
        duration: 0.1,
        onComplete: () => {
          next()
        },
      })
    },
  })
}
