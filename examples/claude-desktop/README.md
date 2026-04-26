# Claude Desktop — Toreva MCP

Quick start (one command):

```bash
npx toreva init --client=claude-desktop
npx toreva login
```

Then quit + relaunch Claude Desktop.

## Manual install

If you'd rather edit the config yourself, copy the snippet from
[`claude_desktop_config.json`](./claude_desktop_config.json) into your
Claude Desktop config file:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

If the file already has an `mcpServers` block, merge `toreva` into it
rather than replacing the whole block.

## First-run check

```bash
npx toreva doctor
```

Should report `[ OK ]` for `config_present`, `auth_token`, and
`mcp_call`.

## Override the gateway URL

Set `TOREVA_MCP_URL` before `toreva init` (or edit the `env` block in the
config snippet) to point at a non-prod gateway.
