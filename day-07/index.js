const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
16,1,2,0,4,2,7,1,2,14
`

function processInput(input) {
  return input.trim().split(',').map(_.parseInt)
}

function part1() {
  const crabs = processInput(realInput)
  const [min, max] = [Math.min.apply(null, crabs), Math.max.apply(null, crabs)]

  function fuel(target, crabs) {
    let sum = 0
    for (const c of crabs) {
      sum += Math.abs(c - target)
    }
    return sum
  }

  let minFuel = Infinity
  for (let i = min; i < max; i++) {
    const f = fuel(i, crabs)
    if (f < minFuel) {
      minFuel = f
    }
  }

  return minFuel
}
console.log(part1()) // 341558

function part2() {
  const crabs = processInput(realInput)
  const [min, max] = [Math.min.apply(null, crabs), Math.max.apply(null, crabs)]

  function fuel(target, crabs) {
    let sum = 0
    for (const c of crabs) {
      // summation
      const n = Math.abs(c - target)
      sum += n * (n + 1) / 2
    }
    return sum
  }

  let minFuel = Infinity
  for (let i = min; i < max; i++) {
    const f = fuel(i, crabs)
    if (f < minFuel) {
      minFuel = f
    }
  }

  return minFuel
}
console.log(part2()) // 93214037
