import re
from functools import reduce


class Test:
    def __init__(self, divisibleBy: int) -> None:
        self.divisibleBy = divisibleBy
        self.throwToIfTrue: int
        self.throwToIfFalse: int

    def __call__(self, value) -> int:
        if (value % self.divisibleBy) == 0:
            return self.throwToIfTrue

        return self.throwToIfFalse


class Monkey:
    def __init__(self, id: int) -> None:
        self.id = id
        self.items: list[int]
        self.op: str
        self.test: Test
        self.inspected: int = 0

    def __call__(self, old):
        return eval(self.op)


def read_monkeys(lines: list[str]) -> list[Monkey]:
    numberProg = re.compile(r"\d+")

    monkeys: list[Monkey] = []
    index = -1
    for line in lines:
        if line.startswith("Monkey"):
            monkeyId = int(numberProg.findall(line)[0])
            monkeys.append(Monkey(monkeyId))
            index = index + 1
        if "Starting items:" in line:
            monkeys[index].items = [
                int(arg) for arg in numberProg.findall(line.rstrip())
            ]
        if "Operation:" in line:
            monkeys[index].op = line.split("=")[1].strip()
        if "Test:" in line:
            divisibleBy = int(line.split("divisible by ")[1].rstrip())
            monkeys[index].test = Test(divisibleBy)
        if "If true: throw to monkey" in line:
            monkeyId = int(line.split("throw to monkey ")[1].rstrip())
            monkeys[index].test.throwToIfTrue = monkeyId
        if "If false: throw to monkey" in line:
            monkeyId = int(line.split("throw to monkey ")[1].rstrip())
            monkeys[index].test.throwToIfFalse = monkeyId
    return monkeys


def solve_part_one(monkeys: list[Monkey]) -> int:
    for _ in range(20):
        for monkey in monkeys:
            monkey.inspected += len(monkey.items)
            size = len(monkey.items)
            while size > 0:
                item = monkey.items.pop(0)
                size -= 1

                value = monkey(item) // 3
                throwTo = monkey.test(value)
                monkeys[throwTo].items.append(value)

    values = sorted([monkey.inspected for monkey in monkeys], reverse=True)
    return values[0] * values[1]


def solve_part_two(monkeys: list[Monkey]) -> int:
    # compute least common multiplier for the prime numbers all along
    lcm = reduce(lambda a, b: a * b, [monkey.test.divisibleBy for monkey in monkeys], 1)
    for _ in range(10_000):
        for monkey in monkeys:
            monkey.inspected += len(monkey.items)
            size = len(monkey.items)
            while size > 0:
                item = monkey.items.pop(0)
                size -= 1

                value = monkey(item)
                value = value % lcm

                throwTo = monkey.test(value)
                monkeys[throwTo].items.append(value)

    values = sorted([monkey.inspected for monkey in monkeys], reverse=True)
    return values[0] * values[1]


def main():
    filename = "input.txt"
    filepath = __file__.replace("main.py", filename)

    lines = open(filepath, "r", encoding="utf-8").readlines()
    print(f"Solution 1: {solve_part_one(read_monkeys(lines))}")
    print(f"Solution 2: {solve_part_two(read_monkeys(lines))}")
    pass


if __name__ == "__main__":
    main()
