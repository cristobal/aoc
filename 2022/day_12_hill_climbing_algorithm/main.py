import heapq

START_POINT = ord("S")
END_POINT = ord("E")


class HeightMap:
    def __init__(
        self, width: int, height: int, chars: list[str], values: list[int]
    ) -> None:
        self.width = width
        self.height = height
        self.chars = chars
        self.values = values
        self.values = values

    def get_neighbours(self, index: int) -> list[int]:
        width = self.width
        height = self.height
        values = self.values

        # rotate with the clock
        candidates: list[int] = [
            # north
            index - width,
            # east
            index + 1 if (index + 1) % width != 0 else -1,
            # south
            index + width if (index + width) <= ((width * height) - 1) else -1,
            # west
            index - 1 if (index % width) - 1 >= 0 else -1,
        ]

        # start point
        if values[index] == START_POINT:
            return list(filter(lambda index: index >= 0, candidates))
        else:
            return list(
                filter(
                    lambda pos: values[pos] == END_POINT
                    or (
                        (pos >= 0)
                        and (
                            # can only go up one height
                            ((values[pos] - values[index]) == 1)
                            # no limit climbing down
                            or (values[pos] - values[index] <= 0)
                        )
                    ),
                    candidates,
                )
            )


class Queue:
    def __init__(self):
        self.elements: list[tuple[int, int]] = []

    def empty(self) -> bool:
        return not self.elements

    def put(self, item: int, priority: int):
        heapq.heappush(self.elements, (priority, item))

    def get(self) -> int:
        return heapq.heappop(self.elements)[1]


def read_height_map(lines: list[str]) -> HeightMap:
    width = len(lines[0].rstrip())
    height = len(lines)
    size = width * height
    chars = ["a"] * size
    values = [0] * size
    index = 0

    for y, line in enumerate(lines):
        for x, char in enumerate(line):
            pos = x + (y * width)
            chars[pos] = char
            if char == "S":
                values[pos] = START_POINT
            elif char == "E":
                values[pos] = END_POINT
            else:
                values[pos] = ord(char) - ord("a")

        index += width

    return HeightMap(width, height, chars, values)


def a_star_search(heightMap: HeightMap, start: int, goal: int):
    queue = Queue()
    queue.put(start, 0)

    came_from = {}
    cost_so_far = {}

    came_from[start] = None
    cost_so_far[start] = 1

    current = 0
    while not queue.empty():
        current = queue.get()
        if current == goal:
            cost_so_far[goal] = cost_so_far[current] + 1
            break

        for next in heightMap.get_neighbours(current):
            new_cost = cost_so_far[current] + 1
            if next not in cost_so_far or new_cost < cost_so_far[next]:
                cost_so_far[next] = new_cost
                priority = new_cost
                queue.put(next, priority)
                came_from[next] = current
        pass

    return cost_so_far[goal] if goal in cost_so_far else -1


def solve_part_one(heightMap: HeightMap) -> int:
    return a_star_search(
        heightMap,
        heightMap.values.index(START_POINT),
        heightMap.values.index(END_POINT),
    )


def solve_part_two(heightMap: HeightMap) -> int:
    width = heightMap.width
    height = heightMap.height
    values = heightMap.values

    start_points = sorted(
        [
            # top
            *filter(lambda i: values[i] == 0, [i for i in range(0, width)]),
            # right
            *filter(
                lambda i: values[i] == 0,
                [i for i in range((width * 2) - 1, (width * height) - 1, width)],
            ),
            # south
            *filter(
                lambda i: values[i] == 0,
                [i for i in range((width * height) - width, (width * height))],
            ),
            # left
            *filter(
                lambda i: values[i] == 0,
                [i for i in range(width, (width * height) - width, width)],
            ),
        ]
    )

    goal = heightMap.values.index(END_POINT)
    results = list(
        filter(
            lambda cost: cost > 0,
            [a_star_search(heightMap, start, goal) for start in start_points],
        )
    )

    return min(results)


def main():
    filename = "input.txt"
    filepath = __file__.replace("main.py", filename)
    lines = open(filepath, "r", encoding="utf-8").readlines()
    heightMap = read_height_map(lines)
    print(f"Solution 1: {solve_part_one(heightMap)}")
    print(f"Solution 2: {solve_part_two(heightMap)}")


if __name__ == "__main__":
    main()
