from typing import List, Set, Tuple


class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        w = len(matrix[0])
        h = len(matrix)
        size = w * h

        directions = ["r", "d", "l", "u"]
        d = 0

        visited: Set[Tuple[int, int]] = set()
        res: List[int] = []

        # Boundary
        for i in range(w):
            visited.add((i, -1))
            visited.add((i, h))
        for i in range(h):
            visited.add((-1, i))
            visited.add((w, i))

        x, y = 0, 0
        while True:
            res.append(matrix[y][x])
            if len(res) >= size:
                break
            visited.add((x, y))
            nextX, nextY = self.getNext(x, y, directions[d])
            while ((nextX, nextY) in visited):
                d = (d+1) % 4
                nextX, nextY = self.getNext(x, y, directions[d])
            x, y = nextX, nextY

        return res

    def getNext(self, currX, currY, direction):
        if direction == "r":
            return currX + 1, currY
        elif direction == "d":
            return currX, currY + 1
        elif direction == "l":
            return currX - 1, currY
        else:
            return currX, currY - 1


Solution().spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
