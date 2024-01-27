---
layout: post
title: Cloth Simulation
category: computer-graphics
---

[Here](https://github.com/Fangjun-Zhou/cs559-cloth-simulation) is the cloth simulation project.

You can play around with the simulation [here](https://fangjun-zhou.github.io/cs559-cloth-simulation/dist/)

# Introduction

A few weeks ago, I developed a [2d rope simulation project](/scripts/cs559-assignment-2/homework2.html) for my CG assignment.

However, I had some problems with my simulation at that time. For example, all the ropes seem too bouncy and that is not my expected behavior. Besides, the ropes sometimes become glitchy when the frame rate drops.

This week, I decided to upgrade my cloth simulation project to 3D. At the same time, I want to see if I can solve those old problems.

# Verlet Integration

When researching the Verlet Integration method, I came up with several math topics I forgot. The article I read didn't explain everything well enough. So I decided to write this blog to explain how I understand this topic.

[The article I read](https://owlree.blog/posts/simulating-a-rope.html) explained the flaw of the Euler Method very well. Simply put, the error of the Euler Method is $O(\Delta t)$. With Verlet Integration, we can shrink the error to $O(\Delta t ^ 3)$.

## Taylor Expansion of Position on Time

To start with, a basic function describing a moving object with acceleration is provided.

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

We can keep integrating the last term by parts, and we get the Taylor Expansion of $f(t + \Delta t)$ on $t$:

$$
\begin{aligned}
    f(t + \Delta t) &= f(t) + \Delta t \frac{f'(t)}{1!} + \Delta t^2 \frac{f''(t)}{2!} + \cdots \\
    & = \sum_{n=0}^{\infty}\frac{\Delta t^n f^{(n)}(t)}{n!}
\end{aligned}
$$

[Here](https://math.stackexchange.com/questions/1750344/almost-taylors-theorem-proof-through-integration-by-parts) is the proof of Taylor's Theorem using integrate by part. Excellent answer if you forget everything you learned in your calculus class.

## Verlet Integration Method

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

Here, $f(t)$ is the current position, $f(t - \Delta t)$ is the position in the last frame.

# Constraints Relaxation using the Jakobsen Method

According to this paper[^1], we can use the Jakobsen method to ensure constraints.

One iteration of the Jakobsen method can be described as:

1. Calculate the distance between two points.
2. If it's closer than the constraint requirement, push both away.
3. If it's further than the constraint requirement, pull both together.
4. Go back to step 1.

In each frame, multiple times of the Jakobsen method can be applied for higher accuracy.

Implementation of the Jakobsen method in the White Dwarf Engine can be found [here](https://github.com/Fangjun-Zhou/White-Dwarf/blob/68e289b1716d91c70b4374db67ce778d1643fe7a/src/Core/Physics/Systems/JakobsenConstraintSystem.ts).

To support constraints with static objects, I made some changes to the behavior of a constraint when one of the targets is static.

```ts
if (!targetEntity.hasComponent(ConstraintData)) {
  // If the target constraint have no constraint data.
  // Move current transform.
  const movePos = vec3.sub(
    vec3.create(),
    targetTransform.position.value,
    transform.position.value
  );
  vec3.normalize(movePos, movePos);
  vec3.scale(movePos, movePos, deltaDistance);
  vec3.add(transform.position.value, transform.position.value, movePos);
}
```

Here, I traverse all the constraints in the world. If the target constraint has no `ConstraintData` component. Only the current entity should be moved to fulfill the constraint requirement.

```ts
// Move current transform.
const movePos = vec3.sub(
  vec3.create(),
  targetTransform.position.value,
  transform.position.value
);
vec3.normalize(movePos, movePos);
vec3.scale(movePos, movePos, deltaDistance / 2);
vec3.add(transform.position.value, transform.position.value, movePos);
// Move target transform.
vec3.negate(movePos, movePos);
vec3.add(
  targetTransform.position.value,
  targetTransform.position.value,
  movePos
);
```

Otherwise, if both entities have a `ConstraintData` component, both of them need to be moved.

## Jakobsen Method Iteration

Note that for each frame (or physics frame), the Jakobsen method can be applied more than once. One of Robert Badea's [tweets](https://twitter.com/Owlree/status/1243277777392013316) demonstrates how the Jakobsen method is done.

<video controls width="100%">
    <source src="https://video.twimg.com/tweet_video/EUEChxPWoAEunBc.mp4">
    Download the
    <a href="https://video.twimg.com/tweet_video/EUEChxPWoAEunBc.mp4">MP4</a>
    video.
</video>

Another 1D example posed by Robert Badea is [here](https://video.twimg.com/tweet_video/EUDgL_OXsAATz0Z.mp4).

<video controls width="100%">
    <source src="https://video.twimg.com/tweet_video/EUDgL_OXsAATz0Z.mp4">
    Download the
    <a href="https://video.twimg.com/tweet_video/EUDgL_OXsAATz0Z.mp4">MP4</a>
    video.
</video>

It is obvious that with more iteration, the result will be more accurate.

---

{: data-content="footnotes"}

[^1]: [Advanced Character Physics](https://www.cs.cmu.edu/afs/cs/academic/class/15462-s13/www/lec_slides/Jakobsen.pdf)
