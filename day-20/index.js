const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###
`

function processInput(input) {
  const [algo, img] = input.trim().split('\n\n')

  const I = Object.fromEntries(
    img.split('\n').flatMap((row, y) => {
      return row.split('').map((v, x) => [`${x},${y}`, v])
    })
  )
  return [algo, I]
}

function print(img) {
  const points = Object.keys(img).map(k => k.split(',').map(_.parseInt))
  const xs = _.sortBy(points.map(([x]) => x))
  const ys = _.sortBy(points.map(([, y]) => y))
  const [minx, maxx, miny, maxy] = [xs[0] - 1, _.last(xs) + 2, ys[0] - 1, _.last(ys) + 1]

  for (let y = miny; y <= maxy; y++) {
    const line = _.range(minx, maxx + 1)
      .map(x => img[`${x},${y}`])
      .join('')
    console.log(line)
  }
  console.log()
}

function neighbors(x, y) {
  return [
    [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
    [x - 1, y], [x, y], [x + 1, y],
    [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
  ]
}

function process(algo, img, def) {
  const newImg = {}
  const points = Object.keys(img).map(p => p.split(',').map(_.parseInt))

  const xs = _.sortBy(points.map(([x]) => x))
  const ys = _.sortBy(points.map(([, y]) => y))
  const [minx, maxx, miny, maxy] = [xs[0] - 3, _.last(xs) + 3, ys[0] - 3, _.last(ys) + 3]

  for (const x of _.range(minx, maxx + 1)) {
    for (const y of _.range(miny, maxy + 1)) {
      const s = neighbors(x, y)
        .map(([x_, y_]) => (img[`${x_},${y_}`] || def) === '#' ? '1' : '0')
        .join('')
      const idx = parseInt(s, 2)
      newImg[`${x},${y}`] = algo[idx]
    }
  }
  return newImg
}

function part1() {
  const [algo, img] = processInput(realInput)

  let newImg = process(algo, img, '.')
  newImg = process(algo, newImg, '#')

  return _.countBy(Object.values(newImg))['#']
}
console.log(part1()) // 5268

function part2() {
  const [algo, img] = processInput(realInput)

  let newImg = img
  for (let i = 0; i < 50; i++) {
    newImg = process(algo, newImg, i % 2 === 0 ? '.' : '#')
  }
  return _.countBy(Object.values(newImg))['#']
}
console.log(part2()) // 16875
