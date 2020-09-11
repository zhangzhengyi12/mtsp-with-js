const random = (min, max) => {
  return Math.floor(Math.random() * max - min + 1) + min
}

// 不用矩阵，直接用 HASPMAP 空间换时间 节点不可能特别多 更容易 debug
const getDisMap = (data) => {
  let map = {}
  for (let loc of data) {
    let innerMap = {
      ...loc
    }
    map[loc['酒店名称']] = innerMap
  }

  return map
}

export default {
  random,
  getDisMap
}



