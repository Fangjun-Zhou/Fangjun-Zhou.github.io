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

The options are passed by flags. 0 means no options are used. If one ore more options are needed, use bit-wise OR operation to select them.

```
WNOHANG
    return immediately if no child has exited.

WUNTRACED
    also return if a child has stopped (but not traced via ptrace(2)). Status for traced children which have stopped is provided even if this option is not specified.

WCONTINUED (since Linux 2.6.10)
    also return if a stopped child has been resumed by delivery of SIGCONT.
```

# Some C++ Shit

## std::string size and length

They are working the same way, both return the number of character in the string.

## std::string split