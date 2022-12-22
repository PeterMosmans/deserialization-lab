# Exfiltrating Data Using JavaScript Deserialization Attacks

## Introduction

As part of the Dark Kittens group that's attacking Globomantics, it's your turn
to try to get your hands on one of their highly sensitive documents.

You're suspecting that a Globomantics web server contains an insecure
deserialization vulnerability. By carefully crafting an exploit, and setting up
a Dark Kittens exfiltration server, you might succeed in exfiltrating the
`/root/secrets.txt` file from the web server...

After finishing this lab, you will understand how to find and exploit a
"Deserialization of Untrusted Data" vulnerability in Node.js. Furthermore, you
know how to exfiltrate sensitive data, using the "Exfiltration Over Web Service"
technique.

### Lab setup

This lab consists of two servers; a vulnerable Globomantics web server named
`tmo`, and a Dark Kittens web server named `nest`. Furthermore, we will use
several command line tools to make our life as Dark Kitten as easy as possible:
`curl`, as well as the Node.js interactive shell `node`, and `inotifywait`.

### Take Me Out application

`tmo` seems to be a "Take Me Out" web application server: It is a server which
matches dogs with people wanting to take them out. Apparently you can post JSON
objects containing take me out requests to the `/request` endpoint, after which
the server processes the request. This server runs in the Globomantics network,
which you have web access to.

### Exfiltration server

`nest` is a simple HTTP web server which shows you what kind of data is being
posted to it. Servers like this are often used to exfiltrate data using the HTTP
protocol. The server is accessible from the Globomantics network.

## Installation

To help you get started, both of these servers, `tmo` as well as `nest` will be
built and started automatically. This way, you can focus on finding and
exploiting the insecure deserialization vulnerability.

On a Debian Linux distribution (for example Kali), in a root terminal window,
execute the command

```bash
curl https://raw.githubusercontent.com/PeterMosmans/deserialization-lab/main/install.sh | bash
```

This will download the repository containing all required files, install the
necessary tools, and start both servers.

:blue_book: **Note**: Several tools, modules and configuration
settings will be installed "system-wide". The setup script is meant to be
performed on a "lab environment".

Be advised that the terminal remains open: This is by design. Server log
messages from `nest` are shown, which can help you in executing the infiltration
part of the attack.

:blue_book: **Note**: If you want to see what's going on with `tmo`, you can
view its logs using the command `docker logs tmo`. However, usually you're
unable to view the logs of the server that you are attacking.

As you will be using multiple applications (terminals and editors) at the same
time, it makes sense to split up the screen into two parts, and/or use two
desktops.

See for the lab [Lab instructions](Lab_instructions.md)
