import _ from 'loadsh'
import utils from '../../utils'
import Router from './router'
import config from '../../config'

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

  // 初始化随机人口
  initPopulation() {
    for (let i = 0; i < config.popCount; i++) {
      this.population[i] = Router.getRandomPopulation()
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
      let d = this.population[i].getTotalDistance()
      if (d < this.recordDistance) {
        this.recordDistance = d;
        this.bestEver = this.population[i];
        console.log(d)
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
    let rdPopIndexs = _.shuffle(this.population.map((v, i) => i))
    for (let i = 0; i < this.population.length; i += 10) {
      // 随机抽取10个元素 找到其中最好的
      const best = this.findBest(this.population, rdPopIndexs.slice(i, i + 10), this.fitness)
      // 复制10个副本
      const bestPops = new Array(10).fill(1).map(() => best.getCopy())

      // 对10个副本分别进行各种变异操作
      for (let i = 0; i < 10; i++) {
        bestPops[i].mutate()
      }
      newPopulation = newPopulation.concat(bestPops)
    }
    this.population = newPopulation
  }

  findBest(pop, indexs, fitness) {
    let bestIndex = indexs[0]
    for (let index of indexs) {
      if (fitness[index] < fitness[bestIndex]) {
        bestIndex = index
      }
    }
    return pop[bestIndex]
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
    return list[index]
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