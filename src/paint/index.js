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
    return ((x - this.xMin) / this.xRange) * Paint.width + 20
  }

  static transY(y) {
    return (1 - (((y - this.yMin) / this.yRange))) * Paint.height + 20
  }

  constructor(width, height, ctx) {
    this.width = width
    this.height = height
    this.ctx = ctx
    window.ctx = ctx
  }

  draw(order, disMap, colorMap) {
    this.ctx.clearRect(0, 0, 1000, 1000)
    order.forEachAllEdge((s, e, index) => {
      if (s === '迪士尼') {
        this.ctx.fillStyle = "red"
      } else {
        this.ctx.fillStyle = colorMap[index]
      }

      this.ctx.beginPath()
      const x = Paint.transX(disMap[s].x)
      const y = Paint.transY(disMap[s].y)
      this.ctx.arc(x, y, 3, 0, Math.PI * 2, true)
      this.ctx.fill()

      // 绘制到下一个节点的线
      this.ctx.strokeStyle = colorMap[index]
      const nextNodeX = Paint.transX(disMap[e].x)
      const nextNodeY = Paint.transY(disMap[e].y)

      this.ctx.beginPath()
      this.ctx.moveTo(x, y)
      this.ctx.lineTo(nextNodeX, nextNodeY)
      this.ctx.stroke();
    })
  }

  drawTotal(record) {
    this.ctx.fillStyle = 'black'
    ctx.font = "24px serif";
    let text = `总路径长度: ${record}米`
    this.ctx.fillText(text, 900, 40)
  }
}