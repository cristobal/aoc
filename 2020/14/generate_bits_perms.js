function bitPermutations (size, startSymbol = '') {
  if (size === 0) {
    return [
      startSymbol + '1',
      startSymbol + '0'
    ]
  }

  return [
    bitPermutations(size - 1, startSymbol + '1'),
    bitPermutations(size - 1, startSymbol + '0')
  ].flat()
}

console.log(bitPermutations(1))
console.log(bitPermutations(2))
console.log(bitPermutations(3))
/*
          R
          -
        (1 0)
  (1 0)        (1 0)
(1 0) (1 0) (1 0) (1 0)
*/