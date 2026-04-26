# OpenClaw — Toreva MCP

```bash
npx toreva init --client=openclaw
npx toreva login
```

Restart OpenClaw after the install completes.

## Manual install

Copy [`mcp.json`](./mcp.json) to `~/.config/openclaw/mcp.json`. If the
file already exists, merge the `toreva` entry into the existing
`mcpServers` block.

## Verify

```bash
npx toreva doctor
```
