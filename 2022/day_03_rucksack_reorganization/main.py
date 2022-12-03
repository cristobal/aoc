def get_path(filename: str) -> str:
    return __file__.replace("main.py", filename)


def read_values(filename: str) -> list[tuple[str, str]]:
    values = []
    for line in [line.strip() for line in open(get_path(filename)).readlines()]:
        size = int(len(line.strip()) / 2)
        values.append((line[:size], line[-size:]))

    return values


def solve_part_1(values: list[tuple[str, str]]) -> int:
    items = []
    for (left, right) in values:
        item = set(left).intersection(set(right)).pop()
        items.append(item)

    priorities = []
    for item in items:
        value = ord(item)
        # a-z
        if value > 90:
            priority = (value - ord("a")) + 1
        # A-Z
        else:
            priority = (value - ord("A")) + 27
        priorities.append(priority)

    return sum(priorities)


def main():
    values = read_values("input.txt")
    print(f"Solution 1: {solve_part_1(values)}")
    # print(f"Solution 2: {sum(sorted(values)[-3:])}")


if __name__ == "__main__":
    main()
