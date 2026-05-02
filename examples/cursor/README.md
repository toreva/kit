# Cursor — Toreva MCP

```bash
npx toreva init --client=cursor
npx toreva login
```

Cursor picks up MCP server changes on the next reload of the agent.

## Manual install

Copy [`mcp.json`](./mcp.json) to `~/.cursor/mcp.json`. Merge the `toreva`
entry into any existing `mcpServers` block rather than replacing the
file.

## Verify

```bash
npx toreva doctor
```
