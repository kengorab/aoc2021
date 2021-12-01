const fs = require('fs')
const moment = require('moment')

const day = moment().format('DD')

const dir = `./day-${day}`
fs.mkdirSync(dir)

const template = `
const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
const demoInput = \`

\`

function processInput(input) {
  return input.trim().split('\\n').map(l => {
    // Process input
  })
}

function part1() {
  // Good luck!
}
console.log(part1())
`.trim()

fs.writeFileSync(`${dir}/index.js`, template)
fs.writeFileSync(`${dir}/input.txt`, '')
