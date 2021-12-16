const fs = require('fs')
const _ = require('lodash')

const realInput = fs.readFileSync('./input.txt', { encoding: 'utf-8' })

function hex2Bin(hex) {
  const key = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    'A': '1010',
    'B': '1011',
    'C': '1100',
    'D': '1101',
    'E': '1110',
    'F': '1111'
  }
  return hex.split('').reduce((acc, n) => acc + key[n], '')
}

function decode(bits, start = 0) {
  const version = parseInt(bits.slice(start, start + 3), 2)
  const typeId = parseInt(bits.slice(start + 3, start + 6), 2)

  if (typeId === 4) { // literal value encoding
    let idx = start + 6
    let lit = ''
    while (bits[idx] === '1') {
      lit += bits.slice(idx + 1, idx + 5)
      idx += 5
    }
    lit += bits.slice(idx + 1, idx + 5)
    idx += 5

    const literal = parseInt(lit, 2)
    return { idx, version, typeId, literal }
  }

  const children = []
  const lengthTypeId = bits[start + 6]
  let idx = start + 7
  if (lengthTypeId === '1') {
    const length = parseInt(bits.slice(idx, idx + 11), 2)
    idx += 11
    for (let i = 0; i < length; i++) {
      const m = decode(bits, idx)
      children.push(m)
      idx = m.idx
    }
  } else {
    const length = parseInt(bits.slice(idx, idx + 15), 2)
    idx += 15
    const stop = idx + length

    while (idx < stop) {
      const m = decode(bits, idx)
      children.push(m)
      idx = m.idx
    }
  }

  return { idx, version, typeId, children }
}

function part1() {
  const bits = hex2Bin(realInput)
  const message = decode(bits)

  function sumVersions(message) {
    if (!message.children || message.children.length === 0) return message.version
    return message.version + message.children.reduce((acc, n) => acc + sumVersions(n), 0)
  }

  return sumVersions(message)
}
console.log(part1()) // 895

function part2() {
  const bits = hex2Bin(realInput)
  const ast = decode(bits)

  function evaluate(ast) {
    if (ast.typeId === 4) return ast.literal

    const children = ast.children.map(evaluate)

    switch (ast.typeId) {
      case 0: return children.reduce((acc, n) => acc + n, 0)
      case 1: return children.reduce((acc, n) => acc * n, 1)
      case 2: return Math.min.apply(null, children)
      case 3: return Math.max.apply(null, children)
      case 4: // unreachable
      case 5: return children[0] > children[1] ? 1 : 0
      case 6: return children[0] < children[1] ? 1 : 0
      case 7: return children[0] === children[1] ? 1 : 0
    }
  }

  return evaluate(ast)
}
console.log(part2()) // 1148595959144
