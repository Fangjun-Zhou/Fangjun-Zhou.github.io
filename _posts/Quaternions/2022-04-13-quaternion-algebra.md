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

$$
\begin{aligned}
    q_aq_b &= [0, \textbf{a}][0, \textbf{b}] \\
    &= (0 + a_xi + a_yj + a_zk)(0 + b_xi + b_yj + b_zk) \\
    &= (0 - a_xb_x - a_yb_y - a_zb_z) + (a_yb_z - a_zb_y)i + \\
    & \qquad (a_xb_z - a_zb_x)j + (a_xb_y - a_yb_x)k
\end{aligned}
$$

Note that in the red part, we first use $a_yjb_zk = a_yb_zi$, and then use $a_zkb_yj = -a_zb_yi$. This gives $(a_yb_z - a_zb_y)i$. The same process also applies to other terms.

Recall that for two vector 
$$
\textbf{a} = <a_x, a_y, a_z>, \textbf{b} = <b_x, b_y, b_z>
$$

The cross product of these two vectors is:

$$
\begin{aligned}
    \textbf{a} \times \textbf{b} &= 
    \begin{vmatrix}
        i & j & k \\
        a_x & a_y & a_z \\
        b_x & b_y & b_z
    \end{vmatrix} \\
    &=
    \begin{vmatrix}
        a_y & a_z \\
        b_y & b_z
    \end{vmatrix} i
    +
    \begin{vmatrix}
        a_x & a_z \\
        b_x & b_z
    \end{vmatrix} j
    +
    \begin{vmatrix}
        a_x & a_y \\
        b_x & b_y
    \end{vmatrix} k \\
    &= (a_yb_z - a_zb_y)i + (a_xb_z - a_zb_x)j + (a_xb_y - a_yb_x)k
\end{aligned}
$$

And the dot product of these two vectors is:

$$
\textbf{a} \cdot \textbf{b} = a_xb_x + a_yb_y + a_zb_z
$$

Thus

$$
\begin{aligned}
    q_aq_b &= 0 - \textbf{a} \cdot \textbf{b} + \textbf{a} \times \textbf{b} \\
    &= [-\textbf{a} \cdot \textbf{b}, \textbf{a} \times \textbf{b}]
\end{aligned}
$$

## Unit Quaternion

A unit quaternion comprises a zero scalar and a **unit vector**.

$$
q = v\hat{\textbf{v}}, \text{where } v = \vert \textbf{v} \vert \text{ and } \vert \hat{\textbf{v}} \vert = 1
$$

## Additive Form of Quaternion

Two quaternions can be represented by two of their components added together.

$$
\begin{aligned}
    q_a &= [s_a, 0] + [0, \textbf{a}] \\
    q_b &= [s_b, 0] + [0, \textbf{b}] \\
    q_aq_b &= ([s_a, 0] + [0, \textbf{a}])([s_b, 0] + [0, \textbf{b}])\\
    &= [s_a, 0][s_b, 0] + [s_a,0][0, \textbf{b}] + [0, \textbf{a}][s_b, 0] + [0, \textbf{a}][0, \textbf{b}]
\end{aligned}
$$

Here, note that $[s_a, 0][s_b, 0]$ is two scalar multiplied together, so $[s_a, 0][s_b, 0] = s_as_b$.

$[s_a,0][0, \textbf{b}]$ is multiplying a quaternion by a scalar, so $[s_a,0][0, \textbf{b}] = [0, s_a \textbf{b}]$. Same rule also applies to $[0, \textbf{a}][s_b, 0]$.

Finally, $[0, \textbf{a}][0, \textbf{b}] = [-\textbf{a} \cdot \textbf{b}, \textbf{a} \times \textbf{b}]$ can be known based on pure quaternion product we deducted above.

Thus,

$$
\begin{aligned}
    q_a &= [s_a, 0] + [0, \textbf{a}] \\
    q_b &= [s_b, 0] + [0, \textbf{b}] \\
    q_aq_b &= ([s_a, 0] + [0, \textbf{a}])([s_b, 0] + [0, \textbf{b}])\\
    &= [s_a, 0][s_b, 0] + [s_a,0][0, \textbf{b}] + [0, \textbf{a}][s_b, 0] + [0, \textbf{a}][0, \textbf{b}] \\
    &= [s_as_b, 0] + [0, s_a\textbf{b}] + [0, s_b\textbf{a}] + [-\textbf{a} \cdot \textbf{b}, \textbf{a} \times \textbf{b}] \\
    &= [s_as_b - \textbf{a} \cdot \textbf{b}, s_a\textbf{b} + s_b\textbf{a} + \textbf{a} \times \textbf{b}]
\end{aligned}
$$

## Binary Form of Quaternion

$$
\begin{aligned}
    a &= [s, \textbf{v}] \\
    &= [s, 0] + [0, \textbf{v}] \\
    &= [s, 0] + v[0, \hat{\textbf{v}}] \\
    &= s + v\hat{q}
\end{aligned}
$$

Here, $\hat{q}$ is the unit quaternion $[0, \hat{\textbf{v}}]$. Unlike $i$ in complex number representation, $\hat{q}$ is not a constant.