---
layout: post
title: The Wronskian
category: numerical-methods-and-differential-equations
---

# The Wronskian

Given an inhomogeneous linear second-order ode:

$$
\ddot{x} + p(t) \dot{x} + q(t)x = 0
$$

Suppose that $x = X_1(t)$ and $x = X_2(t)$ are two solutions to the ode.

According to the principle of superposition, we can write the general solution to the ode as:

$$
x = c_1 X_1(t) + c_2 X_2(t)
$$

To fulfill a given initial condition

$$
x(t_0) = x_0, \quad \dot{x}(t_0) = u_0
$$

We need to solve a system of linear equations:

$$
\begin{aligned}
  c_1 X_1(t_0) + c_2 X_2(t_0) &= x_0 \quad (1)\\
  c_1 \dot{X_1}(t_0) + c_2 \dot{X_2}(t_0) &= u_0 \quad (2)
\end{aligned}
$$

To solve (1) and (2), we need to find the RREF of:

$$
\begin{bmatrix}
  X_1(t_0) & X_2(t_0) & x_0 \\
  \dot{X_1}(t_0) & \dot{X_2}(t_0) & u_0
\end{bmatrix}
$$

Thus, we need to find the inverse of:

$$
\begin{bmatrix}
  X_1(t_0) & X_2(t_0) \\
  \dot{X_1}(t_0) & \dot{X_2}(t_0)
\end{bmatrix}
$$

The inverse of the matrix exist when:

$$
\begin{vmatrix}
  X_1(t_0) & X_2(t_0) \\
  \dot{X_1}(t_0) & \dot{X_2}(t_0)
\end{vmatrix} \ne 0
$$

The Wronskian W is given by:

$$
W =
\begin{vmatrix}
  X_1(t_0) & X_2(t_0) \\
  \dot{X_1}(t_0) & \dot{X_2}(t_0)
\end{vmatrix} = X_1(t_0) \dot{X_2}(t_0) - \dot{X_1}(t_0)X_2(t_0) \ne 0
$$

# Example

![](/images/2023-04-07-15-40-18.png)

$$
\begin{aligned}
  \dot{X_1}(t) &= \alpha e^{\alpha t} \\
  \dot{X_2}(t) &= \beta e^{\beta t} \\
  W &=
  \begin{vmatrix}
  e^{\alpha t} & e^{\beta t} \\
  \alpha e^{\alpha t} & \beta e^{\beta t}
  \end{vmatrix} \\
  &= \beta e^{\alpha t} e^{\beta t} - \alpha e^{\alpha t} e^{\beta t}
\end{aligned}
$$

Thus, $W \ne 0$ when $\alpha \ne \beta$.
