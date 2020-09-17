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

console.log(randomSample(0, 40, 2))