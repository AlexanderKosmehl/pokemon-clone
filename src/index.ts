import './style.css'
import map from './img/pokemonCloneMap.png'

const canvas = document.querySelector('canvas')!

canvas.width = 1280
canvas.height = 720

const ctx = canvas.getContext('2d')!
ctx.imageSmoothingEnabled = false

const image = new Image()
image.src = map

image.onload = () => {
  ctx.drawImage(image, -250, -130, 4 * image.width, 4 * image.height)
}
