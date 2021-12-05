const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`

function processInput(input) {
  return input.trim().split('\n').map(l => {
    const [start, end] = l.split(' -> ')
    return [start.split(',').map(_.parseInt), end.split(',').map(_.parseInt)]
  })
}
const lines = processInput(realInput)

function linePoints([[x1, y1], [x2, y2]]) {
  const points = []

  if (x1 === x2) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      points.push(`${x1},${y}`)
    }
  } else if (y1 === y2) {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      points.push(`${x},${y1}`)
    }
  } else {
    const xinc = x1 < x2 ? 1 : -1
    const yinc = y1 < y2 ? 1 : -1
    let x = x1, y = y1
    while (x !== x2 && y !== y2) {
      points.push(`${x},${y}`)
      x += xinc
      y += yinc
    }
    points.push(`${x},${y}`)
  }
  return points
}

function part1() {
  const vertHorizLines = lines.filter(([[x1, y1], [x2, y2]]) => x1 === x2 || y1 === y2)
  const plane = {}

  for (const line of vertHorizLines) {
    const points = linePoints(line)
    for (const p of points) {
      plane[p] = (plane[p] || 0) + 1
    }
  }
  return Object.values(plane).filter(v => v >= 2).length
}
console.log(part1()) // 7297

function part2() {
  const plane = {}

  for (const line of lines) {
    const points = linePoints(line)
    for (const p of points) {
      plane[p] = (plane[p] || 0) + 1
    }
  }
  return Object.values(plane).filter(v => v >= 2).length
}
console.log(part2()) // 21038
