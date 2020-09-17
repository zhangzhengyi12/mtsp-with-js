const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 随机采样 生成 k 个唯一值 可能包涵 min 和 max 并建立排序
const randomSample = (min, max, k) => {
  let res = []
  for (let i = 0; i < k; i++) {
    let rd
    while (!rd || res.includes(rd)) {
      rd = random(min, max)
    }
    res.push(rd)
  }
  res.sort((a, b) => a - b)
  return res
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
  randomRange,
  randomSample
}



