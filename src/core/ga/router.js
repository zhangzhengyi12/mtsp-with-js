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

  saveCurrentBreak() {
    this.breaks = this.paths.map(path => path.length)
  }



  mutate(i) {
    // // 第一种方式 选择随机区间然后随机插入
    // // 复用之间的 break 重新生成 paths
    if (true) {
      this.totalStore = this.swapInsert(this.totalStore)
      this.genPathsByBreakRanges()
    }

    // if (i === 2) {

    // }

    // if (i === 3) {

    // }
  }

  swapInsert(routers) {
    const [i, j] = utils.randomSample(0, routers.length, 2)
    const segment = routers.slice(i, j)
    routers.splice(i, j - i)
    const insertIndex = utils.random(0, routers.length - 1)
    routers.splice(insertIndex, 0, ...segment)
    return routers
  }

  // swapMutate() {
  //   let rRange1Index = 0
  //   let rRange2Index = 0
  //   while (rRange1Index === rRange2Index) {
  //     rRange1Index = utils.random(1, this.paths.length - 1)
  //     rRange2Index = utils.random(1, this.paths.length - 1)
  //   }

  //   let rRange1Start = 0
  //   let rRange1End = 0
  //   while (rRange1Start === rRange1End) {
  //     rRange1Start = utils.random(1, this.paths[rRange1Index].length - 1)
  //     rRange1End = utils.random(1, this.paths[rRange1Index].length - 1)
  //   }
  //   if (rRange1Start > rRange1End) {
  //     [rRange1Start, rRange1End] = [rRange1End, rRange1Start]
  //   }

  //   let rRange2Start = 0
  //   let rRange2End = 0
  //   while (rRange2Start === rRange2End) {
  //     rRange2Start = utils.random(1, this.paths[rRange2Index].length - 1)
  //     rRange2End = utils.random(1, this.paths[rRange2Index].length - 1)
  //   }
  //   if (rRange2Start > rRange2End) {
  //     [rRange2Start, rRange2End] = [rRange2End, rRange2Start]
  //   }

  //   let range1List = this.paths[rRange1Index].slice(rRange1Start, rRange1End)
  //   let range2List = this.paths[rRange2Index].slice(rRange2Start, rRange2End)

  //   this.paths[rRange1Index].splice(rRange1Start, rRange1End - rRange1Start, ...range2List)
  //   this.paths[rRange2Index].splice(rRange2Start, rRange2End - rRange2Start, ...range1List)
  // }

  // innerMutate() {
  //   for (let path of this.paths) {
  //     let random1Index = utils.random(0, path.length - 1)
  //     let random2Index = utils.random(0, path.length - 1)
  //     while (random1Index === random2Index) {
  //       random1Index = utils.random(0, path.length - 1)
  //       random2Index = utils.random(0, path.length - 1)
  //     }

  //     let temp = path[random1Index]
  //     path[random1Index] = path[random2Index]
  //     path[random2Index] = temp
  //   }
  // }

  // // 在全部路由里面随机找一个区间 然后反转并插入到一个随机位置
  // swapInsert() {
  //   let randomPathIndex = utils.random(0, this.paths.length - 1)
  //   this.paths[randomPathIndex] = this.paths[randomPathIndex].reverse()
  // }
}

export default Router