const lines = require('fs').readFileSync('./input.txt', 'utf-8').split('\n')

const createContainerColorPattern =
  (match) => new RegExp(`(?<color>\\w+\\s\\w+)\\sbag(|s)\\scontain(\\s\\d+\\s(\\w+\\s)+bag(s|)(,|)){0,}(\\s\\d+\\s${match}\\s+bag(s|)(,|))`)

function searchContainerColors (color) {
  const pattern = createContainerColorPattern(color)
  return lines.map(line => pattern.exec(line))
    .filter(result => result) // identity
    .map(result => result.groups.color)
}

function searchContainerColorsPathRec (color) {
  const containerColors = searchContainerColors(color)
  if (containerColors.length === 0) {
    return [ color ] 
  }

  return containerColors.map(
    containerColor => [color].concat(searchContainerColorsPathRec(containerColor)).flat()
  )
}

const results = searchContainerColorsPathRec('shiny gold')
const total  = new Set(results.flat()).size - 1
console.log({ total })
