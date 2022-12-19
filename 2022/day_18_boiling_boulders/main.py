from typing import NamedTuple
import time


class Cube(NamedTuple):
    x: int
    y: int
    z: int


class PondBoundaries(NamedTuple):
    xmin: int
    xmax: int
    ymin: int
    ymax: int
    zmin: int
    zmax: int


def read_cubes(lines: list[str]) -> set[Cube]:
    cubes: set[Cube] = set()
    for line in lines:
        x, y, z = [int(arg) for arg in line.rstrip().split(",")]
        cubes.add(Cube(x, y, z))

    return cubes


def get_neighbours(cube: Cube) -> set[Cube]:
    return set(
        [
            Cube(cube.x + 1, cube.y, cube.z),
            Cube(cube.x - 1, cube.y, cube.z),
            Cube(cube.x, cube.y + 1, cube.z),
            Cube(cube.x, cube.y - 1, cube.z),
            Cube(cube.x, cube.y, cube.z + 1),
            Cube(cube.x, cube.y, cube.z - 1),
        ]
    )


def get_neighbours_filtered(
    cube: Cube, vmin: int, vmaxs: tuple[int, int, int]
) -> set[Cube]:
    return set(
        filter(
            lambda cube: (
                ((cube.x >= vmin) and (cube.x <= vmaxs[0]))
                and ((cube.y >= vmin) and (cube.y <= vmaxs[1]))
                and ((cube.z >= vmin) and (cube.z <= vmaxs[2]))
            ),
            get_neighbours(cube),
        )
    )


def solve_part_one_surface_area(cubes: set[Cube]) -> int:
    """
    Returns the surface area the total number of sides that are not connected to each other.
    """
    return sum(len(get_neighbours(cube).difference(cubes)) for cube in cubes)


def solve_part_two_find_compartments(cubes: set[Cube]) -> int:
    """
    Alternative solution here is to find alle the compartmetns
    """
    vmin = 0
    vmaxs = (
        max(*(cube.x for cube in cubes)),
        max(*(cube.y for cube in cubes)),
        max(*(cube.z for cube in cubes)),
    )

    extra: set[Cube] = set()

    for cube in cubes:
        for edge in get_neighbours_filtered(cube, vmin, vmaxs).difference(cubes):
            visited: set[Cube] = set()
            items: list[Cube] = [edge]
            ok = True
            surface = False
            while ok:
                item = items.pop(0)
                visited.add(item)
                if item.y <= vmin:
                    surface = True
                    break

                items.extend(
                    list(
                        get_neighbours_filtered(item, vmin, vmaxs).difference(
                            set.union(visited, cubes, items, extra)
                        )
                    )
                )
                ok = len(items) > 0

            if not surface:
                extra.update(visited)

    return solve_part_one_surface_area(cubes.union(extra))


def solve_part_two_3d_flood(cubes: set[Cube]) -> int:
    """
    Returns the surfaces area for all cubes and the compartments that can not be reached.
    """
    vmin = 0
    vmaxs = (
        max(*(cube.x for cube in cubes)),
        max(*(cube.y for cube in cubes)),
        max(*(cube.z for cube in cubes)),
    )

    # 3d flood and visit all cubes possible
    visited: set[Cube] = set()
    items: list[Cube] = [Cube(0, 0, 0)]
    ok = True
    while ok:
        item = items.pop(0)
        visited.add(item)
        neighbours = get_neighbours_filtered(item, vmin, vmaxs)

        items.extend(list(neighbours.difference(set.union(visited, cubes, items))))
        ok = len(items) > 0

    # create set off all cubes
    all: set[Cube] = set()
    for x in range(vmin, vmaxs[0] + 1):
        for y in range(vmin, vmaxs[1] + 1):
            for z in range(vmin, vmaxs[2] + 1):
                all.add(Cube(x, y, z))

    # the exterior surfaces corresponds to all the cubes less the ones that
    # we were able to visit, we are solving the surface area for all the cubes
    # we could not visit
    return solve_part_one_surface_area(all.difference(visited))


def main():
    filepath = __file__.replace("main.py", "input.txt")
    lines = open(filepath, "r", encoding="utf-8").readlines()
    cubes = read_cubes(lines)

    start = time.perf_counter()
    print(
        f"Solution 1: {solve_part_one_surface_area(cubes)} (took: {time.perf_counter() - start}s)"
    )

    start = time.perf_counter()
    print(
        f"Solution 2: {solve_part_two_3d_flood(cubes)} (took: {time.perf_counter() - start}s)"
    )

    # takes about 5m 🤦
    # start = time.perf_counter()
    # print(
    #     f"Solution 2: {solve_part_two_find_compartments(cubes)} (took: {time.perf_counter() - start}s)"
    # )


if __name__ == "__main__":
    main()
