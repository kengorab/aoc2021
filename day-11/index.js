const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`

function processInput(input) {
  return Object.fromEntries(input.trim().split('\n').flatMap((l, r) => {
    return l.split('').map((n, c) => [`${c},${r}`, _.parseInt(n)])
  }))
}

function step(map) {
  const newMap = {}
  const willFlash = []
  for (const [k, v] of Object.entries(map)) {
    newMap[k] = v + 1
    if (newMap[k] > 9) willFlash.push(k)
  }

  const flashed = new Set()
  while (willFlash.length) {
    const o = willFlash.shift()
    if (flashed.has(o)) continue
    flashed.add(o)

    newMap[o] = 0

    const [x, y] = o.split(',').map(_.parseInt)
    const neighbors = [
      [x-1, y-1], [x, y-1], [x+1, y-1],
      [x-1, y], [x+1, y],
      [x-1, y+1], [x, y+1], [x+1, y+1],
    ]
      .filter(([x, y]) => 0 <= x && x < 10 && 0 <= y && y < 10)
      .map(([x, y]) => `${x},${y}`)
      .filter(p => !flashed.has(p))
    neighbors.forEach(p => {
      newMap[p] += 1
      if (newMap[p] > 9) willFlash.push(p)
    })
  }
  return [flashed.size, newMap]
}

function part1() {
  let map = processInput(realInput)

  let total = 0
  for (let _ = 0; _ < 100; _++) {
    const [count, newMap] = step(map)
    total += count
    map = newMap
  }
  return total
}
console.log(part1()) // 1599

function part2() {
  let map = processInput(realInput)

  let n = 1
  while (true) {
    const [count, newMap] = step(map)
    if (count === 100) return n

    map = newMap
    n++
  }
}
console.log(part2()) // 418
