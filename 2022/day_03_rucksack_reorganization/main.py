def get_path(filename: str) -> str:
    return __file__.replace("main.py", filename)


def read_lines(filename: str) -> list[str]:
    return [line.strip() for line in open(get_path(filename)).readlines()]


def get_priority(item: str) -> int:
    value = ord(item)
    # a-z
    if value > 90:
        return (value - ord("a")) + 1

    # A-Z
    return (value - ord("A")) + 27


def solve_part_1(lines: list[str]) -> int:
    values = []
    for line in lines:
        size = int(len(line.strip()) / 2)
        values.append((line[:size], line[-size:]))

    items = []
    for (left, right) in values:
        item = set(left).intersection(set(right)).pop()
        items.append(item)

    priorities = [get_priority(item) for item in items]
    return sum(priorities)


def solve_part_2(lines: list[str]) -> int:
    items = []
    for i in range(0, len(lines), 3):
        item = (
            set(lines[i])
            .intersection(set(lines[i + 1]))
            .intersection(set(lines[i + 2]))
            .pop()
        )
        items.append(item)

    priorities = [get_priority(item) for item in items]
    return sum(priorities)


def main():
    lines = read_lines("input.txt")
    print(f"Solution 1: {solve_part_1(lines)}")
    print(f"Solution 2: {solve_part_2(lines)}")


if __name__ == "__main__":
    main()
