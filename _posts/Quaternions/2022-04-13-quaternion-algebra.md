---
layout: post
title: Quaternion Algebra
category: quaternions
---

# Basic Definition

$$
q = s + ai + bj + ck \quad s, a, b, c \in \mathbb{R}
$$

$$
i^2 = j^2 = k^2 = ijk = -1
$$

$$
\begin{aligned}
    ij &= k \quad jk = i \quad ki = j \\
    ji &= -k \quad kj = -i \quad ik = -j
\end{aligned}
$$

Note that $ij != ji$

## Different Representation

For a quaternion, there are three representation

$$
\begin{aligned}
    q &= s + xi + yj + zk \\
    q &= s + \textbf{v} \\
    q &= [s, \textbf{v}]
\end{aligned}
$$

Where $s, x, y, z \in \mathbb{R}$, and $\textbf{v} \in \mathbb{R}^3$

# Math Operations

## Addition and Subtraction

$$
\begin{aligned}
    q_a &= [s_a, \textbf{a}] \\
    q_b &= [s_b, \textbf{b}] \\
    q_a \pm q_b &= [s_a \pm s_b, \textbf{a} \pm \textbf{b}]
\end{aligned}
$$

## Quaternion Product

The basic quaternion multiplication is:

$$
[s_a, \textbf{a}][s_b, \textbf{b}] = [s_as_b - a \cdot b, s_a \textbf{b} + s_b \textbf{a} + \textbf{a} \times \textbf{b}]
$$

The regular way to prove this is to expand two quaternions separately and perform the multiplication. But an easier way is to use an additive form of quaternion which I may mention later so I won't prove it here.

## Multiply a Quaternion by a Scalar

$$
\begin{aligned}
    q &= [s, \textbf{v}] \\
    \lambda q &= \lambda [s, \textbf{v}] \\
    \lambda q &= [\lambda s, \lambda \textbf{v}]
\end{aligned}
$$

# Special Quaternions

## Real Quaternion

A *real quaternion* has zero vector term.

$$
q = [s, 0]
$$

## Pure Quaternion

A *pure quaternion* has zero scalar term.

$$
q = xi + yj + zk
$$

### Pure Quaternion Product

$$
\begin{aligned}
    q_aq_b &= [0, \textbf{a}][0, \textbf{b}] \\
    &= [- \textbf{a} \cdot \textbf{b}, \textbf{a} \times \textbf{b}]
\end{aligned}
$$

Proof:

![picture 1](/Blog/images/2022-04-13-13-21-56-pure-quaternion-product-1.jpg)  

![picture 2](/Blog/images/2022-04-13-13-24-12-pure-quaternion-product-2.jpg)  
