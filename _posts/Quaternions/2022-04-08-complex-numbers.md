---
layout: post
title: Complex Number Review
category: quaternions
---

# Complex Number Representation

Complex numbers can be represented by $\mathbb{C} = \mathbb{R} + \mathbb{I}$, where $\mathbb{R}$ is real number set and $\mathbb{I}$ is imagine number set.

Note that all complex numbers can be represented by matrix:

$$
\begin{aligned}
    z &= a + bi,
    a \in \mathbb{R}
    bi \in \mathbb{I}
    z \in \mathbb{C} \\
    &=
    \begin{bmatrix}
        a & -b \\
        b & a
    \end{bmatrix}
\end{aligned}
$$

This matrix comes from two facts:

1. Complex number $1$ can be represented by matrix:
$
\begin{aligned}
    \begin{bmatrix}
        1 & 0 \\
        0 & 1
    \end{bmatrix}
\end{aligned}
$
, which is also the identity matrix.
2. Complex number $i$ can be represented by matrix:
$
\begin{bmatrix}
    0 & -1 \\
    1 & 0
\end{bmatrix}
$

This is because in a complex plane, both $1$ and
$
\begin{bmatrix}
    1 & 0 \\
    0 & 1
\end{bmatrix}
$
both keep a value intact when performing pre-multiple operation. And both $i$ and
$
\begin{bmatrix}
    0 & -1 \\
    1 & 0
\end{bmatrix}
$
rotate a value 90 degrees conter-clockwise when erforming pre-multiple operation.

After we have these facts, it's easy to see that:

$$
\begin{aligned}
    z &= a + bi,
    a \in \mathbb{R}
    bi \in \mathbb{I}
    z \in \mathbb{C} \\
    &= a * 
    \begin{bmatrix}
        1 & 0 \\
        0 & 1
    \end{bmatrix}
    + b *
    \begin{bmatrix}
        0 & -1 \\
        1 & 0
    \end{bmatrix} \\
    &=
    \begin{bmatrix}
        a & -b \\
        b & a
    \end{bmatrix}
\end{aligned}
$$