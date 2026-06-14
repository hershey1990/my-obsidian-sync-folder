---
title: Terminal
description: Interactive SSH terminal in your browser
---

# Terminal

The built-in terminal provides an interactive SSH session directly in your browser, powered by xterm.js and WebSocket communication.

## Opening a Terminal

1. Go to **Servers > [Server Detail] > Terminal**
2. The panel establishes an SSH connection using the server's PEM key
3. A full terminal session opens in your browser

## Features

- **Full terminal emulation** via xterm.js
- **Copy & paste** from your clipboard
- **Resizable** — the terminal adapts to your browser window
- **Multi-tab sessions** — open terminals to multiple servers simultaneously
- **Session persistence** — the SSH session stays open even if you navigate away (within the same browser session)

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+C` | Interrupt current command |
| `Ctrl+D` | Close session |
| `Ctrl+L` | Clear terminal |
| `Tab` | Command auto-completion |

## How It Works

```
[Browser] ◄── WebSocket ──► [Reverb Server]
                               │
                         [phpseclib]
                               │
                        [SSH Connection]
                               │
                        [Remote Server]
```

- The terminal doesn't execute commands via HTTP API — it uses a persistent WebSocket connection
- Each keystroke is sent over WebSocket to the Reverb server
- The server forwards input to the SSH session and streams output back to the browser
- The SSH connection is maintained as long as the terminal page is open
