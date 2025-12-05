import fs from 'node:fs';

type Interval = {
  min: number;
  max: number;
}
const lines = fs.readFileSync('./input.txt', 'utf-8');

const rangePattern = /^(?<min>\d+)[-](?<max>\d+)$/gm;
const intervals = 
  (Array.from(lines.matchAll(rangePattern)) as unknown as { groups: { min: string, max: string }}[])
    .map((match) => ({
      min: Number(match.groups.min),
      max: Number(match.groups.max),
    })) as Interval[];

const ingredientPattern = /^(?<ingredient>\d+)$/gm;
const ingredients = 
  (Array.from(lines.matchAll(ingredientPattern)) as unknown as { groups: { ingredient: string }}[])
    .map((match) => Number(match.groups.ingredient));


// Solution 1
const solution1 =
    ingredients
      .filter(
        (ingredient) => intervals.some(range => ingredient >= range.min && ingredient <= range.max)
      )
      .length;

console.log(`Solution 1: ${solution1}`);

// Solution 2 - (need to merge intervals)
const sorted = intervals.toSorted((a, b) => a.min - b.min);
const merged = [sorted.shift()!];

for (const current of sorted)  {
  const last = merged[merged.length - 1];
  if (Math.max(last.min, current.min) <= Math.min(last.max, current.max)) {
  // if ((last.min <= current.max) && (current.min <= last.max)) {
    last.max = Math.max(last.max, current.max);
  } else {
    merged.push(current);
  }
}

const solution2 =
  merged
    .map((interval) => Math.abs(interval.min - interval.max) + 1)
    .reduce((acc, value) => acc + value, 0);

console.log(`Solution 2: ${solution2}`);
