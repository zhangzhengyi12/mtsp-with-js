import Paint from './paint'
import coreRun from './core'


function setup() {
  setupPaint()
  coreRun()
}

function setupPaint() {
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  const width = 600
  const height = 600
  canvas.width = width
  canvas.height = height
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  Paint.config(width - 30, height - 30, ctx)
}


setup()