const fs = require('fs')
const { isNumber } = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })
function processInput(input) {
  return input.trim().split('\n').map(l => {
    return l.split(' ')
  })
}

// I used this to generate the `alu.txt` file. From there it was a bunch of manual reduction
// to come up with the constant values necessary to generate each Z_i value
function translate(instrs) {
  const M = { w: '0', x: '0', y: '0', z: '0' }
  const H = { w: [], x: [], y: [], z: [] }

  let i = 0
  for (const [op, ...args] of instrs) {
    if (op === 'inp') {
      if (i > 0) {
        H.w.push(M.w)
        H.x.push(M.x)
        M.x = `x_${i - 1}`
        H.y.push(M.y)
        M.y = `y_${i - 1}`
        H.z.push(M.z)
        M.z = `z_${i - 1}`
      }
      M[args[0]] = `input[${i++}]`
      continue
    }

    const [a, b] = args
    const A = M[a].match(/^-?\d+$/) ? parseInt(M[a]) : M[a]
    const B = b.match(/^-?\d+$/) ? parseInt(b) : (M[b].match(/^-?\d+$/) ? parseInt(M[b]) : M[b])
    const isLit = isNumber(A) && isNumber(B)

    switch (op) {
      case 'add':
        M[a] = isLit ? `${A + B}` : `${A} + ${B}`
        break
      case 'mul': {
        M[a] = isLit ? `${A * B}` : `(${A}) * (${B})`
        break
      }
      case 'div': {
        M[a] = isLit ? `${Math.trunc(A / B)}` : `Math.trunc(${A} / ${B})`
        break
      }
      case 'mod': {
        M[a] = isLit ? `${A % B}` : `(${A} % ${B})`
        break
      }
      case 'eql': {
        M[a] = isLit ? `(${A === B ? 1 : 0})` : `(${A} === ${B} ? 1 : 0)`
        break
      }
    }
  }
  return [H, M]
}

// Copied output to `alu.txt` and manually reduced there to get the constants
// console.log(translate(processInput(realInput)))
// Obtained via manual reduction
const constants = [
  [1, 10, 15],
  [1, 12, 8],
  [1, 15, 2],
  [26, -9, 6],
  [1, 15, 13],
  [1, 10, 4],
  [1, 14, 1],
  [26, -5, 9],
  [1, 14, 5],
  [26, -7, 13],
  [26, -12, 9],
  [26, -10, 6],
  [26, -1, 2],
  [26, -11, 2]
]

// Each Z_i is computed based on this function
function fn([c0, c1, c2], z, w) {
  if (z % 26 + c1 === w) {
    return Math.trunc(z / c0)
  }
  return Math.trunc(z / c0) * 26 + w + c2
}

let zs = { 0: [0, 0] }
for (const c of constants) {
  const newZs = {}
  for (const [z_, inp] of Object.entries(zs)) {
    const z = parseInt(z_)
    for (let w = 1; w <= 9; w++) {
      const newz = fn(c, z, w)

      // When we're in the iterations where we divide by 26, we expect the
      // value to start decreasing. If it doesn't then it won't ever be 0, so it'll
      // be invalid and we can bail early
      if (c[0] === 26 && newz >= z) continue

      // Track the lowest and highest inputs that produce each Z_i
      if (!newZs[newz]) {
        newZs[newz] = [inp[0] * 10 + w, inp[1] * 10 + w]
      } else {
        newZs[newz][0] = Math.min(newZs[newz][0], inp[0] * 10 + w)
        newZs[newz][1] = Math.max(newZs[newz][1], inp[1] * 10 + w)
      }
    }
  }
  zs = newZs
}

const valids = zs[0].sort()
console.log('part 1:', valids[1]) // 52926995971999
console.log('part 2:', valids[0]) // 11811951311485,
