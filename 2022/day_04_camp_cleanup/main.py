from functools import reduce


def get_set(part) -> set[int]:
    args = part.split("-")
    return set(list(range(int(args[0]), int(args[1]) + 1)))


def get_path(filename: str) -> str:
    return __file__.replace("main.py", filename)


def read_values(filename) -> list[tuple[set[int], set[int]]]:
    return [
        (get_set(a), get_set(b))
        for (a, b) in [
            line.strip().split(",") for line in open(get_path(filename)).readlines()
        ]
    ]


def solve_part_1(values: list[tuple[set[int], set[int]]]) -> int:
    total = 0
    for (a, b) in values:
        if a.issubset(b) or b.issubset(a):
            total = total + 1

    return total


def solve_part_2(values: list[tuple[set[int], set[int]]]) -> int:
    total = 0
    for (a, b) in values:
        if a.issubset(b) or b.issubset(a):
            total = total + 1
            continue
        if len(a.intersection(b)) > 0:
            total = total + 1

    return total


def main():
    values = read_values("input.txt")
    print(f"Solution 1: {solve_part_1(values)}")
    print(f"Solution 2: {solve_part_2(values)}")


if __name__ == "__main__":
    main()
