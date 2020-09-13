import data from '../data/data.json'
import GA from './ga'
import utils from '../utils'
import Paint from '../paint'

const startLocationKey = "迪士尼"
const lineCount = 4
const disMap = utils.getDisMap(data) // 距离哈希表 disMap[origin][target]


const colorMap = [
  "#FD0",
  '#6C0',
  'blue',
  'saddlebrown'
]

export default function coreRun() {
  let ga = new GA(data.map(v => v.酒店名称).filter(v => v !== '迪士尼'), lineCount, startLocationKey, disMap)
  Paint.setupAxiosTransform(data)
  let paint = Paint.getInstance()

  const tick = () => {
    ga.run()
    paint.draw(ga.bestEver, disMap, colorMap)
    requestAnimationFrame(tick)
  }
  tick()
}