const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
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

// 随机区间生成
const randomRange = (n, count) => {
  let range = []
  while (true) {
    let newSp = random(1, n)
    if (range.includes(newSp)) {
      continue
    }
    range.push(newSp)
    if (range.length >= count - 1) break
  }

  range.push(n)

  return range.sort((a, b) => a - b).map((v, i) => {
    let rangeStart = range[i - 1] ? range[i - 1] : 0
    let rangeEnd = v
    return rangeEnd - rangeStart
  })
}

export default {
  random,
  getDisMap,
  randomRange
}



