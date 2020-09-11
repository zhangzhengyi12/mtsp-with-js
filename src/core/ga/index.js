import _ from 'loadsh'
import utils from '../../utils'

class GA {
  constructor(locations, start, disMap) {
    this.population = []
    this.fitness = []
    this.locations = locations
    this.locationCount = locations.length
    this.disMap = disMap
    this.recordDistance = Infinity
    this.bestEver = []
    this.start = start

    this.initPopulation()
  }

  // 初始化物种数组 用于遗传演化
  initPopulation() {
    for (let i = 0; i < this.locationCount; i++) {
      this.population[i] = _.shuffle(this.locations.slice())
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
      let order = this.crossOver(orderA, orderB);
      this.mutate(order, 0.05);
      newPopulation[i] = order;
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
    return list[index].slice();
  }

  // 狠狠交配一下，取两个排序的特征 先从 a 里面随机取几个 剩下的都通过 b 填充
  crossOver(orderA, orderB) {
    let start = Math.floor(utils.random(orderA.length));
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
    for (let i = 0; i < this.locationCount; i++) {
      if (Math.random(1) < mutationRate) {
        let indexA = utils.random(0, order.length - 1)
        let indexB = (indexA + 1) % this.locationCount;
        this.swap(order, indexA, indexB);
      }
    }
  }

  // 给定序列 a b 1 e f g
  // 回调 cb(1,e) cb(e,f) cb(g,a) cb(a,b)
  forEach(order, start, cb) {
    const len = order.length
    let startIndex = order.findIndex(v => v === start)
    let i = startIndex
    const get = i => i % len
    while (true) {
      cb(order[get(i)], order[get(i + 1)])
      i++
      if (get(i + 1) === startIndex) break
    }
  }

  // 计算一个路径的最终长度要从迪士尼开始
  getDis(order) {
    let sum = 0
    this.forEach(order, this.start, (s, e) => {
      sum += this.disMap[s][e]
    })

    if (sum === 0) debugger
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