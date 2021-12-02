const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
forward 5
down 5
forward 8
up 3
down 8
forward 2
`

function processInput(input) {
  return input.trim().split('\n').map(l => {
    const [dir, amt] = l.split(' ')
    return [dir, parseInt(amt)]
  })
}

function part1() {
  let x = 0, z = 0
  const moves = processInput(realInput)
  for (const [dir, amt] of moves) {
    switch (dir) {
      case 'forward': {
        x += amt
        break
      }
      case 'up': {
        z -= amt
        break
      }
      case 'down': {
        z += amt
        break
      }
    }
  }
  return x * z
}
console.log(part1()) // 1648020

function part2() {
  let x = 0, z = 0, aim = 0
  const moves = processInput(realInput)

  for (const [dir, amt] of moves) {
    switch (dir) {
      case 'forward': {
        x += amt
        z += aim * amt
        break
      }
      case 'up': {
        aim -= amt
        break
      }
      case 'down': {
        aim += amt
        break
      }
    }
  }
  return x * z
}
console.log(part2()) // 1759818555
