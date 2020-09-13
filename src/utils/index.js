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

const randomRange = (start, end, count) => {
  let range = []
  while (true) {
    let newSp = random(start + 1, end - 1)
    if (range.includes(newSp)) {
      continue
    }
    range.push(newSp)
    if (range.length >= count - 1) break
  }
  return range.sort((a, b) => a - b)
}

const rangeMerge = (a, b) => {
  let res = []
  let merge = [...a, ...b].sort((a, b) => a - b)
  for (let i = 0; i < a.length; i++) {
    res.push(merge[i * 2])
  }
  return res
}


export default {
  random,
  getDisMap,
  randomRange,
  rangeMerge
}



