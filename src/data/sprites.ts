import { Sprite } from '../drawables/Sprite'

import mapImageURI from '../img/pokemonCloneMap.png'
import foregroundLayerURI from '../img/pokemonCloneMapForeground.png'
import playerDownURI from '../img/playerDown.png'
import playerUpURI from '../img/playerUp.png'
import playerLeftURI from '../img/playerLeft.png'
import playerRightURI from '../img/playerRight.png'
import battleBackgroundURI from '../img/battleBackground.png'
import embyURI from '../img/embySprite.png'
import draggleURI from '../img/draggleSprite.png'

import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  INITIAL_X_OFFSET,
  INITIAL_Y_OFFSET,
  MAP_SCALING,
} from '../Settings'

export const sprites = {
  background: new Sprite({
    position: { x: INITIAL_X_OFFSET, y: INITIAL_Y_OFFSET },
    imageSrc: mapImageURI,
    scale: MAP_SCALING,
  }),
  foreground: new Sprite({
    position: { x: INITIAL_X_OFFSET, y: INITIAL_Y_OFFSET },
    imageSrc: foregroundLayerURI,
    scale: MAP_SCALING,
  }),
  player: new Sprite({
    position: {
      x: CANVAS_WIDTH / 2 - 192 / 4 / 2,
      y: CANVAS_HEIGHT / 2 - 68 / 2,
    },
    imageSrc: playerDownURI,
    frames: { max: 4, hold: 10 },
    rotationSources: {
      up: playerUpURI,
      down: playerDownURI,
      left: playerLeftURI,
      right: playerRightURI,
    },
  }),
  battleBackground: new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: battleBackgroundURI,
  }),
  emby: new Sprite({
    imageSrc: embyURI,
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    position: {
      x: 0,
      y: 0,
    },
  }),
  draggle: new Sprite({
    imageSrc: draggleURI,
    frames: {
      max: 4,
      hold: 30,
    },
    animate: true,
    position: {
      x: 0,
      y: 0,
    },
  }),
}
