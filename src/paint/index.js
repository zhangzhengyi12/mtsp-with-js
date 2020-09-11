export default class Paint {
  static getInstance() {
    return new Paint(Paint.width, Paint.height, Paint.ctx)
  }

  static config(width, height, ctx) {
    this.width = width
    this.height = height
    this.ctx = ctx
  }

  static setupAxiosTransform(data) {
    let xMin = Infinity
    let xMax = -Infinity
    let yMin = Infinity
    let yMax = -Infinity

    for (let loc of data) {
      if (loc.x < xMin) xMin = loc.x
      if (loc.x > xMax) xMax = loc.x
      if (loc.y < yMin) yMin = loc.y
      if (loc.y > yMax) yMax = loc.y
    }

    this.xMin = xMin
    this.xRange = xMax - xMin
    this.yMin = yMin
    this.yRange = yMax - yMin
  }

  static transX(x) {
    return ((x - this.xMin) / this.xRange) * 800 + 20
  }

  static transY(y) {
    return (1 - (((y - this.yMin) / this.yRange))) * 800 + 20
  }

  constructor(width, height, ctx) {
    this.width = width
    this.height = height
    this.ctx = ctx
    window.ctx = ctx
  }

  draw(order, disMap, color) {
    for (let i = 0; i < order.length; i++) {
      const loc = order[i]
      if (loc === '迪士尼') {
        this.ctx.fillStyle = "red"
      } else {
        this.ctx.fillStyle = color
      }
      this.ctx.beginPath()
      const x = Paint.transX(disMap[loc].x)
      const y = Paint.transY(disMap[loc].y)
      this.ctx.arc(x, y, 3, 0, Math.PI * 2, true)
      this.ctx.fill()

      // 绘制到下一个节点的线
      if (order[i + 1]) {
        this.ctx.strokeStyle = color
        const nextNodeX = Paint.transX(disMap[order[i + 1]].x)
        const nextNodeY = Paint.transY(disMap[order[i + 1]].y)

        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(nextNodeX, nextNodeY)
        this.ctx.stroke();
      }
    }
  }

  drawTotal(record) {
    this.ctx.fillStyle = 'black'
    ctx.font = "24px serif";
    let text = `总路径长度: ${record}米`
    this.ctx.fillText(text, 900, 40)
  }
}