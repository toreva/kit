#!/usr/bin/env node
import { runPerpsCommand } from './commands/perps.js';
import { runScanCommand } from './commands/scan.js';
import { parseInitArgs, runInit } from './commands/init.js';
import { runLogin } from './commands/login.js';
import { formatReport, runDoctor } from './commands/doctor.js';
import { SUPPORTED_CLIENTS } from './clients.js';

const USAGE = `Usage: toreva <command> [args]

Setup commands:
  toreva init --client=<${SUPPORTED_CLIENTS.join('|')}>
                          Install Toreva MCP connector into a client config
  toreva login            Authenticate via the Toreva gateway (device-code flow)
  toreva doctor           Verify install + token + first MCP call

Power-user commands:
  toreva scan <wallet> [prompt]
  toreva perps <toolName> [jsonPayload]

Environment:
  TOREVA_MCP_URL          Override gateway URL (default: https://mcp.toreva.com)
  TOREVA_AUTH_TOKEN       Skip device-code flow and persist this token directly
  TOREVA_CONFIG_DIR       Override the on-disk config directory
`;

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case undefined:
    case '-h':
    case '--help':
    case 'help': {
      console.log(USAGE);
      return;
    }

    case 'init': {
      const { client } = parseInitArgs(args);
      const res = runInit(client);
      console.log(
        `${res.created ? 'Created' : 'Updated'} ${res.client} config at ${res.configPath}\n` +
          `Registered MCP server "${res.serverKey}" pointing at ${res.mcpUrl}\n` +
          `Next: run \`toreva login\` to issue a token, then restart your MCP client.`
      );
      return;
    }

    case 'login': {
      const res = await runLogin();
      console.log(
        `\nAuthenticated. Token written to ${res.configPath} (issued ${res.issuedAt}).`
      );
      return;
    }

    case 'doctor': {
      const report = await runDoctor();
      console.log(formatReport(report));
      if (!report.ok) process.exit(1);
      return;
    }

    case 'scan': {
      const [wallet = '', prompt = 'scan wallet'] = args;
      await runScanCommand(wallet, prompt);
      return;
    }

    case 'perps': {
      const [toolName = 'toreva_perps_query_markets', payload = '{}'] = args;
      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(payload) as Record<string, unknown>;
      } catch {
        console.error(`Invalid JSON payload: ${payload}`);
        process.exit(1);
      }
      await runPerpsCommand(toolName as never, parsed);
      return;
    }

    default: {
      console.error(`Unknown command: ${command}\n`);
      console.error(USAGE);
      process.exit(1);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
