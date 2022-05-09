---
layout: post
title: Dong Shell Notes 20220503
category: dong-shell
---

# POSIX API

## waitpid(pid_t pid, int *stat_loc, int options);

`waitpid` takes three arguments.

### pid

The first one is the PID to wait (of course).

### stat_loc

The second one is a ptr to PID status. `waitpid` will keep updating the status in the ptr. If no status is needed, a NULL pointer should be passed in.

> If status is not NULL, wait() and waitpid() store status information in the int to which it points.

There are macros to check the status code.

```
WIFEXITED(status)
    returns true if the child terminated normally, that is, by calling exit(3) or _exit(2), or by returning from main().
WEXITSTATUS(status)
    returns the exit status of the child. This consists of the least significant 8 bits of the status argument that the child specified in a call to exit(3) or _exit(2) or as the argument for a return statement in main(). This macro should only be employed if WIFEXITED returned true.
WIFSIGNALED(status)
    returns true if the child process was terminated by a signal.
WTERMSIG(status)
    returns the number of the signal that caused the child process to terminate. This macro should only be employed if WIFSIGNALED returned true.
WCOREDUMP(status)
    returns true if the child produced a core dump. This macro should only be employed if WIFSIGNALED returned true. This macro is not specified in POSIX.1-2001 and is not available on some UNIX implementations (e.g., AIX, SunOS). Only use this enclosed in #ifdef WCOREDUMP ... #endif.
WIFSTOPPED(status)
    returns true if the child process was stopped by delivery of a signal; this is only possible if the call was done using WUNTRACED or when the child is being traced (see ptrace(2)).
WSTOPSIG(status)
    returns the number of the signal which caused the child to stop. This macro should only be employed if WIFSTOPPED returned true.
WIFCONTINUED(status)
    (since Linux 2.6.10) returns true if the child process was resumed by delivery of SIGCONT.
```

### options

The options are passed by flags. 0 means no options are used. If one or more options are needed, use bit-wise OR operation to select them.

```
WNOHANG
    return immediately if no child has exited.

WUNTRACED
    also return if a child has stopped (but not traced via ptrace(2)). Status for traced children which have stopped is provided even if this option is not specified.

WCONTINUED (since Linux 2.6.10)
    also return if a stopped child has been resumed by delivery of SIGCONT.
```

## execv(const char *path, char *const argv[]);

After `fork` the child process should call `execv` to start loading and executing the target program. But the arguments of `execv` are a little bit tricky.

Another blog of mine *C & C++ Constant Pointers* covered the difference between `const char *`, `char const *`, `char *const`, and `char *const *`. I will not cover it here.

The first one is the path of executable. The second one is all the arguments passed in.

Note that **there is no argc for the argument count**. So how can execv know how many arguments are there? It turns out developers **need to place a NULL pointer at the end of array**. This is important, or it will lead to undetermined behavior. If NULL pointers are not set correctly, it is always the case that the first `execv` call will succeed and the following call may fail because the recycled stack leaves some garbage data in the memory.

An example of calling `execv` looks like this:

If you use `/bin/ls -la` in regular shell, you should pass these parameters to execv:

```c++
std::string path = "/bin/ls";
char *const argv[] = {"/bin/ls", "-la", NULL};
execv(path.c_str(), argv);
```

# Some C++ Shit

## std::string size and length

They are working the same way, both return the number of characters in the string.

## std::string split

In `CommandHandler` namespace, there is a `CommandHandler::SplitCommand` function that takes a string command and split it by space or tabs.

To do so, I used three major functions in `std::string`. The first one is `find`, which takes a string and finds its starting position of it.

The second one is `substr`, which takes a start point and length, returning the substring.

The last one is `erase`, which takes a start point and length, wiping all the characters in the range.

```c++
// Split base on delimiters.
while (true)
{
    // Find the smallest delimiter and its position.
    delimiterLoc = std::string::npos;
    for (int i = 0; i < delimiters.size(); i++)
    {
        size_t newVal = command.find(delimiters[i]);
        if (newVal < delimiterLoc)
        {
            delimiter = delimiters[i];
            delimiterLoc = newVal;
        }
    }

    if (delimiterLoc == std::string::npos)
        break;

    token = command.substr(0, delimiterLoc);
    command.erase(0, delimiterLoc + delimiter.length());

    if (token.length() != 0)
    {
        commandList->push_back(token);
    }
}
```

In the while loop, the first thing to do is to find the closest delimiter to the front of the string. Thus, `delimiterLoc` is initialized to `std::string::npos`, which is the largest value of `size_t` [^1].

In this case, finding the smallest possible `delimiterLoc` will give us the location to strip the substring.

---
{: data-content="footnotes"}

[^1]: [cpp reference std::string::npos](https://www.cplusplus.com/reference/string/string/npos/)