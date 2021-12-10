#!/usr/bin/env NODE_ENV=production node
const pattern = /^(?<ingredients>(\w+ )+)[(]contains(?<allergens>( \w+|,)+)[)]/
const list = require('fs').readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .filter(line => line)
  .map(line => {
    const result = pattern.exec(line.trim())
    const toSet =
      (list, separator) => new Set(list.split(separator).map(v => v.trim()).filter(v => v))

    return {
      ingredients: toSet(result.groups.ingredients, ' '),
      allergens: toSet(result.groups.allergens, ',')
    }
  })


// count frequency
const frequencyCount = new Map()
const incFrequencyCount =
  (key) => frequencyCount.set(key, (frequencyCount.get(key) ?? 0) + 1)

// map allergens to ingredients
const allergenIngredientMap = new Map()
const allergenIngredientMapAppend =
  (allergen, ingredient) => {
    allergenIngredientMap.get(allergen) ?? allergenIngredientMap.set(allergen, new Set())
    allergenIngredientMap.get(allergen).add(ingredient)
  }

const allergens = new Set()
const ingredients = new Set()
list.forEach(item => {
  item.allergens.forEach(allergen => {
    incFrequencyCount(allergen)
    allergens.add(allergen)
  })

  item.ingredients.forEach(ingredient => {
    incFrequencyCount(ingredient)
    ingredients.add(ingredient)
    item.allergens.forEach(allergen => allergenIngredientMapAppend(allergen, ingredient))
  })
})


const sortByFrequencyDesc =
  set => Array.from(set).sort((a, b) => frequencyCount.get(b) - frequencyCount.get(a))

const allergensSorted =
  sortByFrequencyDesc(allergens)

const ingredientsSorted =
  sortByFrequencyDesc(ingredients)

const allergenIngredients = ingredientsSorted.slice(0, allergensSorted.length)
const inertIngredients = ingredientsSorted.slice(allergensSorted.length)
const sumInertIngredientsFrequency = inertIngredients.reduce((acc, ingredient) => acc + frequencyCount.get(ingredient), 0)
console.log(`Part one - ${sumInertIngredientsFrequency}`)

const map = allergensSorted.reduce(
  (map, allergen, index) => map.set(allergen, allergenIngredients[index]), new Map()
)

const ingredientsResult = allergensSorted.sort()
  .map(allergen => map.get(allergen)).join(',')

for (const ingredient of allergenIngredients) {
  for (const allergen of allergensSorted)   {
    console.log(allergen, ingredient, allergenIngredientMap.get(allergen).has(ingredient))
  }

  console.log()
}

// console.log(`Part two - ${ingredientsResult}`)
