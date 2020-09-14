import RM from '../../routerManager'
import utils from '../../utils'
import config from '../../config'

// 最终解决方案 人口的具象
class Router {
  constructor(
  ) {
    this.paths = []
    this.totalStore = []
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
    instance.totalStore = RM.getLocations()
    instance.reRandomRangeForTotalStore()
    return instance
  }

  // 获取一个 具有一定限制的区间
  getRouterRange() {
    const upper = (RM.getLocations().length)
    const fa = upper / config.lineCount * 1.6
    const fb = upper / config.lineCount * 0.6

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

  reRandomRangeForTotalStore() {
    this.paths = new Array(config.lineCount).fill(1).map(() => new Array())
    let randomRange = this.getRouterRange()
    let k = 0
    for (let i = 0; i < randomRange.length; i++) {
      let range = randomRange[i]
      while (range--) {
        this.paths[i].push(this.totalStore[k++])
      }
    }

    // 内存释放
    this.totalStore = []
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
      callback(path, i)
    }
  }

  forEachAllEdges(callback) {
    this.forEachPaths((path, index) => {
      let s = config.startNodeName
      for (let i = 0; i < path.length; i++) {
        let e = path[i]
        callback(s, e, index, i === path.length - 1)
      }
    })
  }
}

export default Router