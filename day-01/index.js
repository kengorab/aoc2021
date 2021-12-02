const fs = require('fs')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
199
200
208
210
200
207
240
269
260
263
`

function processInput(input) {
  return input.trim().split('\n').map(l => {
    return parseInt(l, 10)
  })
}

function part1() {
  const measurements = processInput(realInput)
  let count = 0
  for (let i = 1; i < measurements.length; i++) {
    if (measurements[i] > measurements[i - 1])
      count++
  }
  return count
}

console.log(part1()) // 1266

function part2() {
  const measurements = processInput(realInput)
  let count = 0
  for (let i = 3; i < measurements.length; i++) {
    if (measurements[i] > measurements[i - 3])
      count++
  }
  return count
}

console.log(part2()) // 1217
