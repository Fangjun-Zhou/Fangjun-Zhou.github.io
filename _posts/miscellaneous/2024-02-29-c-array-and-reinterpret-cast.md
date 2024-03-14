---
layout: post
title: C Array and reinterpret_cast
category: miscellaneous
---

In order to convert the heap allocated continuous array to multidimensional array, we used a lot of `reinterpret_cask` in CS 639. The basic concept behind `reinterpret_cast` is simple, but there are some weird behaviors related to this feature when it comes to array reinterpretation.

## What is C Array?

To understand how `reinterpret_cast` works to convert arbitrary memory chunk into array reference, we first need to know what C style array is.

All the example arrays I use in this post will be `int[4]`. So I define this helper method to visualize the array:

```c++
void printIntArray(int (&a)[4]) {
  std::cout << "[";
  for (size_t i = 0; i < 3; i++) {
    std::cout << a[i] << ", ";
  }
  std::cout << a[3];
  std::cout << "]";
  std::cout << std::endl;
}
```

We can now define an array and visualize its content:

```c++
int a[4] = {32, 64, 128, 256};
printIntArray(a);
// [32, 64, 128, 256]
```

`a` is now an **int array** of length 4. This is important, because the fact that `a` can be converted to an int pointer makes people tend to treat `a` as a pointer when it's not.

OK, but what really is `a`? When we print `a` to the console, it's still a 64-bit address. And just like I discussed before, `a` can be converted to an int pointer.

```c++
std::cout << a << std::endl;
// 0x7ff7b88bf920
int *aPtr = a;
std::cout << aPtr << std::endl;
// 0x7ff7b88bf920
```

I know `a` really looks like a pointer, but also notice: The address of `a` is the same as `a`.

```c++
std::cout << &a << std::endl;
// 0x7ff7b88bf920
```

Pointers don't do that! If `a` is really a pointer, **`0x7ff7b88bf920` should be the value `a` stores, not the address of `a`**.

I use this fact to help me remember that **`a` is not a pointer**, **`a` is an array start at the address it points at**. In this case, `a` is the entire chunk of memory start at `0x7ff7b88bf920` and end at `0x7ff7b88bf920 + 4*4 bytes`.

The reason you can still assign the value of `a` directly to a pointer is just for convenience. You may imagine that the underlying copy constructor from array to pointer may be overridden to copy the address of the array.

This is where I think C/C++ is kinda broken and there are some special case you have to remember because of the design issue.

If I'm the designer of C++, I may make array more struct-like. For example, instead of printing the address of the array, I may print all the values of the array when you call things like `std::cout << a << std::endl;`. Because `a` **does not store the address, IT REALLY STORES THE VALUES LINEARLY!**

I may also make expressions like `int *aPtr = a;` illegal and make the only way to access the address the array `int *aPtr = &a;`. But this is just my understanding of what array should be.

## Reference, a Powerful C++ Feature

In C++, developers are allowed to access an object by its reference. Unlike pointers, you don't need to store the address of the object or dereference when using it. It's more like the object reference used by modern object-oriented languages such as Java and C#.

To reference an array, we use

```c++
int(&b)[4] = a;
printIntArray(b);
// [32, 64, 128, 256]
```

Because `b` is just an array reference to `a`, the address of `b` is the same as the address of `a`.

```c++
std::cout << b << std::endl;
// Equivalent to std::cout << &b << std::endl;
// 0x7ff7b88bf920
```

In fact, people use array references a lot when passing the array to functions. I've used it in the array print helper function above.

### Mess Up With the Array

We can reference the entire array, what about a specific entry of it?

```c++
int &c = a[0];
std::cout << c << std::endl;
// 32
```

Totally possible!

And to prove that c is **a reference to the first entry of array `a`**, we can also copy check the address of the int reference `c`.

```c++
std::cout << &c << std::endl;
// 0x7ff7b88bf920
```

