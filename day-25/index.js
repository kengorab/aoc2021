const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>
`

function processInput(input) {
  const rows = input.trim().split('\n')
  const H = rows.length
  const W = rows[0].length

  const M = Object.fromEntries(
    rows.flatMap((l, y) => {
      return l.split('')
        .map((c, x) => [`${x},${y}`, c])
        .filter(([, c]) => c !== '.')
    })
  )
  return [W, H, M]
}

function toString(map, W, H) {
  return _.range(0, H).map(y =>
    _.range(0, W).map(x => map[`${x},${y}`] || '.').join('')
  ).join('\n')
}

function part1() {
  function step(map, W, H) {
    const newMap = {}
    const [east, south] = _.partition(Object.entries(map), ([, c]) => c === '>')
    for (const [p, c] of east) {
      const [x, y] = p.split(',').map(_.parseInt)
      const newPoint = [(x + 1) % W, y]
      if (!map[newPoint] && map[newPoint] !== '>') newMap[newPoint] = c
      else newMap[p] = c
    }
    for (const [p, c] of south) {
      const [x, y] = p.split(',').map(_.parseInt)
      const newPoint = [x, (y + 1) % H]
      if (!newMap[newPoint] && map[newPoint] !== 'v') newMap[newPoint] = c
      else newMap[p] = c
    }
    return newMap
  }

  const [W, H, M] = processInput(realInput)
  let map = M
  const seen = new Set([toString(map, W, H)])
  let count = 0
  while (true) {
    map = step(map, W, H)
    const str = toString(map, W, H)
    if (seen.has(str)) break

    seen.add(str)
    count += 1
  }
  return count + 1
}
console.log(part1())
