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
  const width = document.documentElement.clientWidth - 5
  const height = document.documentElement.clientHeight - 5
  canvas.width = width
  canvas.height = height
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  Paint.config(innerWidth, innerHeight, ctx)
}


setup()