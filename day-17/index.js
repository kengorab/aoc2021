const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
target area: x=20..30, y=-10..-5
`

function processInput(input) {
  const [, area] = input.trim().split(': ')
  const [xs, ys] = area.split(', y=')
  const X = xs.replace('x=', '').split('..').map(_.parseInt)
  const Y = ys.split('..').map(_.parseInt)
  return [X, Y]
}

function step(x, y, vx, vy) {
  const x_ = x + vx
  const y_ = y + vy
  const vx_ = vx + (vx === 0 ? 0 : vx > 0 ? -1 : 1)
  const vy_ = vy - 1
  return [x_, y_, vx_, vy_]
}

function within(x, y, [[x1, x2], [y1, y2]]) {
  return x1 <= x && x <= x2 && y1 <= y && y <= y2
}

function beyond(x, y, [[, x2], [y1]]) {
  return x > x2 || y < y1
}

function height(vx_, vy_, rect) {
  let [x, y] = [0, 0]
  let [vx, vy] = [vx_, vy_]

  let maxY = -Infinity

  while (true) {
    const res = step(x, y, vx, vy)
    x = res[0]
    y = res[1]
    vx = res[2]
    vy = res[3]

    if (y > maxY) maxY = y

    if (within(x, y, rect)) return maxY
    if (beyond(x, y, rect)) return null
  }
}

function part1() {
  const rect = processInput(realInput)
  const x2 = rect[0][1]
  const y1 = rect[1][0]

  let maxHeight = -Infinity
  for (let y = -Math.abs(y1); y < Math.abs(y1); y++) {
    for (let x = 0; x < x2 * x2; x++) {
      const h = height(x, y, rect)
      if (h > maxHeight) maxHeight = h
    }
  }
  return maxHeight
}
console.log(part1()) // 25200

function part2() {
  const rect = processInput(realInput)

  let count = 0
  for (let y = -500; y <= 500; y++) {
    for (let x = 0; x <= 500; x++) {
      const h = height(x, y, rect)
      if (h !== null) {
        count += 1
      }
    }
  }

  return count
}
console.log(part2()) // 3012