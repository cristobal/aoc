import fs from 'node:fs';

const ranges = fs.readFileSync('./input.txt', 'utf-8')
  .split(',')
  .map(
    range => range.split('-') as [string, string]
  )
  .map(
    ([min, max]) => [Number(min), Number(max)] as [number, number]
  );

const invalid_part_one: number[] = [];
for (const [min, max] of ranges) {
  for (let candidate = min; candidate <= max; candidate++) {
    const value = String(candidate);
    const size = value.length;
    if (size % 2 === 1) {
      continue;
    }
    
    if (value.slice(0, size / 2) === value.slice(size / 2)) {
      invalid_part_one.push(candidate);
    }
  }
}
console.log(invalid_part_one.reduce((acc, value) => acc + value, 0));

const invalid_part_two: number[] = [];
for (const [min, max] of ranges) {
  for (let candidate = min; candidate <= max; candidate++) {
    const value = String(candidate);
    const size = value.length;

    for (let i = 1; i <= size / 2; i++) {
      const times = (size / i) | 0;
      const pattern = new RegExp(`^(${value.slice(0, i)}){${times}}$`);
      if (pattern.test(value)) {
        invalid_part_two.push(candidate);
        break;
      }
    }
  }
}
console.log(invalid_part_two.reduce((acc, value) => acc + value, 0));