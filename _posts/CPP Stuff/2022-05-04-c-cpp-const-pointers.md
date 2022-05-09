---
layout: post
title: C & C++ Constant Pointers
category: cpp
---

Constant pointers in C and C++ can always be confusing.

For example, I'm always messing up `const char *`, `char const *`, `char *const`, `char *const *`, and a lot of similar shit.

# Reading Pointers

Pointers should be read from right to left. And this should never change.

For example, `char *` is a pointer to `char`. `char **` is a pointer to `char *`, which is a pointer to pointer to `char`.

# Two Basic Difference

`const char` declares a `char` variable that cannot be changed. This is easy to understand. Thus, `const char *` means a pointer to `const char`. Notice that the **pointer** is nothing special, but the value it is pointing to cannot be changed. The real `const char` variable can be anywhere. In the stack? In the heap? In the data segment? It doesn't matter. What matters is that **the character value cannot be changed**. When it comes to the pointer to that character, it can be changed freely.

On the opposite side, `char *const` is a **const pointer** to char. Now, nobody cares about the character, the variable that stores the character value can still be anywhere. Moreover, its value can be changed freely now. However, **the pointer cannot be changed** this time.

# More examples

Now, other examples should be clear.

`char *const *` is a pointer to a constant pointer to char. The value of the outer pointer can be changed freely. But the inner pointer it's pointing to cannot be changed. Finally, when it comes to the actual characters, they can still be changed freely.

![picture 1](/Blog/images/2022-05-04-22-58-27-char-const.png)  

Just like the graph shows above, `char *const *` can be used to pass arguments to a new program. `main` function accepts these arguments, and new arguments can also be passed through APIs like `execv`.

# Additional Tips

`char const*` and `const char*` are the same. Just in case some developers have different code styles.