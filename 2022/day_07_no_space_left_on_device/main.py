import re
from typing import Pattern

progs: dict[str, Pattern] = {}
progs["cd"] = re.compile(r"^(\$ cd )(.+)$")
progs["file"] = re.compile(r"^(\d+) (.+)$")


def traverse(commands: list[str]) -> dict[str, int]:
    pwd: list[str] = []
    counter: dict[str, int] = dict()
    for i in range(len(commands)):
        command = commands[i]
        if m := progs["cd"].match(command):
            _, dir = m.groups()
            # navigate back
            if dir == "..":
                pwd.pop()
            # navigate into
            else:
                pwd.append(dir)
                path = ("/".join(pwd))[1:] if len(pwd) > 1 else "/"
                if not counter.get(path):
                    counter[path] = 0

            continue
        if m := progs["file"].match(command):
            size = int(m.group(1))
            for i in range(len(pwd)):
                path = ("/".join(pwd[0 : i + 1]))[1:] if i > 0 else "/"
                counter[path] = counter[path] + size

    return counter


def solve_part_one(paths: dict[str, int], required_space: int) -> int:
    exclude = set()
    for (path, size) in paths.items():
        # filter out leaves
        if size > required_space:
            exclude.add(path)
            continue

        args = path.split("/") if path != "/" else []
        parent_path = "/".join(path.split("/")[:-1]) if len(args) > 2 else path
        if path != parent_path and paths[parent_path] > required_space:
            exclude.add(parent_path)

    for path in exclude:
        del paths[path]

    return sum([size for (_, size) in paths.items()])


def solve_part_two(paths: dict[str, int], total_space: int, required_space: int) -> int:
    used_space = paths["/"]
    del paths["/"]

    # needed space to free
    needed_space = required_space - (total_space - used_space)

    return min(
        filter(lambda size: size > needed_space, [size for (_, size) in paths.items()])
    )


def main():
    filename = "input.txt"
    filepath = __file__.replace("main.py", filename)
    commands = [
        line.rstrip() for line in open(filepath, "r", encoding="utf-8").readlines()
    ]

    paths = traverse(commands)
    print(f"Solution 1: {solve_part_one(dict(paths), 100_000)}")
    print(f"Solution 2: {solve_part_two(dict(paths), 70_000_000, 30_000_000)}")


if __name__ == "__main__":
    main()
