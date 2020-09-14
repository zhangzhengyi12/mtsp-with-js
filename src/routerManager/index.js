import data from '../data/data.json'
import utils from '../utils'
import config from '../config'

// 路径单例，路径数据源
class RouterManager {
  constructor() {
    this.disMap = utils.getDisMap(data)
  }

  // 获取从起点到终点的距离
  getDisance(start, end) {
    return Number(this.disMap[start][end])
  }

  // 获取地点数组 不包含起始节点
  getLocations() {
    return data.map(v => v.酒店名称).filter(v => v !== config.startNodeName)
  }
}

export default new RouterManager()