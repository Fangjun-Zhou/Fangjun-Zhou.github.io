---
layout: post
title: Verlet Integration
category: computer-graphics
---

When doing research on the Verlet Integration method, I came up with several math topics I forgot. The article I read didn't explain everything well enough. So I decided to write this blog to explain how I understand this topic.

[The article I read](https://owlree.blog/posts/simulating-a-rope.html) explained the flaw of Euler Method very well. Simply put, the error of Euler Method is $O(\Delta t)$. With Verlet Integration, we can shrink the error to $O(\Delta t ^ 3)$.

# Taylor Expansion of Position on Time

To start with, basic function describing a moving object with acceleration is provided.

Let $f(x)$ be the position of the object at time $x$

$$
f(t + \Delta t) = f(t) + \int_{t}^{t + \Delta t}f'(x) dx
$$

Here, we have the current position $f(t)$, and we want to predict the position after a small fraction of time $\Delta t$, we can integrate $f'(x)$ from $t$ to $t + \Delta t$. $f'(x)$ is also known as velocity.

For $\int_{t}^{t + \Delta t}f'(x) dx$, we can integrate it by parts. Take $u = f'(x)$ and $dv = dx$, we have $du = f''(x)dx$ and $v = x + C$.

Thus

$$
\int_{t}^{t + \Delta t}f'(x) dt = ((x + C)f'(x)) \vert_{t}^{t + \Delta t} - \int_{t}^{t + \Delta t} (x + C)f''(x) dx
$$

$$
f(t + \Delta t) = f(t) + ((x + C)f'(x)) \vert_{t}^{t + \Delta t} - \int_{t}^{t + \Delta t} (x + C)f''(x) dx
$$

Since we can pick any constant for $C$, and the integral is respect to x, we can pick $-(t + \Delta t)$ for C. **(Notice that $-t$ is a constant here)**

$$
f(t + \Delta t) = f(t) + ((x - (t + \Delta t))f'(x)) \vert_{t}^{t + \Delta t} - \int_{t}^{t + \Delta t} (x - (t + \Delta t))f''(x) dx
$$

Observe $((x - (t + \Delta t))f'(x)) \vert_{t}^{t + \Delta t}$, we can find that $(x - (t + \Delta t))f'(x) = 0$ when $x = t + \Delta t$.

So

$$
\begin{aligned}
    ((x - (t + \Delta t))f'(x)) \vert_{t}^{t + \Delta t} &= 0 - ((t - (t + \Delta t))f'(t)) \\
    &= 0 - (- \Delta t f'(t)) \\
    &= \Delta t f'(t)
\end{aligned}
$$

Now

$$
f(t + \Delta t) = f(t) + \Delta t f'(t) - \int_{t}^{t + \Delta t} (x + C)f''(x) dx
$$

We can keep integrate the last term by parts, and we get the Taylor Expansion of $f(t + \Delta t)$ on $t$:

$$
\begin{aligned}
    f(t + \Delta t) &= f(t) + \Delta t \frac{f'(t)}{1!} + \Delta t^2 \frac{f''(t)}{2!} + \cdots \\
    & = \sum_{n=0}^{\infty}\frac{\Delta t^n f^{(n)}(t)}{n!}
\end{aligned}
$$

[Here](https://math.stackexchange.com/questions/1750344/almost-taylors-theorem-proof-through-integration-by-parts) is the proof of Taylor's Theorem using integrate by part. Excellent answer if you forget everything you learned in your calculus class.

# Verlet Integration Method

Given the Taylor expansion of position on time, we have:

$$
f(t + \Delta t) = f(t) + \Delta t \frac{f'(t)}{1!} + \Delta t^2 \frac{f''(t)}{2!} + \Delta t^3 \frac{f^{(3)}(t)}{3!} + \cdots
$$

If we drop all the terms after $\Delta t^3 \frac{f^{(3)}(t)}{3!}$, we have

$$
f(t + \Delta t) \approx f(t) + \Delta t \frac{f'(t)}{1!} + \Delta t^2 \frac{f''(t)}{2!}
$$

with error of $O(\Delta t^3)$

But here, we need to know both $f'(t)$ and $f''(t)$, which is the velocity and acceleration in the context.

However, consider

$$
f(t - \Delta t) \approx f(t) - \Delta t \frac{f'(t)}{1!} + \Delta t^2 \frac{f''(t)}{2!}
$$

We have

$$
f(t - \Delta t) + f(t + \Delta t) \approx  2f(t) + 2\Delta t^2 \frac{f''(t)}{2!}
$$

Thus

$$
f(t + \Delta t) \approx  2f(t) - f(t - \Delta t) + 2\Delta t^2 \frac{f''(t)}{2!}
$$

Here, $f(t)$ is current position, $f(t - \Delta t)$ is the position in last frame.
