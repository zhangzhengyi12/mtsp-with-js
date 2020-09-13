import _ from 'loadsh'
import utils from '../../utils'

class OrderPopulation {
  constructor(
    lineOrder,
    groupRange,
    start
  ) {
    this.lineOrder = lineOrder
    this.groupRange = groupRange
    this.start = start
  }

  // 遍历内部所有区间 参数为闭区间
  forEachRanges(callback) {
    for (let i = 0; i <= this.groupRange.length; i++) {
      let s = this.groupRange[i - 1] ? this.groupRange[i - 1] + 1 : 0
      let e = this.groupRange[i] ? this.groupRange[i] : this.lineOrder.length - 1
      callback(s, e, i)
    }
  }

  forEachAllEdge(callback) {
    this.forEachRanges((rangeStart, rangeEnd, index) => {
      // 每一个区间的起始节点都是开始节点
      let pairStart = -1
      for (let i = rangeStart; i <= rangeEnd; i++) { // 遍历区间内的所有节点
        callback(pairStart === -1 ? this.start : this.lineOrder[pairStart], this.lineOrder[i], index)
        pairStart = i
      }
    })
  }

  copy() {
    return new OrderPopulation(this.lineOrder.slice(), this.groupRange.slice(), this.start)
  }
}

class GA {
  constructor(locations, lineCount, start, disMap) {
    this.population = []
    this.fitness = []
    this.disMap = disMap
    this.recordDistance = Infinity
    this.bestEver = []
    this.start = start
    this.locations = locations
    this.lineCount = lineCount

    this.initPopulation()
  }

  // 初始化物种数组 用于遗传演化
  initPopulation() {
    for (let i = 0; i < 500; i++) {
      const shuffleOrder = _.shuffle(this.locations.slice())
      const shuffleRange = utils.randomRange(0, this.locations.length - 1, this.lineCount)
      this.population[i] = new OrderPopulation(shuffleOrder, shuffleRange, this.start)
    }
  }

  // run 开始算法核心
  run() {
    this.reCalcFitness()
    this.fuck()
  }

  // 计算每个生物的健壮程度 值越高代表越健康越优秀
  reCalcFitness() {
    // 先计算每个生物的健壮程度 用距离反比
    for (let i = 0; i < this.population.length; i++) {
      let d = this.getDis(this.population[i])
      if (d < this.recordDistance) {
        this.recordDistance = d;
        this.bestEver = this.population[i];
        console.log(this.recordDistance)
      }
      this.fitness[i] = 1 / (Math.pow(d, 8) + 1);
    }

    // 然后进行归一化 保证健壮程度在[0,1]之间
    let sum = 0;
    for (let i = 0; i < this.fitness.length; i++) {
      sum += this.fitness[i];
    }
    for (let i = 0; i < this.fitness.length; i++) {
      this.fitness[i] = this.fitness[i] / sum;
    }
  }

  // 交配一下 产下优质后代
  fuck() {
    let newPopulation = []
    for (let i = 0; i < this.population.length; i++) {
      let orderA = this.pickOne(this.population, this.fitness);
      let orderB = this.pickOne(this.population, this.fitness);
      const newLineOrder = this.crossOver(orderA.lineOrder, orderB.lineOrder)
      let newOrder = new OrderPopulation(newLineOrder, utils.rangeMerge(orderA.groupRange, orderB.groupRange), orderA.start)
      this.mutate(newOrder.lineOrder, 0.01)
      newPopulation[i] = newOrder
    }
    this.population = newPopulation
  }

  // 按照fitness的健康程度 更大概率选择相对优质的基因
  // 比如某个基因的健康程度为0.6那么大概就有60……的几率选中该基因
  pickOne(list, prob) {
    let index = 0;
    let r = Math.random(1)

    while (r > 0 && index <= list.length) {
      r = r - prob[index];
      index++;
    }
    index--;
    return list[index].copy()
  }

  // 狠狠交配一下，取两个排序的特征 先从 a 里面随机取几个 剩下的都通过 b 填充
  crossOver(orderA, orderB) {
    let start = Math.floor(utils.random(0, orderA.length));
    let end = Math.floor(utils.random(start + 1, orderA.length));
    let neworder = orderA.slice(start, end);
    for (let i = 0; i < orderB.length; i++) {
      let city = orderB[i];
      if (!neworder.includes(city)) {
        neworder.push(city);
      }
    }
    return neworder;
  }

  // 基因突变
  mutate(order, mutationRate) {
    for (let i = 0; i < order.length; i++) {
      if (Math.random(1) < mutationRate) {
        let indexA = utils.random(0, order.length - 1)
        let indexB = (indexA + 1) % this.locations.length;
        this.swap(order, indexA, indexB);
      }
    }
  }

  // 计算该路径的最终长度
  getDis(order) {
    let sum = 0
    order.forEachAllEdge((s, e) => {
      sum += this.disMap[s][e]
    })
    return sum
  }

  swap(a, i, j) {
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }

  print() {
    let res = `${this.start}=>`
    this.forEach(this.bestEver, this.start, (a, b) => {
      res += `${b}=>`
    })
    console.log(`${res} 最终距离: ${this.recordDistance} \n`)
  }

  getPath() {
    let res = [this.start]
    this.forEach(this.bestEver, this.start, (a, b) => {
      res.push(b)
    })
    return res
  }
}

export default GA