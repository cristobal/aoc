def get_path(filename: str) -> str:
    return __file__.replace("main.py", filename)


def read_values(filename: str) -> list[int]:
    values = []
    total = 0
    for line in open(get_path(filename)).readlines():
        if line == "\n":
            values.append(total)
            total = 0
        else:
            total = total + int(line)

    return values


def main():
    values = read_values("input.txt")
    print(f"Solution 1: {max(values)}")
    print(f"Solution 2: {sum(sorted(values)[-3:])}")


if __name__ == "__main__":
    main()
