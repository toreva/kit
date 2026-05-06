# Open Perps Position

Execute a perpetual futures position using `@toreva/sdk`.

This example uses the Gateway MCP field contract:

- `walletAddress` for the human/root wallet
- `token` for the perps market token
- `sizeUsd` for position notional
- `collateralToken` and `collateralAmount` for collateral

Omit `venue` to let Toreva route by estimated all-in cost. Set `venue` only
when the user or policy explicitly chooses a venue.
