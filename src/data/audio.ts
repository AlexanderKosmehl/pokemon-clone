import { Howl } from 'howler'
import mapThemeURI from '../audio/map.wav'
import initBattleThemeURI from '../audio/initBattle.wav'
import battleThemeURI from '../audio/battle.mp3'
import tackleHitURI from '../audio/tackleHit.wav'
import initFireballURI from '../audio/initFireball.wav'
import fireballHitURI from '../audio/fireballHit.wav'
import victoryThemeURI from '../audio/victory.wav'

export const audio = {
  map: new Howl({
    src: mapThemeURI,
    html5: true,
    volume: 0.1,
  }),
  initBattle: new Howl({
    src: initBattleThemeURI,
    html5: true,
    volume: 0.1,
  }),
  battle: new Howl({
    src: battleThemeURI,
    html5: true,
    volume: 0.1,
  }),
  victory: new Howl({
    src: victoryThemeURI,
    html5: true,
    volume: 0.1,
  }),
  tackleHit: new Howl({
    src: tackleHitURI,
    html5: true,
    volume: 0.1,
  }),
  initFireball: new Howl({
    src: initFireballURI,
    html5: true,
    volume: 0.1,
  }),
  fireballHit: new Howl({
    src: fireballHitURI,
    html5: true,
    volume: 0.1,
  }),
}
