#!/usr/bin/env node
import { runPerpsCommand } from './commands/perps.js';
import { runScanCommand } from './commands/scan.js';

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);

  if (command === 'scan') {
    const [wallet = '', prompt = 'scan wallet'] = args;
    await runScanCommand(wallet, prompt);
    return;
  }

  if (command === 'perps') {
    const [toolName = 'toreva_perps_query_markets', payload = '{}'] = args;
    await runPerpsCommand(toolName as never, JSON.parse(payload));
    return;
  }

  console.log('Usage: toreva <scan|perps> [args]');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
