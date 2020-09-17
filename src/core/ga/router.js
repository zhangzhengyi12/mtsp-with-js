import RM from '../../routerManager'
import utils from '../../utils'
import config from '../../config'
import _ from 'loadsh'

// 最终解决方案 人口的具象
class Router {
  constructor(
  ) {
    this.paths = [] // 当前的路径
    this.totalStore = [] // 当前的全部路径
    this.breaks = [] // 当前的路径区间分配
  }

  /**
   *
   * @description 生成一个 初始随机人口
   * @static
   * @param {*} locations
   * @memberof Population
   */
  static getRandomPopulation() {
    const instance = new Router()
    const locations = RM.getLocations()
    instance.totalStore = locations
    instance.breaks = instance.getRouterRange()
    instance.genPathsByBreakRanges()
    return instance
  }

  getCopy() {
    let instance = new Router()
    instance.paths = this.paths.map(v => v.slice())
    instance.breaks = this.breaks.slice()
    instance.totalStore = this.totalStore.slice()
    return instance
  }

  // 获取一个随机化但是具有一定限制的区间
  getRouterRange() {
    const upper = (RM.getLocations().length)
    const fa = upper / config.lineCount * 8
    const fb = upper / config.lineCount * 0.01

    let a = utils.randomRange(this.totalStore.length, config.lineCount)
    while (true) {
      if (a.every(i => i < fa && i > fb)) {
        break
      } else {
        a = utils.randomRange(this.totalStore.length, config.lineCount)
      }
    }
    return a
  }

  // 根据当前分隔区间和全部路由 重新分配到 paths 二维数组中
  genPathsByBreakRanges() {
    this.paths = new Array(this.breaks.length).fill(1).map(() => new Array())
    let k = 0
    for (let i = 0; i < this.breaks.length; i++) {
      let range = this.breaks[i]
      while (range--) {
        this.paths[i].push(this.totalStore[k++])
      }
    }
  }

  // 获取该路由的总长度
  getTotalDistance() {
    let sum = 0
    this.forEachAllEdges((a, b, routeIndex, isDone) => {
      sum += RM.getDisance(a, b)
    })
    return sum
  }

  forEachPaths(callback) {
    for (let i = 0; i < this.paths.length; i++) {
      callback(this.paths[i], i)
    }
  }

  forEachAllEdges(callback) {
    this.forEachPaths((path, index) => {
      let s = config.startNodeName
      for (let i = 0; i < path.length; i++) {
        let e = path[i]
        callback(s, e, index, i === path.length - 1)
        s = e
      }
    })
  }

  saveCurrentBreak() {
    this.breaks = this.paths.map(path => path.length)
  }

  mutate(i) {
    // // 第一种方式 选择随机区间然后随机插入
    // // 复用之间的 break 重新生成 paths
    if (i === 1) {
      this.totalStore = this.swapInsert(this.totalStore)
      this.genPathsByBreakRanges()
    }

    if (i === 2) {
      this.totalStore = this.flipInset(this.totalStore)
      this.genPathsByBreakRanges()
    }

    if (i === 3) {
      this.totalStore = this.leftSlideInsert(this.totalStore)
      this.genPathsByBreakRanges()
    }

    if (i === 4) {
      this.totalStore = this.rightSlideInsert(this.totalStore)
      this.genPathsByBreakRanges()
    }

    if (i === 5) {
      this.breaks = this.getRouterRange()
      this.genPathsByBreakRanges()
    }

    if (i === 6) {
      this.totalStore = this.flipInset(this.totalStore)
      this.breaks = this.getRouterRange()
      this.genPathsByBreakRanges()
    }

    if (i === 7) {
      this.totalStore = this.swapInsert(this.totalStore)
      this.breaks = this.getRouterRange()
      this.genPathsByBreakRanges()
    }

    if (i === 8) {
      this.totalStore = this.leftSlideInsert(this.totalStore)
      this.breaks = this.getRouterRange()
      this.genPathsByBreakRanges()
    }

    if (i === 9) {
      this.totalStore = this.rightSlideInsert(this.totalStore)
      this.breaks = this.getRouterRange()
      this.genPathsByBreakRanges()
    }
  }

  // 在 total router 选择一个随机区间 最后随机插入
  swapInsert(routers) {
    const [i, j] = utils.randomSample(0, routers.length, 2)
    const segment = routers.slice(i, j)
    routers.splice(i, j - i)
    const insertIndex = utils.random(0, routers.length - 1)
    routers.splice(insertIndex, 0, ...segment)
    return routers
  }

  // 在 total router 选择一个随机区间 然后反转 最后随机插入
  flipInset(routers) {
    const [i, j] = utils.randomSample(0, routers.length, 2)
    const segment = routers.slice(i, j).reverse()
    routers.splice(i, j - i)
    const insertIndex = utils.random(0, routers.length - 1)
    routers.splice(insertIndex, 0, ...segment)
    return routers
  }

  // 在 total router 选择一个随机区间 然后将最右边的元素放到最左边 最后随机插入
  leftSlideInsert(routers) {
    const [i, j] = utils.randomSample(0, routers.length, 2)
    const segment = routers.slice(i, j)
    routers.splice(i, j - i)
    segment.unshift(segment.pop())
    const insertIndex = utils.random(0, routers.length - 1)
    routers.splice(insertIndex, 0, ...segment)
    return routers
  }

  // 在 total router 选择一个随机区间 然后将最右边的元素放到最左边 最后随机插入
  rightSlideInsert(routers) {
    const [i, j] = utils.randomSample(0, routers.length, 2)
    const segment = routers.slice(i, j)
    routers.splice(i, j - i)
    segment.push(segment.shift())
    const insertIndex = utils.random(0, routers.length - 1)
    routers.splice(insertIndex, 0, ...segment)
    return routers
  }
}

export default Router