const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
2199943210
3987894921
9856789892
8767896789
9899965678
`

function processInput(input) {
  return input.trim().split('\n').map(l => {
    return l.split('').map(_.parseInt)
  })
}

function part1() {
  const map = processInput(realInput)
  const H = map.length
  const W = map[0].length

  let riskSum = 0
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const m = Math.min(...[
        map[y - 1]?.[x - 1], map[y - 1]?.[x], map[y - 1]?.[x + 1],
        map[y][x - 1], map[y][x + 1],
        map[y + 1]?.[x - 1], map[y + 1]?.[x], map[y + 1]?.[x + 1]
      ].filter(x => x === 0 || !!x))

      if (m > map[y][x]) riskSum += (map[y][x] + 1)
    }
  }

  return riskSum
}
console.log(part1()) // 514

function part2() {
  const map = Object.fromEntries(
    processInput(realInput).flatMap((row, y) => {
      return row.map((col, x) => {
        const point = `${x},${y}`
        return col === 9 ? [point, [1, false]] : [point, [0, false]]
      })
    })
  )

  function bfs(map, [x, y]) {
    const point = map[`${x},${y}`]
    if (!point || point[0] || point[1]) return 0

    // mark visited
    point[1] = true
    let basinSize = 1

    const neighbors = [[x, y - 1], [x - 1, y], [x + 1, y], [x, y + 1]]
    for (const n of neighbors) {
      basinSize += bfs(map, n)
    }

    return basinSize
  }

  const basins = []
  for (const point of Object.keys(map)) {
    const coords = point.split(',').map(_.parseInt)
    const b = bfs(map, coords)
    if (b !== 0) basins.push(b)
  }
  const [a, b, c] = _.sortBy(basins, x => -x)
  return a * b * c
}
console.log(part2()) // 1103130