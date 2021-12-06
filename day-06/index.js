const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = `
3,4,3,1,2
`

function processInput(input) {
  return input.trim().split(',').map(_.parseInt)
}

function simulate(numDays) {
  const input = processInput(realInput)
  const fish = _.countBy(input)

  for (let d = 0; d < numDays; d++) {
    const n0 = fish[0] || 0
    for (let f = 1; f <= 8; f++) {
      fish[f - 1] = fish[f] || 0
    }
    fish[8] = n0
    fish[6] = (fish[6] || 0) + n0
  }

  return _.sum(Object.values(fish))
}

// Part 1
console.log(simulate(80)) // 345793

// Part 2
console.log(simulate(256)) // 1572643095893
