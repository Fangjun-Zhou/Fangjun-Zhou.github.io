---
layout: post
title: Inter-process Communication Using Pipe
category: miscellaneous
---

# Linux Inter-process Communication

The major inter-process communication methods used in Linux are pipe, shared memory, signals, and socket. Shared memory is implemented by system calls in POSIX API, and the related API is changing with kernel updates. Thus, using shared memory as inter-process communication will be less portable. For signals, only a few limited available signal numbers are provided by the kernel, so the use case can also be limited. For many applications, pipes and sockets can be a good option.

# Using Pipe

In POSIX API, pipes are established using `pipe()` function in `unistd.h`. `int pipe(int pipefd[2])` takes an array with a length of 2. After calling `pipe()`, `pipefd` will be filled with two file descriptors which can be used by two separate processes. `pipefd[0]` is the read end of the pipe, `pipefd[1]` is the write end of the pipe.

# Read and Write with Pipe File Descriptors

Since the pipefd contains the file descriptors, we can use `read` and `write` in `unistd.h` to read from a pipe or write to a pipe.

**NOTICE: if the read buffer is empty calling `read` will transfer the current process from RUNNING state to BLOCKED state.** Thus, it is better to start a separate process to read from the buffer.

In DongShell project, clear buffer pipes are created using:

```c++
// Create pipe for clear operation.
int clearPipeFd[2];
clearPipeFdWriteEnd = clearPipeFd + 1;
pipe(clearPipeFd);
```

Then, a thread to read clear commands is created:

```c++
// Start the clear handle thread.
pthread_t clearThread;

ClearCommandArgv argv = {clearPipeFd[0], &display};
pthread_create(&clearThread, NULL, ClearCommandHandle, &argv);
```

Inside `ClearCommandHandle`, the read end of pipe fd is read by `if (read(clearPipeFdReadEnd, &clearBuffer, 1) != 0)`:

```c++
void *ClearCommandHandle(void *argv)
{
    ClearCommandArgv *clearCommandArgv = (ClearCommandArgv *)argv;
    // Get the read end of the pipe, and VerticalDisplay obj.
    int clearPipeFdReadEnd = clearCommandArgv->clearPipeReadFd;
    VerticalDisplay *verticalDisplay = clearCommandArgv->verticalDisplay;

    // Clear pipe buffer.
    int clearBuffer;

    while (true)
    {
        // Check the clear command pipe.
        if (read(clearPipeFdReadEnd, &clearBuffer, 1) != 0)
        {
            verticalDisplay->ClearDisplay();
        }
    }
}
```

When need to write to the pipe fd, the parent process can call `write(clearBufferFd, &clearVal, 1);`.
