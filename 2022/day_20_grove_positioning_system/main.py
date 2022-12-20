from __future__ import annotations
from typing import NamedTuple
from dataclasses import dataclass
import sys


@dataclass
class Node:
    id: int
    prev: "Node" | None = None
    next: "Node" | None = None
    value: int = -1

    def __str__(self) -> str:
        prev = str(self.prev.id) if self.prev != None else "None"
        next = str(self.next.id) if self.next != None else "None"
        return f"Node(id={self.id}, prev={prev}, next={next}, value={self.value})"


class Mixer(NamedTuple):
    size: int
    sequence: list[int]
    nodes: list[Node]
    zeroIndexAt: int

    def zeroNode(self) -> Node:
        return self.nodes[self.zeroIndexAt]


def read_values(lines: list[str]):
    return [int(line.rstrip()) for line in lines]


def create_mixer(sequence: list[int]) -> Mixer:
    size = len(sequence)

    nodes: list[Node] = []
    nodes.append(Node(id=0, value=sequence[0]))

    zeroIndexAt = -1
    for i in range(1, size):
        # create new node and set previous node
        node = Node(id=i, prev=nodes[i - 1], value=sequence[i])
        if node.value == 0:
            zeroIndexAt = i

        node.prev.next = node  # type: ignore
        nodes.append(node)

    nodes[0].prev = nodes[size - 1]
    nodes[size - 1].next = nodes[0]

    return Mixer(size, sequence, nodes, zeroIndexAt)


def remix(mixer: Mixer, cycles: int):
    size = mixer.size
    nodes = mixer.nodes
    for _ in range(0, cycles):
        for i, seq in enumerate(mixer.sequence):
            # do nothing
            if seq == 0:
                continue

            # need to wrap seq into count if outside of size range
            count = abs(seq) % (size - 1)

            src = nodes[i]
            dst = nodes[i]

            if seq > 0:
                for _ in range(0, count):
                    dst = dst.next  # type: ignore
            else:
                # we append one to remove from front of dst
                for _ in range(0, count + 1):
                    dst = dst.prev  # type: ignore
            # cut out src and connect its prev <-> next
            src.prev.next = src.next  # type: ignore
            src.next.prev = src.prev  # type: ignore

            # insert src after dst and update its prev next nodes
            src.next = dst.next  # type: ignore
            src.prev = dst
            src.prev.next = src  # type: ignore
            src.next.prev = src  # type: ignore

    pass


def solve_part_one(values: list[int]) -> int:
    mixer = create_mixer(values)
    remix(mixer, 1)

    values = []
    node = mixer.zeroNode()
    for _ in range(0, 3):
        for _ in range(0, 1000):
            node = node.next  # type: ignore
        values.append(node.value)  # type: ignore

    # print(values)
    return sum(values)


def solve_part_two(values: list[int], decryption_key: int) -> int:
    mixer = create_mixer([value * decryption_key for value in values])
    remix(mixer, 10)

    values = []
    node = mixer.zeroNode()
    for _ in range(0, 3):
        for _ in range(0, 1000):
            node = node.next  # type: ignore
        values.append(node.value)  # type: ignore

    # print(values)
    return sum(values)


def main():
    filepath = __file__.replace("main.py", "input.txt")
    lines = open(filepath, "r", encoding="utf-8").readlines()
    values = read_values(lines)

    print(f"Solution 1: {solve_part_one(values)}")
    print(f"Solution 2: {solve_part_two(values, 811589153)}")
    pass


if __name__ == "__main__":
    main()
