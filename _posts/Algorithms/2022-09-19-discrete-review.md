---
layout: post
title: Discrete Review
category: algorithms
header-includes:
  - \usepackage[ruled]{algorithm2e}
---

# Answer Sheet

[Answer Sheet](/Blog/documents/Assignment1_solution.pdf)

# Writing Assignment

## 3d

$$
\{ (x, y): x = y \}
$$

reflexive, symmetric, antisymmetric, transitive

- reflexive: $x = x$
- symmetric: $x = y \implies y = x$
- antisymmetric: $x = y \land y = x \implies x = y$
- transitive: $x = y \land y = z \implies x = z$

![Injective, Surjective, Bijective](https://homework.study.com/cimages/multimages/16/jections702083845367077364.png)

## 16a

![picture 1](/Blog/images/2022-09-19-22-35-53-16a.png)

### Invariant

At the end of step i of the loop, min always contains the smallest element of the array from index 1 to i of a.

- Initialization: In the first iteration, min = a[1], which is the smallest element of the array from index 1 to 1 of a.
- Induction: Assume that the invariant holds at the end of step k of the loop (min is the minimum value of a[1, ..., k]). At the k+1 step, min is the minimum value of a[1, ..., k] and a[k+1]. So, min is the minimum value of a[1, ..., k+1].

### Soundness

When termination occurs, i = len(a). Since the invariant holds, min is the minimum value of a[1, ..., len(a)]. So, min is the minimum value of a.

### Correctness

For each iteration, i is incremented by 1 and getting close to the end of a. When i = len(a), the loop terminates.

## 16b

![picture 2](/Blog/images/2022-09-19-22-50-12-16b.png)

### Invariant

At the end of each outer loop, the array a[1, ..., i] is sorted.

- Initialization: In the first iteration, a[1] is sorted.
- Induction: Assume that the invariant holds at the end of the k-th iteration of outer loop (a[1, ..., k] is sorted). In k+1-th iteration of outer loop, at the beginning of the inner loop, a[1, ..., k] is sorted. At the end of the inner loop, a\[k+1\] is inserted into the correct position so that a[1, ..., k+1] is sorted. So, a[1, ..., k+1] is sorted at the end of the k+1-th iteration of outer loop.

### Soundness

When termination occurs, i = len(a). Since the invariant holds, a[1, ..., len(a)] is sorted. So, a is sorted.

### Correctness

For outer loop, i is incremented by 1 and getting close to the end of a. When i = len(a), the loop terminates.

For inner loop, j is decremented by 1 and getting close to the beginning of i-1. When j = i-1, the loop terminates.
