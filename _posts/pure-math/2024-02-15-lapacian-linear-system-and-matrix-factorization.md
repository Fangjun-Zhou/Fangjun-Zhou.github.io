---
layout: post
title: Laplacian, Linear System, and Matrix Factorization
category: pure-math
---

Last year when I took CS 639, some math related to the course such as Laplacian and using numerical methods to solve linear system confused me for a while.

These are not the prerequisite of the course. But I did wish to understand what's going on behind the scene.

I've taken CS 412 Introduction to Numerical Methods last semester and CS 513 Numerical Methods for Linear Algebra this semester. I'm writing this note to share some of the details I learned, and I hope this helps you better understand the material.

## Why Laplacian?

In the heat dissipation example we learned in class, the final temperature of the grid was found by solving the linear system related to a Laplacian stencil. This is actually related to three properties we want for the field:

- Steady heat flow: The temperature gradient flow is not changing over time.
- Incompressible heat flow: Heat does not spontaneously emerge or disappear.
- Irrotational heat flow: There's no heat flow spinning inside our cube.

To guarantee these three properties, we just need to satisfy the Laplace's equation:

$$
\Delta f = 0
$$

Where

$$
\Delta f = \sum_{i} \frac{\partial^2f}{\partial x_i^2}
$$

Note that

$$
\begin{align}
    v &= \nabla f \\
    \nabla \cdot v &= \sum_{i} \frac{\partial^2f}{\partial x_i^2} = \Delta f
\end{align}
$$

So the Laplacian of a heat field is also the divergence of the heat flow.

Since this is not an Engineering class, we don't cover the details of Laplace's equation. But I found a [great video](https://youtu.be/zN0zDrQimXU) about this topic!

## How's that Related to Stencil

So how's this related to the $-6$ and $+1$ stencil we used in the lectures? It turns out when you want to calculate the Laplacian of a discrete grid, you can use the [Discrete Laplace Operator](https://en.wikipedia.org/wiki/Discrete_Laplace_operator).

In the 2D example, the Laplacian of field $f$ at position $(x, y)$ is approximate to

$$
\Delta f(x, y) \approx \frac{f(x - h, y) + f(x + h, y) + f(x, y - h) + f(x, y + h) - 4f(x, y)}{h^2}
$$

Looks familiar? This is exactly the $-4$ and $+1$ stencil we used in the 2D case when $h=1$!

The discrete Laplacian stencil is calculating the **approximated Laplacian at each location of a certain grid**. And solving this equation is what we need to constrain the three properties of our object.

And when we convert the Laplacian stencil to a matrix $L$, we got

$$
Lx = b
$$

Where $L$ is the discrete Laplacian operator in the matrix format, $b$ is the Laplacian we want to get.

Remember the Laplacian of the field is also the divergence of the heat gradient flow. So a positive value in $b$ means there's a heat source in the certain point. That's why we set the side of $b$ to 1 to begin with.
