const lines = require('fs').readFileSync('./input.txt', 'utf-8').split('\n')

const createContainsColorPattern =
  (match) => new RegExp(`^(:?${match} bag(|s) contain)(?<match>( \\d+ (\\w+ )+bag(s|)(,|.|))+)$`)

const matchTotalAndColorPattern =
  /(?<total>\d+)\s(?<color>(\w+(\s\w+)+))\sbag/

function searchContainsColors (color) {
  const pattern = createContainsColorPattern(color)
  return lines.map(line => pattern.exec(line))
    .filter(result => result) // identity
    .map(result => result.groups.match)
    .map(
      result => (
        result.split(',').map(arg => matchTotalAndColorPattern.exec(arg).groups).map(({ color, total }) => ({ color, total: Number(total) }))
      )
    ).flat()
}

function searchContainsPathRec (color) {
  const containsColors = searchContainsColors(color)
  // return {
  //   color,
  //   contains: containsColors.map(({ color, total }) => (Object.assign({}, { total }, searchContainsPathRec(color))))
  // }

  return containsColors.reduce((acc, item) => acc + (item.total * searchContainsPathRec(item.color)))
}

const total = searchContainsPathRec('shiny gold') - 1
console.log({ total })


