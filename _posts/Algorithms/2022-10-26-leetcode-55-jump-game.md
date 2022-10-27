---
layout: post
title: LeetCode 55 Jump Game
category: algorithms
---

# Problem Description

[55. Jump Game](https://leetcode.com/problems/jump-game/)

You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.

Return true if you can reach the last index, or false otherwise.

Example 1:

```
Input: nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
```

Example 2:

```
Input: nums = [3,2,1,0,4]
Output: false
Explanation: You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.
```

Constraints:

- 1 <= nums.length <= 104
- 0 <= nums[i] <= 105

# Greedy Algorithm

In this problem, we can perform a local search, and search the index that can jump furthest in the next iteration.

If there's an index `i` such that for all items from `i` to `i + nums[i]` cannot perform a jump further than `i + nums[i]`, return false.

We can consider the achievable space as interval, all we need to do is find a index that can expand the interval as big as possible.

## Code Implementation

```python
class Solution:
    def canJump(self, nums: List[int]) -> bool:
        curr = 0
        while True:
            # Check if current jump can reach the end of the array.
            if curr + nums[curr] >= len(nums) - 1:
                return True

            # Get the indx that can jump the furthest in the range.
            maxIndx, maxJump = curr, curr + nums[curr]
            for i in range(curr, curr + nums[curr] + 1, 1):
                if i + nums[i] > maxJump:
                    maxIndx, maxJump = i, i + nums[i]

            # If the range cannot be extend, return False.
            if maxIndx == curr:
                return False

            # Update the index
            curr = maxIndx
```
