import { Sprite } from '../drawables/Sprite'

import mapImageURI from '../img/pokemonCloneMap.png'
import foregroundLayerURI from '../img/pokemonCloneMapForeground.png'
import playerDownURI from '../img/playerDown.png'
import playerUpURI from '../img/playerUp.png'
import playerLeftURI from '../img/playerLeft.png'
import playerRightURI from '../img/playerRight.png'
import battleBackgroundURI from '../img/battleBackground.png'

import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  INITIAL_X_OFFSET,
  INITIAL_Y_OFFSET,
  MAP_SCALING,
} from '../Settings'

const mapImage = new Image()
mapImage.src = mapImageURI

const foregroundImage = new Image()
foregroundImage.src = foregroundLayerURI

const playerUpImage = new Image()
playerUpImage.src = playerUpURI
const playerDownImage = new Image()
playerDownImage.src = playerDownURI
const playerLeftImage = new Image()
playerLeftImage.src = playerLeftURI
const playerRightImage = new Image()
playerRightImage.src = playerRightURI

const battleBackgroundImage = new Image()
battleBackgroundImage.src = battleBackgroundURI

export const sprites = {
  background: new Sprite({
    position: { x: INITIAL_X_OFFSET, y: INITIAL_Y_OFFSET },
    image: mapImage,
    scale: MAP_SCALING,
  }),
  foreground: new Sprite({
    position: { x: INITIAL_X_OFFSET, y: INITIAL_Y_OFFSET },
    image: foregroundImage,
    scale: MAP_SCALING,
  }),
  player: new Sprite({
    position: {
      x: CANVAS_WIDTH / 2 - 192 / 4 / 2,
      y: CANVAS_HEIGHT / 2 - 68 / 2,
    },
    image: playerDownImage,
    frames: { max: 4, hold: 10 },
    sprites: {
      up: playerUpImage,
      down: playerDownImage,
      left: playerLeftImage,
      right: playerRightImage,
    },
  }),
  battleBackground: new Sprite({
    position: { x: 0, y: 0 },
    image: battleBackgroundImage,
  }),
}
