import { attacks } from './attacks'
import draggleURI from './img/draggleSprite.png'
import embyURI from './img/embySprite.png'

const draggleImage = new Image()
draggleImage.src = draggleURI

const embyImage = new Image()
embyImage.src = embyURI

export const monsters = {
  Emby: {
    name: 'Emby',
    sprite: {
      image: {
        src: embyURI,
      },
      frames: {
        max: 4,
        hold: 30,
      },
      animate: true,
    },
    attacks: [attacks.Tackle, attacks.Fireball],
  },
  Draggle: {
    name: 'Draggle',
    sprite: {
      image: {
        src: draggleURI,
      },
      frames: {
        max: 4,
        hold: 30,
      },
      animate: true,
    },
    attacks: [attacks.Tackle],
  },
}
