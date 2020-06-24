const log = console.log.bind(console)

const getRandomInt = function (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const getRandomArbitrary = function (min, max) {
  return Math.random() * (max - min) + min;
}

const getPointsLen = function(p1, p2) {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
  )
}

let width = window.innerWidth
let height = window.innerHeight

const canvas = document.getElementsByTagName('canvas')[0]
const ctx = canvas.getContext('2d')

const pr = window.devicePixelRatio || 1

const setup = function() {
  width = window.innerWidth
  height = window.innerHeight

  canvas.width = width * pr
  canvas.height = height * pr
  ctx.scale(pr, pr)

  ctx.fillStyle = 'rgba(175, 175, 175, .375)'
  ctx.strokeStyle = 'rgba(204, 204, 204, 0.3)'
}

class Circle {
  constructor() {
    this.init()
  }

  init() {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.r = getRandomArbitrary(3.157, 8.765)
    
    const s = getRandomArbitrary(0.075, 0.75)
    this.mx = this.dir(s)
    this.my = this.dir(s)
  }

  json() {
    return { x: this.x, y: this.y }
  }

  dir(value) {
    const t = Math.random() > 0.5
    return t ? value : -value
  }

  move() {
    const { x, y, r} = this

    if (x < r || x > width - r * 2) {
      this.mx *= -1
    }
    this.x += this.mx

    if (y < r || y > height - r) {
      this.my *= -1
    }
    this.y += this.my
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
    ctx.fill()
  }
}

const drawLine = function(c1, c2) {
  ctx.beginPath()
  ctx.moveTo(c1.x, c1.y)
  ctx.lineTo(c2.x, c2.y)
  ctx.closePath()
  ctx.stroke()
}

const currentCircle = new Circle()
currentCircle.x = -10
currentCircle.y = -10
currentCircle.r = 8
currentCircle.draw = function() {
  ctx.save()
  ctx.fillStyle = 'blue'
  ctx.beginPath()
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
  ctx.fill()
  ctx.restore()
}

const circles = []
const NUM_OF_CIRCLE = 80
for (let i = 0; i < NUM_OF_CIRCLE; i++) {
  const c = new Circle()
  circles.push(c)
}

const LENGTH = 150
const draw = function() {
  ctx.clearRect(0, 0, width, height)
  
  let i = 0, j = i + 1, c1 = null, c2 = null
  for (i = 0; i < NUM_OF_CIRCLE; i++) {
    c1 = circles[i]
    c1.move()
    c1.draw()

    for (j = i + 1; j < NUM_OF_CIRCLE; j++) {
      c2 = circles[j]
      if (getPointsLen(c1.json(), c2.json()) < LENGTH) {
        drawLine(c1, c2)
      }
    }
  }

  if (currentCircle.x > 0) {
    currentCircle.draw()
    for (const c of circles) {
      if (getPointsLen(currentCircle.json(), c.json()) < LENGTH) {
        drawLine(currentCircle, c)
      }
    }
  }

  requestAnimationFrame(draw)
}

const mouseMove = function(evt) {
  const { offsetX: x, offsetY: y } = evt
  
  currentCircle.x = x
  currentCircle.y = y
}

const mouseOut = function() {
  currentCircle.x = -10
  currentCircle.y = -10
}

canvas.addEventListener('mousemove', mouseMove)
canvas.addEventListener('mouseout', mouseOut)

const __main = function() {
  setup()

  draw()
}

__main()