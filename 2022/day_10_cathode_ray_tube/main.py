from functools import reduce


def read_register(lines: list[str]) -> list[int]:
    register = [1]
    for line in lines:
        if line.startswith("noop"):
            register.append(0)
        else:
            register.append(0)
            register.append(int(line.rstrip().split(" ")[1]))

    return register


def solve_part_one(register: list[int]) -> int:
    return reduce(
        lambda acc, cycle: acc + (cycle * sum(register[0:cycle])),
        [20, 60, 100, 140, 180, 220],
        0,
    )


def solve_part_two(register: list[int]) -> str:
    crt = ["."] * 240
    for cycle in range(1, 241):
        # current index where the CRT is painting the pixel
        index = (cycle - 1) % 40
        # the row 0..5 (zero based index)
        row = int((cycle - 1) / 40)
        # start position of the sprite 0..39 (zero based index)
        start = sum(register[0:cycle]) - 1
        # if the current index overlaps with the sprite paint #
        if index in list(range(start, start + 3)):
            crt[index + (row * 40)] = "#"

    rows = []
    for i in range(0, 6):
        rows.append("".join(crt[i * 40 : (i * 40) + 40]))

    return "\n".join(rows)


def main():
    filename = "input.txt"
    filepath = __file__.replace("main.py", filename)

    lines = open(filepath, "r", encoding="utf-8").readlines()
    register = read_register(lines)

    print(f"Solution 1: {solve_part_one(register)}\n")
    print(f"Solution 2:\n{solve_part_two(register)}")


if __name__ == "__main__":
    main()
