---
layout: post
title: Notes - SPGrid - A Sparse Paged Grid structure applied to adaptive smoke simulation
category: high-performance-computing
---

## Original Paper

[SPGrid: A Sparse Paged Grid structure applied to adaptive smoke simulation](https://dl.acm.org/doi/10.1145/2661229.2661269)

## Introduction and Related Works

In fluid simulations, sparse data structures are widely used for spatial adaptations.
Previous solutions include CSR grids, oct-trees, and [H-RLE level set](https://doi.org/10.1145/1122501.1122508).
Some more recent studies also used [OpenVDB](https://dl.acm.org/doi/10.1145/2487228.2487235), a B+ tree-like data structure.

Methods such as SCR grids and oct-trees may suffer from low cache hit rates and, therefore, experience lower computational bandwidth than the theoretical one.

SPGrid also stores sparse data with a minimal memory footprint while maintaining a relatively high memory throughput for both sequential and stencil access.
The most important contribution to this work is the hardware acceleration for sparse uniform grids. Each geometric block occupies one memory page. Therefore, the accessed blocks can be cached in TLB.

SPGrid can be compared with another sparse data structure: OpenVDB. According to the authors, “Both SPGrid and VDB seek to accelerate sequential and stencil access. SPGrid places an even higher emphasis on optimizing throughput, especially in a multithreaded setting, to levels directly comparable with dense uniform grids.”
This shows that the hardware TLB cache may be faster than the software caches OpenVDB uses regarding memory throughput.

The comparison between SPGrid and OpenVDB is shown in Table 1.

![Table 1](/images/2024-01-20-22-52-11.png)

For SPGrid, the maximum grid size is limited. However, 16Kx32Kx32K resolution should far exceed normal sparse computation requirements. Moreover, similar to OpenVDB, a hash map of SPGrids may be used to support a larger sparse structure.

## SPGrid Implementation Details

The two most essential access patterns of SPGrid are sequential access and stencil access. As mentioned in the paper, truly random sparse grid access is uncommon. Therefore, this paper mainly aims to solve two aforementioned access patterns.

The basic building block for SPGrid is a geometric block, which takes 4KB in general. Data are stored in lexicographical order inside each geometric block.

The geometric blocks are traversed using the Morton curve. According to the paper, this ensures that geometrically proximate blocks will be stored in nearby memory blocks with high probability.

<img width="572" alt="image" src="https://github.com/fangjunzhou/fangjunzhou.github.io/assets/79500078/390e2b48-539a-4f1e-b3e9-6a9f348f7f5e">

To allocate the entire virtual grid, the author used the `mmap` API. The theoretical virtual memory limit is 128TB per process, as the paper mentions. This comes from the x86 architectural limit with a 4-level page table. However, with a 5-level page table, it's possible to reach up to 64PB virtual address space.

A detailed architectural memory layout can be found [here](https://www.kernel.org/doc/Documentation/x86/x86_64/mm.txt).
