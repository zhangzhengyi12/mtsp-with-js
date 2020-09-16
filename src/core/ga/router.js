import RM from '../../routerManager'
import utils from '../../utils'
import config from '../../config'
import _ from 'loadsh'

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
    instance.totalStore = _.shuffle(RM.getLocations())
    instance.reRandomRangeForTotalStore()
    return instance
  }

  getCopy() {
    let instance = new Router()
    instance.paths = this.paths.map((v) => v.slice())
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

  // 重新生成区间 按照原有排序 
  reBreak() {
    this.totalStore = this.paths.reduce((pre, cur) => pre.concat(cur), [])
    this.reRandomRangeForTotalStore()
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

  // 返回交叉后的后代
  // crossOver(b) {
  //   let newRouter = new Router()
  //   let a = this

  //   let aStore = [].concat(...a.paths)
  //   let bStore = [].concat(...b.paths)

  //   let aRangeStart = 0
  //   let aRangeEnd = 0

  //   while (aRangeStart === aRangeEnd) {
  //     aRangeStart = utils.random(0, RM.getLocations().length)
  //     aRangeEnd = utils.random(0, RM.getLocations().length)
  //   }

  //   if (aRangeStart > aRangeEnd) {
  //     [aRangeStart, aRangeEnd] = [aRangeEnd, aRangeStart]
  //   }

  //   newRouter.totalStore = aStore.slice(aRangeStart, aRangeEnd)

  //   for (let bLocation of bStore) {
  //     if (!newRouter.totalStore.includes(bLocation)) {
  //       newRouter.totalStore.push(bLocation)
  //     }
  //   }

  //   newRouter.reRandomRangeForTotalStore()

  //   return newRouter
  // }

  mutate() {
    if (Math.random() < 0.1) {
      this.swapMutate()
    } else {
      if (Math.random() < 0.4) {
        this.innerMutate()
      } else {
        this.innerReverse()
      }
    }
    this.reBreak()
  }

  swapMutate() {
    let rRange1Index = 0
    let rRange2Index = 0
    while (rRange1Index === rRange2Index) {
      rRange1Index = utils.random(1, this.paths.length - 1)
      rRange2Index = utils.random(1, this.paths.length - 1)
    }

    let rRange1Start = 0
    let rRange1End = 0
    while (rRange1Start === rRange1End) {
      rRange1Start = utils.random(1, this.paths[rRange1Index].length - 1)
      rRange1End = utils.random(1, this.paths[rRange1Index].length - 1)
    }
    if (rRange1Start > rRange1End) {
      [rRange1Start, rRange1End] = [rRange1End, rRange1Start]
    }

    let rRange2Start = 0
    let rRange2End = 0
    while (rRange2Start === rRange2End) {
      rRange2Start = utils.random(1, this.paths[rRange2Index].length - 1)
      rRange2End = utils.random(1, this.paths[rRange2Index].length - 1)
    }
    if (rRange2Start > rRange2End) {
      [rRange2Start, rRange2End] = [rRange2End, rRange2Start]
    }

    let range1List = this.paths[rRange1Index].slice(rRange1Start, rRange1End)
    let range2List = this.paths[rRange2Index].slice(rRange2Start, rRange2End)

    this.paths[rRange1Index].splice(rRange1Start, rRange1End - rRange1Start, ...range2List)
    this.paths[rRange2Index].splice(rRange2Start, rRange2End - rRange2Start, ...range1List)
  }

  innerMutate() {
    for (let path of this.paths) {
      let random1Index = utils.random(0, path.length - 1)
      let random2Index = utils.random(0, path.length - 1)
      while (random1Index === random2Index) {
        random1Index = utils.random(0, path.length - 1)
        random2Index = utils.random(0, path.length - 1)
      }

      let temp = path[random1Index]
      path[random1Index] = path[random2Index]
      path[random2Index] = temp
    }
  }

  innerReverse() {
    let randomPathIndex = utils.random(0, this.paths.length - 1)
    this.paths[randomPathIndex] = this.paths[randomPathIndex].reverse()
  }
}

export default Router