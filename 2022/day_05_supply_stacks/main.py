import re
import time


def get_path(filename: str) -> str:
    return __file__.replace("main.py", filename)


def read_stacks(lines: list[str]) -> list[list[str]]:
    prog = re.compile(r"[A-Z]")

    stacks: list[list[str]] = []
    size: int = 0
    while line := lines.pop(0):
        # terminal symbol
        if prog.search(line) is None and line.rstrip() == "":
            break

        for match in prog.finditer(line):
            start = match.start()
            index = int((start - 1) / 4)

            # append missing stacks dynamically
            if size < (index + 1):
                for _ in range(0, (index - size) + 1):
                    stacks.append([])
                    size = size + 1

            stacks[index].insert(0, line[start])

    return stacks


def read_moves(lines: list[str]) -> list[list[int]]:
    prog = re.compile(r"\d+")
    return [[int(arg) for arg in prog.findall(line)] for line in lines]


def solve_part_1(stacks: list[list[str]], moves: list[list[int]]) -> str:
    for [crates, src, dst] in moves:
        for _ in range(0, crates):
            stacks[dst - 1].append(stacks[src - 1].pop())

    values = [stacks[i][len(stacks[i]) - 1] for (i, _) in enumerate(stacks)]
    return "".join(values)


def solve_part_2(stacks: list[list[str]], moves: list[list[int]]) -> str:
    for [crates, src, dst] in moves:
        index = len(stacks[src - 1]) - crates
        for _ in range(0, crates):
            stacks[dst - 1].append(stacks[src - 1].pop(index))

    values = [stacks[i][len(stacks[i]) - 1] for (i, _) in enumerate(stacks)]
    return "".join(values)


def main():
    # path = get_path("bigboy.txt")
    path = get_path("input.txt")

    start = time.perf_counter()
    lines = open(path, "r", encoding="utf-8").readlines()
    value = solve_part_1(read_stacks(lines), read_moves(lines))
    print(f"Solution 1: {value} (took: {time.perf_counter() - start}s)")

    start = time.perf_counter()
    lines = open(path, "r", encoding="utf-8").readlines()
    value = solve_part_2(read_stacks(lines), read_moves(lines))
    print(f"Solution 2: {value} (took: {time.perf_counter() - start}s")


if __name__ == "__main__":
    main()
