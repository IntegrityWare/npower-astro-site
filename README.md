# nPower Software Astro website

This Astro site deploys automatically from GitHub main to Cloudflare Pages at https://www.npowersoftwarenew.com. The existing Cloudflare Worker `npower-astro-site` deploys from the same repository and serves the sandbox store API. The production website is https://www.npowersoftware.com; this integration does not enable production payments.

## Development and checks

Use Node.js 22.13 or newer, `npm ci`, and `npm run dev` for the website. Run `npm run test:store` and `npm run build` before pushing. `npx wrangler deploy --dry-run` checks the Worker bundle. Astro development alone does not run the payment backend.

The store lives at /store/, product options at /buy/viz/, /buy/studio/, and /buy/studio_re/, and the shared cart at /cart/. Buy buttons always use same-origin paths. PUBLIC_STOREFRONT_URL from the former local helper is no longer used.

## Hosted sandbox

Pages Functions proxy /api/store/* to the existing Worker. The Worker stores order state in D1, verifies signed Stripe webhooks against canonical sandbox payments, issues one Cryptolens key per purchased license, and sends the activation email after all payment groups finish. Annual licenses and perpetual licenses with deferred maintenance require separate Stripe payment steps when combined.

The hosted staging deployment has STORE_ENABLED=true and EMAIL_ENABLED=true after encrypted credentials, signed webhooks, and verified Cloudflare email routing were configured. Set both flags to false to suspend sandbox checkout. The sandbox accepts only the configured test Stripe account and customer; all license emails go to gcrocker61@gmail.com. An access code protects purchase and receipt endpoints.

Configure these encrypted Worker secrets through Wrangler or the Cloudflare dashboard; never place values in Git:
- STRIPE_SECRET_KEY: sandbox key for IntegrityWare account acct_1UQGwdJvz9ox51DZ.
- STRIPE_WEBHOOK_SECRET: signing secret for the hosted /api/store/webhook endpoint.
- CRYPTOLENS_TOKENS: JSON mapping template IDs to restricted Create Key From Template tokens.
- SANDBOX_ACCESS_CODE: a random code of at least 20 characters.

Apply schema changes with `npx wrangler d1 migrations apply npower-store-sandbox --remote`.
Register checkout.session.completed, checkout.session.async_payment_succeeded, invoice.paid, invoice.payment_failed, customer.subscription.updated, and customer.subscription.deleted on the hosted webhook. Preserve the disabled legacy Cryptolens subscription webhook to avoid duplicate provisioning.

Email requires the configured sender licenses@npowersoftwarenew.com and verified sandbox recipient. Do not enable checkout before email setup is complete.

## Hosted acceptance result

Verified on 2026-10-14: order 50ef9ac8-4a31-4f2e-97b4-c24933f13aed completed both Stripe sandbox steps ($795 annual node-locked Viz and $1,995 perpetual floating Viz), created exactly two Cryptolens keys automatically, and sent one activation email to the verified Gmail inbox. The $295 maintenance subscription is deferred to 2027-10-14. Receipt access remains tied to the initiating browser; its cart clears when fulfillment completes.

An earlier quantity-three test exercised recovery after Cloudflare rejected the local helper's redirect mode. The hosted issuer now uses manual redirects and rejects non-success responses without forwarding tokens. The fresh acceptance order above needed no manual repair. Quantity-two perpetual floating issuance and one email for the combined order were also verified.

Validation includes 12 automated store tests, the Astro build, the Worker bundle check, and an actual workerd request smoke test without credentials.

## Recovery and current limits

The free-plan hosted sandbox limits checkout to 10 licenses per order. Larger orders need queued fulfillment or a suitable Worker plan before this limit is raised.

D1 claims and Stripe idempotency keys prevent duplicate charges and license issuance during retries. Cryptolens issuance has no idempotency key: uncertain responses are held for manual review, never blindly retried. Email timeouts are also held for review to avoid duplicate delivery. Receipts are restricted to the original browser's sandbox session.

Subscription renewals, cancellation, and maintenance lifecycle events are recorded for manual sandbox review; automatic license extension/revocation is not enabled. This is an initial-purchase test integration, not production commerce. Keep access limited to the authorized sandbox tester; enabling these flags does not make the integration production-ready.

Keep all edited text files in CRLF format. Local .env files, .dev.vars, and .wrangler state are ignored.
