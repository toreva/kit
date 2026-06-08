# `establishWallet`

## Overview

`establishWallet` lets you give Toreva a narrow, constrained delegation to set
up a wallet on your behalf. Nothing is created, linked, or activated until you
explicitly approve — and the delegation is bounded to exactly what you authorise,
no more.

ELI10: Think of it like giving a trusted assistant permission to open a bank
account for you. They can only do that one thing, only at the institution you
approved, and they hand you the keys the moment it is done. You stay in control
the whole time.

---

## What you approve

When you invoke `establishWallet`, Toreva shows you a plain-language approval
screen before anything happens. The screen tells you:

- **What will be created:** the type of wallet and the network it lives on.
- **What Toreva is permitted to do:** the exact bounds of the delegated action —
  nothing broader.
- **What Toreva cannot do:** Toreva does not hold the private keys to your wallet, does not move
  funds on your behalf beyond what you approve, and cannot act outside the
  bounds of your approval.
- **How to revoke:** you can cancel the permission at any time before or after
  the wallet is established.

You confirm with an explicit tap or click. If you do not confirm, nothing
happens.

---

## What happens after approval

1. Toreva performs the establishment within the constrained delegation you approved.
2. You receive a receipt — a verifiable record of what was done, when, and under
   which approval. The receipt does not expire.
3. Your wallet remains in your custody. Toreva does not store, escrow, or have
   ongoing access to the private keys of your wallet.

---

## Receipts and transparency

Every `establishWallet` action produces a receipt. The receipt includes:

- A timestamp for when the approval was granted.
- A timestamp for when the establishment completed.
- The delegation constraint in effect.
- A reference you can use to verify the action independently.

Toreva will not claim an action succeeded without a receipt. If the receipt is
absent, the action did not complete.

---

## Your control

| Action | When available |
|--------|---------------|
| Cancel before approval | Any time before you confirm the approval screen |
| Revoke after approval | Any time — revocation stops Toreva from taking any further action under this constrained delegation |
| View receipt | Any time after establishment completes |
| Verify independently | Any time, using the reference in your receipt |

---

## What Toreva cannot do

- Hold the private keys to your wallet.
- Move funds beyond what you explicitly approved.
- Act after you revoke the permission.
- Establish a wallet on a network or at a venue you did not approve.
- Create a wallet silently — approval is always required.

---

## Error states

If establishment fails, Toreva tells you:

- What failed and why (in plain language, no internal codes).
- Whether the failure is retryable.
- What you need to do, if anything.

No partial state is left silently. If a failure occurs mid-establishment, Toreva
rolls back to the pre-approval state and notifies you.
