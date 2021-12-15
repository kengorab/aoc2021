const fs = require('fs')
const _ = require('lodash')
const Graph = require('node-dijkstra')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
`

function processInput(input) {
  const lines = input.trim().split('\n')

  const H = lines.length
  const W = lines[0].length
  const M = Object.fromEntries(
    lines.flatMap((r, y) =>
      r.split('').map((v, x) => [`${x},${y}`, parseInt(v)])
    )
  )

  return [H, W, M]
}

const neighbors = ([x, y]) => [[x, y - 1], [x - 1, y], [x + 1, y], [x, y + 1]]

function findCost(map, start, end) {
  const M = new Graph()
  for (const node of Object.keys(map)) {
    const p = node.split(',').map(_.parseInt)
    const N = Object.fromEntries(
      neighbors(p)
        .map(([x, y]) => `${x},${y}`)
        .map(p => [p, map[p]])
        .filter(([, v]) => !!v)
    )
    M.addNode(node, N)
  }

  const { cost } = M.path(start, end, { cost: true })
  return cost
}

function part1() {
  const [H, W, map] = processInput(realInput)

  return findCost(map, '0,0', `${W-1},${H-1}`)
}
console.log(part1()) // 790

function part2() {
  const [H, W, map] = processInput(realInput)

  const newMap = {}
  for (let dx = 0; dx < 5; dx++) {
    for (let dy = 0; dy < 5; dy++) {

      const incr = dx + dy
      for (const [k, v] of Object.entries(map)) {
        const [x, y] = k.split(',').map(_.parseInt)
        const p = [`${x + W * dx},${y + H * dy}`]
        newMap[p] = v + incr >= 10 ? v + incr - 9 : v + incr
      }
    }
  }

  const end = `${(W * 5) - 1},${(H * 5) - 1}`
  return findCost(newMap, '0,0', end)
}
console.log(part2()) // 2998
