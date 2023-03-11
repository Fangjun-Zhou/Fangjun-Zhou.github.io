---
layout: post
title: Linear First-Order Equations
category: differential-equations
---

# Linear First-Order Differential Equations

A linear first-order equation can be written in standard form:

$$
\frac{dy}{dx} + p(x)y = g(x), \quad y(x_0) = y_0
$$

To solve such equations, we need to find a function $\mu = \mu(x)$ to obtain:

$$
\mu(x) (\frac{dy}{dx} + p(x)y) = \mu(x) g(x)
$$

This $\mu$ should satisfy:

$$
\mu(x) (\frac{dy}{dx} + p(x)y) = \frac{d}{dx}(\mu(x) y)
$$

Thus:

$$
\begin{aligned}
    \mu(x) (\frac{dy}{dx} + p(x)y) &= \frac{d}{dx}(\mu(x) y) \\
    \mu \frac{dy}{dx} + \mu py &= \mu \frac{dy}{dx} + \frac{d \mu}{dx} y \\
    \frac{d \mu}{dx} &= p(x) \mu
\end{aligned}
$$

Here, $\frac{d \mu}{dx} = p(x) \mu$ is another separable differential equation that can written in $\frac{1}{\mu} d \mu = p(x) dx$.

Given $y(x_0) = y_0$, we can choose another arbiturary $\mu (x_0) = 1$. Then, solve the differential equation.

$$
\begin{aligned}
    \int_{1}^{\mu} \frac{1}{\mu} d\mu &= \int_{x_0}^{x} p(x) dx \\
    ln(\mu) &= \int_{x_0}^{x} p(x) dx \\
    \mu(x) &= e^{\int_{x_0}^{x} p(x) dx}
\end{aligned}
$$

Since $\mu$ satisfies $\mu(x) (\frac{dy}{dx} + p(x)y) = \frac{d}{dx}(\mu(x) y)$

$$
\begin{aligned}
    \mu(x) (\frac{dy}{dx} + p(x)y) = \frac{d}{dx}(\mu(x) y) &= \mu(x) g(x) \\
    \int_{x_0}^{x} \frac{d}{dx}(\mu(x) y) dx &= \int_{x_0}^{x} \mu(x) g(x) dx \\
\end{aligned}
$$

According to the Fundamental Theorem of Calculus,

$$
\begin{aligned}
    \int_{x_0}^{x} \frac{d}{dx}(\mu(x) y) dx &= (\mu(x)y) \vert_{x_0}^{x} \\
    &= \mu(x) y - \mu(x_0) y_0 = \mu(x) y - y_0 \\
\end{aligned}
$$

Therefore,

$$
\begin{aligned}
    \mu(x) y - y_0 &= \int_{x_0}^{x} \mu(x) g(x) dx \\
    y(x) &= \frac{1}{\mu(x)}(y_0 + (\int_{x_0}^{x} \mu(x) g(x) dx))
\end{aligned}
$$

# Examples

Solve linear ODE: $\frac{dy}{dx} = x - y, y(0) = -1$

Convert to the standard form:

$$
\begin{aligned}
    \frac{dy}{dx} + y &= x, \quad p(x) = 1, g(x) = x \\
    \mu(x) = e^{\int_{0}^{x} 1 dx} &= e^x \\
    y(x) &= e^{-x} (-1 + \int_{0}^{x} (e^x x)dx)
\end{aligned}
$$

Integrate $\int_{0}^{x} (e^x x)dx$ by parts:

$$
\begin{aligned}
    \int_{0}^{x} & (e^x x)dx \\
    u = x &\quad dv = e^x dx \\
    du = dx &\quad v = e^x \\
    \int_{0}^{x} (e^x x)dx &= (xe^x) \vert_{0}^{x} + \int_{0}^{x}e^x dx
\end{aligned}
$$

Thus,

$$
\begin{aligned}
    y(x) &= e^{-x} (-1 + \int_{0}^{x} (e^x x)dx) \\
    &= e^{-x} (-1 + (xe^x) \vert_{0}^{x} + \int_{0}^{x}e^x dx) \\
    &= e^{-x} (-1 + xe^x - e^x + 1) \\
    &= x - 1
\end{aligned}
$$
