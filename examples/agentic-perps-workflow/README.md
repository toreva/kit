# Agentic Perps Workflow

End-to-end no-secret workflow for an MCP or code agent:

1. Establish a Toreva/Swig master authority and Pacifica child perps capability.
2. Query venues.
3. Simulate.
4. Open a routed long.
5. Query position state.
6. Close the position.

The example never asks for private keys, seed phrases, API secrets, or raw
signer material. Real-funds execution still requires Toreva approval,
configured signer boundaries, venue availability, funding, and policy caps.