It's the same address as `a`, which is the start of the array.

If you assign the value of this entry to an int instead of int reference, it should copy the value to another address.

```c++
int d = a[0];
std::cout << d << std::endl;
// 32
std::cout << &d << std::endl;
// 0x7ff7b41b190c
```

## `reinterpret_cast`, another Powerful C++ Feature

All the things `reinterpret_cast` do is just take a variable, and treat it as another type. It's done in compile-time, and there's no conversion happening.

The [example in cppreference](https://en.cppreference.com/w/cpp/language/reinterpret_cast) explained this concept very well.

```c++
union U { int a; double b; } u = {0};
int* p3 = reinterpret_cast<int*>(&u);       // value of p3 is "pointer to u.a":
                                            // u.a and u are pointer-interconvertible
 
double* p4 = reinterpret_cast<double*>(p3); // value of p4 is "pointer to u.b": u.a and
                                            // u.b are pointer-interconvertible because
                                            // both are pointer-interconvertible with u
```

In C++, unions can store different types of data in one memory location. When access the union fields, **different reinterpretation of the data is used based on the field you access**. This can be useful when you want to store several flags in the same object. Or you can also define quick access of an array entry. `reinterpret_cast` does the same thing here. It takes the address of u and treats it as the address of another type (int or double here).

## Reinterpreting to Array Reference: Value, or Value Pointer?

Things will become tricky when the two powerful features are used together.

Because you always see the address of the array when printing it to the console, you may naturally think you should reinterpret the address to an array reference, right?

Wrong! Just like I mentioned previously, despite the fact that the address is displayed when calling `std::cout << a << std::endl;`, `a` is **not a pointer**. Remember, `a` is the entire chunk of memory start at `0x7ff7b88bf920` and end at `0x7ff7b88bf920 + 4*4 bytes`. Similarly, when you want to reinterpret something to an array reference, this "something" should be the value **INSTEAD OF** the address of the value you want to reinterpret.

For example, we can reinterpret the **int reference** `c` to an array reference of size 4. Because from the compiler's perspective, `c` is just an integer starting from `0x7ff7b88bf920` and takes 4 bytes. Reinterpreting this integer to an int array reference will just make the reference `e` an array (reference) from `0x7ff7b88bf920` to `0x7ff7b88bf920 + 4*4 bytes`.

```c++
int(&e)[4] = reinterpret_cast<int(&)[4]>(c);
printIntArray(e);
// [32, 64, 128, 256]
```

Similarly, you can also do

```c++
int(&e)[4] = reinterpret_cast<int(&)[4]>(a[0]);
printIntArray(e);
// [32, 64, 128, 256]
```

or

```c++
int(&e)[4] = reinterpret_cast<int(&)[4]>(*a);
printIntArray(e);
// [32, 64, 128, 256]
```

But, if you want to reinterpret cast `d` to an int array reference of size 4, it won't work.

```c++
// Reinterpret stack allocated int d will result in undetermined behavior;
// int(&f)[4] = reinterpret_cast<int(&)[4]>(d);
// printIntArray(d);
```

This is because `d` is an int copied from `a[0]` if you remember what we did just now. So `d` only takes 4 bytes when we declared it. Reinterpreting it to an int array reference longer than 1 and access it will just read garbage on the stack or even trigger segmentation fault.

## Reinterpreting to Another Dimension

Just like I mentioned, reinterpret cast works as long as the size of memory chunk matches (in order to avoid segmentation fault). So it's totally possible to reinterpret cast the int array of size 4 to a 2x2 2d array.

```c++
int(&g)[2][2] = reinterpret_cast<int(&)[2][2]>(a[0]);
// printIntArray2 here is just a debug function to print the 2d array. It's similar to printIntArray above.
printIntArray2(g);
// [
// 32, 64
// 128, 256
// ]
```

If you follow our lecture demos closely, you may found that this is just the reinterpret cast expressions we used in class!
