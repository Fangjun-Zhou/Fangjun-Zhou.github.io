---
layout: post
title: Dive into ECS 1 - Entities
category: unity-dots
---

# ECS Overview

As many of you may know, entities are a very important part of the ECS Framework. However, I used to learn that entities are created contiguously in the memory. But I had no idea how they are allocated in practice. After some research, I learned some more underlying working principles of ECS.

First, entities are populated by archetypes inside the memory. These archetypes not only describe the feature of entities but also group their data to increase the cache hit rate, which is the ultimate goal of the ECS framework.

Inside archetypes, chucks form the underlying data structure of the archetype. Simply put, chunks are linked list **node** that point to the next chunk and contain contiguous entities data. Note that here I use a linked list node instead of a linked list. This is because the chunk itself uses contiguous memory to store entities data. But chunks are linked for archetype to search.

So why not use an entire array to store all the data inside one archetype? This is also the brightest decision. While entities may be instantiated and destroyed from time to time. Using a long array to manage all the entities may lead to gaps formed by destroyed entities. Using chunks to manage entities gives developers (I mean in Unity) more freedom to manage arrays individually. Which lower cache miss in return. I'll talk about that later.

# Archetype

Let's start with the Archetype. This is the basis of entities classification.

On Entities manual page, Unity mentioned[^1] that

> As you create entities and add components to them, the EntityManager keeps track of the unique combinations of components on the existing entities. Such a unique combination is called an Archetype.
> An EntityArchetype is a unique combination of component types. The EntityManager uses the archetype to group all entities that have the same sets of components.

This may mean that archetypes contain all the entities with a certain combination of components. It also means that every time you add a new component, EntityManager may try to figure out if you create a new component combination or if the entity you created can fall into some existed archetype.

One point I want to mention is that I used to think that one entity can belong to different archetypes. 

For example, if an entity `E1` has components `A`, `B`, and `C`, it may fall into the archetype `[A]`, `[B]`, `[C]`, `[A, B]`, `[A, C]`, `[B, C]`, `[A, B, C]`.

Why I had this idea because I thought if there's another entity `E2` with components `A`, `B`, and `D`, they will both fall into archetype `[A, B]`. It sounds easier to search entities with components `A` and `B` (This is also one of the operations that can only be done efficiently and easily in ECS).

However, it's **completely wrong**!!

In reality, there will only be archetype `[A, B, C]` containing `E1` and archetype `[A, B, D]` containing `E2`.

Then how can ECS perform the search as I mentioned so fast? The answer is simple: the system can find all the archetypes containing **`A` and `B`**, which are archetype `[A, B, C]` and archetype `[A, B, D]` here. Then we only need to loop through all the objects in these archetypes.

This graph[^2] from ECS Manual shows the process I mentioned pretty clear:

![picture 1](/Blog/images/2022-04-08-01-00-33-archetype-foreach.png)  

It's worth mentioning that entities can be created through archetypes. This means the created entities will have a certain combination of components. 

---
{: data-content="Following content needs further research"}

Creating entities through archetypes can be useful in scenarios like enemy spawning. Since all the enemies will have the same components (Health, Movement, Weapon, Navigation for example), spawning with archetype may be faster. Since you don't need to create an entity and add different components to it.

Spawning with archetypes may also avoid creating unnecessary archetypes. This is because unwanted archetypes may be created in the process of adding components.

---

# Creating Entities

Entities can be created in four ways:

- Create an entity with components that use an array of ComponentType objects.
- Create an entity with components that use an EntityArchetype.
- Copy an existing entity, including its current data, with Instantiate
- Create an entity with no components and then add components to it. (You can add components immediately or when additional components are needed.)

# Chunks

The DOTS ECS uses chunks to store entities in each archetype. As I mentioned, this is a brilliant idea. First, we can observe the chunk structure[^3]:

![picture 2](/Blog/images/2022-04-08-01-01-34-chunk-structure.png)  


As we can see, for each archetype, there are several chunks.

---
{: data-content="footnotes"}

[^1]: [Unity Entities Manual](https://docs.unity3d.com/Packages/com.unity.entities@0.50/manual/ecs_entities.html)

[^2]: [ECS Core Introduction](https://docs.unity3d.com/Packages/com.unity.entities@0.50/manual/ecs_core.html)

[^3]: [ECS Core Introduction](https://docs.unity3d.com/Packages/com.unity.entities@0.50/manual/ecs_core.html)