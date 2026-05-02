import { getMcpUrl, writeConfig } from '../config.js';

export interface LoginResult {
  authToken: string;
  mcpUrl: string;
  configPath: string;
  issuedAt: string;
}

export interface LoginDeps {
  /** Override fetch for tests / different runtimes. */
  fetch?: typeof fetch;
  /** Output sink — used for the device-code prompt; replaced in tests. */
  log?: (msg: string) => void;
}

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in?: number;
  interval?: number;
}

interface TokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

/**
 * Execute the gateway-equivalent OAuth device-code flow.
 *
 * We call the gateway's /auth/device endpoint to start the flow, present
 * the user-facing code to the user, then poll /auth/token until the user
 * confirms in their browser. The resulting token is written to the local
 * config file (chmod 600) for use by the MCP server stanza and by `toreva
 * doctor`.
 *
 * Until gateway ships the real endpoint shape we treat the response as
 * provisional and only require `access_token` on success — all other
 * fields are optional. Tests inject a mocked fetch.
 */
export async function runLogin(
  deps: LoginDeps = {},
  env: NodeJS.ProcessEnv = process.env
): Promise<LoginResult> {
  const log = deps.log ?? ((m: string) => console.log(m));
  const doFetch = deps.fetch ?? fetch;
  const mcpUrl = getMcpUrl(env);

  // Allow direct token paste for power users / CI.
  if (env.TOREVA_AUTH_TOKEN) {
    const issuedAt = new Date().toISOString();
    const path = writeConfig(
      { mcpUrl, authToken: env.TOREVA_AUTH_TOKEN, issuedAt },
      env
    );
    return { authToken: env.TOREVA_AUTH_TOKEN, mcpUrl, configPath: path, issuedAt };
  }

  // Step 1: device-code request.
  const deviceRes = await doFetch(`${mcpUrl}/auth/device`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client: 'toreva-cli' }),
  });
  if (!deviceRes.ok) {
    throw new Error(`Failed to start device-code flow: ${deviceRes.status} ${deviceRes.statusText}`);
  }
  const device = (await deviceRes.json()) as DeviceCodeResponse;
  if (!device.device_code || !device.user_code || !device.verification_uri) {
    throw new Error('Gateway returned malformed device-code response');
  }

  log(
    `\nVisit ${device.verification_uri}\nEnter code: ${device.user_code}\n\nWaiting for confirmation...`
  );

  // Step 2: poll /auth/token until issued.
  const intervalMs = (device.interval ?? 2) * 1000;
  const expiresMs = (device.expires_in ?? 300) * 1000;
  const deadline = Date.now() + expiresMs;

  while (Date.now() < deadline) {
    const tokenRes = await doFetch(`${mcpUrl}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        device_code: device.device_code,
      }),
    });

    if (tokenRes.status === 200) {
      const json = (await tokenRes.json()) as TokenResponse;
      if (!json.access_token) {
        throw new Error('Gateway returned 200 but no access_token');
      }
      const issuedAt = new Date().toISOString();
      const path = writeConfig(
        { mcpUrl, authToken: json.access_token, issuedAt },
        env
      );
      return { authToken: json.access_token, mcpUrl, configPath: path, issuedAt };
    }

    // 428/400/authorization_pending → keep polling.
    if (tokenRes.status >= 500) {
      throw new Error(`Gateway error ${tokenRes.status} during token poll`);
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error('Login timed out — re-run `toreva login` to try again.');
}
