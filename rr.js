const random = (min, max) => {
  return Math.floor(Math.random() * ((max - min) + 1)) + min
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


function crossOver(orderA, orderB, ranges) {
  let res = []
  for (let i = 0; i <= ranges.length; i++) {
    let rangeStart = ranges[i - 1] ? ranges[i - 1] + 1 : 0
    let rangeEnd = ranges[i] ? ranges[i] : orderA.length - 1

    let start = random(rangeStart, rangeEnd)
    let end = random(start + 1, rangeEnd)
    res = res.concat(orderA.slice(start, end))
  }

  for (let i = 0; i < orderB.length; i++) {
    let city = orderB[i]
    if (!res.includes(city)) {
      res.push(city)
    }
  }

  return res
}


console.log(crossOver(['a', 'b', 'c', 'd'], ['c', 'b', 'a', 'd'], randomRange(0, 2, 2)))