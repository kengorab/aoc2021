const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`

function processInput(input) {
  const [numbers, ...rest] = input.trim().split('\n')
  const boards = []
  let board = []
  for (let i = 0; i < rest.length; i++) {
    if (!rest[i]) {
      if (board.length) {
        boards.push(board)
        board = []
      }
      continue
    }

    const nums = rest[i].split(/\s+/).filter(Boolean).map(n => parseInt(n, 10))
    board.push(nums)
  }
  boards.push(board)

  return { boards, numbers: numbers.split(',').map(n => parseInt(n))}
}

function bingo(board, numbers) {
  for (let i = 0; i < board.length; i++) {
    const row = board[i]
    if (row.every(n => numbers.includes(n))) return true;

    const col = board.map(row => row[i])
    if (col.every(n => numbers.includes(n))) return true;
  }
  return false;
}

function score(board, called) {
  let sum = 0;
  for (let i = 0; i < board.length; i++) {
    const row = board[i]
    for (let j = 0; j < row.length; j++) {
      if (!called.includes(row[j])) sum += row[j]
    }
  }
  return sum
}

function part1() {
  const { boards, numbers } = processInput(realInput)
  const called = []

  for (const n of numbers) {
    called.push(n)
    for (const b of boards) {
      if (bingo(b, called)) {
        return score(b, called) * n
      }
    }
  }
}
console.log(part1()) // 27027

function part2() {
  let { boards, numbers } = processInput(realInput)
  const called = []

  for (const n of numbers) {
    called.push(n)
    for (let i = 0; i < boards.length; i++) {
      if (bingo(boards[i], called)) {
        if (boards.length === 1) {
          return score(boards[i], called) * n
        }
        boards = boards.filter((_, idx) => idx !== i)
      }
    }
  }
}
console.log(part2()) // 36975
