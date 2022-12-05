from functools import reduce
from collections.abc import Callable


def get_set(part) -> set[int]:
    args = part.split("-")
    return set(list(range(int(args[0]), int(args[1]) + 1)))


def read_values(filename) -> list[tuple[set[int], set[int]]]:
    return [
        (get_set(a), get_set(b))
        for (a, b) in [
            line.strip().split(",")
            for line in open(__file__.replace("main.py", filename)).readlines()
        ]
    ]


def solver_part_1(total: int, sets: tuple[set[int], set[int]]) -> int:
    return total + (1 if sets[0].issubset(sets[1]) or sets[1].issubset(sets[0]) else 0)


def solver_part_2(total: int, sets: tuple[set[int], set[int]]) -> int:
    if sets[0].issubset(sets[1]) or sets[1].issubset(sets[0]):
        return total + 1
    if len(sets[0].intersection(sets[1])) > 0:
        return total + 1
    return total


def solve(
    solver: Callable[[int, tuple[set[int], set[int]]], int],
    values: list[tuple[set[int], set[int]]],
) -> int:
    return reduce(solver, values, 0)


def main():
    values = read_values("input.txt")
    print(f"Solution 1: {solve(solver_part_1, values)}")
    print(f"Solution 2: {solve(solver_part_2, values)}")


if __name__ == "__main__":
    main()
