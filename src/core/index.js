import KMeans from './k'
import data from '../data/data.json'
import GA from './ga'
import utils from '../utils'
import Paint from '../paint'

const startLocationKey = "迪士尼"
const lineCount = 4
const disMap = utils.getDisMap(data) // 距离哈希表 disMap[origin][target]

const KMeansTransform = (data) => {
  return data.map(v => {
    let arr = [
      v.x,
      v.y,
    ]
    arr._curpu = v.酒店名称
    return arr
  })
}

const colorMap = [
  "#FD0",
  '#6C0',
  'blue',
  'saddlebrown'
]

export default function coreRun() {
  // 先进行K 均值聚类 删除掉 起始节点
  const startNodeIndex = data.findIndex(v => v.酒店名称 === startLocationKey)
  const startNode = data[startNodeIndex]
  Paint.setupAxiosTransform(data)
  const paint = Paint.getInstance()
  data.splice(startNodeIndex, 1)

  const groups = KMeans(lineCount, KMeansTransform(data))

  let lines = new Array(groups.length).fill(1).map(() => new Array())
  let sumDis = 0
  for (let i = 0; i < groups.length; i++) {
    let group = groups[i]
    group.unshift(startNode.酒店名称)
    const ga = new GA(group, startLocationKey, disMap)

    for (let i = 0; i < 1000; i++) {
      ga.run()
    }
    console.log(`线路${i} 共{${group.length}站}:`)
    ga.print(startLocationKey)
    sumDis += ga.recordDistance

    paint.draw(ga.getPath(), disMap, colorMap[i])

    lines[i] = {
      paths: ga.getPath().reverse(),
      dis: ga.recordDistance
    }
  }

  localStorage.setItem('a', sumDis)
  localStorage.setItem('b', JSON.stringify(lines))

  paint.drawTotal(sumDis)
  $app.$children[0].setTableData(lines)
}