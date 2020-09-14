const random = (min, max) => {
  return Math.floor(Math.random() * ((max - min) + 1)) + min
}



console.log(randomRange(41, 4))
console.log(randomRange(41, 4).reduce((pre, cur) => pre + cur, 0))