import { STAKING_RELAY_TYPES, stakingToolSchemas, type StakingToolName, type RelayRequest } from '@toreva/types';

export const stakingToolDefinitions = (Object.keys(stakingToolSchemas) as StakingToolName[]).map((toolName) => ({
  name: toolName,
  relayType: STAKING_RELAY_TYPES[toolName],
  inputSchema: stakingToolSchemas[toolName]
}));

export function toStakingRelayRequest(toolName: StakingToolName, payload: unknown): RelayRequest {
  return {
    type: STAKING_RELAY_TYPES[toolName],
    toolName,
    payload
  };
}
