import time


def find_marker(datastream: str, window_size) -> int:
    for i in range(len(datastream)):
        if len(set(datastream[i : (i + window_size)])) == window_size:
            return i + window_size

    return -1


def main():
    # filepath = __file__.replace("main.py", "bigboy.txt")
    filepath = __file__.replace("main.py", "input.txt")

    start = time.perf_counter()
    datastream = open(filepath, "r", encoding="utf-8").readlines()[0]
    print(
        f"Solution 1: {find_marker(datastream, 4)} (took: {time.perf_counter() - start})s"
    )

    start = time.perf_counter()
    datastream = open(filepath, "r", encoding="utf-8").readlines()[0]
    print(
        f"Solution 2: {find_marker(datastream, 14)} (took: {time.perf_counter() - start})s"
    )
    pass


if __name__ == "__main__":
    main()
