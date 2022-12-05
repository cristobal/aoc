import re


def get_path(filename: str) -> str:
    return __file__.replace("main.py", filename)


def read_stacks(lines: list[str]) -> dict[int, list[str]]:
    head, *tail = reversed([line.rstrip() for line in lines[0 : lines.index("\n")]])

    # find labels
    prog = re.compile(r"\d")
    labels = [int(label) for label in prog.findall(head)]

    # initialize stacks
    stacks: dict[int, list[str]] = dict()
    for label in labels:
        stacks[label] = []

    # populate stacks
    for line in tail:
        for (index, label) in enumerate(labels):
            value = line[1 + (4 * index)]
            if value != " ":
                stacks[label].append(value)

    return stacks


def read_moves(lines: list[str]) -> list[list[int]]:
    prog = re.compile(r"\d+")

    moves: list[list[int]] = []
    for line in [line.rstrip() for line in lines[lines.index("\n") + 1 :]]:
        moves.append([int(arg) for arg in prog.findall(line)])

    return moves


def solve_part_1(stacks: dict[int, list[str]], moves: list[list[int]]) -> str:
    for (total, src, dest) in moves:
        for _ in range(0, total):
            value = stacks[src].pop()
            stacks[dest].append(value)

    values = [stacks[label][len(stacks[label]) - 1] for (_, label) in enumerate(stacks)]
    return "".join(values)


def solve_part_2(stacks: dict[int, list[str]], moves: list[list[int]]) -> str:
    for (total, src, dest) in moves:
        values = [stacks[src].pop() for _ in range(0, total)]
        for value in reversed(values):
            stacks[dest].append(value)

    values = [stacks[label][len(stacks[label]) - 1] for (_, label) in enumerate(stacks)]
    return "".join(values)


def main():
    lines = open(get_path("input.txt")).readlines()

    stacks = read_stacks(lines)
    moves = read_moves(lines)
    print(f"Solution 1: {solve_part_1(stacks, moves)}")

    stacks = read_stacks(lines)
    moves = read_moves(lines)
    print(f"Solution 2: {solve_part_2(stacks, moves)}")


if __name__ == "__main__":
    main()
