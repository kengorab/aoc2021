const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
`

function processInput(input) {
  const [dots, folds] = input.trim().split('\n\n')

  const D = dots.split('\n').map(d => d.split(',').map(_.parseInt))
  const F = folds.split('\n').map(f => {
    const [dir, amt] = f.split('=')
    return [_.last(dir), _.parseInt(amt)]
  })

  return [D, F]
}

function print(dots) {
  const points = new Set(dots.map(([x, y]) => `${x},${y}`))
  const [W, H] = [Math.max.apply(null, dots.map(([x]) => x)), Math.max.apply(null, dots.map(([, y]) => y))]
  for (let y = 0; y <= H; y++) {
    const line = _.range(0, W + 1)
      .map(x => points.has(`${x},${y}`) ? '#' : '.')
      .join('')
    console.log(line)
  }
  console.log()
}

function fold(dots, [dir, loc]) {
  if (dir === 'y') {
    return dots.map(([x, y]) => y <= loc ? [x, y] : [x, loc - Math.abs(loc - y)])
  }
  return dots.map(([x, y]) => x <= loc ? [x, y] : [loc - Math.abs(loc - x), y])
}

function part1() {
  let [dots, folds] = processInput(realInput)
  return new Set(
    fold(dots, folds[0]).map(([x, y]) => `${x},${y}`)
  ).size
}

console.log(part1()) // 687

function part2() {
  let [dots, folds] = processInput(realInput)
  for (const f of folds) {
    dots = fold(dots, f)
  }
  print(dots)
}

part2() // FGKCKBZG
